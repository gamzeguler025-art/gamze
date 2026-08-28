import React, { useState, useEffect, useMemo } from 'react';
import { Puzzle, Volume2, Star, Sparkles, Check, ArrowRight } from 'lucide-react';
import { WordPuzzleItem, SoundGroup2Letter } from '../../types';
import { WORD_PUZZLES } from '../../data/curriculumData';
import { playPop, playSuccessChime, playEncouragement, speakTurkish } from '../../utils/audio';
import { MascotGuide } from '../MascotGuide';
import confetti from 'canvas-confetti';

interface CompleteWordActivityProps {
  selectedGroup: SoundGroup2Letter;
  onEarnStar: () => void;
  onRecordTroubleSyllable: (syllable: string) => void;
  isMuted: boolean;
}

export const CompleteWordActivity: React.FC<CompleteWordActivityProps> = ({
  selectedGroup,
  onEarnStar,
  onRecordTroubleSyllable,
  isMuted,
}) => {
  const pool = useMemo(() => {
    return WORD_PUZZLES.filter((wp) =>
      selectedGroup === 'HEPSİ' ? true : wp.letterGroup === selectedGroup
    );
  }, [selectedGroup]);

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedSyllable, setSelectedSyllable] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'retry'>('idle');

  const currentPuzzle: WordPuzzleItem = pool[puzzleIndex % pool.length] || WORD_PUZZLES[0];

  useEffect(() => {
    setSelectedSyllable(null);
    setIsCompleted(false);
    setStatus('idle');
  }, [puzzleIndex, pool]);

  const handleSelectChoice = (option: string) => {
    if (isCompleted) return;
    playPop();
    setSelectedSyllable(option);

    if (option === currentPuzzle.missingSyllable) {
      // Correct completion!
      setIsCompleted(true);
      setStatus('correct');
      playSuccessChime();
      onEarnStar();

      if (!isMuted) {
        speakTurkish(currentPuzzle.fullWord, { rate: 0.75, pitch: 1.15 });
      }

      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
        });
      } catch {
        // ignore
      }
    } else {
      // Gentle encouragement
      setStatus('retry');
      playEncouragement();
      onRecordTroubleSyllable(currentPuzzle.missingSyllable);
      if (!isMuted) {
        speakTurkish('Bir kez daha deneyelim. Eksik heceyi birlikte bulalım.');
      }
    }
  };

  const handleSpeakWord = () => {
    if (isMuted) return;
    speakTurkish(currentPuzzle.fullWord, { rate: 0.75, pitch: 1.15 });
  };

  const handleNext = () => {
    playPop();
    setPuzzleIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <MascotGuide
        isMuted={isMuted}
        message="Resme bak ve kelimeyi incele! Soru işaretli boşluğa hangi hece gelmeli? Aşağıdan doğru parçayı seç!"
      />

      <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-blue-500 border-b-4 border-blue-700 text-white flex items-center justify-center text-lg font-bold shadow-xs">
              🧩
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">
                Kelimeyi Tamamla
              </h3>
              <p className="text-xs text-slate-500">
                Hece parçalarını birleştir, kelimeyi oku
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-900 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-blue-300">
              Bulmaca {puzzleIndex + 1} / {pool.length}
            </span>
          </div>
        </div>

        {/* Puzzle Visual Stage */}
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          
          {/* Visual Clue Emoji */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-blue-50/80 border-3 border-blue-200 flex items-center justify-center text-5xl sm:text-6xl shadow-inner">
            <span className="select-none">{currentPuzzle.emoji}</span>
          </div>

          {/* Word Syllables Puzzle Track */}
          <div className="flex items-center gap-3">
            {currentPuzzle.displayParts.map((part, index) => {
              if (part.isMissing) {
                return (
                  <div
                    key={index}
                    className={`min-w-28 sm:min-w-36 h-20 sm:h-24 rounded-3xl border-4 border-dashed flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 border-green-600 border-b-6 border-b-green-700 text-white shadow-md scale-105'
                        : 'bg-amber-50 border-amber-400 text-amber-900 animate-pulse'
                    }`}
                  >
                    <span className="font-display font-black text-4xl sm:text-5xl tracking-wide select-none">
                      {isCompleted ? currentPuzzle.missingSyllable : '?'}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="min-w-28 sm:min-w-36 h-20 sm:h-24 rounded-3xl bg-blue-500 border-4 border-blue-600 border-b-6 border-b-blue-700 text-white flex items-center justify-center shadow-md"
                >
                  <span className="font-display font-black text-4xl sm:text-5xl tracking-wide select-none">
                    {part.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Word meaning caption */}
          <p className="text-sm sm:text-base font-bold text-slate-600">
            {currentPuzzle.meaning}
          </p>

        </div>

        {/* 4 Syllable Options */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold text-blue-800 text-center uppercase tracking-wider">
            Eksik Heceyi Seç
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {currentPuzzle.options.map((option, idx) => {
              const isChosen = selectedSyllable === option;
              const isCorrectChoice = option === currentPuzzle.missingSyllable && isCompleted;

              let btnStyles = 'bg-slate-50 hover:bg-blue-50/70 border-slate-200 border-b-4 border-b-slate-300 text-slate-800 hover:border-blue-300';
              if (isCorrectChoice) {
                btnStyles = 'bg-green-500 border-green-600 border-b-4 border-b-green-700 text-white ring-4 ring-green-200 scale-105';
              } else if (isChosen && status === 'retry') {
                btnStyles = 'bg-amber-50 border-amber-300 border-b-4 border-b-amber-400 text-amber-950';
              }

              return (
                <button
                  key={`${option}-${idx}`}
                  id={`word-puzzle-opt-${idx}`}
                  onClick={() => handleSelectChoice(option)}
                  className={`h-20 sm:h-24 rounded-2xl border-3 font-display font-black text-3xl sm:text-4xl flex items-center justify-center transition-all transform active:border-b-0 active:translate-y-1 shadow-sm select-none ${btnStyles}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback / Next Action */}
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
              <div>
                <p className="font-display font-black text-lg">
                  {status === 'correct'
                    ? `Harika! "${currentPuzzle.fullWord.toUpperCase()}" kelimesini tamamladın! ⭐`
                    : 'Bir kez daha deneyelim. Eksik parçayı tekrar incele.'}
                </p>
              </div>
            </div>

            {status === 'correct' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakWord}
                  className="p-3 bg-emerald-700 hover:bg-emerald-800 border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1 text-white rounded-2xl shadow-xs"
                  title="Kelimeyi Dinle"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  id="complete-word-next-btn"
                  onClick={handleNext}
                  className="bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-white font-black text-base px-7 py-3 rounded-2xl shadow-sm transition-all whitespace-nowrap"
                >
                  Sonraki Kelime ➔
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
