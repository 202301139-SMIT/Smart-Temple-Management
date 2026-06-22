import React, { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Navigation,
  MapPin,
  Clock,
  DollarSign,
  Bus,
  Train,
  Plane,
  Car,
  Footprints,
  AlertTriangle,
  TrendingUp,
  Activity,
  Calendar,
  ChevronRight,
  Info,
  Users,
  Compass,
  ArrowRight,
  Shield,
  Droplets,
  CloudSun,
  Award,
  Sparkles,
  CheckCircle,
} from "lucide-react";

// --- Mock Data & Constants ---
const MODE_COLORS = ["#B8860B", "#D4A843", "#8B4513", "#5C3A1E", "#3E2512", "#A67C1E"];

const transportModeData = [
  { name: "APSRTC Bus", value: 55, count: "45,000/day" },
  { name: "Walking Footpath", value: 20, count: "16,000/day" },
  { name: "Private Car", value: 10, count: "8,000/day" },
  { name: "Train", value: 8, count: "6,500/day" },
  { name: "Flight", value: 4, count: "3,200/day" },
  { name: "Taxi/Tempo", value: 3, count: "2,500/day" },
];

const hourlyArrivalsData = [
  { hour: "12 AM - 4 AM", railway: 1200, airport: 150, busStand: 1800, footpath: 3000 },
  { hour: "4 AM - 8 AM", railway: 4500, airport: 800, busStand: 8500, footpath: 6500 },
  { hour: "8 AM - 12 PM", railway: 5200, airport: 1200, busStand: 9800, footpath: 2500 },
  { hour: "12 PM - 4 PM", railway: 3100, airport: 900, busStand: 6200, footpath: 1200 },
  { hour: "4 PM - 8 PM", railway: 4800, airport: 1100, busStand: 8900, footpath: 3800 },
  { hour: "8 PM - 12 AM", railway: 3800, airport: 450, busStand: 7100, footpath: 4500 },
];

const heatMapData = [
  { day: "Mon", Bus: "Medium", Train: "Low", Private: "Medium", Footpath: "Medium" },
  { day: "Tue", Bus: "Low", Train: "Low", Private: "Low", Footpath: "Low" },
  { day: "Wed", Bus: "Low", Train: "Low", Private: "Low", Footpath: "Low" },
  { day: "Thu", Bus: "Medium", Train: "Medium", Private: "Medium", Footpath: "Medium" },
  { day: "Fri", Bus: "High", Train: "High", Private: "High", Footpath: "High" },
  { day: "Sat", Bus: "Peak", Train: "Peak", Private: "Peak", Footpath: "Peak" },
  { day: "Sun", Bus: "High", Train: "High", Private: "Peak", Footpath: "High" },
];

const getHeatColor = (level) => {
  switch (level) {
    case "Low":
      return "bg-[#FFF8E7] text-[#8B6B47] border border-[#B8860B]/10";
    case "Medium":
      return "bg-[#B8860B]/10 text-[#8B4513] border border-[#B8860B]/20";
    case "High":
      return "bg-[#B8860B]/25 text-[#2C1810] font-semibold border border-[#B8860B]/40";
    case "Peak":
      return "bg-gradient-to-r from-[#B8860B]/40 to-[#D4A843]/40 text-[#2C1810] font-bold border border-[#B8860B]/60";
    default:
      return "bg-white";
  }
};

