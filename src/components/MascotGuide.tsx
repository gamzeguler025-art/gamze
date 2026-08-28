import React from 'react';
import { Volume2, Sparkles, MessageCircle } from 'lucide-react';
import { speakTurkish, playPop } from '../utils/audio';

interface MascotGuideProps {
  message: string;
  isMuted?: boolean;
  avatarEmoji?: string;
  name?: string;
}

export const MascotGuide: React.FC<MascotGuideProps> = ({
  message,
  isMuted = false,
  avatarEmoji = '🐰',
  name = 'Tonton Tavşan',
}) => {
  const handleSpeak = () => {
    if (isMuted) return;
    playPop();
    speakTurkish(message);
  };

  return (
    <div className="flex items-center gap-3.5 bg-white border-2 border-blue-100 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
      {/* Mascot Avatar */}
      <button
        onClick={handleSpeak}
        id="mascot-avatar-btn"
        className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-yellow-400 border-2 border-yellow-500 flex items-center justify-center text-2xl sm:text-3xl hover:scale-105 active:scale-95 transition-transform shadow-inner"
        title="Tavşanı Konuştur"
      >
        <span className="select-none">{avatarEmoji}</span>
      </button>

      {/* Speech Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-display font-bold text-xs sm:text-sm text-blue-900 flex items-center gap-1">
            {name}
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 inline" />
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
          {message}
        </p>
      </div>

      {/* Audio Button */}
      {!isMuted && (
        <button
          onClick={handleSpeak}
          id="mascot-speak-btn"
          className="shrink-0 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 text-slate-700 shadow-2xs transition-all active:border-b-0 active:translate-y-1 flex items-center justify-center"
          title="Sesli Dinle"
        >
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
};
