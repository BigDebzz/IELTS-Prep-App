import { useEffect, useRef, useState } from 'react';
import { scoreSpeaking } from '../lib/gemini';
import { SPEAKING_STRUCTURE, SPEAKING_TOPICS, SPEAKING_BAND_DESCRIPTORS } from '../data/ieltsContent';
import { supabase } from '../lib/supabase';
import SessionHistory, { historyItemStyles as hs } from './SessionHistory';

export default function SpeakingTab({ user, selectedDay, onNavigateDay }) {
  const [part, setPart] = useState('part1');
  const [topic, setTopic] = useState(SPEAKING_TOPICS[0]);
  const [question, setQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [recording, setRecording] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const recognitionRef = useRef(null);
  const manualStopRef = useRef(false);

  const info = SPEAKING_STRUCTURE[part];

  // Load any saved session for this day when the day changes.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoaded(false);
      setTranscript(''); setResult(null); setError(''); setQuestion('');
      const { data } = await supabase
        .from('speaking_sessions')
        .select('part, question, transcript, result')
        .eq('user_id', user.id)
        .eq('day_number', selectedDay)
        .maybeSingle();
      if (!cancelled && data) {
        setPart(data.part || 'part1');
        setQuestion(data.question || '');
        setTranscript(data.transcript || '');
        setResult(data.result || null);
      }
      if (!cancelled) setLoaded(true);
    }
    load();
    return () => { cancelled = true; };
  }, [selectedDay, user.id]);

  // Autosave transcript as you speak/type/edit, same pattern as Writing.
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      await supabase.from('speaking_sessions').upsert(
        { user_id: user.id, day_number: selectedDay, part, question, transcript, result },
        { onConflict: 'user_id,day_number' }
      );
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [transcript, part, question, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser — type your answer instead.');
      return;
    }
    setError('');
    manualStopRef.current = false;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    // interim results let you SEE live what it's hearing, so a mishear (e.g. "dongle" for
    // "dung") is visible immediately instead of discovered after you submit.
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += text + ' ';
        else interimChunk += text;
      }
      if (finalChunk) setTranscript(prev => (prev ? prev + ' ' : '') + finalChunk.trim());
      setInterim(interimChunk);
    };

    // Most browsers auto-stop after a few seconds of silence (which is why pausing
    // for a comma used to cut you off). Auto-restart unless YOU pressed stop.
    recognition.onend = () => {
      if (!manualStopRef.current) {
        try { recognition.start(); } catch (e) { /* already running */ }
      } else {
        setRecording(false);
        setInterim('');
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return; // expected during pauses, ignore
      setError('Voice input error: ' + event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }

  function stopVoiceInput() {
    manualStopRef.current = true;
    recognitionRef.current?.stop();
  }

  async function handleScore(e) {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const q = question.trim() || `${part} — topic: ${topic}`;
      const data = await scoreSpeaking(part, q, transcript);
      setResult(data);
      await supabase.from('speaking_sessions').upsert(
        { user_id: user.id, day_number: selectedDay, part, question: q, transcript, result: data },
        { onConflict: 'user_id,day_number' }
      );
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
      <h2 style={s.title}>Speaking Practice — Day {selectedDay}</h2>

      <SessionHistory
        user={user}
        table="speaking_sessions"
        label="Speaking"
        onSelectDay={onNavigateDay}
        renderItem={(sess) => (
          <>
            <div style={hs.itemTop}>
              <span style={hs.dayTag}>Day {sess.day_number}</span>
              <span style={hs.typeTag}>{sess.part}</span>
              {sess.result?.overall != null && <span style={hs.scoreTag}>Band {sess.result.overall}</span>}
            </div>
            <p style={hs.preview}>{sess.question || sess.transcript}</p>
            <p style={hs.metaLine}>{(sess.transcript || '').trim().split(/\s+/).filter(Boolean).length} words</p>
          </>
        )}
      />

      <p style={s.hint}>Speak using your browser's voice input (or type) — feedback is scored against real IELTS Speaking descriptors. Pronunciation can't be judged from text, so the AI will say so honestly rather than guess.</p>

      <select style={s.input} value={part} onChange={e => setPart(e.target.value)}>
        <option value="part1">Part 1 — Personal questions</option>
        <option value="part2">Part 2 — Cue card</option>
        <option value="part3">Part 3 — Abstract discussion</option>
      </select>

      <div style={s.ruleBox}>
        <strong>{info.duration}</strong> — {info.style}. {info.tip}
      </div>

      <div style={s.guideBox}>
        <p style={s.guideTitle}>How to answer well (start here if you're new to IELTS)</p>
        <p style={s.guideText}>{info.howTo}</p>
        {info.example && <p style={s.guideExample}><strong>Example:</strong> {info.example}</p>}
      </div>

      <select style={s.input} value={topic} onChange={e => setTopic(e.target.value)}>
        {SPEAKING_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <input style={s.input} placeholder="Optional: paste the exact question/cue card text" value={question} onChange={e => setQuestion(e.target.value)} />

      <div style={s.recordRow}>
        <button style={s.button} onClick={recording ? stopVoiceInput : startVoiceInput}>
          {recording ? '⏹ Stop recording' : '🎙 Speak your answer'}
        </button>
        <span style={s.orText}>or type below</span>
      </div>

      {recording && (
        <p style={s.interimHint}>
          Listening — pausing for commas is fine now, it won't cut off. Live: <em>{interim || '…'}</em>
        </p>
      )}

      <textarea style={s.textarea} rows={6} placeholder="Your answer (spoken or typed) appears here" value={transcript} onChange={e => setTranscript(e.target.value)} />
      <p style={s.hint}>If you spot a mishear (e.g. it wrote "dongle" instead of "dung"), just edit the text box directly — the transcript is fully editable before you submit.</p>

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
  section: { background: '#121212', borderRadius: 12, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px' },
  hint: { color: '#a3a3a3', fontSize: 12, marginBottom: 12, lineHeight: 1.5 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #2a2a2a', background: '#000000', color: '#f5f5f5', fontSize: 14, marginBottom: 10 },
  ruleBox: { background: '#000000', borderRadius: 8, padding: 12, fontSize: 13, color: '#cbd5e1', marginBottom: 12 },
  guideBox: { background: '#000000', borderRadius: 8, padding: 14, marginBottom: 12 },
  guideTitle: { fontSize: 13, fontWeight: 700, color: '#8b8cf8', margin: '0 0 8px' },
  guideText: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0 },
  guideExample: { fontSize: 12, color: '#a3a3a3', fontStyle: 'italic', marginTop: 10, paddingTop: 10, borderTop: '1px solid #2a2a2a', lineHeight: 1.5 },
  recordRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  orText: { fontSize: 12, color: '#64748b' },
  interimHint: { fontSize: 12, color: '#8b8cf8', marginBottom: 10, fontStyle: 'italic' },
  textarea: { width: '100%', padding: 12, borderRadius: 8, border: '1px solid #2a2a2a', background: '#000000', color: '#f5f5f5', fontSize: 14, resize: 'vertical', marginBottom: 10 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#000000', borderRadius: 10, padding: 16, marginTop: 16 },
  overallScore: { fontSize: 20, color: '#4ade80', margin: '0 0 12px' },
  criteriaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 },
  criterion: { fontSize: 12, background: '#121212', padding: 10, borderRadius: 8, lineHeight: 1.4 },
  feedback: { fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  descriptorBox: { marginTop: 20, fontSize: 13, color: '#a3a3a3' },
  descriptorSummary: { cursor: 'pointer', color: '#a5b4fc', marginBottom: 8 },
  bandBlock: { background: '#000000', borderRadius: 8, padding: 12, marginTop: 8 },
  descLine: { fontSize: 12, margin: '4px 0', color: '#cbd5e1' },
};
