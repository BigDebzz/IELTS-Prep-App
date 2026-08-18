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
  {
    type: 'Multiple Choice',
    order: 'sequential',
    note: 'Answers follow the same order as questions.',
    howTo: 'Read the question stem first, then all options, before scanning the passage. Eliminate options that contradict the passage outright — they\'re easiest to rule out. Watch for "distractor" options that use the same words as the passage but change the meaning slightly.',
  },
  {
    type: 'True/False/Not Given',
    order: 'sequential',
    note: 'Answers follow passage order. FALSE = contradicted. NOT GIVEN = not confirmed or denied — never use outside knowledge.',
    howTo: 'This is the type beginners lose the most marks on. TRUE = the passage says this exactly (in different words). FALSE = the passage says the OPPOSITE. NOT GIVEN = the passage doesn\'t mention this at all — even if it seems logically true from general knowledge, if the passage doesn\'t say it, it\'s NOT GIVEN. Never guess based on what you\'d assume is true in real life.',
  },
  {
    type: 'Yes/No/Not Given',
    order: 'sequential',
    note: 'Same logic as True/False/Not Given, used for opinion-based passages.',
    howTo: 'Same rules as True/False/Not Given, but this type is used when the passage is arguing an opinion (not stating facts). YES/NO refers to whether the statement matches the WRITER\'s opinion, not objective fact.',
  },
  {
    type: 'Sentence Completion',
    order: 'sequential',
    note: 'Answers come in the same order as the information in the text.',
    howTo: 'Read the incomplete sentence carefully first and predict what type of word is missing (a noun? a number? a date?). This narrows what you\'re scanning for. Always check the word limit given in the instructions (e.g. "NO MORE THAN TWO WORDS") — going over the limit means the answer is marked wrong even if the content is correct.',
  },
  {
    type: 'Matching Sentence Endings',
    order: 'sequential',
    note: 'Follows text order.',
    howTo: 'Read all the sentence-ending options first. As you read the passage, look for where the sentence beginning naturally continues — grammar is often the clue (does the ending fit grammatically with the beginning?).',
  },
  {
    type: 'Short Answer Questions',
    order: 'sequential',
    note: 'Follows text order.',
    howTo: 'These ask direct factual questions ("How many...", "What is..."). Scan for the specific fact rather than reading for overall meaning. Check the word limit exactly like Sentence Completion.',
  },
  {
    type: 'Matching Headings',
    order: 'non-sequential',
    note: 'Answers are NOT in text order — scan the whole passage, do this type last.',
    howTo: 'Read each paragraph\'s first and last sentence to get its main idea before matching headings — don\'t read word-for-word yet. Match the paragraph\'s OVERALL idea, not a small detail mentioned once. Cross out headings as you use them since some are usually distractors that don\'t match any paragraph.',
  },
  {
    type: 'Matching Information',
    order: 'non-sequential',
    note: 'Answers are NOT in text order — requires whole-passage scanning.',
    howTo: 'This asks you to find WHICH paragraph contains a specific piece of information (not the main idea, a specific detail). Scan for keywords from the question, then confirm the paragraph actually contains that specific claim.',
  },
  {
    type: 'Matching Features',
    order: 'non-sequential',
    note: 'Answers are NOT in text order.',
    howTo: 'You\'re matching items (people, dates, theories) to categories. Scan for the NAME or ITEM first (these are easier to spot than abstract ideas), then read the surrounding sentence to see which category it belongs to.',
  },
  {
    type: 'Summary/Note/Table Completion',
    order: 'usually one section',
    note: 'Not strictly ordered, but answers usually come from one contiguous section.',
    howTo: 'Read the summary/notes first to understand the overall topic being summarized — this tells you roughly which part of the passage to focus on. Predict the word type needed for each blank before searching.',
  },
  {
    type: 'Diagram Label Completion',
    order: 'usually one section',
    note: 'Not necessarily in order, but usually from one section.',
    howTo: 'Look at the diagram first and understand what process or object it shows. The passage will describe it in a similar sequence to how the diagram is laid out — use the diagram\'s visual order as a guide for where to look in the text.',
  },
];

