import React, { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  ShoppingBag,
  Utensils,
  Shield,
  Trash2,
  Droplets,
  Activity,
  Sparkles,
  Clock,
  ArrowRight,
  AlertTriangle,
  HeartPulse,
  Navigation,
  Compass,
  DollarSign,
  Layers,
  Settings,
  Truck,
  Cpu,
} from "lucide-react";

// --- Shared Glassmorphic Cards & Indicators ---
function GlassCard({ children, className = "" }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-[#B8860B]/15 rounded-2xl p-5 shadow-md relative overflow-hidden transition-all duration-300 hover:border-[#B8860B]/35 hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
}

function StatusDot({ status }) {
  const color =
    status === "Critical"
      ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"
      : status === "Warning" || status === "Elevated"
      ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
      : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]";
  return <span className={`w-2.5 h-2.5 rounded-full ${color} animate-pulse`} />;
}

// --- Real TTD Operational Data Arrays ---
const defaultWeeklyTrend = [
  { day: "Mon", devotees: 41200, meals: 123600, laddus: 185400, wait: "2.5h", security: 412, waste: 20600 },
  { day: "Tue", devotees: 38400, meals: 115200, laddus: 172800, wait: "2h", security: 384, waste: 19200 },
  { day: "Wed", devotees: 43600, meals: 130800, laddus: 196200, wait: "2.8h", security: 436, waste: 21800 },
  { day: "Thu", devotees: 48900, meals: 146700, laddus: 220050, wait: "3.5h", security: 489, waste: 24450 },
  { day: "Fri", devotees: 62400, meals: 187200, laddus: 280800, wait: "4.5h", security: 624, waste: 31200 },
  { day: "Sat", devotees: 82000, meals: 246000, laddus: 369000, wait: "6h", security: 820, waste: 41000 },
  { day: "Sun", devotees: 72500, meals: 217500, laddus: 326250, wait: "5.2h", security: 725, waste: 36250 },
];

const yearlyTrend = [
  { month: "Jan", devotees: 1.25, laddus: 6.45, meals: 3.75, revenue: 84.5 },
  { month: "Feb", devotees: 1.02, laddus: 5.25, meals: 3.06, revenue: 68.9 },
  { month: "Mar", devotees: 1.18, laddus: 6.08, meals: 3.54, revenue: 79.8 },
  { month: "Apr", devotees: 1.35, laddus: 6.95, meals: 4.05, revenue: 91.2 },
  { month: "May", devotees: 1.62, laddus: 8.35, meals: 4.86, revenue: 109.5 }, // Peak Summer Influx
  { month: "Jun", devotees: 1.48, laddus: 7.62, meals: 4.44, revenue: 100.1 },
  { month: "Jul", devotees: 1.32, laddus: 6.80, meals: 3.96, revenue: 89.2 },
  { month: "Aug", devotees: 1.28, laddus: 6.60, meals: 3.84, revenue: 86.5 },
  { month: "Sep", devotees: 1.45, laddus: 7.48, meals: 4.35, revenue: 97.9 }, // Brahmotsavam start
  { month: "Oct", devotees: 1.74, laddus: 8.96, meals: 5.22, revenue: 117.5 }, // Peak Festival Month
  { month: "Nov", devotees: 1.21, laddus: 6.23, meals: 3.63, revenue: 81.7 },
  { month: "Dec", devotees: 1.08, laddus: 5.56, meals: 3.24, revenue: 72.9 },
];

const STOCK_THRESHOLDS = {
  besan: 25.0,
  sugar: 30.0,
  ghee: 8000,
  cashews: 5000,
  rice: 20.0,
  vegetables: 5.0,
  oil: 3000,
  dal: 4000,
};

const STOCK_INITIALS = {
  besan: 45.0,
  sugar: 62.0,
  ghee: 12500,
  cashews: 8200,
  rice: 60.0,
  vegetables: 14.5,
  oil: 9200,
  dal: 11500,
};

