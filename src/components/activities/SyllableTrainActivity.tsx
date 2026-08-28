import React, { useState } from 'react';
import { Train, Volume2, Star, Sparkles, Check, ChevronRight, RotateCcw } from 'lucide-react';
import { TrainTrackItem, SoundGroup2Letter } from '../../types';
import { TRAIN_TRACKS, ENCOURAGING_SUCCESS_MESSAGES } from '../../data/curriculumData';
import { playPop, playSuccessChime, playTrainWhistle, speakTurkish } from '../../utils/audio';
import { MascotGuide } from '../MascotGuide';
import confetti from 'canvas-confetti';

interface SyllableTrainActivityProps {
  selectedGroup: SoundGroup2Letter;
  onEarnStar: () => void;
  onRecordTroubleSyllable: (syllable: string) => void;
  isMuted: boolean;
}

export const SyllableTrainActivity: React.FC<SyllableTrainActivityProps> = ({
  selectedGroup,
  onEarnStar,
  onRecordTroubleSyllable,
  isMuted,
}) => {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [completedCars, setCompletedCars] = useState<number[]>([]);
  const [isStationReached, setIsStationReached] = useState(false);

  const currentTrack: TrainTrackItem = TRAIN_TRACKS[activeTrackIndex] || TRAIN_TRACKS[0];
  const targetSyllable = currentTrack.syllables[currentCarIndex];

  const handleSpeakSyllable = (syl: string) => {
    if (isMuted) return;
    speakTurkish(syl, { rate: 0.75, pitch: 1.15 });
  };

  const handleReadCarriage = (index: number) => {
    if (index !== currentCarIndex || isStationReached) return;
    playPop();

    const syl = currentTrack.syllables[index];
    handleSpeakSyllable(syl);

    const newCompleted = [...completedCars, index];
    setCompletedCars(newCompleted);

    if (newCompleted.length === currentTrack.syllables.length) {
      // Reached station!
      setIsStationReached(true);
      playTrainWhistle();
      setTimeout(() => {
        playSuccessChime();
        onEarnStar();
        try {
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
          });
        } catch {
          // ignore
        }
      }, 500);
    } else {
      setCurrentCarIndex((prev) => prev + 1);
      onEarnStar();
    }
  };

  const handleResetTrack = () => {
    playPop();
    setCurrentCarIndex(0);
    setCompletedCars([]);
    setIsStationReached(false);
  };

  const handleNextTrack = () => {
    playPop();
    setCurrentCarIndex(0);
    setCompletedCars([]);
    setIsStationReached(false);
    setActiveTrackIndex((prev) => (prev + 1) % TRAIN_TRACKS.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <MascotGuide
        isMuted={isMuted}
        message="Hece Trenimiz kalkıyor! 🚂 Vagonlardaki heceleri sırayla oku ve tıkla. Bütün vagonları okuyunca tren istasyona varacak!"
      />

      <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Track Header & Station Picker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500 border-b-4 border-purple-700 text-white flex items-center justify-center text-xl shadow-xs">
              🚂
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-800">
                {currentTrack.title}
              </h3>
              <p className="text-xs font-bold text-purple-700">
                Hedef: {currentTrack.stationName}
              </p>
            </div>
          </div>

          {/* Track Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {TRAIN_TRACKS.map((track, i) => (
              <button
                key={track.id}
                onClick={() => {
                  playPop();
                  setActiveTrackIndex(i);
                  setCurrentCarIndex(0);
                  setCompletedCars([]);
                  setIsStationReached(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:border-b-0 active:translate-y-0.5 ${
                  activeTrackIndex === i
                    ? 'bg-blue-500 border-b-4 border-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 text-slate-700'
                }`}
              >
                Hat {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Train Visual Display with Geometric Balance Styling */}
        <div className="relative bg-linear-to-b from-sky-50 via-blue-50/50 to-white rounded-3xl p-6 sm:p-8 border-2 border-blue-100 overflow-hidden shadow-inner">
          
          {/* Train Locomotive & Carriage Line */}
          <div className="flex items-end justify-start gap-2 sm:gap-3 overflow-x-auto pb-6 pt-2 scrollbar-none">
            
            {/* Locomotive */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-t-3xl bg-red-500 border-b-6 border-red-700 text-white border-2 border-red-400 flex flex-col items-center justify-center shadow-md relative">
                {/* Chimney steam */}
                <div className="absolute -top-3 left-3 text-lg animate-bounce">
                  💨
                </div>
                <span className="text-3xl sm:text-4xl select-none">🚂</span>
                <span className="text-[10px] font-black tracking-widest text-yellow-300 uppercase">
                  Lokomotif
                </span>
              </div>
              {/* Wheels */}
              <div className="flex items-center gap-4 mt-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-yellow-400"></div>
                <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-yellow-400"></div>
              </div>
            </div>

            {/* Syllable Carriage Cars */}
            {currentTrack.syllables.map((syllable, idx) => {
              const isDone = completedCars.includes(idx);
              const isCurrent = currentCarIndex === idx && !isStationReached;
              const isLocked = idx > currentCarIndex;

              const carColors = [
                'bg-yellow-400 border-yellow-600 text-yellow-950',
                'bg-green-400 border-green-600 text-green-950',
                'bg-blue-400 border-blue-600 text-blue-950',
                'bg-purple-400 border-purple-600 text-purple-950',
              ];
              const colorTheme = carColors[idx % carColors.length];

              return (
                <div key={idx} className="shrink-0 flex flex-col items-center">
                  
                  {/* Hitch connector */}
                  <div className="w-4 h-1.5 bg-slate-700 -mb-12 self-start -ml-3"></div>

                  <button
                    id={`train-car-${idx}`}
                    onClick={() => handleReadCarriage(idx)}
                    disabled={isLocked}
                    className={`w-20 sm:w-24 h-20 sm:h-24 rounded-t-2xl font-display font-black text-2xl sm:text-3xl flex flex-col items-center justify-center transition-all transform select-none ${
                      isDone
                        ? 'bg-green-500 border-b-6 border-green-700 text-white shadow-md'
                        : isCurrent
                        ? 'bg-yellow-400 border-b-6 border-yellow-600 text-yellow-950 shadow-lg scale-110 ring-4 ring-blue-300 animate-pulse cursor-pointer'
                        : `${colorTheme} border-b-6 opacity-60 cursor-not-allowed`
                    }`}
                  >
                    <span>{syllable}</span>
                    {isDone && <Check className="w-4 h-4 text-white stroke-[3] mt-0.5" />}
                    {isCurrent && <span className="text-[10px] font-extrabold text-yellow-950 uppercase">Oku!</span>}
                  </button>

                  {/* Carriage Wheels */}
                  <div className="flex items-center gap-6 mt-1.5">
                    <div className={`w-4 h-4 rounded-full border-2 ${isDone ? 'bg-green-800 border-green-300' : 'bg-slate-700 border-slate-400'}`}></div>
                    <div className={`w-4 h-4 rounded-full border-2 ${isDone ? 'bg-green-800 border-green-300' : 'bg-slate-700 border-slate-400'}`}></div>
                  </div>
                </div>
              );
            })}

            {/* Destination Station Stop */}
            <div className="shrink-0 flex flex-col items-center ml-4">
              <div className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-3 flex flex-col items-center justify-center p-2 text-center shadow-md transition-all ${
                isStationReached
                  ? 'bg-yellow-400 border-b-6 border-yellow-600 text-yellow-950 animate-bounce'
                  : 'bg-white/90 border-dashed border-blue-300 text-blue-900'
              }`}>
                <span className="text-2xl select-none">🏁</span>
                <span className="text-[10px] font-black leading-tight">
                  {currentTrack.stationName}
                </span>
              </div>
            </div>

          </div>

          {/* Railway Tracks Ground */}
          <div className="h-3.5 bg-slate-300 rounded-full border-t-2 border-slate-400 mt-2"></div>
        </div>

        {/* Current Carriage Action Banner */}
        {!isStationReached && (
          <div className="bg-blue-50/80 border-2 border-blue-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">👉</span>
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Sıradaki Vagon
                </span>
                <p className="font-display font-black text-2xl text-blue-950">
                  "{targetSyllable?.toUpperCase()}" hecesini sesli oku
                </p>
              </div>
            </div>

            <button
              id="train-read-active-car-btn"
              onClick={() => handleReadCarriage(currentCarIndex)}
              className="bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-white font-black text-base px-7 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>OKUDUM! 🚂</span>
            </button>
          </div>
        )}

        {/* Destination Reached Celebration */}
        {isStationReached && (
          <div className="bg-emerald-100 border-3 border-emerald-400 rounded-3xl p-6 text-center space-y-4 animate-scaleIn">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-emerald-600 animate-spin" />
              <h4 className="font-display font-black text-emerald-950 text-2xl">
                Çuf Çuf! İstasyon Tamamlandı! 🎉
              </h4>
              <Star className="w-7 h-7 fill-amber-400 text-amber-500 animate-bounce" />
            </div>

            <p className="text-sm font-bold text-emerald-900">
              Bütün heceleri harika okudun ve treni durağına ulaştırdın! ⭐
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetTrack}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm px-5 py-2.5 rounded-2xl border-2 border-slate-200 border-b-4 border-b-slate-300 transition-all active:border-b-0 active:translate-y-0.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tekrar Sür</span>
              </button>

              <button
                id="next-train-track-btn"
                onClick={handleNextTrack}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-white font-black text-base px-7 py-3 rounded-2xl shadow-sm transition-all"
              >
                <span>Sonraki İstasyon ➔</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
