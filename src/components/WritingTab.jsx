import { useCallback, useEffect, useState } from 'react';
import { scoreWriting, scoreTask1 } from '../lib/gemini';
import { WRITING_BAND_DESCRIPTORS, WRITING_TASK2_TYPES, writingPromptForDay, task1ForDay } from '../data/ieltsContent';
import { supabase } from '../lib/supabase';
import SessionHistory, { historyItemStyles as hs } from './SessionHistory';
import { useTimer, TimerBar } from '../lib/useTimer';

export default function WritingTab({ user, selectedDay, onNavigateDay }) {
  const [activeTask, setActiveTask] = useState('task2'); // 'task1' | 'task2'

  const daily2 = writingPromptForDay(selectedDay);
  const daily1 = task1ForDay(selectedDay);

  // Task 2 state
  const [essay2, setEssay2] = useState('');
  const [result2, setResult2] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [saving2, setSaving2] = useState(false);
  const [loaded2, setLoaded2] = useState(false);

  // Task 1 state
  const [essay1, setEssay1] = useState('');
  const [result1, setResult1] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [saving1, setSaving1] = useState(false);
  const [loaded1, setLoaded1] = useState(false);

  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(true);
  const guide2 = WRITING_TASK2_TYPES.find(t => t.type === daily2.type);

  // Timers
  const handleTask2Expire = useCallback(() => { if (essay2.trim()) handleScore2(); }, [essay2]); // eslint-disable-line react-hooks/exhaustive-deps
  const handleTask1Expire = useCallback(() => { if (essay1.trim()) handleScore1(); }, [essay1]); // eslint-disable-line react-hooks/exhaustive-deps
  const timer2 = useTimer(40 * 60, { onExpire: handleTask2Expire });
  const timer1 = useTimer(20 * 60, { onExpire: handleTask1Expire });

  // Load saved Task 2 session
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoaded2(false); setEssay2(''); setResult2(null); setError('');
      timer2.reset();
      const { data } = await supabase.from('writing_sessions').select('essay, result').eq('user_id', user.id).eq('day_number', selectedDay).maybeSingle();
      if (!cancelled && data) { setEssay2(data.essay || ''); setResult2(data.result || null); }
      if (!cancelled) setLoaded2(true);
    }
    load();
    return () => { cancelled = true; };
  }, [selectedDay, user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load saved Task 1 session (uses day_number + 1000 as a unique offset to avoid conflict)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoaded1(false); setEssay1(''); setResult1(null);
      timer1.reset();
      const { data } = await supabase.from('writing_sessions').select('essay, result').eq('user_id', user.id).eq('day_number', selectedDay + 1000).maybeSingle();
      if (!cancelled && data) { setEssay1(data.essay || ''); setResult1(data.result || null); }
      if (!cancelled) setLoaded1(true);
    }
    load();
    return () => { cancelled = true; };
  }, [selectedDay, user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave Task 2
  useEffect(() => {
    if (!loaded2 || !essay2.trim()) return;
    const t = setTimeout(async () => { setSaving2(true); await supabase.from('writing_sessions').upsert({ user_id: user.id, day_number: selectedDay, task_type: daily2.type, prompt: daily2.prompt, essay: essay2, result: result2 }, { onConflict: 'user_id,day_number' }); setSaving2(false); }, 1000);
    return () => clearTimeout(t);
  }, [essay2, loaded2]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave Task 1
  useEffect(() => {
    if (!loaded1 || !essay1.trim()) return;
    const t = setTimeout(async () => { setSaving1(true); await supabase.from('writing_sessions').upsert({ user_id: user.id, day_number: selectedDay + 1000, task_type: daily1.type, prompt: daily1.prompt, essay: essay1, result: result1 }, { onConflict: 'user_id,day_number' }); setSaving1(false); }, 1000);
    return () => clearTimeout(t);
  }, [essay1, loaded1]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleScore2(fromTimer = false) {
    const text = essay2.trim();
    if (!text) return;
    setLoading2(true); setError(''); setResult2(null);
    await supabase.from('writing_sessions').upsert({ user_id: user.id, day_number: selectedDay, task_type: daily2.type, prompt: daily2.prompt, essay: essay2, result: null }, { onConflict: 'user_id,day_number' });
    try {
      const data = await scoreWriting(daily2.type, daily2.prompt, text);
      setResult2(data);
      await supabase.from('writing_sessions').upsert({ user_id: user.id, day_number: selectedDay, task_type: daily2.type, prompt: daily2.prompt, essay: text, result: data }, { onConflict: 'user_id,day_number' });
      await supabase.from('mock_scores').insert({ user_id: user.id, day_number: selectedDay, writing: data.overall, test_source: 'AI-scored: ' + daily2.type });
      timer2.stop();
    } catch (err) { setError('Scoring failed: ' + err.message); }
    setLoading2(false);
  }

  async function handleScore1(fromTimer = false) {
    const text = essay1.trim();
    if (!text) return;
    setLoading1(true); setError(''); setResult1(null);
    await supabase.from('writing_sessions').upsert({ user_id: user.id, day_number: selectedDay + 1000, task_type: daily1.type, prompt: daily1.prompt, essay: essay1, result: null }, { onConflict: 'user_id,day_number' });
    try {
      const data = await scoreTask1(daily1.type, daily1.prompt, text);
      setResult1(data);
      await supabase.from('writing_sessions').upsert({ user_id: user.id, day_number: selectedDay + 1000, task_type: daily1.type, prompt: daily1.prompt, essay: text, result: data }, { onConflict: 'user_id,day_number' });
      timer1.stop();
    } catch (err) { setError('Scoring failed: ' + err.message); }
    setLoading1(false);
  }

  const isTask2 = activeTask === 'task2';
  const timer = isTask2 ? timer2 : timer1;
  const timerLabel = isTask2 ? 'Task 2 — 40 minutes' : 'Task 1 — 20 minutes';

  return (
    <section style={s.section}>
      <h2 style={s.title}>Writing Practice — Day {selectedDay}</h2>

      <SessionHistory user={user} table="writing_sessions" label="Writing" onSelectDay={onNavigateDay}
        renderItem={(sess) => (<>
          <div style={hs.itemTop}><span style={hs.dayTag}>Day {sess.day_number > 1000 ? sess.day_number - 1000 : sess.day_number}</span><span style={hs.typeTag}>{sess.task_type}</span>{sess.result?.overall != null && <span style={hs.scoreTag}>Band {sess.result.overall}</span>}</div>
          <p style={hs.preview}>{sess.prompt}</p>
          <p style={hs.metaLine}>{(sess.essay || '').trim().split(/\s+/).filter(Boolean).length} words</p>
        </>)} />

      <div style={s.taskToggle}>
        <button style={{ ...s.taskBtn, ...(isTask2 ? s.taskBtnActive : {}) }} onClick={() => setActiveTask('task2')}>Task 2 Essay (40 min)</button>
        <button style={{ ...s.taskBtn, ...(!isTask2 ? s.taskBtnActive : {}) }} onClick={() => setActiveTask('task1')}>Task 1 Visual (20 min)</button>
      </div>

      {/* TimerBar rendered per-task below, not here */}

      {isTask2 ? (
        <>
          <div style={s.promptBox}><strong>{daily2.type}</strong><p style={s.promptText}>{daily2.prompt}</p></div>
          <div style={s.guideBox}>
            <button style={s.guideToggle} onClick={() => setShowGuide(!showGuide)}>{showGuide ? '▾' : '▸'} How to structure this essay (read first if you're new)</button>
            {showGuide && guide2 && (
              <div style={s.guideContent}>
                {guide2.howTo.map((step, i) => (<div key={i} style={s.guideStep}><p style={s.guideStepTitle}>{i + 1}. {step.part}</p><p style={s.guideStepText}>{step.guidance}</p></div>))}
                {guide2.example && <div style={s.guideExample}><strong>Example:</strong> {guide2.example}</div>}
              </div>
            )}
          </div>
          <TimerBar timer={timer2} label="Task 2 — 40 minutes" onStart={() => timer2.start()} />
          <textarea style={s.textareaBig} rows={12} placeholder="Write your Task 2 essay here (250+ words)" value={essay2} onChange={e => setEssay2(e.target.value)} disabled={timer2.expired} />
          <div style={s.metaRow}>
            <p style={s.wordCount}>{essay2.trim().split(/\s+/).filter(Boolean).length} / 250+ words</p>
            <p style={s.saveStatus}>{saving2 ? 'Saving…' : loaded2 ? 'Saved' : ''}</p>
          </div>
          {(timer2.running || timer2.expired) && !result2 && (
            <button style={s.button} onClick={() => handleScore2()} disabled={loading2 || !essay2.trim()}>{loading2 ? 'Scoring…' : 'Submit for feedback'}</button>
          )}
          {result2 && <ResultCard result={result2} criteriaKeys={['taskResponse', 'coherence', 'lexical', 'grammar']} criteriaLabels={['Task Response', 'Coherence', 'Lexical', 'Grammar']} />}
        </>
      ) : (
        <>
          <div style={s.promptBox}>
            <strong>{daily1.type}</strong>
            <p style={s.promptText}>{daily1.prompt}</p>
            <p style={s.task1Note}>(Note: In the real exam you would see the actual diagram/map/chart here. Describe it as if you are looking at one showing the topic above.)</p>
          </div>
          <div style={s.guideBox}>
            <button style={s.guideToggle} onClick={() => setShowGuide(!showGuide)}>{showGuide ? '▾' : '▸'} How to approach Task 1: {daily1.type}</button>
            {showGuide && <p style={s.guideText}>{daily1.howTo}</p>}
          </div>
          <TimerBar timer={timer1} label="Task 1 — 20 minutes" onStart={() => timer1.start()} />
          <textarea style={s.textareaBig} rows={8} placeholder="Write your Task 1 response here (150+ words)" value={essay1} onChange={e => setEssay1(e.target.value)} disabled={timer1.expired} />
          <div style={s.metaRow}>
            <p style={s.wordCount}>{essay1.trim().split(/\s+/).filter(Boolean).length} / 150+ words</p>
            <p style={s.saveStatus}>{saving1 ? 'Saving…' : loaded1 ? 'Saved' : ''}</p>
          </div>
          {(timer1.running || timer1.expired) && !result1 && (
            <button style={s.button} onClick={() => handleScore1()} disabled={loading1 || !essay1.trim()}>{loading1 ? 'Scoring…' : 'Submit for feedback'}</button>
          )}
          {result1 && <ResultCard result={result1} criteriaKeys={['taskAchievement', 'coherence', 'lexical', 'grammar']} criteriaLabels={['Task Achievement', 'Coherence', 'Lexical', 'Grammar']} />}
        </>
      )}

      {error && <p style={s.error}>{error}</p>}

      <details style={s.descriptorBox}>
        <summary style={s.descriptorSummary}>Reference: official band descriptors 7 / 8 / 9</summary>
        {[9, 8, 7].map(band => (<div key={band} style={s.bandBlock}><strong>Band {band}</strong><p style={s.descLine}>Task Response: {WRITING_BAND_DESCRIPTORS[band].taskResponse}</p><p style={s.descLine}>Coherence: {WRITING_BAND_DESCRIPTORS[band].coherence}</p><p style={s.descLine}>Lexical: {WRITING_BAND_DESCRIPTORS[band].lexical}</p><p style={s.descLine}>Grammar: {WRITING_BAND_DESCRIPTORS[band].grammar}</p></div>))}
      </details>
    </section>
  );
}

function ResultCard({ result, criteriaKeys, criteriaLabels }) {
  return (
    <div style={s.card}>
      <h3 style={s.overallScore}>Overall: Band {result.overall}</h3>
      <p style={s.resultHint}>Scored against official IELTS band descriptors. Read the specific feedback to know exactly what to fix.</p>
      <div style={s.criteriaGrid}>
        {criteriaKeys.map((k, i) => (<div key={k} style={s.criterion}><strong>{criteriaLabels[i]}</strong><br />{result.criteria[k]}</div>))}
      </div>
      <p style={s.feedback}>{result.feedback}</p>
    </div>
  );
}

const s = {
  section: { background: '#121212', borderRadius: 16, padding: 20 },
  title: { fontSize: 18, margin: '0 0 12px' },
  taskToggle: { display: 'flex', gap: 8, marginBottom: 16 },
  taskBtn: { flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid #2a2a2a', background: 'none', color: '#a3a3a3', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  taskBtnActive: { background: '#8b8cf8', border: 'none', color: '#fff' },
  startBtn: { width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#4ade80', color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
  promptBox: { background: '#000000', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 13, color: '#a5b4fc' },
  promptText: { color: '#f5f5f5', fontSize: 15, marginTop: 8, lineHeight: 1.5 },
  task1Note: { color: '#a3a3a3', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  guideBox: { background: '#000000', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  guideToggle: { width: '100%', textAlign: 'left', padding: 14, background: 'none', border: 'none', color: '#8b8cf8', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  guideContent: { padding: '0 14px 14px' },
  guideText: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, padding: '0 14px 14px', margin: 0 },
  guideStep: { marginBottom: 12 },
  guideStepTitle: { fontSize: 13, fontWeight: 700, color: '#f5f5f5', margin: '0 0 4px' },
  guideStepText: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: 0 },
  guideExample: { fontSize: 12, color: '#a3a3a3', fontStyle: 'italic', marginTop: 10, paddingTop: 10, borderTop: '1px solid #2a2a2a', lineHeight: 1.5 },
  textareaBig: { width: '100%', padding: 12, borderRadius: 8, border: '1px solid #2a2a2a', background: '#000000', color: '#f5f5f5', fontSize: 14, resize: 'vertical', lineHeight: 1.5 },
  metaRow: { display: 'flex', justifyContent: 'space-between', margin: '6px 0 10px' },
  wordCount: { fontSize: 12, color: '#64748b', margin: 0 },
  saveStatus: { fontSize: 12, color: '#4ade80', margin: 0 },
  button: { width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13, marginTop: 8 },
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
