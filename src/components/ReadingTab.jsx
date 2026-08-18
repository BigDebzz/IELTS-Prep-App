import { useEffect, useState } from 'react';
import { generateReading } from '../lib/gemini';
import { lookupWord } from '../lib/vocabApi';
import { supabase } from '../lib/supabase';
import { READING_QUESTION_TYPES, READING_GENERAL_TIPS, topicForDay } from '../data/ieltsContent';
import { OFFICIAL_PASSAGES } from '../data/officialReadingPassages';
import { theme } from '../styles/theme';

function cleanWord(raw) {
  return raw.replace(/[^a-zA-Z'-]/g, '');
}

export default function ReadingTab({ user, selectedDay }) {
  const [practice, setPractice] = useState(null);
  const [isOfficial, setIsOfficial] = useState(false);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  const [lookup, setLookup] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [savedWord, setSavedWord] = useState('');
  const [audioError, setAudioError] = useState('');
  const [bookmark, setBookmark] = useState(null);
  const [menu, setMenu] = useState(null); // { word, paragraphIndex, x, y }
  const [copiedFlash, setCopiedFlash] = useState(false);
  const longPressTimer = useState({ current: null })[0];

  function playAudio(url) {
    setAudioError('');
    if (!url) { setAudioError('No pronunciation audio available for this word.'); return; }
    const audio = new Audio(url);
    audio.play().catch(() => setAudioError('Audio failed to play — this word\'s pronunciation file may be unavailable right now.'));
  }

  // Days 1 through however many official passages exist get real material, in order.
  // Beyond that, AI generates new passages styled after a real one.
  const officialForDay = selectedDay <= OFFICIAL_PASSAGES.length ? OFFICIAL_PASSAGES[selectedDay - 1] : null;
  const dayTopic = topicForDay(selectedDay);

  useEffect(() => {
    setAnswers({});
    setShowResults(false);
    setLookup(null);
    if (officialForDay) {
      setPractice({
        passage: officialForDay.passage,
        instructions: officialForDay.instructions,
        questions: officialForDay.questions,
        title: officialForDay.title,
        questionType: officialForDay.questionType,
      });
      setIsOfficial(true);
    } else {
      setPractice(null);
      setIsOfficial(false);
    }
  }, [selectedDay]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function loadBookmark() {
      const { data } = await supabase
        .from('reading_bookmarks')
        .select('paragraph_index')
        .eq('user_id', user.id)
        .eq('day_number', selectedDay)
        .maybeSingle();
      setBookmark(data ? data.paragraph_index : null);
    }
    loadBookmark();
  }, [selectedDay, user.id]);

  async function handleSetBookmark(paragraphIndex) {
    await supabase
      .from('reading_bookmarks')
      .upsert({ user_id: user.id, day_number: selectedDay, paragraph_index: paragraphIndex }, { onConflict: 'user_id,day_number' });
    setBookmark(paragraphIndex);
    setMenu(null);
  }

  function scrollToBookmark() {
    const el = document.getElementById(`para-${bookmark}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handlePressStart(e, word, paragraphIndex) {
    const point = e.touches ? e.touches[0] : e;
    const x = point.clientX;
    const y = point.clientY;
    longPressTimer.fired = false;
    longPressTimer.current = setTimeout(() => {
      longPressTimer.fired = true;
      setMenu({ word, paragraphIndex, x, y });
    }, 450);
  }

  function handlePressEnd(e, word) {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      // Only treat this as a normal lookup tap if the long-press menu never fired.
      if (!longPressTimer.fired) handleWordClick(word);
      longPressTimer.current = null;
    }
  }

  function handleCopy(word) {
    const clean = cleanWord(word);
    navigator.clipboard?.writeText(clean).then(() => {
      setCopiedFlash(true);
      setTimeout(() => setCopiedFlash(false), 1200);
    });
    setMenu(null);
  }

  async function handleGenerateAI() {
    setLoading(true); setError(''); setShowResults(false); setAnswers({}); setLookup(null);
    try {
      const randomType = READING_QUESTION_TYPES[Math.floor(Math.random() * READING_QUESTION_TYPES.length)];
      const styleRef = OFFICIAL_PASSAGES[Math.floor(Math.random() * OFFICIAL_PASSAGES.length)].passage;
      const data = await generateReading(randomType.type, dayTopic, styleRef);
      setPractice({ ...data, title: dayTopic, questionType: randomType.type });
      setIsOfficial(false);
    } catch (err) {
      setError('Generation failed: ' + err.message);
    }
    setLoading(false);
  }

  async function handleWordClick(rawWord) {
    const word = cleanWord(rawWord).toLowerCase();
    if (!word || word.length < 2) return;
    setLookupLoading(true);
    setLookup({ word });
    setSavedWord('');
    setAudioError('');
    try {
      const data = await lookupWord(word);
      setLookup(data);
    } catch (err) {
      setLookup({ word, meaning: 'Lookup failed — try again.' });
    }
    setLookupLoading(false);
  }

  async function handleSave() {
    if (!lookup || !lookup.word) return;
    await supabase.from('vocab').insert({
      user_id: user.id,
      word: lookup.word,
      meaning: lookup.meaning,
      synonyms: (lookup.synonyms || []).join(', '),
      antonyms: (lookup.antonyms || []).join(', '),
      example_sentence: lookup.example || '',
    });
    setSavedWord(lookup.word);
  }

  function renderClickablePassage(text) {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.map((para, pi) => (
      <div key={pi} id={`para-${pi}`} style={{ ...s.paragraphWrap, ...(bookmark === pi ? s.paragraphBookmarked : {}) }}>
        <p style={s.paragraph}>
          {para.split(/(\s+)/).map((token, ti) =>
            /\s+/.test(token) ? token : (
              <span
                key={ti}
                style={s.clickableWord}
                onTouchStart={(e) => handlePressStart(e, token, pi)}
                onTouchEnd={(e) => handlePressEnd(e, token)}
                onMouseDown={(e) => handlePressStart(e, token, pi)}
                onMouseUp={(e) => handlePressEnd(e, token)}
              >
                {token}
              </span>
            )
          )}
        </p>
      </div>
    ));
  }

  const score = practice ? practice.questions.filter(q => (answers[q.number] || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase()).length : 0;

  return (
    <section style={s.section}>
      <h2 style={s.title}>Reading Practice — Day {selectedDay}</h2>

      {officialForDay ? (
        <p style={s.hint}>
          <span style={s.officialBadge}>✓ Official IELTS sample material</span> — from {officialForDay.source}.
          This is real, unmodified content. Click any word to look it up and save it to your vocabulary.
        </p>
      ) : (
        <p style={s.hint}>
          You've worked through all {OFFICIAL_PASSAGES.length} official sample passages. From here, practice is
          {' '}<span style={s.aiBadge}>AI-generated</span>, styled after real IELTS passages but not authentic material.
          Today's topic: <strong style={{ color: theme.colors.lavender }}>{dayTopic}</strong>.
        </p>
      )}

      <details style={s.tipsBox}>
        <summary style={s.tipsSummary}>General Reading technique (start here if you're new to IELTS)</summary>
        {READING_GENERAL_TIPS.map((t, i) => (
          <div key={i} style={s.tipItem}>
            <p style={s.tipTitle}>{t.tip}</p>
            <p style={s.tipDetail}>{t.detail}</p>
          </div>
        ))}
      </details>

      {!officialForDay && !practice && (
        <button style={s.button} onClick={handleGenerateAI} disabled={loading}>
          {loading ? 'Generating…' : `Generate today's passage`}
        </button>
      )}

      {error && <p style={s.error}>{error}</p>}

      {practice && (
        <div style={s.layout}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h3 style={s.passageTitle}>{practice.title}</h3>
              <span style={isOfficial ? s.officialTag : s.aiTag}>{isOfficial ? 'Official' : 'AI-generated'}</span>
            </div>
            <p style={s.questionTypeLabel}>{practice.questionType}</p>
            {(() => {
              const typeGuide = READING_QUESTION_TYPES.find(t => t.type === practice.questionType);
              return typeGuide?.howTo ? (
                <div style={s.howToBox}>
                  <strong>How to answer this type:</strong> {typeGuide.howTo}
                </div>
              ) : null;
            })()}
            {bookmark !== null && (
              <button style={s.resumeBtn} onClick={scrollToBookmark}>↓ Resume where I left off (paragraph {bookmark + 1})</button>
            )}

            {renderClickablePassage(practice.passage)}

            {menu && (
              <>
                <div style={s.menuBackdrop} onClick={() => setMenu(null)} />
                <div style={{ ...s.menu, left: Math.max(10, menu.x - 60), top: Math.max(10, menu.y - 60) }}>
                  <button style={s.menuItem} onClick={() => handleCopy(menu.word)}>📋 Copy</button>
                  <button style={s.menuItem} onClick={() => handleSetBookmark(menu.paragraphIndex)}>📍 Mark position</button>
                </div>
              </>
            )}
            {copiedFlash && <div style={s.toast}>Copied</div>}

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

          <div style={s.sidebar}>
            <h3 style={s.sidebarTitle}>Word lookup</h3>
            {!lookup && <p style={s.hint}>Click any word in the passage to look it up here.</p>}
            {lookupLoading && <p style={s.hint}>Looking up…</p>}
            {lookup && !lookupLoading && (
              <div>
                <p style={s.lookupWord}>{lookup.word}</p>
                {lookup.phonetic && <p style={s.lookupPhonetic}>{lookup.phonetic}</p>}
                <button style={s.saveBtn} onClick={() => playAudio(lookup.audioUrl)}>🔊 Pronounce</button>
                {audioError && <p style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{audioError}</p>}
                <p style={s.lookupMeaning}>{lookup.meaning}</p>
                {lookup.synonyms?.length > 0 && <p style={s.lookupTag}><strong>Synonyms:</strong> {lookup.synonyms.join(', ')}</p>}
                {lookup.antonyms?.length > 0 && <p style={s.lookupTag}><strong>Antonyms:</strong> {lookup.antonyms.join(', ')}</p>}
                <button style={s.saveBtn} onClick={handleSave}>Save to vocabulary</button>
                {savedWord === lookup.word && <p style={s.savedMsg}>✓ Saved</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const s = {
  section: { background: theme.colors.card, borderRadius: theme.radius.card, padding: 20 },
  title: { fontSize: 18, margin: '0 0 8px', color: theme.colors.text },
  hint: { color: theme.colors.textMuted, fontSize: 12, marginBottom: 12, lineHeight: 1.6 },
  officialBadge: { color: '#4ade80', fontWeight: 700 },
  aiBadge: { color: theme.colors.coral, fontWeight: 700 },
  button: { padding: '10px 16px', borderRadius: 8, border: 'none', background: theme.colors.lavender, color: 'white', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#f87171', fontSize: 13 },
  layout: { display: 'grid', gridTemplateColumns: '1fr', gap: 16 },
  card: { background: theme.colors.bg, borderRadius: 10, padding: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 2 },
  passageTitle: { fontSize: 16, margin: 0, color: theme.colors.text },
  officialTag: { fontSize: 10, fontWeight: 700, color: '#4ade80', background: '#4ade8022', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' },
  aiTag: { fontSize: 10, fontWeight: 700, color: theme.colors.coral, background: theme.colors.coral + '22', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' },
  questionTypeLabel: { fontSize: 12, color: theme.colors.lavender, marginBottom: 12 },
  tipsBox: { background: theme.colors.bg, borderRadius: 8, marginBottom: 16, padding: 12 },
  tipsSummary: { cursor: 'pointer', color: theme.colors.lavender, fontSize: 13, fontWeight: 600 },
  tipItem: { marginTop: 10 },
  tipTitle: { fontSize: 13, fontWeight: 700, color: theme.colors.text, margin: '0 0 3px' },
  tipDetail: { fontSize: 12, color: '#cbd5e1', margin: 0, lineHeight: 1.5 },
  howToBox: { background: theme.colors.bg, borderRadius: 8, padding: 12, fontSize: 12, color: '#cbd5e1', marginBottom: 12, lineHeight: 1.5 },
  paragraph: { fontSize: 14, lineHeight: 1.8, marginBottom: 6 },
  paragraphWrap: { marginBottom: 14, padding: 8, borderRadius: 8, transition: 'background 0.2s' },
  paragraphBookmarked: { background: theme.colors.lavender + '15', boxShadow: `0 0 0 1px ${theme.colors.lavender}55` },
  bookmarkBtn: { fontSize: 11, background: 'none', border: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted, borderRadius: 20, padding: '4px 10px', cursor: 'pointer' },
  bookmarkBtnActive: { fontSize: 11, background: theme.colors.lavender, border: 'none', color: 'white', borderRadius: 20, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 },
  resumeBtn: { fontSize: 12, background: theme.colors.lavender + '22', border: `1px solid ${theme.colors.lavender}`, color: theme.colors.lavender, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: 14, display: 'block' },
  menuBackdrop: { position: 'fixed', inset: 0, zIndex: 40 },
  menu: { position: 'fixed', zIndex: 41, background: theme.colors.card, border: `1px solid ${theme.colors.border}`, borderRadius: 10, boxShadow: theme.shadow.pop, display: 'flex', overflow: 'hidden' },
  menuItem: { padding: '10px 14px', background: 'none', border: 'none', color: theme.colors.text, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', borderRight: `1px solid ${theme.colors.border}` },
  toast: { position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: theme.colors.text, color: theme.colors.bg, padding: '8px 16px', borderRadius: 20, fontSize: 13, zIndex: 42 },
  clickableWord: { cursor: 'pointer', borderBottom: `1px dotted ${theme.colors.textMuted}`, transition: 'color 0.15s' },
  instructions: { fontSize: 13, color: '#a5b4fc', marginBottom: 12, fontWeight: 600, whiteSpace: 'pre-wrap' },
  qRow: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
  qLabel: { fontSize: 14 },
  qInput: { padding: '8px 10px', borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: theme.colors.card, color: theme.colors.text, fontSize: 14 },
  scoreText: { fontSize: 16, fontWeight: 700, color: '#4ade80' },
  sidebar: { background: theme.colors.bg, borderRadius: 10, padding: 16, position: 'sticky', top: 12, alignSelf: 'start' },
  sidebarTitle: { fontSize: 14, margin: '0 0 10px', color: theme.colors.text },
  lookupWord: { fontSize: 20, fontWeight: 700, textTransform: 'capitalize', margin: '0 0 4px', color: theme.colors.text },
  lookupPhonetic: { fontSize: 13, color: theme.colors.lavender, margin: '0 0 8px' },
  lookupMeaning: { fontSize: 14, margin: '0 0 10px', lineHeight: 1.5 },
  lookupTag: { fontSize: 13, color: '#cbd5e1', margin: '4px 0' },
  saveBtn: { marginTop: 10, padding: '8px 14px', borderRadius: 8, border: 'none', background: theme.colors.lavender, color: 'white', fontSize: 13, cursor: 'pointer' },
  savedMsg: { color: '#4ade80', fontSize: 12, marginTop: 6 },
};
