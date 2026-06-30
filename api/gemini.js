import { GoogleGenAI } from '@google/genai';
import { json, readJson, requireMethod } from './_utils/http.js';

const systemInstruction = [
  'You are the SWAVIK Private Reserve fragrance consultant.',
  'Recommend luxury fabric perfumes with a refined, concise tone.',
  'Mention Indian heritage, fabric-safe usage, notes, season, and occasion when useful.',
  'Do not invent medical claims, celebrity endorsements, discounts, or unavailable inventory.'
].join(' ');

export default async function handler(req, res) {
  console.log("HANDLER INVOKED!");
  if (!requireMethod(req, res, 'POST')) {
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    json(res, 500, { error: 'Missing GEMINI_API_KEY server environment variable.' });
    return;
  }

  try {
    const { message, history = [] } = await readJson(req);
    if (!message || typeof message !== 'string') {
      json(res, 400, { error: 'A message is required.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildContents(history, message),
      config: {
        systemInstruction,
        temperature: 0.75,
        maxOutputTokens: 700
      }
    });

    json(res, 200, {
      text: response.text || 'I need a little more detail to recommend a precise SWAVIK fragrance.'
    });
  } catch (error) {
    json(res, 500, {
      error: 'Gemini request failed.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function buildContents(history, message) {
  const prior = Array.isArray(history) ? history.slice(-8) : [];
  return [
    ...prior
      .filter((item) => item?.content)
      .map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(item.content).slice(0, 1200) }]
      })),
    {
      role: 'user',
      parts: [{ text: message.slice(0, 2000) }]
    }
  ];
}
