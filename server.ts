import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate Daily Quote or Themed Quote
app.post('/api/quote', async (req, res) => {
  try {
    const { theme, mood } = req.body || {};
    const prompt = `Generate a deeply inspiring, profound, and uplifting motivational quote. 
    Theme: ${theme || 'General Life & Purpose'}.
    User current mood/feeling: ${mood || 'Ready to grow'}.
    Return a JSON object with keys: "text" (the quote string), "author" (author name or "Rise & Shine AI"), "theme" (the theme), and "reflection" (a 1-sentence thought prompt for the day).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating quote:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quote' });
  }
});

// Text-to-Speech narration using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const selectedVoice = voiceName || 'Kore';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style: 'Calm, soothing, warm and inspiring motivational speaker',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('No audio returned from TTS model');
    }

    res.json({ audio: base64Audio, mimeType: 'audio/wav' });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({ error: error.message || 'Failed to generate speech' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Static serving for production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
