import React, { useState } from 'react';
import { X, User, Plus, Star, AlertTriangle, CheckCircle2, RotateCcw, Award, BookOpen, Monitor, Sparkles } from 'lucide-react';
import { StudentStats, SoundGroup2Letter } from '../types';
import { SOUND_GROUPS, SYLLABLES_DATA } from '../data/curriculumData';
import { playPop, speakTurkish } from '../utils/audio';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentStats;
  allStudents: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
  onAddStudent: (name: string, avatar: string) => void;
  onResetStudentStats: (studentId: string) => void;
  selectedGroup: SoundGroup2Letter;
  onSelectGroup: (group: SoundGroup2Letter) => void;
}

const AVATAR_OPTIONS = ['👦', '👧', '🐰', '🦁', '🦊', '🐼', '🦄', '⭐'];

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  allStudents,
  onSelectStudent,
  onAddStudent,
  onResetStudentStats,
  selectedGroup,
  onSelectGroup,
}) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👦');
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (!isOpen) return null;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    playPop();
    onAddStudent(newStudentName.trim(), selectedAvatar);
    setNewStudentName('');
    setIsAddingNew(false);
  };

  const troubleList: [string, number][] = Object.entries(currentStudent.troubleSyllables || {}).filter(
    (entry): entry is [string, number] => typeof entry[1] === 'number' && entry[1] > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="bg-blue-500 p-5 sm:p-6 text-white flex items-center justify-between shrink-0 border-b-4 border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
              👩‍🏫
            </div>
            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl">
                Öğretmen ve Veli Takip Paneli
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                1. Sınıf 2. Grup Okuma Becerileri Raporu ve Öğrenci Yönetimi
              </p>
            </div>
          </div>

          <button
            id="close-teacher-modal-btn"
            onClick={() => {
              playPop();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Section 1: Student Switcher & New Student */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Kayıtlı Öğrenciler</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Raporunu incelemek istediğiniz öğrenciyi seçin
                </p>
              </div>

              {!isAddingNew && (
                <button
                  id="add-student-toggle-btn"
                  onClick={() => {
                    playPop();
                    setIsAddingNew(true);
                  }}
                  className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Öğrenci Ekle</span>
                </button>
              )}
            </div>

            {/* Students List Chips */}
            <div className="flex flex-wrap gap-2">
              {allStudents.map((st) => {
                const isSelected = st.id === currentStudent.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      playPop();
                      onSelectStudent(st);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all active:border-b-0 active:translate-y-0.5 ${
                      isSelected
                        ? 'bg-blue-500 border-b-4 border-blue-700 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300'
                    }`}
                  >
                    <span>{st.avatar}</span>
                    <span>{st.name}</span>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-blue-700 text-yellow-200' : 'bg-slate-100 text-slate-600 font-extrabold'}`}>
                      ⭐ {st.stars}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Add New Student Form */}
            {isAddingNew && (
              <form onSubmit={handleCreateStudent} className="bg-white border-2 border-blue-200 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <span className="text-xs font-bold text-blue-900 block">
                  Yeni Öğrenci Bilgileri:
                </span>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex gap-1 overflow-x-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
                          selectedAvatar === av ? 'bg-blue-500 text-white' : 'hover:bg-slate-200'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>

                  <input
                    id="new-student-name-input"
                    type="text"
                    placeholder="Öğrenci Adı (Örn: Zeynep)"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                    autoFocus
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Section 2: Student Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-amber-50 border-2 border-amber-200 border-b-4 border-b-amber-300 rounded-2xl p-4 text-center">
              <span className="text-2xl">⭐</span>
              <div className="font-display font-black text-2xl text-amber-900 mt-1">
                {currentStudent.stars}
              </div>
              <p className="text-xs font-bold text-amber-700">Kazanılan Yıldız</p>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 border-b-4 border-b-emerald-300 rounded-2xl p-4 text-center">
              <span className="text-2xl">✅</span>
              <div className="font-display font-black text-2xl text-emerald-900 mt-1">
                {currentStudent.correctAnswers || currentStudent.stars}
              </div>
              <p className="text-xs font-bold text-emerald-700">Doğru Okuma</p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 border-b-4 border-b-blue-300 rounded-2xl p-4 text-center">
              <span className="text-2xl">🧩</span>
              <div className="font-display font-black text-2xl text-blue-900 mt-1">
                {troubleList.length === 0 ? 'Mükemmel' : `${troubleList.length} Hece`}
              </div>
              <p className="text-xs font-bold text-blue-700">Tekrar İhtiyacı</p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 border-b-4 border-b-purple-300 rounded-2xl p-4 text-center">
              <span className="text-2xl">🏆</span>
              <div className="font-display font-black text-2xl text-purple-900 mt-1">
                %{Math.min(100, Math.round((currentStudent.stars / 35) * 100))}
              </div>
              <p className="text-xs font-bold text-purple-700">Grup İlerlemesi</p>
            </div>

          </div>

          {/* Section 3: Tekrar Edilmesi Gereken Heceler (CRITICAL FOR TEACHER) */}
          <div className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h4 className="font-display font-black text-base text-rose-950">
                  Tekrar Edilmesi Gereken Heceler
                </h4>
              </div>
              <span className="text-xs font-bold text-rose-700">
                {currentStudent.name} için Özel Destek
              </span>
            </div>

            {troubleList.length === 0 ? (
              <div className="bg-white/80 rounded-2xl p-4 text-center border border-rose-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700">
                  Harika! {currentStudent.name} şu ana kadar çalıştığı tüm heceleri başarıyla kavradı.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600">
                  Aşağıdaki hecelerde ek deneme yapıldı. Bu heceler üzerinde sesli okuma tekrarları önerilir:
                </p>
                <div className="flex flex-wrap gap-2">
                  {troubleList.map(([syl, count]) => (
                    <div
                      key={syl}
                      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-rose-300 shadow-2xs"
                    >
                      <button
                        onClick={() => speakTurkish(syl)}
                        className="font-display font-black text-base text-rose-700 hover:underline"
                        title="Hecenin Sesini Dinlet"
                      >
                        {syl} 🔊
                      </button>
                      <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-md">
                        {count} tekrar
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Akıllı Tahta & Pedagojik Kullanım Notları */}
          <div className="bg-blue-50/60 border-2 border-blue-100 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              <h4 className="font-display font-bold text-base text-slate-900">
                Akıllı Tahta ve Sınıf İçi Uygulama Önerileri
              </h4>
            </div>

            <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside font-medium">
              <li><strong>Büyük Butonlar:</strong> Uygulama dokunmatik akıllı tahta ve tabletlerde çocukların rahatça dokunabilmesi için özel olarak boyutlandırılmıştır.</li>
              <li><strong>Ses/Hece Sıralaması:</strong> MEB 1. Sınıf müfredatına uygun olarak 1. grup (E, L, A, K, İ, N) ve 2. grup (O, M, U, T, Ü, Y) seslerinin birleşimlerini kullanır.</li>
              <li><strong>Pozitif Pekiştirme:</strong> Hatalı denemelerde kırmızı çarpı veya utandırıcı sesler kullanılmaz; "Bir kez daha deneyelim 🌱" anlayışıyla büyüme odaklı yaklaşım sergilenir.</li>
            </ul>
          </div>

          {/* Reset Stats Option */}
          <div className="pt-2 flex justify-between items-center border-t border-slate-200">
            <button
              onClick={() => {
                if (window.confirm(`${currentStudent.name} isimli öğrencinin yıldız ve ilerlemesini sıfırlamak istediğinize emin misiniz?`)) {
                  onResetStudentStats(currentStudent.id);
                }
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentStudent.name}'in Verilerini Sıfırla</span>
            </button>

            <button
              onClick={() => {
                playPop();
                onClose();
              }}
              className="bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all"
            >
              Tamam
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
