// src/data/planData.js
export const WEEKS = [
  { range: [1, 7], label: 'Week 1 — Diagnose & Foundations', focus: '60% input (Reading/Listening/Vocab) / 40% output (Writing/Speaking)' },
  { range: [8, 14], label: 'Week 2 — Skill Building', focus: '50% input / 50% output' },
  { range: [15, 21], label: 'Week 3 — Consolidation & Weak-Type Intensives', focus: '40% input / 60% output' },
  { range: [22, 30], label: 'Week 4 — Full Mocks & Refinement', focus: 'Mock-test cycle + targeted error correction only' },
];

// Continuous practice phases — apply to days 31+ in repeating 7-day cycles.
// The plan never ends; difficulty and focus shift every week.
const EXTENDED_PHASES = [
  { label: 'Extended: Accuracy Week', focus: 'Focus on eliminating your most repeated errors — review your error log and target weak spots only' },
  { label: 'Extended: Fluency Week', focus: 'Write and speak faster without stopping to check — prioritise completing full responses under time pressure' },
  { label: 'Extended: Vocabulary Week', focus: 'Every task this week: use at least 5 words from your saved vocabulary list — actively apply what you\'ve learned' },
  { label: 'Extended: Mock Week', focus: 'Full exam simulation — timed, all four skills, no looking at guides, treat it as the real test' },
];

export function weekForDay(day) {
  if (day <= 30) return WEEKS.find(w => day >= w.range[0] && day <= w.range[1]);
  // Days 31+: cycle through extended phases in 7-day blocks
  const phaseIndex = Math.floor((day - 31) / 7) % EXTENDED_PHASES.length;
  return { ...EXTENDED_PHASES[phaseIndex], range: null };
}

const DAILY_CONSTANTS = [
  { skill: 'vocabulary', title: "Vocab: look up 5-8 new words in the Vocabulary tab, log meaning + synonyms + antonyms + a sentence" },
];

const DAY_SPECIFIC = {
  1: [
    { skill: 'review', title: 'Read the real IELTS band descriptors in the Reference tab — know exactly what 7 vs 8 vs 9 means for each module' },
  ],
  7: [
    { skill: 'review', title: 'Review this week\'s vocabulary; check your error log for patterns' },
  ],
};

const SKILL_BUILD_TEMPLATE = [
  { skill: 'reading', title: 'Generate 1 Reading practice (rotate question types) in the Reading tab, complete it timed, review answers' },
  { skill: 'listening', title: 'Generate 1 Listening practice, use text-to-speech playback, complete it, review' },
  { skill: 'writing', title: 'Write 1 full Task 1 or Task 2 in the Writing tab, get AI band feedback against real descriptors' },
  { skill: 'speaking', title: 'Answer 1 Speaking topic (type or transcribe your spoken answer) in the Speaking tab, get feedback' },
];

const FULL_MOCK_DAYS = [22, 25, 28];

// Extended-phase daily tasks — rotate based on which extended phase week you're in.
function getExtendedTasks(day) {
  const phaseIndex = Math.floor((day - 31) / 7) % EXTENDED_PHASES.length;
  const baseTasks = [...DAILY_CONSTANTS, ...SKILL_BUILD_TEMPLATE];
  const phaseExtras = [
    // Accuracy week
    [{ skill: 'review', title: 'Review your Writing History — find one repeated error and rewrite that sentence correctly 3 times' }],
    // Fluency week
    [{ skill: 'writing', title: 'Timed writing: set a 40-minute timer, write a full Task 2 without stopping or editing — submit whatever you have when time runs out' }],
    // Vocabulary week
    [{ skill: 'vocabulary', title: 'Before writing today, pick 5 words from your Saved Words list and plan how you will use them in your essay' }],
    // Mock week
    [{ skill: 'mock', title: 'Full timed mock: all 4 skills back to back with no guides open — treat it as the real exam' }],
  ];
  return [...baseTasks, ...(phaseExtras[phaseIndex] || [])];
}

export function getTasksForDay(day) {
  if (day > 30) return getExtendedTasks(day);
  const tasks = [...DAILY_CONSTANTS];
  if (DAY_SPECIFIC[day]) { tasks.push(...DAY_SPECIFIC[day]); return tasks; }
  if (FULL_MOCK_DAYS.includes(day)) {
    tasks.push({ skill: 'mock', title: 'Full mock: one Reading, one Listening, one Writing Task 1+2, one Speaking Part 1-3 — log all 4 scores' });
    return tasks;
  }
  tasks.push(...SKILL_BUILD_TEMPLATE);
  if (day >= 29) {
    tasks.push({ skill: 'review', title: 'Taper: light vocab review only, confirm test logistics, sleep well — no cramming' });
  }
  return tasks;
}

export const SKILL_COLORS = {
  listening: '#3b82f6', reading: '#10b981', writing: '#f59e0b',
  speaking: '#ef4444', vocabulary: '#8b5cf6', mock: '#ec4899', review: '#6b7280',
};
export const SKILL_LABELS = {
  listening: 'Listening', reading: 'Reading', writing: 'Writing',
  speaking: 'Speaking', vocabulary: 'Vocabulary', mock: 'Mock Test', review: 'Review',
};
