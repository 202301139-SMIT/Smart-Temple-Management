filepath = r"d:\VSCODE-PROJECTS\stm-2\Smart-Temple-Management\frontend\src\app\App.jsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "page === \"temple\"" in line or "function Temple" in line or "TempleDashboard" in line:
        print(f"Line {i+1}: {line.strip()}")
