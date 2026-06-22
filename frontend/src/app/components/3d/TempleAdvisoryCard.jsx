import { useState } from "react";
import { Sparkles, Calendar, CloudRain, ShieldCheck, Footprints, AlertTriangle } from "lucide-react";
import templeArtwork from "../../../styles/temple_artwork.png";

export default function TempleAdvisoryCard() {
  const [profile, setProfile] = useState("family");

  const advisories = {
    general: {
      title: "Solo / General Pilgrims",
      color: "from-[#B8860B]/15 to-[#8B4513]/5 border-[#B8860B]/25",
      pathAdvice: "Recommend Alipiri Mettu Path (3,550 steps). Starting before 5:00 AM provides shade and comfortable climbing temperatures.",
      darshanAdvice: "Queue lengths are optimal during Tuesday 4:00 AM - 7:00 AM. Avoid reporting on Friday afternoon due to weekend pilgrim influx.",
      weatherAlert: "Mild humidity (80%). Hydration stations are open every 200 steps on the trail.",
      laddus: "Recommend pre-ordering laddus during online registration to bypass queue compartments.",
    },
    family: {
      title: "Family with Infants / Elderly",
      color: "from-[#8B4513]/15 to-transparent border-[#8B4513]/20",
      pathAdvice: "Avoid walking trails. Utilize the TTD free transit buses operating from Tirupati railway station directly to Tirumala hills.",
      darshanAdvice: "Book ₹300 Special Entry Darshan slots. Avoid General Queue compartments (Sarvadarsanam) as waiting times can exceed 18 hours.",
      weatherAlert: "Rainfall warning active (27.5mm forecast). Seek shelter at Vaikuntam-2 holding chambers immediately. Strollers are not permitted in the main line.",
      laddus: "Dedicated senior citizen counters are available at Laddu Counter #10. Quick clearance (~10 mins).",
    },
    senior: {
      title: "Senior Citizens / Special Needs",
      color: "from-[#D4A843]/15 to-[#B8860B]/5 border-[#D4A843]/20",
      pathAdvice: "Dedicated battery vehicle pick-ups are available near all major reception complexes. Free of charge.",
      darshanAdvice: "TTD offers a dedicated free Darshan counter for senior citizens and differently-abled pilgrims twice daily (10:00 AM & 3:00 PM). Ensure Aadhaar is verified.",
      weatherAlert: "Bring light warm wear. Temperature drops to 21°C in the evenings with light showers.",
      laddus: "Support volunteers are stationed at the main exit gates to assist with laddu collection.",
    },
  };

  const active = advisories[profile];

  return (
    <div className="w-full max-w-[380px] bg-gradient-to-b from-[#2C1810] via-[#1E0D07] to-[#0F0502] rounded-3xl p-5 border border-[#D4A843]/30 shadow-2xl flex flex-col justify-between select-none relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_#D4A843_0%,_transparent_60%)]" />

      {/* Temple Artwork Header */}
      <div className="relative rounded-2xl overflow-hidden border border-[#D4A843]/10 h-40 mb-4 bg-black/40 flex items-center justify-center">
        <img
          src={templeArtwork}
          alt="Tirupati Temple Artwork"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F0D07] via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4A843]/30 text-[9px] text-[#D4A843] font-semibold tracking-wider uppercase">
          <Sparkles size={10} className="animate-pulse" />
          <span>AI Advisory Board</span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <h3 className="font-cinzel text-sm font-bold text-white tracking-wide">TTD Visit Advisory Tool</h3>
        <p className="text-[10px] text-[#D4A843] tracking-widest font-semibold uppercase mt-0.5">Custom Live Recommendation</p>
      </div>

      {/* Profile Selector Pills */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-4">
        {Object.keys(advisories).map((k) => (
          <button
            key={k}
            onClick={() => setProfile(k)}
            className={`py-1.5 rounded-lg text-[9px] font-semibold transition-all ${
              profile === k
                ? "bg-[#D4A843] text-[#2C1810] shadow-md font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            {k === "general" ? "General" : k === "family" ? "Family" : "Senior / Sp"}
          </button>
        ))}
      </div>

      {/* Dynamic Advice Contents */}
      <div className="flex-1 space-y-3.5 mb-4 text-left">
        {/* Profile Card Label */}
        <div className={`px-3 py-2 rounded-xl border bg-gradient-to-r text-xs ${active.color}`}>
          <span className="font-bold text-white tracking-wide block mb-0.5">{active.title} Advisory</span>
          <span className="text-[10px] text-[#D4A843] font-medium">Dynamic suggestions loaded successfully.</span>
        </div>

        {/* Path suggestion */}
        <div className="flex gap-2">
          <Footprints size={14} className="text-[#D4A843] flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block">Path Recommendation</span>
            <p className="text-[11px] text-white/80 leading-relaxed mt-0.5">{active.pathAdvice}</p>
          </div>
        </div>

        {/* Queue advice */}
        <div className="flex gap-2">
          <Calendar size={14} className="text-[#D4A843] flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block">Darshan Scheduling</span>
            <p className="text-[11px] text-white/80 leading-relaxed mt-0.5">{active.darshanAdvice}</p>
          </div>
        </div>

        {/* Weather delay indicator */}
        <div className="flex gap-2">
          <CloudRain size={14} className="text-[#D4A843] flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block">Weather & Comfort</span>
            <p className="text-[11px] text-white/80 leading-relaxed mt-0.5">{active.weatherAlert}</p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-[#B8860B]/20 pt-3 flex items-center justify-between text-[9px] text-white/55 mt-auto">
        <div className="flex items-center gap-1">
          <ShieldCheck size={11} className="text-emerald-500" />
          <span>Verified AI Guidance</span>
        </div>
        <div className="flex items-center gap-1 text-[#D4A843] font-medium">
          <AlertTriangle size={9} />
          <span>Not a Ticket Service</span>
        </div>
      </div>
    </div>
  );
}
