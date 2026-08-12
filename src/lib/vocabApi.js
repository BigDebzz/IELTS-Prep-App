// src/lib/vocabApi.js
// Zero AI here on purpose — this pulls REAL dictionary/thesaurus data from free, keyless APIs.
// dictionaryapi.dev = free dictionary (definitions, pronunciation, word family)
// api.datamuse.com = free word-relations API (synonyms, antonyms, related words)

export async function lookupWord(word) {
  const w = word.trim().toLowerCase();
  if (!w) return null;

  const [dictRes, synRes, antRes] = await Promise.all([
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(w)}&max=8`).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(w)}&max=8`).then(r => r.ok ? r.json() : []).catch(() => []),
  ]);

  let meaning = '';
  let phonetic = '';
  let audioUrl = '';
  let partOfSpeech = '';
  let example = '';

  if (dictRes && Array.isArray(dictRes) && dictRes[0]) {
    const entry = dictRes[0];
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
    word: w,
    meaning: meaning || 'No definition found — check spelling.',
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
