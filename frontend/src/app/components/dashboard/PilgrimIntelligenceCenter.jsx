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
  AreaChart,
  Area,
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
  HelpCircle,
  FileText,
  User,
  Phone,
  QrCode,
  Ticket,
} from "lucide-react";
import confetti from "canvas-confetti";

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

const sevenHills = [
  {
    name: "Seshadri",
    height: "900m",
    meaning: "Serpent Hill of Lord Sesha",
    importance: "Represents the body of Lord Adisesha, the cosmic serpent on whom Lord Vishnu rests.",
    history: "Lauded in Varaha Purana as the gateway of spiritual energy descending from Vaikuntam.",
    legends: "Lord Srinivasa first placed his divine feet here when descending from heaven, leaving a cosmic imprint.",
    location: "Southeastern boundary, forming the main range entrance.",
    facts: "Contains rare red sandalwood tree clusters and high-density medicinal herbal thickets.",
    gradient: "from-[#B8860B] to-[#8B4513]",
  },
  {
    name: "Neeladri",
    height: "850m",
    meaning: "Blue Hill of Neela Devi",
    importance: "Dedicated to Neela Devi, the consort who sacrificed her hair to heal the Lord's crown.",
    history: "The origin point of the sacred 'Kalyana Katta' tonsuring ritual performed by millions.",
    legends: "When Srinivasa was struck by a cowherd, Neela Devi transplanted her hair. In gratitude, the Lord blessed that devotees who tonsure their hair here would be granted direct grace.",
    location: "Northern range, flanking the temple village.",
    facts: "Houses the ancient temple of Neela Devi and receives over 35,000 tonsuring offerings daily.",
    gradient: "from-[#8B4513] to-[#5C3A1E]",
  },
  {
    name: "Garudadri",
    height: "880m",
    meaning: "Hill of Garuda",
    importance: "Represents Garuda, the divine eagle mount of Lord Vishnu, sitting in perpetual adoration.",
    history: "Puranic texts state this hill was physically transported from Vaikuntam by Garuda to serve as the Lord's abode.",
    legends: "Garuda prayed to serve the Lord eternally; Venkateswara granted that the hill carrying Him would bear Garuda's name.",
    location: "Western ridge of the hills.",
    facts: "A natural giant boulder formation on this hill resembles a majestic eagle with outstretched wings.",
    gradient: "from-[#5C3A1E] to-[#B8860B]",
  },
  {
    name: "Anjanadri",
    height: "920m",
    meaning: "Birthplace of Lord Hanuman",
    importance: "Renowned globally as the official birth site of Hanuman, the archetype of devotion.",
    history: "Recognized in classical texts as the peak where Anjana Devi performed 12 years of severe penance.",
    legends: "Sage Matanga blessed Anjana to eat a holy fruit on this peak, leading to the birth of Hanuman.",
    location: "Akashaganga range.",
    facts: "Features the sacred Akashaganga Waterfall, whose holy waters are used daily for the main deity's Abhishekam.",
    gradient: "from-[#B8860B] to-[#D4A843]",
  },
  {
    name: "Vrushabhadri",
    height: "890m",
    meaning: "Hill of Vrushabhasura",
    importance: "Stands for the destruction of pride and the attainment of absolute surrender.",
    history: "Commemorates the epic battle between Lord Venkateswara and the righteous yet proud demon Vrushabhasura.",
    legends: "After being defeated, the demon requested the Lord that the hill be named after him as a sign of his salvation.",
    location: "Inner valley, towards the north.",
    facts: "Rich in geothermal springs and ancient rock carvings depicting the battle of the chakras.",
    gradient: "from-[#8B4513] to-[#D4A843]",
  },
  {
    name: "Narayanadri",
    height: "910m",
    meaning: "Peak of Sage Narayana",
    importance: "Represents deep meditation and the cosmic sound of Omkara echoing in the valleys.",
    history: "Associated with Sage Narayana, who established the first spiritual hermitages on this range.",
    legends: "The Lord manifested here in a blinding pillar of gold to bless Sage Narayana's unwavering penance.",
    location: "Northernmost ridge.",
    facts: "Houses the holy Srivari Padalu (Footprints of the Lord) at the highest elevation point of Tirumala.",
    gradient: "from-[#2C1810] to-[#8B4513]",
  },
  {
    name: "Venkatadri",
    height: "860m",
    meaning: "Hill of Venkateswara (The Main Shrine)",
    importance: "The central spiritual powerhouse. The word Ven-kata translates to 'Destroyer of All Sins'.",
    history: "The supreme destination of the Kaliyuga, housing the main temple complex constructed over 1500 years ago.",
    legends: "Lord Vishnu self-manifested (Swayambhu) as Venkateswara on this peak to guide humanity through the dark age.",
    location: "The core temple town of Tirumala.",
    facts: "The inner sanctum is topped by the 'Ananda Nilaya Vimana', covered in 250 kilograms of pure gold plates.",
    gradient: "from-[#B8860B] to-[#FFF8E7]/40",
  },
];

const newsAlerts = [
  { id: 1, cat: "APSRTC", title: "APSRTC deploys 40 additional electric buses on Tirumala-Tirupati route for weekend.", time: "10 mins ago", type: "update" },
  { id: 2, cat: "Weather", title: "Heavy fog warning on Ghat Road. Speed limit restricted to 20 km/h on hairpin curves.", time: "1 hour ago", type: "alert" },
  { id: 3, cat: "Temple", title: "Vaikuntam Compartment 2 wait time hits 4 hours. Drinking water & prasad distribution active.", time: "2 hours ago", type: "update" },
  { id: 4, cat: "Railway", title: "SCR announces 12 weekly Brahmotsavam special trains from Secunderabad and Vijayawada.", time: "3 hours ago", type: "update" },
  { id: 5, cat: "Emergency", title: "APSRTC ghat helpline active: Dial 1800-425-3333 for break-down & medical assistance.", time: "4 hours ago", type: "emergency" },
  { id: 6, cat: "Airport", title: "Direct flight frequencies to Tirupati (Renigunta) increased from Bangalore & Chennai.", time: "5 hours ago", type: "update" },
];

