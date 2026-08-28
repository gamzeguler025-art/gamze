import React, { useState } from 'react';
import { Award, Star, Printer, Sparkles, CheckCircle2, Lock, Download, Heart } from 'lucide-react';
import { StudentStats, BadgeItem } from '../../types';
import { BADGES_DATA } from '../../data/curriculumData';
import { playPop, playFanfare } from '../../utils/audio';
import { MascotGuide } from '../MascotGuide';
import confetti from 'canvas-confetti';

interface BadgesAndCertificateProps {
  student: StudentStats;
  isMuted: boolean;
}

export const BadgesAndCertificate: React.FC<BadgesAndCertificateProps> = ({
  student,
  isMuted,
}) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handlePrintCertificate = () => {
    playPop();
    try {
      window.print();
    } catch {
      // ignore
    }
  };

  const handleCelebrationClick = () => {
    playFanfare();
    try {
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6'],
      });
    } catch {
      // ignore
    }
  };

  const todayFormatted = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <MascotGuide
        isMuted={isMuted}
        message={`Tebrikler ${student.name}! ${student.stars} yıldız topladın. Kazandığın rozetleri inceleyebilir ve Okuma Belgeni yazdırabilirsin!`}
      />

      {/* Main Badges Showcase Card */}
      <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Top Summary Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-b-4 border-amber-600 flex items-center justify-center text-amber-950 text-2xl shadow-xs">
              🏆
            </div>
            <div>
              <h3 className="font-display font-black text-2xl text-slate-800">
                {student.name}'in Okuma Rozetleri
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                1. Sınıf 2. Grup Heceler Başarı Karnesi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCelebrationClick}
              className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-sm px-4 py-2.5 rounded-2xl border-2 border-amber-200 border-b-4 border-b-amber-400 active:border-b-0 active:translate-y-1 transition-all shadow-xs"
              title="Kutlama Konfetisi Patlat!"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Kutla! 🎉</span>
            </button>

            <button
              id="print-certificate-btn"
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white font-extrabold text-sm px-5 py-2.5 rounded-2xl shadow-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Belgeyi Yazdır 📜</span>
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = student.stars >= badge.requiredStars || badge.unlocked;
            const progressPercent = Math.min(100, Math.round((student.stars / badge.requiredStars) * 100));

            return (
              <div
                key={badge.id}
                className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-300 border-b-6 border-b-amber-400 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-2xs ${
                      isUnlocked ? 'bg-amber-400 text-amber-950 border-2 border-amber-300' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {badge.icon}
                    </div>

                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-green-100 text-green-900 border border-green-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isUnlocked ? 'Kazanıldı ⭐' : `${badge.requiredStars} Yıldız`}
                    </span>
                  </div>

                  <h4 className="font-display font-black text-lg text-slate-800 mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar if locked */}
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  {isUnlocked ? (
                    <div className="flex items-center gap-1.5 text-xs font-black text-green-800">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Rozet Koleksiyonunda!</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>İlerleme</span>
                        <span>{student.stars} / {badge.requiredStars}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate Display Preview Section */}
        <div className="pt-6">
          <div className="bg-blue-50/60 border-2 border-blue-100 rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <h4 className="font-display font-black text-xl text-slate-900">
              📜 1. Sınıf Başarı Belgesi Önizlemesi
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto">
              Bu belgeyi doğrudan yazdırabilir veya akıllı tahtada tüm sınıfa gururla sergileyebilirsiniz.
            </p>

            {/* Printable Certificate Template */}
            <div
              id="certificate-print-area"
              className="bg-white border-8 border-double border-blue-400 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto shadow-md space-y-6 text-center text-slate-800 my-4"
            >
              <div className="flex justify-center items-center gap-3">
                <span className="text-3xl">⭐</span>
                <span className="font-display font-black text-blue-600 text-sm sm:text-base uppercase tracking-widest">
                  T.C. MİLLİ EĞİTİM BAKANLIĞI OKUMA PROGRAMI
                </span>
                <span className="text-3xl">⭐</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 drop-shadow-xs">
                OKUMA VE HECE BAŞARI BELGESİ
              </h2>

              <p className="text-sm sm:text-base font-semibold text-slate-600">
                Bu belge, 1. sınıf 2. grup sesleri (<strong className="text-slate-800">O, M, U, T, Ü, Y</strong>) başarıyla seslendiren, okuyan ve hece trenini tamamlayan sevgili öğrencimiz
              </p>

              <div className="py-2 border-b-4 border-yellow-400 max-w-xs mx-auto">
                <span className="font-display font-black text-3xl sm:text-4xl text-blue-600">
                  {student.name}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600">
                adına düzenlenmiştir. Gösterdiği üstün çaba, sabır ve başarıdan dolayı tebrik eder, başarılarının devamını dileriz. 🌈
              </p>

              <div className="pt-6 flex items-center justify-between border-t border-slate-200 text-xs sm:text-sm font-bold text-slate-700">
                <div>
                  <p className="text-slate-500 text-xs">Tarih:</p>
                  <p>{todayFormatted}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center text-xl mb-1">
                    🏆
                  </div>
                  <span className="text-[11px] font-black text-yellow-900">Şampiyon Okuyucu</span>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs">Sınıf Öğretmeni:</p>
                  <p className="italic">Gamze Öğretmen ✍️</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handlePrintCertificate}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-white font-black text-base px-8 py-3.5 rounded-2xl shadow-sm transition-all"
              >
                <Printer className="w-5 h-5" />
                <span>Bu Belgeyi Şimdi Yazdır 🖨️</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
