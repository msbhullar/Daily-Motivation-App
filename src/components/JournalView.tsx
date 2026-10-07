import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { BookOpen, Calendar, Plus, Smile, Heart, CheckCircle2 } from 'lucide-react';

interface JournalViewProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: JournalEntry) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ entries, onSaveEntry }) => {
  const [mood, setMood] = useState('Peaceful');
  const [note, setNote] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const moods = ['Peaceful', 'Energized', 'Thoughtful', 'Grateful', 'Optimistic', 'Resilient'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    const newEntry: JournalEntry = {
      id: 'journal-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'short' }),
      mood,
      note,
      gratitude: [gratitude1, gratitude2, gratitude3].filter((g) => g.trim().length > 0),
    };

    onSaveEntry(newEntry);
    setNote('');
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Journal Entry Form */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Zen Reflection
          </span>
          <h1 className="text-3xl font-serif-display font-bold text-stone-900 mt-3">
            Daily Gratitude & Journal
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Center your mind, log your intentions, and record what you are grateful for today.
          </p>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Journal entry saved successfully! Keep shining.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Select Current State
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    mood === m
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Three Things You Are Grateful For
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                placeholder="1. e.g. Morning sunlight and quiet tea..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                placeholder="2. e.g. Supportive colleagues and mentors..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                placeholder="3. e.g. Progress on my personal goals..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Today's Reflection & Intentions
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="What insights or breakthroughs did you experience today?"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Reflection Entry</span>
          </button>
        </form>
      </div>

      {/* Past Entries List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">Previous Journal Entries</h3>
        {entries.length === 0 ? (
          <div className="bg-white border border-stone-200/80 rounded-2xl p-8 text-center text-stone-500 text-sm">
            No journal entries yet. Record your first reflection above!
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                      {entry.mood}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {entry.date}
                    </span>
                  </div>
                </div>

                <p className="text-stone-800 text-sm leading-relaxed font-serif-display text-base">
                  &ldquo;{entry.note}&rdquo;
                </p>

                {entry.gratitude.length > 0 && (
                  <div className="bg-stone-50 rounded-xl p-4 space-y-1.5 border border-stone-200/60">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Gratitudes</span>
                    <ul className="list-disc list-inside text-xs text-stone-700 space-y-1">
                      {entry.gratitude.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
