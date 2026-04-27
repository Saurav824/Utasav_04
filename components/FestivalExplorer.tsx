
import React, { useState, useMemo, useEffect } from 'react';
import { getFestivalDetails, generateFestivalArt } from '../services/geminiService';
import { FestivalInfo, FestivalRating } from '../types';
import { FestivalCard } from './FestivalCard';

const FEATURED_FESTIVALS: FestivalInfo[] = [
  { 
    name: 'Diwali', 
    season: 'Autumn', 
    location: 'Pan-India', 
    description: 'The Festival of Lights', 
    significance: 'Victory of light over darkness', 
    history: 'Ancient origins', 
    rituals: ['Lighting lamps', 'Fireworks'],
    requirements: ['Diyas (Earthen lamps)', 'Candles', 'Sweets', 'New clothes', 'Rangoli colors', 'Crackers']
  },
  { 
    name: 'Holi', 
    season: 'Spring', 
    location: 'North India', 
    description: 'The Festival of Colors', 
    significance: 'Arrival of spring', 
    history: 'Puranic legends', 
    rituals: ['Playing with colors'],
    requirements: ['Gulal (Colored powder)', 'Water balloons', 'Pichkaris (Water guns)', 'Sweets (Gujiya)', 'Old clothes']
  },
  { 
    name: 'Onam', 
    season: 'Monsoon', 
    location: 'Kerala', 
    description: 'Harvest Festival', 
    significance: 'Homecoming of King Mahabali', 
    history: 'Ancient Kerala history', 
    rituals: ['Pookalam', 'Boat races'],
    requirements: ['Fresh flowers for Pookalam', 'New traditional attire (Kasavu)', 'Banana leaves for Sadya', 'Rice and vegetables for feast']
  },
  { 
    name: 'Pongal', 
    season: 'Winter', 
    location: 'Tamil Nadu', 
    description: 'Harvest Festival', 
    significance: 'Thanksgiving to nature', 
    history: 'Sangam era', 
    rituals: ['Cooking Pongal', 'Jallikattu'],
    requirements: ['Earthen pot', 'Sugarcane', 'New rice', 'Jaggery', 'Turmeric plant', 'Flowers']
  },
  { 
    name: 'Durga Puja', 
    season: 'Autumn', 
    location: 'West Bengal', 
    description: 'Victory of Goddess Durga', 
    significance: 'Triumph of good over evil', 
    history: 'Medieval origins', 
    rituals: ['Pandal hopping', 'Dhunuchi dance'],
    requirements: ['New clothes', 'Flowers for Pushpanjali', 'Incense sticks', 'Dhunuchi (clay pot for dance)', 'Sweets']
  },
  { 
    name: 'Baisakhi', 
    season: 'Spring', 
    location: 'Punjab', 
    description: 'Sikh New Year', 
    significance: 'Formation of Khalsa', 
    history: '1699', 
    rituals: ['Bhangra', 'Gidda'],
    requirements: ['Traditional Punjabi attire', 'Dhol (Drum)', 'Wheat stalks', 'Karah Parshad ingredients']
  },
  { 
    name: 'Kumbh Mela', 
    season: 'Spring', 
    location: 'Uttar Pradesh', 
    description: 'The largest religious gathering in the world', 
    significance: 'Spiritual purification', 
    history: 'Ancient Vedic period', 
    rituals: ['Holy dip in Ganges', 'Satsangs'],
    requirements: ['Holy water container', 'Simple clothing', 'Spiritual books', 'Offerings for deities']
  },
  { 
    name: 'Hornbill Festival', 
    season: 'Winter', 
    location: 'Nagaland', 
    description: 'Festival of Festivals', 
    significance: 'Celebrating Naga tribal culture', 
    history: 'Established in 2000', 
    rituals: ['Traditional dances', 'Indigenous games'],
    requirements: ['Tribal costumes', 'Traditional jewelry', 'Local handicrafts', 'Camera']
  },
  { 
    name: 'Hemis Festival', 
    season: 'Summer', 
    location: 'Ladakh', 
    description: 'Celebrating Guru Padmasambhava', 
    significance: 'Victory of spirit over evil', 
    history: 'Ancient Buddhist tradition', 
    rituals: ['Cham dance', 'Thangka display'],
    requirements: ['Traditional masks', 'Prayer flags', 'Butter lamps', 'Warm clothing']
  },
  { 
    name: 'Ratha Yatra', 
    season: 'Monsoon', 
    location: 'Odisha', 
    description: 'The Chariot Festival', 
    significance: 'Lord Jagannath\'s journey', 
    history: 'Ancient Puranic era', 
    rituals: ['Chariot pulling', 'Pahandi ritual'],
    requirements: ['Ropes for chariot pulling', 'Flowers for offerings', 'Coconuts', 'Traditional attire']
  },
];

const SEASONS = ['All', 'Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon'];
const LOCATIONS = ['All', 'Pan-India', 'North India', 'South India', 'East India', 'West India', 'Northeast India'];

