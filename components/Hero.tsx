
import React, { useEffect, useState } from 'react';
import { FloatingElement } from './FloatingElement';
import { useFestivalTheme } from '../context/ThemeContext';
import { GoogleGenAI } from "@google/genai";

const DEFAULT_HERO_PROMPT = 'Grand New Year celebration at midnight, city skyline illuminated with golden fireworks, large glowing “2026” numbers in the sky, sparkling confetti falling, luxury black and gold color palette, dramatic cinematic lighting, festive atmosphere, ultra high resolution, modern website hero banner design, clean composition with empty space for headline text, 16:9 aspect ratio, 4K quality.';
const DEFAULT_FALLBACK = 'https://picsum.photos/seed/new-year-2026/1920/1080';

// Simple session cache for AI images
const aiImageCache: Record<string, string> = {};

export const Hero: React.FC = () => {
  const [elements, setElements] = useState<any[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const { activeTheme } = useFestivalTheme();

  useEffect(() => {
    const generateHeroImage = async () => {
      const themeId = activeTheme?.id || 'default';
      
      // Check cache first
      if (aiImageCache[themeId]) {
        setBgImage(aiImageCache[themeId]);
        setIsAiGenerated(true);
        return;
      }

      setIsGenerating(true);
      setIsAiGenerated(false);
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = activeTheme?.heroPrompt || DEFAULT_HERO_PROMPT;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
            },
          },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          const base64 = `data:image/png;base64,${imagePart.inlineData.data}`;
          setBgImage(base64);
          aiImageCache[themeId] = base64;
          setIsAiGenerated(true);
        } else {
          throw new Error('No image in response');
        }
      } catch (error) {
        console.warn('AI Image generation failed (likely quota), using fallback:', error);
        setBgImage(activeTheme?.fallbackImage || DEFAULT_FALLBACK);
        setIsAiGenerated(false);
      } finally {
        setIsGenerating(false);
      }
    };

    generateHeroImage();
  }, [activeTheme]);

  useEffect(() => {
    const themeElements = activeTheme?.elements || ['diya', 'petal'];
    const animationClasses = ['animate-float', 'animate-float-alt', 'animate-drift', 'animate-sway', 'animate-pulse-soft'];
    
    const newElements = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      type: themeElements[Math.floor(Math.random() * themeElements.length)],
      animationClass: animationClasses[Math.floor(Math.random() * animationClasses.length)],
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 12}s`,
        transform: `scale(${0.4 + Math.random() * 1.4})`,
        color: activeTheme?.colors.primary,
      }
    }));
    setElements(newElements);
  }, [activeTheme]);

  return (
    <div className={`relative h-screen w-full flex items-center justify-center overflow-hidden transition-all duration-1000 ${activeTheme?.colors.bg || 'bg-stone-950'}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {bgImage ? (
          <img 
            src={bgImage} 
            alt="Festival Background" 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-stone-900 animate-pulse"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/60 to-stone-950"></div>
      </div>

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-1">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rangoli" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M100 20 L100 180 M20 100 L180 100 M43 43 L157 157 M157 43 L43 157" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rangoli)" />
        </svg>
      </div>

      {/* Theme Specific Overlay */}
      {activeTheme?.id === 'christmas' && (
        <div className="absolute inset-0 pointer-events-none bg-white/5 backdrop-blur-[1px] z-1"></div>
      )}

      {/* Animated Elements */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {elements.map((el) => (
          <FloatingElement key={el.id} type={el.type} style={el.style} animationClass={el.animationClass} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        {activeTheme && (
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-bounce">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                {activeTheme.festival} Theme Active
              </span>
            </div>
            {isAiGenerated ? (
              <div className="flex items-center gap-2 text-[10px] text-amber-500/60 font-mono uppercase tracking-tighter">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Gemini AI Generated Vision</span>
              </div>
            ) : !isGenerating && (
              <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono uppercase tracking-tighter">
                <i className="fa-solid fa-box-archive"></i>
                <span>Heritage Archive Fallback</span>
              </div>
            )}
          </div>
        )}
        <h1 className={`text-6xl md:text-8xl font-serif glow-text mb-6 transition-colors duration-1000 ${activeTheme?.colors.text || 'text-amber-100'}`}>
          {activeTheme ? activeTheme.festival : 'Utsav 2026'}
        </h1>
        <p className="text-xl md:text-2xl font-light text-amber-50/80 mb-10 tracking-widest uppercase">
          {activeTheme ? activeTheme.name : 'Where Tradition Meets the Future'}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold rounded-full transition-all shadow-xl shadow-amber-900/20"
            style={activeTheme ? { backgroundColor: activeTheme.colors.primary } : {}}
          >
            Start Your Journey
          </button>
          <button 
            onClick={() => document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 glass text-amber-100 font-semibold rounded-full border border-amber-500/30 hover:bg-amber-500/10 transition-all"
          >
            Ask Utsav AI
          </button>
        </div>
      </div>

      {/* Gradient Overlay for bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-950 to-transparent z-10"></div>
    </div>
  );
};
