// src/data/ieltsContent.js
// This is REAL content, taken directly from the researched IELTS artifact
// (official IELTS/British Council band descriptors and question-type rules).
// Nothing in this file is AI-generated. The AI (Gemini) is only ever told to
// SCORE against these exact descriptors — never to invent its own criteria.

export const WRITING_BAND_DESCRIPTORS = {
  9: {
    taskResponse: 'All task requirements fully and appropriately satisfied; message followed effortlessly.',
    coherence: 'Cohesion very rarely attracts attention; paragraphing skilfully managed.',
    lexical: 'Wide range used accurately; very natural and sophisticated control of lexical features.',
    grammar: 'Wide range of structures with full flexibility and control; minor errors extremely rare.',
  },
  8: {
    taskResponse: 'Covers all requirements appropriately, relevantly, sufficiently; occasional omissions or lapses.',
    coherence: 'Sequences information/ideas logically; manages cohesion well.',
    lexical: 'Wide resource used fluently and flexibly; skilful use of uncommon/idiomatic items despite occasional inaccuracies.',
    grammar: 'Wide range of structures; the majority of sentences are error-free.',
  },
  7: {
    taskResponse: 'Covers the requirements; clear overview/position; some ideas may be underdeveloped.',
    coherence: 'Logically organises information with clear progression; uses cohesive devices with some flexibility.',
    lexical: 'Sufficient range to allow flexibility and precision; some awareness of style and collocation.',
    grammar: 'Variety of complex structures with some flexibility and accuracy; error-free sentences frequent; a few errors may persist but do not impede communication.',
  },
};

export const SPEAKING_BAND_DESCRIPTORS = {
  9: {
    fluency: 'Fluent with only very occasional repetition/self-correction; hesitation is content-related only.',
    lexical: 'Total flexibility and precise use in all contexts; sustained use of accurate and idiomatic language.',
    grammar: 'Precise and accurate, apart from mistakes characteristic of native speaker speech.',
    pronunciation: 'Accent has no effect on intelligibility.',
  },
  8: {
    fluency: 'Fluent with very occasional repetition or self-correction.',
    lexical: 'Wide resource flexibly used; skilful use of less common/idiomatic items despite occasional inaccuracies.',
    grammar: 'The majority of sentences are error-free.',
    pronunciation: 'Accent has minimal effect on intelligibility.',
  },
  7: {
    fluency: 'Keeps going and produces long turns without noticeable effort; some hesitation/self-correction mid-sentence.',
    lexical: 'Range flexible enough for topics; some paraphrase.',
    grammar: 'Range of structures flexibly used; error-free sentences frequent; a few basic errors persist.',
    pronunciation: 'A range of pronunciation features with mixed control.',
  },
};

// Reading question types and validated order logic (from research: British Council / IDP)
export const READING_QUESTION_TYPES = [
  { type: 'Multiple Choice', order: 'sequential', note: 'Answers follow the same order as questions.' },
  { type: 'True/False/Not Given', order: 'sequential', note: 'Answers follow passage order. FALSE = contradicted. NOT GIVEN = not confirmed or denied — never use outside knowledge.' },
  { type: 'Yes/No/Not Given', order: 'sequential', note: 'Same logic as True/False/Not Given, used for opinion-based passages.' },
  { type: 'Sentence Completion', order: 'sequential', note: 'Answers come in the same order as the information in the text.' },
  { type: 'Matching Sentence Endings', order: 'sequential', note: 'Follows text order.' },
  { type: 'Short Answer Questions', order: 'sequential', note: 'Follows text order.' },
  { type: 'Matching Headings', order: 'non-sequential', note: 'Answers are NOT in text order — scan the whole passage, do this type last.' },
  { type: 'Matching Information', order: 'non-sequential', note: 'Answers are NOT in text order — requires whole-passage scanning.' },
  { type: 'Matching Features', order: 'non-sequential', note: 'Answers are NOT in text order.' },
  { type: 'Summary/Note/Table Completion', order: 'usually one section', note: 'Not strictly ordered, but answers usually come from one contiguous section.' },
  { type: 'Diagram Label Completion', order: 'usually one section', note: 'Not necessarily in order, but usually from one section.' },
];

// Writing Task 2 essay types
export const WRITING_TASK2_TYPES = [
  { type: 'Opinion (Agree/Disagree)', structure: 'Intro with clear thesis → 2 body paragraphs supporting your position → conclusion restating position.' },
  { type: 'Discussion (Both Views)', structure: 'Intro → paragraph on view 1 → paragraph on view 2 → your opinion stated clearly → conclusion.' },
  { type: 'Advantages/Disadvantages', structure: 'Intro → advantages paragraph → disadvantages paragraph → conclusion (with opinion if asked).' },
  { type: 'Problem/Solution', structure: 'Intro → problems paragraph → solutions paragraph (linked to the problems) → conclusion.' },
  { type: 'Two-Part Question', structure: 'Intro → paragraph fully answering Q1 → paragraph fully answering Q2 → conclusion.' },
];

