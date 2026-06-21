import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Info, Users, Clock, HelpCircle, Activity } from "lucide-react";

export default function ServiceSpecificAnalytics() {
  const [activeTab, setActiveTab] = useState("specialEntry");

  const services = {
    specialEntry: {
      name: "Special Entry (₹300)",
      metricName: "Estimated Wait Time",
      unit: "hours",
      description: "Dedicated pre-booked darshan queue. Requires booking weeks in advance.",
      tips: "Morning slots (7 AM - 11 AM) experience a 20% faster clearance rate due to swift shift rotations. Report exactly 15 minutes before slot time.",
      graphData: [
        { time: "06:00", value: 1.5 },
        { time: "08:00", value: 2.2 },
        { time: "10:00", value: 2.8 },
        { time: "12:00", value: 3.5 },
        { time: "14:00", value: 2.0 },
        { time: "16:00", value: 2.4 },
        { time: "18:00", value: 3.1 },
        { time: "20:00", value: 1.8 },
      ],
    },
    freeDarshan: {
      name: "General Darshan (Free)",
      metricName: "Estimated Wait Time",
      unit: "hours",
      description: "Sarvadarsanam (free entry) queue complex holding compartments.",
      tips: "Sarvadarsanam compartments can hold pilgrims up to 24-30 hours during weekends. Obtain an SSD (Slotted Sarva Darshan) barcode token downward in Tirupati city early morning (4:00 AM) to secure a fixed reporting hour and cut waiting lines by 80%.",
      graphData: [
        { time: "Monday", value: 14 },
        { time: "Tuesday", value: 8 },
        { time: "Wednesday", value: 9 },
        { time: "Thursday", value: 12 },
        { time: "Friday", value: 18 },
        { time: "Saturday", value: 26 },
        { time: "Sunday", value: 22 },
      ],
    },
    laddus: {
      name: "Laddu Distribution",
      metricName: "Counter Queue Wait",
      unit: "mins",
      description: "Sweet Prasadam collection counters at the outer temple perimeter.",
      tips: "Laddu counters 1 to 15 have the highest congestion. Walk around to counters 25 to 30 on the back row which usually have 60% shorter queues. Pre-order extra laddus online.",
      graphData: [
        { time: "08:00", value: 15 },
        { time: "10:00", value: 35 },
        { time: "12:00", value: 45 },
        { time: "14:00", value: 50 },
        { time: "16:00", value: 25 },
        { time: "18:00", value: 40 },
        { time: "20:00", value: 15 },
      ],
    },
    accommodation: {
      name: "Room Allotment",
      metricName: "Reception Wait Time",
      unit: "hours",
      description: "TTD accommodation allotment offices at Tirumala (Central Reception Office).",
      tips: "Avoid booking rooms directly at Tirumala. The wait time at the reception counters averages 2-4 hours. We suggest booking private or TTD hotel rooms down-hill in Tirupati city, and using express buses to travel up for darshan.",
      graphData: [
        { time: "06:00", value: 0.5 },
        { time: "08:00", value: 1.8 },
        { time: "10:00", value: 3.2 },
        { time: "12:00", value: 4.0 },
        { time: "14:00", value: 2.5 },
        { time: "16:00", value: 3.5 },
        { time: "18:00", value: 2.0 },
        { time: "20:00", value: 1.2 },
      ],
    },
    transit: {
      name: "Alipiri Transit & Buses",
      metricName: "Vehicle Toll Wait",
      unit: "mins",
      description: "Road transit wait and security checks at Alipiri Gate toll booth.",
      tips: "Peak private vehicle toll delays occur between 6:00 AM and 9:00 AM. Free TTD buses have a dedicated lane at the toll booth and bypass general traffic. Use public transit for quick ascent.",
      graphData: [
        { time: "06:00", value: 10 },
        { time: "08:00", value: 35 },
        { time: "10:00", value: 25 },
        { time: "12:00", value: 15 },
        { time: "14:00", value: 12 },
        { time: "16:00", value: 18 },
        { time: "18:00", value: 30 },
        { time: "20:00", value: 10 },
      ],
    },
  };

  const active = services[activeTab];

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#B8860B]/10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] text-xs font-semibold mb-2 border border-[#B8860B]/15">
            <Activity size={12} />
            <span>Service-Specific Queues</span>
          </div>
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            Service-Specific Access & Wait Analytics
          </h3>
          <p className="text-xs text-[#8B6B47]">
            Select a service tab to check queue delay data and get suggestions for a smooth visit.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-1 p-1 bg-[#FFF8E7] rounded-2xl border border-[#B8860B]/10 w-fit max-w-full overflow-x-auto">
        {Object.keys(services).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === key
                ? "bg-[#B8860B] text-white shadow-md shadow-[#B8860B]/15"
                : "text-[#8B6B47] hover:text-[#B8860B]"
            }`}
          >
            {services[key].name}
          </button>
        ))}
      </div>

      {/* Chart and Suggestion Info Stack */}
      <div className="flex flex-col gap-5 w-full">
        {/* Recharts Panel */}
        <div className="bg-[#FFF8E7]/10 border border-[#B8860B]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={active.graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="serviceWaitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B8860B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#8B6B47" }} />
                <YAxis 
                  tick={{ fontSize: 9, fill: "#8B6B47" }}
                  tickFormatter={(v) => `${v}${active.unit === "hours" ? "h" : "m"}`}
                />
                <Tooltip
                  formatter={(v) => [`${v} ${active.unit}`, active.metricName]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #B8860B30",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#B8860B"
                  fill="url(#serviceWaitGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-[#8B6B47] border-t border-[#B8860B]/10 pt-3 px-1 mt-2 flex items-center justify-between">
            <span>Chart indicates typical delay patterns relative to the {activeTab === "freeDarshan" ? "day of week" : "reporting slot hour"}.</span>
          </div>
        </div>

        {/* Detailed Suggestion Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#B8860B]/15 text-left flex flex-col justify-center">
            <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block mb-0.5">Service Description</span>
            <h4 className="font-cinzel font-bold text-sm text-[#2C1810] mb-1">{active.name}</h4>
            <p className="text-xs text-[#5C3A1E] leading-relaxed">{active.description}</p>
          </div>

          <div className="p-4 bg-[#B8860B]/5 border border-[#B8860B]/15 rounded-2xl flex flex-col justify-center text-left">
            <h5 className="text-xs font-bold text-[#B8860B] flex items-center gap-1 mb-1.5">
              <Info size={12} />
              <span>AI Visit Suggestions</span>
            </h5>
            <p className="text-[11px] text-[#5C3A1E] leading-relaxed">
              {active.tips}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
