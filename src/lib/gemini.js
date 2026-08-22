// src/lib/gemini.js
// Frontend never touches the Gemini key directly — it calls our own /api/gemini
// serverless function, which holds the key server-side.

async function callGemini(mode, payload) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gemini request failed');
  return data;
}

export const scoreWriting = (taskType, prompt, essay) =>
  callGemini('score_writing', { taskType, prompt, essay });

export const scoreTask1 = (taskType, prompt, essay) =>
  callGemini('score_task1', { taskType, prompt, essay });

export const scoreSpeaking = (part, question, transcript) =>
  callGemini('score_speaking', { part, question, transcript });

export const generateListening = (section, topic) =>
  callGemini('generate_listening', { section, topic });

export const generateReading = (questionType, topic, styleReference) =>
  callGemini('generate_reading', { questionType, topic, styleReference });

export const checkVocabSentence = (word, sentence) =>
  callGemini('vocab_sentence_check', { word, sentence });
