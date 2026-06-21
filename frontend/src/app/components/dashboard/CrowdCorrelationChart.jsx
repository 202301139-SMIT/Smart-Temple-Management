import { useState, useMemo } from "react";
import { ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, BarChart2, CloudRain, HelpCircle, Calendar } from "lucide-react";

// Transcribed October Historical Dataset from the user spreadsheet screenshot
const historicalData = [
  { day: 16, date: "16 Oct", darshans: 63426, rolling_avg: 58666, google_trends: 60, rainfall: 4.7, temp_max: 31.5, humidity: 80, is_festival: false, is_brahmotsavam: false },
  { day: 17, date: "17 Oct", darshans: 56136, rolling_avg: 58666, google_trends: 80, rainfall: 1.0, temp_max: 30.9, humidity: 83, is_festival: false, is_brahmotsavam: false },
  { day: 18, date: "18 Oct", darshans: 62341, rolling_avg: 58666, google_trends: 50, rainfall: 0.4, temp_max: 30.5, humidity: 81, is_festival: false, is_brahmotsavam: false },
  { day: 19, date: "19 Oct", darshans: 71231, rolling_avg: 58666, google_trends: 53, rainfall: 1.1, temp_max: 30.8, humidity: 80, is_festival: false, is_brahmotsavam: true }, // Brahmotsavam peak
  { day: 20, date: "20 Oct", darshans: 72279, rolling_avg: 58666, google_trends: 39, rainfall: 8.8, temp_max: 25.4, humidity: 92, is_festival: false, is_brahmotsavam: true },
  { day: 21, date: "21 Oct", darshans: 57964, rolling_avg: 58666, google_trends: 66, rainfall: 27.5, temp_max: 24.4, humidity: 95, is_festival: false, is_brahmotsavam: false }, // Heavy rain drop
  { day: 22, date: "22 Oct", darshans: 43767, rolling_avg: 58666, google_trends: 60, rainfall: 13.0, temp_max: 24.2, humidity: 93, is_festival: false, is_brahmotsavam: false },
  { day: 23, date: "23 Oct", darshans: 42186, rolling_avg: 58666, google_trends: 52, rainfall: 6.8, temp_max: 26.5, humidity: 89, is_festival: false, is_brahmotsavam: false },
  { day: 24, date: "24 Oct", darshans: 49504, rolling_avg: 57986, google_trends: 92, rainfall: 18.3, temp_max: 28.6, humidity: 89, is_festival: true, is_brahmotsavam: false }, // Festival trend surge
  { day: 25, date: "25 Oct", darshans: 39816, rolling_avg: 57038, google_trends: 85, rainfall: 19.6, temp_max: 29.1, humidity: 88, is_festival: true, is_brahmotsavam: false },
  { day: 26, date: "26 Oct", darshans: 62184, rolling_avg: 54886, google_trends: 59, rainfall: 2.2, temp_max: 30.9, humidity: 84, is_festival: false, is_brahmotsavam: false },
  { day: 27, date: "27 Oct", darshans: 57762, rolling_avg: 54866, google_trends: 35, rainfall: 0.0, temp_max: 30.6, humidity: 77, is_festival: false, is_brahmotsavam: false },
  { day: 28, date: "28 Oct", darshans: 38251, rolling_avg: 53182, google_trends: 63, rainfall: 1.8, temp_max: 30.2, humidity: 84, is_festival: false, is_brahmotsavam: false },
  { day: 29, date: "29 Oct", darshans: 40042, rolling_avg: 48929, google_trends: 64, rainfall: 0.2, temp_max: 30.5, humidity: 80, is_festival: false, is_brahmotsavam: false },
  { day: 30, date: "30 Oct", darshans: 37671, rolling_avg: 46689, google_trends: 64, rainfall: 0.0, temp_max: 29.9, humidity: 80, is_festival: false, is_brahmotsavam: false },
  { day: 31, date: "31 Oct", darshans: 42474, rolling_avg: 45927, google_trends: 55, rainfall: 0.0, temp_max: 30.1, humidity: 79, is_festival: false, is_brahmotsavam: false },
];

