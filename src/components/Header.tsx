import React from 'react';
import { Star, Award, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, User, Settings2 } from 'lucide-react';
import { SoundGroup2Letter, StudentStats } from '../types';
import { SOUND_GROUPS } from '../data/curriculumData';
import { playPop } from '../utils/audio';

interface HeaderProps {
  currentStudent: StudentStats;
  allStudents: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
  selectedGroup: SoundGroup2Letter;
  onSelectGroup: (group: SoundGroup2Letter) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenTeacherDashboard: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStudent,
  allStudents,
  onSelectStudent,
  selectedGroup,
  onSelectGroup,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onOpenTeacherDashboard,
  onGoHome,
}) => {
  const progressPercent = Math.min(100, Math.round((currentStudent.stars / 30) * 100));

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-6 pt-3 sm:pt-4 pb-2 bg-[#F0F9FF]/95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-blue-100">
        
        {/* Brand / Logo */}
        <div className="flex items-center justify-between gap-4">
          <button
            id="app-home-button"
            onClick={() => {
              playPop();
              onGoHome();
            }}
            className="flex items-center gap-3.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-inner shrink-0 group-hover:rotate-6 transition-transform">
              <span className="text-2xl sm:text-3xl select-none">📖</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-blue-800 leading-none">
                  Okuma Yolculuğu
                </h1>
                <span className="bg-blue-100 text-blue-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-200 hidden sm:inline">
                  1. Sınıf
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-500 font-medium mt-0.5">
                2. Grup Heceler: o - m - u - t - ü - y
              </p>
            </div>
          </button>

          {/* Mobile Star Badge */}
          <div className="flex md:hidden items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-2xl border border-yellow-200 text-yellow-700 font-black text-sm">
            <span className="text-lg">⭐</span>
            <span>{currentStudent.stars}</span>
          </div>
        </div>

        {/* Center Progress Bar & Sound Filter */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Visual Progress Bar from Design */}
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
              <span>İlerleme</span>
              <span className="text-blue-600 font-black">%{progressPercent}</span>
            </div>
            <div className="w-40 sm:w-48 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Sound Group Filter Chips */}
          <div className="flex items-center gap-1 bg-blue-50/80 p-1 rounded-2xl border border-blue-200/80">
            <span className="text-xs font-bold text-blue-800 px-2">Ses:</span>
            {SOUND_GROUPS.map((group) => {
              const isSelected = selectedGroup === group.code;
              return (
                <button
                  key={group.code}
                  id={`sound-filter-${group.code}`}
                  onClick={() => {
                    playPop();
                    onSelectGroup(group.code);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  {group.code === 'HEPSİ' ? 'Tümü' : group.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Stats & Action Controls */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100">
          
          {/* Student Selector Pill */}
          <div className="flex items-center bg-slate-50 hover:bg-slate-100 rounded-2xl px-2.5 py-1.5 border border-slate-200 shadow-2xs transition-colors">
            <span className="text-base mr-1.5 select-none">{currentStudent.avatar}</span>
            <select
              id="student-select-dropdown"
              value={currentStudent.id}
              onChange={(e) => {
                const s = allStudents.find((st) => st.id === e.target.value);
                if (s) onSelectStudent(s);
              }}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-700 focus:outline-hidden cursor-pointer"
              title="Öğrenci Değiştir"
            >
              {allStudents.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stars Counter (Desktop) */}
          <div
            id="stars-counter-badge"
            className="hidden md:flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-200 text-yellow-700 shadow-2xs"
            title="Kazanılan Yıldızlar"
          >
            <span className="text-xl">⭐</span>
            <span className="text-lg font-black">{currentStudent.stars}</span>
          </div>

          {/* Audio Mute Toggle */}
          <button
            id="audio-mute-toggle"
            onClick={onToggleMute}
            className={`p-2.5 rounded-2xl border-b-4 transition-all active:border-b-0 active:translate-y-1 ${
              isMuted
                ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            aria-label="Ses Ayarı"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="smartboard-fullscreen-toggle"
            onClick={onToggleFullscreen}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 text-slate-700 transition-all active:border-b-0 active:translate-y-1 hidden sm:flex items-center justify-center"
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Akıllı Tahta / Tam Ekran'}
            aria-label="Tam Ekran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Teacher Dashboard Trigger */}
          <button
            id="teacher-dashboard-button"
            onClick={onOpenTeacherDashboard}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-sm transition-all active:border-b-0 active:translate-y-1"
            title="Öğretmen ve Veli Takip Paneli"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Öğretmen Paneli</span>
          </button>

        </div>

      </div>
    </header>
  );
};
