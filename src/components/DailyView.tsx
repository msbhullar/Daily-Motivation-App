import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { Volume2, VolumeX, Heart, RefreshCw, Share2, Sparkles, Check, ChevronRight, Bookmark } from 'lucide-react';

interface DailyViewProps {
  currentQuote: Quote | null;
  onRefreshQuote: (theme?: string, mood?: string) => void;
  onToggleFavorite: (quote: Quote) => void;
  isFavorite: boolean;
  isLoading: boolean;
}

export const DailyView: React.FC<DailyViewProps> = ({
  currentQuote,
  onRefreshQuote,
  onToggleFavorite,
  isFavorite,
  isLoading,
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('Ready to grow');
  const [selectedTheme, setSelectedTheme] = useState<string>('Inner Peace & Clarity');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [audioError, setAudioError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const moods = ['Energized', 'Seeking Calm', 'Focused', 'Grateful', 'Ready to Grow'];
  const themes = ['Inner Peace & Clarity', 'Career & Ambition', 'Resilience & Grit', 'Mindfulness & Presence', 'Self-Compassion'];

  const playTTS = async () => {
    if (!currentQuote || isPlayingAudio) return;
    setIsPlayingAudio(true);
    setAudioError(null);

    try {
      const textToRead = `"${currentQuote.text}" — ${currentQuote.author}`;
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToRead, voiceName: selectedVoice }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'TTS failed');

      if (data.audio) {
        const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          setAudioError('Playback failed');
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } else {
        throw new Error('No audio data received');
      }
    } catch (err: any) {
      console.error(err);
      setIsPlayingAudio(false);
      setAudioError(err.message || 'Speech generation failed');
    }
  };

  const copyToClipboard = () => {
    if (!currentQuote) return;
    navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome & Mood Picker */}
      <div className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif-display font-bold text-stone-900">
              Good day, seeker of wisdom.
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              How is your spirit feeling today? Select your mood to tailor your reflection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Voice:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg text-xs py-1.5 px-3 text-stone-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="Kore">Kore (Warm)</option>
              <option value="Puck">Puck (Energetic)</option>
              <option value="Fenrir">Fenrir (Deep)</option>
              <option value="Zephyr">Zephyr (Serene)</option>
              <option value="Charon">Charon (Authoritative)</option>
            </select>
          </div>
        </div>

        {/* Mood Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSelectedMood(m);
                onRefreshQuote(selectedTheme, m);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedMood === m
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Quote Card */}
      <div className="relative overflow-hidden bg-warm-gradient border border-amber-200/80 rounded-3xl p-8 md:p-12 shadow-md transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
            <p className="text-stone-600 text-sm font-medium">Channeling daily wisdom from Gemini...</p>
          </div>
        ) : currentQuote ? (
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                {currentQuote.theme}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(currentQuote)}
                  className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white/80 text-stone-700 hover:bg-white'
                  }`}
                  title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2.5 rounded-full bg-white/80 text-stone-700 hover:bg-white transition-colors cursor-pointer"
                  title="Copy quote"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <blockquote className="text-2xl md:text-4xl font-serif-display font-medium text-stone-900 leading-relaxed italic max-w-3xl">
              &ldquo;{currentQuote.text}&rdquo;
            </blockquote>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-amber-200/60">
              <div>
                <p className="font-semibold text-stone-900 text-base">{currentQuote.author}</p>
                <p className="text-xs text-stone-500">{currentQuote.date}</p>
              </div>

              {/* TTS Audio Player button */}
              <div className="flex items-center gap-3">
                {audioError && <span className="text-xs text-rose-600 font-medium">{audioError}</span>}
                <button
                  onClick={playTTS}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isPlayingAudio ? (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Speaking...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>Listen Aloud</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onRefreshQuote(selectedTheme, selectedMood)}
                  className="flex items-center gap-1.5 bg-white/80 hover:bg-white text-stone-800 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-stone-200/60 shadow-xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>New Quote</span>
                </button>
              </div>
            </div>

            {/* Daily Reflection Prompt */}
            {currentQuote.reflection && (
              <div className="bg-white/60 backdrop-blur-xs rounded-2xl p-5 border border-amber-200/60 mt-6 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Daily Reflection Prompt</span>
                </div>
                <p className="text-stone-800 text-sm italic font-serif-display">
                  &ldquo;{currentQuote.reflection}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Theme Selector Strip */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">Explore Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {themes.map((th) => (
            <button
              key={th}
              onClick={() => {
                setSelectedTheme(th);
                onRefreshQuote(th, selectedMood);
              }}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedTheme === th
                  ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/80'
              }`}
            >
              <span className="text-xs font-medium block leading-snug">{th}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
