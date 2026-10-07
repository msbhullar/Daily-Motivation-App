# Daily Motivation App: Rise & Shine

A production-grade daily motivation web application featuring AI-powered custom quote generation, neural text-to-speech audio narration using Gemini 3.8 Flash Lite TTS, daily streak tracking, favorite quote curation, and a serene "Warm Sunrise & Zen Gold" aesthetic.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions and aesthetic directions were confirmed in Phase 1 and will be built:
> - **Visual Theme & Aesthetic**: Warm Sunrise & Zen Gold (amber/gold gradients, soft travertine/cream backgrounds, serif typography, calm and uplifting atmosphere).
> - **Core Feature Set**: AI Daily Quotes generation with speech synthesis (Text-to-Speech using `gemini-3.8-flash-lite-tts`), daily streak tracker, mood selector, and saved favorites library.
> - **Data Persistence**: Local storage with export/import options for favorite quotes and reflection notes.

---

## 1. Overview & Core Concept

- **What It Does**: Provides users with daily personalized motivational wisdom, reflections, and audio narration powered by Gemini AI, alongside habit streaks and saved favorite quotes.
- **Target Audience / Persona**: Individuals seeking daily inspiration, mental clarity, positive reinforcement, and mindfulness.
- **Key Value**: Instant, tailored motivation delivered with high-fidelity speech and an immaculate editorial zen aesthetic.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Daily Awakening Dashboard**: Landing view featuring today's AI motivational quote, background atmospheric audio/visual zen elements, and quick mood check-in.
  2. **Voice Narration (TTS)**: Listen to the daily quote read aloud with natural voice inflection (`gemini-3.8-flash-lite-tts`).
  3. **Custom Quote Generator**: Prompt the AI for specific motivational themes (e.g., career focus, overcoming adversity, inner peace).
  4. **Streak & Journal Tracker**: Track consecutive days of reflection and write daily gratitude notes.
  5. **Favorites & Export**: Browse saved favorite quotes and export them as JSON/text.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Serene, uplifting, warm editorial zen.
  - *Color Palette*: Warm cream background (`#FAF7F2`), amber/gold accents (`#D97706`, `#B45309`), dark espresso text (`#292524`), soft amber glow cards.
  - *Typography*: High-character serif display font (`Cormorant Garamond` or `Fraunces`) paired with a refined clean sans (`Plus Jakarta Sans`).
- **Interactive Feedback**: Smooth transitions, toast notifications for favorites saved, and audio play/pause loading indicators.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini API Proxy**
  - *Chosen Approach*: Express backend endpoints (`/api/quote`, `/api/tts`) routing requests to `@google/genai`.
  - *Why*: Secure API key handling, compliance with architectural guidelines, and robust error management.
- **Decision 2: Local Storage Persistence**
  - *Chosen Approach*: Client-side `localStorage` with JSON export/import.
  - *Why*: Fast, zero-friction persistence for favorites and streaks without requiring external database setups.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                        Browser                         │
│  (React UI + Tailwind CSS + Web Audio / Audio Player)  │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
   GET /api/quote                 POST /api/tts
               │                          │
┌──────────────▼──────────────────────────▼──────────────┐
│                    Express Backend                     │
│               (@google/genai SDK v2.4.0)               │
│      - gemini-3.8-flash (Quote Generation)             │
│      - gemini-3.8-flash-lite-tts (Speech Synthesis)    │
└────────────────────────────────────────────────────────┘
```

- **Data Models**:
  - `Quote`: `{ id, text, author, theme, date, isFavorite }`
  - `JournalEntry`: `{ id, date, mood, note }`
  - `UserStats`: `{ streakCount, lastActiveDate, totalRead }`
- **Component Hierarchy**:
  - `App.tsx`: Main container with navigation tabs (Today, Generator, Journal, Favorites).
  - `Navbar.tsx`: Clean 3-zone top bar contract.
  - `DailyView.tsx`: Hero quote card, TTS audio player button, mood check-in, streak counter.
  - `QuoteGenerator.tsx`: Custom AI quote generator by theme.
  - `JournalView.tsx`: Daily reflection and gratitude journal.
  - `FavoritesView.tsx`: Saved quotes with copy & export capabilities.