const routeDetails = {
  airport: {
    title: "Tirupati Airport (Renigunta)",
    source: "Tirupati Airport (TBR)",
    destination: "Tirumala Temple",
    distance: "38.5 km",
    time: "1h 10m",
    apsrtc: "₹45 (feeder) + ₹90 (ghat)",
    taxi: "₹1,500 - ₹2,500",
    private: "₹90 toll + fuel",
    fuel: "₹850 - ₹1,100 (one-way)",
    traffic: "Low to Moderate",
    crowd: "Low (4% share)",
    bestTime: "8:00 AM - 11:30 AM",
    recommended: "Taxi direct for family/groups; APSRTC city bus + ghat shuttle for budget.",
    parking: "Available at Airport (400 slots), limited at Tirumala",
    weather: "Generally clear, slight wind near hills",
    status: "Operational, normal traffic flow",
    coord: { x: 740, y: 310 },
  },
  railway: {
    title: "Tirupati Railway Station",
    source: "Tirupati Station (TPTY)",
    destination: "Tirumala Temple",
    distance: "22.3 km",
    time: "50m",
    apsrtc: "₹90 (direct ghat shuttle)",
    taxi: "₹900 - ₹1,200",
    private: "₹90 toll + fuel",
    fuel: "₹450 - ₹600 (one-way)",
    traffic: "High (city center)",
    crowd: "High (8% direct rail arrival)",
    bestTime: "4:00 AM - 6:00 AM or late evening",
    recommended: "Continuous APSRTC bus (every 2 mins) from platform exit.",
    parking: "Multi-level paid parking at station",
    weather: "Clear roads, fog in early hours",
    status: "Heavy crowd, buses running at peak frequency",
    coord: { x: 580, y: 440 },
  },
  renigunta: {
    title: "Renigunta Junction",
    source: "Renigunta Junction (RU)",
    destination: "Tirumala Temple",
    distance: "29.8 km",
    time: "1h 00m",
    apsrtc: "₹120 (with transfer)",
    taxi: "₹1,200 - ₹1,500",
    private: "₹90 toll + fuel",
    fuel: "₹650 - ₹800 (one-way)",
    traffic: "Moderate",
    crowd: "Moderate",
    bestTime: "5:00 AM - 7:30 AM",
    recommended: "Prepaid taxi from station front or Auto to Tirupati center.",
    parking: "Ample parking space at RU station yard",
    weather: "Normal",
    status: "Operational, smooth highway flow",
    coord: { x: 700, y: 400 },
  },
  busstand: {
    title: "APSRTC Central Bus Stand",
    source: "Sri Venkateswara Bus Station (SVBS)",
    destination: "Tirumala Temple",
    distance: "20.5 km",
    time: "45m",
    apsrtc: "₹90 (Adult) / ₹50 (Child)",
    taxi: "₹900 - ₹1,100",
    private: "₹90 toll + fuel",
    fuel: "₹400 - ₹550 (one-way)",
    traffic: "Moderate at gateway",
    crowd: "Extremely High (55% share)",
    bestTime: "3:00 AM - 5:00 AM or after 9:00 PM",
    recommended: "APSRTC Ghat Link Bus (highly frequent, every 1-2 min).",
    parking: "Parking available at SVBS multi-level",
    weather: "Fog alert on hairpin bends #12 to #20",
    status: "High availability, normal booking speed",
    coord: { x: 440, y: 460 },
  },
  alipiri: {
    title: "Alipiri Footpath Gate",
    source: "Alipiri Base (Tirupati)",
    destination: "Tirumala Temple",
    distance: "7.8 km (3,550 Steps)",
    time: "3h 30m - 4h 30m",
    apsrtc: "₹0 (Feeder to base free)",
    taxi: "N/A (Pedestrian Only)",
    private: "N/A",
    fuel: "N/A",
    traffic: "Pedestrian stream only",
    crowd: "High (15% footpath share)",
    bestTime: "3:00 AM - 6:00 AM or 4:00 PM - 8:00 PM",
    recommended: "Walking trek. Free luggage transport offered by TTD.",
    parking: "Alipiri Multi-level Parking (450 slots)",
    weather: "Covered roofing, cooler temperatures, steps dry",
    status: "Open 24 hours, security checks active",
    coord: { x: 300, y: 370 },
  },
  srivarimettu: {
    title: "Srivari Mettu Footpath Gate",
    source: "Srivari Mettu Base (Srinivasa Mangapuram)",
    destination: "Tirumala Temple",
    distance: "2.1 km (2,388 Steps)",
    time: "1h 30m - 2h 00m",
    apsrtc: "₹20 (city bus to base)",
    taxi: "N/A (Pedestrian Only)",
    private: "N/A",
    fuel: "N/A",
    traffic: "Pedestrian stream only",
    crowd: "Moderate (5% footpath share)",
    bestTime: "6:00 AM - 9:00 AM or 3:00 PM - 5:00 PM",
    recommended: "Shorter but steeper climb. Best for faster trekking.",
    parking: "Open-air ground parking at Mettu base",
    weather: "Exposed steps, sunny during midday",
    status: "Open 6:00 AM - 6:00 PM daily",
    coord: { x: 150, y: 320 },
  },
  private: {
    title: "Private Vehicle Entry Gate",
    source: "Alipiri Toll Plaza",
    destination: "Tirumala Temple",
    distance: "17.8 km (Up) / 18.0 km (Down)",
    time: "40m (Up road) / 35m (Down road)",
    apsrtc: "N/A",
    taxi: "N/A",
    private: "₹90 toll fee per entry",
    fuel: "₹350 - ₹500 (Ghat climbing load)",
    traffic: "Heavy queues at Toll Plaza (15-30m wait)",
    crowd: "High on weekends (10% share)",
    bestTime: "5:00 AM - 7:00 AM",
    recommended: "Sedans/SUVs with good hill climb capability. No two-wheelers after 10 PM.",
    parking: "Must park in designated spaces on hill-top (Sapthagiri)",
    weather: "Low visibility fog warnings on hairpin bends #15-22",
    status: "Active. Strict security check for plastics and contraband.",
    coord: { x: 320, y: 390 },
  },
  taxi: {
    title: "Taxi Pickup Zone",
    source: "Tirupati City Stands / Aggregators",
    destination: "Tirumala Temple",
    distance: "21.5 km",
    time: "42m",
    apsrtc: "N/A",
    taxi: "₹1,000 - ₹1,300 flat rate",
    private: "N/A",
    fuel: "N/A",
    traffic: "Moderate",
    crowd: "Low to Moderate",
    bestTime: "Flexible, 24/7 coverage",
    recommended: "Pre-book TTD-authorized cabs at station/airport for fixed fares.",
    parking: "Dedicated taxi stand pickup bays",
    weather: "Standard road conditions",
    status: "High availability, surge pricing active during peak hours",
    coord: { x: 500, y: 470 },
  },
};

