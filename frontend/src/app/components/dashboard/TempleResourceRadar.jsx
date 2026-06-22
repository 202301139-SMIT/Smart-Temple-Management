import { useState, useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Activity, ShieldAlert, CloudRain, Shield, Users } from "lucide-react";

export default function TempleResourceRadar() {
  const [activeScenario, setActiveScenario] = useState("normal");

  const scenarios = {
    normal: {
      name: "Normal Operations",
      icon: Shield,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      description: "Standard resource allocation. Crowd levels are within average capacities. Routine rotations in progress.",
      brief: "Security forces are at normal patrol density. Volunteers are stationed at primary transit points. Transportation fleets operating on 15-minute headway schedules.",
      data: [
        { subject: "Security", value: 65, fullMark: 100 },
        { subject: "Volunteers", value: 60, fullMark: 100 },
        { subject: "Sanitation", value: 70, fullMark: 100 },
        { subject: "Transit Bus", value: 55, fullMark: 100 },
        { subject: "Medical Hubs", value: 50, fullMark: 100 },
        { subject: "Prasad (Food)", value: 75, fullMark: 100 },
      ],
    },
    vip: {
      name: "VIP Protocol Active",
      icon: ShieldAlert,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      description: "Special security lanes and clearing protocols deployed for visiting delegates/dignitaries.",
      brief: "Security and Sanitation spiked to maximum levels. Volunteers redirected to VIP routes. General public transit queues temporarily delayed (transit resources shifted).",
      data: [
        { subject: "Security", value: 95, fullMark: 100 },
        { subject: "Volunteers", value: 75, fullMark: 100 },
        { subject: "Sanitation", value: 90, fullMark: 100 },
        { subject: "Transit Bus", value: 45, fullMark: 100 },
        { subject: "Medical Hubs", value: 60, fullMark: 100 },
        { subject: "Prasad (Food)", value: 70, fullMark: 100 },
      ],
    },
    weather: {
      name: "Inclement Weather Protocol",
      icon: CloudRain,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      description: "Precipitation/winds detected on Tirumala Hills. Shift to indoor waiting complexes.",
      brief: "Transit fleets maxed to clear footpaths immediately. Medical teams deployed to key spots. Sanitation reinforced to prevent wet pathway hazards. Outdoor volunteer presence reduced.",
      data: [
        { subject: "Security", value: 60, fullMark: 100 },
        { subject: "Volunteers", value: 40, fullMark: 100 },
        { subject: "Sanitation", value: 85, fullMark: 100 },
        { subject: "Transit Bus", value: 95, fullMark: 100 },
        { subject: "Medical Hubs", value: 85, fullMark: 100 },
        { subject: "Prasad (Food)", value: 80, fullMark: 100 },
      ],
    },
    festive: {
      name: "Festive / Brahmotsavam Surge",
      icon: Users,
      color: "text-red-600 bg-red-50 border-red-200",
      description: "High-density crowd surges during major festivals. Maximum deployment of all TTD facilities.",
      brief: "All resources scaled to near-maximum. 100% volunteer deployment across Vaikuntam and outer rings. Prasad distribution running 24/7. Extra transit fleets activated.",
      data: [
        { subject: "Security", value: 90, fullMark: 100 },
        { subject: "Volunteers", value: 100, fullMark: 100 },
        { subject: "Sanitation", value: 95, fullMark: 100 },
        { subject: "Transit Bus", value: 90, fullMark: 100 },
        { subject: "Medical Hubs", value: 90, fullMark: 100 },
        { subject: "Prasad (Food)", value: 100, fullMark: 100 },
      ],
    },
  };

  const activeData = useMemo(() => {
    return scenarios[activeScenario].data;
  }, [activeScenario]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#B8860B]/10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] text-xs font-semibold mb-2 border border-[#B8860B]/15">
            <Activity size={12} />
            <span>Resource Analytics</span>
          </div>
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            TTD Live Resource Allocation
          </h3>
          <p className="text-xs text-[#8B6B47]">
            Simulate operational scenario adjustments to observe system-wide logistics response.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(scenarios).map((key) => {
            const ScenIcon = scenarios[key].icon;
            return (
              <button
                key={key}
                onClick={() => setActiveScenario(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeScenario === key
                    ? "bg-[#B8860B] border-[#B8860B] text-white shadow-md shadow-[#B8860B]/15"
                    : "bg-white border-[#B8860B]/15 text-[#8B6B47] hover:border-[#B8860B]/30 hover:text-[#B8860B]"
                }`}
              >
                <ScenIcon size={12} />
                <span>{scenarios[key].name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Stack */}
      <div className="flex flex-col gap-5 w-full">
        {/* Radar Chart Panel */}
        <div className="h-[240px] w-full flex items-center justify-center bg-[#FFF8E7]/15 rounded-2xl border border-[#B8860B]/10 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activeData}>
              <PolarGrid stroke="#F5EDD8" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#2C1810", fontWeight: "bold" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "#8B6B47" }} />
              <Radar
                name="Resource Level"
                dataKey="value"
                stroke="#B8860B"
                fill="#B8860B"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Briefing Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl border ${scenarios[activeScenario].color} flex flex-col justify-center`}>
            <h4 className="text-sm font-bold flex items-center gap-1.5 mb-1.5">
              {scenarios[activeScenario].name}
            </h4>
            <p className="text-xs leading-relaxed text-[#5C3A1E]">
              {scenarios[activeScenario].description}
            </p>
          </div>

          <div className="p-4 bg-[#FFF8E7]/40 border border-[#B8860B]/10 rounded-2xl flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-[#8B6B47] tracking-wider block mb-1">
              Operational Directives
            </span>
            <p className="text-xs leading-relaxed text-[#5C3A1E]">
              {scenarios[activeScenario].brief}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
