import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Compass,
  Sparkles,
  Info,
  Calendar,
  ExternalLink,
  Navigation,
} from "lucide-react";

// --- Seven Hills Data ---
const sevenHills = [
  {
    name: "Seshadri",
    height: "900m",
    meaning: "Named after Adisesha, the divine serpent upon whom Lord Vishnu rests.",
    importance: "Represents one of the seven heads of Adisesha. Considered among the most sacred hills of Tirumala.",
    history: "Lauded in Varaha Purana as the gateway of spiritual energy descending from Vaikuntam.",
    legends: "Seshadri derives its name from Adisesha, the celestial serpent of Lord Vishnu. According to Hindu tradition, the Seven Hills of Tirumala symbolize the seven hoods of Adisesha.",
    location: "Southeastern boundary, forming the main range entrance.",
    facts: "Contains rare red sandalwood tree clusters and high-density medicinal herbal thickets.",
    gradient: "from-[#B8860B] to-[#8B4513]",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/95/Sapthagiri_hills_Tirumala_Tirupati.JPG",
    mediaLink: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Seshadri+Tirumala"
  },
  {
    name: "Neeladri",
    height: "850m",
    meaning: "Named after Neela Devi.",
    importance: "Associated with the famous tonsure (hair offering) tradition followed by devotees visiting Tirumala.",
    history: "The origin point of the sacred 'Kalyana Katta' tonsuring ritual performed by millions.",
    legends: "Neeladri is named after Neela Devi. Devotees offer their hair as an act of devotion, a tradition closely associated with this sacred hill.",
    location: "Northern range, flanking the temple village.",
    facts: "Houses the ancient temple of Neela Devi and receives over 35,000 tonsuring offerings daily.",
    gradient: "from-[#8B4513] to-[#5C3A1E]",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Tirumala_Hills_View.jpg",
    mediaLink: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Neeladri+Tirumala"
  },
  {
    name: "Garudadri",
    height: "880m",
    meaning: "Named after Garuda, the divine vehicle of Lord Vishnu.",
    importance: "Represents the devotion and service of Garuda toward Lord Vishnu.",
    history: "Puranic texts state this hill was physically transported from Vaikuntam by Garuda to serve as the Lord's abode.",
    legends: "Garudadri symbolizes Garuda, the celestial mount of Lord Vishnu and a powerful symbol of faith and protection.",
    location: "Western ridge of the hills.",
    facts: "A natural giant boulder formation on this hill resembles a majestic eagle with outstretched wings.",
    gradient: "from-[#5C3A1E] to-[#B8860B]",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/07/Sapthagiri_Hills_Tirumala.JPG",
    mediaLink: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Garudadri+Tirumala"
  },
  {
    name: "Anjanadri",
    height: "920m",
    meaning: "Named after Anjana Devi, mother of Lord Hanuman.",
    importance: "Widely believed to be the birthplace of Lord Hanuman.",
    history: "Recognized in classical texts as the peak where Anjana Devi performed 12 years of severe penance.",
    legends: "Anjanadri holds immense religious significance as the sacred birthplace of Lord Hanuman, one of Hinduism's most revered deities.",
    location: "Akashaganga range.",
    facts: "Features the sacred Akashaganga Waterfall, whose holy waters are used daily for the main deity's Abhishekam.",
    gradient: "from-[#B8860B] to-[#D4A843]",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Tirumala_Hills_view.jpg",
    mediaLink: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Anjanadri+Tirumala"
  },
  {
    name: "Vrushabhadri",
    height: "890m",
    meaning: "Named after Vrushabhasura.",
    importance: "According to legend, Vrushabhasura attained salvation after being defeated by Lord Vishnu.",
    history: "Commemorates the epic battle between Lord Venkateswara and the righteous yet proud demon Vrushabhasura.",
    legends: "Vrushabhadri commemorates the legend of Vrushabhasura, whose devotion ultimately led to liberation.",
    location: "Inner valley, towards the north.",
    facts: "Rich in geothermal springs and ancient rock carvings depicting the battle of the chakras.",
    gradient: "from-[#8B4513] to-[#D4A843]",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Ghat_road_leading_to_Tirumala_from_Tirupati_%28May_2019%29_3.jpg",
    mediaLink: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Vrishabhadri+Tirumala"
  },
  {
    name: "Narayanadri",
    height: "910m",
    meaning: "Named after Narayana (Lord Vishnu).",
    importance: "Home to Srivari Padalu, believed to be the first footprints of Lord Venkateswara on Earth.",
    history: "Associated with Sage Narayana, who established the first spiritual hermitages on this range.",
    legends: "Narayanadri is revered as the location of Srivari Padalu, where Lord Venkateswara is believed to have first set foot on Earth.",
    location: "Northernmost ridge.",
    facts: "Houses the holy Srivari Padalu (Footprints of the Lord) at the highest elevation point of Tirumala.",
    gradient: "from-[#2C1810] to-[#8B4513]",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Srivari_Padalu_steps_on_Tirumala_hills_%28May_2019%29_3.jpg",
    mediaLink: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Narayanadri+Tirumala"
  },
  {
    name: "Venkatadri",
    height: "860m",
    meaning: "Named after Lord Venkateswara.",
    importance: "The Sri Venkateswara Temple, one of the world's most visited pilgrimage destinations, is situated on this hill.",
    history: "The supreme destination of the Kaliyuga, housing the main temple complex constructed over 1500 years ago.",
    legends: "Venkatadri is the holiest of the Seven Hills and the sacred abode of Lord Venkateswara. The renowned Tirumala Temple stands atop this hill.",
    location: "The core temple town of Tirumala.",
    facts: "The inner sanctum is topped by the 'Ananda Nilaya Vimana', covered in 250 kilograms of pure gold plates.",
    gradient: "from-[#B8860B] to-[#FFF8E7]/40",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/A_View_of_Tirumala_Venkateswara_Temple.JPG",
    mediaLink: "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Venkatadri+Tirumala"
  }
];

