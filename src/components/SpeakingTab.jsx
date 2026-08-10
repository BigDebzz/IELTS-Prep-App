import { useState } from 'react';
import { scoreSpeaking } from '../lib/gemini';
import { SPEAKING_STRUCTURE, SPEAKING_TOPICS, SPEAKING_BAND_DESCRIPTORS } from '../data/ieltsContent';
import { supabase } from '../lib/supabase';

export default function SpeakingTab({ user, selectedDay }) {
  const [part, setPart] = useState('part1');
  const [topic, setTopic] = useState(SPEAKING_TOPICS[0]);
  const [question, setQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recording, setRecording] = useState(false);

  const info = SPEAKING_STRUCTURE[part];

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser — type your answer instead.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript + ' ';
      setTranscript(text.trim());
    };
    recognition.onend = () => setRecording(false);
    recognition.start();
    setRecording(true);
  }

  async function handleScore(e) {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const q = question.trim() || `${part} — topic: ${topic}`;
      const data = await scoreSpeaking(part, q, transcript);
      setResult(data);
      await supabase.from('mock_scores').insert({
        user_id: user.id,
        day_number: selectedDay,
        speaking: data.overall,
        test_source: 'AI-scored: Speaking ' + part,
      });
    } catch (err) {
      setError('Scoring failed: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <section style={s.section}>
      <h2 style={s.title}>Speaking Practice</h2>
      <p style={s.hint}>Speak using your browser's voice input (or type) — feedback is scored against real IELTS Speaking descriptors. Pronunciation can't be judged from text, so the AI will say so honestly rather than guess.</p>

      <select style={s.input} value={part} onChange={e => setPart(e.target.value)}>
        <option value="part1">Part 1 — Personal questions</option>
        <option value="part2">Part 2 — Cue card</option>
        <option value="part3">Part 3 — Abstract discussion</option>
      </select>

      <div style={s.ruleBox}>
        <strong>{info.duration}</strong> — {info.style}. {info.tip}
      </div>

      <select style={s.input} value={topic} onChange={e => setTopic(e.target.value)}>
        {SPEAKING_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <input style={s.input} placeholder="Optional: paste the exact question/cue card text" value={question} onChange={e => setQuestion(e.target.value)} />

      <div style={s.recordRow}>
        <button style={s.button} onClick={startVoiceInput} disabled={recording}>{recording ? '🎙 Listening…' : '🎙 Speak your answer'}</button>
        <span style={s.orText}>or type below</span>
      </div>

      <textarea style={s.textarea} rows={6} placeholder="Your answer (spoken or typed) appears here" value={transcript} onChange={e => setTranscript(e.target.value)} />

      <button style={s.button} onClick={handleScore} disabled={loading || !transcript.trim()}>{loading ? 'Scoring…' : 'Get AI band feedback'}</button>

      {error && <p style={s.error}>{error}</p>}

      {result && (
        <div style={s.card}>
          <h3 style={s.overallScore}>Overall estimate: Band {result.overall}</h3>
          <div style={s.criteriaGrid}>
            <div style={s.criterion}><strong>Fluency & Coherence</strong><br />{result.criteria.fluency}</div>
            <div style={s.criterion}><strong>Lexical Resource</strong><br />{result.criteria.lexical}</div>
            <div style={s.criterion}><strong>Grammar</strong><br />{result.criteria.grammar}</div>
            <div style={s.criterion}><strong>Pronunciation</strong><br />{result.criteria.pronunciation}</div>
          </div>
          <p style={s.feedback}>{result.feedback}</p>
        </div>
      )}

      <details style={s.descriptorBox}>
        <summary style={s.descriptorSummary}>Reference: band 7 vs 8 vs 9 (official descriptors)</summary>
        {[9, 8, 7].map(band => (
          <div key={band} style={s.bandBlock}>
            <strong>Band {band}</strong>
            <p style={s.descLine}>Fluency: {SPEAKING_BAND_DESCRIPTORS[band].fluency}</p>
            <p style={s.descLine}>Lexical: {SPEAKING_BAND_DESCRIPTORS[band].lexical}</p>
            <p style={s.descLine}>Grammar: {SPEAKING_BAND_DESCRIPTORS[band].grammar}</p>
            <p style={s.descLine}>Pronunciation: {SPEAKING_BAND_DESCRIPTORS[band].pronunciation}</p>
          </div>
        ))}
      </details>
    </section>
  );
}

const s = {
  section: { background: '#1e293b', borderRadius: 12, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px' },
  hint: { color: '#94a3b8', fontSize: 12, marginBottom: 12, lineHeight: 1.5 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14, marginBottom: 10 },
  ruleBox: { background: '#0f172a', borderRadius: 8, padding: 12, fontSize: 13, color: '#cbd5e1', marginBottom: 12 },
  recordRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  orText: { fontSize: 12, color: '#64748b' },
  textarea: { width: '100%', padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14, resize: 'vertical', marginBottom: 10 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#0f172a', borderRadius: 10, padding: 16, marginTop: 16 },
  overallScore: { fontSize: 20, color: '#4ade80', margin: '0 0 12px' },
  criteriaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 },
  criterion: { fontSize: 12, background: '#1e293b', padding: 10, borderRadius: 8, lineHeight: 1.4 },
  feedback: { fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  descriptorBox: { marginTop: 20, fontSize: 13, color: '#94a3b8' },
  descriptorSummary: { cursor: 'pointer', color: '#a5b4fc', marginBottom: 8 },
  bandBlock: { background: '#0f172a', borderRadius: 8, padding: 12, marginTop: 8 },
  descLine: { fontSize: 12, margin: '4px 0', color: '#cbd5e1' },
};