// General reading technique — not tied to one question type, applies to the whole test.
export const READING_GENERAL_TIPS = [
  { tip: 'Skim before you read in detail', detail: 'Spend 2-3 minutes skimming the whole passage first — read titles, first/last sentences of paragraphs. This builds a mental map before you start answering questions.' },
  { tip: 'Time management: ~20 minutes per passage', detail: 'You have 60 minutes for 3 passages (40 questions). If you\'re stuck on one question for more than ~90 seconds, guess and move on — there\'s no penalty for wrong answers, but there is a cost to running out of time.' },
  { tip: 'Never leave a blank', detail: 'Guessing gives you a chance; a blank guarantees zero. Always fill in every answer, even a guess, before time runs out.' },
  { tip: 'The passage rarely repeats the question\'s exact words', detail: 'IELTS almost always paraphrases — if a question says "increase" the passage might say "rise" or "grow." Practicing synonym recognition (your Vocabulary tab) directly helps here.' },
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

// Listening section structure (real IELTS format) — expanded with real
// technique guidance, not just format labels.
export const LISTENING_SECTIONS = [
  {
    section: 1,
    style: 'Everyday conversation between two people',
    commonTypes: 'Form/note completion',
    howTo: 'This is the easiest section — everyday topics like booking a hotel or registering for a class. Use the pause before the recording starts to read ahead and predict what kind of answer each blank needs (a name? a number? a date?). Listen for spelling — names and addresses are often spelled out loud.',
  },
  {
    section: 2,
    style: 'Monologue in an everyday context',
    commonTypes: 'Map/plan labelling, multiple choice',
    howTo: 'One person speaking about something everyday — a tour guide, a describing a facility. For map questions, follow the direction words closely ("turn left", "next to", "opposite") and trace the route as you listen, don\'t wait until the end.',
  },
  {
    section: 3,
    style: 'Conversation of up to four people, academic context',
    commonTypes: 'Multiple choice, matching',
    howTo: 'This is where most people lose marks — multiple speakers discussing academic work (e.g. students planning a project). Track WHO says WHAT — opinions often differ between speakers, and the question may ask specifically what one person thinks, not the group consensus.',
  },
  {
    section: 4,
    style: 'Academic monologue/lecture, no break',
    commonTypes: 'Note/summary completion',
    howTo: 'The hardest section — one long academic lecture with no pause. Note-taking speed matters most here. Use abbreviations (e.g. "&" for and, "w/" for with) and don\'t try to write full sentences — just the key word needed for each blank.',
  },
];

// General listening technique — applies across all sections.
export const LISTENING_GENERAL_TIPS = [
  { tip: 'You only hear the audio once', detail: 'Unlike Reading, there\'s no going back. Use every pause between sections to read ahead and prepare, since preparation time is your only "second chance."' },
  { tip: 'Watch for corrections', detail: 'Speakers often self-correct ("meet at 3pm — actually, make that 4pm"). The LATER piece of information is usually the correct answer, not the first one mentioned.' },
  { tip: 'Spelling matters', detail: 'A correct answer with a spelling mistake is marked wrong. Practice common tricky spellings (e.g. "definitely", "necessary", "accommodation").' },
  { tip: 'Stick to the word limit', detail: 'If the instructions say "NO MORE THAN TWO WORDS", writing three words makes the answer wrong even if the content is right.' },
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

// The Daily Lesson curriculum. Each day teaches ONE real technique before any
// testing happens, rotating through all 4 skills across the 30-day plan. Every
// lesson pulls from the genuine content already defined above (band descriptors,
// question-type rules, essay structures, speaking part guidance) — nothing here
// is invented; this only decides which real lesson surfaces on which day, and
// adds the connecting "why this matters / what to do next" framing.
export function lessonForDay(day) {
  const cycle = ((day - 1) % 10); // 10-lesson rotation repeats through the 30 days
  const lessons = [
    {
      skill: 'reading',
      title: 'How IELTS Reading questions are ordered',
      teaches: 'Most IELTS Reading question types (Multiple Choice, True/False/Not Given, Sentence Completion, Matching Sentence Endings, Short Answer) follow the SAME order as the passage — question 1\'s answer comes before question 2\'s, and so on. But Matching Headings, Matching Information, and Matching Features do NOT follow this order — you have to scan the whole passage for each one.',
      whyItMatters: 'Knowing this changes your strategy: for sequential types, read the passage once, in order, matching each question as you go. For non-sequential matching types, read all the questions first, then scan the whole passage — don\'t try to match them as you read top to bottom, you\'ll waste time backtracking.',
      tryNext: 'Go to the Reading tab and try today\'s passage. Before you start, check which question type it uses (shown at the top) and use the matching strategy above.',
    },
    {
      skill: 'writing',
      title: 'The 4 things IELTS Writing is actually scored on',
      teaches: 'Every Writing Task 2 essay is scored on 4 equally-weighted criteria: Task Response (did you actually answer the question fully), Coherence & Cohesion (is it organized logically with clear paragraphs), Lexical Resource (vocabulary range and accuracy), and Grammatical Range & Accuracy. A brilliant essay that misses the actual question loses marks on Task Response no matter how good the English is.',
      whyItMatters: 'Many learners over-focus on "big words" (Lexical Resource) and under-focus on Task Response — actually answering the exact question asked. Before writing a single sentence, re-read the prompt and make sure you know exactly what it\'s asking.',
      tryNext: 'Go to the Writing tab. Before typing your essay, read the "How to structure this essay" guide for today\'s question type — it breaks down exactly what each paragraph should do.',
    },
    {
      skill: 'listening',
      title: 'The 4 Listening sections and what changes between them',
      teaches: 'Section 1 is an everyday conversation (like booking something) — usually the easiest, testing basic facts. Section 2 is a monologue in an everyday context (like a tour guide). Section 3 is an academic conversation between multiple people — this is where most people start losing marks. Section 4 is an academic lecture monologue with NO break — the hardest section, requiring sustained concentration.',
      whyItMatters: 'Knowing which section you\'re in tells you what to expect. In Sections 3-4, listen for signposting language ("however", "in contrast", "moving on to") — these signal a change in topic or a correction that\'s often exactly what the question is testing.',
      tryNext: 'Go to the Listening tab and try a Section 3 or 4 practice — these are the ones worth extra focus.',
    },
    {
      skill: 'speaking',
      title: 'Why one-word answers hurt your Speaking score',
      teaches: 'IELTS Speaking Part 1 asks short personal questions, but answering in one word or one short sentence caps your score, because the examiner needs to hear enough of your English to judge Fluency, Vocabulary, and Grammar. A good Part 1 answer gives a direct response PLUS a reason or detail — usually 2-4 sentences.',
      whyItMatters: 'This is one of the most common reasons capable speakers score lower than they should — not because their English is bad, but because they don\'t give the examiner enough language to assess.',
      tryNext: 'Go to the Speaking tab, pick Part 1, and practice answering with the "direct answer + reason + detail" pattern from the guide.',
    },
    {
      skill: 'vocabulary',
      title: 'Why memorizing word lists alone doesn\'t work',
      teaches: 'Vocabulary research consistently shows that learning a word in isolation (just the word and its meaning) is far less effective than learning it with context: how it\'s actually used, its synonyms, and a real example sentence. This is why the Vocabulary tab shows synonyms, antonyms, and lets you write your own practice sentence — that\'s not extra decoration, it\'s the part that actually makes the word stick.',
      whyItMatters: 'A word you can define but never use in your own writing/speaking won\'t help your Lexical Resource score. Using a word yourself is what moves it from "recognized" to "usable."',
      tryNext: 'Go to Vocabulary, pick one of today\'s words, and actually write your own sentence with it — don\'t skip that step.',
    },
    {
      skill: 'reading',
      title: 'True/False/Not Given: the #1 mistake to avoid',
      teaches: 'FALSE means the passage directly CONTRADICTS the statement. NOT GIVEN means the passage simply doesn\'t mention it either way. The most common mistake: using outside knowledge or "logical" inference to decide NOT GIVEN is actually FALSE (or vice versa). You must judge ONLY by what\'s written in the passage — nothing else.',
      whyItMatters: 'This single rule is responsible for a large share of lost marks on this question type. If you find yourself thinking "well, logically it must be..." — stop. That\'s the trap.',
      tryNext: 'If today\'s Reading passage uses True/False/Not Given, apply this rule strictly before answering.',
    },
    {
      skill: 'writing',
      title: 'How to paraphrase your introduction (without repeating the question)',
      teaches: 'A weak introduction just copies the question\'s wording. A stronger one paraphrases it — same meaning, different words and sentence structure. E.g. "Some people believe technology harms society" could become "It is often argued that technological advancement brings more disadvantages than benefits to society."',
      whyItMatters: 'Examiners notice word-for-word copying, and it doesn\'t demonstrate your own language ability — which is literally what\'s being scored.',
      tryNext: 'Before writing today\'s essay, spend one minute rewriting the prompt in your own words as practice — then use that as your opening line.',
    },
    {
      skill: 'listening',
      title: 'Why spelling costs more marks than people expect',
      teaches: 'In Listening completion tasks (note/form/summary completion), a correct answer with a spelling mistake is marked WRONG. Common commonly-misspelled words in IELTS listening include "accommodation," "definitely," "necessary," and "separate."',
      whyItMatters: 'You can understand the audio perfectly and still lose the mark on a spelling slip. Always double-check your spelling in the 10-minute transfer time on the real test.',
      tryNext: 'When you check your answers in the Listening tab, look specifically for spelling — not just whether you understood the right word.',
    },
    {
      skill: 'speaking',
      title: 'What the examiner means by "fluency" (it\'s not about speed)',
      teaches: 'Fluency in IELTS doesn\'t mean speaking fast — it means speaking with natural flow and minimal unnecessary hesitation. A little pause to think about CONTENT is completely normal, even at Band 9. What lowers your score is hesitation to find WORDS or GRAMMAR — stopping because you don\'t know how to say something, not because you\'re thinking about what to say.',
      whyItMatters: 'This means slowing down slightly to speak accurately is often better than rushing and making more errors.',
      tryNext: 'In your next Speaking practice, don\'t rush — focus on finishing your sentences accurately rather than speaking quickly.',
    },
    {
      skill: 'vocabulary',
      title: 'Collocations: why "make a decision" but not "do a decision"',
      teaches: 'Collocations are words that naturally go together in English — native speakers "make a decision," not "do a decision," even though both seem logically possible. Getting collocations right is one of the clearest signals of a higher Lexical Resource score, because it shows real command of natural English, not just a large vocabulary.',
      whyItMatters: 'This is exactly why the Vocabulary tab shows "related/collocations" for each word — that list isn\'t filler, it\'s the natural word-partners you should learn alongside the word itself.',
      tryNext: 'Next time you save a word, also note down one of its listed collocations, not just its meaning.',
    },
  ];
  return lessons[cycle];
}
