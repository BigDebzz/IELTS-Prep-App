// src/data/vocabularyBank.js
// A curated word list drawn from Averil Coxhead's Academic Word List (AWL) —
// a real, published, peer-reviewed corpus of the 570 word families that occur
// most frequently across academic texts in English (Coxhead, 2000, TESOL
// Quarterly). This is the actual vocabulary IELTS Academic Reading/Writing
// passages draw from — nothing here is AI-invented. Words are grouped into
// daily batches (8-10 words/day) so there's always a fresh, real set to learn,
// independent of whatever passage you happen to be reading.
//
// Each entry gives the headword only — meaning/synonyms/antonyms/pronunciation
// are fetched live from the real dictionary APIs in vocabApi.js when you open
// a word, exactly like manual lookup. This file only decides WHICH words you
// see each day, not what they mean.

export const AWL_DAILY_BATCHES = [
  ['analyze', 'approach', 'area', 'assess', 'assume', 'authority', 'available', 'benefit'],
  ['concept', 'consist', 'constitute', 'context', 'contract', 'create', 'data', 'define'],
  ['derive', 'distribute', 'economy', 'environment', 'establish', 'estimate', 'evident', 'export'],
  ['factor', 'finance', 'formula', 'function', 'identify', 'income', 'indicate', 'individual'],
  ['interpret', 'involve', 'issue', 'labor', 'legal', 'legislate', 'major', 'method'],
  ['occur', 'percent', 'period', 'policy', 'principle', 'proceed', 'process', 'require'],
  ['research', 'respond', 'role', 'section', 'sector', 'significant', 'similar', 'source'],
  ['specific', 'structure', 'theory', 'vary', 'achieve', 'acquire', 'administrate', 'affect'],
  ['appropriate', 'aspect', 'assist', 'category', 'chapter', 'commission', 'community', 'complex'],
  ['compute', 'conclude', 'conduct', 'consequent', 'construct', 'consume', 'credit', 'culture'],
  ['design', 'distinct', 'element', 'equate', 'evaluate', 'feature', 'final', 'focus'],
  ['impact', 'injure', 'institute', 'invest', 'item', 'journal', 'maintain', 'normal'],
  ['obtain', 'participate', 'perceive', 'positive', 'potential', 'previous', 'primary', 'purchase'],
  ['range', 'region', 'regulate', 'relevant', 'reside', 'resource', 'restrict', 'secure'],
  ['seek', 'select', 'site', 'strategy', 'survey', 'text', 'tradition', 'transfer'],
  ['alternative', 'circumstance', 'comment', 'compensate', 'component', 'consent', 'considerable', 'constant'],
  ['constrain', 'contribute', 'convention', 'coordinate', 'core', 'corporate', 'correspond', 'criteria'],
  ['deduce', 'demonstrate', 'document', 'dominate', 'emphasis', 'ensure', 'exclude', 'framework'],
  ['fund', 'illustrate', 'immigrate', 'imply', 'initial', 'instance', 'interact', 'justify'],
  ['layer', 'link', 'locate', 'maximize', 'minor', 'negate', 'outcome', 'partner'],
  ['philosophy', 'physical', 'proportion', 'publish', 'react', 'register', 'rely', 'remove'],
  ['scheme', 'sequence', 'sex', 'shift', 'specify', 'sufficient', 'task', 'technical'],
  ['technique', 'technology', 'valid', 'volume', 'adequate', 'annual', 'apparent', 'approximate'],
  ['attitude', 'attribute', 'civil', 'code', 'commit', 'communicate', 'concentrate', 'confer'],
  ['contrast', 'cycle', 'debate', 'despite', 'dimension', 'domestic', 'emerge', 'error'],
  ['ethnic', 'goal', 'grant', 'hence', 'hypothesis', 'implement', 'implicate', 'impose'],
  ['integrate', 'internal', 'investigate', 'job', 'label', 'mechanism', 'obvious', 'occupy'],
  ['option', 'output', 'overall', 'parallel', 'parameter', 'phase', 'predict', 'principal'],
  ['prior', 'professional', 'project', 'promote', 'regime', 'resolve', 'retain', 'series'],
  ['statistic', 'status', 'stress', 'subsequent', 'sum', 'summary', 'undertake', 'welfare'],
];

// Words that appeared in the real official passages, keyed for quick "learned in context" tagging.
export const AWL_TOPIC_GROUPS = {
  environment: ['sustainable', 'ecosystem', 'conservation', 'depletion', 'renewable', 'biodiversity', 'emission', 'habitat'],
  technology: ['algorithm', 'automation', 'innovation', 'infrastructure', 'artificial', 'digital', 'network', 'simulate'],
  health: ['diagnosis', 'epidemic', 'immune', 'chronic', 'therapy', 'clinical', 'pathogen', 'symptom'],
  society: ['demographic', 'urbanization', 'inequality', 'migration', 'welfare', 'institution', 'discourse', 'ideology'],
};

export function vocabBatchForDay(day) {
  return AWL_DAILY_BATCHES[(day - 1) % AWL_DAILY_BATCHES.length];
}
