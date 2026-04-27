
import React from 'react';
import { Hero } from './components/Hero';
import { FestivalExplorer } from './components/FestivalExplorer';
import { ChatBot } from './components/ChatBot';
import { NearbyFestivals } from './components/NearbyFestivals';
import { LiveVoiceAssistant } from './components/LiveVoiceAssistant';
import { StoriesSection } from './components/StoriesSection';
import { ArtisanSection } from './components/ArtisanSection';
import { HeritageTourism } from './components/HeritageTourism';
import { ThemeProvider, useFestivalTheme } from './context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { allThemes, activeTheme, setOverrideThemeId } = useFestivalTheme();
  
  return (
    <div className="mt-12 pt-8 border-t border-white/5 w-full">
      <p className="text-xs font-bold text-stone-600 uppercase tracking-widest mb-4 text-center">2026 Theme Previewer</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button 
          onClick={() => setOverrideThemeId(null)}
          className={`px-3 py-1 rounded-full text-[10px] transition-all ${!activeTheme ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-500 hover:text-stone-300'}`}
        >
          Auto (Date Based)
        </button>
        {allThemes.map(theme => (
          <button 
            key={theme.id}
            onClick={() => setOverrideThemeId(theme.id)}
            className={`px-3 py-1 rounded-full text-[10px] transition-all ${activeTheme?.id === theme.id ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-500 hover:text-stone-300'}`}
          >
            {theme.festival}
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const [hasKey, setHasKey] = React.useState(false);

  React.useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
             <i className="fa-solid fa-fire-flame-curved text-stone-900 text-sm"></i>
          </div>
          <span className="text-2xl font-serif font-bold text-amber-500 tracking-tighter">Utsav</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-amber-100/60">
          <a href="#explore" className="hover:text-amber-500 transition-colors">Explorer</a>
          <a href="#nearby" className="hover:text-amber-500 transition-colors">Nearby</a>
          <a href="#heritage" className="hover:text-amber-500 transition-colors">Heritage</a>
          <a href="#crafts" className="hover:text-amber-500 transition-colors">Crafts</a>
          <a href="#stories" className="hover:text-amber-500 transition-colors">Stories</a>
          <a href="#chat" className="hover:text-amber-500 transition-colors">AI Guide</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-amber-500 text-stone-950 rounded-full text-xs font-bold hover:bg-amber-400 transition-all">
            Connect
          </button>
        </div>
      </nav>

      <main>
        <Hero />
        <div className="relative z-10">
          <FestivalExplorer />
          <NearbyFestivals />
          <HeritageTourism />
          <ArtisanSection />
          <StoriesSection />
          <ChatBot />
        </div>
        <LiveVoiceAssistant />
      </main>

      <footer className="bg-stone-950 py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
                 <i className="fa-solid fa-fire-flame-curved text-stone-900 text-[10px]"></i>
              </div>
              <span className="text-xl font-serif font-bold text-amber-500">Utsav</span>
            </div>
            <p className="text-stone-500 text-sm">Preserving heritage through intelligence.</p>
          </div>
          <div className="flex gap-6 text-stone-400">
            <i className="fa-brands fa-instagram hover:text-amber-500 cursor-pointer"></i>
            <i className="fa-brands fa-twitter hover:text-amber-500 cursor-pointer"></i>
            <i className="fa-brands fa-facebook hover:text-amber-500 cursor-pointer"></i>
          </div>
          <p className="text-stone-600 text-xs">© 2024 Utsav Odyssey. Powered by Gemini.</p>
        </div>
        <ThemeSwitcher />
      </footer>
    </div>
  );
};

export default App;
