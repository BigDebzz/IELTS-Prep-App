import { useEffect, useState } from 'react';
import { scoreWriting } from '../lib/gemini';
import { WRITING_BAND_DESCRIPTORS, WRITING_TASK2_TYPES, writingPromptForDay } from '../data/ieltsContent';
import { supabase } from '../lib/supabase';
import SessionHistory, { historyItemStyles as hs } from './SessionHistory';

export default function WritingTab({ user, selectedDay, onNavigateDay }) {
  const daily = writingPromptForDay(selectedDay);
  const guide = WRITING_TASK2_TYPES.find(t => t.type === daily.type);
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoaded(false);
      setEssay('');
      setResult(null);
      setError('');
      const { data } = await supabase
        .from('writing_sessions')
        .select('essay, result')
        .eq('user_id', user.id)
        .eq('day_number', selectedDay)
        .maybeSingle();
      if (!cancelled && data) {
        setEssay(data.essay || '');
        setResult(data.result || null);
      }
      if (!cancelled) setLoaded(true);
    }
    load();
    return () => { cancelled = true; };
  }, [selectedDay, user.id]);

  useEffect(() => {
    if (!loaded) return;
    if (!essay.trim()) return; // Never save an empty essay — prevents phantom 0-word history entries
    const timer = setTimeout(async () => {
      setSaving(true);
      await supabase.from('writing_sessions').upsert(
        { user_id: user.id, day_number: selectedDay, task_type: daily.type, prompt: daily.prompt, essay, result },
        { onConflict: 'user_id,day_number' }
      );
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [essay, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleScore(e) {
    e.preventDefault();
    if (!essay.trim()) return;
    setLoading(true); setError(''); setResult(null);

    // Save the essay immediately on submit — before the API call —
    // so it's never lost even if scoring fails or you switch tabs quickly.
    await supabase.from('writing_sessions').upsert(
      { user_id: user.id, day_number: selectedDay, task_type: daily.type, prompt: daily.prompt, essay, result: null },
      { onConflict: 'user_id,day_number' }
    );

    try {
      const data = await scoreWriting(daily.type, daily.prompt, essay);
      setResult(data);
      await supabase.from('writing_sessions').upsert(
        { user_id: user.id, day_number: selectedDay, task_type: daily.type, prompt: daily.prompt, essay, result: data },
        { onConflict: 'user_id,day_number' }
      );
      await supabase.from('mock_scores').insert({
        user_id: user.id,
        day_number: selectedDay,
        writing: data.overall,
        test_source: 'AI-scored: ' + daily.type,
      });
    } catch (err) {
      setError('Scoring failed: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <section style={s.section}>
      <h2 style={s.title}>Writing Practice — Day {selectedDay}</h2>

      <SessionHistory
        user={user}
        table="writing_sessions"
        label="Writing"
        onSelectDay={onNavigateDay}
        renderItem={(sess) => (
          <>
            <div style={hs.itemTop}>
              <span style={hs.dayTag}>Day {sess.day_number}</span>
              <span style={hs.typeTag}>{sess.task_type}</span>
              {sess.result?.overall != null && <span style={hs.scoreTag}>Band {sess.result.overall}</span>}
            </div>
            <p style={hs.preview}>{sess.prompt}</p>
            <p style={hs.metaLine}>{(sess.essay || '').trim().split(/\s+/).filter(Boolean).length} words</p>
          </>
        )}
      />

      <p style={s.hint}>
        Today's prompt is a real IELTS Task 2 question type: <strong>{daily.type}</strong>. If this is new to you,
        read the guide below before writing — it walks through exactly what each paragraph should do.
      </p>

      <div style={s.promptBox}>
        <strong>{daily.type}</strong>
        <p style={s.promptText}>{daily.prompt}</p>
      </div>

      <div style={s.guideBox}>
        <button style={s.guideToggle} onClick={() => setShowGuide(!showGuide)}>
          {showGuide ? '▾' : '▸'} How to structure this essay type (start here if you're new to IELTS)
        </button>
        {showGuide && guide && (
          <div style={s.guideContent}>
            {guide.howTo.map((step, i) => (
              <div key={i} style={s.guideStep}>
                <p style={s.guideStepTitle}>{i + 1}. {step.part}</p>
                <p style={s.guideStepText}>{step.guidance}</p>
              </div>
            ))}
            {guide.example && (
              <div style={s.guideExample}>
                <strong>Example:</strong> {guide.example}
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleScore} style={s.form}>
        <textarea
          style={s.textareaBig}
          rows={12}
          placeholder="Write your essay here (aim for 250+ words). Follow the guide above — one paragraph per step."
          value={essay}
          onChange={e => setEssay(e.target.value)}
        />
        <div style={s.metaRow}>
          <p style={s.wordCount}>{essay.trim().split(/\s+/).filter(Boolean).length} words</p>
          <p style={s.saveStatus}>{saving ? 'Saving…' : loaded ? 'Saved' : ''}</p>
        </div>
        <button style={s.button} type="submit" disabled={loading}>{loading ? 'Scoring…' : 'Get AI band feedback'}</button>
      </form>

      {error && <p style={s.error}>{error}</p>}

      {result && (
        <div style={s.card}>
          <h3 style={s.overallScore}>Overall: Band {result.overall}</h3>
          <p style={s.resultHint}>This score reflects how close your essay is to the official band descriptors below — not just whether the AI liked it. Read the specific feedback to see exactly what to fix next time.</p>
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
  section: { background: '#121212', borderRadius: 12, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px' },
  hint: { color: '#a3a3a3', fontSize: 12, marginBottom: 12, lineHeight: 1.5 },
  promptBox: { background: '#000000', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 13, color: '#a5b4fc' },
  promptText: { color: '#f5f5f5', fontSize: 15, marginTop: 8, lineHeight: 1.5 },
  guideBox: { background: '#000000', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  guideToggle: { width: '100%', textAlign: 'left', padding: 14, background: 'none', border: 'none', color: '#8b8cf8', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  guideContent: { padding: '0 14px 14px' },
  guideStep: { marginBottom: 12 },
  guideStepTitle: { fontSize: 13, fontWeight: 700, color: '#f5f5f5', margin: '0 0 4px' },
  guideStepText: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: 0 },
  guideExample: { fontSize: 12, color: '#a3a3a3', fontStyle: 'italic', marginTop: 10, paddingTop: 10, borderTop: '1px solid #2a2a2a', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  textareaBig: { padding: 12, borderRadius: 8, border: '1px solid #2a2a2a', background: '#000000', color: '#f5f5f5', fontSize: 14, resize: 'vertical', lineHeight: 1.5 },
  metaRow: { display: 'flex', justifyContent: 'space-between' },
  wordCount: { fontSize: 12, color: '#64748b', margin: 0 },
  saveStatus: { fontSize: 12, color: '#4ade80', margin: 0 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#000000', borderRadius: 10, padding: 16, marginTop: 16 },
  overallScore: { fontSize: 20, color: '#4ade80', margin: '0 0 8px' },
  resultHint: { fontSize: 12, color: '#a3a3a3', marginBottom: 12, lineHeight: 1.5 },
  criteriaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 },
  criterion: { fontSize: 12, background: '#121212', padding: 10, borderRadius: 8, lineHeight: 1.4 },
  feedback: { fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  descriptorBox: { marginTop: 20, fontSize: 13, color: '#a3a3a3' },
  descriptorSummary: { cursor: 'pointer', color: '#a5b4fc', marginBottom: 8 },
  bandBlock: { background: '#000000', borderRadius: 8, padding: 12, marginTop: 8 },
  descLine: { fontSize: 12, margin: '4px 0', color: '#cbd5e1' },
};
