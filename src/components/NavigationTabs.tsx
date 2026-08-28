import React from 'react';
import { Search, Volume2, Target, Puzzle, Train, Award, Sparkles } from 'lucide-react';
import { ActivityTab } from '../types';
import { playPop } from '../utils/audio';

interface NavigationTabsProps {
  activeTab: ActivityTab;
  onSelectTab: (tab: ActivityTab) => void;
}

export const TABS_CONFIG: {
  id: ActivityTab;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  emoji: string;
  bgActive: string;
  borderColor: string;
  textColor: string;
  desc: string;
}[] = [
  {
    id: 'explore',
    title: '1. Heceleri Keşfet',
    shortTitle: 'Keşfet',
    icon: <Search className="w-5 h-5" />,
    emoji: '🔎',
    bgActive: 'bg-rose-500',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    desc: 'Gör, dinle, tekrar et ve kelimede gör',
  },
  {
    id: 'listenRepeat',
    title: '2. Dinle & Tekrar Et',
    shortTitle: 'Dinle & Oku',
    icon: <Volume2 className="w-5 h-5" />,
    emoji: '🔊',
    bgActive: 'bg-orange-500',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    desc: 'Heceyi doğru seslendir ve tekrar et',
  },
  {
    id: 'findSyllable',
    title: '3. Heceni Bul',
    shortTitle: 'Heceni Bul',
    icon: <Target className="w-5 h-5" />,
    emoji: '🎯',
    bgActive: 'bg-emerald-500',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    desc: 'Hedef heceyi 4 seçenek arasından seç',
  },
  {
    id: 'completeWord',
    title: '4. Kelimeyi Tamamla',
    shortTitle: 'Kelime Bulmaca',
    icon: <Puzzle className="w-5 h-5" />,
    emoji: '🧩',
    bgActive: 'bg-blue-500',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    desc: 'Eksik heceyi bularak kelimeyi kur',
  },
  {
    id: 'train',
    title: '5. Hece Treni',
    shortTitle: 'Hece Treni',
    icon: <Train className="w-5 h-5" />,
    emoji: '🚂',
    bgActive: 'bg-purple-500',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    desc: 'Vagonlardaki heceleri sırayla oku',
  },
  {
    id: 'badges',
    title: '6. Okuma Rozetleri',
    shortTitle: 'Rozetler',
    icon: <Award className="w-5 h-5" />,
    emoji: '🏆',
    bgActive: 'bg-amber-500',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    desc: 'Yıldızlarını gör, okuma belgeni al',
  },
];

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
        {TABS_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                playPop();
                onSelectTab(tab.id);
              }}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl sm:rounded-3xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all snap-start shadow-sm active:border-b-0 active:translate-y-1 ${
                isActive
                  ? 'bg-blue-500 border-b-4 border-blue-700 text-white shadow-md'
                  : 'bg-white hover:bg-blue-50/80 text-blue-900 border-2 border-blue-100 border-b-4 border-b-blue-200'
              }`}
            >
              <span className="text-xl select-none">{tab.emoji}</span>
              <span className="font-display font-bold tracking-tight">{tab.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
