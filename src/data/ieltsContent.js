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
// Writing Task 2 essay types — expanded into a real paragraph-by-paragraph
// teaching guide (not just a one-line summary), so a first-time IELTS
// candidate can see exactly what belongs in each paragraph before writing,
// not just be scored on the result afterward.
export const WRITING_TASK2_TYPES = [
  {
    type: 'Opinion (Agree/Disagree)',
    structure: 'Intro with clear thesis → 2 body paragraphs supporting your position → conclusion restating position.',
    howTo: [
      { part: 'Introduction (2-3 sentences)', guidance: 'Paraphrase the question in your own words, then clearly state your opinion. Do not repeat the question word-for-word.' },
      { part: 'Body Paragraph 1', guidance: 'Give your strongest reason for your opinion. State the reason in one sentence, then explain it, then give a specific example (a real or realistic scenario) to support it.' },
      { part: 'Body Paragraph 2', guidance: 'Give a second, different reason. Same pattern: state it, explain it, example it. Do not just repeat paragraph 1 in different words.' },
      { part: 'Conclusion (1-2 sentences)', guidance: 'Restate your opinion in different words from the introduction. Briefly summarize your two reasons. No new ideas here.' },
    ],
    example: 'Example opening: "While some argue that [opposing view], I believe that [your position], primarily because of [reason 1] and [reason 2]."',
  },
  {
    type: 'Discussion (Both Views)',
    structure: 'Intro → paragraph on view 1 → paragraph on view 2 → your opinion stated clearly → conclusion.',
    howTo: [
      { part: 'Introduction', guidance: 'Paraphrase the question, mention that there are two views, without yet giving your own opinion.' },
      { part: 'Body Paragraph 1', guidance: 'Explain the FIRST view fairly and fully, as if you believed it — reason plus example. Do not criticize it yet.' },
      { part: 'Body Paragraph 2', guidance: 'Explain the SECOND view the same way — reason plus example.' },
      { part: 'Your opinion', guidance: 'Many band 7+ essays fold this into the conclusion or add a short paragraph: state clearly which view you find more convincing and why.' },
      { part: 'Conclusion', guidance: 'Summarize both views were considered, restate your opinion clearly.' },
    ],
    example: 'Example structure phrase: "On one hand, ... On the other hand, ... In my view, the former/latter argument is more convincing because..."',
  },
  {
    type: 'Advantages/Disadvantages',
    structure: 'Intro → advantages paragraph → disadvantages paragraph → conclusion (with opinion if asked).',
    howTo: [
      { part: 'Introduction', guidance: 'Paraphrase the topic, state that it has both advantages and disadvantages (don\'t list them yet).' },
      { part: 'Body Paragraph 1 — Advantages', guidance: 'Pick 1-2 real advantages. State each, explain why it matters, give an example.' },
      { part: 'Body Paragraph 2 — Disadvantages', guidance: 'Same pattern for 1-2 disadvantages.' },
      { part: 'Conclusion', guidance: 'If the question asks for your opinion ("do advantages outweigh disadvantages?"), answer that directly here. If not, just summarize both sides briefly.' },
    ],
    example: 'Example linking phrase: "Despite these benefits, however, there are notable drawbacks to consider."',
  },
  {
    type: 'Problem/Solution',
    structure: 'Intro → problems paragraph → solutions paragraph (linked to the problems) → conclusion.',
    howTo: [
      { part: 'Introduction', guidance: 'Paraphrase the topic and state that it presents both problems and possible solutions.' },
      { part: 'Body Paragraph 1 — Problems', guidance: 'Describe 1-2 specific, real problems with cause-and-effect explanation (this causes that, which leads to...).' },
      { part: 'Body Paragraph 2 — Solutions', guidance: 'Give solutions that directly address the SAME problems you named in paragraph 1 — don\'t introduce new unrelated problems here.' },
      { part: 'Conclusion', guidance: 'Briefly restate the main problem and your recommended solution.' },
    ],
    example: 'Example linking phrase: "One effective way to address this issue would be to..."',
  },
  {
    type: 'Two-Part Question',
    structure: 'Intro → paragraph fully answering Q1 → paragraph fully answering Q2 → conclusion.',
    howTo: [
      { part: 'Introduction', guidance: 'Paraphrase the topic. You can briefly signal both questions you\'ll answer.' },
      { part: 'Body Paragraph 1', guidance: 'Answer the FIRST question completely — reason plus example. This is a very common mistake area: make sure you actually answer the specific question asked, not a related but different one.' },
      { part: 'Body Paragraph 2', guidance: 'Answer the SECOND question completely, same pattern.' },
      { part: 'Conclusion', guidance: 'Briefly summarize your answer to both questions.' },
    ],
    example: 'Both questions must be answered fully — a common Band 5-6 mistake is answering only one question well and rushing the other.',
  },
];

// Speaking Part 1/2/3 structure and real recurring topics — expanded with
// concrete "what a good answer looks like" guidance, not just timing/format.
export const SPEAKING_STRUCTURE = {
  part1: {
    duration: '4-5 min',
    style: 'Short personal questions',
    tip: 'Give 3-4 sentence answers with a reason or example, not one-word answers.',
    howTo: 'A weak answer is one sentence ("I live in Lagos"). A good answer adds WHY or a detail: "I live in Lagos, which is Nigeria\'s largest city — I\'ve been there for about five years and I really like how busy and energetic it feels." Structure: direct answer → one reason or detail → optionally a small extra comment.',
    example: 'Q: "Do you like your job?" — Weak: "Yes, I like it." Better: "Yes, I do, mainly because it involves a lot of variety — no two days look the same, which keeps things interesting for me."',
  },
  part2: {
    duration: '1 min prep + up to 2 min speaking',
    style: 'Cue card topic',
    tip: 'Use the full 2 minutes; jot 3-4 bullet points during prep.',
    howTo: 'The cue card gives you a topic plus 3-4 sub-points to cover (e.g. "what it is, when it happened, who was involved, why it was memorable"). During your 1-minute prep, jot one keyword per bullet point — not full sentences, just memory triggers. When speaking, address each bullet point in order, then add a closing thought if you have time left.',
    example: 'If the bullets are "describe a gift, say who gave it, say why it was special" — cover all three in order, spending roughly equal time on each, rather than talking at length about only the first one.',
  },
  part3: {
    duration: '4-5 min',
    style: 'Abstract discussion linked to Part 2 topic',
    tip: 'Use conditionals, hypotheticals, and speculation language; give developed answers (20-40 sec each).',
    howTo: 'These questions are broader and more abstract than Part 1 (e.g. "How has gift-giving changed in your country?" rather than "What was your last gift?"). A good answer: gives a direct position, then develops it with a reason AND a specific example or comparison, and isn\'t afraid to speculate ("I think this is probably because...", "It\'s likely that...").',
    example: 'Q: "Do you think technology has changed how people give gifts?" — Aim for: a clear position + a specific reason + a real-world example, roughly 4-5 sentences, not a one-line answer.',
  },
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
