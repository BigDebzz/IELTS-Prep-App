// src/lib/vocabApi.js
// Zero AI here on purpose — this pulls REAL dictionary/thesaurus data from free, keyless APIs.
// dictionaryapi.dev = free dictionary (definitions, pronunciation, word family)
// api.datamuse.com = free word-relations API (synonyms, antonyms, related words)

// dictionaryapi.dev looks up exact headwords only — it won't match "rockets" to "rocket".
// Try a few common singular/base forms before giving up, so plurals from real passages
// (which are full of them) still resolve to a real definition.
function candidateForms(w) {
  const forms = [w];
  if (w.endsWith('ies') && w.length > 4) forms.push(w.slice(0, -3) + 'y'); // "countries" -> "country"
  if (w.endsWith('es') && w.length > 3) forms.push(w.slice(0, -2)); // "watches" -> "watch"
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) forms.push(w.slice(0, -1)); // "rockets" -> "rocket"
  if (w.endsWith('ed') && w.length > 4) forms.push(w.slice(0, -2), w.slice(0, -1)); // "walked" -> "walk"
  if (w.endsWith('ing') && w.length > 5) forms.push(w.slice(0, -3), w.slice(0, -3) + 'e'); // "running" -> "run", "writing" -> "write"
  return [...new Set(forms)];
}

async function fetchDictEntry(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    .then(r => r.ok ? r.json() : null)
    .catch(() => null);
  return Array.isArray(res) && res[0] ? res[0] : null;
}

export async function lookupWord(word) {
  const w = word.trim().toLowerCase();
  if (!w) return null;

  const [synRes, antRes] = await Promise.all([
    fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(w)}&max=8`).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(w)}&max=8`).then(r => r.ok ? r.json() : []).catch(() => []),
  ]);

  // Try the exact word first, then fall back through likely base forms.
  let entry = null;
  let matchedForm = w;
  for (const form of candidateForms(w)) {
    entry = await fetchDictEntry(form);
    if (entry) { matchedForm = form; break; }
  }

  let meaning = '';
  let phonetic = '';
  let audioUrl = '';
  let partOfSpeech = '';
  let example = '';

  if (entry) {
    phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
    const rawAudio = entry.phonetics?.find(p => p.audio)?.audio || '';
    // dictionaryapi.dev sometimes returns protocol-relative URLs ("//ssl.gstatic.com/...")
    // which some browsers refuse to play silently. Force https:// so playback works.
    audioUrl = rawAudio && rawAudio.startsWith('//') ? `https:${rawAudio}` : rawAudio;
    const firstMeaning = entry.meanings?.[0];
    partOfSpeech = firstMeaning?.partOfSpeech || '';
    const firstDef = firstMeaning?.definitions?.[0];
    meaning = firstDef?.definition || '';
    example = firstDef?.example || '';
  }

  return {
    word: matchedForm !== w ? `${w} (shown as "${matchedForm}")` : w,
    meaning: meaning || `No definition found for "${w}" — it may be a proper noun, a very rare word, or a form the dictionary doesn't recognize.`,
    phonetic,
    audioUrl,
    partOfSpeech,
    example,
    synonyms: (synRes || []).map(x => x.word),
    antonyms: (antRes || []).map(x => x.word),
  };
}

// Real collocation-style related words (Datamuse "means like" / triggers)
export async function getRelatedWords(word) {
  const w = word.trim().toLowerCase();
  const res = await fetch(`https://api.datamuse.com/words?rel_trg=${encodeURIComponent(w)}&max=10`)
    .then(r => r.ok ? r.json() : [])
    .catch(() => []);
  return (res || []).map(x => x.word);
}
