import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Star, Repeat, ArrowRight, BookOpen } from 'lucide-react';
import { SyllableItem, SoundGroup2Letter } from '../../types';
import { SYLLABLES_DATA, ENCOURAGING_SUCCESS_MESSAGES } from '../../data/curriculumData';
import { playPop, playSuccessChime, speakTurkish } from '../../utils/audio';
import { MascotGuide } from '../MascotGuide';
import confetti from 'canvas-confetti';

interface ExploreSyllablesProps {
  selectedGroup: SoundGroup2Letter;
  onEarnStar: () => void;
  onRecordTroubleSyllable: (syllable: string) => void;
  isMuted: boolean;
}

export const ExploreSyllables: React.FC<ExploreSyllablesProps> = ({
  selectedGroup,
  onEarnStar,
  onRecordTroubleSyllable,
  isMuted,
}) => {
  // Filter syllables based on selected sound
  const filteredSyllables = SYLLABLES_DATA.filter((item) =>
    selectedGroup === 'HEPSİ' ? true : item.letterGroup === selectedGroup
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [hasListened, setHasListened] = useState(false);
  const [hasRepeated, setHasRepeated] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  const currentSyllable: SyllableItem = filteredSyllables[currentIndex] || SYLLABLES_DATA[0];

  const handleNext = () => {
    playPop();
    setActiveStep(1);
    setHasListened(false);
    setHasRepeated(false);
    setShowCelebration(false);
    setCurrentIndex((prev) => (prev + 1) % filteredSyllables.length);
  };

  const handlePrev = () => {
    playPop();
    setActiveStep(1);
    setHasListened(false);
    setHasRepeated(false);
    setShowCelebration(false);
    setCurrentIndex((prev) => (prev - 1 + filteredSyllables.length) % filteredSyllables.length);
  };

  // Step 2: Listen
  const handleListen = () => {
    if (!isMuted) {
      speakTurkish(currentSyllable.syllable, {
        rate: 0.7,
        pitch: 1.15,
      });
    }
    setHasListened(true);
    if (activeStep < 2) setActiveStep(2);
  };

  // Step 3: Repeat
  const handleRepeat = () => {
    playPop();
    setHasRepeated(true);
    setActiveStep(3);
    const msg = ENCOURAGING_SUCCESS_MESSAGES[Math.floor(Math.random() * ENCOURAGING_SUCCESS_MESSAGES.length)];
    setCelebrationMsg(msg);
    setShowCelebration(true);
    playSuccessChime();
    onEarnStar();
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
    } catch {
      // ignore
    }
  };

  // Step 4: Word view
  const handleViewWord = () => {
    playPop();
    setActiveStep(4);
    if (!isMuted) {
      speakTurkish(`${currentSyllable.exampleWord}. ${currentSyllable.hintSentence}`, {
        rate: 0.75,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Companion Mascot Guidance */}
      <MascotGuide
        isMuted={isMuted}
        message={`Hecemiz: "${currentSyllable.syllable.toUpperCase()}". Önce 🔊 butonuna basıp dinle, sonra yüksek sesle tekrar et!`}
      />

      {/* Main Learning Card */}
      <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Top Progress & Navigation Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <button
            id="explore-prev-btn"
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 text-slate-700 font-bold text-sm transition-all active:border-b-0 active:translate-y-1"
            title="Önceki Hece"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Önceki</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-900 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-blue-300">
              Hece {currentIndex + 1} / {filteredSyllables.length}
            </span>
            <span className="bg-indigo-100 text-indigo-800 font-bold text-xs px-2.5 py-1 rounded-full border border-indigo-200">
              {currentSyllable.letterGroup} Sesi
            </span>
          </div>

          <button
            id="explore-next-btn"
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 text-white font-bold text-sm shadow-sm transition-all active:border-b-0 active:translate-y-1"
            title="Sonraki Hece"
          >
            <span className="hidden sm:inline">Sonraki</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Educational Progression Tracker */}
        <div className="grid grid-cols-4 gap-2 bg-blue-50/60 p-2 rounded-2xl border border-blue-100 text-center">
          <div className={`p-2 rounded-xl text-xs font-bold transition-colors ${activeStep >= 1 ? 'bg-blue-500 text-white font-black shadow-2xs' : 'text-slate-500'}`}>
            1. Gör 👀
          </div>
          <div className={`p-2 rounded-xl text-xs font-bold transition-colors ${activeStep >= 2 ? 'bg-indigo-500 text-white font-black shadow-2xs' : 'text-slate-500'}`}>
            2. Dinle 🔊
          </div>
          <div className={`p-2 rounded-xl text-xs font-bold transition-colors ${activeStep >= 3 ? 'bg-emerald-500 text-white font-black shadow-2xs' : 'text-slate-500'}`}>
            3. Tekrar Et 🗣️
          </div>
          <div className={`p-2 rounded-xl text-xs font-bold transition-colors ${activeStep >= 4 ? 'bg-amber-500 text-white font-black shadow-2xs' : 'text-slate-500'}`}>
            4. Kelimede Gör 🍎
          </div>
        </div>

        {/* Big Syllable Display Stage */}
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          
          {/* Main Syllable Card */}
          <div className="relative group">
            <div className="w-64 sm:w-80 h-44 sm:h-52 bg-linear-to-b from-blue-50/80 via-sky-50/40 to-white rounded-3xl border-4 border-blue-200 flex flex-col items-center justify-center shadow-md transition-transform transform group-hover:scale-102">
              
              {/* Syllable Text */}
              <span
                id="current-syllable-display"
                className="font-display font-black text-6xl sm:text-8xl tracking-wider text-slate-800 drop-shadow-xs select-none"
              >
                {currentSyllable.syllable}
              </span>

              {/* Phonics Sound Breakdown */}
              <div className="flex items-center gap-2 mt-2 bg-white/90 px-4 py-1 rounded-full border border-blue-200 shadow-2xs">
                {currentSyllable.parts.map((letter, idx) => (
                  <React.Fragment key={idx}>
                    <span className="font-bold text-sm sm:text-base text-rose-600">
                      [{letter}]
                    </span>
                    {idx < currentSyllable.parts.length - 1 && (
                      <span className="text-slate-400 font-bold">+</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-slate-400 font-bold">=</span>
                <span className="font-black text-sm sm:text-base text-blue-700">
                  {currentSyllable.syllable}
                </span>
              </div>
            </div>

            {/* Listen Button Floating Trigger */}
            <button
              id="listen-syllable-big-btn"
              onClick={handleListen}
              className="absolute -bottom-4 right-1/2 translate-x-1/2 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white font-black px-6 py-2.5 rounded-full shadow-md transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>Sesi Dinle 🔊</span>
            </button>
          </div>

          {/* Action Buttons for Step 3 and Step 4 */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            
            {/* Step 3: Repeat Button */}
            <button
              id="repeat-syllable-btn"
              onClick={handleRepeat}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-base shadow-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                hasRepeated
                  ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 border-green-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{hasRepeated ? 'Tekrar Ettim! 🌟' : 'Yüksek Sesle Söyledim! 🗣️'}</span>
            </button>

            {/* Step 4: Show in Word Button */}
            <button
              id="show-word-btn"
              onClick={handleViewWord}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 border-b-4 border-indigo-700 text-white font-black text-base px-6 py-3.5 rounded-2xl shadow-sm transition-all active:border-b-0 active:translate-y-1"
            >
              <BookOpen className="w-5 h-5" />
              <span>Kelimede Gör 🍎</span>
            </button>

          </div>

        </div>

        {/* Step 4 Word View Showcase Card */}
        {activeStep === 4 && (
          <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                Heceyi Kelime İçinde İncele
              </span>
              <span className="text-2xl select-none">{currentSyllable.emoji}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {currentSyllable.exampleWordSyllables.map((syl, i) => {
                    const isTarget = syl.toLowerCase() === currentSyllable.syllable.toLowerCase();
                    return (
                      <span
                        key={i}
                        className={`font-display font-black text-3xl sm:text-4xl px-3 py-1 rounded-xl border-2 ${
                          isTarget
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs scale-105'
                            : 'bg-white text-slate-800 border-sky-300'
                        }`}
                      >
                        {syl}
                      </span>
                    );
                  })}
                </div>
                <p className="text-sm font-bold text-sky-950 pt-1">
                  {currentSyllable.exampleWordMeaning}
                </p>
              </div>

              <div className="bg-white/90 p-3 rounded-2xl border border-sky-200 text-center max-w-xs">
                <p className="text-xs font-semibold text-slate-600 italic">
                  "{currentSyllable.hintSentence}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Celebratory Banner */}
        {showCelebration && (
          <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 text-center animate-bounce flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="font-display font-black text-emerald-900 text-lg">
              {celebrationMsg}
            </span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
        )}

      </div>
    </div>
  );
};