export default function TempleOperations({
  activeTab,
  forecastDevoteeCount,
  setForecastDevoteeCount,
  stocks,
  setStocks,
}) {
  const tabMapping = {
    temple_overview: "overview",
    temple_laddu: "laddu_ops",
    temple_annadanam: "annadanam_ops",
    temple_security: "security_command",
    temple_facility: "facility_mgmt",
  };
  const activeSubTab = tabMapping[activeTab] || "overview";

  // --- Live Simulation States ---
  const [feedState, setFeedState] = useState("nominal");
  const [selectedCamera, setSelectedCamera] = useState("cam_main_gopuram");
  const [securityPanelTab, setSecurityPanelTab] = useState("rosters");
  const [streamLog, setStreamLog] = useState([
    { source: "Temple Core AI Cam", event: "NOMINAL_FLOW", count: 82, time: "16:54:02" },
    { source: "Alipiri RFID Gate Tracker", event: "VEHICLE_PASS_OK", count: 42, time: "16:54:04" },
    { source: "Ghee Tank Valve IoT Sensor", event: "VALVE_PRESSURE_OK", count: 94, time: "16:54:06" }
  ]);

  // --- TTD Official IoT Telemetry Sources Stream Simulator ---
  useEffect(() => {
    const timer = setInterval(() => {
      const sources = [
        { id: "CCTV_Core_Gopuram", desc: "Temple Core AI Cam", nominal: "NOMINAL_FLOW", alert: "CROWD_CONGESTION" },
        { id: "RFID_Alipiri_Gate", desc: "Alipiri RFID Gate Tracker", nominal: "VEHICLE_PASS_OK", alert: "CHECKPOINT_HOLD" },
        { id: "Potu_Ghee_Sensor", desc: "Ghee Tank Valve IoT Sensor", nominal: "VALVE_PRESSURE_OK", alert: "LOW_STOCK_ALERT" },
        { id: "MTVAC_Dining_Hall_2", desc: "Annaprasadam Turnstile Node", nominal: "PORTION_SERVED", alert: "QUEUE_OVERFLOW" },
        { id: "VQC_Hall_3_Dorm", desc: "Vaikuntam Compartment Sensors", nominal: "COMPARTMENT_NOMINAL", alert: "CAPACITY_WARNING" },
        { id: "Smart_Bin_Facility_04", desc: "Sapthagiri Compactor Node", nominal: "BIN_LEVEL_35%", alert: "OVERFLOW_WARNING" }
      ];
      const selectedSrc = sources[Math.floor(Math.random() * sources.length)];
      const eventName = feedState === "nominal" ? selectedSrc.nominal : selectedSrc.alert;
      const countVal = feedState === "nominal" 
        ? Math.floor(Math.random() * 80) + 10 
        : Math.floor(Math.random() * 300) + 150;
      
      const newEntry = {
        source: selectedSrc.desc,
        event: eventName,
        count: countVal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setStreamLog(prev => [newEntry, ...prev.slice(0, 4)]);
      
      // If alert mode is on, drain stocks slightly faster to simulate live load
      if (feedState === "alert") {
        setStocks(prev => ({
          besan: Math.max(0, +(prev.besan - 0.18).toFixed(2)),
          sugar: Math.max(0, +(prev.sugar - 0.28).toFixed(2)),
          ghee: Math.max(0, prev.ghee - 55),
          cashews: Math.max(0, prev.cashews - 38),
          rice: Math.max(0, +(prev.rice - 0.25).toFixed(2)),
          vegetables: Math.max(0, +(prev.vegetables - 0.18).toFixed(2)),
          oil: Math.max(0, prev.oil - 48),
          dal: Math.max(0, prev.dal - 42)
        }));
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [feedState, setStocks]);

  const cameraDetails = {
    cam_main_gopuram: { title: "CAM-01: Main Gopuram Entrance", count: feedState === "nominal" ? "82 pilgrims/min" : "284 pilgrims/min", status: feedState === "nominal" ? "Optimal flow" : "Congestion threshold exceeded" },
    cam_vqc_hall3: { title: "CAM-02: VQC Compartment Hall 3", count: feedState === "nominal" ? "60% occupied" : "96% occupied", status: feedState === "nominal" ? "Nominal queueing" : "Compartment saturated" },
    cam_mtv_dining: { title: "CAM-03: MTV Dining Hall-2 Entrance", count: feedState === "nominal" ? "42 portions/min" : "120 portions/min", status: feedState === "nominal" ? "Smooth servicing" : "Waiting line queue backup" },
    cam_potu_bay: { title: "CAM-04: Potu Kitchen Loading Bay", count: feedState === "nominal" ? "Stable inventory load" : "High dispatch load", status: feedState === "nominal" ? "Nominal dispatch" : "Potu chefs working double-shifts" }
  };

  const renderCCTVFeed = () => {
    const activeDetails = cameraDetails[selectedCamera] || cameraDetails.cam_main_gopuram;
    return (
      <div className="space-y-3">
        <div className="flex bg-[#FFF8E7] rounded-xl p-1 border border-[#B8860B]/15 text-[10px] font-bold">
          {[
            { id: "cam_main_gopuram", label: "CAM-01 Gopuram" },
            { id: "cam_vqc_hall3", label: "CAM-02 VQC-3" },
            { id: "cam_mtv_dining", label: "CAM-03 MTV Dining" },
            { id: "cam_potu_bay", label: "CAM-04 Potu" }
          ].map((cam) => (
            <button
              key={cam.id}
              onClick={() => setSelectedCamera(cam.id)}
              className={`flex-1 py-1 rounded-md text-center transition-all ${
                selectedCamera === cam.id
                  ? "bg-[#B8860B] text-white font-extrabold"
                  : "text-[#8B6B47] hover:text-[#B8860B]"
              }`}
            >
              {cam.label}
            </button>
          ))}
        </div>
        
        {/* Video Player Frame */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-[#B8860B]/25 flex flex-col justify-between p-3 font-mono text-[9px] text-[#10b981]">
          {/* Surveillance overlay markings */}
          <div className="flex justify-between items-start pointer-events-none">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              REC [LIVE]
            </span>
            <span>{selectedCamera.toUpperCase()}_NODE_SURV</span>
          </div>

          {/* CCTV Camera Content Graphic */}
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 200 110" className="w-full h-full opacity-85">
              <rect x="10" y="10" width="180" height="90" fill="none" stroke="#B8860B" strokeWidth="0.5" strokeDasharray="2 2" />
              <g transform="translate(30, 25)">
                <rect x="0" y="0" width="25" height="50" fill="none" stroke={feedState === "nominal" ? "#10b981" : "#ef4444"} strokeWidth="1" />
                <text x="2" y="-3" fill={feedState === "nominal" ? "#10b981" : "#ef4444"} style={{ fontSize: '6px' }}>PILGRIM_92%</text>
              </g>
              <g transform="translate(65, 30)">
                <rect x="0" y="0" width="20" height="45" fill="none" stroke={feedState === "nominal" ? "#10b981" : "#ef4444"} strokeWidth="1" />
                <text x="2" y="-3" fill={feedState === "nominal" ? "#10b981" : "#ef4444"} style={{ fontSize: '6px' }}>PILGRIM_88%</text>
              </g>
              <g transform="translate(100, 15)">
                <rect x="0" y="0" width="25" height="60" fill="none" stroke={feedState === "nominal" ? "#10b981" : "#ef4444"} strokeWidth="1" />
                <text x="2" y="-3" fill={feedState === "nominal" ? "#10b981" : "#ef4444"} style={{ fontSize: '6px' }}>PILGRIM_95%</text>
              </g>
              {feedState === "alert" && (
                <>
                  <g transform="translate(130, 40)">
                    <rect x="0" y="0" width="18" height="35" fill="none" stroke="#ef4444" strokeWidth="1" />
                    <text x="2" y="-3" fill="#ef4444" style={{ fontSize: '6px' }}>PILGRIM_90%</text>
                  </g>
                  <g transform="translate(155, 35)">
                    <rect x="0" y="0" width="22" height="40" fill="none" stroke="#ef4444" strokeWidth="1" />
                    <text x="2" y="-3" fill="#ef4444" style={{ fontSize: '6px' }}>PILGRIM_85%</text>
                  </g>
                  <text x="50" y="100" fill="#ef4444" style={{ fontSize: '8px', fontWeight: 'bold' }} className="animate-pulse">
                    ⚠️ CRITICAL CONGESTION WARNING
                  </text>
                </>
              )}
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-emerald-900/10 pointer-events-none" />
            <div className="absolute left-0 right-0 h-0.5 bg-emerald-500/25 top-1/3 shadow-[0_0_4px_#10b981] pointer-events-none animate-bounce" />
          </div>

          <div className="flex justify-between items-end border-t border-[#10b981]/20 pt-1 text-[#10b981] font-semibold">
            <span>FPS: 30.00</span>
            <span className="truncate max-w-[150px]">{activeDetails.title}</span>
            <span className={feedState === "nominal" ? "text-emerald-400" : "text-red-400 animate-pulse"}>
              {feedState === "nominal" ? "NOMINAL_STABLE" : "CONGESTION_ALERT"}
            </span>
          </div>
        </div>

        {/* Cam telemetry stats */}
        <div className="bg-[#FFF8E7] p-2 rounded-xl border border-[#B8860B]/10 text-[10px] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#8B6B47]">Traffic Density:</span>
            <span className="font-bold text-[#2C1810]">{activeDetails.count}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8B6B47]">Surveillance Diagnostic:</span>
            <span className={`font-semibold ${feedState === "nominal" ? "text-emerald-600" : "text-red-600"}`}>{activeDetails.status}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLiveTerminal = () => {
    return (
      <GlassCard className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D0] border border-[#B8860B]/15 shadow-md">
        <div className="flex justify-between items-center border-b border-[#B8860B]/10 pb-2 mb-3">
          <span className="text-[10px] font-bold text-[#2C1810] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#B8860B] rounded-full animate-ping" />
            TTD Smart-Infrastructure Live Telemetry Stream
          </span>
          <span className="text-[9px] font-mono text-[#8B6B47] uppercase">Status: Connected</span>
        </div>
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Active Nodes List */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[9px] font-bold text-[#8B6B47] uppercase block mb-1">Active TTD Data Nodes</span>
            {[
              { name: "Alipiri RFID Gate Reader", mode: feedState === "nominal" ? "Normal" : "Queue Lag", status: feedState === "nominal" ? "bg-emerald-500" : "bg-amber-500" },
              { name: "VQC-I & II Turnstiles", mode: feedState === "nominal" ? "Normal" : "High Pressure", status: feedState === "nominal" ? "bg-emerald-500" : "bg-red-500 animate-pulse" },
              { name: "Potu Ghee Silo Valve IoT", mode: feedState === "nominal" ? "Stable" : "Rapid Drain", status: feedState === "nominal" ? "bg-emerald-500" : "bg-red-500 animate-pulse" },
              { name: "MTVAC Steam Boiler Node #3", mode: "Operational", status: "bg-emerald-500" },
              { name: "Gopuram CCTV Crowd Density Node", mode: feedState === "nominal" ? "Optimal" : "Overload", status: feedState === "nominal" ? "bg-emerald-500" : "bg-red-500 animate-pulse" }
            ].map((node, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] p-2 bg-white rounded-lg border border-[#B8860B]/10">
                <span className="font-semibold text-[#2C1810] flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${node.status}`} />
                  {node.name}
                </span>
                <span className="font-mono text-[#8B6B47] font-semibold">{node.mode}</span>
              </div>
            ))}
          </div>

          {/* Incoming Packet Stream */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-[#8B6B47] uppercase block mb-1">Real-Time Event Stream Log</span>
              <div className="bg-[#2C1810] p-3 rounded-xl border border-[#B8860B]/20 text-[10px] font-mono text-emerald-400 space-y-1.5 shadow-inner min-h-[140px] max-h-[140px] overflow-y-auto">
                {streamLog.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start leading-tight hover:bg-white/5 p-0.5 rounded transition-all">
                    <span>
                      <span className="text-amber-500">[{log.time}]</span> <strong className="text-white">{log.source}:</strong> {log.event}
                    </span>
                    <span className={feedState === "nominal" ? "text-emerald-300" : "text-red-400"}>
                      val={log.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-[#8B6B47] mt-1.5 leading-relaxed font-semibold">
              * Telemetry data streams continuously from biometric registers, POS counters, surveillance feeds, and pressure valves inside the Tirumala hill.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  };

  // --- Real-Time Predictive Calculator Engine ---
  // Using TTD actual constants:
  // - Laddus: 1 devotee = 1.35 laddus (cumulative sales average)
  // - Meals: 1 devotee = 3 meals (breakfast, lunch, dinner options)
  // - Volunteers (Srivari Sevaks): 1 per 45 pilgrims
  // - Security Guards: 1 per 100 pilgrims
  // - Cleaners: 1 per 100 pilgrims
  // - Water: 75 Litres per devotee
  // - Electricity: 5 kWh per devotee
  // - Solid Waste: 0.5 kg per devotee
  const predictions = useMemo(() => {
    const N = forecastDevoteeCount;
    return {
      laddus: Math.round(N * 1.35),
      meals: Math.round(N * 2.8),
      volunteers: Math.round(N / 45),
      security: Math.round(N / 100),
      cleaners: Math.round(N / 100),
      water: Math.round(N * 75), // Litres
      electricity: Math.round(N * 5), // kWh
      waste: Math.round(N * 0.5), // kg
      doctors: Math.round(N / 5000) || 1,
      nurses: Math.round(N / 2500) || 2,
      // Ingredients for Laddus
      flour: (N * 0.033).toFixed(1), // tonnes equivalent
      sugar: (N * 0.033).toFixed(1), // tonnes equivalent
      ghee: (N * 1.35).toFixed(0), // litres
      cashews: (N * 2.3).toFixed(0), // kg
      raisins: (N * 1.8).toFixed(0), // kg
      sugarCandy: (N * 1.7).toFixed(0), // kg
      cardamom: (N * 0.5).toFixed(1), // kg
      // Ingredients for Annadanam
      rice: (N * 0.2).toFixed(1), // tonnes equivalent
      oil: (N * 0.05).toFixed(0), // kg
      dal: (N * 0.045).toFixed(0), // kg
      milk: (N * 0.15).toFixed(0), // litres
      vegetables: (N * 0.11).toFixed(1), // tonnes equivalent
      dailyCost: Math.round(N * 73), // INR equivalent (approx Rs. 73 per devotee served)
    };
  }, [forecastDevoteeCount]);

  // --- Sub tabs list ---
  const subTabs = [
    { id: "overview", label: "Operations Command", icon: Cpu },
    { id: "laddu_ops", label: "Laddu Operations", icon: ShoppingBag },
    { id: "annadanam_ops", label: "Annaprasadam Food", icon: Utensils },
    { id: "security_command", label: "Security Command", icon: Shield },
    { id: "facility_mgmt", label: "Facility & Cleaning", icon: Trash2 },
  ];

  return (
    <div className="bg-white/70 backdrop-blur border border-[#B8860B]/15 text-[#2C1810] rounded-2xl p-6 shadow-xl space-y-8 max-w-full overflow-hidden">
      {/* HEADER SECTION WITH STATS CONTROL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#B8860B]/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="text-[#B8860B] animate-pulse" size={20} />
            <h2 className="font-cinzel font-bold text-2xl text-[#2C1810]">
              TTD COMMAND CENTER
            </h2>
          </div>
          <p className="text-xs text-[#8B6B47] mt-1 font-semibold">
            AI-Engine Real-Time Temple Operations & Predictive Infrastructure Dashboard
          </p>
        </div>

        {/* Control Widgets container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Simulation Feed Status Toggle Pill Button */}
          <div className="bg-[#FFF8E7] border border-[#B8860B]/15 rounded-xl p-1.5 shadow-sm flex items-center gap-2 select-none self-center">
            <span className="text-[9px] font-bold text-[#8B6B47] uppercase tracking-wider pl-1.5 pr-1">Sim Feed:</span>
            <button
              onClick={() => {
                setFeedState("nominal");
                setForecastDevoteeCount(65000);
                setStocks({
                  besan: 45.0,
                  sugar: 62.0,
                  ghee: 12500,
                  cashews: 8200,
                  rice: 60.0,
                  vegetables: 14.5,
                  oil: 9200,
                  dal: 11500,
                });
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer border-none ${
                feedState === "nominal"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${feedState === "nominal" ? "bg-white animate-pulse" : "bg-emerald-500"}`} />
              Nominal
            </button>
            <button
              onClick={() => {
                setFeedState("alert");
                setForecastDevoteeCount(235000);
                setStocks({
                  besan: 22.4,
                  sugar: 28.1,
                  ghee: 7420,
                  cashews: 4890,
                  rice: 18.5,
                  vegetables: 4.2,
                  oil: 2850,
                  dal: 3800,
                });
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer border-none ${
                feedState === "alert"
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-red-650 hover:bg-red-50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${feedState === "alert" ? "bg-white animate-pulse" : "bg-red-500"}`} />
              Alert
            </button>
          </div>

          {/* Live Predictor Slider Widget */}
          <div className="w-full sm:w-80 bg-[#FFF8E7] border border-[#B8860B]/15 rounded-xl p-3.5 shadow-sm">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-[#B8860B] uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-[#B8860B]" /> Devotee Influx Forecast
              </span>
              <span className="font-mono text-[#2C1810] font-bold bg-[#B8860B]/15 px-2 py-0.5 rounded">
                {forecastDevoteeCount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={forecastDevoteeCount}
              onChange={(e) => setForecastDevoteeCount(Number(e.target.value))}
              className="w-full h-1.5 bg-[#B8860B]/20 rounded-lg appearance-none cursor-pointer accent-[#B8860B]"
            />
            <div className="flex justify-between text-[9px] text-[#8B6B47] mt-1">
              <span>Low (10k)</span>
              <span>Normal (70k)</span>
              <span>Festival Peak (300k)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PAGE 1: COMMAND CENTER (OVERVIEW)
          ======================================================== */}
      {activeSubTab === "overview" && (
        <div className="space-y-8">
          {/* TOP KPI SECTION */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Today's Devotees", val: "68,400", sub: "Actual arrived", color: "text-[#B8860B]" },
              { label: "Temple Capacity", val: "70,000", sub: "Max safe limit", color: "text-[#2C1810]" },
              { label: "Forecasted (24h)", val: `${predictions.laddus.toLocaleString()}`, sub: "AI prediction model", color: "text-amber-600" },
              { label: "Crowd Status", val: forecastDevoteeCount > 150000 ? "CRITICAL" : forecastDevoteeCount > 80000 ? "ELEVATED" : "OPTIMAL", sub: "Density index", color: forecastDevoteeCount > 150000 ? "text-red-600" : forecastDevoteeCount > 80000 ? "text-amber-600" : "text-emerald-600" },
              { label: "Queue Wait Time", val: forecastDevoteeCount > 150000 ? "11.5h" : forecastDevoteeCount > 80000 ? "5.5h" : "2.5h", sub: "Current queue status", color: "text-[#2C1810]" },
              { label: "Laddu Stock", val: "6.2L units", sub: "In main Potu", color: "text-[#B8860B]" },
              { label: "Meals Prepared", val: `${predictions.meals.toLocaleString()}`, sub: "Annaprasadam daily", color: "text-[#2C1810]" },
              { label: "Security Status", val: `${predictions.security} guards`, sub: "Active deployment", color: "text-[#2C1810]" },
              { label: "Volunteers (Sevaks)", val: `${predictions.volunteers}`, sub: "Unpaid shifts", color: "text-[#2C1810]" },
              { label: "Medical Staff On Call", val: `${predictions.doctors} MDs / ${predictions.nurses} Nurses`, sub: "On-site standby", color: "text-[#2C1810]" },
            ].map(({ label, val, sub, color }) => (
              <GlassCard key={label} className="flex flex-col justify-between h-28">
                <span className="text-[10px] uppercase font-bold text-[#8B6B47] tracking-wider block">{label}</span>
                <span className={`font-cinzel text-xl font-bold ${color} my-1`}>{val}</span>
                <span className="text-[9px] text-[#8B6B47] block font-medium leading-tight">{sub}</span>
              </GlassCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* ANALYTICS TREND SECTION */}
            <div className="lg:col-span-8">
              <GlassCard className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider">
                      Operations Analytics Dashboard
                    </h3>
                    <p className="text-[10px] text-[#8B6B47] font-semibold">
                      Devotee influx, meals cooked, and laddu distribution forecast indices
                    </p>
                  </div>
                  <span className="text-[9px] uppercase bg-[#B8860B]/10 border border-[#B8860B]/20 px-2 py-0.5 rounded font-mono text-[#B8860B]">
                    Live Model
                  </span>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={defaultWeeklyTrend}>
                      <defs>
                        <linearGradient id="gradientDevotees" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#B8860B" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8B6B47" }} />
                      <YAxis tick={{ fontSize: 9, fill: "#8B6B47" }} />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #B8860B30",
                          borderRadius: 8,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10, color: "#8B6B47" }} />
                      <Area
                        type="monotone"
                        dataKey="devotees"
                        stroke="#B8860B"
                        fill="url(#gradientDevotees)"
                        strokeWidth={2}
                        name="Devotee Flow"
                      />
                      <Line
                        type="monotone"
                        dataKey="laddus"
                        stroke="#8B4513"
                        strokeWidth={1.5}
                        dot={false}
                        name="Laddus Distributed"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            {/* ALERT CENTER */}
            <div className="lg:col-span-4">
              <GlassCard className="h-full flex flex-col">
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <AlertTriangle className="text-amber-600" size={15} /> Command Risk Alerts
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[290px] pr-1">
                  {[
                    {
                      level: "Critical",
                      color: "border-red-300 bg-red-50/70 text-red-700",
                      title: "VQC Gate-3 Crowding Alert",
                      desc: `Forecast at ${forecastDevoteeCount.toLocaleString()} pilgrims creates queue backup risks.`,
                    },
                    {
                      level: "Warning",
                      color: "border-amber-300 bg-amber-50/70 text-amber-700",
                      title: "Annaprasadam Food Demand",
                      desc: `Requires preparing ${predictions.meals.toLocaleString()} meals today. Dal and ghee restock required.`,
                    },
                    {
                      level: "Optimal",
                      color: "border-emerald-300 bg-emerald-50/70 text-emerald-700",
                      title: "Security Roster Confirmed",
                      desc: `${predictions.security} guards deployed. Response time under 4 minutes.`,
                    },
                    {
                      level: "Warning",
                      color: "border-amber-300 bg-amber-50/70 text-amber-700",
                      title: "Water Storage Strain",
                      desc: `Current reservoir levels require active water conservation programs.`,
                    },
                  ].map((alert, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border ${alert.color} text-xs space-y-1`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold uppercase tracking-wider text-[9px]">{alert.level}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      </div>
                      <div className="font-semibold text-[#2C1810]">{alert.title}</div>
                      <p className="text-[#8B6B47] leading-relaxed font-light text-[11px]">{alert.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* RESOURCE HEALTH SECTION */}
          <div>
            <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4">
              Department Resource Health Log
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                {
                  title: "Laddu Operations",
                  status: forecastDevoteeCount > 180000 ? "Warning" : "Optimal",
                  capacity: "8.0 Lakh/day",
                  util: `${((predictions.laddus / 800000) * 100).toFixed(0)}%`,
                  risk: forecastDevoteeCount > 180000 ? "High" : "Low",
                  req: `${predictions.laddus.toLocaleString()} units`,
                },
                {
                  title: "Annadanam Food",
                  status: forecastDevoteeCount > 150000 ? "Warning" : "Optimal",
                  capacity: "2.1 Lakh/day",
                  util: `${((predictions.meals / 210000) * 100).toFixed(0)}%`,
                  risk: forecastDevoteeCount > 150000 ? "Medium" : "Low",
                  req: `${predictions.meals.toLocaleString()} meals`,
                },
                {
                  title: "Security Ops",
                  status: "Optimal",
                  capacity: "3,000 personnel",
                  util: `${((predictions.security / 3000) * 100).toFixed(0)}%`,
                  risk: "Low",
                  req: `${predictions.security} guards`,
                },
                {
                  title: "Cleaning Operations",
                  status: "Optimal",
                  capacity: "2,500 personnel",
                  util: `${((predictions.cleaners / 2500) * 100).toFixed(0)}%`,
                  risk: "Low",
                  req: `${predictions.cleaners} cleaners`,
                },
                {
                  title: "Accommodation",
                  status: forecastDevoteeCount > 100000 ? "Critical" : "Optimal",
                  capacity: "45,000 rooms",
                  util: forecastDevoteeCount > 100000 ? "98%" : "82%",
                  risk: forecastDevoteeCount > 100000 ? "Critical" : "Low",
                  req: "Full capacity",
                },
                {
                  title: "Medical Operations",
                  status: "Optimal",
                  capacity: "SVIMS 600 beds",
                  util: "74%",
                  risk: "Low",
                  req: `${predictions.doctors} MDs deployed`,
                },
              ].map((card) => (
                <GlassCard key={card.title} className="flex flex-col justify-between h-44 text-xs font-light">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#2C1810] text-[11px] leading-tight pr-2">{card.title}</span>
                    <StatusDot status={card.status} />
                  </div>
                  <div className="space-y-1.5 my-2">
                    <div>
                      <span className="text-[#8B6B47] text-[9px] uppercase block">Capacity</span>
                      <span className="font-mono text-[#2C1810] font-semibold text-[11px]">{card.capacity}</span>
                    </div>
                    <div>
                      <span className="text-[#8B6B47] text-[9px] uppercase block">Utilization</span>
                      <span className="font-mono text-[#2C1810] font-semibold text-[11px]">{card.util}</span>
                    </div>
                    <div>
                      <span className="text-[#8B6B47] text-[9px] uppercase block">Risk Level</span>
                      <span className={`font-semibold text-[10px] ${card.risk === "Critical" || card.risk === "High" ? "text-red-600" : card.risk === "Medium" ? "text-amber-600" : "text-emerald-600"}`}>{card.risk}</span>
                    </div>
                  </div>
                  <div className="border-t border-[#B8860B]/10 pt-1.5">
                    <span className="text-[10px] text-[#B8860B] font-bold block truncate">AI Req: {card.req}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* LIVE INVENTORY SILOS & PROCESSING COMMAND */}
          <GlassCard className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D0] border border-[#B8860B]/15 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                  Tirumala Live Stock Silos & Processing Command
                </h3>
                <p className="text-[10px] text-[#8B6B47] font-semibold mt-1">
                  Real-time inventory levels continuously consumed by forecasted pilgrim volume. Red indicates critically low stock.
                </p>
              </div>
              <button
                onClick={() => {
                  setStocks({
                    besan: 45.0,
                    sugar: 62.0,
                    ghee: 12500,
                    cashews: 8200,
                    rice: 60.0,
                    vegetables: 14.5,
                    oil: 9200,
                    dal: 11500,
                  });
                }}
                className="px-4 py-2 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 border border-[#B8860B]/30 hover:border-[#B8860B] text-[#B8860B] text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
              >
                Emergency Restock All Silos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: "besan", name: "Gram Flour (Besan)", type: "T", unit: "Tonnes" },
                { key: "sugar", name: "Sugar Silos", type: "T", unit: "Tonnes" },
                { key: "ghee", name: "Pure Ghee Tanks", type: "L", unit: "Litres" },
                { key: "cashews", name: "Premium Cashews", type: "kg", unit: "kg" },
                { key: "rice", name: "Sona Masuri Rice", type: "T", unit: "Tonnes" },
                { key: "vegetables", name: "Fresh Vegetables", type: "T", unit: "Tonnes" },
                { key: "oil", name: "Organic Cooking Oil", type: "kg", unit: "kg" },
                { key: "dal", name: "Red Gram (Dal)", type: "kg", unit: "kg" },
              ].map((item) => {
                const current = stocks[item.key];
                const threshold = STOCK_THRESHOLDS[item.key];
                const initial = STOCK_INITIALS[item.key];
                const pct = Math.min(100, Math.round((current / initial) * 100));
                const isLow = current < threshold;

                return (
                  <div
                    key={item.key}
                    className={`p-3.5 rounded-xl border transition-all duration-300 ${
                      isLow
                        ? "bg-red-50 border-red-300 hover:border-red-500 text-[#2C1810]"
                        : "bg-white border-[#B8860B]/15 hover:border-[#B8860B]/30 text-[#2C1810]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-[#2C1810] text-[11px] leading-tight">{item.name}</div>
                        <span className="text-[9px] text-[#8B6B47] block mt-0.5 font-medium">Threshold: {threshold} {item.unit}</span>
                      </div>
                      {/* RED / GREEN LIGHT */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isLow
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-ping"
                            : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                        }`}
                        title={isLow ? "CRITICAL: Stock Low!" : "Status: Optimal"}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="font-mono text-sm font-bold text-[#2C1810] leading-none">
                          {current.toLocaleString()} <span className="text-[10px] text-[#8B6B47] font-normal">{item.unit}</span>
                        </span>
                        <span className={`text-[9px] font-bold ${isLow ? "text-red-600 animate-pulse" : "text-emerald-600"}`}>
                          {pct}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1 bg-[#B8860B]/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLow ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-[#B8860B] to-[#D4A843]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* ACTION BUTTON */}
                      <div className="pt-1">
                        {isLow ? (
                          <button
                            onClick={() => {
                              setStocks((prev) => ({
                                ...prev,
                                [item.key]: initial,
                              }));
                            }}
                            className="w-full py-1 bg-red-500 text-white font-bold text-[9px] rounded-lg tracking-wider uppercase transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-bounce cursor-pointer border border-red-400/20"
                          >
                            🚨 Start Process / Restock
                          </button>
                        ) : (
                          <div className="text-center text-[8px] uppercase font-bold text-emerald-700 bg-emerald-50/70 py-0.5 rounded border border-emerald-500/20">
                            Optimal Level
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
          
          {renderLiveTerminal()}
        </div>
      )}

      {/* ========================================================
          PAGE 2: LADDU OPERATIONS CENTER
          ======================================================== */}
      {activeSubTab === "laddu_ops" && (
        <div className="space-y-8">
          {/* TOP KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Today's Production", val: `${predictions.laddus.toLocaleString()} units`, sub: "Asthana / Kalyanotsavam recipes included" },
              { label: "Today's Counter Sales", val: `₹${(predictions.laddus * 50).toLocaleString()}`, sub: "Avg ₹50 unit revenue" },
              { label: "Buffer Stock Status", val: "6,20,000 units", sub: "Vaccuum packed (15-day shelf life)" },
              { label: "Workforce Shifts", val: `${predictions.laddus > 200000 ? "3 Shifts active" : "2 Shifts active"}`, sub: "Permanent & contract supervisors" },
            ].map(({ label, val, sub }) => (
              <GlassCard key={label} className="flex flex-col justify-between h-28">
                <span className="text-[10px] uppercase font-bold text-[#8B6B47] tracking-wider block">{label}</span>
                <span className="font-cinzel text-lg font-bold text-[#B8860B] my-1">{val}</span>
                <span className="text-[9px] text-[#8B6B47] block font-medium leading-tight">{sub}</span>
              </GlassCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* LIVE STOCK SECTION */}
            <div className="lg:col-span-7">
              <GlassCard className="h-full flex flex-col justify-between">
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4">
                  Raw Material Silo Inventory
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    { key: "besan", name: "Gram Flour (Besan)", stock: `${stocks.besan.toFixed(1)} Tonnes`, usage: `${predictions.flour} T`, level: "25 T", isLow: stocks.besan < 25.0, initial: 45.0 },
                    { key: "sugar", name: "Sugar Silos", stock: `${stocks.sugar.toFixed(1)} Tonnes`, usage: `${predictions.sugar} T`, level: "30 T", isLow: stocks.sugar < 30.0, initial: 62.0 },
                    { key: "ghee", name: "Pure Ghee Tanks", stock: `${stocks.ghee.toLocaleString()} Litres`, usage: `${predictions.ghee} L`, level: "8,000 L", isLow: stocks.ghee < 8000, initial: 12500 },
                    { key: "cashews", name: "Premium Cashews", stock: `${stocks.cashews.toLocaleString()} kg`, usage: `${predictions.cashews} kg`, level: "5,000 kg", isLow: stocks.cashews < 5000, initial: 8200 },
                    { name: "Sweet Raisins", stock: "5,800 kg", usage: `${predictions.raisins} kg`, level: "4,000 kg", isLow: false },
                    { name: "Sugar Candy", stock: "6,000 kg", usage: `${predictions.sugarCandy} kg`, level: "3,000 kg", isLow: false },
                    { name: "Cardamom", stock: "1,200 kg", usage: `${predictions.cardamom} kg`, level: "800 kg", isLow: false },
                    { name: "Biodegradable Bags", stock: "15.0L units", usage: `${predictions.laddus} units`, level: "5.0L units", isLow: false },
                  ].map((mat) => (
                    <div key={mat.name} className={`p-3 border rounded-xl space-y-1.5 transition-all duration-300 ${mat.isLow ? "bg-red-50 border-red-300" : "bg-white border-[#B8860B]/10 hover:border-[#B8860B]/20"}`}>
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-[#2C1810] text-[11px] truncate">{mat.name}</div>
                        {mat.key && (
                          <span className={`w-2 h-2 rounded-full ${mat.isLow ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-ping" : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]"}`} />
                        )}
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8B6B47]">
                        <span>Stock: <strong>{mat.stock}</strong></span>
                        <span>Use: <strong>{mat.usage}</strong></span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-[#B8860B] pt-1 border-t border-[#B8860B]/10">
                        <span>Reorder: {mat.level}</span>
                        {mat.isLow ? (
                          <button
                            onClick={() => {
                              setStocks((prev) => ({
                                ...prev,
                                [mat.key]: mat.initial,
                              }));
                            }}
                            className="px-2 py-0.5 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors animate-pulse text-[8px] uppercase tracking-wider cursor-pointer border-none"
                          >
                            Restock
                          </button>
                        ) : (
                          <span className="opacity-60">Stable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* PRODUCTION FLOW */}
            <div className="lg:col-span-5">
              <GlassCard className="h-full flex flex-col justify-between">
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4">
                  Iconic Laddu Potu Supply Flow
                </h3>
                <div className="space-y-4">
                  {[
                    { step: "1. Raw Materials Silos", detail: "Gram Flour, Ghee & Nuts delivery", pct: 100 },
                    { step: "2. Ghee Fry Potu Processing", detail: "Boondi preparation under wood/gas stoves", pct: 85 },
                    { step: "3. Cardamom Mixing & Rolling", detail: "astrological manual weights check", pct: 72 },
                    { step: "4. Cool Vacuum Packing", detail: "Corn-starch biodegradable packets", pct: 60 },
                    { step: "5. Distribution Warehouse", detail: " TT counters inventory replenishment", pct: 45 },
                  ].map((flow, i) => (
                    <div key={flow.step} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-[#2C1810]">
                        <span>{flow.step}</span>
                        <span className="text-[10px] text-[#8B6B47]">{flow.detail}</span>
                      </div>
                      <div className="h-1 bg-[#B8860B]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4A843]"
                          style={{ width: `${flow.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* FORECAST ENGINE */}
          <GlassCard className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D0] border border-[#B8860B]/15 shadow-md">
            <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="text-[#B8860B]" size={15} /> AI Predictive Ingredients Engine
            </h3>
            <p className="text-xs text-[#8B6B47] mb-4 leading-relaxed font-semibold">
              Calculates daily commodities quantities for preparing asthana sweets matching the current devotee forecast of <strong>{forecastDevoteeCount.toLocaleString()}</strong>:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
              {[
                { label: "Gram Flour", val: `${predictions.flour} T` },
                { label: "Sugar", val: `${predictions.sugar} T` },
                { label: "Pure Ghee", val: `${predictions.ghee} L` },
                { label: "Cashews", val: `${predictions.cashews} kg` },
                { label: "Raisins", val: `${predictions.raisins} kg` },
                { label: "Sugar Candy", val: `${predictions.sugarCandy} kg` },
                { label: "Cardamom", val: `${predictions.cardamom} kg` },
              ].map(({ label, val }) => (
                <div key={label} className="p-3 bg-white rounded-xl border border-[#B8860B]/15 shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-[#8B6B47] tracking-wider block mb-1">{label}</span>
                  <span className="font-mono text-sm font-semibold text-[#2C1810]">{val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================
          PAGE 3: ANNADANAM OPERATIONS CENTER
          ======================================================== */}
      {activeSubTab === "annadanam_ops" && (
        <div className="space-y-8">
          {/* TOP KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "People Served Today", val: `${predictions.meals.toLocaleString()} pilgrims`, sub: "Free MTVAC buffet log" },
              { label: "Dining Occupancy", val: forecastDevoteeCount > 100000 ? "95%" : "64%", sub: "4 dining halls (4,000 capacity)" },
              { label: "Daily Operating Cost", val: `₹${(predictions.dailyCost).toLocaleString()}`, sub: "Endowments funded" },
              { label: "Srivari Sevaks Roster", val: `${predictions.volunteers} servers`, sub: "12-hour shifts daily" },
              { label: "Matrusri Kitchens Status", val: "Optimal", sub: "Breakfast, Lunch, Dinner timelines" },
            ].map(({ label, val, sub }) => (
              <GlassCard key={label} className="flex flex-col justify-between h-28">
                <span className="text-[10px] uppercase font-bold text-[#8B6B47] tracking-wider block">{label}</span>
                <span className="font-cinzel text-lg font-bold text-[#B8860B] my-1">{val}</span>
                <span className="text-[9px] text-[#8B6B47] block font-medium leading-tight">{sub}</span>
              </GlassCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* LIVE KITCHEN DASHBOARD */}
            <div className="lg:col-span-5">
              <GlassCard className="h-full flex flex-col justify-between">
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4">
                  Central Kitchen Timelines
                </h3>
                <div className="space-y-4">
                  {[
                    { meal: "Upma/Pongal Breakfast (09:00 - 10:30)", status: "COMPLETED", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { meal: "Rice & Sambar Lunch (10:30 - 16:00)", status: "ACTIVE RUNNING", color: "bg-[#B8860B]/10 text-[#B8860B] border-[#B8860B]/20" },
                    { meal: "Traditional Curry Dinner (17:00 - 22:30)", status: "PREPARING", color: "bg-gray-50 text-gray-500 border-gray-200" },
                  ].map((timeline) => (
                    <div key={timeline.meal} className={`p-3 rounded-xl border ${timeline.color} text-xs space-y-1`}>
                      <div className="flex justify-between items-center font-bold">
                        <span>{timeline.status}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      </div>
                      <p className="text-[#8B6B47] leading-relaxed font-light">{timeline.meal}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* FOOD STOCK INDICATORS */}
            <div className="lg:col-span-7">
              <GlassCard className="h-full flex flex-col justify-between">
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4">
                  Annaprasadam Trust Grains Inventory
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    { key: "rice", name: "Sona Masuri Rice", stock: `${stocks.rice.toFixed(1)} Tonnes`, use: `${predictions.rice} T/day`, isLow: stocks.rice < 20.0, initial: 60.0, threshold: "20 T" },
                    { key: "vegetables", name: "Fresh Vegetables", stock: `${stocks.vegetables.toFixed(1)} Tonnes`, use: `${predictions.vegetables} T/day`, isLow: stocks.vegetables < 5.0, initial: 14.5, threshold: "5 T" },
                    { key: "oil", name: "Organic Cooking Oil", stock: `${stocks.oil.toLocaleString()} kg`, use: `${predictions.oil} kg/day`, isLow: stocks.oil < 3000, initial: 9200, threshold: "3,000 kg" },
                    { key: "dal", name: "Premium Red Gram (Dal)", stock: `${stocks.dal.toLocaleString()} kg`, use: `${predictions.dal} kg/day`, isLow: stocks.dal < 4000, initial: 11500, threshold: "4,000 kg" },
                    { name: "Tirumala Milk Supply", stock: "28,000 Litres", use: `${predictions.milk} L/day`, isLow: false, threshold: "10,000 L" },
                    { name: "Pure Water Silos", stock: "1.2 ML", use: `${(predictions.water).toLocaleString()} L/day`, isLow: false, threshold: "0.5 ML" },
                  ].map((grain) => (
                    <div key={grain.name} className={`p-3 border rounded-xl space-y-1 transition-all duration-300 ${grain.isLow ? "bg-red-50 border-red-300" : "bg-white border-[#B8860B]/10 hover:border-[#B8860B]/20"}`}>
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-[#2C1810] text-[11px] truncate">{grain.name}</div>
                        {grain.key && (
                          <span className={`w-2 h-2 rounded-full ${grain.isLow ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-ping" : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]"}`} />
                        )}
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8B6B47]">
                        <span>Stock: <strong>{grain.stock}</strong></span>
                        <span>Use: <strong>{grain.use}</strong></span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-[#B8860B] pt-1 border-t border-[#B8860B]/10">
                        <span>Reorder: {grain.threshold}</span>
                        {grain.isLow ? (
                          <button
                            onClick={() => {
                              setStocks((prev) => ({
                                ...prev,
                                [grain.key]: grain.initial,
                              }));
                            }}
                            className="px-2 py-0.5 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors animate-pulse text-[8px] uppercase tracking-wider cursor-pointer border-none"
                          >
                            Restock
                          </button>
                        ) : (
                          <span className="opacity-60">Stable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* PREDICTIVE FOOD REQUIREMENTS PANEL */}
          <GlassCard className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D0] border border-[#B8860B]/15 shadow-md">
            <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="text-[#B8860B]" size={15} /> AI Meals & Ingredients Planner
            </h3>
            <p className="text-xs text-[#8B6B47] mb-4 leading-relaxed font-semibold">
              Daily resources allocation matrix automatically scaled for <strong>{forecastDevoteeCount.toLocaleString()}</strong> daily pilgrims:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                { label: "Expected Meals Served", val: `${predictions.meals.toLocaleString()} portions` },
                { label: "Rice Requirement", val: `${predictions.rice} Tonnes` },
                { label: "Vegetables Needed", val: `${predictions.vegetables} Tonnes` },
                { label: "Srivari Sevaks Required", val: `${predictions.volunteers} volunteers` },
                { label: "Total Estimated Cost", val: `₹${predictions.dailyCost.toLocaleString()}` },
              ].map(({ label, val }) => (
                <div key={label} className="p-3 bg-white rounded-xl border border-[#B8860B]/15 shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-[#8B6B47] tracking-wider block mb-1">{label}</span>
                  <span className="font-mono text-sm font-semibold text-[#2C1810]">{val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================
          PAGE 4: SECURITY COMMAND CENTER
          ======================================================== */}
      {activeSubTab === "security_command" && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* INTERACTIVE GRID MAP OF TIRUMALA */}
            <div className="lg:col-span-7">
              <GlassCard className="h-full flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider">
                    Tirumala Campus Security Grid
                  </h3>
                  <p className="text-[10px] text-[#8B6B47] font-semibold">
                    Schematic operational map showing security and crowd densities across major zones.
                  </p>
                </div>
                {/* Visual Grid Map */}
                <div className="grid grid-cols-4 gap-3 bg-[#FFF8E7]/50 p-4 rounded-xl border border-[#B8860B]/15 shadow-inner">
                  {[
                    { zone: "Temple Core", status: "Critical", guards: 210, density: "98% (RED)" },
                    { zone: "Queue Complex", status: "Warning", guards: 180, density: "85% (AMBER)" },
                    { zone: "Laddu Counter", status: "Optimal", guards: 120, density: "62% (GREEN)" },
                    { zone: "Annadanam complex", status: "Optimal", guards: 90, density: "55% (GREEN)" },
                    { zone: "Accommodation Area", status: "Optimal", guards: 75, density: "45% (GREEN)" },
                    { zone: "Parking Terminal", status: "Optimal", guards: 60, density: "40% (GREEN)" },
                    { zone: "Bus Station", status: "Warning", guards: 80, density: "74% (AMBER)" },
                    { zone: "Footpath Entrance", status: "Optimal", guards: 95, density: "60% (GREEN)" },
                  ].map((gridZone) => {
                    const statusColor =
                      gridZone.status === "Critical"
                        ? "border-red-300 bg-red-50 text-[#2C1810] hover:border-red-500"
                        : gridZone.status === "Warning"
                        ? "border-amber-300 bg-amber-50 text-[#2C1810] hover:border-amber-500"
                        : "border-emerald-300 bg-emerald-50 text-[#2C1810] hover:border-emerald-500";
                    return (
                      <div
                        key={gridZone.zone}
                        className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${statusColor}`}
                      >
                        <div className="text-[10px] font-bold text-[#2C1810] truncate">{gridZone.zone}</div>
                        <div className="text-[9px] text-[#B8860B] font-mono font-bold mt-1">{gridZone.guards} Guards</div>
                        <div className="text-[8px] text-[#8B6B47] font-medium mt-0.5">{gridZone.density}</div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            {/* LIVE SECURITY COVERAGE / CCTV MONITOR */}
            <div className="lg:col-span-5">
              <GlassCard className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4 border-b border-[#B8860B]/10 pb-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSecurityPanelTab("rosters")}
                      className={`text-xs font-cinzel font-bold uppercase tracking-wider transition-all pb-1 border-b-2 cursor-pointer ${
                        securityPanelTab === "rosters"
                          ? "border-[#B8860B] text-[#2C1810]"
                          : "border-transparent text-[#8B6B47] hover:text-[#B8860B]"
                      }`}
                    >
                      Active Guard Rosters
                    </button>
                    <button
                      onClick={() => setSecurityPanelTab("cctv")}
                      className={`text-xs font-cinzel font-bold uppercase tracking-wider transition-all pb-1 border-b-2 cursor-pointer ${
                        securityPanelTab === "cctv"
                          ? "border-[#B8860B] text-[#2C1810]"
                          : "border-transparent text-[#8B6B47] hover:text-[#B8860B]"
                      }`}
                    >
                      Live CCTV Monitor
                    </button>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${feedState === "nominal" ? "bg-emerald-500" : "bg-red-500 animate-ping"}`} />
                </div>
                
                {securityPanelTab === "rosters" ? (
                  <div className="space-y-4 flex-1">
                    {[
                      { name: "Temple Core Inner Sanctum", guards: 142, req: 150, status: "Optimal" },
                      { name: "VQC Queue Complex Dormitories", guards: 110, req: 130, status: "Warning" },
                      { name: "Laddu Distribution Bay", guards: 80, req: 80, status: "Optimal" },
                      { name: "Central Parking Areas", guards: 45, req: 60, status: "Optimal" },
                      { name: "Alipiri Footpath Gate", guards: 55, req: 70, status: "Optimal" },
                    ].map((roster) => {
                      const pct = Math.round((roster.guards / roster.req) * 100);
                      return (
                        <div key={roster.name} className="space-y-1.5 text-xs font-light">
                          <div className="flex justify-between font-semibold text-[#2C1810]">
                            <span>{roster.name}</span>
                            <span className="font-mono text-[10px] text-[#8B6B47] font-semibold">{roster.guards}/{roster.req} Officers</span>
                          </div>
                          <div className="h-1 bg-[#B8860B]/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct < 85 ? "bg-red-400" : "bg-gradient-to-r from-[#B8860B] to-[#D4A843]"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-1">
                    {renderCCTVFeed()}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          {/* AI RECOM COMMAND PANEL */}
          <GlassCard className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D0] border border-[#B8860B]/15 shadow-md text-xs font-light">
            <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="text-[#B8860B]" size={15} /> AI Crowd Patrol Advisor
            </h3>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="p-3 bg-white border border-[#B8860B]/15 rounded-xl space-y-1.5 shadow-sm">
                <span className="font-bold text-red-700 uppercase tracking-wider text-[9px] block">Critical Zone Action</span>
                <div className="font-semibold text-[#2C1810] text-[11px]">Deploy +20 Guards at Queue Complex</div>
                <p className="text-[#8B6B47] text-[10px] leading-relaxed">
                  Devotee levels at {forecastDevoteeCount.toLocaleString()} will cause queue wait times to exceed 4 hours. Segregate VQC compartments now.
                </p>
              </div>
              <div className="p-3 bg-white border border-[#B8860B]/15 rounded-xl space-y-1.5 shadow-sm">
                <span className="font-bold text-[#B8860B] uppercase tracking-wider text-[9px] block">Crowd Diversion Plan</span>
                <div className="font-semibold text-[#2C1810] text-[11px]">Reroute Footpath Entry to Dorm-5</div>
                <p className="text-[#8B6B47] text-[10px] leading-relaxed">
                  Slows down core crowd density by 14% to allow smooth asthana rituals inside inner gopurams.
                </p>
              </div>
              <div className="p-3 bg-white border border-[#B8860B]/15 rounded-xl space-y-1.5 shadow-sm">
                <span className="font-bold text-emerald-750 uppercase tracking-wider text-[9px] block">Deployment Status</span>
                <div className="font-semibold text-[#2C1810] text-[11px]">General Coverage: Stable</div>
                <p className="text-[#8B6B47] text-[10px] leading-relaxed">
                  Total guards active: {predictions.security}. General incident response times averaging 3.8 minutes.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================
          PAGE 5: CLEANING & FACILITY MANAGEMENT CENTER
          ======================================================== */}
      {activeSubTab === "facility_mgmt" && (
        <div className="space-y-8">
          {/* TOP KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Active Cleaners On Duty", val: `${predictions.cleaners} staff`, sub: "24/7 rotating shifts" },
              { label: "Toilets Active Status", val: "1,840 Active", sub: "Waterless urinals optimized" },
              { label: "Daily Solid Waste", val: `${predictions.waste.toLocaleString()} kg`, sub: "Organic / compostable fractions" },
              { label: "Water Consumption", val: `${(predictions.water / 1000000).toFixed(2)} MLD`, sub: "Hill reservoir draw" },
              { label: "Power Consumption", val: `${predictions.electricity.toLocaleString()} kWh`, sub: "30% backed by 2MW solar plant" },
            ].map(({ label, val, sub }) => (
              <GlassCard key={label} className="flex flex-col justify-between h-28">
                <span className="text-[10px] uppercase font-bold text-[#8B6B47] tracking-wider block">{label}</span>
                <span className="font-cinzel text-lg font-bold text-[#B8860B] my-1">{val}</span>
                <span className="text-[9px] text-[#8B6B47] block font-medium leading-tight">{sub}</span>
              </GlassCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* ZONE SANITATION STATUS */}
            <div className="lg:col-span-7">
              <GlassCard className="h-full flex flex-col justify-between">
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4">
                  Campus Facilities Cleanliness Log
                </h3>
                <div className="space-y-3.5 text-xs">
                  {[
                    { name: "Temple Inner Gopurams", staff: 65, status: "Clean", last: "12m ago", priority: "High" },
                    { name: "VQC Queue Complex Halls", staff: 90, status: "Cleaning in progress", last: "Active", priority: "Critical" },
                    { name: "MTVAC Dining Halls", staff: 80, status: "Clean", last: "24m ago", priority: "High" },
                    { name: "Accommodation Dormitories", staff: 55, status: "Clean", last: "45m ago", priority: "Medium" },
                    { name: "Outer Parking Terminals", staff: 40, status: "Dirty", last: "2h ago", priority: "Low" },
                  ].map((facility) => (
                    <div key={facility.name} className="flex items-center justify-between p-2.5 bg-white border border-[#B8860B]/10 rounded-xl">
                      <div>
                        <div className="font-semibold text-[#2C1810] text-[11px]">{facility.name}</div>
                        <div className="text-[10px] text-[#8B6B47] mt-0.5">Staff: {facility.staff} | Last: {facility.last}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${facility.status === "Clean" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : facility.status === "Dirty" ? "bg-red-50 text-red-700 border border-red-200/50 animate-pulse" : "bg-amber-50 text-amber-700 border border-amber-200/50 animate-pulse"}`}>
                          {facility.status}
                        </span>
                        <span className="text-[9px] text-[#8B6B47] block mt-1">Priority: {facility.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* WASTE SEGREGATION FLOW */}
            <div className="lg:col-span-5">
              <GlassCard className="h-full flex flex-col justify-between">
                <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4">
                  Solid Waste Processing Metrics
                </h3>
                <div className="space-y-4">
                  {[
                    { type: "Organic Cooking Waste", qty: `${(predictions.waste * 0.4).toFixed(0)} kg`, action: "TTD Biogas Plant conversion" },
                    { type: "Used Flower Garlands", qty: `${(predictions.waste * 0.3).toFixed(0)} kg`, action: "Organic Fertilizer processing" },
                    { type: "Plastics & Containers", qty: `${(predictions.waste * 0.2).toFixed(0)} kg`, action: "Recycling transport" },
                    { type: "General Scrap", qty: `${(predictions.waste * 0.1).toFixed(0)} kg`, action: "Landfill disposal" },
                  ].map((waste) => (
                    <div key={waste.type} className="p-3 bg-white border border-[#B8860B]/10 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-[#2C1810]">
                        <span>{waste.type}</span>
                        <span className="text-[#B8860B] font-mono font-bold">{waste.qty}</span>
                      </div>
                      <p className="text-[10px] text-[#8B6B47] leading-relaxed font-light">{waste.action}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* AI UTILITIES PREDICTIVE log */}
          <GlassCard className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D0] border border-[#B8860B]/15 shadow-md">
            <h3 className="font-cinzel font-bold text-sm text-[#2C1810] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="text-[#B8860B]" size={15} /> AI Facilities Forecast Engine
            </h3>
            <p className="text-xs text-[#8B6B47] mb-4 leading-relaxed font-semibold">
              Utility and staff logistics calculated dynamically for a devotee influx of <strong>{forecastDevoteeCount.toLocaleString()}</strong>:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: "Required Sanitation Staff", val: `${predictions.cleaners} Cleaners` },
                { label: "Expected Water Consumption", val: `${(predictions.water / 1000000).toFixed(2)} Million Litres` },
                { label: "Expected Electricity Load", val: `${predictions.electricity.toLocaleString()} kWh` },
                { label: "Expected Daily Waste Outflow", val: `${(predictions.waste / 1000).toFixed(1)} Tonnes` },
              ].map(({ label, val }) => (
                <div key={label} className="p-3 bg-white rounded-xl border border-[#B8860B]/15 shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-[#8B6B47] tracking-wider block mb-1">{label}</span>
                  <span className="font-mono text-sm font-semibold text-[#2C1810]">{val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
