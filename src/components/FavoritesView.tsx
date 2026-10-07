import React, { useState } from 'react';
import { Quote } from '../types';
import { Heart, Trash2, Download, Upload, Copy, Check, Volume2 } from 'lucide-react';

interface FavoritesViewProps {
  favorites: Quote[];
  onRemoveFavorite: (id: string) => void;
  onImportFavorites: (quotes: Quote[]) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onRemoveFavorite,
  onImportFavorites,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (quote: Quote) => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rise_and_shine_favorites_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportFavorites(parsed);
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  const playTTS = async (quote: Quote) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `"${quote.text}" — ${quote.author}`, voiceName: 'Kore' }),
      });
      const data = await res.json();
      if (data.audio) {
        const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: 'audio/wav' });
        const audio = new Audio(URL.createObjectURL(audioBlob));
        await audio.play();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Export/Import Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-stone-200/80 rounded-3xl p-8 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Curated Wisdom
          </span>
          <h1 className="text-3xl font-serif-display font-bold text-stone-900 mt-3">
            Saved Favorite Quotes ({favorites.length})
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Your personal treasury of inspiration. Export or backup anytime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportJSON}
            disabled={favorites.length === 0}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Export JSON</span>
          </button>

          <label className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="bg-white border border-stone-200/80 rounded-3xl p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-serif-display font-semibold text-stone-800">No saved quotes yet</h3>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Click the heart icon on any daily quote or AI-generated quote to save it to your permanent collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((quote) => (
            <div
              key={quote.id}
              className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {quote.theme}
                  </span>
                  <span className="text-xs text-stone-400">{quote.date}</span>
                </div>

                <blockquote className="text-xl font-serif-display font-medium text-stone-900 leading-snug italic">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-700">{quote.author}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => playTTS(quote)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="Listen aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(quote)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="Copy quote"
                  >
                    {copiedId === quote.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(quote.id)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
