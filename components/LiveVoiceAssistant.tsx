
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, MicOff, Loader2, Volume2, X, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LiveVoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const lastUserSpeechRef = useRef<string>("");

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    setTranscript("Connecting to the cultural spirits...");
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are Utsav, a wise and poetic cultural guide of India. Speak warmly, using evocative language. Keep your spoken responses concise (1-3 sentences) to maintain a natural conversation flow. You can hear and speak in real-time.",
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            setTranscript("I am listening... Ask me anything about India's heritage.");
            startAudioCapture();
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              playAudio(message.serverContent.modelTurn.parts[0].inlineData.data);
            }
            if (message.serverContent?.interrupted) {
              stopPlayback();
            }
            
            // Handle transcriptions
            if (message.serverContent?.modelTurn?.parts[0]?.text) {
               setTranscript(message.serverContent.modelTurn.parts[0].text);
            }
            
            // Capture user's speech transcription
            const userTranscript = (message.serverContent as any)?.userContent?.parts?.[0]?.text;
            if (userTranscript) {
              setTranscript(userTranscript);
              // Store user transcript in a ref or state to allow sending to chat
              lastUserSpeechRef.current = userTranscript;
            }
          },
          onerror: (err: any) => {
            console.error("Live API Error:", err);
            if (err?.message?.includes("429") || err?.status === "RESOURCE_EXHAUSTED") {
              setError("Quota exhausted. Please ensure your API key is configured correctly.");
            } else {
              setError("The connection was lost. Please try again.");
            }
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        }
      });
      sessionRef.current = session;
    } catch (err) {
      console.error(err);
      setError("Failed to initialize voice assistant.");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
    setTranscript("");
  };

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      processor.onaudioprocess = (e) => {
        if (!sessionRef.current || !isActive) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };
    } catch (err) {
      console.error("Audio capture error:", err);
      setError("Microphone access denied.");
      stopSession();
    }
  };

  const playAudio = (base64Data: string) => {
    if (!audioContextRef.current) return;
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }
    
    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    // Schedule playback to avoid gaps
    const currentTime = audioContextRef.current.currentTime;
    const startTime = Math.max(currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;
  };

  const stopPlayback = () => {
    // In a more advanced version, we'd keep track of sources and stop them
    nextStartTimeRef.current = 0;
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className="absolute bottom-20 left-0 w-80 glass rounded-[2rem] border border-amber-500/30 p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Sparkles className="text-amber-500" size={20} />
              </div>
              <div>
                <h4 className="text-amber-100 font-serif text-lg">Utsav Live</h4>
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Real-time Voice</p>
              </div>
            </div>
            
            <div className="bg-stone-950/50 rounded-2xl p-4 mb-4 min-h-[80px] flex items-center justify-center relative group/transcript">
              <p className="text-stone-300 text-sm italic text-center leading-relaxed">
                {transcript}
              </p>
              {transcript && transcript !== "I am listening... Ask me anything about India's heritage." && (
                <button 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('utsav-voice-message', { detail: transcript }));
                    setTranscript("Message sent to chat!");
                    setTimeout(() => setTranscript("I am listening..."), 2000);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-amber-500 text-stone-950 rounded-lg opacity-0 group-hover/transcript:opacity-100 transition-opacity shadow-lg"
                  title="Send to Chat"
                >
                  <Send size={12} />
                </button>
              )}
            </div>

            <div className="flex justify-center gap-1 h-8 items-center">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <motion.div 
                  key={i}
                  animate={{ 
                    height: [8, 24, 8],
                    backgroundColor: ['rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.3)']
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1, 
                    delay: i * 0.1 
                  }}
                  className="w-1 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl relative z-10 ${
            isActive 
              ? 'bg-red-500 text-white' 
              : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
          }`}
        >
          {isConnecting ? (
            <Loader2 className="animate-spin" size={24} />
          ) : isActive ? (
            <MicOff size={24} />
          ) : (
            <Mic size={24} />
          )}
          
          {isActive && (
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-red-500 rounded-full -z-10"
            />
          )}
        </motion.button>

        {!isActive && !isConnecting && (
          <div className="absolute left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div className="glass px-4 py-2 rounded-xl border border-white/10 text-amber-100 text-xs font-bold shadow-xl">
              Talk to Utsav AI
            </div>
          </div>
        )}

        {error && !isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full mb-4 left-0 bg-red-500 text-white text-[10px] px-4 py-2 rounded-xl shadow-xl flex items-center gap-2"
          >
            <X size={12} className="cursor-pointer" onClick={() => setError(null)} />
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};
