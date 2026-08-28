// Audio utilities using Web Speech API & Web Audio API synthesis
// 100% reliable, zero external audio asset download failures

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const playPop = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // ignore audio errors
  }
};

export const playSuccessChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.4);
    });
  } catch {
    // ignore audio errors
  }
};

export const playEncouragement = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Gentle soft ascending melody (F4, A4, C5) - comforting and encouraging
    const notes = [349.23, 440.0, 523.25];
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);
      
      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + index * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.45);
    });
  } catch {
    // ignore audio errors
  }
};

export const playTrainWhistle = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Classic cute dual tone train whistle (D5 + F#5)
    [587.33, 739.99].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.4);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.setValueAtTime(0.12, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      // Low pass filter to make it softer and warmer
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.65);
    });
  } catch {
    // ignore audio errors
  }
};

export const playFanfare = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },    // C5
      { f: 523.25, d: 0.12, t: 0.12 }, // C5
      { f: 523.25, d: 0.12, t: 0.24 }, // C5
      { f: 659.25, d: 0.3, t: 0.36 },  // E5
      { f: 783.99, d: 0.5, t: 0.66 },  // G5
    ];
    
    notes.forEach(({ f, d, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);
      
      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.28, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + t);
      osc.stop(now + t + d + 0.05);
    });
  } catch {
    // ignore audio errors
  }
};

// Turkish Speech Synthesis helper for 1st grade students
export const speakTurkish = (
  text: string,
  options?: {
    rate?: number; // slow default 0.75 for clear Turkish phonics
    pitch?: number; // slightly higher warm pitch 1.1
    onStart?: () => void;
    onEnd?: () => void;
  }
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = options?.rate ?? 0.75;
    utterance.pitch = options?.pitch ?? 1.15;

    // Pick best Turkish voice if available
    const voices = window.speechSynthesis.getVoices();
    const trVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('tr') && (v.name.includes('Google') || v.name.includes('Yelda') || v.name.includes('Turkish'))) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('tr'));

    if (trVoice) {
      utterance.voice = trVoice;
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    utterance.onerror = () => options?.onEnd?.();

    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onEnd?.();
  }
};

// Cancel any active speech
export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
};
