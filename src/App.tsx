import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ExploreSyllables } from './components/activities/ExploreSyllables';
import { ListenRepeatActivity } from './components/activities/ListenRepeatActivity';
import { FindSyllableActivity } from './components/activities/FindSyllableActivity';
import { CompleteWordActivity } from './components/activities/CompleteWordActivity';
import { SyllableTrainActivity } from './components/activities/SyllableTrainActivity';
import { BadgesAndCertificate } from './components/activities/BadgesAndCertificate';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { ActivityTab, SoundGroup2Letter, StudentStats } from './types';
import { playPop, stopSpeaking } from './utils/audio';

const STORAGE_KEY_STUDENTS = 'hece_dunyasi_students_v1';
const STORAGE_KEY_CURRENT_ID = 'hece_dunyasi_active_student_id_v1';

const INITIAL_STUDENTS: StudentStats[] = [
  {
    id: 'st-1',
    name: 'Ali',
    avatar: '👦',
    stars: 8,
    totalAttempts: 10,
    correctAnswers: 9,
    completedActivities: {
      explore: 6,
      listenRepeat: 4,
      findSyllable: 3,
      completeWord: 2,
      train: 1,
    },
    troubleSyllables: {},
    masteredSyllables: ['ma', 'me', 'ta', 'ok'],
    lastActive: new Date().toISOString(),
  },
  {
    id: 'st-2',
    name: 'Zeynep',
    avatar: '👧',
    stars: 14,
    totalAttempts: 16,
    correctAnswers: 15,
    completedActivities: {
      explore: 8,
      listenRepeat: 6,
      findSyllable: 5,
      completeWord: 4,
      train: 2,
    },
    troubleSyllables: {},
    masteredSyllables: ['ma', 'el', 'ku', 'tü', 'ye'],
    lastActive: new Date().toISOString(),
  },
];

export default function App() {
  const [students, setStudents] = useState<StudentStats[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
      if (savedId && INITIAL_STUDENTS.some((s) => s.id === savedId)) return savedId;
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<ActivityTab>('welcome');
  const [selectedGroup, setSelectedGroup] = useState<SoundGroup2Letter>('HEPSİ');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Save to local storage on student state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_ID, currentStudentId);
    } catch {
      // ignore
    }
  }, [currentStudentId]);

  // Current selected student
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  // Stop active speech when switching tabs
  const handleSelectTab = (tab: ActivityTab) => {
    stopSpeaking();
    setActiveTab(tab);
  };

  const handleEarnStar = () => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === currentStudent.id) {
          return {
            ...st,
            stars: st.stars + 1,
            correctAnswers: (st.correctAnswers || 0) + 1,
            totalAttempts: (st.totalAttempts || 0) + 1,
            lastActive: new Date().toISOString(),
          };
        }
        return st;
      })
    );
  };

  const handleRecordTroubleSyllable = (syllable: string) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === currentStudent.id) {
          const currentCount = st.troubleSyllables?.[syllable] || 0;
          return {
            ...st,
            totalAttempts: (st.totalAttempts || 0) + 1,
            troubleSyllables: {
              ...(st.troubleSyllables || {}),
              [syllable]: currentCount + 1,
            },
            lastActive: new Date().toISOString(),
          };
        }
        return st;
      })
    );
  };

  const handleAddStudent = (name: string, avatar: string) => {
    const newStudent: StudentStats = {
      id: `st-${Date.now()}`,
      name,
      avatar,
      stars: 0,
      totalAttempts: 0,
      correctAnswers: 0,
      completedActivities: {
        explore: 0,
        listenRepeat: 0,
        findSyllable: 0,
        completeWord: 0,
        train: 0,
      },
      troubleSyllables: {},
      masteredSyllables: [],
      lastActive: new Date().toISOString(),
    };

    setStudents((prev) => [...prev, newStudent]);
    setCurrentStudentId(newStudent.id);
  };

  const handleResetStudentStats = (studentId: string) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            stars: 0,
            totalAttempts: 0,
            correctAnswers: 0,
            troubleSyllables: {},
            masteredSyllables: [],
          };
        }
        return st;
      })
    );
  };

  const handleToggleFullscreen = () => {
    playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-slate-800 flex flex-col justify-between">
      
      {/* Top Main Navigation Header */}
      <div>
        <Header
          currentStudent={currentStudent}
          allStudents={students}
          onSelectStudent={(st) => {
            playPop();
            setCurrentStudentId(st.id);
          }}
          selectedGroup={selectedGroup}
          onSelectGroup={(g) => setSelectedGroup(g)}
          isMuted={isMuted}
          onToggleMute={() => {
            playPop();
            if (!isMuted) stopSpeaking();
            setIsMuted(!isMuted);
          }}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenTeacherDashboard={() => {
            playPop();
            setIsTeacherModalOpen(true);
          }}
          onGoHome={() => handleSelectTab('welcome')}
        />

        {/* 6 Tabs Navigator */}
        <div className="pt-2">
          <NavigationTabs
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />
        </div>

        {/* Main Stage Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          {activeTab === 'welcome' && (
            <WelcomeScreen
              student={currentStudent}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
              onSelectTab={handleSelectTab}
              isMuted={isMuted}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreSyllables
              selectedGroup={selectedGroup}
              onEarnStar={handleEarnStar}
              onRecordTroubleSyllable={handleRecordTroubleSyllable}
              isMuted={isMuted}
            />
          )}

          {activeTab === 'listenRepeat' && (
            <ListenRepeatActivity
              selectedGroup={selectedGroup}
              onEarnStar={handleEarnStar}
              onRecordTroubleSyllable={handleRecordTroubleSyllable}
              isMuted={isMuted}
            />
          )}

          {activeTab === 'findSyllable' && (
            <FindSyllableActivity
              selectedGroup={selectedGroup}
              onEarnStar={handleEarnStar}
              onRecordTroubleSyllable={handleRecordTroubleSyllable}
              isMuted={isMuted}
            />
          )}

          {activeTab === 'completeWord' && (
            <CompleteWordActivity
              selectedGroup={selectedGroup}
              onEarnStar={handleEarnStar}
              onRecordTroubleSyllable={handleRecordTroubleSyllable}
              isMuted={isMuted}
            />
          )}

          {activeTab === 'train' && (
            <SyllableTrainActivity
              selectedGroup={selectedGroup}
              onEarnStar={handleEarnStar}
              onRecordTroubleSyllable={handleRecordTroubleSyllable}
              isMuted={isMuted}
            />
          )}

          {activeTab === 'badges' && (
            <BadgesAndCertificate
              student={currentStudent}
              isMuted={isMuted}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t-2 border-blue-100 bg-white py-4 px-4 text-center text-xs font-bold text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 justify-center">
            <span>🌱</span>
            <span>1. Sınıf İlk Okuma-Yazma Etkileşimli Hece Materyali • MEB Müfredatına Uygun</span>
          </p>
          <p className="text-slate-400">
            O - M - U - T - Ü - Y Sesleri ve Heceleri
          </p>
        </div>
      </footer>

      {/* Teacher & Parent Dashboard Modal */}
      <TeacherDashboardModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        currentStudent={currentStudent}
        allStudents={students}
        onSelectStudent={(st) => setCurrentStudentId(st.id)}
        onAddStudent={handleAddStudent}
        onResetStudentStats={handleResetStudentStats}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
      />

    </div>
  );
}
