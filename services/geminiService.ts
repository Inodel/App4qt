import { GoogleGenAI, Modality } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (client) return client; // Return cached instance

  // Use the correct environment variable name
  const apiKey = import.meta.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set. Please configure it in your environment.");
    // For development/demo purposes, return a client with placeholder functionality
    // In a real app, you'd want to handle this differently
    return null;
  }
  client = new GoogleGenAI({ apiKey });
  return client;
};

// 1. Fast AI Responses (Flash Lite)
export const generateFastText = async (prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API key not configured. This feature requires a valid Gemini API key.";
  }
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: prompt,
  });
  return response.text || "I couldn't think of anything right now!";
};

// 2. Thinking Mode (Pro Preview + Budget)
export const generateThinkingText = async (prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API key not configured. This feature requires a valid Gemini API key.";
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "I'm deep in thought but couldn't express it.";
};

// 3. Chat (Pro Preview)
export const createChat = () => {
  const ai = getClient();
  if (!ai) {
    console.error("API key not configured. This feature requires a valid Gemini API key.");
    // Return a mock chat object that can handle the API calls gracefully
    return {
      sendMessage: async ({ message }: { message: string }) => {
        return {
          text: "API key not configured. This feature requires a valid Gemini API key."
        };
      }
    };
  }
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are Nate, a cheerful, empathetic, and supportive companion in the App4QT app. Your goal is to bring joy and self-care advice.",
    }
  });
};

// 4. Generate Speech (TTS)
export const generateSpeech = async (text: string): Promise<ArrayBuffer> => {
  const ai = getClient();
  if (!ai) {
    console.error("API key not configured. This feature requires a valid Gemini API key.");
    // Return an empty buffer or throw a more graceful error
    return new ArrayBuffer(0);
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Cheerful voice
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data returned");

  // Basic decode function
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// 5. Mood Pal (Gemini Flash)
export const generateMoodMessage = async (mood: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API key not configured. This feature requires a valid Gemini API key.";
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `I am feeling ${mood} today. Write a short, heartwarming, cute, and supportive message for me. Include emojis to make it cheerful.`,
  });
  return response.text || "Sending you good vibes! ✨";
};

// 6. Poetry Corner (Gemini Flash)
export const generatePoem = async (topic: string, style: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write a cute and creative ${style} about ${topic}. Keep it short and delightful.`,
  });
  return response.text || "Roses are red...";
};

// 7. Generate Image (Pro Image Preview)
export const generateImage = async (prompt: string, aspectRatio: string, size: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { 
        aspectRatio: aspectRatio as any, 
        imageSize: size as any 
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// 8. Generate Video (Veo)
export const generateVeoVideo = async (prompt: string, aspectRatio: string): Promise<string> => {
  // Always create a new client to pick up the latest API Key if changed via UI
  const ai = getClient();
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: aspectRatio as any, // '16:9' or '9:16'
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed or returned no URI.");

  // Fetch the actual video bytes using the API key
  const apiKey = import.meta.env.GEMINI_API_KEY;
  const response = await fetch(`${videoUri}&key=${apiKey}`);
  if (!response.ok) throw new Error("Failed to download video.");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};