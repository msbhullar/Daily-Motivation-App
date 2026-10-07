import React, { useState, useEffect } from 'react';
import { Quote, JournalEntry } from './types';
import { Navbar } from './components/Navbar';
import { DailyView } from './components/DailyView';
import { QuoteGenerator } from './components/QuoteGenerator';
import { JournalView } from './components/JournalView';
import { FavoritesView } from './components/FavoritesView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('today');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>({
    id: 'default-1',
    text: 'The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one.',
    author: 'Mark Twain',
    theme: 'Action & Momentum',
    reflection: 'What is one small step you can take right now toward your most important goal?',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isFavorite: false,
  });
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem('rise_shine_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('rise_shine_journals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const savedStreak = localStorage.getItem('rise_shine_streak');
      const lastActive = localStorage.getItem('rise_shine_last_active');
      const today = new Date().toDateString();

      if (!savedStreak) return 1;
      if (lastActive === today) return parseInt(savedStreak, 10);

      // check if last active was yesterday
      const lastDate = new Date(lastActive || '');
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        const nextStreak = parseInt(savedStreak, 10) + 1;
        localStorage.setItem('rise_shine_streak', nextStreak.toString());
        localStorage.setItem('rise_shine_last_active', today);
        return nextStreak;
      } else if (diffDays > 1) {
        localStorage.setItem('rise_shine_streak', '1');
        localStorage.setItem('rise_shine_last_active', today);
        return 1;
      }
      return parseInt(savedStreak, 10);
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    localStorage.setItem('rise_shine_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('rise_shine_journals', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Fetch AI quote
  const fetchQuote = async (theme?: string, mood?: string) => {
    setIsLoadingQuote(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: theme || 'Inner Peace & Clarity', mood: mood || 'Ready to grow' }),
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setCurrentQuote({
          id: 'quote-' + Date.now(),
          text: data.text,
          author: data.author || 'Rise & Shine AI',
          theme: data.theme || theme || 'Mindfulness',
          reflection: data.reflection,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isFavorite: false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch quote:', err);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleToggleFavorite = (quote: Quote) => {
    const exists = favorites.some((f) => f.id === quote.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== quote.id));
    } else {
      setFavorites([...favorites, { ...quote, isFavorite: true }]);
    }
  };

  const handleSaveCustomQuote = (quote: Quote) => {
    const exists = favorites.some((f) => f.id === quote.id);
    if (!exists) {
      setFavorites([...favorites, quote]);
    } else {
      setFavorites(favorites.filter((f) => f.id !== quote.id));
    }
  };

  const isCurrentFavorite = currentQuote ? favorites.some((f) => f.id === currentQuote.id) : false;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col selection:bg-amber-200 selection:text-amber-900">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} streakCount={streakCount} />

      <main className="flex-1">
        {currentTab === 'today' && (
          <DailyView
            currentQuote={currentQuote}
            onRefreshQuote={fetchQuote}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isCurrentFavorite}
            isLoading={isLoadingQuote}
          />
        )}

        {currentTab === 'generator' && (
          <QuoteGenerator onSaveQuote={handleSaveCustomQuote} savedIds={favorites.map((f) => f.id)} />
        )}

        {currentTab === 'journal' && (
          <JournalView
            entries={journalEntries}
            onSaveEntry={(entry) => setJournalEntries([entry, ...journalEntries])}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onRemoveFavorite={(id) => setFavorites(favorites.filter((f) => f.id !== id))}
            onImportFavorites={(imported) => setFavorites([...favorites, ...imported])}
          />
        )}
      </main>

      <footer className="border-t border-stone-200/60 py-6 px-6 text-center text-xs text-stone-500 bg-white/40">
        <p>Rise & Shine · Your daily sanctuary for AI-powered wisdom, mindfulness, and personal growth.</p>
      </footer>
    </div>
  );
}