const comparisonData = [
  { type: "APSRTC Bus", time: "45 mins", cost: "₹90", comfort: "Medium", crowd: "High", wait: "5-10 mins", score: 9.5, highlight: "Best Family Route" },
  { type: "Airport Taxi", time: "65 mins", cost: "₹1,800", comfort: "Excellent", crowd: "Low", wait: "5 mins", score: 8.8, highlight: "Fastest Route" },
  { type: "Station Taxi", time: "40 mins", cost: "₹1,000", comfort: "High", crowd: "Low", wait: "10 mins", score: 8.5, highlight: "Most Comfortable" },
  { type: "Alipiri Footpath", time: "4 hours", cost: "₹0", comfort: "Tiring / Devotional", crowd: "High", wait: "None", score: 9.0, highlight: "Cheapest / Spiritual" },
  { type: "Srivari Mettu", time: "1.5 hours", cost: "₹0", comfort: "Steep / Active", crowd: "Moderate", wait: "None", score: 8.9, highlight: "Least Crowded Trek" },
  { type: "Private Car", time: "40 mins", cost: "₹450 + ₹90", comfort: "Very High", crowd: "Moderate", wait: "15-30 mins (Toll)", score: 8.7, highlight: "Best Flexibility" }
];

export default function TravelAssistant() {
  const [selectedRoute, setSelectedRoute] = useState("railway");
  const [mapDirection, setMapDirection] = useState("to_temple");
  const [selectedMode, setSelectedMode] = useState("bus");

  useEffect(() => {
    if (selectedRoute === "alipiri" || selectedRoute === "srivarimettu") {
      setSelectedMode("walk");
    } else if (selectedRoute === "airport") {
      setSelectedMode("taxi");
    } else {
      setSelectedMode("bus");
    }
  }, [selectedRoute]);

  // Travel Planner States
  const [plannerSource, setPlannerSource] = useState("Bangalore");
  const [plannerDate, setPlannerDate] = useState("");
  const [plannerBudget, setPlannerBudget] = useState("Mid-range");
  const [plannerMode, setPlannerMode] = useState("APSRTC Bus");
  const [plannerOutput, setPlannerOutput] = useState(null);

  // SVG Camera Viewbox State for Map Pan/Zoom
  const [viewBox, setViewBox] = useState("0 0 800 500");
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (!selectedRoute) {
      animateViewBox("0 0 800 500");
      return;
    }
    const routeInfo = routeDetails[selectedRoute];
    if (routeInfo && routeInfo.coord) {
      const targetX = Math.max(0, Math.min(routeInfo.coord.x - 250, 400));
      const targetY = Math.max(0, Math.min(routeInfo.coord.y - 180, 250));
      animateViewBox(`${targetX} ${targetY} 500 350`);
    }
  }, [selectedRoute]);

  const animateViewBox = (target) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    
    const startParts = viewBox.split(" ").map(Number);
    const targetParts = target.split(" ").map(Number);
    
    let step = 0;
    const steps = 15;
    
    const performAnimation = () => {
      step++;
      const currentParts = startParts.map((start, i) => {
        const diff = targetParts[i] - start;
        return start + (diff * (step / steps));
      });
      
      setViewBox(currentParts.join(" "));
      
      if (step < steps) {
        requestAnimationFrame(performAnimation);
      } else {
        setViewBox(target);
        isTransitioning.current = false;
      }
    };
    
    requestAnimationFrame(performAnimation);
  };

  const handlePlannerSubmit = (e) => {
    e.preventDefault();
    let time = "4 hours";
    let cost = "₹90";
    let wait = "2h 30m";
    let recommendation = "APSRTC Direct Bus";
    let altRoute = "Train to Tirupati Station + Alipiri Footpath";
    let crowdText = "Moderate crowd expected";

    if (plannerMode === "Flight") {
      time = "1.5 hours + 1h taxi";
      cost = "₹4,500 + ₹1,500 taxi";
      recommendation = "Flight to Tirupati Airport, then prepaid AC Cab";
    } else if (plannerMode === "Train") {
      time = "6-8 hours";
      cost = "₹250 - ₹900";
      recommendation = "Overnight Train, then platform exit direct bus";
    } else if (plannerMode === "Private Vehicle") {
      time = "5 hours";
      cost = "₹1,200 fuel + ₹90 toll";
      recommendation = "Drive via NH-75, use multi-level parking at Alipiri";
    } else if (plannerMode === "Walking Trek") {
      time = "4 hours + 4 hours trek";
      cost = "₹90 (bus to base) + ₹0 trek";
      recommendation = "APSRTC to Tirupati, free feeder to Alipiri, walk via steps";
    }

    if (plannerBudget === "Budget") {
      cost = "₹150";
      recommendation = "APSRTC General Bus or Sleeper Train";
    } else if (plannerBudget === "Premium") {
      cost = "₹2,500+";
      recommendation = "Flight/AC Car + VIP Darshan booking";
    }

    const today = new Date(plannerDate || Date.now());
    const day = today.getDay();
    if (day === 0 || day === 6) {
      crowdText = "Extremely High (Weekend Spike +50%)";
      wait = "4h 15m";
    } else if (day === 2 || day === 3) {
      crowdText = "Optimal Low Crowd";
      wait = "1h 15m";
    }

    setPlannerOutput({
      route: `${plannerSource} ➔ Tirupati ➔ Tirumala`,
      cost,
      time,
      crowd: crowdText,
      wait,
      recommendation,
      altRoute,
    });
  };

  return (
    <div className="space-y-6">
      {/* --- SECTION 1 & 2: TRANSPORTATION INTELLIGENCE HUB & 3D ROUTE EXPLORER --- */}
      <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#B8860B]/10 pb-4 mb-6 gap-3">
          <div>
            <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
              Transportation Intelligence Route Explorer
            </h3>
            <p className="text-xs text-[#8B6B47] mt-0.5">
              Interactive 3D elevation route tracking and real-time transit status updates.
            </p>
          </div>
          <div className="flex gap-3 text-[10px] text-[#8B6B47] flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" /> Station/Hub
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 border-t-2 border-dashed border-[#D4A843]" /> Ghat Road
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 border-t-2 border-dotted border-[#8B4513]" /> Trek Path
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Map Area */}
          <div className="lg:col-span-7 bg-[#FFF8E7] rounded-xl border border-[#B8860B]/15 p-4 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            <div className="flex justify-between items-center absolute top-4 left-4 z-10 w-[90%] pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-[#B8860B]/15">
                Tirumala Terrain Explorer
              </span>
              {selectedRoute && (
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="text-[9px] font-bold text-[#8B4513] hover:text-[#B8860B] bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-[#B8860B]/15 cursor-pointer pointer-events-auto"
                >
                  Reset Zoom
                </button>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center p-2">
              <svg
                viewBox={viewBox}
                className="w-full h-full max-h-[360px] transition-all duration-700 ease-in-out"
                style={{ filter: "drop-shadow(0 10px 15px rgba(139, 69, 19, 0.08))" }}
              >
                <path
                  d="M100,280 C180,180 300,100 400,100 C500,100 620,180 700,280 L750,480 L50,480 Z"
                  fill="url(#hillGrad)"
                  opacity="0.85"
                />
                
                <defs>
                  <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFF8E7" />
                    <stop offset="50%" stopColor="#F5EDD8" />
                    <stop offset="100%" stopColor="#E6D3B3" />
                  </linearGradient>
                  
                  <linearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#B8860B" />
                    <stop offset="100%" stopColor="#D4A843" />
                  </linearGradient>
                  
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B8860B" strokeWidth="0.5" strokeOpacity="0.06" />
                  </pattern>
                </defs>

                <rect width="800" height="500" fill="url(#grid)" pointerEvents="none" />

                <path d="M 300,140 Q 400,90 500,140 Q 600,180 500,220 Q 400,250 300,220 Q 200,180 300,140 Z" fill="#B8860B" fillOpacity="0.03" stroke="#B8860B" strokeOpacity="0.1" strokeWidth="1" />
                <path d="M 330,130 Q 400,100 470,130 Q 520,160 470,190 Q 400,210 330,190 Q 280,160 330,130 Z" fill="#B8860B" fillOpacity="0.04" stroke="#B8860B" strokeOpacity="0.15" strokeWidth="1" />
                
                <g transform="translate(400, 100)" className="cursor-pointer">
                  <circle r="26" fill="#B8860B" fillOpacity="0.2" className="animate-ping" />
                  <circle r="15" fill="#B8860B" />
                  <path d="M-6,-6 L6,-6 L6,6 L-6,6 Z" fill="#FFF8E7" />
                  <polygon points="0,-14 -10,-6 10,-6" fill="#D4A843" />
                  <text y="-22" textAnchor="middle" className="font-cinzel text-[13px] font-extrabold fill-[#2C1810]">
                    Tirumala Temple
                  </text>
                </g>

                {/* Footpaths */}
                <path
                  id="path-alipiri"
                  d="M300,370 C280,310 260,250 320,180 C340,150 370,120 400,100"
                  fill="none"
                  stroke={selectedRoute === "alipiri" ? "#B8860B" : "#8B4513"}
                  strokeWidth={selectedRoute === "alipiri" ? "4.5" : "2.5"}
                  strokeDasharray={selectedRoute === "alipiri" ? "5 2" : "3 3"}
                  strokeOpacity={!selectedRoute || selectedRoute === "alipiri" ? "0.9" : "0.35"}
                />

                <path
                  id="path-srivarimettu"
                  d="M150,320 C180,270 230,220 280,180 C320,150 360,120 400,100"
                  fill="none"
                  stroke={selectedRoute === "srivarimettu" ? "#B8860B" : "#8B4513"}
                  strokeWidth={selectedRoute === "srivarimettu" ? "4.5" : "2.5"}
                  strokeDasharray={selectedRoute === "srivarimettu" ? "5 2" : "3 3"}
                  strokeOpacity={!selectedRoute || selectedRoute === "srivarimettu" ? "0.9" : "0.35"}
                />

                {/* Winding road routes */}
                <path
                  id="path-ghat"
                  d="M320,390 C340,340 370,300 340,260 C310,220 360,180 380,140 C390,120 395,110 400,100"
                  fill="none"
                  stroke="#D4A843"
                  strokeWidth={["private", "busstand", "railway", "renigunta", "airport", "taxi"].includes(selectedRoute) ? "5" : "2.5"}
                  strokeDasharray={["private", "busstand", "railway", "renigunta", "airport", "taxi"].includes(selectedRoute) ? "8 3" : ""}
                  strokeOpacity={!selectedRoute || ["private", "busstand", "railway", "renigunta", "airport", "taxi"].includes(selectedRoute) ? "0.9" : "0.35"}
                />

                <path d="M440,460 C380,450 330,420 320,390" fill="none" stroke="#8B6B47" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.45" />
                <path d="M580,440 C480,440 350,420 320,390" fill="none" stroke="#8B6B47" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.45" />
                <path d="M740,310 C680,330 630,380 580,440" fill="none" stroke="#8B6B47" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.45" />

                {Object.entries(routeDetails).map(([key, details]) => {
                  const mapLabels = {
                    airport: "Airport",
                    railway: "Railway Stand",
                    renigunta: "Renigunta",
                    busstand: "Bus Stand",
                    alipiri: "Alipiri Mettu",
                    srivarimettu: "Srivari Mettu",
                    private: "Private Entry",
                    taxi: "Taxi Stand",
                  };
                  const label = mapLabels[key] || key;
                  const isSelected = selectedRoute === key;
                  return (
                    <g
                      key={key}
                      transform={`translate(${details.coord.x}, ${details.coord.y})`}
                      onClick={() => setSelectedRoute(key)}
                      className="cursor-pointer group"
                    >
                      <circle
                        r={isSelected ? "22" : "16"}
                        fill={isSelected ? "url(#goldGlow)" : "#FFF8E7"}
                        stroke="#B8860B"
                        strokeWidth={isSelected ? "4.5" : "2.5"}
                        className="transition-all duration-200 hover:scale-110"
                      />
                      <circle
                        r="6"
                        fill={isSelected ? "#FFF8E7" : "#B8860B"}
                      />
                      {isSelected && (
                        <circle r="30" fill="none" stroke="#D4A843" strokeWidth="2" className="animate-ping" opacity="0.4" />
                      )}
                      <text
                        y={details.coord.y > 420 ? "-26" : "32"}
                        textAnchor="middle"
                        className="font-inter font-extrabold fill-[#2C1810] text-[10px]"
                        style={{
                          fontSize: isSelected ? "12px" : "10px",
                          fontWeight: "900",
                          textShadow: "1px 1px 1px rgba(255,255,255,0.8)"
                        }}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-[10px] text-[#8B6B47] text-center mt-2 flex items-center justify-center gap-1.5">
              <Info size={11} className="text-[#B8860B]" />
              Click any station node above to zoom, check travel details, and view direct recommendations.
            </p>
          </div>

          {/* Route details panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {selectedRoute ? (() => {
              const details = routeDetails[selectedRoute];
              const isToTemple = mapDirection === "to_temple";
              const startPoint = isToTemple ? details.source : "Tirumala Temple";
              const endPoint = isToTemple ? "Tirumala Temple" : details.source.replace(" (TPTY)", "").replace(" (TBR)", "").replace(" (RU)", "").replace(" (SVBS)", "").split(" (")[0];

              const getAvailableModes = () => {
                if (selectedRoute === "alipiri" || selectedRoute === "srivarimettu") return ["walk"];
                if (selectedRoute === "private") return ["private"];
                if (selectedRoute === "taxi") return ["taxi"];
                return ["bus", "taxi", "private"];
              };
              const modes = getAvailableModes();

              return (
                <div className="bg-white border border-[#B8860B]/15 rounded-xl p-5 shadow-sm space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-[#B8860B]/10 pb-2.5">
                      {selectedRoute === "airport" && <Plane size={18} className="text-[#B8860B]" />}
                      {selectedRoute === "railway" && <Train size={18} className="text-[#B8860B]" />}
                      {selectedRoute === "renigunta" && <Train size={18} className="text-[#B8860B]" />}
                      {selectedRoute === "busstand" && <Bus size={18} className="text-[#B8860B]" />}
                      {(selectedRoute === "alipiri" || selectedRoute === "srivarimettu") && <Footprints size={18} className="text-[#B8860B]" />}
                      {selectedRoute === "private" && <Car size={18} className="text-[#B8860B]" />}
                      {selectedRoute === "taxi" && <Car size={18} className="text-[#B8860B]" />}
                      <h4 className="font-cinzel font-bold text-[#2C1810] text-sm">
                        {details.title}
                      </h4>
                    </div>

                    {/* Direction switch */}
                    <div className="flex bg-[#FFF8E7] rounded-xl p-1 border border-[#B8860B]/15 text-xs font-semibold select-none">
                      <button
                        type="button"
                        onClick={() => setMapDirection("to_temple")}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                          isToTemple
                            ? "bg-[#B8860B] text-white shadow-sm font-bold"
                            : "text-[#8B6B47] hover:text-[#B8860B]"
                        }`}
                      >
                        To Tirumala
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapDirection("from_temple")}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                          !isToTemple
                            ? "bg-[#B8860B] text-white shadow-sm font-bold"
                            : "text-[#8B6B47] hover:text-[#B8860B]"
                        }`}
                      >
                        From Tirumala
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                        <span className="text-[#8B6B47]">Starting Point:</span>
                        <span className="font-semibold text-[#2C1810]">{startPoint}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                        <span className="text-[#8B6B47]">Destination:</span>
                        <span className="font-semibold text-[#2C1810]">{endPoint}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                        <span className="text-[#8B6B47]">Distance:</span>
                        <span className="font-mono font-bold text-[#B8860B]">{details.distance}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                        <span className="text-[#8B6B47]">Est. Travel Time:</span>
                        <span className="font-semibold text-[#2C1810]">{details.time}</span>
                      </div>
                    </div>

                    {/* Cost matrices */}
                    <div className="p-3 bg-[#FFF8E7] rounded-xl border border-[#B8860B]/10 space-y-2">
                      <span className="text-[10px] font-bold text-[#8B6B47] uppercase tracking-wider block">Estimated Costs & Mode Options</span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {modes.includes("bus") && (
                          <div className="bg-white p-2 rounded-lg border border-[#B8860B]/10 flex flex-col justify-between">
                            <span className="text-[#8B6B47] font-semibold flex items-center gap-1"><Bus size={10} /> APSRTC Bus</span>
                            <span className="font-bold text-[#8B4513] mt-0.5">{details.apsrtc}</span>
                          </div>
                        )}
                        {modes.includes("taxi") && (
                          <div className="bg-white p-2 rounded-lg border border-[#B8860B]/10 flex flex-col justify-between">
                            <span className="text-[#8B6B47] font-semibold flex items-center gap-1"><Car size={10} /> Ghat Taxi</span>
                            <span className="font-bold text-[#8B4513] mt-0.5">{details.taxi}</span>
                          </div>
                        )}
                        {modes.includes("private") && (
                          <div className="bg-white p-2 rounded-lg border border-[#B8860B]/10 flex flex-col justify-between col-span-2">
                            <span className="text-[#8B6B47] font-semibold flex items-center gap-1"><Car size={10} /> Private Vehicle</span>
                            <span className="font-bold text-[#8B4513] mt-0.5">{details.private} + {details.fuel} (Fuel)</span>
                          </div>
                        )}
                        {modes.includes("walk") && (
                          <div className="bg-white p-2 rounded-lg border border-[#B8860B]/10 flex flex-col justify-between col-span-2">
                            <span className="text-[#8B6B47] font-semibold flex items-center gap-1"><Footprints size={10} /> Footpath Walk</span>
                            <span className="font-bold text-[#8B4513] mt-0.5">Free (₹0 cost, luggage transfer included)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#B8860B]/5 border border-[#B8860B]/15 rounded-xl p-3 text-[11px] text-[#8B6B47] leading-relaxed mt-2">
                    <strong className="text-[#2C1810]">AI Recommendation: </strong>
                    {details.recommended}
                  </div>
                </div>
              );
            })() : (
              <div className="bg-white border border-[#B8860B]/10 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <MapPin size={32} className="text-[#B8860B]/40 mb-2" />
                <h4 className="font-cinzel font-bold text-xs text-[#2C1810]">No Route Selected</h4>
                <p className="text-[11px] text-[#8B6B47] mt-1 max-w-[200px]">
                  Click on any of the transport hub markers on the map to calculate transit cost, route status and optimal timelines.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: ROUTE COMPARISON ENGINE --- */}
      <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6">
        <div className="border-b border-[#B8860B]/10 pb-4 mb-6">
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            Route Comparison Engine
          </h3>
          <p className="text-xs text-[#8B6B47] mt-0.5">
            Side-by-side analysis of different transit options, wait times, comfort levels, and aggregate scores.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#B8860B]/10 bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FFF8E7] border-b border-[#B8860B]/15 text-[#8B6B47] font-semibold">
                <th className="py-3.5 px-4 font-cinzel font-bold">Transport Type</th>
                <th className="py-3.5 px-4">Travel Time</th>
                <th className="py-3.5 px-4">Average Cost</th>
                <th className="py-3.5 px-4">Comfort Level</th>
                <th className="py-3.5 px-4">Crowd Level</th>
                <th className="py-3.5 px-4">Waiting Time</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-right">Feature Tag</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row) => (
                <tr key={row.type} className="border-b border-[#B8860B]/5 hover:bg-[#FFF8E7]/40 text-[#2C1810]">
                  <td className="py-3.5 px-4 font-semibold text-[#2C1810] flex items-center gap-2">
                    {row.type.includes("Bus") && <Bus size={13} className="text-[#B8860B]" />}
                    {row.type.includes("Taxi") && <Car size={13} className="text-[#B8860B]" />}
                    {row.type.includes("Footpath") && <Footprints size={13} className="text-[#B8860B]" />}
                    {row.type.includes("Mettu") && <Footprints size={13} className="text-[#B8860B]" />}
                    {row.type.includes("Car") && <Car size={13} className="text-[#B8860B]" />}
                    {row.type}
                  </td>
                  <td className="py-3.5 px-4 text-[#8B6B47] font-medium">{row.time}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#8B4513]">{row.cost}</td>
                  <td className="py-3.5 px-4 text-[#8B6B47]">{row.comfort}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                      row.crowd === "High" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"
                    }`}>
                      {row.crowd}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#8B6B47]">{row.wait}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#B8860B]">{row.score}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-0.75 rounded-full text-[9px] font-bold border ${
                      row.highlight.includes("Cheapest") ? "bg-green-50 text-green-700 border-green-200" :
                      row.highlight.includes("Fastest") ? "bg-red-50 text-red-600 border-red-200" :
                      row.highlight.includes("Family") ? "bg-[#B8860B]/10 text-[#8B4513] border-[#B8860B]/30" :
                      "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {row.highlight}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- SECTION 3: TRANSPORT ANALYSIS --- */}
      <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6">
        <div className="border-b border-[#B8860B]/10 pb-4 mb-6">
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            Transport Demand & Congestion Analysis
          </h3>
          <p className="text-xs text-[#8B6B47] mt-0.5">
            Statistical forecast of travel modes, congestion matrixes, and peak arrival times.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Mode split */}
          <div className="bg-white border border-[#B8860B]/10 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between">
            <h4 className="font-cinzel font-semibold text-[#2C1810] text-xs mb-2">
              Pilgrim Transport Mode Split
            </h4>
            <div className="w-[180px] h-[180px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transportModeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {transportModeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MODE_COLORS[index % MODE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-cinzel font-bold text-[#B8860B]">55%</span>
                <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider">APSRTC Bus</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-4 text-[10px] text-[#8B6B47]">
              {transportModeData.map((item) => (
                <div key={item.name} className="flex flex-col border-l-2 border-[#B8860B]/20 pl-1.5">
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="text-xs font-semibold text-[#2C1810]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart Load */}
          <div className="bg-white border border-[#B8860B]/10 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <h4 className="font-cinzel font-semibold text-[#2C1810] text-xs mb-4">
              Hourly Station Load Predictions
            </h4>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyArrivalsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
                  <XAxis dataKey="hour" tick={{ fontSize: 8, fill: "#8B6B47" }} />
                  <YAxis tick={{ fontSize: 8, fill: "#8B6B47" }} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Bar dataKey="busStand" name="Bus Stand" stackId="a" fill="#B8860B" />
                  <Bar dataKey="railway" name="Railways" stackId="a" fill="#D4A843" />
                  <Bar dataKey="footpath" name="Footpath" stackId="a" fill="#8B4513" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-3 text-[9px] text-[#8B6B47]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#B8860B]" /> Bus Stand
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#D4A843]" /> Railways
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#8B4513]" /> Footpath
              </span>
            </div>
          </div>

          {/* Weekly Heatmap */}
          <div className="bg-white border border-[#B8860B]/10 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <h4 className="font-cinzel font-semibold text-[#2C1810] text-xs mb-2">
              Weekly Mode Congestion Matrix
            </h4>
            <div className="overflow-y-auto">
              <div className="min-w-[200px] space-y-1.5 mt-2">
                <div className="grid grid-cols-5 text-[9px] text-[#8B6B47] font-bold border-b border-[#B8860B]/10 pb-1 text-center">
                  <div className="text-left">Day</div>
                  <div>Bus</div>
                  <div>Train</div>
                  <div>Car</div>
                  <div>Trek</div>
                </div>
                {heatMapData.map((row) => (
                  <div key={row.day} className="grid grid-cols-5 text-[9px] items-center text-center">
                    <div className="text-left font-semibold text-[#2C1810]">{row.day}</div>
                    <div className={`p-1 rounded ${getHeatColor(row.Bus)}`}>{row.Bus}</div>
                    <div className={`p-1 rounded ${getHeatColor(row.Train)}`}>{row.Train}</div>
                    <div className={`p-1 rounded ${getHeatColor(row.Private)}`}>{row.Private}</div>
                    <div className={`p-1 rounded ${getHeatColor(row.Footpath)}`}>{row.Footpath}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 8: AI TRAVEL PLANNER --- */}
      <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6">
        <div className="border-b border-[#B8860B]/10 pb-4 mb-6">
          <h3 className="font-cinzel font-bold text-lg text-[#2C1810]">
            AI Travel Assistant Planner
          </h3>
          <p className="text-xs text-[#8B6B47] mt-0.5">
            Plan your custom route, travel timeline, and budget split. Enter your coordinates below to generate.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-white border border-[#B8860B]/10 rounded-xl p-5 shadow-sm">
            <form onSubmit={handlePlannerSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">Source Location</label>
                <select
                  value={plannerSource}
                  onChange={(e) => setPlannerSource(e.target.value)}
                  className="w-full px-3 py-2 border border-[#B8860B]/20 bg-white rounded-lg text-xs focus:outline-none focus:border-[#B8860B] text-[#2C1810]"
                >
                  <option>Bangalore</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Coimbatore</option>
                  <option>Vijayawada</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={plannerDate}
                    onChange={(e) => setPlannerDate(e.target.value)}
                    required
                    className="w-full px-3 py-1.8 border border-[#B8860B]/20 bg-white rounded-lg text-xs focus:outline-none focus:border-[#B8860B] text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">Budget Tier</label>
                  <select
                    value={plannerBudget}
                    onChange={(e) => setPlannerBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-[#B8860B]/20 bg-white rounded-lg text-xs focus:outline-none focus:border-[#B8860B] text-[#2C1810]"
                  >
                    <option>Budget</option>
                    <option>Mid-range</option>
                    <option>Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">Preferred Mode</label>
                <select
                  value={plannerMode}
                  onChange={(e) => setPlannerMode(e.target.value)}
                  className="w-full px-3 py-2 border border-[#B8860B]/20 bg-white rounded-lg text-xs focus:outline-none focus:border-[#B8860B] text-[#2C1810]"
                >
                  <option>APSRTC Bus</option>
                  <option>Train</option>
                  <option>Flight</option>
                  <option>Private Vehicle</option>
                  <option>Walking Trek</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#B8860B] to-[#D4A843] text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer font-cinzel"
              >
                Generate Custom Itinerary <ArrowRight size={13} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {plannerOutput ? (
              <div className="bg-[#FFF8E7] border border-[#B8860B]/20 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 border-b border-[#B8860B]/15 pb-2.5">
                    <Sparkles size={15} className="text-[#B8860B] animate-spin" />
                    <h4 className="font-cinzel font-bold text-xs text-[#2C1810]">Generated Smart Itinerary</h4>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                      <span className="text-[#8B6B47]">Travel Route Sequence:</span>
                      <span className="font-semibold text-[#2C1810]">{plannerOutput.route}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                      <span className="text-[#8B6B47]">Expected Travel Time:</span>
                      <span className="font-semibold text-[#2C1810]">{plannerOutput.time}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                      <span className="text-[#8B6B47]">Projected Cost (One-Way):</span>
                      <span className="font-semibold text-[#8B4513]">{plannerOutput.cost}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                      <span className="text-[#8B6B47]">Crowd Alert Level:</span>
                      <span className="font-bold text-orange-600">{plannerOutput.crowd}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                      <span className="text-[#8B6B47]">Expected Queue Waiting Time:</span>
                      <span className="font-semibold text-red-600">{plannerOutput.wait}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                      <span className="text-[#8B6B47]">Backup / Alternative Option:</span>
                      <span className="text-[#2C1810]">{plannerOutput.altRoute}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#B8860B]/10 rounded-lg">
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle size={12} className="text-green-600" />
                    <span className="text-[9px] font-bold text-green-700 uppercase">Recommended Directive</span>
                  </div>
                  <p className="text-[10px] text-[#8B6B47] leading-relaxed">
                    {plannerOutput.recommendation}. **Important**: Book your darshan pass via the official TTD Portal 90 days in advance to secure optimal time slots.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFF8E7]/30 border border-[#B8860B]/10 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
                <Calendar size={28} className="text-[#B8860B]/50 mb-2" />
                <h4 className="font-cinzel font-semibold text-[#2C1810] text-xs">Itinerary Ready to Generate</h4>
                <p className="text-[10px] text-[#8B6B47] mt-1 max-w-[200px]">
                  Fill out the parameters on the left to immediately calculate travel costs, route options, and estimated queue delays.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
