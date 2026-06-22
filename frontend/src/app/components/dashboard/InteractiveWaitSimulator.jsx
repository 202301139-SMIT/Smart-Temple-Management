import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Clock, Calendar, HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function InteractiveWaitSimulator() {
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedDay, setSelectedDay] = useState("Tuesday");

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Generate data based on the day of the week and hour
  const chartData = useMemo(() => {
    // Weekday multipliers: weekends are busier, Tuesday is lowest
    const dayMultipliers = {
      Monday: 1.0,
      Tuesday: 0.7,
      Wednesday: 0.85,
      Thursday: 1.1,
      Friday: 1.3,
      Saturday: 1.7,
      Sunday: 1.5,
    };
    const mult = dayMultipliers[selectedDay] || 1.0;

    return Array.from({ length: 24 }).map((_, hour) => {
      // Base wait time curve (double peaks: 6-10 AM and 4-8 PM)
      let baseWait = 90; // baseline 90 mins
      
      if (hour >= 5 && hour <= 11) {
        // Morning peak
        const diff = Math.abs(hour - 8); // peak at 8 AM
        baseWait += (6 - diff) * 40;
      } else if (hour >= 15 && hour <= 21) {
        // Evening peak
        const diff = Math.abs(hour - 18); // peak at 6 PM
        baseWait += (6 - diff) * 35;
      } else if (hour >= 0 && hour <= 4) {
        // Late night lulls
        baseWait -= (5 - hour) * 12;
      }
      
      const waitTime = Math.max(30, Math.round(baseWait * mult));
      const historicalAverage = Math.max(35, Math.round(baseWait * 0.9));
      
      return {
        hourVal: hour,
        hourLabel: `${hour.toString().padStart(2, "0")}:00`,
        waitTime,
        historicalAverage,
      };
    });
  }, [selectedDay]);

  const selectedData = useMemo(() => {
    return chartData.find((d) => d.hourVal === selectedHour) || chartData[8];
  }, [chartData, selectedHour]);

  // Generate dynamic travel warnings
  const advisory = useMemo(() => {
    const time = selectedData.waitTime;
    const hour = selectedHour;
    
    if (time > 180) {
      return {
        status: "Critical Congestion",
        color: "text-red-700 bg-red-50 border-red-200",
        alertColor: "text-red-600",
        icon: AlertTriangle,
        body: `Extremely heavy crowd levels predicted. If you report at ${hour}:00, expect over ${Math.floor(time / 60)}h ${time % 60}m wait. We recommend shifting your slot to early morning (2 AM - 5 AM).`,
      };
    } else if (time > 100) {
      return {
        status: "Moderate Delay",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        alertColor: "text-amber-600",
        icon: AlertTriangle,
        body: `Moderate crowd levels. Darshan wait is about ${(time / 60).toFixed(1)} hours. Standard queue management is in place. Bring water and light snacks.`,
      };
    } else {
      return {
        status: "Optimal Flow",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        alertColor: "text-emerald-600",
        icon: CheckCircle2,
        body: `Excellent time for entry! Wait time is only ${time} mins. Quick transit through Vaikuntam compartments. Clear weather predicted.`,
      };
    }
  }, [selectedData, selectedHour]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#B8860B]/10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] text-xs font-semibold mb-2 border border-[#B8860B]/15">
            <Clock size={12} />
            <span>Interactive Queue Predictor</span>
          </div>
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            AI Darshan Wait-Time Simulator
          </h3>
          <p className="text-xs text-[#8B6B47]">
            Select your day and arrival time to preview wait times and optimize your trip.
          </p>
        </div>

        {/* Day Selector pills */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#FFF8E7] rounded-xl border border-[#B8860B]/10 w-fit max-w-full overflow-x-auto">
          {weekdays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                selectedDay === day
                  ? "bg-[#B8860B] text-white shadow-sm"
                  : "text-[#8B6B47] hover:text-[#B8860B]"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graph display */}
        <div className="lg:col-span-2 bg-[#FFF8E7]/20 border border-[#B8860B]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="simWaitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B8860B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="simHistGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B4513" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8B4513" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
                <XAxis dataKey="hourLabel" tick={{ fontSize: 10, fill: "#8B6B47" }} />
                <YAxis 
                  tick={{ fontSize: 9, fill: "#8B6B47" }}
                  tickFormatter={(v) => `${(v/60).toFixed(0)}h`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Math.floor(value / 60)}h ${value % 60}m`, 
                    name === "waitTime" ? "Simulated Wait" : "Historical Average"
                  ]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #B8860B30",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="waitTime"
                  stroke="#B8860B"
                  fill="url(#simWaitGrad)"
                  strokeWidth={2.5}
                  name="waitTime"
                />
                <Area
                  type="monotone"
                  dataKey="historicalAverage"
                  stroke="#8B4513"
                  fill="url(#simHistGrad)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  name="historicalAverage"
                />
                <ReferenceLine 
                  x={`${selectedHour.toString().padStart(2, "0")}:00`} 
                  stroke="#8B4513" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-[#8B6B47] border-t border-[#B8860B]/10 pt-3 px-1 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#B8860B] rounded-full inline-block" />
              <span>Simulated Wait Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#8B4513] border border-dashed border-[#8B4513] rounded-full inline-block" />
              <span>Historical Baseline</span>
            </div>
          </div>
        </div>

        {/* Input sliders and stats controls */}
        <div className="flex flex-col justify-between gap-5">
          {/* Output Display box */}
          <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#B8860B]/15 flex flex-col justify-between h-fit">
            <span className="text-[10px] text-[#8B6B47] uppercase font-bold tracking-wider">Estimated Queue Wait</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-cinzel font-bold text-3xl text-[#2C1810]">
                {Math.floor(selectedData.waitTime / 60)}h {selectedData.waitTime % 60}m
              </span>
              <span className="text-xs text-[#8B6B47]">({selectedDay})</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5">
              <Calendar size={12} className="text-[#B8860B]" />
              <span className="text-xs text-[#2C1810] font-medium">Selected Hour: {selectedData.hourLabel}</span>
            </div>
          </div>

          {/* Slider input */}
          <div>
            <div className="flex justify-between items-center mb-1 px-1">
              <span className="text-xs font-semibold text-[#2C1810]">Adjust Arrival Time</span>
              <span className="text-xs font-mono font-bold text-[#B8860B]">{selectedData.hourLabel}</span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
              className="w-full h-2 bg-[#F5EDD8] rounded-lg appearance-none cursor-pointer accent-[#B8860B] border border-[#B8860B]/10"
            />
            <div className="flex justify-between text-[9px] text-[#8B6B47] mt-1 px-1">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>

          {/* AI Travel Advisory Box */}
          <div className={`p-4 rounded-xl border flex gap-3 ${advisory.color}`}>
            <advisory.icon size={16} className={`flex-shrink-0 mt-0.5 ${advisory.alertColor}`} />
            <div>
              <div className="text-xs font-bold">{advisory.status}</div>
              <p className="text-[10px] leading-relaxed mt-1">{advisory.body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
