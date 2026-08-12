import { useEffect, useState } from 'react';
import { lookupWord, getRelatedWords } from '../lib/vocabApi';
import { checkVocabSentence } from '../lib/gemini';
import { supabase } from '../lib/supabase';

export default function VocabularyTab({ user }) {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentence, setSentence] = useState('');
  const [checking, setChecking] = useState(false);
  const [sentenceFeedback, setSentenceFeedback] = useState(null);
  const [justSaved, setJustSaved] = useState(false);
  const [audioError, setAudioError] = useState('');

  function playAudio(url) {
    setAudioError('');
    if (!url) { setAudioError('No pronunciation audio available for this word.'); return; }
    const audio = new Audio(url);
    audio.play().catch(() => setAudioError('Audio failed to play — this word\'s pronunciation file may be unavailable right now.'));
  }

  const [savedWords, setSavedWords] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);

  useEffect(() => {
    loadSavedWords();
  }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadSavedWords() {
    setSavedLoading(true);
    const { data, error } = await supabase
      .from('vocab')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setSavedWords(data);
    setSavedLoading(false);
  }

  async function handleLookup(e) {
    e.preventDefault();
    if (!word.trim()) return;
    setLoading(true); setError(''); setResult(null); setSentenceFeedback(null); setJustSaved(false);
    try {
      const [data, rel] = await Promise.all([lookupWord(word), getRelatedWords(word)]);
      setResult(data);
      setRelated(rel);
    } catch (err) {
      setError('Lookup failed — check your spelling or try again.');
    }
    setLoading(false);
  }

  async function handleSaveWord() {
    if (!result) return;
    const { error } = await supabase.from('vocab').insert({
      user_id: user.id,
      word: result.word,
      meaning: result.meaning,
      synonyms: (result.synonyms || []).join(', '),
      antonyms: (result.antonyms || []).join(', '),
      example_sentence: result.example || sentence,
    });
    if (!error) {
      setJustSaved(true);
      loadSavedWords();
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('vocab').delete().eq('id', id);
    if (!error) setSavedWords(prev => prev.filter(w => w.id !== id));
  }

  async function handleCheckSentence() {
    if (!sentence.trim() || !result) return;
    setChecking(true);
    try {
      const fb = await checkVocabSentence(result.word, sentence);
      setSentenceFeedback(fb);
    } catch (err) {
      setSentenceFeedback({ correct: false, feedback: 'Check failed: ' + err.message });
    }
    setChecking(false);
  }

  return (
    <section style={s.section}>
      <h2 style={s.title}>Vocabulary Builder</h2>
      <p style={s.hint}>Real dictionary + thesaurus data (dictionaryapi.dev + Datamuse) — no AI-generated definitions. AI is only used below to check your own example sentence. Words you save here (or from the Reading tab) show up permanently in "My Saved Words" below, on any device.</p>

      <form onSubmit={handleLookup} style={s.form}>
        <input style={s.input} placeholder="Type a word (e.g. from your reading)" value={word} onChange={e => setWord(e.target.value)} />
        <button style={s.button} type="submit" disabled={loading}>{loading ? 'Looking up…' : 'Look up'}</button>
      </form>

      {error && <p style={s.error}>{error}</p>}

      {result && (
        <div style={s.card}>
          <div style={s.wordRow}>
            <h3 style={s.word}>{result.word}</h3>
            {result.phonetic && <span style={s.phonetic}>{result.phonetic}</span>}
            {result.audioUrl && (
              <button style={s.audioBtn} onClick={() => playAudio(result.audioUrl)}>🔊 Pronounce</button>
            )}
          </div>
          {audioError && <p style={s.error}>{audioError}</p>}
          {result.partOfSpeech && <p style={s.pos}>{result.partOfSpeech}</p>}
          <p style={s.meaning}>{result.meaning}</p>
          {result.example && <p style={s.example}>Example: "{result.example}"</p>}

          {result.synonyms.length > 0 && (
            <p style={s.tagRow}><strong>Synonyms:</strong> {result.synonyms.join(', ')}</p>
          )}
          {result.antonyms.length > 0 && (
            <p style={s.tagRow}><strong>Antonyms:</strong> {result.antonyms.join(', ')}</p>
          )}
          {related.length > 0 && (
            <p style={s.tagRow}><strong>Related/collocations:</strong> {related.join(', ')}</p>
          )}

          <div style={s.sentenceBox}>
            <p style={s.sentenceLabel}>Practice: write your own sentence using "{result.word}"</p>
            <textarea style={s.textarea} rows={2} value={sentence} onChange={e => setSentence(e.target.value)} />
            <div style={s.btnRow}>
              <button style={s.smallBtn} onClick={handleCheckSentence} disabled={checking}>{checking ? 'Checking…' : 'Check my sentence (AI)'}</button>
              <button style={s.smallBtnOutline} onClick={handleSaveWord}>Save word</button>
            </div>
            {justSaved && <p style={s.savedMsg}>✓ Saved — see "My Saved Words" below</p>}
            {sentenceFeedback && (
              <p style={{ ...s.feedback, color: sentenceFeedback.correct ? '#4ade80' : '#f87171' }}>
                {sentenceFeedback.correct ? '✓ ' : '✗ '}{sentenceFeedback.feedback}
              </p>
            )}
          </div>
        </div>
      )}

      <div style={s.savedSection}>
        <h3 style={s.savedTitle}>My Saved Words {savedWords.length > 0 && `(${savedWords.length})`}</h3>
        {savedLoading && <p style={s.hint}>Loading…</p>}
        {!savedLoading && savedWords.length === 0 && (
          <p style={s.hint}>No words saved yet. Look one up above, or click a word while reading, then hit "Save word."</p>
        )}
        <div style={s.savedList}>
          {savedWords.map(w => (
            <div key={w.id} style={s.savedCard}>
              <div style={s.savedCardHeader}>
                <span style={s.savedWord}>{w.word}</span>
                <button style={s.deleteBtn} onClick={() => handleDelete(w.id)} title="Remove">✕</button>
              </div>
              <p style={s.savedMeaning}>{w.meaning}</p>
              {w.synonyms && <p style={s.savedTag}><strong>Synonyms:</strong> {w.synonyms}</p>}
              {w.antonyms && <p style={s.savedTag}><strong>Antonyms:</strong> {w.antonyms}</p>}
              {w.example_sentence && <p style={s.savedExample}>"{w.example_sentence}"</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s = {
  section: { background: '#1e293b', borderRadius: 12, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px' },
  hint: { color: '#94a3b8', fontSize: 12, marginBottom: 16, lineHeight: 1.5 },
  form: { display: 'flex', gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#0f172a', borderRadius: 10, padding: 16, marginBottom: 20 },
  wordRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  word: { fontSize: 22, margin: 0, textTransform: 'capitalize' },
  phonetic: { color: '#818cf8', fontSize: 14 },
  audioBtn: { background: 'none', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 },
  pos: { color: '#64748b', fontSize: 12, fontStyle: 'italic', margin: '6px 0 0' },
  meaning: { fontSize: 15, margin: '8px 0' },
  example: { color: '#94a3b8', fontSize: 13, fontStyle: 'italic' },
  tagRow: { fontSize: 13, color: '#cbd5e1', margin: '6px 0' },
  sentenceBox: { marginTop: 16, borderTop: '1px solid #334155', paddingTop: 14 },
  sentenceLabel: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  textarea: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14, resize: 'vertical' },
  btnRow: { display: 'flex', gap: 8, marginTop: 8 },
  smallBtn: { padding: '8px 14px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontSize: 13, cursor: 'pointer' },
  smallBtnOutline: { padding: '8px 14px', borderRadius: 8, border: '1px solid #334155', background: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' },
  feedback: { fontSize: 13, marginTop: 8 },
  savedMsg: { color: '#4ade80', fontSize: 13, marginTop: 8 },
  savedSection: { borderTop: '1px solid #334155', paddingTop: 16 },
  savedTitle: { fontSize: 15, margin: '0 0 12px', color: '#f1f5f9' },
  savedList: { display: 'grid', gridTemplateColumns: '1fr', gap: 10 },
  savedCard: { background: '#0f172a', borderRadius: 8, padding: 12 },
  savedCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  savedWord: { fontSize: 15, fontWeight: 700, textTransform: 'capitalize', color: '#f1f5f9' },
  deleteBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 },
  savedMeaning: { fontSize: 13, color: '#cbd5e1', margin: '6px 0' },
  savedTag: { fontSize: 12, color: '#94a3b8', margin: '2px 0' },
  savedExample: { fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '6px 0 0' },
};
