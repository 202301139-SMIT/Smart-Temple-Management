import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Sun,
  CloudRain,
  Wind,
  Users,
  Clock,
  Calendar,
  Hotel,
  Shield,
  Droplets,
  Brain,
  TrendingUp,
  TrendingDown,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  LogIn,
  BarChart2,
  Cpu,
  Bell,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Building2,
  Truck,
  Navigation,
  Award,
  Activity,
  AlertTriangle,
  Leaf,
  Compass,
  Ticket,
} from "lucide-react";

// ─── 3D and Interactive Dashboard Component Imports ──────────────────────
import Tilt3DCard from "./components/3d/Tilt3DCard";
import TempleAdvisoryCard from "./components/3d/TempleAdvisoryCard";
import QueueIsometric3D from "./components/3d/QueueIsometric3D";
import InteractiveWaitSimulator from "./components/dashboard/InteractiveWaitSimulator";
import TempleResourceRadar from "./components/dashboard/TempleResourceRadar";
import CrowdCorrelationChart from "./components/dashboard/CrowdCorrelationChart";
import ServiceSpecificAnalytics from "./components/dashboard/ServiceSpecificAnalytics";
import PilgrimIntelligenceCenter, { PilgrimBookingCenter, PilgrimNews, FutureScopeRoadmap } from "./components/dashboard/PilgrimIntelligenceCenter";
import TravelAssistant from "./components/dashboard/TravelAssistant";
import SacredPlaces from "./components/dashboard/SacredPlaces";


// ─── Chart Data ──────────────────────────────────────────────────────────────
const crowdData = [
  { day: "Mon", pilgrims: 12400, forecast: 13000 },
  { day: "Tue", pilgrims: 15200, forecast: 15800 },
  { day: "Wed", pilgrims: 9800, forecast: 10200 },
  { day: "Thu", pilgrims: 18600, forecast: 19000 },
  { day: "Fri", pilgrims: 22400, forecast: 23100 },
  { day: "Sat", pilgrims: 31000, forecast: 32500 },
  { day: "Sun", pilgrims: 28700, forecast: 29400 },
];

const occupancyData = [
  { month: "Jan", occupied: 72, forecast: 76 },
  { month: "Feb", occupied: 68, forecast: 71 },
  { month: "Mar", occupied: 85, forecast: 88 },
  { month: "Apr", occupied: 91, forecast: 93 },
  { month: "May", occupied: 78, forecast: 80 },
  { month: "Jun", occupied: 95, forecast: 96 },
];

const travelDemandData = [
  { route: "Chennai", buses: 42, cars: 128, forecast: 185 },
  { route: "Bangalore", buses: 35, cars: 96, forecast: 142 },
  { route: "Hyderabad", buses: 28, cars: 84, forecast: 120 },
  { route: "Mumbai", buses: 18, cars: 62, forecast: 88 },
  { route: "Delhi", buses: 12, cars: 44, forecast: 62 },
];

const templeWeeklyData = [
  { week: "W1 Jun", actual: 142000, predicted: 148000, capacity: 160000 },
  { week: "W2 Jun", actual: 168000, predicted: 172000, capacity: 160000 },
  { week: "W3 Jun", actual: 155000, predicted: 158000, capacity: 160000 },
  { week: "W4 Jun", actual: 189000, predicted: 194000, capacity: 160000 },
];

// ─── Image URLs ───────────────────────────────────────────────────────────────
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1741003412854-bd4b264c4af3?w=1800&h=900&fit=crop&auto=format",
  about:
    "https://images.unsplash.com/photo-1777816267877-e66ed4b32c10?w=900&h=700&fit=crop&auto=format",
  login:
    "https://images.unsplash.com/photo-1705723116788-d11fa6e3f415?w=900&h=1100&fit=crop&auto=format",
  register:
    "https://images.unsplash.com/photo-1741003411268-2462dd845d26?w=900&h=1100&fit=crop&auto=format",
  crowd:
    "https://images.unsplash.com/photo-1713001075225-8c490e800e29?w=900&h=600&fit=crop&auto=format",
  temple2:
    "https://images.unsplash.com/photo-1733805569204-41768c7d8c0f?w=800&h=600&fit=crop&auto=format",
};

// ─── Shared Components ────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B8860B]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B8860B]" />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center justify-center mb-4">
      <span className="text-xs tracking-[0.25em] uppercase text-[#B8860B] font-medium px-4 py-1.5 border border-[#B8860B]/30 rounded-full bg-[#B8860B]/5">
        {children}
      </span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <Tilt3DCard maxTilt={10} className="rounded-2xl h-full">
      <div
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#B8860B]/10 hover:shadow-lg hover:border-[#B8860B]/30 transition-all duration-300 group h-full"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B8860B]/10 to-[#8B4513]/10 flex items-center justify-center mb-4 group-hover:from-[#B8860B]/20 group-hover:to-[#8B4513]/20 transition-colors">
          <Icon size={22} className="text-[#B8860B]" />
        </div>
        <h4 className="font-cinzel font-semibold text-[#2C1810] mb-2 text-sm">
          {title}
        </h4>
        <p className="text-[#8B6B47] text-sm leading-relaxed">{description}</p>
      </div>
    </Tilt3DCard>
  );
}