// --- Near-Temple Attractions Data ---
const nearbySacredPlaces = [
  {
    name: "Sri Padmavathi Ammavari Temple",
    deity: "Goddess Padmavathi (Ammavari)",
    location: "Tiruchanur",
    distance: "5.0 km from Tirupati Station",
    timings: "5:00 AM - 9:00 PM",
    significance: "Consort of Lord Venkateswara. Tradition dictates visiting this temple before ascending Tirumala.",
    ritual: "Kartheeka Brahmotsavams (holy bath in Padma Sarovaram pond).",
    description: "Built at the site where Goddess Padmavathi manifested in a golden lotus pond. An architectural marvel in Chola style.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Padmavathi_Ammavari_Temple.JPG",
  },
  {
    name: "Sri Govindaraja Swamy Temple",
    deity: "Lord Govindaraja Swamy (Lord Vishnu)",
    location: "Tirupati City Center",
    distance: "0.5 km (Walking distance from station)",
    timings: "5:00 AM - 9:30 PM",
    significance: "Elder brother of Lord Venkateswara who carefully calculated and managed the Lord's marriage wealth.",
    ritual: "Viswaroopa Sarvadarsanam (early morning deity awakening).",
    description: "Features a massive 7-tiered outer Gopuram dating back to 1130 AD, consecration blessed by Saint Ramanujacharya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Tirupathi_%286337140675%29.jpg",
  },
  {
    name: "Kapila Theertham & Waterfall",
    deity: "Lord Kapileswara (Lord Shiva)",
    location: "Alipiri Footpath Foothills",
    distance: "3.2 km from Tirupati Station",
    timings: "5:00 AM - 8:00 PM",
    significance: "The only Shiva temple in Tirupati city. Located at the base of the sacred waterfalls.",
    ritual: "Maha Shivaratri & holy dip during Kartik Month.",
    description: "Features a breathtaking natural mountain spring dropping directly into the temple pushkarini (pond). Named after Sage Kapila.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/00/Kapilatheertam.jpg",
  },
  {
    name: "Sri Kalyana Venkateswara Temple",
    deity: "Lord Venkateswara & Padmavathi (Newlywed form)",
    location: "Srinivasa Mangapuram",
    distance: "12.0 km West of Tirupati",
    timings: "5:30 AM - 8:00 PM",
    significance: "Devotees who cannot climb Tirumala can receive equivalent blessings here. The place where the divine couple stayed.",
    ritual: "Kalyanotsavam (marriage ritual simulations).",
    description: "According to legend, Lord Venkateswara stayed here for six months after his marriage to seek blessings from Sage Agastya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Srinivasamangapuram_Temple_Tirupati.jpg",
  },
  {
    name: "Srikalahasti Vayu Lingam Temple",
    deity: "Lord Shiva (representing Air element)",
    location: "Srikalahasti Town",
    distance: "36.0 km North-East of Tirupati",
    timings: "6:00 AM - 9:00 PM",
    significance: "One of the Panchabhoota Sthalas. Highly renowned for Rahu-Ketu Dosha Nivarana Poojas.",
    ritual: "Rahu Ketu Sarpa Dosha Pooja (performed hourly in mandapams).",
    description: "Nestled between the banks of Swarnamukhi river and the surrounding hills, featuring monolithic structures from Vijayanagara rule.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Sri_Kala_Hasti.jpg",
  },
  {
    name: "Sri Varasidhi Vinayaka Temple",
    deity: "Lord Ganesha (growing in water)",
    location: "Kanipakam",
    distance: "70.0 km West of Tirupati",
    timings: "4:00 AM - 9:30 PM",
    significance: "The Ganesha idol resides inside a live spring and is historically proven to be growing in size.",
    ritual: "Sankatahara Chaturthi Pooja.",
    description: "Built by the Chola kings in the 11th century, the temple pond water is considered holy and medicinal.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Kanipakam_Temple.jpg",
  },
];