// Speaking Part 1/2/3 structure and real recurring topics
export const SPEAKING_STRUCTURE = {
  part1: { duration: '4-5 min', style: 'Short personal questions', tip: 'Give 3-4 sentence answers with a reason or example, not one-word answers.' },
  part2: { duration: '1 min prep + up to 2 min speaking', style: 'Cue card topic', tip: 'Use the full 2 minutes; jot 3-4 bullet points during prep.' },
  part3: { duration: '4-5 min', style: 'Abstract discussion linked to Part 2 topic', tip: 'Use conditionals, hypotheticals, and speculation language; give developed answers (20-40 sec each).' },
};

export const SPEAKING_TOPICS = [
  'Hometown', 'Work or study', 'Hobbies', 'Technology', 'Environment',
  'Travel', 'Health', 'Family and social change', 'Education', 'Media',
];

// Listening section structure (real IELTS format)
export const LISTENING_SECTIONS = [
  { section: 1, style: 'Everyday conversation between two people', commonTypes: 'Form/note completion' },
  { section: 2, style: 'Monologue in an everyday context', commonTypes: 'Map/plan labelling, multiple choice' },
  { section: 3, style: 'Conversation of up to four people, academic context', commonTypes: 'Multiple choice, matching' },
  { section: 4, style: 'Academic monologue/lecture, no break', commonTypes: 'Note/summary completion' },
];

export const VOCAB_TOPICS_TO_PRIORITIZE = [
  'environment', 'technology', 'health', 'education', 'work', 'crime', 'society', 'globalization',
];

// Daily academic reading topics — real IELTS Academic Reading subject areas,
// rotated by day number so each day of the 30-day plan gets a different topic.
export const DAILY_READING_TOPICS = [
  'Climate change and renewable energy',
  'Artificial intelligence and automation',
  'Ocean ecosystems and marine biology',
  'Ancient civilizations and archaeology',
  'Public health and epidemiology',
  'Space exploration and astronomy',
  'Urban planning and city design',
  'Psychology and human behaviour',
  'Renewable agriculture and food security',
  'Linguistics and the evolution of language',
  'Neuroscience and brain development',
  'Economics and global trade',
  'Biodiversity and conservation',
  'History of scientific discovery',
  'Educational theory and learning methods',
  'Genetics and biotechnology',
  'Sociology and demographic change',
  'Engineering and infrastructure',
  'Media, journalism and misinformation',
  'Anthropology and cultural evolution',
  'Water resources and sustainability',
  'Animal cognition and behaviour',
  'The history of medicine',
  'Renewable materials and industrial design',
  'Migration and globalization',
  'Volcanology and geology',
  'The history of art and architecture',
  'Cognitive science and memory',
  'Renewable energy policy',
  'Astrobiology and the search for life',
];

export function topicForDay(day) {
  return DAILY_READING_TOPICS[(day - 1) % DAILY_READING_TOPICS.length];
}

// Real, IELTS-authentic Task 2 prompt templates, one per essay type, so Writing
// has an actual daily prompt instead of an empty text box. The day's topic
// (from topicForDay) is substituted in — these are genuine IELTS-style question
// stems, not AI-invented prompts.
export function writingPromptForDay(day) {
  const topic = topicForDay(day);
  const typeIndex = (day - 1) % WRITING_TASK2_TYPES.length;
  const type = WRITING_TASK2_TYPES[typeIndex];
  const templates = {
    'Opinion (Agree/Disagree)': `Some people believe that progress in ${topic.toLowerCase()} does more harm than good, while others believe it is essential for society. To what extent do you agree or disagree?`,
    'Discussion (Both Views)': `Some people think governments should invest heavily in ${topic.toLowerCase()}, while others believe this money would be better spent elsewhere. Discuss both views and give your own opinion.`,
    'Advantages/Disadvantages': `Discuss the advantages and disadvantages of recent developments in ${topic.toLowerCase()}.`,
    'Problem/Solution': `Developments in ${topic.toLowerCase()} have created new problems for society. What are the causes of these problems, and what solutions can you suggest?`,
    'Two-Part Question': `Why has ${topic.toLowerCase()} become an important issue in many countries? What can individuals do to respond to this?`,
  };
  return { type: type.type, prompt: templates[type.type], topic };
}