function StatBadge({ value, label, trend }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl px-4 py-3 border border-[#B8860B]/15 text-center">
      <div className="flex items-center justify-center gap-1">
        <span className="font-cinzel font-bold text-xl text-[#B8860B]">
          {value}
        </span>
        {trend === "up" && <TrendingUp size={14} className="text-green-600" />}
        {trend === "down" && (
          <TrendingDown size={14} className="text-red-500" />
        )}
      </div>
      <span className="text-xs text-[#8B6B47] mt-0.5 block">{label}</span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDashboard = ["pilgrim", "hotel", "travel", "temple", "booking_center", "travel_assistant", "sacred_places"].includes(
    currentPage,
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isDashboard
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#B8860B]/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <button
          onClick={() => setPage("landing")}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B4513] flex items-center justify-center">
            <span className="text-white text-xs font-cinzel font-bold">
              TTD
            </span>
          </div>
          <span
            className={`font-cinzel font-semibold text-sm tracking-wide ${scrolled || isDashboard ? "text-[#2C1810]" : "text-white"}`}
          >
            Smart Pilgrimage
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {isDashboard ? (
            <>
              {["pilgrim", "booking_center", "travel_assistant", "sacred_places", "hotel", "travel", "temple"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`text-xs tracking-wider uppercase font-medium transition-colors ${
                    currentPage === p
                      ? "text-[#B8860B]"
                      : "text-[#8B6B47] hover:text-[#B8860B]"
                  }`}
                >
                  {p === "temple"
                    ? "Temple Mgmt"
                    : p === "travel"
                      ? "Travel Agency"
                      : p === "booking_center"
                        ? "Ticket & Services"
                        : p === "travel_assistant"
                          ? "Travel Assistant"
                          : p === "sacred_places"
                            ? "Sacred Place's"
                            : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setPage("landing")}
                className="text-xs tracking-wider uppercase font-medium text-[#8B6B47] hover:text-[#B8860B] transition-colors"
              >
                Home
              </button>
            </>
          ) : (
            <>
              <button
                className={`text-sm font-medium transition-colors ${scrolled ? "text-[#5C3A1E]" : "text-white/90"} hover:text-[#B8860B]`}
              >
                Features
              </button>
              <button
                className={`text-sm font-medium transition-colors ${scrolled ? "text-[#5C3A1E]" : "text-white/90"} hover:text-[#B8860B]`}
              >
                Solutions
              </button>
              <button
                className={`text-sm font-medium transition-colors ${scrolled ? "text-[#5C3A1E]" : "text-white/90"} hover:text-[#B8860B]`}
              >
                About
              </button>
              <button
                onClick={() => setPage("login")}
                className="flex items-center gap-1.5 text-sm font-medium text-[#B8860B] hover:text-[#8B4513] transition-colors"
              >
                <LogIn size={14} /> Login
              </button>
              <button
                onClick={() => setPage("register")}
                className="px-4 py-2 rounded-full bg-[#B8860B] text-white text-sm font-medium hover:bg-[#8B4513] transition-colors shadow-sm"
              >
                Register
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <X size={22} className="text-[#2C1810]" />
          ) : (
            <Menu
              size={22}
              className={scrolled ? "text-[#2C1810]" : "text-white"}
            />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#B8860B]/15 px-6 py-4 flex flex-col gap-3">
          <button
            onClick={() => {
              setPage("login");
              setMenuOpen(false);
            }}
            className="text-sm text-[#5C3A1E] font-medium text-left"
          >
            Login
          </button>
          <button
            onClick={() => {
              setPage("register");
              setMenuOpen(false);
            }}
            className="text-sm text-[#B8860B] font-semibold text-left"
          >
            Register
          </button>
          <button
            onClick={() => {
              setPage("pilgrim");
              setMenuOpen(false);
            }}
            className="text-sm text-[#5C3A1E] text-left"
          >
            Pilgrim Dashboard
          </button>
          <button
            onClick={() => {
              setPage("travel_assistant");
              setMenuOpen(false);
            }}
            className="text-sm text-[#5C3A1E] text-left"
          >
            Travel Assistant
          </button>
          <button
            onClick={() => {
              setPage("sacred_places");
              setMenuOpen(false);
            }}
            className="text-sm text-[#5C3A1E] text-left"
          >
            Sacred Place's
          </button>
          <button
            onClick={() => {
              setPage("hotel");
              setMenuOpen(false);
            }}
            className="text-sm text-[#5C3A1E] text-left"
          >
            Hotel Dashboard
          </button>
          <button
            onClick={() => {
              setPage("travel");
              setMenuOpen(false);
            }}
            className="text-sm text-[#5C3A1E] text-left"
          >
            Travel Dashboard
          </button>
          <button
            onClick={() => {
              setPage("temple");
              setMenuOpen(false);
            }}
            className="text-sm text-[#5C3A1E] text-left"
          >
            Temple Dashboard
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function HeroSection({ setPage }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[#3B1F0A]">
        <img
          src={IMAGES.hero}
          alt="Tirupati Balaji Temple"
          className="w-full h-full object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A00]/80 via-[#2C1810]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A00]/60 via-transparent to-transparent" />
      </div>

      {/* Decorative gold pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#B8860B]/8 blur-[120px]" />
      <div className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full bg-[#D4A843]/6 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B8860B]/40 bg-[#B8860B]/10 backdrop-blur mb-8">
              <Sparkles size={12} className="text-[#D4A843]" />
              <span className="text-[#D4A843] text-xs tracking-[0.2em] uppercase font-medium">
                AI-Powered Pilgrimage Intelligence
              </span>
            </div>

            <h1 className="font-cinzel font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.15] mb-6">
              Smart Pilgrimage Planning for a Better{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A843] to-[#F0C060]">
                Tirupati Experience
              </span>
            </h1>

            <p className="text-white/75 text-base md:text-lg leading-relaxed mb-10 max-w-xl font-light">
              Leveraging Artificial Intelligence and Predictive Analytics to help
              pilgrims, hotels, travel agencies, and temple administrators prepare
              for future visitor demand and enhance the overall pilgrimage
              experience.
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <button
                onClick={() => setPage("pilgrim")}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A843] text-white font-semibold text-sm hover:shadow-xl hover:shadow-[#B8860B]/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Plan Your Visit
              </button>
              <button
                onClick={() => setPage("register")}
                className="px-7 py-3.5 rounded-full bg-white/10 backdrop-blur border border-white/25 text-white font-medium text-sm hover:bg-white/20 transition-all duration-200"
              >
                Register
              </button>
              <button
                onClick={() => setPage("login")}
                className="px-7 py-3.5 rounded-full border border-[#D4A843]/50 text-[#D4A843] font-medium text-sm hover:bg-[#D4A843]/10 transition-all duration-200 flex items-center gap-2"
              >
                <LogIn size={14} /> Login
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBadge value="50K+" label="Daily Pilgrims" trend="up" />
              <StatBadge value="94%" label="Forecast Accuracy" trend="up" />
              <StatBadge value="400+" label="Hotel Partners" />
              <StatBadge value="12 Crore" label="Annual Visitors" />
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div className="w-full max-w-[380px] animate-[float_6s_ease-in-out_infinite]">
              <TempleAdvisoryCard />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/40 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown size={16} className="text-white/40" />
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-24 bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={IMAGES.about}
                alt="Tirupati Temple illuminated at night"
                className="w-full h-[520px] object-cover"
              />

              <div className="absolute inset-0 rounded-3xl ring-1 ring-[#B8860B]/20" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-[#B8860B]/15 max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={16} className="text-[#B8860B]" />
                <span className="text-xs font-cinzel font-semibold text-[#2C1810]">
                  AI Forecast
                </span>
              </div>
              <div className="text-2xl font-cinzel font-bold text-[#B8860B]">
                98,400
              </div>
              <div className="text-xs text-[#8B6B47]">
                Predicted this weekend
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-[#F5EDD8] overflow-hidden">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A843]" />
              </div>
              <div className="text-xs text-[#B8860B] mt-1">82% capacity</div>
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <SectionLabel>About the Platform</SectionLabel>
            <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#2C1810] leading-tight mb-4">
              Transforming Pilgrimage Planning Through Intelligence
            </h2>
            <GoldDivider />
            <p className="text-[#5C3A1E] leading-relaxed mb-6 mt-4">
              Our platform combines crowd forecasting, resource planning, and
              AI-powered recommendations to support every stakeholder in the
              Tirupati pilgrimage ecosystem.
            </p>
            <p className="text-[#8B6B47] leading-relaxed mb-8">
              By analyzing historical visitor trends and predictive models, we
              provide actionable insights that help pilgrims plan their journey,
              assist accommodation providers in managing occupancy, support
              travel agencies in preparing transportation services, and enable
              temple administrators to optimize operational resources.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Pilgrims Served", value: "12 Crore/yr" },
                { icon: Brain, label: "AI Accuracy", value: "94%" },
                { icon: Building2, label: "Hotel Partners", value: "400+" },
                { icon: Truck, label: "Transport Partners", value: "150+" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#B8860B]/10"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#B8860B]" />
                  </div>
                  <div>
                    <div className="font-cinzel font-bold text-[#2C1810] text-sm">
                      {value}
                    </div>
                    <div className="text-xs text-[#8B6B47]">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PilgrimFeaturesSection({ setPage }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>For Pilgrims</SectionLabel>
          <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#2C1810] mt-2 mb-4">
            Designed for Every Pilgrim
          </h2>
          <GoldDivider />
          <p className="text-[#8B6B47] max-w-xl mx-auto mt-4 leading-relaxed">
            Plan your spiritual journey with confidence through intelligent
            crowd predictions and personalized travel guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Users,
              title: "Crowd Forecasting",
              description:
                "Real-time AI predictions of pilgrim density by hour, day, and season to help you time your visit perfectly.",
            },
            {
              icon: Calendar,
              title: "Best Time to Visit",
              description:
                "Personalized visit windows based on your preferences, reducing wait times and enhancing spiritual experience.",
            },
            {
              icon: Clock,
              title: "Expected Waiting Time",
              description:
                "Accurate darshan queue estimates ranging from a few minutes to several hours, updated hourly.",
            },
            {
              icon: Sun,
              title: "Weather Insights",
              description:
                "7-day forecasts for Tirumala Hills to help you pack appropriately and plan outdoor activities.",
            },
            {
              icon: Brain,
              title: "AI Travel Assistant",
              description:
                "Conversational AI that answers all pilgrimage-related queries, from accommodation to rituals.",
            },
            {
              icon: Star,
              title: "Personalized Recommendations",
              description:
                "Tailored suggestions for accommodation, routes, sevas, and nearby attractions based on your journey history.",
            },
          ].map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 60} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setPage("pilgrim")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B8860B] text-white text-sm font-medium hover:bg-[#8B4513] transition-colors"
          >
            Explore Pilgrim Dashboard <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

function HotelSection({ setPage }) {
  return (
    <section className="py-24 bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>For Hotels & Accommodation</SectionLabel>
            <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#2C1810] mb-4">
              Helping Hotels Prepare Ahead
            </h2>
            <GoldDivider />
            <p className="text-[#8B6B47] leading-relaxed mt-4 mb-8">
              Forecast-driven insights allow accommodation providers to
              anticipate visitor demand, improve room utilization, optimize
              staffing requirements, and deliver a better guest experience
              during peak pilgrimage periods.
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: TrendingUp,
                  title: "Occupancy Forecasting",
                  desc: "14-day demand predictions by room type",
                },
                {
                  icon: BarChart2,
                  title: "Demand Prediction",
                  desc: "AI-driven booking volume estimates",
                },
                {
                  icon: Users,
                  title: "Staffing Recommendations",
                  desc: "Auto-generated staff allocation plans",
                },
                {
                  icon: Brain,
                  title: "AI Business Insights",
                  desc: "Revenue optimization suggestions",
                },
                {
                  icon: Activity,
                  title: "Booking Trend Analysis",
                  desc: "Source, channel, and segment analytics",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#B8860B]/10 hover:border-[#B8860B]/25 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={14} className="text-[#B8860B]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2C1810]">
                      {title}
                    </div>
                    <div className="text-xs text-[#8B6B47] mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage("hotel")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#B8860B] text-[#B8860B] text-sm font-medium hover:bg-[#B8860B] hover:text-white transition-colors"
            >
              Hotel Partner Dashboard <ArrowRight size={14} />
            </button>
          </div>

          <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-[#B8860B]/10">
            <div className="mb-6">
              <h3 className="font-cinzel font-semibold text-[#2C1810] mb-1">
                Occupancy Forecast — June 2025
              </h3>
              <p className="text-xs text-[#8B6B47]">
                Actual vs AI-Predicted occupancy rate (%)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B8860B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#8B6B47" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#8B6B47" }}
                  domain={[60, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #B8860B30",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="occupied"
                  stroke="#B8860B"
                  fill="url(#occGrad)"
                  strokeWidth={2}
                  name="Actual %"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#8B4513"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Forecast %"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-[#FFF8E7] rounded-xl">
                <div className="font-cinzel font-bold text-[#B8860B] text-lg">
                  91%
                </div>
                <div className="text-xs text-[#8B6B47]">Peak Month</div>
              </div>
              <div className="text-center p-3 bg-[#FFF8E7] rounded-xl">
                <div className="font-cinzel font-bold text-[#B8860B] text-lg">
                  +18%
                </div>
                <div className="text-xs text-[#8B6B47]">vs Last Year</div>
              </div>
              <div className="text-center p-3 bg-[#FFF8E7] rounded-xl">
                <div className="font-cinzel font-bold text-[#B8860B] text-lg">
                  ₹4.2L
                </div>
                <div className="text-xs text-[#8B6B47]">Avg Monthly Rev</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TravelAgencySection({ setPage }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative bg-[#FFF8E7] rounded-3xl p-8 border border-[#B8860B]/10">
            <h3 className="font-cinzel font-semibold text-[#2C1810] mb-1">
              Travel Demand by Origin City
            </h3>
            <p className="text-xs text-[#8B6B47] mb-6">
              Vehicle allocation recommendations this week
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={travelDemandData} layout="vertical" barSize={14}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F5EDD8"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#8B6B47" }} />
                <YAxis
                  dataKey="route"
                  type="category"
                  tick={{ fontSize: 11, fill: "#5C3A1E" }}
                  width={72}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #B8860B30",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="buses"
                  name="Buses"
                  fill="#B8860B"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="cars"
                  name="Cars/Taxis"
                  fill="#D4A843"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <SectionLabel>For Travel Agencies</SectionLabel>
            <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#2C1810] mb-4">
              Smarter Planning for Travel Operators
            </h2>
            <GoldDivider />
            <p className="text-[#8B6B47] leading-relaxed mt-4 mb-8">
              Receive advance visibility into expected visitor volumes and
              travel demand. Plan vehicle allocation, optimize schedules, and
              prepare resources based on projected pilgrimage activity.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: TrendingUp, title: "Travel Demand Forecasting" },
                { icon: Truck, title: "Vehicle Planning" },
                { icon: Navigation, title: "Route Optimization" },
                { icon: AlertTriangle, title: "Peak Period Insights" },
                { icon: Brain, title: "AI Recommendations" },
                { icon: Clock, title: "Schedule Optimization" },
              ].map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-[#B8860B]/10 bg-[#FFF8E7]"
                >
                  <Icon size={14} className="text-[#B8860B] flex-shrink-0" />
                  <span className="text-sm text-[#2C1810] font-medium">
                    {title}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage("travel")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B4513] text-white text-sm font-medium hover:bg-[#6B3410] transition-colors"
            >
              Travel Agency Dashboard <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AISection() {
  const cards = [
    {
      color: "from-[#B8860B] to-[#D4A843]",
      icon: Users,
      title: "Pilgrim Crowd Alert",
      body: "Predicted 45,000+ pilgrims arriving Saturday. Recommend extended darshan hours 4 AM–11 PM.",
      tag: "High Priority",
    },
    {
      color: "from-[#8B4513] to-[#B8660B]",
      icon: Hotel,
      title: "Hotel Occupancy Notice",
      body: "Occupancy projected at 96% for weekend. Suggest activating overflow partnerships and dynamic pricing.",
      tag: "Revenue Opportunity",
    },
    {
      color: "from-[#5C3A1E] to-[#8B4513]",
      icon: Truck,
      title: "Transport Surge Expected",
      body: "Heavy inflow from Chennai and Bangalore. Deploy 28 additional buses on NH-716 from Friday noon.",
      tag: "Logistics Alert",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#2C1810] to-[#1A0A00] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#B8860B]/10 blur-[130px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#D4A843]/8 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>Artificial Intelligence</SectionLabel>
          <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-white mt-2 mb-4">
            AI-Powered Operational Intelligence
          </h2>
          <GoldDivider />
          <p className="text-white/60 max-w-2xl mx-auto mt-4 leading-relaxed">
            Beyond forecasting visitor numbers, our intelligent recommendation
            engine transforms predictions into actionable decisions for every
            stakeholder.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`}
              />
              <div className="relative p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <card.icon size={18} className="text-white" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white/90">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-cinzel font-semibold text-white text-base mb-3">
                  {card.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {card.body}
                </p>
                <div className="mt-5 flex items-center gap-1 text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                  View Full Analysis <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Collect Historical Pilgrim Data",
      desc: "Aggregate visitor records, ticket bookings, darshan queues, and accommodation data across multiple years and seasons.",
    },
    {
      n: "02",
      title: "AI Forecasting Model Predicts Future Visitors",
      desc: "Our machine learning models analyze patterns across festivals, weekdays, and weather to project future arrival volumes with 94% accuracy.",
    },
    {
      n: "03",
      title: "Generate Intelligent Recommendations",
      desc: "Predictions are translated into actionable insights — optimal visit windows, staffing suggestions, vehicle deployment plans.",
    },
    {
      n: "04",
      title: "Stakeholders Receive Personalized Insights",
      desc: "Each user type — pilgrim, hotel, travel agency, temple admin — receives a tailored dashboard with relevant forecasts.",
    },
    {
      n: "05",
      title: "Improve Planning and Resource Allocation",
      desc: "Data-driven decisions reduce congestion, improve guest experience, and enable sustainable pilgrimage management.",
    },
  ];

  return (
    <section className="py-24 bg-[#FFF8E7]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#2C1810] mt-2 mb-4">
            From Data to Divine Experience
          </h2>
          <GoldDivider />
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#B8860B]/60 via-[#B8860B]/40 to-transparent hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className="relative flex gap-8 items-start group"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border-2 border-[#B8860B]/30 group-hover:border-[#B8860B] flex flex-col items-center justify-center transition-colors shadow-sm z-10">
                  <span className="font-cinzel font-bold text-[#B8860B] text-xs leading-none">
                    {step.n}
                  </span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 border border-[#B8860B]/10 group-hover:border-[#B8860B]/25 group-hover:shadow-md transition-all">
                  <h3 className="font-cinzel font-semibold text-[#2C1810] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#8B6B47] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Radhakrishnan Pillai",
      role: "Devotee, Coimbatore",
      avatar: "R",
      avatarColor: "from-[#B8860B] to-[#D4A843]",
      quote:
        "The crowd forecast helped me pick a Tuesday morning in April — I got darshan in under 2 hours. This platform is truly a blessing for pilgrims like me.",
      stars: 5,
    },
    {
      name: "Suresh Reddy",
      role: "Owner, Balaji Residency Hotel",
      avatar: "S",
      avatarColor: "from-[#8B4513] to-[#B8660B]",
      quote:
        "Our occupancy planning has transformed completely. We now staff correctly 10 days in advance and have reduced walk-in rejections by 60%.",
      stars: 5,
    },
    {
      name: "Anand Travels, Hyderabad",
      role: "Travel Agency Partner",
      avatar: "A",
      avatarColor: "from-[#5C3A1E] to-[#8B4513]",
      quote:
        "Vehicle allocation used to be guesswork during major festivals. TTD Smart Platform gives us advance demand signals and our fleet utilization went up by 40%.",
      stars: 5,
    },
    {
      name: "Deputy EO, TTD Administration",
      role: "Temple Management",
      avatar: "T",
      avatarColor: "from-[#2C1810] to-[#5C3A1E]",
      quote:
        "The AI Command Center has given our operations team unprecedented visibility. We can now pre-position security, prasad supplies, and medical teams weeks in advance.",
      stars: 5,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-[#2C1810] mt-2 mb-4">
            Trusted Across the Ecosystem
          </h2>
          <GoldDivider />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#FFF8E7] rounded-2xl p-6 border border-[#B8860B]/10 hover:shadow-lg hover:border-[#B8860B]/25 transition-all"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="text-[#B8860B] fill-[#B8860B]"
                  />
                ))}
              </div>
              <p className="text-[#5C3A1E] text-sm leading-relaxed mb-5 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-sm font-cinzel font-bold">
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#2C1810]">
                    {t.name}
                  </div>
                  <div className="text-xs text-[#8B6B47]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="bg-[#1A0A00] text-white/70 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B4513] flex items-center justify-center">
                <span className="text-white text-xs font-cinzel font-bold">
                  TTD
                </span>
              </div>
              <span className="font-cinzel font-semibold text-white text-sm">
                Smart Pilgrimage Platform
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering the Tirupati pilgrimage ecosystem through artificial
              intelligence and data-driven forecasting.
            </p>
          </div>
          <div>
            <h4 className="font-cinzel font-semibold text-white text-sm mb-4">
              Portals
            </h4>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => setPage("pilgrim")}
                className="block hover:text-[#D4A843] transition-colors"
              >
                Pilgrim Portal
              </button>
              <button
                onClick={() => setPage("hotel")}
                className="block hover:text-[#D4A843] transition-colors"
              >
                Hotel Partner
              </button>
              <button
                onClick={() => setPage("travel")}
                className="block hover:text-[#D4A843] transition-colors"
              >
                Travel Agency
              </button>
              <button
                onClick={() => setPage("temple")}
                className="block hover:text-[#D4A843] transition-colors"
              >
                Temple Admin
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-cinzel font-semibold text-white text-sm mb-4">
              Quick Links
            </h4>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => setPage("login")}
                className="block hover:text-[#D4A843] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setPage("register")}
                className="block hover:text-[#D4A843] transition-colors"
              >
                Register
              </button>
              <a
                href="#"
                className="block hover:text-[#D4A843] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="block hover:text-[#D4A843] transition-colors"
              >
                Contact TTD
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © 2025 TTD Smart Pilgrimage Platform. All rights reserved.
          </p>
          <p className="text-xs text-[#D4A843]/60">Om Namo Venkatesaya</p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage({ setPage }) {
  return (
    <div>
      <HeroSection setPage={setPage} />
      <AboutSection />
      <PilgrimFeaturesSection setPage={setPage} />
      <HotelSection setPage={setPage} />
      <TravelAgencySection setPage={setPage} />
      <AISection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ setPage, setUserRole }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FFF8E7]">
      {/* Left: Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src={IMAGES.login}
          alt="Tirupati Temple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A00]/80 via-[#2C1810]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B8860B]/20 border border-[#D4A843]/30 mb-5">
            <Sparkles size={12} className="text-[#D4A843]" />
            <span className="text-[#D4A843] text-xs tracking-wider uppercase">
              Secure Access
            </span>
          </div>
          <h2 className="font-cinzel font-bold text-3xl text-white mb-3">
            Welcome Back
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Access personalized forecasts, operational insights, and AI-powered
            recommendations tailored to your role within the pilgrimage
            ecosystem.
          </p>
          <div className="mt-6 flex gap-3">
            <StatBadge value="94%" label="AI Accuracy" />
            <StatBadge value="50K+" label="Daily Pilgrims" />
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center px-8 py-20 pt-24">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <button
              onClick={() => setPage("landing")}
              className="flex items-center gap-2 mb-8 text-[#8B6B47] hover:text-[#B8860B] transition-colors text-sm"
            >
              ← Back to Home
            </button>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B4513] flex items-center justify-center">
                <span className="text-white text-xs font-cinzel font-bold">
                  TTD
                </span>
              </div>
              <span className="font-cinzel text-[#2C1810] font-semibold text-sm">
                Smart Pilgrimage
              </span>
            </div>
            <h1 className="font-cinzel font-bold text-3xl text-[#2C1810] mb-2">
              Sign In
            </h1>
            <p className="text-[#8B6B47] text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#2C1810] block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#B8860B]/20 bg-white text-[#2C1810] placeholder:text-[#B8860B]/30 focus:outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2C1810] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#B8860B]/20 bg-white text-[#2C1810] placeholder:text-[#B8860B]/30 focus:outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-all text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8860B]/50 hover:text-[#B8860B] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#B8860B]"
                />
                <span className="text-sm text-[#8B6B47]">Remember me</span>
              </label>
              <button className="text-sm text-[#B8860B] hover:text-[#8B4513] font-medium transition-colors">
                Forgot Password?
              </button>
            </div>

            <button
              onClick={() => {
                let role = "pilgrim";
                const lowerEmail = email.toLowerCase();
                if (lowerEmail.includes("gov")) {
                  role = "government";
                } else if (lowerEmail.includes("admin") || lowerEmail.includes("temple")) {
                  role = "temple";
                } else if (lowerEmail.includes("hotel")) {
                  role = "hotel";
                } else if (lowerEmail.includes("travel")) {
                  role = "travel";
                }
                setUserRole(role);
                setPage(role);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A843] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#B8860B]/25 transition-all mt-2"
            >
              Sign In
            </button>

            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[#B8860B]/15" />
              <span className="text-xs text-[#8B6B47]">or continue as</span>
              <div className="flex-1 h-px bg-[#B8860B]/15" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Pilgrim", "Government", "Hotel", "Travel Agency", "Temple Admin"].map(
                (role) => (
                  <button
                    key={role}
                    onClick={() => {
                      const pageMap = {
                        "Pilgrim": "pilgrim",
                        "Government": "government",
                        "Hotel": "hotel",
                        "Travel Agency": "travel",
                        "Temple Admin": "temple"
                      };
                      const targetRole = pageMap[role];
                      setUserRole(targetRole);
                      setPage(targetRole);
                    }}
                    className="py-2 px-2 rounded-xl border border-[#B8860B]/20 text-[#5C3A1E] text-[10px] font-medium hover:border-[#B8860B]/50 hover:bg-[#B8860B]/5 transition-colors text-center truncate"
                  >
                    {role}
                  </button>
                ),
              )}
            </div>

            <p className="text-center text-sm text-[#8B6B47] pt-2">
              New to the platform?{" "}
              <button
                onClick={() => setPage("register")}
                className="text-[#B8860B] font-medium hover:text-[#8B4513] transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────
function RegisterPage({ setPage, setUserRole }) {
  const [userType, setUserType] = useState("pilgrim");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FFF8E7]">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#1A0A00] to-[#2C1810] p-10 pt-24">
        <img
          src={IMAGES.register}
          alt="Tirupati Temple"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B8860B]/20 border border-[#D4A843]/30 mb-8">
            <Award size={12} className="text-[#D4A843]" />
            <span className="text-[#D4A843] text-xs tracking-wider uppercase">
              Join the Ecosystem
            </span>
          </div>
          <h2 className="font-cinzel font-bold text-3xl text-white mb-4 leading-tight">
            Building a Smarter Pilgrimage Experience
          </h2>
          <p className="text-white/65 text-sm leading-relaxed">
            Join a growing ecosystem of pilgrims, accommodation providers,
            travel partners, and administrators working together to improve
            planning, reduce congestion, and enhance the Tirupati pilgrimage
            journey.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "AI-powered forecasting for every stakeholder",
              "Real-time crowd and occupancy insights",
              "Personalized recommendations and alerts",
              "Trusted by TTD administration",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <CheckCircle
                  size={14}
                  className="text-[#D4A843] flex-shrink-0"
                />
                <span className="text-white/75 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3">
          <StatBadge value="50K+" label="Pilgrims/day" />
          <StatBadge value="400+" label="Hotels" />
          <StatBadge value="150+" label="Agencies" />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-start justify-center px-8 py-20 pt-24 overflow-y-auto">
        <div className="w-full max-w-md">
          <button
            onClick={() => setPage("landing")}
            className="flex items-center gap-2 mb-6 text-[#8B6B47] hover:text-[#B8860B] transition-colors text-sm"
          >
            ← Back to Home
          </button>
          <h1 className="font-cinzel font-bold text-2xl text-[#2C1810] mb-2">
            Create Account
          </h1>
          <p className="text-[#8B6B47] text-sm mb-6">
            Select your role to get started.
          </p>

          {/* User type tabs */}
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-[#B8860B]/15 mb-6">
            {["pilgrim", "government", "hotel", "travel"].map((t) => (
              <button
                key={t}
                onClick={() => setUserType(t)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-medium transition-all ${
                  userType === t
                    ? "bg-[#B8860B] text-white shadow-sm"
                    : "text-[#8B6B47] hover:text-[#B8860B]"
                }`}
              >
                {t === "pilgrim"
                  ? "Pilgrim"
                  : t === "government"
                    ? "Government"
                    : t === "hotel"
                      ? "Hotel Partner"
                      : "Travel Agency"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {userType === "pilgrim" && (
              <>
                <FormField label="Full Name" placeholder="Venkatesh Sharma" />
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                />
                <FormField
                  label="Mobile Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                />
                <FormField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                />
              </>
            )}
            {userType === "hotel" && (
              <>
                <FormField
                  label="Hotel Name"
                  placeholder="Balaji Grand Hotel"
                />
                <FormField label="Owner Name" placeholder="Ramesh Babu" />
                <FormField
                  label="Registration Number"
                  placeholder="GHCL-2024-XXXXX"
                />
                <FormField
                  label="Address"
                  placeholder="Tirumala, Tirupati, AP"
                />
                <FormField
                  label="Location / Area"
                  placeholder="Near Main Gate"
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="No. of Rooms"
                    type="number"
                    placeholder="120"
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 878 ..."
                  />
                </div>
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="hotel@example.com"
                />
              </>
            )}
            {userType === "travel" && (
              <>
                <FormField
                  label="Agency Name"
                  placeholder="Balaji Tours & Travels"
                />
                <FormField
                  label="License Number"
                  placeholder="AP-TRV-2024-XXXXX"
                />
                <FormField
                  label="Number of Vehicles"
                  type="number"
                  placeholder="25"
                />
                <FormField label="Contact Person" placeholder="Suresh Reddy" />
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="agency@example.com"
                />
                <FormField
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 91234 56789"
                />
              </>
            )}
            {userType === "government" && (
              <>
                <FormField label="Official Name" placeholder="Dr. R. K. Prasad" />
                <FormField label="Department" placeholder="Ministry of Endowments" />
                <FormField label="Government ID / Badge" placeholder="GOV-AP-9827" />
                <FormField label="Official Email Address" type="email" placeholder="prasad.rk@ap.gov.in" />
                <FormField label="Mobile Number" type="tel" placeholder="+91 94400 12345" />
                <FormField label="Password" type="password" placeholder="••••••••" />
              </>
            )}

            <button
              onClick={() => {
                setUserRole(userType);
                setPage(userType);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4A843] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#B8860B]/25 transition-all mt-2"
            >
              Create Account & Continue
            </button>
            <p className="text-center text-sm text-[#8B6B47]">
              Already registered?{" "}
              <button
                onClick={() => setPage("login")}
                className="text-[#B8860B] font-medium hover:text-[#8B4513] transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type = "text", placeholder }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="text-sm font-medium text-[#2C1810] block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && !showPw ? "password" : isPassword ? "text" : type}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-[#B8860B]/20 bg-white text-[#2C1810] placeholder:text-[#B8860B]/30 focus:outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-all text-sm pr-10"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8860B]/50 hover:text-[#B8860B] transition-colors"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
function DashboardShell({ title, subtitle, children, setPage, currentPage, userRole, setUserRole }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const allNavItems = [
    { page: "government", label: "Government Analytics", icon: Building2 },
    { page: "pilgrim", label: "Pilgrim Details", icon: Users },
    { page: "booking_center", label: "Ticket & Services", icon: Ticket },
    { page: "travel_assistant", label: "Travel Assistant", icon: Compass },
    { page: "sacred_places", label: "Sacred Place's", icon: MapPin },
    { page: "hotel", label: "Hotel Partner", icon: Hotel },
    { page: "travel", label: "Travel Agency", icon: Truck },
    { page: "temple", label: "Temple Mgmt", icon: Shield },
  ];

  const navItems = allNavItems.filter(({ page }) => {
    if (page === "pilgrim") return true;
    if (page === "booking_center") return true;
    if (page === "travel_assistant") return true;
    if (page === "sacred_places") return true;
    if (!userRole) return false;
    if (page === "government") return userRole === "government";
    if (page === "temple") return userRole === "temple";
    if (page === "hotel") return userRole === "hotel" || userRole === "temple";
    if (page === "travel") return userRole === "travel" || userRole === "temple";
    return false;
  });

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex pt-12">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-[#B8860B]/10 fixed left-0 top-12 bottom-0 z-30 transition-all duration-300 ${
        isSidebarCollapsed ? "w-0 overflow-hidden opacity-0 pointer-events-none" : "w-56"
      }`}>
        <div className="h-12 flex items-center justify-between px-5 border-b border-[#B8860B]/10">
          <span className="font-cinzel font-semibold text-[#2C1810] text-xs">
            Smart Pilgrimage
          </span>
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-[#B8860B]/5 text-[#8B6B47] hover:text-[#B8860B] transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={15} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === page
                  ? "bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20"
                  : "text-[#8B6B47] hover:bg-[#B8860B]/5 hover:text-[#B8860B]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#B8860B]/10">
          <button
            onClick={() => {
              if (typeof setUserRole === "function") setUserRole(null);
              setPage("landing");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#8B6B47] hover:text-[#B8860B] transition-colors"
          >
            ← Home
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? "lg:ml-0" : "lg:ml-56"
      }`}>
        {/* Top bar */}
        <header className="h-12 bg-white border-b border-[#B8860B]/10 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl hover:bg-[#B8860B]/5 text-[#8B6B47] hover:text-[#B8860B] transition-all cursor-pointer flex items-center justify-center border border-[#B8860B]/10 bg-white shadow-sm"
              title={isSidebarCollapsed ? "Show Navigation Sidebar" : "Hide Navigation Sidebar"}
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-cinzel font-bold text-[#2C1810] text-base">
                {title}
              </h1>
              <p className="text-xs text-[#8B6B47]">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-[#B8860B]/5 text-[#8B6B47] transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B4513] flex items-center justify-center">
              <span className="text-white text-xs font-cinzel font-bold">
                A
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

function DashCard({ title, value, sub, icon: Icon, trend, trendVal }) {
  return (
    <Tilt3DCard maxTilt={8} className="rounded-2xl h-full">
      <div className="bg-white rounded-2xl p-5 border border-[#B8860B]/10 hover:shadow-md transition-shadow h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B8860B]/10 to-[#8B4513]/10 flex items-center justify-center">
            <Icon size={18} className="text-[#B8860B]" />
          </div>
          {trendVal && (
            <div
              className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
            >
              {trend === "up" ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              {trendVal}
            </div>
          )}
        </div>
        <div className="font-cinzel font-bold text-2xl text-[#2C1810] mb-1">
          {value}
        </div>
        <div className="text-xs font-semibold text-[#5C3A1E] mb-0.5">{title}</div>
        <div className="text-xs text-[#8B6B47]">{sub}</div>
      </div>
    </Tilt3DCard>
  );
}

// ─── Pilgrim Dashboard ────────────────────────────────────────────────────────
function PilgrimDashboard({ setPage, stats, userRole, setUserRole }) {
  return (
    <DashboardShell
      title="Pilgrim Dashboard"
      subtitle="Plan your sacred journey with AI insights"
      setPage={setPage}
      currentPage="pilgrim"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashCard
          title="Today's Pilgrims"
          value="28,450"
          sub="Live count as of 2:30 PM"
          icon={Users}
          trend="up"
          trendVal="+12%"
        />
        <DashCard
          title="Avg Wait Time"
          value="2h 15m"
          sub="Current darshan queue"
          icon={Clock}
          trend="down"
          trendVal="-18%"
        />
        <DashCard
          title="Best Visit Time"
          value="Tue 5 AM"
          sub="Lowest crowd predicted"
          icon={Calendar}
        />
        <DashCard
          title="Weather"
          value="24°C"
          sub="Partly cloudy, comfortable"
          icon={Sun}
        />
      </div>

      <div className="space-y-6 mb-6">
        {/* Crowd forecast chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm">
                7-Day Crowd Forecast
              </h3>
              <p className="text-xs text-[#8B6B47]">
                Predicted vs actual pilgrim count this week
              </p>
            </div>
            <span className="text-xs text-[#B8860B] font-medium px-2 py-1 bg-[#B8860B]/8 rounded-full">
              AI Forecast
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats?.crowdData?.length > 0 ? stats.crowdData : crowdData}>
              <defs>
                <linearGradient id="pilgrimGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8860B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8B6B47" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#8B6B47" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(v) => v.toLocaleString()}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #B8860B30",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="pilgrims"
                stroke="#B8860B"
                fill="url(#pilgrimGrad)"
                strokeWidth={2.5}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#8B4513"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                name="Forecast"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* News Bulletins */}
        <PilgrimNews />

        {/* Interactive Wait Simulator Chart */}
        <InteractiveWaitSimulator />

        {/* Service-Specific Wait Analytics */}
        <ServiceSpecificAnalytics />

        {/* 3D Isometric Queue Visualizer */}
        <QueueIsometric3D />
      </div>

      {/* Weather + recommendations */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            5-Day Weather — Tirumala Hills
          </h3>
          <div className="space-y-2">
            {[
              {
                day: "Today",
                icon: Sun,
                temp: "24°C",
                condition: "Partly Cloudy",
                humidity: "68%",
              },
              {
                day: "Tomorrow",
                icon: CloudRain,
                temp: "21°C",
                condition: "Light Showers",
                humidity: "82%",
              },
              {
                day: "Wednesday",
                icon: Sun,
                temp: "26°C",
                condition: "Clear & Pleasant",
                humidity: "60%",
              },
              {
                day: "Thursday",
                icon: Wind,
                temp: "22°C",
                condition: "Windy",
                humidity: "72%",
              },
              {
                day: "Friday",
                icon: Sun,
                temp: "25°C",
                condition: "Sunny",
                humidity: "58%",
              },
            ].map(({ day, icon: WeatherIcon, temp, condition, humidity }) => (
              <div
                key={day}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FFF8E7] hover:bg-[#FFF3D0] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <WeatherIcon size={16} className="text-[#B8860B]" />
                  <span className="text-sm text-[#2C1810] font-medium w-24">
                    {day}
                  </span>
                  <span className="text-xs text-[#8B6B47]">{condition}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#8B6B47]">
                    <Droplets size={10} className="inline mr-1" />
                    {humidity}
                  </span>
                  <span className="font-cinzel font-semibold text-[#B8860B] text-sm">
                    {temp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {[
              {
                tag: "Best Day",
                title: "Visit Tuesday Morning",
                desc: "Lowest crowd predicted. 8,200 pilgrims expected. Darshan in ~90 min.",
              },
              {
                tag: "Accommodation",
                title: "Srivari Cottages Available",
                desc: "TTD-approved accommodation with 240 rooms available for your dates.",
              },
              {
                tag: "Route",
                title: "Take Alipiri Mettu Path",
                desc: "Traditional walking route — 3,550 steps, cool morning recommended.",
              },
              {
                tag: "Seva",
                title: "Book Archana in Advance",
                desc: "Online booking available. Reduces wait by 45 minutes on average.",
              },
            ].map(({ tag, title, desc }) => (
              <div
                key={title}
                className="flex gap-3 p-3 rounded-xl border border-[#B8860B]/10 hover:border-[#B8860B]/25 transition-colors"
              >
                <span className="text-[10px] font-medium px-2 py-0.5 h-fit rounded-full bg-[#B8860B]/10 text-[#B8860B] whitespace-nowrap mt-0.5">
                  {tag}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#2C1810]">
                    {title}
                  </div>
                  <div className="text-xs text-[#8B6B47] mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Scope roadmap */}
      <FutureScopeRoadmap />
    </DashboardShell>
  );
}

// ─── Travel Assistant Dashboard ────────────────────────────────────────────────
function TravelAssistantDashboard({ setPage, stats, userRole, setUserRole }) {
  return (
    <DashboardShell
      title="Travel Assistant"
      subtitle="AI-driven travel route planning, comparative analysis, and smart itinerary forecasting"
      setPage={setPage}
      currentPage="travel_assistant"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      <TravelAssistant />
    </DashboardShell>
  );
}

// ─── Sacred Places Dashboard ───────────────────────────────────────────────────
function SacredPlacesDashboard({ setPage, stats, userRole, setUserRole }) {
  return (
    <DashboardShell
      title="Sacred Place's"
      subtitle="Explore the sacred Sapthagiri hills and nearby temples surrounding Tirumala"
      setPage={setPage}
      currentPage="sacred_places"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      <SacredPlaces />
    </DashboardShell>
  );
}

// ─── Booking Center Dashboard ──────────────────────────────────────────────────
function BookingCenterDashboard({ setPage, stats, userRole, setUserRole }) {
  return (
    <DashboardShell
      title="Sacred Booking Terminal"
      subtitle="Reserve airport/railway transfers, hilltop ghat transit options, free luggage handling, and sacred temple entry tickets"
      setPage={setPage}
      currentPage="booking_center"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      <div className="space-y-6 mb-6">
        {/* Pilgrim Ticket & Action Center */}
        <div className="w-full">
          <PilgrimActionCenter />
        </div>

        {/* Sacred Transit Booking Center */}
        <div className="w-full">
          <PilgrimBookingCenter userRole={userRole} />
        </div>
      </div>
    </DashboardShell>
  );
}

// ─── Hotel Dashboard ──────────────────────────────────────────────────────────
function HotelDashboard({ setPage, stats, userRole, setUserRole }) {
  return (
    <DashboardShell
      title="Hotel Partner Dashboard"
      subtitle="Occupancy forecasts & demand insights for Balaji Grand Hotel"
      setPage={setPage}
      currentPage="hotel"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashCard
          title="Current Occupancy"
          value="87%"
          sub="104 of 120 rooms occupied"
          icon={Hotel}
          trend="up"
          trendVal="+5%"
        />
        <DashCard
          title="Weekend Forecast"
          value="96%"
          sub="AI prediction for Sat–Sun"
          icon={Brain}
          trend="up"
          trendVal="+9%"
        />
        <DashCard
          title="Revenue (June)"
          value="₹4.8L"
          sub="On track to beat last year"
          icon={TrendingUp}
          trend="up"
          trendVal="+18%"
        />
        <DashCard
          title="Staff on Duty"
          value="34/40"
          sub="6 additional needed Sat"
          icon={Users}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-1">
            Occupancy Trend — June 2025
          </h3>
          <p className="text-xs text-[#8B6B47] mb-4">
            Actual vs AI forecast (%)
          </p>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={stats?.occupancyData?.length > 0 ? stats.occupancyData : occupancyData}>
              <defs>
                <linearGradient id="hotelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8860B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8B6B47" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#8B6B47" }}
                domain={[60, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #B8860B30",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="occupied"
                stroke="#B8860B"
                fill="url(#hotelGrad)"
                strokeWidth={2}
                name="Actual %"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#8B4513"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="AI Forecast %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            AI Business Insights
          </h3>
          <div className="space-y-3">
            {[
              {
                priority: "High",
                bg: "bg-orange-50 text-orange-700",
                title: "Increase Rates for Weekend",
                body: "Demand peaks 96% — dynamic pricing opportunity. Recommend +22% rate uplift.",
              },
              {
                priority: "Medium",
                bg: "bg-blue-50 text-blue-700",
                title: "Staff Augmentation Needed",
                body: "Saturday will require 6 extra housekeeping staff. Contact agency by Thursday.",
              },
              {
                priority: "Low",
                bg: "bg-green-50 text-green-700",
                title: "Breakfast Prep Alert",
                body: "Expect 118 guests for breakfast Sunday. Pre-order supplies by Friday evening.",
              },
            ].map(({ priority, bg, title, body }) => (
              <div
                key={title}
                className="p-3 rounded-xl border border-[#B8860B]/8 bg-[#FFF8E7]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#2C1810]">
                    {title}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${bg}`}
                  >
                    {priority}
                  </span>
                </div>
                <p className="text-xs text-[#8B6B47] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            Peak Arrival Periods — This Week
          </h3>
          <div className="space-y-2.5">
            {[
              {
                period: "Friday Evening",
                arrivals: "62 check-ins",
                fill: 78,
                label: "Busy",
              },
              {
                period: "Saturday Morning",
                arrivals: "48 check-ins",
                fill: 95,
                label: "Peak",
              },
              {
                period: "Saturday Evening",
                arrivals: "31 check-ins",
                fill: 60,
                label: "Moderate",
              },
              {
                period: "Sunday Morning",
                arrivals: "55 check-ins",
                fill: 88,
                label: "Very Busy",
              },
            ].map(({ period, arrivals, fill, label }) => (
              <div key={period}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#2C1810] font-medium">
                    {period}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8B6B47]">{arrivals}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${fill > 85 ? "bg-red-50 text-red-600" : fill > 70 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"}`}
                    >
                      {label}
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#F5EDD8] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A843] transition-all`}
                    style={{ width: `${fill}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            Booking Source Analysis
          </h3>
          <div className="space-y-3">
            {[
              { source: "Direct Website", pct: 34, rooms: 41 },
              { source: "TTD Portal", pct: 28, rooms: 34 },
              { source: "OTA (MakeMyTrip)", pct: 22, rooms: 26 },
              { source: "Walk-in", pct: 11, rooms: 13 },
              { source: "Corporate/Travel Agency", pct: 5, rooms: 6 },
            ].map(({ source, pct, rooms }) => (
              <div key={source} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#2C1810] font-medium">
                      {source}
                    </span>
                    <span className="text-xs text-[#8B6B47]">
                      {rooms} rooms · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#F5EDD8] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A843]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

// ─── Travel Agency Dashboard ──────────────────────────────────────────────────
function TravelDashboard({ setPage, stats, userRole, setUserRole }) {
  return (
    <DashboardShell
      title="Travel Agency Dashboard"
      subtitle="Demand forecasts & vehicle planning for Balaji Tours & Travels"
      setPage={setPage}
      currentPage="travel"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashCard
          title="Demand This Week"
          value="1,840"
          sub="Predicted travel bookings"
          icon={TrendingUp}
          trend="up"
          trendVal="+22%"
        />
        <DashCard
          title="Vehicles Deployed"
          value="38/55"
          sub="17 available for allocation"
          icon={Truck}
        />
        <DashCard
          title="Peak Demand Day"
          value="Saturday"
          sub="Expected 620 passengers"
          icon={AlertTriangle}
        />
        <DashCard
          title="Route Efficiency"
          value="91%"
          sub="AI-optimized schedules"
          icon={Navigation}
          trend="up"
          trendVal="+7%"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-1">
            Travel Demand by Origin — This Week
          </h3>
          <p className="text-xs text-[#8B6B47] mb-4">
            Buses and taxis needed per corridor
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats?.travelDemandData?.length > 0 ? stats.travelDemandData : travelDemandData} layout="vertical" barSize={12}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F5EDD8"
                horizontal={false}
              />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#8B6B47" }} />
              <YAxis
                dataKey="route"
                type="category"
                tick={{ fontSize: 11, fill: "#5C3A1E" }}
                width={72}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #B8860B30",
                  borderRadius: 8,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="buses"
                name="Buses"
                fill="#B8860B"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="cars"
                name="Cars/Taxis"
                fill="#D4A843"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            Peak Travel Hours — Saturday
          </h3>
          <div className="space-y-2.5 mb-5">
            {[
              { time: "4 AM – 7 AM", passengers: 220, pct: 88 },
              { time: "7 AM – 10 AM", passengers: 185, pct: 74 },
              { time: "10 AM – 1 PM", passengers: 140, pct: 56 },
              { time: "1 PM – 4 PM", passengers: 98, pct: 39 },
              { time: "4 PM – 7 PM", passengers: 160, pct: 64 },
              { time: "7 PM – 10 PM", passengers: 112, pct: 45 },
            ].map(({ time, passengers, pct }) => (
              <div key={time}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-[#2C1810] font-medium">
                    {time}
                  </span>
                  <span className="text-xs text-[#8B6B47]">
                    {passengers} passengers
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F5EDD8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A843]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#B8860B]/10">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={13} className="text-[#B8860B]" />
              <span className="text-xs font-semibold text-[#2C1810]">
                AI Recommendation
              </span>
            </div>
            <p className="text-xs text-[#8B6B47] leading-relaxed">
              Deploy 8 extra buses on Chennai route between 4–7 AM Saturday.
              Expected demand: 220 passengers, current capacity: 180.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
        <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
          Vehicle Allocation Plan — This Weekend
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#B8860B]/10">
                <th className="text-left text-xs font-semibold text-[#5C3A1E] pb-3 pr-4">
                  Route
                </th>
                <th className="text-right text-xs font-semibold text-[#5C3A1E] pb-3 px-4">
                  Current Vehicles
                </th>
                <th className="text-right text-xs font-semibold text-[#5C3A1E] pb-3 px-4">
                  AI Recommended
                </th>
                <th className="text-right text-xs font-semibold text-[#5C3A1E] pb-3 px-4">
                  Gap
                </th>
                <th className="text-right text-xs font-semibold text-[#5C3A1E] pb-3 pl-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  route: "Chennai → Tirupati",
                  current: 12,
                  recommended: 20,
                  gap: 8,
                },
                {
                  route: "Bangalore → Tirupati",
                  current: 10,
                  recommended: 15,
                  gap: 5,
                },
                {
                  route: "Hyderabad → Tirupati",
                  current: 8,
                  recommended: 12,
                  gap: 4,
                },
                {
                  route: "Mumbai → Tirupati",
                  current: 5,
                  recommended: 5,
                  gap: 0,
                },
                {
                  route: "Delhi → Tirupati",
                  current: 3,
                  recommended: 3,
                  gap: 0,
                },
              ].map(({ route, current, recommended, gap }) => (
                <tr
                  key={route}
                  className="border-b border-[#B8860B]/5 hover:bg-[#FFF8E7] transition-colors"
                >
                  <td className="py-3 pr-4 font-medium text-[#2C1810]">
                    {route}
                  </td>
                  <td className="py-3 px-4 text-right text-[#5C3A1E]">
                    {current}
                  </td>
                  <td className="py-3 px-4 text-right font-cinzel font-semibold text-[#B8860B]">
                    {recommended}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {gap > 0 ? (
                      <span className="text-orange-600 font-medium">
                        +{gap}
                      </span>
                    ) : (
                      <span className="text-green-600">✓</span>
                    )}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${gap > 5 ? "bg-red-50 text-red-600" : gap > 0 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"}`}
                    >
                      {gap > 5
                        ? "Action Required"
                        : gap > 0
                          ? "Add Vehicles"
                          : "Sufficient"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

// ─── Temple Management Dashboard ─────────────────────────────────────────────
function TempleDashboard({ setPage, stats, userRole, setUserRole }) {
  return (
    <DashboardShell
      title="Temple Management Dashboard"
      subtitle="AI Command Center — Tirumala Tirupati Devasthanams"
      setPage={setPage}
      currentPage="temple"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashCard
          title="Predicted This Week"
          value="1.94L"
          sub="Pilgrims forecast (±3%)"
          icon={Users}
          trend="up"
          trendVal="+15%"
        />
        <DashCard
          title="Crowd Status"
          value="Moderate"
          sub="Below peak capacity now"
          icon={Activity}
        />
        <DashCard
          title="Water Forecast"
          value="18.4 MLD"
          sub="Weekend requirement"
          icon={Droplets}
          trend="up"
          trendVal="+8%"
        />
        <DashCard
          title="Security Posts"
          value="124/140"
          sub="16 additional Saturday"
          icon={Shield}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Left column: Pilgrim Count chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10 h-full flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm">
                Pilgrim Count — June 2025
              </h3>
              <p className="text-xs text-[#8B6B47]">
                Weekly actual vs predicted vs safe capacity
              </p>
            </div>
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.templeWeeklyData?.length > 0 ? stats.templeWeeklyData : templeWeeklyData}>
                  <defs>
                    <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B8860B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#8B6B47" }} />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#8B6B47" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(v) => v.toLocaleString()}
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #B8860B30",
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#B8860B"
                    fill="url(#templeGrad)"
                    strokeWidth={2}
                    name="Actual"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#D4A843"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Predicted"
                  />
                  <Line
                    type="monotone"
                    dataKey="capacity"
                    stroke="#dc2626"
                    strokeWidth={1.5}
                    strokeDasharray="6 3"
                    dot={false}
                    name="Capacity Limit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column containing alerts */}
        <div className="lg:col-span-1">
          {/* AI Command Center */}
          <div className="bg-gradient-to-b from-[#1A0A00] to-[#2C1810] rounded-2xl p-6 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-5">
              <Cpu size={15} className="text-[#D4A843]" />
              <span className="font-cinzel font-semibold text-white text-sm">
                AI Command Center
              </span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
              {[
                {
                  level: "Critical",
                  color: "text-red-400 bg-red-500/15",
                  title: "W4 Jun Capacity Alert",
                  body: "Predicted 1,94,000 pilgrims — 21% over safe capacity. Activate overflow management by June 22.",
                },
                {
                  level: "High",
                  color: "text-orange-400 bg-orange-500/15",
                  title: "Water Shortage Risk",
                  body: "Weekend demand 18.4 MLD vs stored 15.2 MLD. Request emergency water supply from APSPDCL.",
                },
                {
                  level: "Medium",
                  color: "text-yellow-400 bg-yellow-500/15",
                  title: "Prasad Stock Low",
                  body: "Laddoo stock sufficient for 3 days at current rate. Place reorder by Friday for 1.2L units.",
                },
              ].map(({ level, color, title, body }) => (
                <div
                  key={title}
                  className="rounded-xl bg-white/8 p-3 border border-white/8"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}
                    >
                      {level}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">
                    {title}
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Radar & Correlation Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <TempleResourceRadar />
        <CrowdCorrelationChart />
      </div>

      {/* Row 3: Service Analytics & Queue Map */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <ServiceSpecificAnalytics />
        <QueueIsometric3D />
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        {/* Resource Planning */}
        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            Resource Planning
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Security Personnel",
                current: 124,
                needed: 140,
                unit: "officers",
              },
              {
                label: "Medical Staff",
                current: 42,
                needed: 50,
                unit: "staff",
              },
              {
                label: "Sanitation Workers",
                current: 180,
                needed: 220,
                unit: "workers",
              },
              {
                label: "Queue Managers",
                current: 64,
                needed: 80,
                unit: "managers",
              },
            ].map(({ label, current, needed, unit }) => {
              const pct = Math.round((current / needed) * 100);
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#2C1810] font-medium">
                      {label}
                    </span>
                    <span className="text-xs text-[#8B6B47]">
                      {current}/{needed} {unit}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#F5EDD8] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct < 80 ? "bg-red-400" : pct < 90 ? "bg-orange-400" : "bg-gradient-to-r from-[#B8860B] to-[#D4A843]"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accommodation Insights */}
        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            Accommodation Insights
          </h3>
          <div className="space-y-3">
            {[
              { name: "TTD Cottages", total: 1200, occupied: 1080, pct: 90 },
              {
                name: "Srivari Rest Houses",
                total: 800,
                occupied: 768,
                pct: 96,
              },
              {
                name: "Padmavathi Guest House",
                total: 400,
                occupied: 320,
                pct: 80,
              },
              {
                name: "Private Hotels (400+)",
                total: 8000,
                occupied: 6960,
                pct: 87,
              },
            ].map(({ name, total, occupied, pct }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#2C1810] font-medium">
                    {name}
                  </span>
                  <span className="text-xs text-[#8B6B47]">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F5EDD8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A843]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-[#8B6B47] mt-0.5">
                  {occupied.toLocaleString()} / {total.toLocaleString()} rooms
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Water & Crowd Trends */}
        <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm mb-4">
            Operational Status
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: Droplets,
                label: "Water Storage",
                value: "15.2 MLD",
                status: "At Risk",
                color: "text-orange-600 bg-orange-50",
              },
              {
                icon: Leaf,
                label: "Prasad Stock",
                value: "3.2L units",
                status: "Reorder Soon",
                color: "text-yellow-600 bg-yellow-50",
              },
              {
                icon: Shield,
                label: "Security Readiness",
                value: "89%",
                status: "Good",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: Activity,
                label: "Queue Wait Time",
                value: "3h 20m",
                status: "Elevated",
                color: "text-red-600 bg-red-50",
              },
              {
                icon: MapPin,
                label: "Crowd Density",
                value: "Moderate",
                status: "Stable",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: Users,
                label: "Darshan Rate",
                value: "14,200/hr",
                status: "Normal",
                color: "text-green-600 bg-green-50",
              },
            ].map(({ icon: Icon, label, value, status, color }) => (
              <div
                key={label}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8E7]"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={13} className="text-[#B8860B]" />
                  <div>
                    <div className="text-xs font-semibold text-[#2C1810]">
                      {value}
                    </div>
                    <div className="text-[10px] text-[#8B6B47]">{label}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color}`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pilgrim Ticket & Action Center */}
        <div className="lg:col-span-1">
          <PilgrimActionCenter />
        </div>
      </div>
    </DashboardShell>
  );
}

// ─── Government Dashboard ─────────────────────────────────────────────────────
function GovernmentDashboard({ setPage, stats, userRole, setUserRole }) {
  const nextWeekForecast = [
    { day: "Monday", count: 48500, status: "Normal", capacity: "Safe", weather: "Sunny (24°C)", waitTime: "2h 10m" },
    { day: "Tuesday", count: 38200, status: "Optimal", capacity: "Safe", weather: "Clear (26°C)", waitTime: "1h 30m" },
    { day: "Wednesday", count: 42100, status: "Normal", capacity: "Safe", weather: "Partly Cloudy", waitTime: "1h 50m" },
    { day: "Thursday", count: 54600, status: "Elevated", capacity: "Borderline", weather: "Rainy (21°C)", waitTime: "3h 15m" },
    { day: "Friday", count: 62400, status: "Busy", capacity: "Borderline", weather: "Partly Cloudy", waitTime: "4h 00m" },
    { day: "Saturday", count: 78500, status: "Peak Influx", capacity: "Over Capacity", weather: "Sunny (25°C)", waitTime: "5h 30m" },
    { day: "Sunday", count: 68500, status: "Busy", capacity: "Over Capacity", weather: "Windy (22°C)", waitTime: "4h 45m" },
  ];

  return (
    <DashboardShell
      title="Government Analytics Dashboard"
      subtitle="Administrative oversight & macro planning models for Andhra Pradesh State Authorities"
      setPage={setPage}
      currentPage="government"
      userRole={userRole}
      setUserRole={setUserRole}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashCard
          title="Predicted Influx (Next Week)"
          value="3.92L"
          sub="Devotees cumulative forecast"
          icon={Users}
          trend="up"
          trendVal="+8.2%"
        />
        <DashCard
          title="System Alert Status"
          value="Yellow Alert"
          sub="Peak surge expected Sat"
          icon={AlertTriangle}
        />
        <DashCard
          title="Model Confidence"
          value="92.4%"
          sub="Refined with weather datasets"
          icon={Brain}
        />
        <DashCard
          title="Peak Active Wait"
          value="5h 30m"
          sub="Projected Saturday afternoon"
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Weekly Influx Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#B8860B]/10 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm">
              AI Devotee Weekly Predictor
            </h3>
            <p className="text-xs text-[#8B6B47]">
              Predicted pilgrim arrival rates for next week (Monday to Sunday)
            </p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={nextWeekForecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="govDevoteeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B8860B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EDD8" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8B6B47" }} />
                <YAxis
                  tick={{ fontSize: 9, fill: "#8B6B47" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(v) => v.toLocaleString()}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #B8860B30",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#B8860B"
                  fill="url(#govDevoteeGrad)"
                  strokeWidth={2.5}
                  name="Predicted Devotees"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Actionable Directives */}
        <div className="lg:col-span-1 bg-gradient-to-b from-[#2C1810] to-[#1A0A00] rounded-2xl p-6 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={16} className="text-[#D4A843]" />
              <span className="font-cinzel font-semibold text-sm">
                AI Logistics Directives
              </span>
            </div>
            <div className="space-y-3.5 text-xs text-white/85 leading-relaxed">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[#D4A843] font-bold block mb-1">⚠️ Saturday Peak Mitigation</span>
                Saturday expected count (<strong className="text-white">78.5K</strong>) exceeds safe capacity limits. State bus transit lines are advised to deploy 12 emergency backup coaches.
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[#D4A843] font-bold block mb-1">🌧️ Thursday Weather Operations</span>
                Precipitation forecasts indicate a <strong className="text-white">72% probability</strong> of showers. Ensure holding zones are prepared and keep emergency medical stations operational.
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/50 border-t border-white/10 pt-3 mt-4">
            Directives are synced with local state administration models.
          </div>
        </div>
      </div>

      {/* Devotees Prediction Details Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#B8860B]/10 mb-5">
        <div className="mb-4">
          <h3 className="font-cinzel font-semibold text-[#2C1810] text-sm">
            Predicted Weekly Devotee Details
          </h3>
          <p className="text-xs text-[#8B6B47]">
            Comprehensive logistic indicators mapped daily for district administration planning
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#B8860B]/15 text-[#8B6B47] font-semibold">
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3 text-right">Predicted Devotees</th>
                <th className="py-2.5 px-3">Surge Level</th>
                <th className="py-2.5 px-3">Safety Capacity</th>
                <th className="py-2.5 px-3">Weather Factor</th>
                <th className="py-2.5 px-3">Projected Max Wait</th>
              </tr>
            </thead>
            <tbody>
              {nextWeekForecast.map((row) => (
                <tr key={row.day} className="border-b border-[#B8860B]/5 hover:bg-[#FFF8E7]/40 text-[#2C1810]">
                  <td className="py-3 px-3 font-medium">{row.day}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">{row.count.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      row.status === "Peak Influx" ? "bg-red-50 text-red-600 border border-red-100" :
                      row.status === "Busy" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                      row.status === "Normal" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      "bg-green-50 text-green-700 border border-green-100"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold ${
                      row.capacity === "Over Capacity" ? "text-red-600" :
                      row.capacity === "Borderline" ? "text-orange-500" :
                      "text-green-600"
                    }`}>
                      {row.capacity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#8B6B47]">{row.weather}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-[#8B4513]">{row.waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Command & Radar Controls */}
      <div className="grid lg:grid-cols-2 gap-5">
        <CrowdCorrelationChart />
        <TempleResourceRadar />
      </div>
    </DashboardShell>
  );
}

// ─── Pilgrim Ticket & Action Center Component ─────────────────────────────────
function PilgrimActionCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Action states
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("09:00 AM - 11:00 AM");
  const [prasadamCount, setPrasadamCount] = useState(0);
  const [actionMessage, setActionMessage] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setBooking(null);
    setActionMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/bookings?phone=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Booking not found");
      }
      const data = await res.json();
      setBooking(data);
      setPrasadamCount(data.prasadamCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType, payload = {}) => {
    if (!booking) return;
    setLoading(true);
    setError("");
    setActionMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/bookings/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: booking.id,
          action: actionType,
          ...payload
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Action failed");
      }
      const result = await res.json();
      setBooking(result.booking);
      setActionMessage(`Success: ${result.message}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#B8860B]/15 shadow-sm flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-[#B8860B]" />
          <h3 className="font-cinzel font-bold text-[#2C1810] text-sm">
            Pilgrim Action Center
          </h3>
        </div>
        <p className="text-[11px] text-[#8B6B47] mb-3 leading-relaxed">
          Enter phone number (e.g. 9876543210) to manage ticket.
        </p>
        
        <div className="flex gap-1.5 mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Phone or Booking ID"
            className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#B8860B]/20 text-xs focus:outline-none focus:border-[#B8860B] bg-white text-[#2C1810]"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-[#B8860B] text-white text-xs font-semibold hover:bg-[#8B4513] transition-colors disabled:opacity-50"
          >
            Go
          </button>
        </div>

        {error && <div className="text-[11px] text-red-600 mb-3 font-semibold">{error}</div>}
        {actionMessage && <div className="text-[11px] text-green-600 mb-3 font-semibold">{actionMessage}</div>}

        {booking && (
          <div className="space-y-3 border-t border-[#B8860B]/10 pt-3 text-[#2C1810]">
            <div className="bg-[#FFF8E7] p-2.5 rounded-xl border border-[#B8860B]/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8B6B47]">Name:</span>
                <span className="font-semibold text-[#2C1810]">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B6B47]">ID:</span>
                <span className="font-mono text-[#2C1810]">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B6B47]">Status:</span>
                <span className={`font-bold ${booking.status === 'Confirmed' ? 'text-green-600' : booking.status === 'Checked In' ? 'text-blue-600' : 'text-red-500'}`}>{booking.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B6B47]">Slot:</span>
                <span className="text-[#2C1810] font-medium">{booking.date} · {booking.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B6B47]">Laddus:</span>
                <span className="text-[#2C1810] font-medium">{booking.prasadamCount}</span>
              </div>
            </div>

            {booking.status === 'Confirmed' && (
              <div className="space-y-2 text-xs">
                {/* Reschedule */}
                <div className="p-2 border border-[#B8860B]/10 rounded-lg bg-white space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#5C3A1E] block">Reschedule</span>
                  <div className="flex flex-col gap-1">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="px-2 py-1 border border-[#B8860B]/20 rounded text-[10px] focus:outline-none bg-white text-[#2C1810]"
                    />
                    <select
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      className="px-2 py-1 border border-[#B8860B]/20 rounded text-[10px] focus:outline-none bg-white text-[#2C1810]"
                    >
                      <option>06:00 AM - 08:00 AM</option>
                      <option>09:00 AM - 11:00 AM</option>
                      <option>11:00 AM - 01:00 PM</option>
                      <option>02:00 PM - 05:00 PM</option>
                      <option>05:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleAction("reschedule", { date: newDate, slot: newSlot })}
                    disabled={loading || !newDate}
                    className="w-full py-1 bg-[#B8860B] text-white text-[9px] font-bold rounded hover:bg-[#8B4513] transition-colors disabled:opacity-50"
                  >
                    Confirm Reschedule
                  </button>
                </div>

                {/* Prasadam */}
                <div className="p-2 border border-[#B8860B]/10 rounded-lg bg-white flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#5C3A1E]">Add Laddus:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 border border-[#B8860B]/20 rounded px-1.5 py-0.5">
                      <button onClick={() => setPrasadamCount(Math.max(0, prasadamCount - 1))} className="text-[#B8860B] font-bold text-[10px]">-</button>
                      <span className="text-[10px] text-[#2C1810] font-semibold min-w-3 text-center">{prasadamCount}</span>
                      <button onClick={() => setPrasadamCount(prasadamCount + 1)} className="text-[#B8860B] font-bold text-[10px]">+</button>
                    </div>
                    <button
                      onClick={() => handleAction("updatePrasadam", { prasadamCount })}
                      disabled={loading || prasadamCount === booking.prasadamCount}
                      className="px-2 py-1 bg-[#B8860B] text-white text-[9px] font-bold rounded hover:bg-[#8B4513] transition-colors disabled:opacity-50"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Cancel */}
                <button
                  onClick={() => {
                    if (window.confirm("Cancel this booking?")) {
                      handleAction("cancel");
                    }
                  }}
                  disabled={loading}
                  className="w-full py-1 border border-red-500 text-red-600 text-[10px] font-semibold rounded hover:bg-red-50 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {booking && (
        <div className="border-t border-[#B8860B]/10 pt-2.5 mt-2.5">
          <span className="text-[9px] font-bold text-[#8B6B47] uppercase block mb-1">Booking Log</span>
          <div className="space-y-1 max-h-16 overflow-y-auto pr-1">
            {booking.history.map((log, i) => (
              <div key={i} className="text-[9px] text-[#8B6B47] flex justify-between gap-2">
                <span className="truncate">{log.message}</span>
                <span className="text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const prevPage = useRef("landing");
  const [userRole, setUserRole] = useState(null);

  // Enforce page constraints based on authenticated userRole
  const isPageAllowed = (p, role) => {
    if (p === "landing" || p === "login" || p === "register") return true;
    if (!role) return false;
    if (p === "pilgrim") return true;
    if (p === "booking_center") return true;
    if (p === "travel_assistant") return true;
    if (p === "sacred_places") return true;
    if (p === "government") return role === "government";
    if (p === "temple") return role === "temple";
    if (p === "hotel") return role === "hotel" || role === "temple";
    if (p === "travel") return role === "travel" || role === "temple";
    return false;
  };

  useEffect(() => {
    if (!isPageAllowed(page, userRole)) {
      if (userRole) {
        setPage(userRole);
      } else {
        setPage("login");
      }
    }
  }, [page, userRole]);

  const [stats, setStats] = useState({
    crowdData: [],
    occupancyData: [],
    travelDemandData: [],
    templeWeeklyData: [],
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.log("Backend not running, using local mock fallbacks", err));
  }, []);

  const setPageWithScroll = (p) => {
    prevPage.current = page;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNav = page !== "login" && page !== "register";

  return (
    <div className="font-inter bg-background text-foreground min-h-screen">
      <style>{`
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #FFF8E7; }
        ::-webkit-scrollbar-thumb { background: #B8860B40; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #B8860B80; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(0.5deg); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -40; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {showNav && <Navbar currentPage={page} setPage={setPageWithScroll} />}
      {page === "landing" && <LandingPage setPage={setPageWithScroll} />}
      {page === "login" && <LoginPage setPage={setPageWithScroll} setUserRole={setUserRole} />}
      {page === "register" && <RegisterPage setPage={setPageWithScroll} setUserRole={setUserRole} />}
      {page === "pilgrim" && <PilgrimDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
      {page === "booking_center" && <BookingCenterDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
      {page === "travel_assistant" && <TravelAssistantDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
      {page === "sacred_places" && <SacredPlacesDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
      {page === "hotel" && <HotelDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
      {page === "travel" && <TravelDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
      {page === "temple" && <TempleDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
      {page === "government" && <GovernmentDashboard setPage={setPageWithScroll} stats={stats} userRole={userRole} setUserRole={setUserRole} />}
    </div>
  );
}
