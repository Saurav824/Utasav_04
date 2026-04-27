
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Craft, Artisan } from '../types';
import { Sparkles, Loader2, Info, X, MapPin, Share2 } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const CRAFTS: Craft[] = [
  { id: '1', name: 'Kalamkari Art', state: 'Andhra Pradesh', category: 'Painting', description: 'Hand-painted or block-printed cotton textile, produced in parts of India and Iran.', imageUrl: 'https://picsum.photos/seed/kalamkari/600/400' },
  { id: '2', name: 'Bamboo & Cane Crafts', state: 'Arunachal Pradesh', category: 'Handicraft', description: 'Traditional bamboo and cane products reflecting the tribal heritage of Arunachal.', imageUrl: 'https://picsum.photos/seed/bamboo/600/400' },
  { id: '3', name: 'Muga Silk', state: 'Assam', category: 'Textile', description: 'A variety of wild silk geographically tagged to the state of Assam in India.', imageUrl: 'https://picsum.photos/seed/silk/600/400' },
  { id: '4', name: 'Madhubani Paintings', state: 'Bihar', category: 'Painting', description: 'A style of Indian painting, practiced in the Mithila region of the Indian subcontinent.', imageUrl: 'https://picsum.photos/seed/madhubani/600/400' },
  { id: '5', name: 'Dhokra Metal Craft', state: 'Chhattisgarh', category: 'Metal Craft', description: 'Non-ferrous metal casting using the lost-wax casting technique.', imageUrl: 'https://picsum.photos/seed/dhokra/600/400' },
  { id: '6', name: 'Coconut Shell Crafts', state: 'Goa', category: 'Handicraft', description: 'Artistic items made from discarded coconut shells, a sustainable Goan tradition.', imageUrl: 'https://picsum.photos/seed/coconut/600/400' },
  { id: '7', name: 'Bandhani Tie-Dye', state: 'Gujarat', category: 'Textile', description: 'A type of tie-dye textile decorated by plucking the cloth with the fingernails into many tiny bindings.', imageUrl: 'https://picsum.photos/seed/bandhani/600/400' },
  { id: '8', name: 'Phulkari Embroidery', state: 'Haryana', category: 'Textile', description: 'Embroidery technique from the Punjab region, literally meaning flower work.', imageUrl: 'https://picsum.photos/seed/phulkari/600/400' },
  { id: '9', name: 'Kullu Shawls', state: 'Himachal Pradesh', category: 'Textile', description: 'Known for their striking geometrical patterns and vibrant colors.', imageUrl: 'https://picsum.photos/seed/kullu/600/400' },
  { id: '10', name: 'Sohrai Paintings', state: 'Jharkhand', category: 'Painting', description: 'A ritualistic mural art form practiced by tribal women in Jharkhand.', imageUrl: 'https://picsum.photos/seed/sohrai/600/400' },
  { id: '11', name: 'Mysore Silk & Sandalwood Carving', state: 'Karnataka', category: 'Woodwork', description: 'Exquisite silk and intricate sandalwood carvings from the royal city of Mysore.', imageUrl: 'https://picsum.photos/seed/mysore/600/400' },
  { id: '12', name: 'Coir Products', state: 'Kerala', category: 'Handicraft', description: 'Natural fiber extracted from the husk of coconut, used in floor mats, doormats, brushes and mattresses.', imageUrl: 'https://picsum.photos/seed/coir/600/400' },
  { id: '13', name: 'Chanderi & Maheshwari Sarees', state: 'Madhya Pradesh', category: 'Textile', description: 'Traditional ethnic fabric known for its lightweight, sheer texture and fine luxurious feel.', imageUrl: 'https://picsum.photos/seed/chanderi/600/400' },
  { id: '14', name: 'Paithani Sarees', state: 'Maharashtra', category: 'Textile', description: 'A variety of saree, named after the Paithan town in Aurangabad, Maharashtra.', imageUrl: 'https://picsum.photos/seed/paithani/600/400' },
  { id: '15', name: 'Longpi Pottery', state: 'Manipur', category: 'Pottery', description: 'Traditional stone pottery made by the Tangkhul Naga tribe.', imageUrl: 'https://picsum.photos/seed/longpi/600/400' },
  { id: '16', name: 'Bamboo Handicrafts', state: 'Meghalaya', category: 'Handicraft', description: 'Intricate bamboo work that is an integral part of the Khasi and Jaintia culture.', imageUrl: 'https://picsum.photos/seed/meghalaya/600/400' },
  { id: '17', name: 'Mizo Textiles', state: 'Mizoram', category: 'Textile', description: 'Traditional hand-woven textiles with unique patterns and vibrant colors.', imageUrl: 'https://picsum.photos/seed/mizo/600/400' },
  { id: '18', name: 'Naga Tribal Shawls', state: 'Nagaland', category: 'Textile', description: 'Each Naga tribe has its own unique shawl with specific patterns and meanings.', imageUrl: 'https://picsum.photos/seed/naga/600/400' },
  { id: '19', name: 'Pattachitra Painting', state: 'Odisha', category: 'Painting', description: 'Traditional, cloth-based scroll painting, based in the eastern Indian state of Odisha.', imageUrl: 'https://picsum.photos/seed/pattachitra/600/400' },
  { id: '20', name: 'Blue Pottery & Block Printing', state: 'Rajasthan', category: 'Pottery', description: 'Famous for its vibrant blue dye and intricate block-printed textiles.', imageUrl: 'https://picsum.photos/seed/bluepottery/600/400' },
  { id: '21', name: 'Thangka Paintings', state: 'Sikkim', category: 'Painting', description: 'Tibetan Buddhist painting on cotton, silk appliqué, usually depicting a Buddhist deity, scene, or mandala.', imageUrl: 'https://picsum.photos/seed/thangka/600/400' },
  { id: '22', name: 'Tanjore Paintings', state: 'Tamil Nadu', category: 'Painting', description: 'Classical South Indian painting style, which was inaugurated from the town of Thanjavur.', imageUrl: 'https://picsum.photos/seed/tanjore/600/400' },
  { id: '23', name: 'Pochampally Ikat', state: 'Telangana', category: 'Textile', description: 'A saree made in Bhoodan Pochampally, Yadadri Bhuvanagiri district, Telangana.', imageUrl: 'https://picsum.photos/seed/pochampally/600/400' },
  { id: '24', name: 'Chikankari Embroidery', state: 'Uttar Pradesh', category: 'Textile', description: 'A traditional embroidery style from Lucknow, India.', imageUrl: 'https://picsum.photos/seed/chikankari/600/400' },
  { id: '25', name: 'Aipan Art', state: 'Uttarakhand', category: 'Painting', description: 'A ritualistic folk art native to the Kumaon region of Uttarakhand.', imageUrl: 'https://picsum.photos/seed/aipan/600/400' },
  { id: '26', name: 'Kantha Embroidery', state: 'West Bengal', category: 'Textile', description: 'A type of embroidery craft in the eastern regions of the Indian subcontinent.', imageUrl: 'https://picsum.photos/seed/kantha/600/400' },
];