export default function SacredPlaces() {
  const [activeHill, setActiveHill] = useState(0);
  const [activePlace, setActivePlace] = useState(0);

  return (
    <div className="space-y-12 w-full max-w-full overflow-hidden">
      {/* --- SEVEN HILLS EXPERIENCE --- */}
      <section className="bg-gradient-to-b from-[#2C1810] to-[#1A0A00] text-white rounded-2xl p-6 relative overflow-hidden shadow-2xl w-full max-w-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent opacity-65 pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10 border-b border-white/10 pb-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4A843] font-bold block mb-1">
            Divine Peaks
          </span>
          <h3 className="font-cinzel font-bold text-2xl text-white">
            Seven Hills (Sapthagiri) Experience
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Explore the spiritual architecture and sacred geography of the seven peaks representing Adisesha's hoods.
          </p>
        </div>

        {/* Horizontal Selection Bar (Constrained) */}
        <div className="w-full max-w-full overflow-hidden relative z-10 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {sevenHills.map((hill, idx) => (
              <button
                key={hill.name}
                onClick={() => setActiveHill(idx)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  activeHill === idx
                    ? "bg-white/15 border-[#D4A843] text-[#D4A843] shadow-md shadow-[#D4A843]/10 font-bold"
                    : "bg-white/5 border-transparent text-white/70 hover:bg-white/8 hover:border-white/20"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeHill === idx ? "bg-[#D4A843] animate-pulse" : "bg-white/30"}`} />
                <span className="font-cinzel text-xs tracking-wider uppercase">
                  {idx + 1}. {hill.name}
                </span>
                <span className={`text-[9px] font-mono ${activeHill === idx ? "text-[#D4A843]" : "text-white/40"}`}>{hill.height}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Details Card (Full Width & Constrained) */}
        <div className="relative z-10 w-full max-w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-500">
          <div className={`absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-gradient-to-br ${sevenHills[activeHill].gradient} blur-[100px] opacity-40 pointer-events-none`} />

          <div className="space-y-4">
            {/* Hill Peak Photo */}
            <div className="relative w-full h-80 md:h-[450px] overflow-hidden rounded-xl border border-white/10">
              <img 
                src={sevenHills[activeHill].image} 
                alt={sevenHills[activeHill].name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A00]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-bold text-[#D4A843] uppercase tracking-widest bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {sevenHills[activeHill].name} Peak
                </span>
              </div>
            </div>

            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-cinzel font-bold text-lg text-[#D4A843]">{sevenHills[activeHill].name} Peak</h4>
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

          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-4 mt-6 gap-3">
            <button
              onClick={() => setActiveHill((prev) => (prev > 0 ? prev - 1 : sevenHills.length - 1))}
              className="text-[10px] font-bold text-white/60 hover:text-[#D4A843] transition-colors cursor-pointer"
            >
              ◀ Previous Peak
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/40 font-mono">
                Peak {activeHill + 1} of {sevenHills.length}
              </span>
              {sevenHills[activeHill].mediaLink && (
                <a
                  href={sevenHills[activeHill].mediaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-bold bg-[#D4A843] hover:bg-[#B8860B] text-black px-2.5 py-1 rounded transition-colors"
                >
                  <span>View More Photos</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
            <button
              onClick={() => setActiveHill((prev) => (prev < sevenHills.length - 1 ? prev + 1 : 0))}
              className="text-[10px] font-bold text-white/60 hover:text-[#D4A843] transition-colors cursor-pointer"
            >
              Next Peak ▶
            </button>
          </div>
        </div>
      </section>

      {/* --- NEAREST SACRED PLACES --- */}
      <section className="bg-white/70 backdrop-blur border border-[#B8860B]/15 shadow-xl rounded-2xl p-6 w-full max-w-full overflow-hidden">
        <div className="border-b border-[#B8860B]/10 pb-4 mb-6">
          <h3 className="font-cinzel font-bold text-xl text-[#2C1810]">
            Nearest Sacred Place's & Temples
          </h3>
          <p className="text-xs text-[#8B6B47] mt-0.5">
            Plan your auxiliary visits to other historical and spiritually charged shrines around the Tirupati-Tirumala basin.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Navigation/Sidebar for place items */}
          <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {nearbySacredPlaces.map((place, idx) => (
              <div
                key={place.name}
                onClick={() => setActivePlace(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  activePlace === idx
                    ? "bg-[#B8860B]/10 border-[#B8860B] shadow-sm"
                    : "bg-white border-[#B8860B]/10 hover:border-[#B8860B]/30 hover:bg-[#FFF8E7]/30"
                }`}
              >
                <div className="space-y-1">
                  <h4 className="font-cinzel font-bold text-xs text-[#2C1810] group-hover:text-[#B8860B] transition-colors">
                    {place.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#8B6B47]">
                    <span className="flex items-center gap-0.5"><MapPin size={10} /> {place.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#8B4513]">{place.distance.split(" from ")[0]}</span>
                  </div>
                </div>
                <Navigation size={13} className={`transition-transform group-hover:translate-x-0.5 ${activePlace === idx ? "text-[#B8860B]" : "text-[#8B6B47]/40"}`} />
              </div>
            ))}
          </div>

          {/* Place Detailed View */}
          <div className="lg:col-span-7 bg-white border border-[#B8860B]/15 rounded-2xl p-6 shadow-sm space-y-4">
            {/* Sacred Place Image */}
            <div className="relative w-full h-80 md:h-[450px] overflow-hidden rounded-xl border border-[#B8860B]/10">
              <img 
                src={nearbySacredPlaces[activePlace].image} 
                alt={nearbySacredPlaces[activePlace].name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#B8860B]/10 pb-3 gap-2">
              <div>
                <h4 className="font-cinzel font-bold text-lg text-[#2C1810]">
                  {nearbySacredPlaces[activePlace].name}
                </h4>
                <div className="flex flex-wrap gap-2 items-center text-xs text-[#8B6B47] mt-1.5">
                  <span className="bg-[#B8860B]/10 text-[#8B4513] px-2 py-0.5 rounded font-semibold text-[10px]">
                    Deity: {nearbySacredPlaces[activePlace].deity}
                  </span>
                  <span className="flex items-center gap-0.5 font-medium"><MapPin size={11} className="text-[#B8860B]" /> {nearbySacredPlaces[activePlace].location}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5C3A1E] leading-relaxed">
              {nearbySacredPlaces[activePlace].description}
            </p>

            <div className="grid md:grid-cols-2 gap-4 text-xs font-medium">
              <div className="bg-[#FFF8E7] p-3 rounded-xl border border-[#B8860B]/10 space-y-2">
                <div className="flex items-center gap-1.5 text-[#B8860B] font-bold uppercase text-[9px] tracking-wider">
                  <Compass size={11} />
                  <span>Spiritual Significance</span>
                </div>
                <p className="text-[#8B6B47] leading-relaxed text-[11px] font-normal">
                  {nearbySacredPlaces[activePlace].significance}
                </p>
              </div>

              <div className="bg-[#FFF8E7] p-3 rounded-xl border border-[#B8860B]/10 space-y-2">
                <div className="flex items-center gap-1.5 text-[#B8860B] font-bold uppercase text-[9px] tracking-wider">
                  <Calendar size={11} />
                  <span>Key Rituals & Festivals</span>
                </div>
                <p className="text-[#8B6B47] leading-relaxed text-[11px] font-normal">
                  {nearbySacredPlaces[activePlace].ritual}
                </p>
              </div>
            </div>

            <div className="border-t border-[#B8860B]/10 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="flex gap-4 text-[#8B6B47]">
                <span className="flex items-center gap-1"><Clock size={12} className="text-[#B8860B]" /> <strong>Timings:</strong> {nearbySacredPlaces[activePlace].timings}</span>
                <span className="flex items-center gap-1"><MapPin size={12} className="text-[#B8860B]" /> <strong>Distance:</strong> {nearbySacredPlaces[activePlace].distance}</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B8860B] hover:bg-[#8B4513] text-white text-[11px] transition-colors cursor-pointer">
                <span>View Route Guide</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
