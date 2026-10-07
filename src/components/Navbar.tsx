import React from 'react';
import { Sun, Sparkles, BookOpen, Heart, Flame } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  streakCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, streakCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setCurrentTab('today')}
          className="flex items-center gap-2 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500/25 transition-colors">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight font-serif-display text-stone-900 block leading-none">
              Rise & Shine
            </span>
            <span className="text-[11px] font-medium text-stone-500 tracking-wider uppercase">
              Daily Motivation
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => setCurrentTab('today')}
            className={`hover:text-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'today' ? 'text-amber-700 font-semibold' : ''
            }`}
          >
            <Sun className="w-4 h-4" />
            Today
          </button>
          <button
            onClick={() => setCurrentTab('generator')}
            className={`hover:text-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'generator' ? 'text-amber-700 font-semibold' : ''
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Generator
          </button>
          <button
            onClick={() => setCurrentTab('journal')}
            className={`hover:text-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'journal' ? 'text-amber-700 font-semibold' : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Zen Journal
          </button>
          <button
            onClick={() => setCurrentTab('favorites')}
            className={`hover:text-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'favorites' ? 'text-amber-700 font-semibold' : ''
            }`}
          >
            <Heart className="w-4 h-4" />
            Saved Quotes
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions / streak badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-full text-amber-800 text-xs font-semibold shadow-xs">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>{streakCount} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-3 border-t border-stone-200/60 text-xs font-medium text-stone-600">
        <button
          onClick={() => setCurrentTab('today')}
          className={`flex flex-col items-center gap-1 py-1 px-3 ${currentTab === 'today' ? 'text-amber-700 font-bold' : ''}`}
        >
          <Sun className="w-4 h-4" />
          Today
        </button>
        <button
          onClick={() => setCurrentTab('generator')}
          className={`flex flex-col items-center gap-1 py-1 px-3 ${currentTab === 'generator' ? 'text-amber-700 font-bold' : ''}`}
        >
          <Sparkles className="w-4 h-4" />
          Generator
        </button>
        <button
          onClick={() => setCurrentTab('journal')}
          className={`flex flex-col items-center gap-1 py-1 px-3 ${currentTab === 'journal' ? 'text-amber-700 font-bold' : ''}`}
        >
          <BookOpen className="w-4 h-4" />
          Journal
        </button>
        <button
          onClick={() => setCurrentTab('favorites')}
          className={`flex flex-col items-center gap-1 py-1 px-3 ${currentTab === 'favorites' ? 'text-amber-700 font-bold' : ''}`}
        >
          <Heart className="w-4 h-4" />
          Saved
        </button>
      </div>
    </header>
  );
};
