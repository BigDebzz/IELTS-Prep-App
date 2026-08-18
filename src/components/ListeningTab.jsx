import { useEffect, useState } from 'react';
import { generateListening } from '../lib/gemini';
import { LISTENING_SECTIONS, LISTENING_GENERAL_TIPS, topicForDay } from '../data/ieltsContent';
import { supabase } from '../lib/supabase';
import SessionHistory, { historyItemStyles as hs } from './SessionHistory';

export default function ListeningTab({ user, selectedDay, onNavigateDay }) {
  const dayTopic = topicForDay(selectedDay);
  const [section, setSection] = useState(1);
  const [practice, setPractice] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const sectionInfo = LISTENING_SECTIONS.find(s2 => s2.section === section);

  // Load any saved session (script + answers) for this day when the day changes.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoaded(false);
      setPractice(null);
      setAnswers({});
      setShowResults(false);
      setError('');
      const { data } = await supabase
        .from('listening_sessions')
        .select('section, practice, answers')
        .eq('user_id', user.id)
        .eq('day_number', selectedDay)
        .maybeSingle();
      if (!cancelled && data) {
        setSection(data.section || 1);
        setPractice(data.practice || null);
        setAnswers(data.answers || {});
      }
      if (!cancelled) setLoaded(true);
    }
    load();
    return () => { cancelled = true; };
  }, [selectedDay, user.id]);

  // Persist the current session (practice content + your answers) so switching
  // tabs or days doesn't lose a generated script or answers you've typed in.
  useEffect(() => {
    if (!loaded || !practice) return;
    const timer = setTimeout(async () => {
      await supabase.from('listening_sessions').upsert(
        { user_id: user.id, day_number: selectedDay, section, practice, answers },
        { onConflict: 'user_id,day_number' }
      );
    }, 800);
    return () => clearTimeout(timer);
  }, [practice, answers, section, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleGenerate() {
    setLoading(true); setError(''); setPractice(null); setShowResults(false); setAnswers({});
    try {
      const data = await generateListening(section, dayTopic);
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

  const score = practice ? practice.questions.filter(q => (answers[q.number] || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase()).length : 0;

  return (
    <section style={s.section}>
      <h2 style={s.title}>Listening Practice — Day {selectedDay}</h2>

      <SessionHistory
        user={user}
        table="listening_sessions"
        label="Listening"
        onSelectDay={onNavigateDay}
        renderItem={(sess) => (
          <>
            <div style={hs.itemTop}>
              <span style={hs.dayTag}>Day {sess.day_number}</span>
              <span style={hs.typeTag}>Section {sess.section}</span>
            </div>
            <p style={hs.preview}>{sess.practice?.instructions || 'Listening practice'}</p>
            <p style={hs.metaLine}>{Object.keys(sess.answers || {}).length} answers given</p>
          </>
        )}
      />
      <p style={s.hint}>
        Today's topic: <strong style={{ color: '#8b8cf8' }}>{dayTopic}</strong>. Honest note: there's no free, legal
        way to bake in real IELTS recordings. This uses your browser's built-in text-to-speech to read an AI-written
        script in a real IELTS section format — good for practicing note-taking and question types, but the voice is
        robotic, not a real exam recording. Your session (script + answers) autosaves.
      </p>

      <div style={s.ruleBox}>
        <strong>Section {section}:</strong> {sectionInfo.style} — {sectionInfo.commonTypes}
      </div>

      {sectionInfo.howTo && (
        <div style={s.howToBox}>
          <strong>How to approach this section:</strong> {sectionInfo.howTo}
        </div>
      )}

      <details style={s.tipsBox}>
        <summary style={s.tipsSummary}>General Listening technique (start here if you're new to IELTS)</summary>
        {LISTENING_GENERAL_TIPS.map((t, i) => (
          <div key={i} style={s.tipItem}>
            <p style={s.tipTitle}>{t.tip}</p>
            <p style={s.tipDetail}>{t.detail}</p>
          </div>
        ))}
      </details>

      <div style={s.form}>
        <select style={s.input} value={section} onChange={e => setSection(Number(e.target.value))}>
          {LISTENING_SECTIONS.map(sec => <option key={sec.section} value={sec.section}>Section {sec.section}</option>)}
        </select>
        <button style={s.button} onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating…' : practice ? 'Regenerate for today' : 'Generate today\'s practice'}
        </button>
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
                <span style={{ color: (answers[q.number] || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase() ? '#4ade80' : '#f87171', fontSize: 12 }}>
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
  section: { background: '#121212', borderRadius: 12, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px' },
  hint: { color: '#a3a3a3', fontSize: 12, marginBottom: 12, lineHeight: 1.5 },
  ruleBox: { background: '#000000', borderRadius: 8, padding: 12, fontSize: 13, color: '#cbd5e1', marginBottom: 16 },
  howToBox: { background: '#000000', borderRadius: 8, padding: 12, fontSize: 12, color: '#cbd5e1', marginBottom: 12, lineHeight: 1.5 },
  tipsBox: { background: '#000000', borderRadius: 8, marginBottom: 16, padding: 12 },
  tipsSummary: { cursor: 'pointer', color: '#8b8cf8', fontSize: 13, fontWeight: 600 },
  tipItem: { marginTop: 10 },
  tipTitle: { fontSize: 13, fontWeight: 700, color: '#f5f5f5', margin: '0 0 3px' },
  tipDetail: { fontSize: 12, color: '#cbd5e1', margin: 0, lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #2a2a2a', background: '#000000', color: '#f5f5f5', fontSize: 14 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#000000', borderRadius: 10, padding: 16 },
  audioControls: { marginBottom: 16 },
  transcriptToggle: { marginTop: 10, fontSize: 13, color: '#a3a3a3', cursor: 'pointer' },
  transcript: { fontSize: 13, lineHeight: 1.6, marginTop: 8, whiteSpace: 'pre-wrap', color: '#cbd5e1' },
  instructions: { fontSize: 13, color: '#a5b4fc', marginBottom: 12, fontWeight: 600 },
  qRow: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
  qLabel: { fontSize: 14 },
  qInput: { padding: '8px 10px', borderRadius: 6, border: '1px solid #2a2a2a', background: '#121212', color: '#f5f5f5', fontSize: 14 },
  scoreText: { fontSize: 16, fontWeight: 700, color: '#4ade80' },
};
