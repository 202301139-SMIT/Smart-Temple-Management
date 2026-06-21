import { useState, useRef } from "react";

export default function Tilt3DCard({ children, className = "", maxTilt = 12 }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Relative coordinates inside the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates to range [-0.5, 0.5]
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    
    // Calculate rotation angles
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;
    
    setCoords({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const cardStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${coords.x}deg) rotateY(${coords.y}deg) scale3d(1.02, 1.02, 1.02)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: isHovered ? "transform 0.1s ease-out, box-shadow 0.15s ease" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className={`relative overflow-hidden group select-none ${className}`}
    >
      {/* 3D Reflection Glare Layer */}
      {isHovered && (
        <div
          className="absolute pointer-events-none inset-0 opacity-20 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_60%)] transition-opacity duration-300 z-10"
          style={{
            "--x": `${(coords.y / maxTilt + 0.5) * 100}%`,
            "--y": `${(coords.x / -maxTilt + 0.5) * 100}%`,
          }}
        />
      )}
      
      {/* Dynamic 3D depth wrapper */}
      <div className="relative z-0 h-full w-full transform-gpu transition-transform duration-300 [transform-style:preserve-3d] group-hover:[transform:translateZ(20px)]">
        {children}
      </div>
    </div>
  );
}
