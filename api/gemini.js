// /api/gemini.js
// This runs on Vercel's server, NOT in the browser — so your API key is never exposed.
// The frontend calls this endpoint; this function calls Google's Gemini API.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server. Add it in Vercel → Settings → Environment Variables.' });
  }

  const { mode, payload } = req.body;

  // Each "mode" builds a specific, constrained prompt. The AI is told exactly what
  // real rubric/content to use — it is not asked to invent IELTS facts from scratch.
  let systemPrompt = '';
  let userContent = '';

  if (mode === 'score_writing') {
    const { taskType, prompt, essay } = payload;
    systemPrompt = `You are an IELTS examiner. Score ONLY using the real official IELTS Writing band descriptors (Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy). Do not invent criteria. Give a band 0-9 (in 0.5 steps) for each of the 4 criteria, an overall band, and 3-5 specific, quoted examples from the essay showing errors or strengths. Be direct and specific — do not give generic praise. Respond in this exact JSON structure: {"criteria": {"taskResponse": 0, "coherence": 0, "lexical": 0, "grammar": 0}, "overall": 0, "feedback": "string with specific quoted examples and fixes"}`;
    userContent = `Task type: ${taskType}\n\nPrompt given to student:\n${prompt}\n\nStudent's essay:\n${essay}`;
  } else if (mode === 'score_speaking') {
    const { part, question, transcript } = payload;
    systemPrompt = `You are an IELTS examiner. Score ONLY using the real official IELTS Speaking band descriptors (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation — note: pronunciation cannot be judged from text, so estimate only from word choice/spelling patterns and say so explicitly). Give a band 0-9 for each criterion you CAN assess from text, an overall estimate, and specific feedback with quoted examples. Respond in this exact JSON structure: {"criteria": {"fluency": 0, "lexical": 0, "grammar": 0, "pronunciation": "not assessable from text"}, "overall": 0, "feedback": "string"}`;
    userContent = `Speaking Part: ${part}\nQuestion: ${question}\n\nStudent's spoken response (transcribed):\n${transcript}`;
  } else if (mode === 'generate_listening') {
    const { section, topic } = payload;
    const sectionMixes = {
      1: 'note/table/form completion (ONE WORD AND/OR A NUMBER) — 10 questions',
      2: 'multiple choice A/B/C for questions 1-5, then map/plan labelling (write letters A-I) for questions 6-10',
      3: 'multiple choice A/B/C for questions 1-5, then flow-chart completion choosing from a box of options (A-H) for questions 6-10',
      4: 'note/summary completion (ONE WORD ONLY) — 10 questions, academic lecture format',
    };
    systemPrompt = `You are creating an IELTS Listening practice item for Section ${section}. The real IELTS Section ${section} uses: ${sectionMixes[section] || sectionMixes[1]}. Write a realistic script (250-400 words) matching this section's real format and difficulty. Then write EXACTLY 10 questions using the MIXED format described above. Include word-limit instructions for each question block and a complete answer key. Respond in this exact JSON structure: {"script": "string, written as spoken dialogue/monologue", "blocks": [{"instructions": "string e.g. Complete the notes. Write NO MORE THAN TWO WORDS.", "questions": [{"number":1,"question":"string","answer":"string"}]}]}`;
    userContent = `Generate a Section ${section} listening practice on the topic: ${topic}`;
  } else if (mode === 'score_task1') {
    const { taskType, prompt, essay } = payload;
    systemPrompt = `You are an IELTS examiner scoring a Writing Task 1 Academic response. Task 1 is scored on: Task Achievement (key features covered + overview present?), Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy. Score strictly using real IELTS band descriptors. Give a band 0-9 in 0.5 steps for each criterion and an overall band. Be specific — quote the student's text. Respond in this exact JSON structure: {"criteria": {"taskAchievement": 0, "coherence": 0, "lexical": 0, "grammar": 0}, "overall": 0, "feedback": "string with specific quoted examples and fixes"}`;
    userContent = `Task 1 type: ${taskType}\n\nPrompt:\n${prompt}\n\nStudent's response:\n${essay}`;
  } else if (mode === 'generate_reading') {
    const { questionType, topic, styleReference } = payload;
    systemPrompt = `You are creating an IELTS Academic Reading practice passage that matches the real style, length, and difficulty of official IELTS materials. Here is a genuine official IELTS passage for style reference — match its register, sentence complexity, paragraph structure, and question-construction pattern closely (but do not copy its content or facts):\n\n---REFERENCE PASSAGE (style guide only)---\n${styleReference || ''}\n---END REFERENCE---\n\nNow write an ORIGINAL 700-900 word academic-style passage in 5 paragraphs on the NEW topic given below, matching the reference's style. Then write 5 questions of the EXACT question type requested, following real IELTS conventions for that type (e.g., for Matching Headings, answers are NOT in text order; for True/False/Not Given, answers follow passage order). Include an answer key. Respond in this exact JSON structure: {"passage": "string with paragraphs separated by \\n\\n, exactly 5 paragraphs", "questionType": "string", "instructions": "string", "questions": [{"number":1,"question":"string","answer":"string"}]}`;
    userContent = `Generate a 5-paragraph Reading passage and ${questionType} questions on the topic: ${topic}`;
  } else if (mode === 'vocab_sentence_check') {
    const { word, sentence } = payload;
    systemPrompt = `You are an English vocabulary tutor. Check if the student used the word correctly in their sentence — check meaning, grammar, and natural collocation. Respond in this exact JSON structure: {"correct": true or false, "feedback": "string, specific and brief"}`;
    userContent = `Word: ${word}\nStudent's sentence: ${sentence}`;
  } else {
    return res.status(400).json({ error: 'Unknown mode: ' + mode });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userContent}` }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'Gemini API error: ' + errText });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'No content returned from Gemini' });
    }

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
