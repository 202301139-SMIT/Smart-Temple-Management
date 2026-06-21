import { useState } from "react";
import { Users, Shield, MapPin, Activity, HelpCircle } from "lucide-react";

export default function QueueIsometric3D() {
  const [activeZone, setActiveZone] = useState("vaikuntam");

  const zones = {
    alipiri: {
      name: "Alipiri Checkpoint & Footpath",
      level: "Level 1 (Transit)",
      capacity: "42%",
      wait: "15 min",
      status: "Smooth Flow",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      desc: "Starting point for both footpaths (Alipiri Mettu) and vehicular transport. AI route optimization active.",
      metrics: [
        { label: "Buses Active", value: "45/50" },
        { label: "Pedestrian Speed", value: "3.2 km/h" },
      ],
    },
    vaikuntam: {
      name: "Vaikuntam Queue Complex",
      level: "Level 2 (Holding Compartments)",
      capacity: "72%",
      wait: "45 min",
      status: "Moderate",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
      desc: "Vaikuntam-1 & Vaikuntam-2 holding compartments. Refreshment distribution and automated compartment release active.",
      metrics: [
        { label: "Compartments Open", value: "14/32" },
        { label: "Water/Food Supply", value: "100% capacity" },
      ],
    },
    sanctum: {
      name: "Main Sanctum (Darshan)",
      level: "Level 3 (Darshan Gate)",
      capacity: "88%",
      wait: "12 min",
      status: "Optimal Rate",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      desc: "Main temple inner line. Dynamic flow controllers in place to optimize the final darshan rate.",
      metrics: [
        { label: "Pilgrims/Hour", value: "14,200" },
        { label: "Line Speed", value: "1.5 m/s" },
      ],
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#B8860B]/10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] text-xs font-semibold mb-2 border border-[#B8860B]/15">
            <Activity size={12} />
            <span>Interactive 3D Flow Tracker</span>
          </div>
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            Vaikuntam Queue Complex & Transit Flow
          </h3>
          <p className="text-xs text-[#8B6B47]">
            Select checkpoints on the 3D map to view live compartment capacity, flow status, and transit wait times.
          </p>
        </div>
      </div>

      {/* Simulator Stack */}
      <div className="flex flex-col gap-5 w-full">
        {/* 3D Visualizer Panel */}
        <div className="w-full h-[240px] bg-gradient-to-br from-[#FFF8E7] via-white to-[#F5EDD8]/30 rounded-2xl relative overflow-hidden border border-[#B8860B]/10 flex items-center justify-center">
          {/* Helper Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/80 backdrop-blur-sm border border-[#B8860B]/15 text-[10px] text-[#8B6B47]">
            <HelpCircle size={11} className="text-[#B8860B]" />
            <span>Click checkpoints to view live metrics</span>
          </div>

          {/* Isometric 3D Space */}
          <div 
            className="relative w-[300px] h-[300px] [transform-style:preserve-3d] [transform:rotateX(60deg)_rotateZ(-45deg)_scale3d(0.9,_0.9,_0.9)] flex items-center justify-center"
          >
            {/* Animated Connecting Flow Lines (SVG placed underneath) */}
            <div className="absolute inset-0 [transform-style:preserve-3d] pointer-events-none">
              {/* SVG running lines between zones */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ transform: "translateZ(0px)" }}>
                {/* Path 1: Alipiri to Vaikuntam */}
                <path d="M 80,180 L 150,150" stroke="#B8860B" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.3" />
                {/* Path 2: Vaikuntam to Sanctum */}
                <path d="M 150,150 L 220,100" stroke="#B8860B" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.3" />
              </svg>
              
              {/* Pulsing particles running between zones */}
              <div className="absolute w-2 h-2 rounded-full bg-[#B8860B] shadow-[0_0_8px_#B8860B] animate-[flow1_4s_infinite_linear]" style={{ left: '80px', top: '180px' }} />
              <div className="absolute w-2 h-2 rounded-full bg-[#B8860B] shadow-[0_0_8px_#B8860B] animate-[flow2_4s_infinite_linear]" style={{ left: '150px', top: '150px' }} />
            </div>

            {/* LEVEL 1: Alipiri Checkpoint */}
            <div 
              onClick={() => setActiveZone("alipiri")}
              className={`absolute w-28 h-20 rounded-xl transition-all duration-300 flex flex-col justify-between p-3 cursor-pointer select-none [transform-style:preserve-3d] ${
                activeZone === "alipiri" 
                  ? "bg-[#B8860B] text-white shadow-[0_20px_35px_rgba(184,134,11,0.3)] [transform:translateZ(40px)] border-2 border-[#D4A843]" 
                  : "bg-white text-[#2C1810] shadow-[0_8px_16px_rgba(0,0,0,0.06)] [transform:translateZ(10px)] hover:[transform:translateZ(20px)] border border-[#B8860B]/15"
              }`}
              style={{ left: "30px", top: "150px" }}
            >
              <div className="flex items-center justify-between">
                <MapPin size={14} className={activeZone === "alipiri" ? "text-white" : "text-[#B8860B]"} />
                <span className="text-[8px] font-bold tracking-wider uppercase opacity-85">Lvl 1</span>
              </div>
              <div className="text-[10px] font-bold truncate">Alipiri Transit</div>
              <div className="text-[9px] opacity-75">Wait: 15 min</div>
            </div>

            {/* LEVEL 2: Vaikuntam Complex */}
            <div 
              onClick={() => setActiveZone("vaikuntam")}
              className={`absolute w-32 h-24 rounded-xl transition-all duration-300 flex flex-col justify-between p-3 cursor-pointer select-none [transform-style:preserve-3d] ${
                activeZone === "vaikuntam" 
                  ? "bg-[#B8860B] text-white shadow-[0_20px_35px_rgba(184,134,11,0.3)] [transform:translateZ(60px)] border-2 border-[#D4A843]" 
                  : "bg-white text-[#2C1810] shadow-[0_8px_16px_rgba(0,0,0,0.06)] [transform:translateZ(25px)] hover:[transform:translateZ(35px)] border border-[#B8860B]/15"
              }`}
              style={{ left: "95px", top: "95px" }}
            >
              <div className="flex items-center justify-between">
                <Users size={14} className={activeZone === "vaikuntam" ? "text-white" : "text-[#B8860B]"} />
                <span className="text-[8px] font-bold tracking-wider uppercase opacity-85">Lvl 2</span>
              </div>
              <div className="text-[10px] font-bold truncate">Vaikuntam Complex</div>
              <div className="text-[9px] opacity-75">Wait: 45 min</div>
              <div className="w-full bg-[#FFF8E7]/25 h-1 rounded-full overflow-hidden mt-1.5">
                <div 
                  className={`h-full ${activeZone === "vaikuntam" ? "bg-white" : "bg-[#B8860B]"} transition-all duration-500`}
                  style={{ width: "72%" }}
                />
              </div>
            </div>

            {/* LEVEL 3: Main Sanctum */}
            <div 
              onClick={() => setActiveZone("sanctum")}
              className={`absolute w-28 h-20 rounded-xl transition-all duration-300 flex flex-col justify-between p-3 cursor-pointer select-none [transform-style:preserve-3d] ${
                activeZone === "sanctum" 
                  ? "bg-[#B8860B] text-white shadow-[0_20px_35px_rgba(184,134,11,0.3)] [transform:translateZ(80px)] border-2 border-[#D4A843]" 
                  : "bg-white text-[#2C1810] shadow-[0_8px_16px_rgba(0,0,0,0.06)] [transform:translateZ(40px)] hover:[transform:translateZ(50px)] border border-[#B8860B]/15"
              }`}
              style={{ left: "170px", top: "35px" }}
            >
              <div className="flex items-center justify-between">
                <Shield size={14} className={activeZone === "sanctum" ? "text-white" : "text-[#B8860B]"} />
                <span className="text-[8px] font-bold tracking-wider uppercase opacity-85">Lvl 3</span>
              </div>
              <div className="text-[10px] font-bold truncate">Sanctum Darshan</div>
              <div className="text-[9px] opacity-75">Rate: 14,200/hr</div>
            </div>
          </div>

          {/* CSS Animation styles inline for layout dots */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes flow1 {
              0% { transform: translate3d(0, 0, 10px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translate3d(70px, -30px, 25px); opacity: 0; }
            }
            @keyframes flow2 {
              0% { transform: translate3d(0, 0, 25px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translate3d(70px, -50px, 40px); opacity: 0; }
            }
          `}} />
        </div>

        {/* Detailed Briefing Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#FFF8E7]/35 border border-[#B8860B]/10 rounded-2xl flex flex-col justify-center text-left">
            <span className="text-[9px] uppercase font-bold text-[#8B6B47] tracking-wider block mb-0.5">
              {zones[activeZone].level}
            </span>
            <h4 className="font-cinzel font-bold text-sm text-[#2C1810] mb-2">
              {zones[activeZone].name}
            </h4>
            <div className="flex flex-wrap gap-2 mb-2.5">
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium border ${zones[activeZone].statusColor}`}>
                Status: {zones[activeZone].status}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/15">
                Live Capacity: {zones[activeZone].capacity}
              </span>
            </div>
            <p className="text-xs text-[#5C3A1E] leading-relaxed">
              {zones[activeZone].desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {zones[activeZone].metrics.map((m) => (
              <div key={m.label} className="p-3 rounded-2xl bg-[#FFF8E7] border border-[#B8860B]/10 flex flex-col justify-center text-center">
                <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block mb-0.5 leading-tight">{m.label}</span>
                <span className="font-cinzel font-bold text-xs text-[#2C1810]">{m.value}</span>
              </div>
            ))}
            <div className="col-span-2 p-3 rounded-2xl bg-[#B8860B]/5 border border-[#B8860B]/15 flex flex-col justify-center text-center">
              <span className="text-[9px] text-[#B8860B] uppercase font-bold tracking-wider block mb-0.5 leading-tight">Estimated Zone Hold</span>
              <span className="font-cinzel font-bold text-xs text-[#B8860B]">{zones[activeZone].wait}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
