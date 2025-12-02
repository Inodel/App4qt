import React, { useState, useRef, useEffect } from 'react';
import { AppSection, ChatMessage } from './types';
import * as Gemini from './services/geminiService';
import * as Sounds from './services/soundService';
import { Chat, GenerateContentResponse } from '@google/genai';

// --- Icons (using Emoji for "Cute" factor) ---
const ICONS = {
  [AppSection.HOME]: "🏠",
  [AppSection.ANIMAL_MAGIC]: "🐼",
  [AppSection.MOOD_PAL]: "💞",
  [AppSection.GIGGLE_TIME]: "😂",
  [AppSection.CHAT_BUDDY]: "💬",
  [AppSection.POETRY_CORNER]: "📜",
  [AppSection.IMAGE_GEN]: "🎨",
  [AppSection.VIDEO_GEN]: "🎥",
  [AppSection.WHEELS]: "🎡",
};

const LABELS = {
  [AppSection.HOME]: "Home",
  [AppSection.ANIMAL_MAGIC]: "Magic Facts",
  [AppSection.MOOD_PAL]: "Mood Pal",
  [AppSection.GIGGLE_TIME]: "Giggle Time",
  [AppSection.CHAT_BUDDY]: "Chat Buddy",
  [AppSection.POETRY_CORNER]: "Poetry",
  [AppSection.IMAGE_GEN]: "Dream Painter",
  [AppSection.VIDEO_GEN]: "Motion Magic",
  [AppSection.WHEELS]: "Fun Wheels",
};

// --- Helper Components ---

