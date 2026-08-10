import { useState } from 'react';
import { generateReading } from '../lib/gemini';
import { READING_QUESTION_TYPES } from '../data/ieltsContent';

export default function ReadingTab() {
  const [questionType, setQuestionType] = useState(READING_QUESTION_TYPES[0].type);
  const [topic, setTopic] = useState('');
  const [practice, setPractice] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  const typeInfo = READING_QUESTION_TYPES.find(t => t.type === questionType);

  async function handleGenerate() {
    setLoading(true); setError(''); setPractice(null); setShowResults(false); setAnswers({});
    try {
      const data = await generateReading(questionType, topic || 'a general academic topic');
      setPractice(data);
    } catch (err) {
      setError('Generation failed: ' + err.message);
    }
    setLoading(false);
  }

  const score = practice ? practice.questions.filter(q => (answers[q.number] || '').trim().toLowerCase() === q.answer.trim().toLowerCase()).length : 0;

  return (
    <section style={s.section}>
      <h2 style={s.title}>Reading Practice</h2>
      <p style={s.hint}>Real question-type rules baked in below. AI generates a fresh passage each time — treat it as practice technique, not authentic Cambridge material.</p>

      <div style={s.ruleBox}>
        <strong>{typeInfo.type}</strong> — {typeInfo.note} <em>({typeInfo.order})</em>
      </div>

      <div style={s.form}>
        <select style={s.input} value={questionType} onChange={e => setQuestionType(e.target.value)}>
          {READING_QUESTION_TYPES.map(t => <option key={t.type} value={t.type}>{t.type}</option>)}
        </select>
        <input style={s.input} placeholder="Topic (optional, e.g. climate, urbanization)" value={topic} onChange={e => setTopic(e.target.value)} />
        <button style={s.button} onClick={handleGenerate} disabled={loading}>{loading ? 'Generating…' : 'Generate practice'}</button>
      </div>

      {error && <p style={s.error}>{error}</p>}

      {practice && (
        <div style={s.card}>
          <p style={s.passage}>{practice.passage}</p>
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
  hint: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },
  ruleBox: { background: '#0f172a', borderRadius: 8, padding: 12, fontSize: 13, color: '#cbd5e1', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#0f172a', borderRadius: 10, padding: 16 },
  passage: { fontSize: 14, lineHeight: 1.6, marginBottom: 12, whiteSpace: 'pre-wrap' },
  instructions: { fontSize: 13, color: '#a5b4fc', marginBottom: 12, fontWeight: 600 },
  qRow: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
  qLabel: { fontSize: 14 },
  qInput: { padding: '8px 10px', borderRadius: 6, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14 },
  scoreText: { fontSize: 16, fontWeight: 700, color: '#4ade80' },
};
