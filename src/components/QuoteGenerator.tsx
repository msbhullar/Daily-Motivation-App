import React, { useState } from 'react';
import { Quote } from '../types';
import { Sparkles, Heart, Volume2, Share2, Check, RefreshCw } from 'lucide-react';

interface QuoteGeneratorProps {
  onSaveQuote: (quote: Quote) => void;
  savedIds: string[];
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ onSaveQuote, savedIds }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Inspirational & Uplifting');
  const [generatedQuote, setGeneratedQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const tones = ['Inspirational & Uplifting', 'Stoic & Grounded', 'Poetic & Reflective', 'Fierce & Disciplined', 'Gentle & Comforting'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: `${topic} (Tone: ${tone})`, mood: 'Seeking custom wisdom' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      const newQuote: Quote = {
        id: 'gen-' + Date.now(),
        text: data.text,
        author: data.author || 'Rise & Shine AI',
        theme: topic,
        reflection: data.reflection,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isFavorite: false,
      };

      setGeneratedQuote(newQuote);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate quote');
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async () => {
    if (!generatedQuote || isPlaying) return;
    setIsPlaying(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `"${generatedQuote.text}" — ${generatedQuote.author}`, voiceName: 'Kore' }),
      });
      const data = await res.json();
      if (data.audio) {
        const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: 'audio/wav' });
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const isSaved = generatedQuote ? savedIds.includes(generatedQuote.id) || generatedQuote.isFavorite : false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Custom AI Wisdom
          </span>
          <h1 className="text-3xl font-serif-display font-bold text-stone-900 mt-3">
            What do you need guidance on today?
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Prompt Gemini to craft a personalized motivational quote tailored to your specific challenge, goal, or creative aspiration.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Topic, Challenge, or Goal
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Launching a new startup, overcoming imposter syndrome, finding daily peace..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Desired Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    tone === t
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Wisdom...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Custom Quote</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Result Card */}
      {generatedQuote && (
        <div className="bg-warm-gradient border border-amber-200/80 rounded-3xl p-8 md:p-10 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {generatedQuote.theme}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  generatedQuote.isFavorite = !generatedQuote.isFavorite;
                  onSaveQuote(generatedQuote);
                }}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isSaved ? 'bg-rose-500 text-white' : 'bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          <blockquote className="text-2xl md:text-3xl font-serif-display font-medium text-stone-900 leading-relaxed italic">
            &ldquo;{generatedQuote.text}&rdquo;
          </blockquote>

          <div className="flex items-center justify-between pt-4 border-t border-amber-200/60">
            <p className="font-semibold text-stone-900 text-sm">{generatedQuote.author}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={playTTS}
                disabled={isPlaying}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{isPlaying ? 'Speaking...' : 'Listen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