const Button = ({ onClick, children, disabled, className = "", variant = "primary" }: any) => {
  const baseStyle = "px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md";
  const variants = {
    primary: "bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:shadow-pink-300/50",
    secondary: "bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-50",
    accent: "bg-gradient-to-r from-violet-400 to-purple-500 text-white hover:shadow-purple-300/50",
    teal: "bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:shadow-teal-300/50",
    dark: "bg-slate-800 text-white hover:bg-slate-700"
  };

  const handleClick = (e: any) => {
    Sounds.click();
    if (onClick) onClick(e);
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 ${className}`}>
    {children}
  </div>
);

const Loading = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-pulse">
    <div className="text-4xl">✨</div>
    <p className="text-slate-600 font-medium">{text}</p>
  </div>
);

// --- Sections ---

const HomeSection = ({ setSection }: { setSection: (s: AppSection) => void }) => {
  const [tip, setTip] = useState<string>("");
  
  useEffect(() => {
    Gemini.generateFastText("Give me a short, cheerful self-care tip of the day with an emoji.").then(setTip);
  }, []);

  return (
    <div className="space-y-8 text-center max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 pb-2">
          Welcome to App4QT
        </h1>
        <p className="text-xl text-slate-600">Your daily dose of joy, magic, and creativity!</p>
      </div>

      <Card className="transform rotate-1 hover:rotate-0 transition-transform duration-300 mx-auto max-w-2xl">
        <h3 className="text-lg font-bold text-indigo-500 mb-2">✨ Tip of the Day</h3>
        <p className="text-xl text-slate-700 italic">
          {tip || "Loading magical wisdom..."}
        </p>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(AppSection).filter(s => s !== AppSection.HOME).map((section) => (
          <button
            key={section}
            onClick={() => { Sounds.click(); setSection(section); }}
            className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col items-center"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{ICONS[section]}</div>
            <div className="font-bold text-slate-700 text-sm md:text-base">{LABELS[section]}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const AnimalMagicSection = () => {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");

  const getFact = async () => {
    setLoading(true);
    try {
      const prompt = topic 
        ? `Tell me a fascinating and cute fact about ${topic}. Keep it short and sweet.` 
        : "Tell me a random fascinating and cute animal fact. Keep it short and sweet.";
      const text = await Gemini.generateFastText(prompt);
      setFact(text);
    } catch (e) {
      setFact("Oops! The magic animals are sleeping. Try again!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-600">🐼 Cute Animal Magic</h2>
      <Card>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Favorite animal? (optional)"
            className="flex-1 px-4 py-2 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={getFact} disabled={loading}>
            {loading ? "Magic..." : "Discover"}
          </Button>
        </div>
        
        {loading ? (
          <Loading text="Consulting the animal kingdom..." />
        ) : fact ? (
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <p className="text-lg text-indigo-900 leading-relaxed text-center font-medium">
              {fact}
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            Press Discover for a dose of wonder!
          </div>
        )}
      </Card>
    </div>
  );
};

const MoodPalSection = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const moods = [
    { label: "Happy", emoji: "🤩", color: "bg-yellow-100 hover:bg-yellow-200" },
    { label: "Stressed", emoji: "😤", color: "bg-red-100 hover:bg-red-200" },
    { label: "Sad", emoji: "😢", color: "bg-blue-100 hover:bg-blue-200" },
    { label: "Tired", emoji: "😴", color: "bg-purple-100 hover:bg-purple-200" },
    { label: "Anxious", emoji: "😰", color: "bg-orange-100 hover:bg-orange-200" },
    { label: "Hopeful", emoji: "✨", color: "bg-pink-100 hover:bg-pink-200" },
  ];

  const handleMood = async (mood: string) => {
    setLoading(true);
    setMessage("");
    try {
      const result = await Gemini.generateMoodMessage(mood);
      setMessage(result);
    } catch (e) {
      setMessage("I'm having trouble thinking right now, but remember you are awesome!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-pink-600">💞 Mood Pal</h2>
      <p className="text-center text-slate-600">How are you feeling right now?</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => { Sounds.click(); handleMood(m.label); }}
            disabled={loading}
            className={`${m.color} p-4 rounded-2xl transition-all transform hover:-translate-y-1 hover:shadow-md flex flex-col items-center gap-2`}
          >
            <span className="text-4xl">{m.emoji}</span>
            <span className="font-bold text-slate-700">{m.label}</span>
          </button>
        ))}
      </div>

      {loading && <Loading text="Crafting a hug in words..." />}

      {message && (
        <Card className="animate-fade-in bg-gradient-to-br from-pink-50 to-white">
          <div className="text-center">
             <div className="text-4xl mb-4">💌</div>
             <p className="text-lg text-slate-800 font-medium leading-relaxed italic">"{message}"</p>
          </div>
        </Card>
      )}
    </div>
  );
};

const GiggleTimeSection = () => {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const getStory = async () => {
    setLoading(true);
    setStory("");
    try {
      const text = await Gemini.generateFastText("Tell me a very short, funny, and wholesome story that would make someone smile.");
      setStory(text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const playAudio = async () => {
    if (!story) return;
    setAudioLoading(true);
    try {
      const audioBuffer = await Gemini.generateSpeech(story);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await ctx.decodeAudioData(audioBuffer);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch(e) {
      alert("Could not play audio.");
    }
    setAudioLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-orange-500">😂 Giggle Time</h2>
      <div className="flex justify-center">
        <Button onClick={getStory} disabled={loading} variant="accent">
          {loading ? "Writing..." : "Tell me a Story"}
        </Button>
      </div>

      {story && (
        <Card className="animate-fade-in relative">
          <p className="text-lg leading-relaxed text-slate-700 mb-8 whitespace-pre-wrap">{story}</p>
          <div className="absolute bottom-4 right-4">
            <button 
              onClick={(e) => { Sounds.click(); playAudio(); }} 
              disabled={audioLoading}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors shadow-sm font-semibold"
            >
              {audioLoading ? "Loading..." : "🔊 Read Aloud"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

const ChatBuddySection = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    Sounds.click();

    try {
      let responseText = "";
      
      if (isThinking) {
        responseText = await Gemini.generateThinkingText(currentInput);
      } else {
        responseText = await Gemini.generateFastText(`You are Nate, a cheerful companion. Respond to: ${currentInput}`);
      }

      const modelMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText,
        isThinking: isThinking
      };
      setMessages(prev => [...prev, modelMsg]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm having a bit of trouble connecting right now. Can we try again?" }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto h-[600px] flex flex-col">
      <h2 className="text-3xl font-bold text-center text-sky-600 mb-4">💬 Chat Buddy</h2>
      
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-20">
              Say hello! I'm here to listen and help.
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-sky-500 text-white rounded-br-none' 
                  : `bg-slate-100 text-slate-800 rounded-bl-none ${msg.isThinking ? 'border-2 border-purple-300 shadow-purple-100' : ''}`
              }`}>
                {msg.isThinking && <div className="text-xs font-bold text-purple-500 mb-1">🧠 Deep Thought</div>}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none animate-pulse">Thinking...</div>
             </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={isThinking} 
                  onChange={(e) => setIsThinking(e.target.checked)} 
                  className="sr-only"
                />
                <div className={`w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors ${isThinking ? 'bg-purple-500' : ''}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform ${isThinking ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className={`ml-2 text-sm font-bold ${isThinking ? 'text-purple-600' : 'text-slate-400'}`}>
                Thinking Mode (Nate)
              </span>
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()}>Send</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PoetryCornerSection = () => {
  const [topic, setTopic] = useState("");
  const [poem, setPoem] = useState("");
  const [loading, setLoading] = useState(false);

  const createPoem = async (style: string) => {
    if (!topic.trim()) return;
    setLoading(true);
    setPoem("");
    try {
      const text = await Gemini.generatePoem(topic, style);
      setPoem(text);
    } catch(e) { setPoem("The muse is sleeping..."); }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-purple-600">📜 Poetry Corner</h2>
      <Card>
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What should the poem be about?"
          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 bg-purple-50"
        />
        <div className="flex flex-wrap gap-2 justify-center">
          {['Haiku', 'Limerick', 'Rhyme', 'Sonnet'].map(style => (
             <Button key={style} onClick={() => createPoem(style)} disabled={loading} variant="secondary" className="text-sm px-4 py-2">
               {style}
             </Button>
          ))}
        </div>
      </Card>
      
      {loading && <Loading text="Weaving words..." />}
      
      {poem && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-100">
          <pre className="font-serif text-lg text-slate-800 whitespace-pre-wrap text-center leading-loose">
            {poem}
          </pre>
        </Card>
      )}
    </div>
  );
};

// --- NEW SECTION: Dream Painter (Image Gen) ---
const DreamPainterSection = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState("1K");
  const [ratio, setRatio] = useState("1:1");

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImage("");
    try {
      const b64 = await Gemini.generateImage(prompt, ratio, size);
      setImage(b64);
    } catch (e) {
      alert("Failed to generate image. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-fuchsia-600">🎨 Dream Painter</h2>
      <Card>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream image..."
            className="w-full px-4 py-3 rounded-xl border border-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 h-24 resize-none bg-fuchsia-50"
          />
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
             <div className="flex gap-2 items-center">
               <span className="text-sm font-bold text-slate-500">Ratio:</span>
               <select value={ratio} onChange={e => setRatio(e.target.value)} className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm">
                 {["1:1", "3:4", "4:3", "9:16", "16:9"].map(r => <option key={r} value={r}>{r}</option>)}
               </select>
             </div>
             <div className="flex gap-2 items-center">
               <span className="text-sm font-bold text-slate-500">Size:</span>
               <select value={size} onChange={e => setSize(e.target.value)} className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm">
                 {["1K", "2K", "4K"].map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
             <Button onClick={generate} disabled={loading || !prompt}>
               {loading ? "Painting..." : "Generate"}
             </Button>
          </div>
        </div>
      </Card>

      {loading && <Loading text="Mixing colors..." />}

      {image && (
        <Card className="overflow-hidden p-2">
           <img src={image} alt="Generated" className="w-full rounded-2xl shadow-inner" />
        </Card>
      )}
    </div>
  );
};

// --- NEW SECTION: Motion Magic (Veo Video) ---
const MotionMagicSection = () => {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratio, setRatio] = useState("16:9");
  const [hasKey, setHasKey] = useState(false);
  
  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if ((window as any).aistudio?.hasSelectedApiKey) {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const selectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      await checkKey();
    }
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setVideoUrl("");
    try {
      const url = await Gemini.generateVeoVideo(prompt, ratio);
      setVideoUrl(url);
    } catch (e) {
      alert("Failed to generate video. Ensure you have a paid key selected.");
      setHasKey(false); // Reset to prompt key selection again if failed
    }
    setLoading(false);
  };

  if (!hasKey) {
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center">
         <h2 className="text-3xl font-bold text-center text-teal-600">🎥 Motion Magic</h2>
         <Card className="py-12">
            <p className="text-slate-600 mb-6">To use Veo video generation, you must select a paid API key.</p>
            <Button onClick={selectKey} variant="teal">Select API Key</Button>
            <div className="mt-4 text-xs text-slate-400">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-teal-500">
                View Billing Documentation
              </a>
            </div>
         </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-teal-600">🎥 Motion Magic</h2>
      <Card>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create..."
            className="w-full px-4 py-3 rounded-xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 h-24 resize-none bg-teal-50"
          />
          <div className="flex justify-between items-center">
             <div className="flex gap-2 items-center">
               <span className="text-sm font-bold text-slate-500">Ratio:</span>
               <select value={ratio} onChange={e => setRatio(e.target.value)} className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm">
                 <option value="16:9">Landscape (16:9)</option>
                 <option value="9:16">Portrait (9:16)</option>
               </select>
             </div>
             <Button onClick={generate} disabled={loading || !prompt} variant="teal">
               {loading ? "Directing..." : "Action!"}
             </Button>
          </div>
        </div>
      </Card>

      {loading && <Loading text="Filming your scene (this takes a moment)..." />}

      {videoUrl && (
        <Card className="overflow-hidden p-2">
           <video src={videoUrl} controls autoPlay loop className="w-full rounded-2xl shadow-inner" />
        </Card>
      )}
    </div>
  );
};

const WheelsSection = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const selfCareOptions = [
    "Drink Water 💧", "5 Deep Breaths 🧘", "Text a Friend 📱", 
    "Stretch 🙆", "Listen to Music 🎵", "Eat a Fruit 🍎"
  ];

  const funOptions = [
    "Draw a Cat 🐱", "Dance Break 💃", "Sing a Song 🎤", 
    "Origami 🦢", "Write a Poem 📝", "Air Guitar 🎸"
  ];

  const spin = (options: string[]) => {
    setSpinning(true);
    setResult(null);
    Sounds.spin();
    
    // Simple visual simulation of spinning
    setTimeout(() => {
      const winner = options[Math.floor(Math.random() * options.length)];
      setResult(winner);
      setSpinning(false);
      Sounds.win();
    }, 2000); // 2 second spin
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center text-rose-500">🎡 Fun Wheels</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="text-center space-y-4">
           <h3 className="text-xl font-bold text-slate-700">Self-Care Spinner</h3>
           <div className="h-32 flex items-center justify-center bg-rose-50 rounded-full w-32 mx-auto border-4 border-rose-200">
             {spinning ? <div className="animate-spin text-4xl">🎡</div> : <div className="text-4xl">🧘‍♀️</div>}
           </div>
           <Button onClick={() => spin(selfCareOptions)} disabled={spinning}>Spin for Care!</Button>
        </Card>

        <Card className="text-center space-y-4">
           <h3 className="text-xl font-bold text-slate-700">Fun Project Ideas</h3>
           <div className="h-32 flex items-center justify-center bg-blue-50 rounded-full w-32 mx-auto border-4 border-blue-200">
             {spinning ? <div className="animate-spin text-4xl">🎡</div> : <div className="text-4xl">🎨</div>}
           </div>
           <Button onClick={() => spin(funOptions)} disabled={spinning} variant="accent">Spin for Fun!</Button>
        </Card>
      </div>

      {result && (
        <div className="animate-bounce text-center p-6 bg-yellow-100 rounded-3xl border-2 border-yellow-300">
          <h3 className="text-2xl font-bold text-yellow-600">✨ You got: {result} ✨</h3>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [section, setSection] = useState<AppSection>(AppSection.HOME);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-white/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { Sounds.click(); setSection(AppSection.HOME); }}
          >
            <span className="text-3xl">🌈</span>
            <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
              App4QT
            </span>
          </div>
          {section !== AppSection.HOME && (
            <button 
              onClick={() => { Sounds.click(); setSection(AppSection.HOME); }}
              className="text-slate-500 hover:text-slate-800 font-bold text-sm px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              ← Back Home
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in-up">
          {section === AppSection.HOME && <HomeSection setSection={setSection} />}
          {section === AppSection.ANIMAL_MAGIC && <AnimalMagicSection />}
          {section === AppSection.MOOD_PAL && <MoodPalSection />}
          {section === AppSection.GIGGLE_TIME && <GiggleTimeSection />}
          {section === AppSection.CHAT_BUDDY && <ChatBuddySection />}
          {section === AppSection.POETRY_CORNER && <PoetryCornerSection />}
          {section === AppSection.IMAGE_GEN && <DreamPainterSection />}
          {section === AppSection.VIDEO_GEN && <MotionMagicSection />}
          {section === AppSection.WHEELS && <WheelsSection />}
        </div>
      </main>
    </div>
  );
}