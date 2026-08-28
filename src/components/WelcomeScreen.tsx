import React from 'react';
import { Sparkles, ArrowRight, Play, Star, BookOpen, Volume2, Target, Puzzle, Train, Award } from 'lucide-react';
import { ActivityTab, SoundGroup2Letter, StudentStats } from '../types';
import { SOUND_GROUPS } from '../data/curriculumData';
import { playPop, speakTurkish } from '../utils/audio';

interface WelcomeScreenProps {
  student: StudentStats;
  selectedGroup: SoundGroup2Letter;
  onSelectGroup: (group: SoundGroup2Letter) => void;
  onSelectTab: (tab: ActivityTab) => void;
  isMuted: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  student,
  selectedGroup,
  onSelectGroup,
  onSelectTab,
  isMuted,
}) => {
  const handleStartExploring = () => {
    playPop();
    if (!isMuted) {
      speakTurkish('Merhaba! Heceleri birlikte keşfetmeye hazır mısın?');
    }
    onSelectTab('explore');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-sky-600 rounded-3xl sm:rounded-[36px] p-6 sm:p-10 text-white shadow-md border-2 border-blue-300/40">
        
        {/* Playful Floating Background Shapes */}
        <div className="absolute top-3 right-6 text-5xl sm:text-7xl opacity-20 select-none pointer-events-none animate-bounce">
          🚂
        </div>
        <div className="absolute bottom-2 right-24 text-4xl sm:text-6xl opacity-15 select-none pointer-events-none">
          ⭐
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold border border-white/30">
            <span>{student.avatar}</span>
            <span>Hoş Geldin, {student.name}!</span>
            <span className="bg-yellow-400 text-yellow-950 text-xs px-2.5 py-0.5 rounded-xl font-black shadow-2xs">
              ⭐ {student.stars} Yıldız
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white drop-shadow-xs">
            Haydi, Heceleri <br className="hidden sm:inline" />
            Birlikte Okuyalım! 🌈
          </h2>

          <p className="text-blue-100 text-sm sm:text-base font-semibold leading-relaxed max-w-xl">
            1. sınıf 2. grup sesleri olan <strong className="text-yellow-300 underline decoration-2">O, M, U, T, Ü, Y</strong> ile heceler kuracağız, dinleyeceğiz, trenlerle yolculuk yapacağız ve yıldızlar toplayacağız!
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            <button
              id="start-learning-primary-btn"
              onClick={handleStartExploring}
              className="inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-600 border-b-6 sm:border-b-8 border-green-700 active:border-b-0 active:translate-y-1.5 text-white font-black text-base sm:text-lg px-7 sm:px-9 py-3.5 sm:py-4 rounded-3xl shadow-lg transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>HEMEN BAŞLA! ➔</span>
            </button>

            <button
              id="welcome-train-quick-btn"
              onClick={() => {
                playPop();
                onSelectTab('train');
              }}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-3xl border-2 border-white/30 backdrop-blur transition-all active:scale-95"
            >
              <span>🚂 Hece Trenine Bin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sound Selection Row */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-blue-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none">🎯</span>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-800">
              Çalışmak İstediğin Sesi Seç:
            </h3>
          </div>
          <span className="text-xs font-bold text-blue-600 hidden sm:inline">
            Seçili: {selectedGroup === 'HEPSİ' ? 'Tüm 2. Grup Sesleri' : `${selectedGroup} Sesi`}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
          {SOUND_GROUPS.map((group) => {
            const isSelected = selectedGroup === group.code;
            return (
              <button
                key={group.code}
                id={`welcome-sound-${group.code}`}
                onClick={() => {
                  playPop();
                  onSelectGroup(group.code);
                }}
                className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border-2 transition-all active:border-b-0 active:translate-y-0.5 ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-600 border-b-4 border-b-blue-700 shadow-md font-black'
                    : 'bg-slate-50 hover:bg-blue-50/70 border-slate-200 border-b-4 border-b-slate-300 text-slate-700'
                }`}
              >
                <span className="font-display font-black text-xl sm:text-2xl">
                  {group.code === 'HEPSİ' ? '★' : group.code}
                </span>
                <span className="text-xs font-bold mt-0.5">
                  {group.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Core Activities Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none">📚</span>
          <h3 className="font-display font-black text-lg sm:text-xl text-slate-800">
            Öğrenme Etkinlikleri
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Heceleri Keşfet */}
          <div
            onClick={() => {
              playPop();
              onSelectTab('explore');
            }}
            className="group cursor-pointer bg-white hover:bg-blue-50/50 border-2 border-blue-100 border-b-4 border-b-blue-200 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500 border-b-4 border-rose-700 text-white flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-105 transition-transform">
                🔎
              </div>
              <h4 className="font-display font-bold text-lg text-slate-800 mb-1">
                1. Heceleri Keşfet
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Gör, sesini dinle, yüksek sesle tekrar et ve elma gibi basit kelimelerde incele.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Gör → Dinle → Oku</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Dinle ve Tekrar Et */}
          <div
            onClick={() => {
              playPop();
              onSelectTab('listenRepeat');
            }}
            className="group cursor-pointer bg-white hover:bg-blue-50/50 border-2 border-blue-100 border-b-4 border-b-blue-200 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500 border-b-4 border-orange-700 text-white flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-105 transition-transform">
                🔊
              </div>
              <h4 className="font-display font-bold text-lg text-slate-800 mb-1">
                2. Dinle & Tekrar Et
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Doğru Türkçe seslendirmeyi dinle, kendi sesinle tekrar et ve okuma pratiği yap.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Sesli Okuma Pratiği</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Heceni Bul */}
          <div
            onClick={() => {
              playPop();
              onSelectTab('findSyllable');
            }}
            className="group cursor-pointer bg-white hover:bg-blue-50/50 border-2 border-blue-100 border-b-4 border-b-blue-200 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 border-b-4 border-emerald-700 text-white flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-105 transition-transform">
                🎯
              </div>
              <h4 className="font-display font-bold text-lg text-slate-800 mb-1">
                3. Heceni Bul
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Sana gösterilen hedef heceyi 4 büyük kart arasından seç, yıldızları kap!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Seç ve Kazan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Kelimeyi Tamamla */}
          <div
            onClick={() => {
              playPop();
              onSelectTab('completeWord');
            }}
            className="group cursor-pointer bg-white hover:bg-blue-50/50 border-2 border-blue-100 border-b-4 border-b-blue-200 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500 border-b-4 border-blue-700 text-white flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-105 transition-transform">
                🧩
              </div>
              <h4 className="font-display font-bold text-lg text-slate-800 mb-1">
                4. Kelimeyi Tamamla
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Eksik heceyi bul, parçaları birleştir ve anlamlı kelimeleri sesli oku.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Hece Bulmacası</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Hece Treni */}
          <div
            onClick={() => {
              playPop();
              onSelectTab('train');
            }}
            className="group cursor-pointer bg-white hover:bg-blue-50/50 border-2 border-blue-100 border-b-4 border-b-blue-200 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500 border-b-4 border-purple-700 text-white flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-105 transition-transform">
                🚂
              </div>
              <h4 className="font-display font-bold text-lg text-slate-800 mb-1">
                5. Hece Treni
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Vagonlardaki heceleri sırayla oku, treni sonraki istasyona neşeyle ulaştır!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Vagonları Oku</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Okuma Rozeti */}
          <div
            onClick={() => {
              playPop();
              onSelectTab('badges');
            }}
            className="group cursor-pointer bg-white hover:bg-blue-50/50 border-2 border-blue-100 border-b-4 border-b-blue-200 rounded-3xl p-5 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 border-b-4 border-yellow-600 text-yellow-950 flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-105 transition-transform">
                🏆
              </div>
              <h4 className="font-display font-bold text-lg text-slate-800 mb-1">
                6. Okuma Rozetleri
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Kazandığın başarı rozetlerini incele ve adının yazılı olduğu Okuma Belgesini al.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Başarı Karnesi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
