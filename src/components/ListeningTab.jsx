import { useState } from 'react';
import { generateListening } from '../lib/gemini';
import { LISTENING_SECTIONS } from '../data/ieltsContent';

export default function ListeningTab() {
  const [section, setSection] = useState(1);
  const [topic, setTopic] = useState('');
  const [practice, setPractice] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);

  const sectionInfo = LISTENING_SECTIONS.find(s2 => s2.section === section);

  async function handleGenerate() {
    setLoading(true); setError(''); setPractice(null); setShowResults(false); setAnswers({});
    try {
      const data = await generateListening(section, topic || 'a general everyday or academic topic');
      setPractice(data);
    } catch (err) {
      setError('Generation failed: ' + err.message);
    }
    setLoading(false);
  }

  function playScript() {
    if (!practice) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(practice.script);
    utter.rate = 0.95;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  function stopPlayback() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  const score = practice ? practice.questions.filter(q => (answers[q.number] || '').trim().toLowerCase() === q.answer.trim().toLowerCase()).length : 0;

  return (
    <section style={s.section}>
      <h2 style={s.title}>Listening Practice</h2>
      <p style={s.hint}>
        Honest note: there's no free, legal way to bake in real IELTS recordings. This uses your browser's built-in
        text-to-speech to read an AI-written script in a real IELTS section format — good for practicing note-taking
        and question types, but the voice is robotic, not a real exam recording.
      </p>

      <div style={s.ruleBox}>
        <strong>Section {section}:</strong> {sectionInfo.style} — {sectionInfo.commonTypes}
      </div>

      <div style={s.form}>
        <select style={s.input} value={section} onChange={e => setSection(Number(e.target.value))}>
          {LISTENING_SECTIONS.map(sec => <option key={sec.section} value={sec.section}>Section {sec.section}</option>)}
        </select>
        <input style={s.input} placeholder="Topic (optional)" value={topic} onChange={e => setTopic(e.target.value)} />
        <button style={s.button} onClick={handleGenerate} disabled={loading}>{loading ? 'Generating…' : 'Generate practice'}</button>
      </div>

      {error && <p style={s.error}>{error}</p>}

      {practice && (
        <div style={s.card}>
          <div style={s.audioControls}>
            <button style={s.button} onClick={speaking ? stopPlayback : playScript}>
              {speaking ? '⏸ Stop' : '▶ Play audio'}
            </button>
            <details style={s.transcriptToggle}>
              <summary>Show transcript (use only after listening once)</summary>
              <p style={s.transcript}>{practice.script}</p>
            </details>
          </div>

          <p style={s.instructions}>{practice.instructions}</p>
          {practice.questions.map(q => (
            <div key={q.number} style={s.qRow}>
              <label style={s.qLabel}>{q.number}. {q.question}</label>
              <input
                style={s.qInput}
                value={answers[q.number] || ''}
                onChange={e => setAnswers({ ...answers, [q.number]: e.target.value })}
                disabled={showResults}
              />
              {showResults && (
                <span style={{ color: (answers[q.number] || '').trim().toLowerCase() === q.answer.trim().toLowerCase() ? '#4ade80' : '#f87171', fontSize: 12 }}>
                  Correct answer: {q.answer}
                </span>
              )}
            </div>
          ))}
          {!showResults ? (
            <button style={s.button} onClick={() => setShowResults(true)}>Check answers</button>
          ) : (
            <p style={s.scoreText}>Score: {score} / {practice.questions.length}</p>
          )}
        </div>
      )}
    </section>
  );
}

const s = {
  section: { background: '#1e293b', borderRadius: 12, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px' },
  hint: { color: '#94a3b8', fontSize: 12, marginBottom: 12, lineHeight: 1.5 },
  ruleBox: { background: '#0f172a', borderRadius: 8, padding: 12, fontSize: 13, color: '#cbd5e1', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#0f172a', borderRadius: 10, padding: 16 },
  audioControls: { marginBottom: 16 },
  transcriptToggle: { marginTop: 10, fontSize: 13, color: '#94a3b8', cursor: 'pointer' },
  transcript: { fontSize: 13, lineHeight: 1.6, marginTop: 8, whiteSpace: 'pre-wrap', color: '#cbd5e1' },
  instructions: { fontSize: 13, color: '#a5b4fc', marginBottom: 12, fontWeight: 600 },
  qRow: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
  qLabel: { fontSize: 14 },
  qInput: { padding: '8px 10px', borderRadius: 6, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14 },
  scoreText: { fontSize: 16, fontWeight: 700, color: '#4ade80' },
};
