import os
import subprocess
import re
import sys

def find_ts_files(root_dir):
    ts_files = []
    # Directories to ignore
    ignored_dirs = {'.git', 'node_modules', '.gemini', 'dist', 'build'}
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Prune ignored directories in-place
        dirnames[:] = [d for d in dirnames if d not in ignored_dirs]
        
        for filename in filenames:
            if filename.endswith('.ts') or filename.endswith('.tsx'):
                # Avoid converting the script itself if it ends in .ts (unlikely)
                if filename == 'convert_ts_to_js.py':
                    continue
                ts_files.append(os.path.join(dirpath, filename))
                
    return ts_files

def convert_file(ts_file):
    # Determine the output file path
    if ts_file.endswith('.tsx'):
        js_file = ts_file[:-3] + 'jsx'
    elif ts_file.endswith('.ts'):
        js_file = ts_file[:-2] + 'js'
    else:
        return None

    print(f"Converting: {ts_file} -> {js_file}")
    
    # Run detype via npx
    # Using shell=True on Windows to resolve npx correctly
    cmd = f'npx -y detype "{ts_file}" "{js_file}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"  Successfully converted {ts_file}")
        # Delete original TS file
        try:
            os.remove(ts_file)
            print(f"  Deleted original {ts_file}")
            return js_file
        except OSError as e:
            print(f"  Error deleting original file: {e}")
            return js_file
    else:
        print(f"  Failed to convert {ts_file}")
        print(f"  Error: {result.stderr.strip() or result.stdout.strip()}")
        return None

def update_imports_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # Fallback to other encoding if utf-8 fails
        with open(file_path, 'r', encoding='latin-1') as f:
            content = f.read()

    # Regex patterns to update TS/TSX extensions in imports/exports to JS/JSX
    # 1. Standard import/export statements: import ... from './file.tsx'
    import_pattern = r'(import\s+(?:.*?from\s+)?[\'"])(.*?)\.ts(x?)([\'"])'
    export_pattern = r'(export\s+(?:.*?from\s+)?[\'"])(.*?)\.ts(x?)([\'"])'
    dynamic_import_pattern = r'(import\s*\(\s*[\'"])(.*?)\.ts(x?)([\'"]\s*\))'

    def repl(match):
        prefix = match.group(1)
        path = match.group(2)
        has_x = match.group(3)
        suffix = match.group(4)
        new_ext = '.jsx' if has_x else '.js'
        return f"{prefix}{path}{new_ext}{suffix}"

    new_content = re.sub(import_pattern, repl, content)
    new_content = re.sub(export_pattern, repl, new_content)
    new_content = re.sub(dynamic_import_pattern, repl, new_content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  Updated imports in {file_path}")

def update_index_html(root_dir):
    index_path = os.path.join(root_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace main.tsx with main.jsx in index.html script tag
        new_content = content.replace('/src/main.tsx', '/src/main.jsx')
        if new_content != content:
            with open(index_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Updated index.html to reference main.jsx")

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Starting TS to JS conversion in: {root_dir}")
    
    # 1. Find all TS/TSX files
    ts_files = find_ts_files(root_dir)
    print(f"Found {len(ts_files)} files to convert.")
    
    # 2. Convert each file
    converted_files = []
    for ts_file in ts_files:
        js_file = convert_file(ts_file)
        if js_file:
            converted_files.append(js_file)
            
    # 3. Update imports in all newly created files
    print("\nUpdating import references in all files...")
    # Scan all js and jsx files recursively to make sure all imports are updated
    all_js_files = []
    ignored_dirs = {'.git', 'node_modules', '.gemini', 'dist', 'build'}
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in ignored_dirs]
        for filename in filenames:
            if filename.endswith('.js') or filename.endswith('.jsx'):
                all_js_files.append(os.path.join(dirpath, filename))
                
    for js_file in all_js_files:
        update_imports_in_file(js_file)
        
    # 4. Update index.html reference
    update_index_html(root_dir)
    
    print("\nConversion complete!")

if __name__ == '__main__':
    main()
