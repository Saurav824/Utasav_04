
import React, { useState } from 'react';
import { FestivalInfo } from '../types';
import { generateSpeech } from '../services/geminiService';

interface Props {
  festival: FestivalInfo;
  imageUrl?: string;
}

export const FestivalCard: React.FC<Props> = ({ festival, imageUrl }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListen = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioUrl = await generateSpeech(`${festival.name}. ${festival.description}. Significance: ${festival.significance}`);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="glass rounded-3xl overflow-hidden group transition-all hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-amber-500/10 border border-white/5">
      {imageUrl && (
        <div className="h-64 w-full overflow-hidden relative">
          <img src={imageUrl} alt={festival.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <button 
            onClick={handleListen}
            disabled={isSpeaking}
            className="absolute bottom-4 right-4 w-12 h-12 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center shadow-xl hover:bg-amber-400 transition-all disabled:opacity-50 z-10"
          >
            {isSpeaking ? (
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-stone-950 animate-bounce"></div>
                <div className="w-1 h-3 bg-stone-950 animate-bounce delay-75"></div>
                <div className="w-1 h-3 bg-stone-950 animate-bounce delay-150"></div>
              </div>
            ) : (
              <i className="fa-solid fa-volume-high"></i>
            )}
          </button>
        </div>
      )}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-3xl font-serif text-amber-200">{festival.name}</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/20">
            {festival.season}
          </span>
        </div>
        <p className="text-stone-300 leading-relaxed mb-6 italic">"{festival.description}"</p>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-widest mb-2">Significance</h4>
            <p className="text-stone-400 text-sm leading-relaxed">{festival.significance}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-widest mb-2">History</h4>
            <p className="text-stone-400 text-sm leading-relaxed">{festival.history}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-widest mb-2">Key Rituals</h4>
            <div className="flex flex-wrap gap-2">
              {festival.rituals.map((r, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-stone-800 text-stone-300 rounded border border-stone-700">
                  {r}
                </span>
              ))}
            </div>
          </div>

          {festival.requirements && festival.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-widest mb-2">Essential Items</h4>
              <div className="flex flex-wrap gap-2">
                {festival.requirements.map((item, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-200 rounded border border-amber-500/20 flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-[10px] text-amber-500"></i>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
