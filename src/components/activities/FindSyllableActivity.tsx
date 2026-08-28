import React, { useState, useEffect, useMemo } from 'react';
import { Target, Volume2, Star, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { SyllableItem, SoundGroup2Letter } from '../../types';
import { SYLLABLES_DATA } from '../../data/curriculumData';
import { playPop, playSuccessChime, playEncouragement, speakTurkish } from '../../utils/audio';
import { MascotGuide } from '../MascotGuide';
import confetti from 'canvas-confetti';

interface FindSyllableActivityProps {
  selectedGroup: SoundGroup2Letter;
  onEarnStar: () => void;
  onRecordTroubleSyllable: (syllable: string) => void;
  isMuted: boolean;
}

export const FindSyllableActivity: React.FC<FindSyllableActivityProps> = ({
  selectedGroup,
  onEarnStar,
  onRecordTroubleSyllable,
  isMuted,
}) => {
  const pool = useMemo(() => {
    return SYLLABLES_DATA.filter((s) =>
      selectedGroup === 'HEPSİ' ? true : s.letterGroup === selectedGroup
    );
  }, [selectedGroup]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [targetItem, setTargetItem] = useState<SyllableItem>(pool[0] || SYLLABLES_DATA[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'retry'>('idle');
  const [feedbackText, setFeedbackText] = useState('');
  const [score, setScore] = useState(0);

  // Generate question options
  const generateQuestion = (index: number) => {
    const target = pool[index % pool.length] || SYLLABLES_DATA[0];
    setTargetItem(target);
    setSelectedOption(null);
    setStatus('idle');
    setFeedbackText('');

    // Generate 3 distinct distractors
    const otherSyllables = SYLLABLES_DATA.filter((s) => s.syllable !== target.syllable);
    const shuffledOthers = [...otherSyllables].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map((s) => s.syllable);

    const fullOptions = [...distractors, target.syllable].sort(() => 0.5 - Math.random());
    setOptions(fullOptions);
  };

  useEffect(() => {
    generateQuestion(questionIndex);
  }, [questionIndex, pool]);

  const handleListenTarget = () => {
    if (isMuted) return;
    speakTurkish(targetItem.syllable, { rate: 0.75, pitch: 1.15 });
  };

  const handleSelectOption = (option: string) => {
    if (status === 'correct') return;
    playPop();
    setSelectedOption(option);

    if (option === targetItem.syllable) {
      // Correct!
      setStatus('correct');
      setFeedbackText('🎉 Harika! Heceni buldun!');
      playSuccessChime();
      onEarnStar();
      setScore((s) => s + 1);

      try {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899'],
        });
      } catch {
        // ignore
      }
    } else {
      // Gentle Retry (Pedagogical growth mindset)
      setStatus('retry');
      setFeedbackText('🌱 Bir kez daha bakalım. Hedef heceyi tekrar oku.');
      playEncouragement();
      onRecordTroubleSyllable(targetItem.syllable);
      if (!isMuted) {
        speakTurkish('Bir kez daha bakalım. Hedef heceyi tekrar oku.');
      }
    }
  };

  const handleNext = () => {
    playPop();
    setQuestionIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <MascotGuide
        isMuted={isMuted}
        message={`Yukarıdaki kutuda yazan hedef heceye bak. Aşağıdaki 4 seçenekten aynısını bul ve dokun!`}
      />

      <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Top Activity Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-emerald-500 border-b-4 border-emerald-700 text-white flex items-center justify-center text-lg font-bold shadow-xs">
              🎯
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">
                Heceni Bul
              </h3>
              <p className="text-xs text-slate-500">
                Hedef heceyi dikkatle incele ve seç
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-emerald-300">
              Soru {questionIndex + 1}
            </span>
          </div>
        </div>

        {/* Target Syllable Display Banner */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-extrabold text-blue-800 tracking-wider uppercase bg-blue-100 px-4 py-1 rounded-full border border-blue-200">
            Hedef Heceyi Bul
          </span>

          <div className="flex items-center gap-4 bg-linear-to-r from-blue-50/80 via-sky-50/60 to-blue-50/80 border-4 border-blue-300 rounded-3xl px-8 py-5 shadow-inner">
            <span
              id="target-syllable-display"
              className="font-display font-black text-6xl sm:text-7xl tracking-widest text-slate-800 drop-shadow-xs select-none"
            >
              {targetItem.syllable}
            </span>

            <button
              id="target-syllable-audio-btn"
              onClick={handleListenTarget}
              className="p-3.5 bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white rounded-2xl shadow-sm transition-all"
              title="Hedef Heceyi Dinle"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 4 Choice Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
          {options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === targetItem.syllable && status === 'correct';
            const isWrongSelected = isSelected && status === 'retry';

            let cardStyles = 'bg-slate-50 hover:bg-blue-50/70 border-slate-200 border-b-6 border-b-slate-300 text-slate-800 hover:border-blue-300';
            if (isCorrect) {
              cardStyles = 'bg-green-500 border-green-600 border-b-6 border-b-green-700 text-white shadow-md scale-102';
            } else if (isWrongSelected) {
              cardStyles = 'bg-amber-50 border-amber-300 border-b-6 border-b-amber-400 text-amber-950';
            }

            return (
              <button
                key={`${option}-${idx}`}
                id={`find-option-btn-${idx}`}
                onClick={() => handleSelectOption(option)}
                className={`h-28 sm:h-36 rounded-3xl border-3 font-display font-black text-4xl sm:text-6xl tracking-wider flex items-center justify-center transition-all transform active:border-b-0 active:translate-y-1 shadow-sm select-none ${cardStyles}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Pedagogical Feedback Banner */}
        {status !== 'idle' && (
          <div
            className={`rounded-3xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 animate-scaleIn ${
              status === 'correct'
                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-950'
                : 'bg-amber-100 border-2 border-amber-400 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">
                {status === 'correct' ? '🎉' : '🌱'}
              </span>
              <p className="font-display font-black text-base sm:text-lg">
                {feedbackText}
              </p>
            </div>

            {status === 'correct' ? (
              <button
                id="find-syllable-next-btn"
                onClick={handleNext}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-white font-black text-base px-7 py-3 rounded-2xl shadow-sm transition-all whitespace-nowrap"
              >
                Sıradaki Soru ➔
              </button>
            ) : (
              <button
                onClick={handleListenTarget}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 text-amber-950 font-bold text-sm px-5 py-2.5 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>Tekrar Dinle 🔊</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
