export interface Quote {
  id: string;
  text: string;
  author: string;
  theme: string;
  reflection?: string;
  date: string;
  isFavorite: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  note: string;
  gratitude: string[];
}

export interface UserStats {
  streakCount: number;
  lastActiveDate: string;
  totalReflections: number;
}
