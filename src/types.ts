export type SoundGroup2Letter = 'M' | 'O' | 'U' | 'T' | 'Ü' | 'Y' | 'HEPSİ';

export interface SyllableItem {
  id: string;
  syllable: string;
  letterGroup: 'M' | 'O' | 'U' | 'T' | 'Ü' | 'Y';
  type: 'open' | 'closed'; // açık hece (ma) veya kapalı hece (am)
  parts: [string, string] | [string, string, string]; // e.g. ['m', 'a']
  exampleWord: string;
  exampleWordSyllables: string[]; // e.g. ['el', 'ma']
  exampleWordMeaning: string; // Turkish explanation or icon hint
  emoji: string;
  hintSentence: string;
}

export interface WordPuzzleItem {
  id: string;
  fullWord: string;
  displayParts: { text: string; isMissing: boolean }[];
  missingSyllable: string;
  options: string[];
  emoji: string;
  meaning: string;
  letterGroup: 'M' | 'O' | 'U' | 'T' | 'Ü' | 'Y';
}

export interface TrainTrackItem {
  id: string;
  title: string;
  stationName: string;
  syllables: string[];
  themeColor: string;
  letterGroup: 'M' | 'O' | 'U' | 'T' | 'Ü' | 'Y';
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requiredStars: number;
  unlocked: boolean;
}

export interface StudentStats {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  totalAttempts: number;
  correctAnswers: number;
  completedActivities: {
    explore: number;
    listenRepeat: number;
    findSyllable: number;
    completeWord: number;
    train: number;
  };
  troubleSyllables: { [syllable: string]: number }; // count of retry needs
  masteredSyllables: string[];
  lastActive: string;
}

export type ActivityTab =
  | 'welcome'
  | 'explore'
  | 'listenRepeat'
  | 'findSyllable'
  | 'completeWord'
  | 'train'
  | 'badges';