export default function CrowdCorrelationChart() {
  const [showDarshans, setShowDarshans] = useState(true);
  const [showRollingAvg, setShowRollingAvg] = useState(true);
  const [showTrends, setShowTrends] = useState(false);
  const [showRainfall, setShowRainfall] = useState(false);

  // Compute stats from data
  const stats = useMemo(() => {
    const total = historicalData.reduce((acc, curr) => acc + curr.darshans, 0);
    const avg = Math.round(total / historicalData.length);
    const peak = Math.max(...historicalData.map(d => d.darshans));
    const totalRain = historicalData.reduce((acc, curr) => acc + curr.rainfall, 0).toFixed(1);
    
    return { avg, peak, totalRain };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#B8860B]/10 flex flex-col gap-6">
      {/* Chart Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] text-xs font-semibold mb-2 border border-[#B8860B]/15">
            <BarChart2 size={12} />
            <span>Multi-Factor Analytics</span>
          </div>
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            Crowd Correlation & Weather Impact
          </h3>
          <p className="text-xs text-[#8B6B47]">
            Historical view of actual daily darshans compared against search trends, weather, and festival events.
          </p>
        </div>

        {/* Interactive Checkbox Filters */}
        <div className="flex flex-wrap gap-3 p-2 bg-[#FFF8E7] rounded-2xl border border-[#B8860B]/15">
          <label className="flex items-center gap-1.5 text-xs text-[#2C1810] font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showDarshans}
              onChange={(e) => setShowDarshans(e.target.checked)}
              className="accent-[#B8860B]"
            />
            <span>Darshans</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-[#2C1810] font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showRollingAvg}
              onChange={(e) => setShowRollingAvg(e.target.checked)}
              className="accent-[#8B4513]"
            />
            <span>Rolling Avg</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-[#2C1810] font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showTrends}
              onChange={(e) => setShowTrends(e.target.checked)}
              className="accent-indigo-600"
            />
            <span>Search Trends</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-[#2C1810] font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showRainfall}
              onChange={(e) => setShowRainfall(e.target.checked)}
              className="accent-blue-500"
            />
            <span>Rainfall</span>
          </label>
        </div>
      </div>

      {/* Grid containing Chart and Insight Summaries */}
      {/* Chart and Insight Summaries Stack */}
      <div className="flex flex-col gap-5 w-full">
        {/* Recharts Block */}
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historicalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="darshanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8860B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#8B6B47" }} />
              
              {/* Left Y Axis for Pilgrim Volume */}
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 9, fill: "#8B6B47" }} 
                tickFormatter={(v) => `${(v/1000).toFixed(0)}K`}
                domain={[30000, 80000]}
              />

              {/* Right Y Axis for Google Trends & Rainfall */}
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 9, fill: "#8B6B47" }} 
                domain={[0, 100]}
              />

              <Tooltip 
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #B8860B30",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />

              {/* Chart Layers based on states */}
              {showDarshans && (
                <Area 
                  type="monotone" 
                  dataKey="darshans" 
                  stroke="#B8860B" 
                  fill="url(#darshanGrad)" 
                  strokeWidth={2}
                  yAxisId="left" 
                  name="Daily Darshans"
                />
              )}

              {showRollingAvg && (
                <Line 
                  type="monotone" 
                  dataKey="rolling_avg" 
                  stroke="#8B4513" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  dot={false}
                  yAxisId="left" 
                  name="Rolling Average"
                />
              )}

              {showTrends && (
                <Line 
                  type="monotone" 
                  dataKey="google_trends" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  yAxisId="right" 
                  name="Google Search Trends"
                />
              )}

              {showRainfall && (
                <Bar 
                  dataKey="rainfall" 
                  fill="#3b82f6" 
                  opacity={0.6}
                  yAxisId="right" 
                  name="Rainfall (mm)"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Quick Stats */}
          <div className="md:col-span-1 grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#FFF8E7] border border-[#B8860B]/10 rounded-2xl flex flex-col justify-center text-center">
              <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block mb-0.5">Daily Avg</span>
              <span className="font-cinzel font-bold text-sm text-[#2C1810]">{stats.avg.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-[#FFF8E7] border border-[#B8860B]/10 rounded-2xl flex flex-col justify-center text-center">
              <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block mb-0.5">Oct Peak</span>
              <span className="font-cinzel font-bold text-sm text-[#2C1810]">{stats.peak.toLocaleString()}</span>
            </div>
          </div>

          {/* AI Briefing on data patterns */}
          <div className="md:col-span-2 p-4 bg-[#FFF8E7]/30 border border-[#B8860B]/10 rounded-2xl flex flex-col justify-center text-left">
            <h4 className="text-xs font-bold text-[#2C1810] flex items-center gap-1 mb-1.5">
              <TrendingUp size={12} className="text-[#B8860B]" />
              <span>AI Data Correlations</span>
            </h4>
            
            <div className="space-y-1.5 text-[10px] text-[#5C3A1E] leading-relaxed">
              <p>
                🌧️ <strong className="text-[#2C1810]">Rainfall Impact:</strong> Heavy rain of <span className="font-bold">27.5mm</span> on Oct 21 dropped darshans to <span className="font-bold">57.9K</span> (down from 72.2K), demonstrating weather discourages transit travel.
              </p>
              <p>
                🎉 <strong className="text-[#2C1810]">Festival Surge:</strong> Google trends spiked to <span className="font-bold">92</span> on Oct 24. Despite 18.3mm rain, festival motivations surged the overall count.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
