import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Check, Star, Sparkles, RefreshCw, Eye, EyeOff, Play, Award } from 'lucide-react';
import { SyllableItem, SoundGroup2Letter } from '../../types';
import { SYLLABLES_DATA, ENCOURAGING_SUCCESS_MESSAGES } from '../../data/curriculumData';
import { playPop, playSuccessChime, speakTurkish } from '../../utils/audio';
import { MascotGuide } from '../MascotGuide';
import confetti from 'canvas-confetti';

interface ListenRepeatActivityProps {
  selectedGroup: SoundGroup2Letter;
  onEarnStar: () => void;
  onRecordTroubleSyllable: (syllable: string) => void;
  isMuted: boolean;
}

export const ListenRepeatActivity: React.FC<ListenRepeatActivityProps> = ({
  selectedGroup,
  onEarnStar,
  onRecordTroubleSyllable,
  isMuted,
}) => {
  const filtered = SYLLABLES_DATA.filter((s) =>
    selectedGroup === 'HEPSİ' ? true : s.letterGroup === selectedGroup
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasCompletedCurrent, setHasCompletedCurrent] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [consecutiveCount, setConsecutiveCount] = useState(0);

  const currentItem: SyllableItem = filtered[currentIndex] || SYLLABLES_DATA[0];

  useEffect(() => {
    // Reset state on index change
    setIsRevealed(true);
    setHasCompletedCurrent(false);
    setFeedbackMessage('');
  }, [currentIndex]);

  const handlePlayAudio = (slow = false) => {
    if (isMuted) return;
    setIsPlaying(true);
    speakTurkish(currentItem.syllable, {
      rate: slow ? 0.6 : 0.75,
      pitch: 1.15,
      onEnd: () => setIsPlaying(false),
    });
  };

  // Student marks that they read it aloud or uses voice
  const handleCompleteReading = () => {
    playPop();
    setHasCompletedCurrent(true);
    const msg = ENCOURAGING_SUCCESS_MESSAGES[Math.floor(Math.random() * ENCOURAGING_SUCCESS_MESSAGES.length)];
    setFeedbackMessage(msg);
    playSuccessChime();
    onEarnStar();
    setConsecutiveCount((c) => c + 1);

    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });
    } catch {
      // ignore
    }
  };

  const handleNextItem = () => {
    playPop();
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <MascotGuide
        isMuted={isMuted}
        message="Önce 🔊 'Dinle' butonuna basarak heceyi dikkatle dinle. Sonra yüksek sesle tekrar et ve 'Okudum' butonuna dokun!"
      />

      <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Header & Counters */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-orange-500 border-b-4 border-orange-700 text-white flex items-center justify-center text-lg font-bold shadow-xs">
              🔊
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">
                Dinle ve Tekrar Et
              </h3>
              <p className="text-xs text-slate-500">
                Ses tellerini çalıştır, güzelce oku
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-900 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-orange-300">
              Hece {currentIndex + 1} / {filtered.length}
            </span>
          </div>
        </div>

        {/* Big Syllable Practice Stage */}
        <div className="flex flex-col items-center justify-center py-4 space-y-6">
          
          {/* Card */}
          <div className="relative">
            <div className="w-72 sm:w-88 h-48 sm:h-56 bg-linear-to-b from-orange-50/80 via-amber-50/40 to-white rounded-3xl border-4 border-orange-300 flex flex-col items-center justify-center shadow-md p-6">
              
              {isRevealed ? (
                <span
                  id="listen-repeat-syllable-display"
                  className="font-display font-black text-6xl sm:text-8xl tracking-widest text-slate-800 drop-shadow-xs select-none animate-scaleIn"
                >
                  {currentItem.syllable}
                </span>
              ) : (
                <div className="text-center space-y-2">
                  <span className="text-5xl">❓</span>
                  <p className="text-xs font-bold text-slate-500">
                    Önce dinle, sonra gör!
                  </p>
                </div>
              )}

              {/* Phonics letter hints */}
              {isRevealed && (
                <div className="flex items-center gap-1.5 mt-3 bg-white/90 px-4 py-1 rounded-full border border-orange-200 text-xs sm:text-sm font-bold text-orange-900 shadow-2xs">
                  <span>{currentItem.letterGroup} Sesi</span>
                  <span>•</span>
                  <span>{currentItem.type === 'open' ? 'Açık Hece' : 'Kapalı Hece'}</span>
                </div>
              )}
            </div>

            {/* Quick Toggle Reveal Button */}
            <button
              onClick={() => {
                playPop();
                setIsRevealed(!isRevealed);
              }}
              className="absolute top-3 right-3 p-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 border-2 border-orange-200 border-b-4 border-b-orange-300 shadow-2xs text-xs font-bold transition-all active:border-b-0 active:translate-y-0.5"
              title={isRevealed ? 'Heceyi Gizle' : 'Heceyi Göster'}
            >
              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Audio Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            
            {/* Standard Listen */}
            <button
              id="listen-normal-btn"
              onClick={() => handlePlayAudio(false)}
              disabled={isPlaying}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 text-white font-extrabold text-base px-7 py-3.5 rounded-2xl shadow-sm transition-all"
            >
              <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-ping' : ''}`} />
              <span>{isPlaying ? 'Dinleniyor...' : 'Dinle 🔊'}</span>
            </button>

            {/* Slow Listen for Phonics */}
            <button
              id="listen-slow-btn"
              onClick={() => handlePlayAudio(true)}
              disabled={isPlaying}
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border-b-4 border-amber-300 active:border-b-0 active:translate-y-1 text-amber-900 font-bold text-sm px-5 py-3.5 rounded-2xl transition-all"
              title="Yavaş ve Harf Harf Dinle"
            >
              <span>🐢 Yavaş Dinle</span>
            </button>

          </div>

          {/* Repeat Confirmation Stage */}
          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              id="confirm-repeat-btn"
              onClick={handleCompleteReading}
              className={`flex items-center gap-3 px-8 sm:px-10 py-4 rounded-3xl font-black text-lg sm:text-xl shadow-lg transition-all border-b-6 active:border-b-0 active:translate-y-1.5 ${
                hasCompletedCurrent
                  ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 border-green-700 text-white'
              }`}
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>{hasCompletedCurrent ? 'Harika Okudun! ⭐' : 'YÜKSEK SESLE OKUDUM! 🗣️'}</span>
            </button>
            <p className="text-xs font-semibold text-slate-500">
              Heceyi kendi sesinle 2 kez söyleyip butona bas
            </p>
          </div>

          {/* Feedback & Next Button */}
          {hasCompletedCurrent && (
            <div className="w-full bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 text-center space-y-4 animate-scaleIn">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                <span className="font-display font-black text-emerald-950 text-xl">
                  {feedbackMessage}
                </span>
                <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
              </div>

              <button
                id="next-listen-repeat-btn"
                onClick={handleNextItem}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-white font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-sm transition-all"
              >
                <span>Sonraki Heceye Geç ➔</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
