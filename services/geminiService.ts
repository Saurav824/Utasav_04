
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { FestivalInfo } from "../types";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("Gemini API key is missing. Please set it using the API Key selector.");
  }
  return new GoogleGenAI({ apiKey });
};

const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  if (error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED") {
    return new Error("QUOTA_EXHAUSTED");
  }
  return error;
};

const addWavHeader = (pcmBase64: string, sampleRate: number) => {
  const binaryString = atob(pcmBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  // File length
  view.setUint32(4, 36 + len, true);
  // WAVE identifier
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // fmt chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  // data chunk length
  view.setUint32(40, len, true);

  const wavBytes = new Uint8Array(44 + len);
  wavBytes.set(new Uint8Array(header), 0);
  wavBytes.set(bytes, 44);

  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < wavBytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(wavBytes.slice(i, i + chunk)));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and with a warm, cultural tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return addWavHeader(base64Audio, 24000);
    }
    return null;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getFestivalDetails = async (festivalName: string): Promise<FestivalInfo | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide comprehensive details about the Indian festival: ${festivalName}. Include its significance, rituals, history, common locations of celebration, traditional season, and a list of essential items/requirements needed to celebrate it (e.g., for Holi: colors, water balloons).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            significance: { type: Type.STRING },
            rituals: { type: Type.ARRAY, items: { type: Type.STRING } },
            history: { type: Type.STRING },
            location: { type: Type.STRING },
            season: { type: Type.STRING },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Essential items or materials needed for the festival celebration" },
          },
          required: ["name", "description", "significance", "rituals", "history", "location", "season", "requirements"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw handleApiError(error);
  }
};

export const chatWithUtsavAI = async (message: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  const ai = getAI();
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: 'You are Utsav, a wise and friendly cultural guide specializing in Indian festivals, traditions, and mythology. Your goal is to provide specific clarity and accurate, up-to-date information. When asked about festivals, always provide specific details like exact dates (if applicable), locations, and a comprehensive list of required items or materials for rituals. Use Google Search to ensure the highest accuracy for current events, specific regional variations, and detailed requirements.',
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt || "Analyze this image in the context of Indian culture, festivals, or heritage. Identify what it is and explain its significance." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const generateFestivalArt = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A cinematic, high-resolution artistic representation of the festival: ${prompt}. Style: Immersive, elegant, soft glowing lights, traditional Indian heritage blended with modern aesthetic, vibrant colors like saffron, gold, and deep blue.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const findNearbyFestivals = async (lat?: number, lng?: number) => {
  const ai = getAI();
  try {
    const query = "What are the major festivals happening or cultural centers near me?";
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (lat && lng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config,
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text,
      sources: sources.map((s: any) => ({
        title: s.maps?.title || "Location",
        uri: s.maps?.uri || "#"
      }))
    };
  } catch (error) {
    throw handleApiError(error);
  }
};
