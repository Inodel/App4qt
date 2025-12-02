const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) ctx = new AudioContext();
  return ctx;
};

export const click = () => {
  try {
    const context = getCtx();
    if (context.state === 'suspended') context.resume();
    
    const osc = context.createOscillator();
    const gain = context.createGain();
    
    osc.connect(gain);
    gain.connect(context.destination);
    
    // High-pitched blip: 800Hz -> 1000Hz
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, context.currentTime);
    osc.frequency.linearRampToValueAtTime(1000, context.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.1);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const spin = () => {
  try {
    const context = getCtx();
    if (context.state === 'suspended') context.resume();

    const osc = context.createOscillator();
    const gain = context.createGain();
    
    osc.connect(gain);
    gain.connect(context.destination);
    
    // Whirring sound: 800Hz -> 400Hz -> 600Hz
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, context.currentTime);
    osc.frequency.linearRampToValueAtTime(400, context.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(600, context.currentTime + 0.3);

    gain.gain.setValueAtTime(0.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
    
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.3);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const win = () => {
  try {
    const context = getCtx();
    if (context.state === 'suspended') context.resume();

    const now = context.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.connect(gain);
      gain.connect(context.destination);
      
      const startTime = now + (i * 0.1);
      const duration = 0.3;
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.error("Audio play failed", e);
  }
};
