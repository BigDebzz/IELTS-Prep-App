import { useState } from 'react';
import { scoreWriting } from '../lib/gemini';
import { WRITING_TASK2_TYPES, WRITING_BAND_DESCRIPTORS } from '../data/ieltsContent';
import { supabase } from '../lib/supabase';

export default function WritingTab({ user, selectedDay }) {
  const [taskType, setTaskType] = useState('Task 2 - ' + WRITING_TASK2_TYPES[0].type);
  const [prompt, setPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const essayInfo = WRITING_TASK2_TYPES.find(t => taskType.includes(t.type));

  async function handleScore(e) {
    e.preventDefault();
    if (!prompt.trim() || !essay.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await scoreWriting(taskType, prompt, essay);
      setResult(data);
      await supabase.from('mock_scores').insert({
        user_id: user.id,
        day_number: selectedDay,
        writing: data.overall,
        test_source: 'AI-scored: ' + taskType,
      });
    } catch (err) {
      setError('Scoring failed: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <section style={s.section}>
      <h2 style={s.title}>Writing Practice</h2>
      <p style={s.hint}>You write the essay. Feedback is scored strictly against the real official IELTS band descriptors baked into this app — the AI does not invent its own criteria.</p>

      <select style={s.input} value={taskType} onChange={e => setTaskType(e.target.value)}>
        {WRITING_TASK2_TYPES.map(t => <option key={t.type} value={'Task 2 - ' + t.type}>{'Task 2 - ' + t.type}</option>)}
        <option value="Task 1 - Report">Task 1 - Report (graph/chart/map/process)</option>
      </select>

      {essayInfo && (
        <div style={s.ruleBox}><strong>Structure:</strong> {essayInfo.structure}</div>
      )}

      <form onSubmit={handleScore} style={s.form}>
        <textarea style={s.textarea} rows={2} placeholder="Paste or write the essay prompt/question here" value={prompt} onChange={e => setPrompt(e.target.value)} />
        <textarea style={s.textareaBig} rows={12} placeholder="Write your essay here (aim for 250+ words for Task 2, 150+ for Task 1)" value={essay} onChange={e => setEssay(e.target.value)} />
        <p style={s.wordCount}>{essay.trim().split(/\s+/).filter(Boolean).length} words</p>
        <button style={s.button} type="submit" disabled={loading}>{loading ? 'Scoring…' : 'Get AI band feedback'}</button>
      </form>

      {error && <p style={s.error}>{error}</p>}

      {result && (
        <div style={s.card}>
          <h3 style={s.overallScore}>Overall: Band {result.overall}</h3>
          <div style={s.criteriaGrid}>
            <div style={s.criterion}><strong>Task Response</strong><br />{result.criteria.taskResponse}</div>
            <div style={s.criterion}><strong>Coherence & Cohesion</strong><br />{result.criteria.coherence}</div>
            <div style={s.criterion}><strong>Lexical Resource</strong><br />{result.criteria.lexical}</div>
            <div style={s.criterion}><strong>Grammar</strong><br />{result.criteria.grammar}</div>
          </div>
          <p style={s.feedback}>{result.feedback}</p>
        </div>
      )}

      <details style={s.descriptorBox}>
        <summary style={s.descriptorSummary}>Reference: what separates band 7, 8, and 9 (official descriptors)</summary>
        {[9, 8, 7].map(band => (
          <div key={band} style={s.bandBlock}>
            <strong>Band {band}</strong>
            <p style={s.descLine}>Task Response: {WRITING_BAND_DESCRIPTORS[band].taskResponse}</p>
            <p style={s.descLine}>Coherence: {WRITING_BAND_DESCRIPTORS[band].coherence}</p>
            <p style={s.descLine}>Lexical: {WRITING_BAND_DESCRIPTORS[band].lexical}</p>
            <p style={s.descLine}>Grammar: {WRITING_BAND_DESCRIPTORS[band].grammar}</p>
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
  ruleBox: { background: '#0f172a', borderRadius: 8, padding: 12, fontSize: 13, color: '#cbd5e1', marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  textarea: { padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14, resize: 'vertical' },
  textareaBig: { padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14, resize: 'vertical', lineHeight: 1.5 },
  wordCount: { fontSize: 12, color: '#64748b', margin: 0 },
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