const ARTISANS: Artisan[] = [
  {
    id: 'a1',
    name: 'Ram Singh',
    craft: 'Blue Pottery',
    state: 'Rajasthan',
    story: 'Ram Singh has been practicing Blue Pottery for over 40 years. He learned the art from his father and is now teaching his grandchildren to preserve this royal craft.',
    imageUrl: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'a2',
    name: 'Lakshmi Devi',
    craft: 'Madhubani Painting',
    state: 'Bihar',
    story: 'Lakshmi Devi is a master of Madhubani art. She uses natural dyes made from flowers and leaves to create intricate stories on handmade paper.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'a3',
    name: 'Abdul Rashid',
    craft: 'Chikankari',
    state: 'Uttar Pradesh',
    story: 'Abdul Rashid is a third-generation Chikankari artisan from Lucknow. His intricate needlework has been recognized at national exhibitions.',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const CATEGORIES = ['All', 'Textile', 'Pottery', 'Painting', 'Woodwork', 'Metal Craft', 'Handicraft'];
const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'];

const STATE_REGIONS: Record<string, string> = {
  'Andhra Pradesh': 'South', 'Arunachal Pradesh': 'Northeast', 'Assam': 'Northeast', 'Bihar': 'East',
  'Chhattisgarh': 'Central', 'Goa': 'West', 'Gujarat': 'West', 'Haryana': 'North', 'Himachal Pradesh': 'North',
  'Jharkhand': 'East', 'Karnataka': 'South', 'Kerala': 'South', 'Madhya Pradesh': 'Central',
  'Maharashtra': 'West', 'Manipur': 'Northeast', 'Meghalaya': 'Northeast', 'Mizoram': 'Northeast',
  'Nagaland': 'Northeast', 'Odisha': 'East', 'Punjab': 'North', 'Rajasthan': 'West', 'Sikkim': 'Northeast',
  'Tamil Nadu': 'South', 'Telangana': 'South', 'Uttar Pradesh': 'North', 'Uttarakhand': 'North',
  'West Bengal': 'East'
};

export const ArtisanSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiAnalysis = async (imageUrl: string, craftName: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeImage(base64, blob.type, `Analyze this image of ${craftName}. Tell me about the techniques, materials, and cultural history behind this craft.`);
        setAiAnalysis(analysis || "I couldn't analyze this craft at the moment.");
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      setAiAnalysis("Failed to connect to the AI spirits. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const states = useMemo(() => ['All', ...Array.from(new Set(CRAFTS.map(c => c.state))).sort()], []);

  const filteredCrafts = useMemo(() => {
    return CRAFTS.filter(craft => {
      const matchesCategory = selectedCategory === 'All' || craft.category === selectedCategory;
      const matchesState = selectedState === 'All' || craft.state === selectedState;
      const matchesRegion = selectedRegion === 'All' || STATE_REGIONS[craft.state] === selectedRegion;
      return matchesCategory && matchesState && matchesRegion;
    });
  }, [selectedCategory, selectedState, selectedRegion]);

  return (
    <section id="crafts" className="py-24 px-4 bg-stone-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="craftPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#craftPattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif text-amber-100 mb-6"
          >
            Discover India’s Traditional Crafts
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-stone-400 text-lg max-w-2xl mx-auto"
          >
            Supporting artisans and preserving India’s cultural heritage through every handmade masterpiece.
          </motion.p>
        </div>

        {/* Featured Artisan Story */}
        <div className="mb-24">
          <div className="glass rounded-[3rem] overflow-hidden border border-white/10 flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px]">
              <img 
                src={ARTISANS[0].imageUrl} 
                alt={ARTISANS[0].name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full lg:w-1/2 p-8 md:p-16">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4 block">Artisan Spotlight</span>
              <h3 className="text-4xl font-serif text-amber-100 mb-6">{ARTISANS[0].name}: Master of {ARTISANS[0].craft}</h3>
              <p className="text-stone-300 text-lg leading-relaxed mb-8 italic">
                "{ARTISANS[0].story}"
              </p>
              <div className="flex items-center gap-4 text-stone-400 text-sm mb-8">
                <i className="fa-solid fa-location-dot text-amber-500"></i>
                <span>{ARTISANS[0].state}, India</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button className="px-8 py-3 bg-amber-500 text-stone-950 font-bold rounded-full hover:bg-amber-400 transition-all shadow-lg">
                  Read Full Journey
                </button>
                {ARTISANS[0].videoUrl && (
                  <button 
                    onClick={() => setSelectedVideoUrl(ARTISANS[0].videoUrl!)}
                    className="px-8 py-3 glass text-amber-100 font-bold rounded-full border border-amber-500/30 hover:bg-amber-500/10 transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-play text-amber-500"></i>
                    Watch Story
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Meet the Master Artisans */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 block">Our Community</span>
              <h3 className="text-4xl font-serif text-amber-100">Meet the Master Artisans</h3>
            </div>
            <p className="text-stone-500 text-sm max-w-md hidden md:block">
              Connecting you directly with the hands that create magic, preserving centuries of tradition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTISANS.map((artisan) => (
              <motion.div 
                key={artisan.id}
                whileHover={{ y: -10 }}
                className="glass rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col group"
              >
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={artisan.imageUrl} 
                    alt={artisan.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {artisan.videoUrl && (
                      <button 
                        onClick={() => setSelectedVideoUrl(artisan.videoUrl!)}
                        className="w-16 h-16 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-amber-400"
                      >
                        <i className="fa-solid fa-play text-xl"></i>
                      </button>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {artisan.state}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h4 className="text-2xl font-serif text-amber-100 mb-2">{artisan.name}</h4>
                  <span className="text-amber-500/80 text-xs font-bold uppercase tracking-widest mb-4 block">{artisan.craft}</span>
                  <p className="text-stone-400 text-sm line-clamp-3 mb-6 flex-1 italic">
                    "{artisan.story}"
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-stone-900 border border-white/10 text-amber-100 text-xs font-bold rounded-xl hover:bg-amber-500 hover:text-stone-950 transition-all">
                      View Profile
                    </button>
                    {artisan.videoUrl && (
                      <button 
                        onClick={() => setSelectedVideoUrl(artisan.videoUrl!)}
                        className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-stone-950 transition-all"
                      >
                        <i className="fa-solid fa-play"></i>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Filters */}
        <div className="mb-16 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold' 
                      : 'bg-stone-900 border-white/10 text-stone-400 hover:border-amber-500/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-full py-3 px-6 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region === 'All' ? 'All Regions' : `${region} India`}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-stone-500 text-xs pointer-events-none"></i>
              </div>

              <div className="relative flex-1 md:w-48">
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-full py-3 px-6 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {states.map(state => (
                    <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-stone-500 text-xs pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCrafts.map((craft) => (
              <motion.div
                key={craft.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="glass rounded-[2rem] overflow-hidden border border-white/5 flex flex-col group cursor-pointer"
                onClick={() => setSelectedCraft(craft)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={craft.imageUrl} 
                    alt={craft.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-md text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                    {craft.state}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-2">{craft.category}</span>
                  <h4 className="text-xl font-serif text-amber-100 mb-3 group-hover:text-amber-500 transition-colors">
                    {craft.name}
                  </h4>
                  <p className="text-stone-400 text-xs line-clamp-3 mb-6 flex-1">
                    {craft.description}
                  </p>
                  <button className="w-full py-3 bg-stone-900 border border-white/10 text-amber-100 text-xs font-bold rounded-xl hover:bg-amber-500 hover:text-stone-950 transition-all">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Support Section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-amber-500/5 rounded-[3rem] p-12 md:p-16 border border-amber-500/10">
            <h3 className="text-4xl font-serif text-amber-100 mb-6">Support Local Artisans</h3>
            <p className="text-stone-400 text-lg mb-10">
              By choosing traditional handmade products, you help preserve ancient techniques and provide a sustainable livelihood for thousands of artisan families across India.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-10 py-4 bg-amber-500 text-stone-950 font-bold rounded-full hover:bg-amber-400 transition-all shadow-xl">
                Partner with Us
              </button>
              <button className="px-10 py-4 glass text-amber-100 font-bold rounded-full border border-amber-500/30 hover:bg-amber-500/10 transition-all">
                Donate to Fund
              </button>
            </div>
          </div>
          <div className="relative h-[400px] glass rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 200 200" className="w-full h-full text-amber-500">
                   <path fill="currentColor" d="M100,20 L120,40 L140,30 L160,50 L150,80 L170,100 L160,130 L140,150 L120,170 L100,180 L80,170 L60,150 L40,130 L30,100 L50,80 L40,50 L60,30 L80,40 Z" />
                </svg>
             </div>
             <div className="relative z-10 text-center p-8">
                <i className="fa-solid fa-map-location-dot text-5xl text-amber-500 mb-4"></i>
                <h4 className="text-2xl font-serif text-amber-100 mb-2">Crafts by Region</h4>
                <p className="text-stone-400 text-sm">Explore the geographical diversity of Indian handicrafts through our interactive regional directory.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {selectedVideoUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedVideoUrl(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Artisan Story Video"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedVideoUrl(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-stone-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-amber-500 hover:text-stone-950 transition-all border border-white/10"
                aria-label="Close video"
              >
                <X size={20} />
              </button>
              <iframe 
                src={selectedVideoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title="Artisan Story Video"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Craft Detail Modal */}
      <AnimatePresence>
        {selectedCraft && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedCraft(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass w-full max-w-4xl rounded-[3rem] border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-64 md:h-auto">
                  <img 
                    src={selectedCraft.imageUrl} 
                    alt={selectedCraft.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 relative">
                  <button 
                    onClick={() => setSelectedCraft(null)}
                    className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors"
                  >
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                  <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4 block">{selectedCraft.state}</span>
                  <h3 className="text-4xl font-serif text-amber-100 mb-6">{selectedCraft.name}</h3>
                  <div className="space-y-6 mb-10">
                    <div>
                      <h5 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">Category</h5>
                      <p className="text-stone-200">{selectedCraft.category}</p>
                    </div>
                    <div>
                      <h5 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">About the Craft</h5>
                      <p className="text-stone-300 leading-relaxed">{selectedCraft.description}</p>
                    </div>
                    <div>
                      <h5 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">History</h5>
                      <p className="text-stone-400 text-sm leading-relaxed">
                        This craft has been passed down through generations, evolving with time while maintaining its core traditional essence. It represents the soul of {selectedCraft.state} and the dedication of its people.
                      </p>
                    </div>

                    {/* AI Analysis Section */}
                    <div className="pt-6 border-t border-white/5">
                      <button 
                        onClick={() => handleAiAnalysis(selectedCraft.imageUrl, selectedCraft.name)}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-black transition-all disabled:opacity-50"
                      >
                        {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        {isAnalyzing ? "Analyzing Craft..." : "Get AI Craft Insights"}
                      </button>

                      {aiAnalysis && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-6 bg-stone-950 rounded-2xl border border-amber-500/20 text-sm text-stone-300 leading-relaxed prose prose-invert max-w-none"
                        >
                          <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                        </motion.div>
                      )}
                    </div>

                    {ARTISANS.find(a => a.state === selectedCraft.state) && (
                      <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-amber-500 text-xs font-bold uppercase tracking-widest">Artisan Story</h5>
                          {ARTISANS.find(a => a.state === selectedCraft.state)?.videoUrl && (
                            <button 
                              onClick={() => setSelectedVideoUrl(ARTISANS.find(a => a.state === selectedCraft.state)!.videoUrl!)}
                              className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                            >
                              <i className="fa-solid fa-play"></i>
                              Watch Video
                            </button>
                          )}
                        </div>
                        <p className="text-stone-300 text-sm italic">
                          "{ARTISANS.find(a => a.state === selectedCraft.state)?.story}"
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-amber-500 text-stone-950 font-bold rounded-xl hover:bg-amber-400 transition-all">
                      Find Artisans
                    </button>
                    <button className="px-6 py-4 bg-stone-900 border border-white/10 text-white rounded-xl hover:bg-stone-800 transition-all">
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