export default function PilgrimIntelligenceCenter({ userRole }) {
  const [selectedRoute, setSelectedRoute] = useState("railway");
  const [activeHill, setActiveHill] = useState(0);
  const [newsFilter, setNewsFilter] = useState("All");
  const [isAdminView, setIsAdminView] = useState(false);
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

  // Admin Forecast Simulator States
  const [simulatedDevotees, setSimulatedDevotees] = useState(65000);

  // SVG Camera Viewbox State for Map Pan/Zoom
  const [viewBox, setViewBox] = useState("0 0 800 500");
  const isTransitioning = useRef(false);

  // News Auto-Ticker
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % newsAlerts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Update viewBox coordinates when selectedRoute changes
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

  // News Filtered List
  const filteredNews = newsAlerts.filter((item) => {
    if (newsFilter === "All") return true;
    return item.cat === newsFilter;
  });

  // Action model calculations
  const busesNeeded = Math.ceil((0.55 * simulatedDevotees) / 135);
  const driversNeeded = busesNeeded * 2;
  const fuelLiters = Math.ceil((busesNeeded * 120) / 5);
  const fuelCost = fuelLiters * 96;
  const taxiFleetNeeded = Math.ceil((simulatedDevotees * 0.05) / 8);
  const parkingSpaces = Math.ceil(simulatedDevotees * 0.08);
  const prasadProjections = Math.round(simulatedDevotees * 2.5);

  return (
    <div className="space-y-12">
      {/* Dynamic View Toggle (Gov & Temple Roles Only) */}
      {(userRole === "government" || userRole === "temple") && (
        <div className="bg-[#B8860B]/5 border border-[#B8860B]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8860B]/10 flex items-center justify-center">
              <Shield size={20} className="text-[#B8860B]" />
            </div>
            <div>
              <h4 className="font-cinzel font-semibold text-xs tracking-wide text-[#2C1810]">
                Administrative Access Controls
              </h4>
              <p className="text-[10px] text-[#8B6B47]">
                Authenticated as: <strong className="text-[#B8860B] uppercase">{userRole}</strong>
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 p-1 bg-white border border-[#B8860B]/15 rounded-xl">
            <button
              onClick={() => setIsAdminView(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isAdminView
                  ? "bg-[#B8860B] text-white shadow-sm"
                  : "text-[#8B6B47] hover:text-[#B8860B]"
              }`}
            >
              Devotee View
            </button>
            <button
              onClick={() => setIsAdminView(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isAdminView
                  ? "bg-[#8B4513] text-white shadow-sm"
                  : "text-[#8B6B47] hover:text-[#8B4513]"
              }`}
            >
              Logistics & Analytics View
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TRAVEL INTELLIGENCE VIEW                  */}
      {/* ========================================== */}
      <>
          {/* --- SECTION 1 & 2: TRANSPORTATION INTELLIGENCE HUB & 3D ROUTE EXPLORER --- */}
          <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#B8860B]/10 pb-4 mb-6 gap-3">
              <div>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#B8860B] font-bold block mb-1">
                  Section 1 & 2
                </span>
                <h3 className="font-cinzel font-bold text-xl text-[#2C1810]">
                  Transportation Intelligence
                </h3>
                <p className="text-xs text-[#8B6B47] mt-0.5">
                  Choose the best route to Tirumala based on cost, crowd, travel time and convenience.
                </p>
              </div>
              {/* Legend */}
              <div className="flex gap-3 text-[10px] text-[#8B6B47] flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" /> Station/Hub
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 border-t-2 border-dashed border-[#D4A843]" /> Road Route
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 border-t-2 border-dotted border-[#8B4513]" /> Trek path
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              {/* Interactive Map Visualizer */}
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

                {/* SVG Interactive Map */}
                <div className="flex-1 flex items-center justify-center p-2">
                  <svg
                    viewBox={viewBox}
                    className="w-full h-full max-h-[360px] transition-all duration-700 ease-in-out"
                    style={{ filter: "drop-shadow(0 10px 15px rgba(139, 69, 19, 0.08))" }}
                  >
                    {/* Background hill ranges (isometric representation) */}
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
                    
                    {/* Main Destination: Tirumala Temple (400, 100) */}
                    <g transform="translate(400, 100)" className="cursor-pointer">
                      <circle r="26" fill="#B8860B" fillOpacity="0.2" className="animate-ping" />
                      <circle r="15" fill="#B8860B" />
                      <path d="M-6,-6 L6,-6 L6,6 L-6,6 Z" fill="#FFF8E7" />
                      <polygon points="0,-14 -10,-6 10,-6" fill="#D4A843" />
                      <text y="-22" textAnchor="middle" className="font-cinzel text-[13px] font-extrabold fill-[#2C1810]">
                        Tirumala Temple
                      </text>
                    </g>

                    {/* --- Draw Routes Paths --- */}
                    {/* Footpath 1: Alipiri (300, 370) ➔ Temple (400, 100) */}
                    <path
                      id="path-alipiri"
                      d="M300,370 C280,310 260,250 320,180 C340,150 370,120 400,100"
                      fill="none"
                      stroke={selectedRoute === "alipiri" ? "#B8860B" : "#8B4513"}
                      strokeWidth={selectedRoute === "alipiri" ? "4.5" : "2.5"}
                      strokeDasharray={selectedRoute === "alipiri" ? "5 2" : "3 3"}
                      strokeOpacity={!selectedRoute || selectedRoute === "alipiri" ? "0.9" : "0.35"}
                      className={selectedRoute === "alipiri" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                    />

                    {/* Footpath 2: Srivari Mettu (150, 320) ➔ Temple (400, 100) */}
                    <path
                      id="path-srivarimettu"
                      d="M150,320 C180,270 230,220 280,180 C320,150 360,120 400,100"
                      fill="none"
                      stroke={selectedRoute === "srivarimettu" ? "#B8860B" : "#8B4513"}
                      strokeWidth={selectedRoute === "srivarimettu" ? "4.5" : "2.5"}
                      strokeDasharray={selectedRoute === "srivarimettu" ? "5 2" : "3 3"}
                      strokeOpacity={!selectedRoute || selectedRoute === "srivarimettu" ? "0.9" : "0.35"}
                      className={selectedRoute === "srivarimettu" ? "animate-[dash_1.5s_linear_infinite]" : ""}
                    />

                    {/* Winding road routes (Ghat road) */}
                    <path
                      id="path-ghat"
                      d="M320,390 C340,340 370,300 340,260 C310,220 360,180 380,140 C390,120 395,110 400,100"
                      fill="none"
                      stroke={selectedRoute === "private" || selectedRoute === "busstand" || selectedRoute === "railway" || selectedRoute === "renigunta" || selectedRoute === "airport" || selectedRoute === "taxi" ? "#D4A843" : "#D4A843"}
                      strokeWidth={["private", "busstand", "railway", "renigunta", "airport", "taxi"].includes(selectedRoute) ? "5" : "2.5"}
                      strokeDasharray={["private", "busstand", "railway", "renigunta", "airport", "taxi"].includes(selectedRoute) ? "8 3" : ""}
                      strokeOpacity={!selectedRoute || ["private", "busstand", "railway", "renigunta", "airport", "taxi"].includes(selectedRoute) ? "0.9" : "0.35"}
                    />

                    {/* Connectors from city to Alipiri */}
                    <path d="M440,460 C380,450 330,420 320,390" fill="none" stroke="#8B6B47" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.45" />
                    <path d="M580,440 C480,440 350,420 320,390" fill="none" stroke="#8B6B47" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.45" />
                    <path d="M740,310 C680,330 630,380 580,440" fill="none" stroke="#8B6B47" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.45" />

                    {/* --- Draw Interactive Checkpoint Nodes --- */}
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
                      const label = mapLabels[key] || (key.charAt(0).toUpperCase() + key.slice(1));
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
                            className="font-inter font-extrabold fill-[#2C1810]"
                            style={{ 
                              fontSize: isSelected ? "13px" : "11px", 
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
                  Click any station node above to highlight its path, compute costs, and check operational indicators.
                </p>
              </div>

              {/* Route Information Panel (Right) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                {selectedRoute ? (() => {
                  const details = routeDetails[selectedRoute];
                  const isToTemple = mapDirection === "to_temple";
                  const startPoint = isToTemple ? details.source : "Tirumala Temple";
                  const endPoint = isToTemple ? "Tirumala Temple" : details.source.replace(" (TPTY)", "").replace(" (TBR)", "").replace(" (RU)", "").replace(" (SVBS)", "").split(" (")[0];

                  const directionTimes = {
                    airport: { to: "1h 10m", from: "55m" },
                    railway: { to: "50m", from: "40m" },
                    renigunta: { to: "1h 00m", from: "50m" },
                    busstand: { to: "45m", from: "35m" },
                    alipiri: { to: "4h 00m", from: "2h 15m" },
                    srivarimettu: { to: "1h 45m", from: "50m" },
                    private: { to: "40m", from: "30m" },
                    taxi: { to: "42m", from: "32m" },
                  };
                  const travelTime = directionTimes[selectedRoute]?.[mapDirection] || details.time;
                  const privateToll = isToTemple ? details.private : "₹0 (Exit free)";

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
                        {/* Title and Icon */}
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

                        {/* Direction Switcher */}
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
                            ➔ To Temple (Ascent)
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapDirection("from_temple")}
                            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                              !isToTemple
                                ? "bg-[#8B4513] text-white shadow-sm font-bold"
                                : "text-[#8B6B47] hover:text-[#8B4513]"
                            }`}
                          >
                            To Hub ➔ (Descent)
                          </button>
                        </div>

                        {/* 3-Column Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-[#FFF8E7] rounded-lg border border-[#B8860B]/10 flex flex-col justify-center">
                            <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block">Route</span>
                            <span className="text-[10px] text-[#2C1810] font-bold truncate" title={`${startPoint} ➔ ${endPoint}`}>
                              {startPoint.split(" (")[0]} ➔ {endPoint.split(" (")[0]}
                            </span>
                          </div>
                          <div className="p-2 bg-[#FFF8E7] rounded-lg border border-[#B8860B]/10 flex flex-col justify-center">
                            <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block">Est. Time</span>
                            <span className="text-[10px] text-[#2C1810] font-bold truncate">
                              {details.distance.split(" (")[0]} ({travelTime})
                            </span>
                          </div>
                          <div className="p-2 bg-[#FFF8E7] rounded-lg border border-[#B8860B]/10 flex flex-col justify-center">
                            <span className="text-[9px] text-[#8B6B47] uppercase font-bold tracking-wider block">Best Hour</span>
                            <span className="text-[10px] text-green-700 font-bold truncate" title={details.bestTime}>
                              {details.bestTime.split(" or ")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Travel Mode Selector and Content */}
                        <div className="space-y-2">
                          <div className="flex bg-[#FFF8E7] p-1 border border-[#B8860B]/10 rounded-xl gap-1">
                            {modes.map((m) => {
                              const modeLabels = {
                                bus: { label: "Bus", icon: Bus },
                                taxi: { label: "Taxi", icon: Car },
                                private: { label: "Private", icon: Car },
                                walk: { label: "Trek", icon: Footprints },
                              };
                              const config = modeLabels[m];
                              const ModeIcon = config.icon;
                              const isModeSelected = selectedMode === m;
                              return (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setSelectedMode(m)}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    isModeSelected
                                      ? "bg-[#B8860B] text-white shadow-sm"
                                      : "text-[#8B6B47] hover:bg-[#B8860B]/5 hover:text-[#B8860B]"
                                  }`}
                                >
                                  <ModeIcon size={12} />
                                  {config.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Dynamic Mode details block */}
                          <div className="bg-[#FFF8E7]/40 border border-[#B8860B]/10 rounded-xl p-3 text-[11px] text-[#2C1810] space-y-2.5">
                            {selectedMode === "bus" && (
                              <>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Fare Cost:</span>
                                  <span className="font-bold text-[#B8860B]">{details.apsrtc}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Frequency:</span>
                                  <span className="font-medium text-slate-700">Every 1-2 minutes, 24/7 links</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#8B6B47]">Traffic / Crowd Inflow:</span>
                                  <span className="font-semibold text-orange-600">{details.traffic} / {details.crowd}</span>
                                </div>
                              </>
                            )}
                            {selectedMode === "taxi" && (
                              <>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Estimated Fare:</span>
                                  <span className="font-bold text-[#B8860B]">{details.taxi}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Availability:</span>
                                  <span className="font-medium text-slate-700">Prepaid booths, 24 Hours</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#8B6B47]">Road Traffic:</span>
                                  <span className="font-semibold text-orange-600">{details.traffic} Inflow</span>
                                </div>
                              </>
                            )}
                            {selectedMode === "private" && (
                              <>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Entry Toll Cost:</span>
                                  <span className="font-bold text-[#B8860B]">{privateToll}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Fuel Cost:</span>
                                  <span className="font-medium text-slate-700">{details.fuel || "N/A"}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Parking Status:</span>
                                  <span className="font-semibold text-slate-700 truncate max-w-[140px]">{details.parking}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#8B6B47]">Ghat Restriction:</span>
                                  <span className="font-semibold text-red-600">No 2-wheelers 10 PM - 5 AM</span>
                                </div>
                              </>
                            )}
                            {selectedMode === "walk" && (
                              <>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Trek Cost:</span>
                                  <span className="font-bold text-green-700">₹0 (Free trek ticket)</span>
                                </div>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Steps & Path:</span>
                                  <span className="font-bold text-slate-700">{details.distance.split(" (")[1]?.replace(")", "") || details.distance}</span>
                                </div>
                                <div className="flex justify-between border-b border-[#B8860B]/5 pb-1">
                                  <span className="text-[#8B6B47]">Luggage Service:</span>
                                  <span className="font-semibold text-green-600">Free transport by TTD</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#8B6B47]">Operational Hours:</span>
                                  <span className="font-semibold text-[#8B4513]">{selectedRoute === "srivarimettu" ? "6:00 AM - 6:00 PM" : "Open 24 Hours"}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Travel Tip Banner */}
                      <div className="p-2.5 bg-[#FFF8E7]/60 border border-[#B8860B]/20 rounded-xl mt-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Compass size={11} className="text-[#B8860B]" />
                          <span className="text-[9px] font-bold text-[#2C1810] uppercase">Smart Travel Tip</span>
                        </div>
                        <p className="text-[9px] text-[#8B6B47] leading-relaxed">
                          {details.recommended}
                        </p>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="bg-[#FFF8E7]/40 border border-[#B8860B]/10 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                    <Navigation size={32} className="text-[#B8860B]/50 animate-bounce mb-3" />
                    <h4 className="font-cinzel font-semibold text-[#2C1810] text-sm">
                      Select Route Checkpoint
                    </h4>
                    <p className="text-xs text-[#8B6B47] mt-1 max-w-[200px]">
                      Click on any starting hub in the terrain map to explore detailed fare charts, travel times, and directions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* --- SECTION 3: TRANSPORT MODE ANALYTICS --- */}
          <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6">
            <div className="border-b border-[#B8860B]/10 pb-4 mb-6">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#B8860B] font-bold block mb-1">
                Section 3
              </span>
              <h3 className="font-cinzel font-bold text-xl text-[#2C1810]">
                Transport Mode Analytics
              </h3>
              <p className="text-xs text-[#8B6B47] mt-0.5">
                Micro-analysis of devotee travel choices and station arrivals based on official Indian Railways and AAI datasets.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-[#B8860B]/10 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <h4 className="font-cinzel font-semibold text-[#2C1810] text-xs mb-4">
                  Estimated Share of Travel Modes
                </h4>
                <div className="h-[180px] w-full relative flex items-center justify-center">
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
                  {transportModeData.map((item, idx) => (
                    <div key={item.name} className="flex flex-col border-l-2 border-[#B8860B]/20 pl-1.5">
                      <span className="truncate font-medium">{item.name}</span>
                      <span className="text-xs font-semibold text-[#2C1810]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

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

          {/* --- SECTION 4: ROUTE COMPARISON ENGINE --- */}
          <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6">
            <div className="border-b border-[#B8860B]/10 pb-4 mb-6">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#B8860B] font-bold block mb-1">
                Section 4
              </span>
              <h3 className="font-cinzel font-bold text-xl text-[#2C1810]">
                Route Comparison Engine
              </h3>
              <p className="text-xs text-[#8B6B47] mt-0.5">
                Side-by-side analysis of various transport modes. Select the metrics that fit your travel profile.
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
                          row.highlight.includes("Family") ? "bg-yellow-55 bg-[#B8860B]/10 text-[#8B4513] border-[#B8860B]/30" :
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

          {/* --- SECTION 5: SEVEN HILLS EXPERIENCE --- */}
          <section className="bg-gradient-to-b from-[#2C1810] to-[#1A0A00] text-white rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent opacity-65 pointer-events-none" />
            
            <div className="text-center mb-8 relative z-10 border-b border-white/10 pb-4">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#D4A843] font-bold block mb-1">
                Section 5
              </span>
              <h3 className="font-cinzel font-bold text-2xl text-white">
                Seven Hills Experience
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Explore the spiritual architecture and sacred geography of the seven peaks representing Adisesha.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-stretch relative z-10">
              <div className="lg:col-span-4 flex flex-col gap-1.5 overflow-y-auto max-h-[380px] pr-2">
                {sevenHills.map((hill, idx) => (
                  <button
                    key={hill.name}
                    onClick={() => setActiveHill(idx)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left group ${
                      activeHill === idx
                        ? "bg-white/10 border-[#D4A843] shadow-md shadow-[#D4A843]/10"
                        : "bg-white/5 border-transparent hover:bg-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${activeHill === idx ? "bg-[#D4A843] animate-pulse" : "bg-white/30"}`} />
                      <span className="font-cinzel text-xs font-semibold tracking-wider text-white">
                        {idx + 1}. {hill.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 group-hover:text-white transition-colors">{hill.height}</span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-500">
                <div className={`absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-gradient-to-br ${sevenHills[activeHill].gradient} blur-[100px] opacity-40 pointer-events-none`} />

                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-cinzel font-bold text-lg text-[#D4A843]">{sevenHills[activeHill].name}</h4>
                      <span className="text-[10px] text-white/50 italic font-medium">{sevenHills[activeHill].meaning}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#D4A843] block">Elevation</span>
                      <span className="text-[10px] text-white/60">{sevenHills[activeHill].height}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs mt-4">
                    <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-[#D4A843] uppercase block mb-1">Spiritual Significance</span>
                        <p className="text-white/80 leading-relaxed font-light">{sevenHills[activeHill].importance}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-[#D4A843] uppercase block mb-1">Historical Legends</span>
                        <p className="text-white/80 leading-relaxed font-light">{sevenHills[activeHill].legends}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-[#D4A843] uppercase block mb-1">Puranic Reference</span>
                        <p className="text-white/80 leading-relaxed font-light">{sevenHills[activeHill].history}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-[#D4A843] uppercase block mb-0.5">Location</span>
                          <span className="text-white/80 font-light text-[11px]">{sevenHills[activeHill].location}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#D4A843] uppercase block mb-0.5">Interesting Fact</span>
                          <span className="text-white/80 font-light text-[11px]">{sevenHills[activeHill].facts}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6">
                  <button
                    onClick={() => setActiveHill((prev) => (prev > 0 ? prev - 1 : sevenHills.length - 1))}
                    className="text-[10px] font-bold text-white/60 hover:text-[#D4A843] transition-colors cursor-pointer"
                  >
                    ◀ Previous Peak
                  </button>
                  <span className="text-[10px] text-white/40">
                    Peak {activeHill + 1} of {sevenHills.length}
                  </span>
                  <button
                    onClick={() => setActiveHill((prev) => (prev < sevenHills.length - 1 ? prev + 1 : 0))}
                    className="text-[10px] font-bold text-white/60 hover:text-[#D4A843] transition-colors cursor-pointer"
                  >
                    Next Peak ▶
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 6: PILGRIM NEWS & ALERT CENTER --- */}
          <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6">
            <div className="border-b border-[#B8860B]/10 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
              <div>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#B8860B] font-bold block mb-1">
                  Section 6
                </span>
                <h3 className="font-cinzel font-bold text-xl text-[#2C1810]">
                  News & Notification Center
                </h3>
                <p className="text-xs text-[#8B6B47] mt-0.5">
                  Real-time transit bulletins, weather warnings, and temple announcements.
                </p>
              </div>
              <div className="flex gap-1 flex-wrap">
                {["All", "APSRTC", "Weather", "Railway", "Emergency"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setNewsFilter(filter)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                      newsFilter === filter
                        ? "bg-[#B8860B] text-white border-transparent"
                        : "bg-white text-[#8B6B47] border-[#B8860B]/20 hover:border-[#B8860B]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FFF8E7] border border-[#B8860B]/15 rounded-xl px-4 py-2.5 mb-6 flex items-center justify-between gap-3 overflow-hidden shadow-inner">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-[9px] font-bold text-red-700 uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  Live Alert
                </span>
              </div>
              <div className="flex-1 overflow-hidden h-4 relative">
                <span className="text-[11px] text-[#8B4513] font-medium transition-all duration-500 ease-in-out absolute w-full block truncate">
                  {newsAlerts[tickerIndex].title}
                </span>
              </div>
              <span className="text-[9px] text-[#8B6B47] font-semibold italic flex-shrink-0">{newsAlerts[tickerIndex].time}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border hover:shadow-md transition-shadow bg-white flex items-start gap-3.5 ${
                    item.type === "emergency" ? "border-red-500/20 bg-red-50/10" :
                    item.type === "alert" ? "border-orange-500/20 bg-orange-50/10" : "border-[#B8860B]/10"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.type === "emergency" ? "bg-red-500/15 text-red-600" :
                    item.type === "alert" ? "bg-orange-500/15 text-orange-600" : "bg-[#B8860B]/10 text-[#B8860B]"
                  }`}>
                    {item.cat === "APSRTC" && <Bus size={15} />}
                    {item.cat === "Weather" && <CloudSun size={15} />}
                    {item.cat === "Temple" && <Award size={15} />}
                    {item.cat === "Railway" && <Train size={15} />}
                    {item.cat === "Emergency" && <AlertTriangle size={15} />}
                    {item.cat === "Airport" && <Plane size={15} />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#B8860B] uppercase tracking-wide">{item.cat} Update</span>
                      <span className="text-[9px] text-[#8B6B47] font-medium">{item.time}</span>
                    </div>
                    <p className="text-xs text-[#2C1810] leading-relaxed font-medium">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- SECTION 7: PILGRIM INSIGHTS DASHBOARD (Admin Logistics Toggle View) --- */}
          {isAdminView && (userRole === "government" || userRole === "temple") && (
            <section className="bg-white/70 backdrop-blur border border-[#B8860B]/20 shadow-2xl rounded-2xl p-6 animate-[fadeIn_0.5s_ease-out]">
              <div className="border-b border-[#B8860B]/10 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-[#8B4513] font-bold block mb-1">
                    Section 7 (Administrative View)
                  </span>
                  <h3 className="font-cinzel font-bold text-xl text-[#2C1810] flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#8B4513]" />
                    Pilgrim Insights & Logistics Forecaster
                  </h3>
                  <p className="text-xs text-[#8B6B47] mt-0.5">
                    Simulate devotee surges to automatically scale required buses, fuel consumption, driver scheduling, and temple resources.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#FFF8E7] px-3.5 py-1.5 rounded-xl border border-[#B8860B]/20">
                  <span className="text-xs font-semibold text-[#8B4513]">Inflow Slider:</span>
                  <span className="font-mono text-sm font-bold text-[#B8860B]">{simulatedDevotees.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-[#FFF8E7] border border-[#B8860B]/15 rounded-xl p-5 shadow-sm space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#2C1810] flex items-center justify-between">
                      <span>Simulate Pilgrim Count (D)</span>
                      <span className="text-[#B8860B]">{simulatedDevotees.toLocaleString()} devotees</span>
                    </label>
                    <input
                      type="range"
                      min="40000"
                      max="150000"
                      step="5000"
                      value={simulatedDevotees}
                      onChange={(e) => setSimulatedDevotees(Number(e.target.value))}
                      className="w-full h-2 bg-[#E6D3B3] rounded-lg appearance-none cursor-pointer accent-[#B8860B]"
                    />
                    <div className="flex justify-between text-[9px] text-[#8B6B47] font-semibold">
                      <span>Low (40k)</span>
                      <span>Normal (65k)</span>
                      <span>Surge (100k)</span>
                      <span>Peak (150k)</span>
                    </div>
                  </div>

                  <div className="border-t border-[#B8860B]/10 pt-4 space-y-3.5 text-xs">
                    <h5 className="font-cinzel font-bold text-[#2C1810] text-[10px] tracking-wide">
                      Model Allocation Rationale
                    </h5>
                    <div className="space-y-2.5 text-[#8B6B47]">
                      <p className="leading-relaxed text-[11px] font-light">
                        • **Buses Needed**: Calculated using $\lceil (0.55 \times D) / 135 \rceil$, assuming 55% mode split and 3 round trips of 45-seater shuttles daily.
                      </p>
                      <p className="leading-relaxed text-[11px] font-light">
                        • **Fuel & Staff**: Assumes average bus mileage of 5 kmpl on hilly road gradients, covering 120km daily per bus, with 2 driver shifts.
                      </p>
                      <p className="leading-relaxed text-[11px] font-light">
                        • **Ancillaries**: Projected at 5% taxi demand and 8% parking turnover per capita devotee volume.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-[#B8860B]/10 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[#8B6B47] uppercase">APSRTC Buses</span>
                        <Bus size={15} className="text-[#B8860B]" />
                      </div>
                      <span className="font-cinzel font-bold text-2xl text-[#2C1810] block">{busesNeeded}</span>
                      <span className="text-[9px] text-[#8B6B47] mt-0.5 block">Active routes this day</span>
                    </div>

                    <div className="p-4 bg-white border border-[#B8860B]/10 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[#8B6B47] uppercase">Driver Staffing</span>
                        <Users size={15} className="text-[#B8860B]" />
                      </div>
                      <span className="font-cinzel font-bold text-2xl text-[#2C1810] block">{driversNeeded}</span>
                      <span className="text-[9px] text-[#8B6B47] mt-0.5 block">Includes 2 shift operators</span>
                    </div>

                    <div className="p-4 bg-white border border-[#B8860B]/10 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[#8B6B47] uppercase">Diesel Required</span>
                        <Activity size={15} className="text-[#B8860B]" />
                      </div>
                      <span className="font-cinzel font-bold text-xl text-[#2C1810] block">{fuelLiters.toLocaleString()} L</span>
                      <span className="text-[9px] text-[#8B6B47] mt-0.5 block">Est. Cost: ₹{fuelCost.toLocaleString()}</span>
                    </div>

                    <div className="p-4 bg-white border border-[#B8860B]/10 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[#8B6B47] uppercase">Taxi Demand</span>
                        <Car size={15} className="text-[#B8860B]" />
                      </div>
                      <span className="font-cinzel font-bold text-2xl text-[#2C1810] block">{taxiFleetNeeded}</span>
                      <span className="text-[9px] text-[#8B6B47] mt-0.5 block">Aggregators + local stands</span>
                    </div>

                    <div className="p-4 bg-white border border-[#B8860B]/10 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[#8B6B47] uppercase">Parking Capacity</span>
                        <MapPin size={15} className="text-[#B8860B]" />
                      </div>
                      <span className="font-cinzel font-bold text-2xl text-[#2C1810] block">{parkingSpaces}</span>
                      <span className="text-[9px] text-[#8B6B47] mt-0.5 block">Spaces needed at Alipiri / top</span>
                    </div>

                    <div className="p-4 bg-white border border-[#B8860B]/10 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[#8B6B47] uppercase">Laddus Required</span>
                        <Award size={15} className="text-[#B8860B]" />
                      </div>
                      <span className="font-cinzel font-bold text-xl text-[#2C1810] block">{prasadProjections.toLocaleString()}</span>
                      <span className="text-[9px] text-[#8B6B47] mt-0.5 block">2.5 units per devotee forecast</span>
                    </div>
                  </div>

                  <div className="bg-[#FFF8E7]/40 border border-[#B8860B]/10 rounded-xl p-5 shadow-sm text-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-[#B8860B]/10 pb-2">
                      <span className="font-cinzel font-bold text-xs text-[#2C1810]">Dynamic Operations Simulation Summary</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        simulatedDevotees >= 100000 ? "bg-red-50 text-red-600 border border-red-200" :
                        simulatedDevotees >= 75000 ? "bg-orange-50 text-orange-600 border border-orange-200" :
                        "bg-green-50 text-green-700 border border-green-200"
                      }`}>
                        {simulatedDevotees >= 100000 ? "CRITICAL THRESHOLD" : simulatedDevotees >= 75000 ? "HEAVY DEMAND" : "STABLE STATE"}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-[#2C1810]">
                        <div className="flex justify-between pb-1 border-b border-[#B8860B]/5">
                          <span className="text-[#8B6B47]">APSRTC Transit Budget</span>
                          <span className="font-mono font-semibold">₹{fuelCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-[#B8860B]/5">
                          <span className="text-[#8B6B47]">Driver shifts roster</span>
                          <span className="font-mono font-semibold">{driversNeeded} operators</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-[#B8860B]/5">
                          <span className="text-[#8B6B47]">Water Consumption</span>
                          <span className="font-mono font-semibold">{(simulatedDevotees * 150 / 1000000).toFixed(2)} MLD</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-[#2C1810]">
                        <div className="flex justify-between pb-1 border-b border-[#B8860B]/5">
                          <span className="text-[#8B6B47]">Peak parking load (cars)</span>
                          <span className="font-mono font-semibold">{parkingSpaces} spaces</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-[#B8860B]/5">
                          <span className="text-[#8B6B47]">Emergency bus pool needed</span>
                          <span className="font-mono font-semibold">{Math.max(0, Math.ceil(busesNeeded * 0.1))} coaches</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-[#B8860B]/5">
                          <span className="text-[#8B6B47]">Sanitation shift strength</span>
                          <span className="font-mono font-semibold">{Math.round(simulatedDevotees * 0.003)} workers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* --- SECTION 8: TRAVEL PLANNER --- */}
          <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6">
            <div className="border-b border-[#B8860B]/10 pb-4 mb-6">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#B8860B] font-bold block mb-1">
                Section 8
              </span>
              <h3 className="font-cinzel font-bold text-xl text-[#2C1810]">
                AI Travel Planner
              </h3>
              <p className="text-xs text-[#8B6B47] mt-0.5">
                Input your location, travel preferences, and budget to receive an optimal, crowd-aware itinerary.
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
                    className="w-full py-2.5 bg-gradient-to-r from-[#B8860B] to-[#D4A843] text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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

          {/* --- SECTION 9: FUTURE SCOPE ROADMAP --- */}
          <section className="bg-[#FFF8E7]/40 border border-[#B8860B]/10 rounded-2xl p-6">
            <div className="border-b border-[#B8860B]/10 pb-3 mb-6">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#B8860B] font-bold block mb-1">
                Section 9
              </span>
              <h4 className="font-cinzel font-bold text-base text-[#2C1810]">Future Scope & Development Roadmap</h4>
              <p className="text-[10px] text-[#8B6B47]">
                Sneak peek into upcoming platform modules scheduled for development.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { phase: "Phase 1.0", title: "Real-Time Tracking", desc: "APSRTC GPS integration for live ghat bus location updates." },
                { phase: "Phase 1.2", title: "Live Crowd Heatmaps", desc: "LiDAR and camera sensor networks to monitor Vaikuntam complexes." },
                { phase: "Phase 1.5", title: "AI Route Optimization", desc: "Automated traffic diversion algorithms during peak festival hours." },
                { phase: "Phase 1.8", title: "Predictive Parking", desc: "Machine Learning models to forecast spot availability at hilltop garages." },
                { phase: "Phase 2.0", title: "Hotel Demand ML", desc: "Advanced occupancy forecasting utilizing machine learning classifiers." },
                { phase: "Phase 2.2", title: "Delay Alerts Integration", desc: "Real-time updates on airport flight status and railway schedule lags." },
                { phase: "Phase 2.5", title: "AR Navigation App", desc: "Augmented Reality helper for devotees inside complex temple sectors." },
                { phase: "Phase 3.0", title: "Digital Twin Models", desc: "Simulations of the entire Tirumala landscape to optimize crowd gates." },
              ].map((item, index) => (
                <div key={index} className="p-3.5 bg-white border border-[#B8860B]/10 rounded-xl flex flex-col justify-between space-y-2 relative group hover:border-[#B8860B]/30 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#B8860B] uppercase tracking-wide bg-[#FFF8E7] px-1.5 py-0.5 rounded border border-[#B8860B]/15">
                      {item.phase}
                    </span>
                    <span className="text-[8px] font-bold text-[#8B6B47] uppercase">Future Scope</span>
                  </div>
                  <div>
                    <h5 className="font-cinzel font-bold text-xs text-[#2C1810] mb-0.5 group-hover:text-[#B8860B] transition-colors">{item.title}</h5>
                    <p className="text-[9px] text-[#8B6B47] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      </div>
    );
}

// ─── Pilgrim Ticket Booking Center Component ─────────────────────────────────
export function PilgrimBookingCenter({ userRole }) {
  const [bookingStep, setBookingStep] = useState(1);
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerAge, setPassengerAge] = useState("");
  const [pickupHub, setPickupHub] = useState("Tirupati Railway Station");
  const [pickupMode, setPickupMode] = useState("TTD Prepaid Sedan");
  const [pickupTime, setPickupTime] = useState("08:00 AM - 10:00 AM");
  const [ascentMode, setAscentMode] = useState("APSRTC Electric Bus");
  const [ascentTime, setAscentTime] = useState("10:00 AM - 12:00 PM");
  const [darshanType, setDarshanType] = useState("₹300 Special Entry Darshan");
  const [darshanTime, setDarshanTime] = useState("02:00 PM - 03:00 PM");
  const [prasadamQty, setPrasadamQty] = useState(2);
  const [bookedReceipt, setBookedReceipt] = useState(null);

  const calculateTotalFare = () => {
    let total = 0;
    
    // Stage 1: Pickup
    if (pickupMode === "TTD Prepaid Sedan") total += 1200;
    else if (pickupMode === "TTD Prepaid SUV") total += 1800;
    
    // Stage 2: Ascent
    if (ascentMode === "APSRTC Electric Bus") total += 90;
    else if (ascentMode === "TTD Authorized Ghat Taxi") total += 1000;
    
    // Stage 3: Darshan & Prasadam
    if (darshanType === "₹300 Special Entry Darshan") total += 300;
    if (prasadamQty > 0) total += prasadamQty * 50; // Extra laddus ₹50 each (first is free)
    
    return total;
  };

  const handleTransitBookingSubmit = (e) => {
    e.preventDefault();
    if (!passengerName || !passengerPhone || !passengerAge) {
      alert("Please fill in all Passenger Information fields in Step 4.");
      return;
    }

    // Generate Visual Receipt Boarding Pass
    const ticketId = "TTD-" + Math.floor(100000 + Math.random() * 900000);
    const receipt = {
      ticketId,
      name: passengerName,
      phone: passengerPhone,
      age: passengerAge,
      pickup: { hub: pickupHub, mode: pickupMode, time: pickupTime },
      ascent: { mode: ascentMode, time: ascentTime },
      darshan: { type: darshanType, time: darshanTime, extraLaddus: prasadamQty },
      totalCost: calculateTotalFare(),
      date: new Date().toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };

    setBookedReceipt(receipt);
    
    // Fire Confetti explosion
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log("Confetti library load error", err);
    }
  };

  const resetTransitBookingForm = () => {
    setBookedReceipt(null);
    setBookingStep(1);
    setPassengerName("");
    setPassengerPhone("");
    setPassengerAge("");
    setPrasadamQty(2);
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2C1810] to-[#1A0A00] text-white rounded-3xl p-8 relative overflow-hidden border border-[#B8860B]/20 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-[#B8860B]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-bold text-[#D4A843] tracking-[0.2em] uppercase border border-[#D4A843]/30 bg-[#D4A843]/10 px-3 py-1 rounded-full w-fit block">
              Seamless Pilgrim Services Portal
            </span>
            <h2 className="font-cinzel font-bold text-3xl text-white leading-tight">
              Unified Sacred journey Terminal
            </h2>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              Reserve airport/railway transfers, hilltop ghat transit options, free luggage handling, and sacred temple entry tickets in a single checkout.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/10 border border-white/15 px-6 py-4 rounded-2xl backdrop-blur text-center">
            <span className="text-[10px] uppercase font-bold text-white/50 block tracking-wider">Dynamic Total Fare</span>
            <span className="font-cinzel font-bold text-3xl text-[#D4A843] block mt-1">₹{calculateTotalFare().toLocaleString()}</span>
            <span className="text-[9px] text-white/40 block mt-1">Inclusive of GST & TTD Cess</span>
          </div>
        </div>
      </div>

      {!bookedReceipt ? (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Booking Forms Stepper */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stepper Tabs Bar */}
            <div className="bg-white border border-[#B8860B]/15 rounded-2xl p-4 shadow-sm grid grid-cols-4 gap-2 text-center text-xs font-semibold text-[#8B6B47]">
              {[
                { step: 1, label: "1. Station Transfer", icon: Car },
                { step: 2, label: "2. Hill Ascent", icon: Bus },
                { step: 3, label: "3. Darshan Slots", icon: Award },
                { step: 4, label: "4. Pilgrim Details", icon: User },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setBookingStep(s.step)}
                  className={`py-3 px-2 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                    bookingStep === s.step
                      ? "bg-[#8B4513] text-white border-transparent font-bold shadow-md"
                      : bookingStep > s.step
                        ? "bg-[#FFF8E7] text-[#B8860B] border-[#B8860B]/20"
                        : "bg-white text-[#8B6B47] border-slate-100 hover:border-[#B8860B]/30"
                  }`}
                >
                  <s.icon size={14} className={bookingStep === s.step ? "text-white" : "text-[#B8860B]"} />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.step}</span>
                </button>
              ))}
            </div>

            {/* --- Step 1 Content --- */}
            {bookingStep === 1 && (
              <div className="bg-white border border-[#B8860B]/15 shadow-md rounded-2xl p-8 space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-[#B8860B]/10 pb-4">
                  <h3 className="font-cinzel font-bold text-xl text-[#2C1810] flex items-center gap-2">
                    <Car size={20} className="text-[#B8860B]" />
                    Step 1: Arrival Terminal / Station Pickup
                  </h3>
                  <p className="text-xs text-[#8B6B47] mt-1">
                    Secure a taxi or shuttle from your arrival point in Tirupati directly to Alipiri Base or hotel.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Select Arrival Hub</label>
                    <select
                      value={pickupHub}
                      onChange={(e) => setPickupHub(e.target.value)}
                      className="w-full p-4 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] font-semibold text-[#2C1810]"
                    >
                      <option>Tirupati Railway Station (TPTY)</option>
                      <option>Tirupati Airport (TBR)</option>
                      <option>Renigunta Junction (RU)</option>
                      <option>APSRTC Bus Stand</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Pickup Time Slot</label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-4 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] font-semibold text-[#2C1810]"
                    >
                      <option>04:00 AM - 06:00 AM (Early Morning)</option>
                      <option>08:00 AM - 10:00 AM (Peak Arrivals)</option>
                      <option>12:00 PM - 02:00 PM (Midday)</option>
                      <option>04:00 PM - 06:00 PM (Evening)</option>
                      <option>08:00 PM - 10:00 PM (Late Night)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#2C1810] block">Choose Transfer Vehicle Type</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { mode: "TTD Prepaid Sedan", desc: "Private AC Cab (4 Seater)", price: "₹1,200", icon: Car },
                      { mode: "TTD Prepaid SUV", desc: "Spacious AC Innova (7 Seater)", price: "₹1,800", icon: Car },
                      { mode: "TTD Free Feeder Bus", desc: "Complimentary shuttle to Alipiri base", price: "Free (₹0)", icon: Bus },
                    ].map((item) => (
                      <div
                        key={item.mode}
                        onClick={() => setPickupMode(item.mode)}
                        className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                          pickupMode === item.mode
                            ? "border-[#B8860B] bg-[#FFF8E7] shadow-md"
                            : "border-slate-100 hover:border-[#B8860B]/30 hover:bg-slate-50"
                        }`}
                      >
                        <item.icon className="text-[#B8860B] mb-3" size={24} />
                        <h5 className="font-bold text-[#2C1810] text-sm">{item.mode}</h5>
                        <p className="text-[10px] text-[#8B6B47] mt-1">{item.desc}</p>
                        <span className="inline-block mt-3 text-xs font-bold text-[#8B4513]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-6 py-3 bg-[#B8860B] text-white text-xs font-bold rounded-xl hover:bg-[#8B4513] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Continue to Hill Ascent <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* --- Step 2 Content --- */}
            {bookingStep === 2 && (
              <div className="bg-white border border-[#B8860B]/15 shadow-md rounded-2xl p-8 space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-[#B8860B]/10 pb-4">
                  <h3 className="font-cinzel font-bold text-xl text-[#2C1810] flex items-center gap-2">
                    <Bus size={20} className="text-[#B8860B]" />
                    Step 2: Ghat Road Hill Ascent Transit
                  </h3>
                  <p className="text-xs text-[#8B6B47] mt-1">
                    Select your transit method up the winding ghat roads or historical footpath stairs from Tirupati to Tirumala.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Departure Time Slot</label>
                    <select
                      value={ascentTime}
                      onChange={(e) => setAscentTime(e.target.value)}
                      className="w-full p-4 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] font-semibold text-[#2C1810]"
                    >
                      <option>05:00 AM - 07:00 AM (Recommended - Clear Hills)</option>
                      <option>09:00 AM - 11:00 AM</option>
                      <option>01:00 PM - 03:00 PM (Sunny climb)</option>
                      <option>05:00 PM - 07:00 PM</option>
                      <option>09:00 PM - 11:00 PM (Night view)</option>
                    </select>
                  </div>

                  <div className="p-4 bg-[#FFF8E7] border border-[#B8860B]/20 rounded-xl flex items-start gap-3">
                    <Info size={16} className="text-[#B8860B] flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] text-[#8B6B47] leading-relaxed">
                      <strong>Baggage Services Alert:</strong> TTD provides **free baggage transportation** from Alipiri base to Tirumala hilltop town for all trekking pilgrims. Safe receipt tags are scanned at the top checking complexes.
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#2C1810] block">Choose Transit Service Mode</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { mode: "APSRTC Electric Bus", desc: "Green ecofriendly fleet, continuous departures every 2 mins.", price: "₹90", icon: Bus },
                      { mode: "TTD Authorized Ghat Taxi", desc: "Shared or private local taxi with certified hill drivers.", price: "₹1,000", icon: Car },
                      { mode: "Alipiri Footpath Walk", desc: "Sacred trek via 3,550 steps. Takes ~4 hours. Luggage sent up free.", price: "Free (₹0)", icon: Footprints },
                    ].map((item) => (
                      <div
                        key={item.mode}
                        onClick={() => setAscentMode(item.mode)}
                        className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                          ascentMode === item.mode
                            ? "border-[#B8860B] bg-[#FFF8E7] shadow-md"
                            : "border-slate-100 hover:border-[#B8860B]/30 hover:bg-slate-50"
                        }`}
                      >
                        <item.icon className="text-[#B8860B] mb-3" size={24} />
                        <h5 className="font-bold text-[#2C1810] text-sm">{item.mode}</h5>
                        <p className="text-[10px] text-[#8B6B47] mt-1">{item.desc}</p>
                        <span className="inline-block mt-3 text-xs font-bold text-[#8B4513]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="px-5 py-3 border border-[#B8860B] text-[#B8860B] text-xs font-bold rounded-xl hover:bg-[#FFF8E7] transition-all cursor-pointer"
                  >
                    ◀ Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-6 py-3 bg-[#B8860B] text-white text-xs font-bold rounded-xl hover:bg-[#8B4513] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Continue to Darshan <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* --- Step 3 Content --- */}
            {bookingStep === 3 && (
              <div className="bg-white border border-[#B8860B]/15 shadow-md rounded-2xl p-8 space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-[#B8860B]/10 pb-4">
                  <h3 className="font-cinzel font-bold text-xl text-[#2C1810] flex items-center gap-2">
                    <Award size={20} className="text-[#B8860B]" />
                    Step 3: Temple Darshan Ticket & Prasadam
                  </h3>
                  <p className="text-xs text-[#8B6B47] mt-1">
                    Select your entry pass category, preferred temple reporting time slot, and extra prasad laddus.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Darshan Report Time Slot</label>
                    <select
                      value={darshanTime}
                      onChange={(e) => setDarshanTime(e.target.value)}
                      className="w-full p-4 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] font-semibold text-[#2C1810]"
                    >
                      <option>08:00 AM - 09:00 AM</option>
                      <option>11:00 AM - 12:00 PM</option>
                      <option>02:00 PM - 03:00 PM (Recommended - Optimal Queues)</option>
                      <option>05:00 PM - 06:00 PM</option>
                      <option>08:00 PM - 09:00 PM</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Extra Prasadam Laddus (₹50 each)</label>
                    <select
                      value={prasadamQty}
                      onChange={(e) => setPrasadamQty(Number(e.target.value))}
                      className="w-full p-4 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] font-semibold text-[#2C1810]"
                    >
                      <option value="0">No Extra (Only 1 Free Laddu included)</option>
                      <option value="2">2 Extra Laddus (+₹100)</option>
                      <option value="4">4 Extra Laddus (+₹200)</option>
                      <option value="6">6 Extra Laddus (+₹300)</option>
                      <option value="10">10 Extra Laddus (+₹500)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#2C1810] block">Choose Entry Pass Tier</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { type: "₹300 Special Entry Darshan", desc: "VIP queues. Typical waiting time 1.5h - 2.5h. Laddus included.", price: "₹300", icon: Award },
                      { type: "Sarvadarsanam (Free)", desc: "General queue walk-in. Waiting time 4h - 8h. 1 free Laddu.", price: "Free (₹0)", icon: Users },
                      { type: "Divya Darshan (Trekkers)", desc: "For footpath pilgrims. Waiting time 3h - 5h. 1 free Laddu.", price: "Free (₹0)", icon: Footprints },
                    ].map((item) => (
                      <div
                        key={item.type}
                        onClick={() => setDarshanType(item.type)}
                        className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                          darshanType === item.type
                            ? "border-[#B8860B] bg-[#FFF8E7] shadow-md"
                            : "border-slate-100 hover:border-[#B8860B]/30 hover:bg-slate-50"
                        }`}
                      >
                        <item.icon className="text-[#B8860B] mb-3" size={24} />
                        <h5 className="font-bold text-[#2C1810] text-sm">{item.type}</h5>
                        <p className="text-[10px] text-[#8B6B47] mt-1">{item.desc}</p>
                        <span className="inline-block mt-3 text-xs font-bold text-[#8B4513]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-5 py-3 border border-[#B8860B] text-[#B8860B] text-xs font-bold rounded-xl hover:bg-[#FFF8E7] transition-all cursor-pointer"
                  >
                    ◀ Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(4)}
                    className="px-6 py-3 bg-[#B8860B] text-white text-xs font-bold rounded-xl hover:bg-[#8B4513] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Continue to Passenger Details <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* --- Step 4 Content --- */}
            {bookingStep === 4 && (
              <div className="bg-white border border-[#B8860B]/15 shadow-md rounded-2xl p-8 space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-[#B8860B]/10 pb-4">
                  <h3 className="font-cinzel font-bold text-xl text-[#2C1810] flex items-center gap-2">
                    <User size={20} className="text-[#B8860B]" />
                    Step 4: Primary Pilgrim Information
                  </h3>
                  <p className="text-xs text-[#8B6B47] mt-1">
                    Please enter valid personal identification details to generate your QR journey boarding pass.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        placeholder="Venkatesh Sharma"
                        required
                        className="w-full pl-10 pr-4 py-3.5 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] text-[#2C1810] font-semibold"
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8860B]/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Mobile Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-10 pr-4 py-3.5 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] text-[#2C1810] font-semibold"
                      />
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8860B]/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#2C1810] block">Age</label>
                    <input
                      type="number"
                      value={passengerAge}
                      onChange={(e) => setPassengerAge(e.target.value)}
                      placeholder="38"
                      required
                      min="1"
                      max="110"
                      className="w-full px-4 py-3.5 border border-[#B8860B]/20 rounded-xl bg-white text-sm focus:outline-none focus:border-[#B8860B] text-[#2C1810] font-semibold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#FFF8E7] border border-[#B8860B]/15 rounded-xl flex items-start gap-3 mt-4">
                  <Shield size={16} className="text-[#B8860B] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#8B6B47] leading-relaxed">
                    I hereby declare that the details provided are correct and I will carry official Government ID (Aadhaar, Passport, Voter ID) for verification at the Vaikuntam checkpost complexes on hilltop.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-5 py-3 border border-[#B8860B] text-[#B8860B] text-xs font-bold rounded-xl hover:bg-[#FFF8E7] transition-all cursor-pointer"
                  >
                    ◀ Back
                  </button>
                  <button
                    type="button"
                    onClick={handleTransitBookingSubmit}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#8B4513] to-[#B8860B] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CheckCircle size={14} /> Confirm & Book Journey Pass
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Dynamic Booking Summary Cart */}
          <div className="lg:col-span-4 bg-white/70 backdrop-blur border border-[#B8860B]/15 rounded-2xl p-6 shadow-lg space-y-6">
            <div>
              <h4 className="font-cinzel font-bold text-base text-[#2C1810] border-b border-[#B8860B]/10 pb-2">
                Sacred Journey Summary
              </h4>
              <p className="text-[10px] text-[#8B6B47] mt-1">Live calculations based on selected parameters</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Segment 1 */}
              <div className="space-y-1 bg-[#FFF8E7]/50 p-3 rounded-xl border border-[#B8860B]/10">
                <span className="text-[9px] font-bold text-[#8B6B47] uppercase block">Segment 1: Station Pick-up</span>
                <div className="flex justify-between text-[#2C1810] font-semibold mt-1">
                  <span>{pickupMode}</span>
                  <span className="text-[#8B4513]">{pickupMode.includes("Sedan") ? "₹1,200" : pickupMode.includes("SUV") ? "₹1,800" : "Free"}</span>
                </div>
                <span className="text-[9px] text-[#8B6B47] block italic">From: {pickupHub} · Slot: {pickupTime.split(" ")[0]}</span>
              </div>

              {/* Segment 2 */}
              <div className="space-y-1 bg-[#FFF8E7]/50 p-3 rounded-xl border border-[#B8860B]/10">
                <span className="text-[9px] font-bold text-[#8B6B47] uppercase block">Segment 2: Hill Ascent Transit</span>
                <div className="flex justify-between text-[#2C1810] font-semibold mt-1">
                  <span>{ascentMode}</span>
                  <span className="text-[#8B4513]">{ascentMode.includes("Electric") ? "₹90" : ascentMode.includes("Taxi") ? "₹1,000" : "Free"}</span>
                </div>
                <span className="text-[9px] text-[#8B6B47] block italic">Reporting at base: {ascentTime.split(" ")[0]}</span>
              </div>

              {/* Segment 3 */}
              <div className="space-y-1 bg-[#FFF8E7]/50 p-3 rounded-xl border border-[#B8860B]/10">
                <span className="text-[9px] font-bold text-[#8B6B47] uppercase block">Segment 3: Temple Entry</span>
                <div className="flex justify-between text-[#2C1810] font-semibold mt-1">
                  <span>{darshanType}</span>
                  <span className="text-[#8B4513]">{darshanType.includes("300") ? "₹300" : "Free"}</span>
                </div>
                <span className="text-[9px] text-[#8B6B47] block italic">Sanctum reporting slot: {darshanTime.split(" ")[0]}</span>
              </div>

              {/* Segment 4: Prasadam */}
              {prasadamQty > 0 && (
                <div className="space-y-1 bg-[#FFF8E7]/50 p-3 rounded-xl border border-[#B8860B]/10">
                  <span className="text-[9px] font-bold text-[#8B6B47] uppercase block">Ancillaries: Extra Laddus</span>
                  <div className="flex justify-between text-[#2C1810] font-semibold mt-1">
                    <span>{prasadamQty} Extra Laddus</span>
                    <span className="text-[#8B4513]">₹{prasadamQty * 50}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#B8860B]/15 pt-4 space-y-2">
              <div className="flex justify-between items-center font-cinzel font-bold text-[#2C1810] text-sm">
                <span>Est. Total Cost:</span>
                <span className="text-xl text-[#B8860B]">₹{calculateTotalFare().toLocaleString()}</span>
              </div>
              <p className="text-[9px] text-[#8B6B47] leading-relaxed italic text-center">
                *Fares are simulated based on standard TTD transport vendor rates.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Boarding Pass Receipt */
        <div className="max-w-2xl mx-auto bg-white border-2 border-[#B8860B]/30 shadow-2xl rounded-3xl p-6 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
          <div className="absolute -left-20 -top-20 w-44 h-44 rounded-full bg-[#B8860B]/5 border border-[#B8860B]/10 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-44 h-44 rounded-full bg-[#8B4513]/5 border border-[#8B4513]/10 pointer-events-none" />

          <div className="text-center border-b border-[#B8860B]/20 pb-4 mb-6">
            <span className="text-[#B8860B] text-xs font-cinzel font-bold tracking-widest block">TIRUMALA TIRUPATI DEVASTHANAMS</span>
            <h3 className="font-cinzel font-bold text-xl text-[#2C1810] mt-1 flex items-center justify-center gap-1.5">
              <CheckCircle className="text-green-600" size={20} />
              UNIFIED SACRED JOURNEY PASS
            </h3>
            <span className="text-[9px] text-[#8B6B47] font-semibold block tracking-wider mt-1">JOURNEY DATE: {bookedReceipt.date.toUpperCase()}</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-xs text-[#2C1810] border-b border-dashed border-[#B8860B]/20 pb-6 mb-6">
            <div className="flex flex-col items-center justify-center bg-[#FFF8E7] rounded-2xl p-4 border border-[#B8860B]/15">
              <QrCode size={100} className="text-[#2C1810]" />
              <span className="font-mono font-bold text-sm tracking-wider text-[#B8860B] mt-3 block">{bookedReceipt.ticketId}</span>
              <span className="text-[8px] text-[#8B6B47] uppercase tracking-widest mt-0.5">Scan at checkpost</span>
            </div>

            <div className="md:col-span-2 space-y-3.5 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-[#8B6B47] uppercase block font-medium">Pilgrim Name</span>
                  <span className="text-sm font-bold text-[#2C1810]">{bookedReceipt.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8B6B47] uppercase block font-medium">Contact Phone</span>
                  <span className="text-sm font-semibold text-[#2C1810]">{bookedReceipt.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-[#8B6B47] uppercase block font-medium">Pilgrim Age</span>
                  <span className="text-xs font-semibold text-[#2C1810]">{bookedReceipt.age} years</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8B6B47] uppercase block font-medium">Total Charge paid</span>
                  <span className="text-sm font-bold text-[#8B4513]">₹{bookedReceipt.totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-[#FFF8E7]/60 rounded-xl border border-[#B8860B]/10">
                <span className="text-[8px] font-bold text-[#B8860B] uppercase block">Service Package Summary</span>
                <p className="text-[10px] text-[#8B6B47] leading-relaxed mt-1">
                  Pickup via **{bookedReceipt.pickup.mode}** from **{bookedReceipt.pickup.hub}** (Slot: {bookedReceipt.pickup.time}). Hill ascent via **{bookedReceipt.ascent.mode}** (Slot: {bookedReceipt.ascent.time}).
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[9px] font-bold text-[#8B6B47] uppercase block tracking-wider">Scheduled Journey Segments Checklist</span>
            
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="border border-green-200 bg-green-50/10 p-3 rounded-xl">
                <span className="text-[8px] font-bold text-green-700 uppercase block">1. Terminal Pickup</span>
                <span className="text-xs font-bold text-[#2C1810] block mt-0.5">{bookedReceipt.pickup.mode}</span>
                <span className="text-[9px] text-[#8B6B47] block mt-1">Slot: {bookedReceipt.pickup.time.split(" ")[0]}</span>
                <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[8px] rounded">Confirmed</span>
              </div>

              <div className="border border-green-200 bg-green-50/10 p-3 rounded-xl">
                <span className="text-[8px] font-bold text-green-700 uppercase block">2. Ghat Road Transit</span>
                <span className="text-xs font-bold text-[#2C1810] block mt-0.5">{bookedReceipt.ascent.mode}</span>
                <span className="text-[9px] text-[#8B6B47] block mt-1">Slot: {bookedReceipt.ascent.time.split(" ")[0]}</span>
                <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[8px] rounded">Confirmed</span>
              </div>

              <div className="border border-green-200 bg-green-50/10 p-3 rounded-xl">
                <span className="text-[8px] font-bold text-green-700 uppercase block">3. Temple Sanctum Entry</span>
                <span className="text-xs font-bold text-[#2C1810] block mt-0.5">{bookedReceipt.darshan.type.split(" ")[0] + " Darshan"}</span>
                <span className="text-[9px] text-[#8B6B47] block mt-1">Slot: {bookedReceipt.darshan.time.split(" ")[0]}</span>
                <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[8px] rounded">Confirmed</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[#B8860B]/10 pt-4 text-[9px] text-[#8B6B47] space-y-1">
            <p>• Please report at the respective transfer stands 15 minutes prior to your scheduled timings.</p>
            <p>• Handover luggage at Alipiri/Mettu counters under this pass reference tag to receive bags on top.</p>
            <p>• Traditional attire (Dhoti/Kurta for men, Saree/Salwar for women) is mandatory for temple entry.</p>
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t border-[#B8860B]/20">
            <button
              onClick={resetTransitBookingForm}
              className="px-4 py-2 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
            >
              Cancel / Reset Bookings
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { window.print(); }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Print Pass
              </button>
              <button
                onClick={resetTransitBookingForm}
                className="px-5 py-2.5 bg-[#8B4513] hover:bg-[#6B3410] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Book Another Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
