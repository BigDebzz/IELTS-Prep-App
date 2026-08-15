import { useEffect, useState } from 'react';
import { lookupWord, getRelatedWords } from '../lib/vocabApi';
import { checkVocabSentence } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import { vocabBatchForDay } from '../data/vocabularyBank';

export default function VocabularyTab({ user, selectedDay }) {
  const todaysWords = vocabBatchForDay(selectedDay);

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

  const [savedWords, setSavedWords] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedWordSet, setSavedWordSet] = useState(new Set());

  function playAudio(url) {
    setAudioError('');
    if (!url) { setAudioError('No pronunciation audio available for this word.'); return; }
    const audio = new Audio(url);
    audio.play().catch(() => setAudioError('Audio failed to play — this word\'s pronunciation file may be unavailable right now.'));
  }

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
    if (!error) {
      setSavedWords(data);
      setSavedWordSet(new Set(data.map(w => w.word.toLowerCase().split(' ')[0])));
    }
    setSavedLoading(false);
  }

  async function lookupSpecificWord(w) {
    setWord(w);
    setLoading(true); setError(''); setResult(null); setSentenceFeedback(null); setJustSaved(false); setSentence('');
    try {
      const [data, rel] = await Promise.all([lookupWord(w), getRelatedWords(w)]);
      setResult(data);
      setRelated(rel);
    } catch (err) {
      setError('Lookup failed — check your spelling or try again.');
    }
    setLoading(false);
  }

  async function handleLookup(e) {
    e.preventDefault();
    if (!word.trim()) return;
    await lookupSpecificWord(word);
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
    if (!error) { setSavedWords(prev => prev.filter(w => w.id !== id)); loadSavedWords(); }
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
      <p style={s.hint}>Real dictionary + thesaurus data (dictionaryapi.dev + Datamuse) — no AI-generated definitions. AI is only used below to check your own example sentence.</p>

      <div style={s.dailySection}>
        <h3 style={s.dailyTitle}>Day {selectedDay}: Words to Learn</h3>
        <p style={s.dailySub}>From the Academic Word List (Coxhead, 2000) — the real corpus IELTS reading and writing content draws its vocabulary from. Tap a word to look it up.</p>
        <div style={s.wordChips}>
          {todaysWords.map(w => (
            <button
              key={w}
              onClick={() => lookupSpecificWord(w)}
              style={{ ...s.chip, ...(savedWordSet.has(w) ? s.chipSaved : {}) }}
            >
              {w} {savedWordSet.has(w) && '✓'}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleLookup} style={s.form}>
        <input style={s.input} placeholder="Or type any word (e.g. from your reading)" value={word} onChange={e => setWord(e.target.value)} />
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
          <p style={s.hint}>No words saved yet. Tap one of today's words above, or look one up, then hit "Save word."</p>
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
  section: { background: '#121212', borderRadius: 12, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px' },
  hint: { color: '#a3a3a3', fontSize: 12, marginBottom: 16, lineHeight: 1.5 },
  dailySection: { background: '#000000', borderRadius: 10, padding: 16, marginBottom: 16 },
  dailyTitle: { fontSize: 15, margin: '0 0 4px', color: '#f5f5f5' },
  dailySub: { fontSize: 12, color: '#a3a3a3', margin: '0 0 12px', lineHeight: 1.5 },
  wordChips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: { padding: '6px 14px', borderRadius: 20, border: '1px solid #2a2a2a', background: '#121212', color: '#f5f5f5', fontSize: 13, cursor: 'pointer' },
  chipSaved: { border: '1px solid #4ade80', color: '#4ade80' },
  form: { display: 'flex', gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #2a2a2a', background: '#000000', color: '#f5f5f5', fontSize: 14 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  card: { background: '#000000', borderRadius: 10, padding: 16, marginBottom: 20 },
  wordRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  word: { fontSize: 22, margin: 0, textTransform: 'capitalize' },
  phonetic: { color: '#8b8cf8', fontSize: 14 },
  audioBtn: { background: 'none', border: '1px solid #2a2a2a', color: '#a3a3a3', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 },
  pos: { color: '#64748b', fontSize: 12, fontStyle: 'italic', margin: '6px 0 0' },
  meaning: { fontSize: 15, margin: '8px 0' },
  example: { color: '#a3a3a3', fontSize: 13, fontStyle: 'italic' },
  tagRow: { fontSize: 13, color: '#cbd5e1', margin: '6px 0' },
  sentenceBox: { marginTop: 16, borderTop: '1px solid #2a2a2a', paddingTop: 14 },
  sentenceLabel: { fontSize: 13, color: '#a3a3a3', marginBottom: 8 },
  textarea: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #2a2a2a', background: '#121212', color: '#f5f5f5', fontSize: 14, resize: 'vertical' },
  btnRow: { display: 'flex', gap: 8, marginTop: 8 },
  smallBtn: { padding: '8px 14px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontSize: 13, cursor: 'pointer' },
  smallBtnOutline: { padding: '8px 14px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'none', color: '#a3a3a3', fontSize: 13, cursor: 'pointer' },
  feedback: { fontSize: 13, marginTop: 8 },
  savedMsg: { color: '#4ade80', fontSize: 13, marginTop: 8 },
  savedSection: { borderTop: '1px solid #2a2a2a', paddingTop: 16 },
  savedTitle: { fontSize: 15, margin: '0 0 12px', color: '#f5f5f5' },
  savedList: { display: 'grid', gridTemplateColumns: '1fr', gap: 10 },
  savedCard: { background: '#000000', borderRadius: 8, padding: 12 },
  savedCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  savedWord: { fontSize: 15, fontWeight: 700, textTransform: 'capitalize', color: '#f5f5f5' },
  deleteBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 },
  savedMeaning: { fontSize: 13, color: '#cbd5e1', margin: '6px 0' },
  savedTag: { fontSize: 12, color: '#a3a3a3', margin: '2px 0' },
  savedExample: { fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '6px 0 0' },
};
