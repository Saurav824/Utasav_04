import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Filter, X, ChevronRight, Map as MapIcon, Info, Image as ImageIcon, Camera, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { INDIAN_STATES, StateData } from '../data/heritageData';
import { analyzeImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'] as const;

export const HeritageTourism: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<typeof REGIONS[number]>('All');
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [activeTab, setActiveTab] = useState<'heritage' | 'tourist' | 'festivals' | 'gallery' | 'ai'>('heritage');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    const loadGeoJson = async () => {
      // Reliable GeoJSON source for India states from Highcharts
      const url = "https://raw.githubusercontent.com/highcharts/map-collection-dist/master/countries/in/in-all.geo.json";
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // Basic validation to ensure it's a GeoJSON object
        if (data && (data.type === "FeatureCollection" || data.type === "Feature")) {
          setGeoJsonData(data);
        } else {
          throw new Error("Invalid GeoJSON format");
        }
      } catch (err) {
        console.error("Failed to load GeoJSON:", err);
      }
    };

    loadGeoJson();
  }, []);

  const handleAiAnalysis = async (imageUrl: string, stateName: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      // Convert image URL to base64 for analysis
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeImage(base64, blob.type, `Analyze this image of ${stateName} in extreme detail. Provide a comprehensive historical context, including the era it belongs to, the architectural style (if applicable), its significance in Indian history, and any interesting legends or facts associated with it. Format the response with clear headings and bullet points for readability.`);
        setAiAnalysis(analysis || "I couldn't analyze this image at the moment.");
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      setAiAnalysis("Failed to connect to the AI spirits. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const geoJsonStyle = () => {
    return {
      fillColor: "#f59e0b",
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.2
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#fff',
          fillOpacity: 0.5
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: 'white',
          fillOpacity: 0.2
        });
      },
      click: () => {
        const stateName = feature.properties.name;
        // Map GeoJSON state names to our data names if necessary
        const nameMap: Record<string, string> = {
          "Andaman and Nicobar": "Andaman and Nicobar Islands",
          "Arunanchal Pradesh": "Arunachal Pradesh",
          "Dadra and Nagar Haveli and Daman and Diu": "Dadra and Nagar Haveli",
          "NCT of Delhi": "Delhi"
        };
        
        const mappedName = nameMap[stateName] || stateName;
        const state = INDIAN_STATES.find(s => s.name.toLowerCase() === mappedName.toLowerCase());
        
        if (state) {
          setSelectedState(state);
          setActiveTab('heritage');
          
          // Smooth scroll to the state card as well
          setTimeout(() => {
            const element = document.getElementById(`state-card-${state.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
    });
  };

  const filteredStates = useMemo(() => {
    return INDIAN_STATES.filter(state => {
      const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          state.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || state.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, selectedRegion]);

  return (
    <div id="heritage" className="min-h-screen bg-stone-950 text-stone-100 py-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif mb-6 text-amber-500"
        >
          Heritage & Tourism of India
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-stone-400 max-w-3xl mx-auto"
        >
          Discover the soul of India through its ancient monuments, breathtaking landscapes, and vibrant cultural celebrations.
        </motion.p>
      </div>

      {/* Featured Spotlight */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer"
          onClick={() => setSelectedState(INDIAN_STATES.find(s => s.id === 'uttar-pradesh') || null)}
        >
          <img 
            src="https://images.unsplash.com/photo-1564507592333-c60657451dd7?auto=format&fit=crop&q=80&w=1920" 
            alt="Taj Mahal"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-full mb-4 w-fit">
              Featured Heritage Site
            </div>
            <h2 className="text-4xl md:text-6xl font-serif mb-4">The Taj Mahal</h2>
            <p className="text-lg text-stone-300 max-w-2xl mb-6">
              An ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. A UNESCO World Heritage site and one of the Seven Wonders of the World.
            </p>
            <button className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors">
              Explore Uttar Pradesh <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Interactive Map & Filters */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-stone-900/50 p-8 rounded-3xl border border-stone-800">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif flex items-center gap-2">
                <MapIcon className="text-amber-500" /> Interactive India Map
              </h3>
              <span className="text-sm text-stone-500">Select a state to explore</span>
            </div>
            
            <div className="relative h-[600px] bg-stone-950/50 rounded-2xl overflow-hidden border border-stone-800">
              <MapContainer 
                center={[22.9734, 78.6569]} 
                zoom={5} 
                style={{ height: '100%', width: '100%', background: '#0c0a09' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {geoJsonData && (
                  <GeoJSON 
                    data={geoJsonData} 
                    style={geoJsonStyle}
                    onEachFeature={onEachFeature}
                  />
                )}
              </MapContainer>
              
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/80 backdrop-blur-sm p-4 rounded-xl border border-stone-800 z-[1000]">
                <p className="text-xs text-stone-400 text-center italic">
                  * Interactive India Map. Click states to explore their heritage.
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-8">
            <div className="bg-stone-900/50 p-8 rounded-3xl border border-stone-800">
              <h3 className="text-2xl font-serif mb-6 flex items-center gap-2">
                <Search className="text-amber-500" /> Find Your Destination
              </h3>
              
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
                <input 
                  type="text"
                  placeholder="Search states, monuments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                  <Filter size={14} /> Filter by Region
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        selectedRegion === region 
                          ? 'bg-amber-500 text-black font-bold' 
                          : 'bg-stone-950 text-stone-400 border border-stone-800 hover:border-stone-600'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 p-8 rounded-3xl border border-amber-500/20">
              <h4 className="text-amber-500 font-bold mb-2">Travel Tip</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                India's climate varies significantly. The best time to visit is between October and March when the weather is pleasant.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* States Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredStates.map((state, index) => (
              <motion.div
                key={state.id}
                id={`state-card-${state.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-stone-900/40 rounded-3xl overflow-hidden border border-stone-800/50 hover:border-amber-500/50 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={state.image} 
                    alt={state.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-amber-500 border border-amber-500/30 uppercase">
                    {state.region}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-3xl font-serif mb-2 group-hover:text-amber-500 transition-colors duration-300">
                      {state.name}
                    </h3>
                    <div className="w-12 h-0.5 bg-amber-500/30 group-hover:w-24 transition-all duration-500" />
                  </div>
                  
                  <p className="text-stone-400 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
                    {state.description}
                  </p>

                  <button 
                    onClick={() => {
                      setSelectedState(state);
                      setActiveTab('heritage');
                    }}
                    className="group/btn relative w-full py-4 bg-stone-950 border border-stone-800 rounded-2xl font-bold text-sm tracking-widest uppercase overflow-hidden transition-all hover:border-amber-500"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:text-black transition-colors duration-300">
                      Explore {state.name} <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* State Detail Modal */}
      <AnimatePresence>
        {selectedState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedState(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-stone-900 rounded-3xl overflow-hidden flex flex-col border border-stone-800 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="relative h-72 md:h-96 shrink-0">
                <img 
                  src={selectedState.image} 
                  alt={selectedState.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
                <button 
                  onClick={() => setSelectedState(null)}
                  className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black/80 rounded-full transition-colors text-white"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 text-amber-500 text-sm font-bold uppercase tracking-widest mb-2">
                    <MapPin size={16} /> {selectedState.region} India
                  </div>
                  <h2 className="text-4xl md:text-6xl font-serif">{selectedState.name}</h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                  {/* Sidebar Info */}
                  <div className="lg:col-span-1 space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={16} /> Highlights
                      </h4>
                      <ul className="space-y-3">
                        {selectedState.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-stone-300">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
                      <h4 className="text-amber-500 font-bold mb-4 flex items-center gap-2">
                        <Calendar size={16} /> Best Time to Visit
                      </h4>
                      <p className="text-stone-400 text-sm">
                        October to March is ideal for exploring {selectedState.name}.
                      </p>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="lg:col-span-3 space-y-12">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-4 border-b border-stone-800 pb-4">
                      {[
                        { id: 'heritage', label: 'Heritage Sites', icon: MapIcon },
                        { id: 'tourist', label: 'Tourist Spots', icon: Camera },
                        { id: 'festivals', label: 'Festivals', icon: Calendar },
                        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
                        { id: 'ai', label: 'AI Insights', icon: Sparkles }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            activeTab === tab.id 
                              ? 'bg-amber-500 text-black font-bold' 
                              : 'text-stone-400 hover:text-stone-100'
                          }`}
                        >
                          <tab.icon size={18} /> {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                      {activeTab === 'heritage' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedState.heritageSites.map((site, i) => (
                            <div key={i} className="bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 group">
                              <div className="h-48 overflow-hidden">
                                <img src={site.image} alt={site.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                              </div>
                              <div className="p-6">
                                <h5 className="text-xl font-serif mb-2 text-amber-500">{site.name}</h5>
                                <p className="text-stone-400 text-sm leading-relaxed">{site.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'tourist' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedState.touristAttractions.map((spot, i) => (
                            <div key={i} className="bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 group">
                              <div className="h-48 overflow-hidden">
                                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                              </div>
                              <div className="p-6">
                                <div className="inline-block px-2 py-0.5 bg-stone-800 text-stone-400 text-[10px] font-bold uppercase rounded mb-2">
                                  {spot.type}
                                </div>
                                <h5 className="text-xl font-serif mb-2 text-amber-500">{spot.name}</h5>
                                <p className="text-stone-400 text-sm leading-relaxed">{spot.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'festivals' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedState.festivals.map((fest, i) => (
                            <div key={i} className="bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 group">
                              <div className="h-48 overflow-hidden">
                                <img src={fest.image} alt={fest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                              </div>
                              <div className="p-6">
                                <h5 className="text-xl font-serif mb-2 text-amber-500">{fest.name}</h5>
                                <p className="text-stone-400 text-sm leading-relaxed">{fest.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedState.gallery.map((img, i) => (
                            <motion.div 
                              key={i}
                              whileHover={{ scale: 1.05 }}
                              className="relative aspect-square rounded-xl overflow-hidden border border-stone-800 group"
                            >
                              <img src={img} alt={`${selectedState.name} gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button 
                                onClick={() => {
                                  setActiveTab('ai');
                                  handleAiAnalysis(img, selectedState.name);
                                }}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-amber-500 font-bold text-xs"
                              >
                                <Sparkles size={14} /> Analyze with AI
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'ai' && (
                        <div className="bg-stone-950 rounded-3xl p-8 border border-amber-500/20">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-amber-500/10 rounded-2xl">
                              <Sparkles className="text-amber-500" size={24} />
                            </div>
                            <div>
                              <h4 className="text-xl font-serif text-amber-100">AI Cultural Insights</h4>
                              <p className="text-stone-500 text-xs uppercase tracking-widest font-bold">Powered by Gemini 3.1 Pro</p>
                            </div>
                          </div>

                          {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                              <Loader2 className="text-amber-500 animate-spin" size={40} />
                              <p className="text-stone-400 animate-pulse">Consulting the ancient records...</p>
                            </div>
                          ) : aiAnalysis ? (
                            <div className="prose prose-invert max-w-none">
                              <div className="text-stone-300 leading-relaxed space-y-4">
                                <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                              </div>
                              <button 
                                onClick={() => setAiAnalysis(null)}
                                className="mt-8 px-6 py-2 bg-stone-900 border border-white/10 text-stone-400 rounded-xl hover:text-amber-500 transition-all text-sm"
                              >
                                Analyze Another Image
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-8">
                              <div className="text-center">
                                <ImageIcon className="mx-auto text-stone-800 mb-4" size={48} />
                                <p className="text-stone-500 mb-6">Select an image from the gallery below to get deep cultural insights.</p>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {selectedState.gallery.map((img, i) => (
                                  <motion.div 
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative aspect-square rounded-xl overflow-hidden border border-stone-800 group cursor-pointer"
                                    onClick={() => handleAiAnalysis(img, selectedState.name)}
                                  >
                                    <img src={img} alt={`${selectedState.name} gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Sparkles className="text-amber-500" size={24} />
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