export const FestivalExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingArt, setGeneratingArt] = useState(false);
  const [result, setResult] = useState<{ info: FestivalInfo, image?: string } | null>(null);
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedRatings = localStorage.getItem('utsav_festival_ratings');
    if (savedRatings) {
      try {
        setUserRatings(JSON.parse(savedRatings));
      } catch (e) {
        console.error("Failed to load ratings", e);
      }
    }
  }, []);

  const handleRate = (festivalName: string, rating: number) => {
    const newRatings = { ...userRatings, [festivalName]: rating };
    setUserRatings(newRatings);
    localStorage.setItem('utsav_festival_ratings', JSON.stringify(newRatings));
  };

  const filteredFestivals = useMemo(() => {
    return FEATURED_FESTIVALS.filter(f => {
      const seasonMatch = selectedSeason === 'All' || f.season === selectedSeason;
      
      // Map specific locations to regions for better filtering
      const regionMap: Record<string, string> = {
        'Kerala': 'South India',
        'Tamil Nadu': 'South India',
        'West Bengal': 'East India',
        'Odisha': 'East India',
        'Punjab': 'North India',
        'Uttar Pradesh': 'North India',
        'Nagaland': 'Northeast India',
        'Ladakh': 'North India',
        'Pan-India': 'Pan-India'
      };
      
      const festivalRegion = regionMap[f.location] || f.location;
      const locationMatch = selectedLocation === 'All' || festivalRegion === selectedLocation || f.location === selectedLocation;
      
      const searchMatch = !searchTerm || 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return seasonMatch && locationMatch && searchMatch;
    });
  }, [selectedSeason, selectedLocation, searchTerm]);

  const handleExplore = async (name?: string) => {
    const target = name || searchTerm;
    if (!target.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const info = await getFestivalDetails(target);
      if (info) {
        setResult({ info });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateArt = async () => {
    if (!result || generatingArt) return;
    setGeneratingArt(true);
    try {
      const image = await generateFestivalArt(result.info.name);
      if (image) {
        setResult(prev => prev ? { ...prev, image } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingArt(false);
    }
  };

  const clearFilters = () => {
    setSelectedSeason('All');
    setSelectedLocation('All');
  };

  return (
    <section id="explore" className="py-24 px-4 bg-stone-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-amber-100 mb-6">Explore the Odyssey</h2>
          <p className="text-stone-400 text-lg max-w-3xl mx-auto mb-10">
            Enter the name of any festival—global or local—and let Utsav unveil its mysteries through AI-generated art and cultural wisdom.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-12">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleExplore()}
                placeholder="e.g. Kumbh Mela, Pongal, Onam..."
                className="w-full bg-stone-900 border border-white/10 rounded-2xl py-4 px-6 pl-14 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-white text-lg"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-stone-500"></i>
            </div>
            <button 
              onClick={() => handleExplore()}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-stone-950 font-bold rounded-2xl transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : null}
              Manifest
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-6 mb-12 p-8 glass rounded-3xl border border-white/5 relative group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-sliders text-amber-500"></i>
                <h4 className="text-amber-100 font-serif text-xl">Refine Your Search</h4>
              </div>
              {(selectedSeason !== 'All' || selectedLocation !== 'All' || searchTerm !== '') && (
                <button 
                  onClick={() => { clearFilters(); setSearchTerm(''); }}
                  className="text-xs text-amber-500 hover:text-amber-400 underline transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">By Season</span>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSeason(s)}
                      className={`px-4 py-1.5 rounded-full text-xs transition-all border ${selectedSeason === s ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold' : 'bg-stone-900 border-white/10 text-stone-400 hover:border-amber-500/50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">By Region</span>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map(l => (
                    <button 
                      key={l} 
                      onClick={() => setSelectedLocation(l)}
                      className={`px-4 py-1.5 rounded-full text-xs transition-all border ${selectedLocation === l ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold' : 'bg-stone-900 border-white/10 text-stone-400 hover:border-amber-500/50'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-3xl overflow-hidden border border-white/5 animate-pulse">
              <div className="h-64 w-full bg-stone-900 flex items-center justify-center relative overflow-hidden">
                {/* Festive Pattern Placeholder */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-amber-500 font-serif italic text-xl">Weaving the threads of tradition...</p>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="h-8 bg-stone-800 rounded w-1/3"></div>
                <div className="h-4 bg-stone-800 rounded w-full"></div>
                <div className="h-4 bg-stone-800 rounded w-5/6"></div>
                <div className="pt-6 space-y-4">
                  <div className="h-4 bg-stone-800 rounded w-1/4"></div>
                  <div className="h-12 bg-stone-800 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
               <button onClick={() => setResult(null)} className="text-stone-500 hover:text-amber-500 text-sm flex items-center gap-2">
                 <i className="fa-solid fa-arrow-left"></i> Back to Explorer
               </button>
            </div>
            <FestivalCard festival={result.info} imageUrl={result.image} />
            
            {!result.image && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={handleGenerateArt}
                  disabled={generatingArt}
                  className="px-8 py-4 bg-stone-900 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-stone-950 font-bold rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center gap-3"
                >
                  {generatingArt ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  )}
                  {generatingArt ? 'Weaving Art...' : 'Generate Festival Art'}
                </button>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredFestivals.map(f => (
              <div 
                key={f.name} 
                className="glass p-8 rounded-3xl border border-white/5 group cursor-pointer hover:bg-white/5 transition-all flex flex-col" 
                onClick={() => { setSearchTerm(f.name); handleExplore(f.name); }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif text-amber-100 group-hover:text-amber-500 transition-colors">{f.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">{f.season}</span>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2 italic mb-4">"{f.description}"</p>
                
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/5">
                  <div className="flex items-center gap-2 text-stone-600 text-xs">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{f.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star}
                        onClick={() => handleRate(f.name, star)}
                        className={`transition-colors ${star <= (userRatings[f.name] || 0) ? 'text-amber-500' : 'text-stone-700 hover:text-amber-500/50'}`}
                      >
                        <i className={`fa-star ${star <= (userRatings[f.name] || 0) ? 'fa-solid' : 'fa-regular'}`}></i>
                      </button>
                    ))}
                    {userRatings[f.name] && (
                      <div className="flex flex-col items-end ml-1">
                        <span className="text-[10px] text-amber-500 font-bold leading-none">{userRatings[f.name]}.0</span>
                        <span className="text-[8px] text-stone-600 leading-none">avg</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredFestivals.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-stone-500 italic">No featured festivals match your current filters. Try a different combination.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
