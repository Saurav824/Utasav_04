
import React, { useState, useRef, useEffect } from 'react';
import { chatWithUtsavAI, generateSpeech, analyzeImage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Camera, Image as ImageIcon, X, ExternalLink, Volume2, VolumeX, Send, Trash2, Mic, MicOff, Headset } from 'lucide-react';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Automatically send if in voice mode
        if (isVoiceMode) {
          setTimeout(() => handleSend(transcript), 500);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [isVoiceMode]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeak = async (text: string, index: number) => {
    if (isSpeaking === index) {
      audioRef.current?.pause();
      setIsSpeaking(null);
      return;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setIsSpeaking(index);
    try {
      const audioUrl = await generateSpeech(text);
      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        } else {
          audioRef.current = new Audio(audioUrl);
        }
        audioRef.current.onended = () => {
          setIsSpeaking(null);
          // If in voice mode, start listening again after AI finishes speaking
          if (isVoiceMode) {
            toggleListening();
          }
        };
        audioRef.current.onerror = () => setIsSpeaking(null);
        audioRef.current.play().catch(err => {
          console.error("Audio play error:", err);
          setIsSpeaking(null);
        });
      } else {
        setIsSpeaking(null);
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(null);
    }
  };

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('utsav_chat_history');
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load chat history", e);
        setMessages([
          { role: 'assistant', content: 'Greetings, seeker of culture. I am Utsav. What ancient tradition or vibrant festival can I tell you about today?' }
        ]);
      }
    } else {
      setMessages([
        { role: 'assistant', content: 'Greetings, seeker of culture. I am Utsav. What ancient tradition or vibrant festival can I tell you about today?' }
      ]);
    }
  }, []);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('utsav_chat_history', JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // Listen for voice assistant messages
  useEffect(() => {
    const handleVoiceMessage = (e: any) => {
      const transcript = e.detail;
      if (transcript) {
        setInput(transcript);
        if (isVoiceMode) {
          handleSend(transcript);
        }
      }
    };
    window.addEventListener('utsav-voice-message', handleVoiceMessage);
    return () => window.removeEventListener('utsav-voice-message', handleVoiceMessage);
  }, [isVoiceMode]);

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if ((!messageText.trim() && !selectedImage) || isLoading) return;
    
    const userMsg: ChatMessage = { 
      role: 'user', 
      content: messageText,
      image: selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : undefined
    };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = messageText;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let responseText = "";
      let groundingChunks: any[] = [];

      if (currentImage) {
        responseText = await analyzeImage(currentImage.data, currentImage.mimeType, currentInput) || "";
      } else {
        const result = await chatWithUtsavAI(currentInput, messages);
        responseText = result.text || "";
        groundingChunks = result.groundingChunks;
      }

      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: responseText || "I seem to have lost my train of thought. Please try again.",
        groundingChunks
      };
      
      setMessages(prev => [...prev, assistantMsg]);

      // If voice mode is on, automatically speak the response
      if (isVoiceMode && responseText) {
        handleSpeak(responseText, messages.length + 1);
      }
    } catch (err: any) {
      const errorMessage = err.message === 'QUOTA_EXHAUSTED' 
        ? "The spirits of the web are currently overwhelmed (Quota Exhausted). Please check your API key configuration."
        : "Forgive me, the spirits of the web are restless. Try again in a moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="chat" className="py-24 px-4 bg-stone-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-serif text-amber-100 mb-4">Converse with Utsav AI</h2>
          <p className="text-stone-400 max-w-2xl mx-auto mb-6">Ask about rituals, stories of gods, or upload an image of a festival or craft for analysis.</p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <button 
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isVoiceMode 
                  ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20' 
                  : 'bg-stone-800 border-white/10 text-stone-400 hover:border-amber-500/50'
              }`}
            >
              <Headset size={16} />
              {isVoiceMode ? 'Voice Mode: ON' : 'Voice Mode: OFF'}
            </button>

            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the chat history?')) {
                  localStorage.removeItem('utsav_chat_history');
                  setMessages([{ role: 'assistant', content: 'Greetings, seeker of culture. I am Utsav. What can I tell you about today?' }]);
                }
              }}
              className="flex items-center gap-2 text-xs text-stone-500 hover:text-amber-500 transition-colors underline"
            >
              <Trash2 size={12} /> Clear History
            </button>
          </div>
        </div>

        <div className="glass rounded-[2rem] border border-white/10 flex flex-col h-[650px] overflow-hidden shadow-2xl">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-4 rounded-3xl relative group ${
                  msg.role === 'user' 
                    ? 'bg-amber-600 text-white rounded-br-none' 
                    : 'bg-stone-800 text-stone-200 rounded-bl-none border border-white/5'
                }`}>
                  {msg.image && (
                    <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} alt="User upload" className="w-full max-w-xs rounded-xl mb-3 border border-white/10" />
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
                  
                  {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingChunks.map((chunk, idx) => chunk.web && (
                          <a 
                            key={idx} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1 bg-stone-900/50 rounded-md text-[10px] text-amber-500 hover:bg-amber-500 hover:text-black transition-all"
                          >
                            <ExternalLink size={10} /> {chunk.web.title || 'Source'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => handleSpeak(msg.content, i)}
                      className={`absolute -right-10 top-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSpeaking === i ? 'text-amber-500' : 'text-stone-600 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isSpeaking === i ? (
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-2 bg-amber-500 animate-bounce"></div>
                          <div className="w-0.5 h-2 bg-amber-500 animate-bounce delay-75"></div>
                          <div className="w-0.5 h-2 bg-amber-500 animate-bounce delay-150"></div>
                        </div>
                      ) : (
                        <Volume2 size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-800 px-6 py-4 rounded-3xl rounded-bl-none border border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-stone-900/80 border-t border-white/5">
            {/* Suggested Questions for Clarity */}
            {!selectedImage && messages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "What items do I need for this?",
                  "When is the next celebration?",
                  "How is this celebrated locally?",
                  "Tell me the specific rituals."
                ].map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setInput(q); handleSend(q); }}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-amber-500/20 text-stone-400 hover:text-amber-500 rounded-full text-[10px] border border-white/5 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {selectedImage && (
              <div className="mb-4 relative inline-block">
                <img 
                  src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                  className="h-20 w-20 object-cover rounded-xl border border-amber-500/50" 
                  alt="Preview" 
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            <div className="relative flex items-center gap-2">
              <input 
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-500 rounded-full transition-all border border-white/5"
                title="Upload image for analysis"
              >
                <Camera size={20} />
              </button>
              
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isLoading ? "Utsav is thinking..." : isListening ? "Listening..." : "Ask about Diwali, or upload a photo..."}
                  disabled={isLoading}
                  className="w-full bg-stone-800 border border-white/10 rounded-full py-4 px-6 pr-24 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-white disabled:opacity-50"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button 
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-700 text-stone-400 hover:text-amber-500'
                    }`}
                    title="Voice input"
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || (!input.trim() && !selectedImage)}
                    className="w-10 h-10 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
