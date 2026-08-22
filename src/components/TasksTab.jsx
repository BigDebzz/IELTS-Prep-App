import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getTasksForDay, weekForDay, SKILL_COLORS, SKILL_LABELS } from '../data/planData';
import ProgressCard from './ProgressCard';

// Short task titles — the long descriptive text was cluttering the UI.
// Full instructions live inside each skill tab; the checklist is just a reminder.
const SHORT_TITLES = {
  'Vocab: look up 5-8 new words in the Vocabulary tab, log meaning + synonyms + antonyms + a sentence': 'Look up 5-8 new words in the Vocabulary tab',
  'Generate 1 Reading practice (rotate question types) in the Reading tab, complete it timed, review answers': 'Complete a Reading practice in the Reading tab',
  'Generate 1 Listening practice, use text-to-speech playback, complete it, review': 'Complete a Listening practice in the Listening tab',
  'Write 1 full Task 1 or Task 2 in the Writing tab, get AI band feedback against real descriptors': 'Write an essay in the Writing tab and get feedback',
  'Answer 1 Speaking topic (type or transcribe your spoken answer) in the Speaking tab, get feedback': 'Answer a Speaking topic and get feedback',
  'Full mock: one Reading, one Listening, one Writing Task 1+2, one Speaking Part 1-3 — log all 4 scores': 'Full mock test — all 4 skills, timed',
  'Taper: light vocab review only, confirm test logistics, sleep well — no cramming': 'Light review only — rest and prepare',
  'Read the real IELTS band descriptors in the Reference tab — know exactly what 7 vs 8 vs 9 means for each module': 'Read the Daily Tips tab — understand what each band means',
  "Review this week's vocabulary; check your error log for patterns": "Review this week's vocabulary",
};

function shortTitle(title) {
  return SHORT_TITLES[title] || title;
}

export async function ensureSeeded(userId, selectedDay) {
  if (selectedDay <= 30) {
    const { count, error: countErr } = await supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', userId);
    if (countErr) { console.error(countErr.message); return; }
    if (count && count > 0) return;
    const rows = [];
    for (let day = 1; day <= 30; day++) {
      getTasksForDay(day).forEach(t => rows.push({ user_id: userId, day_number: day, skill: t.skill, title: t.title, done: false }));
    }
    const { error } = await supabase.from('tasks').insert(rows);
    if (error) console.error('Seed failed:', error.message);
  } else {
    const { count } = await supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('day_number', selectedDay);
    if (count && count > 0) return;
    const rows = [];
    getTasksForDay(selectedDay).forEach(t => rows.push({ user_id: userId, day_number: selectedDay, skill: t.skill, title: t.title, done: false }));
    const { error } = await supabase.from('tasks').insert(rows);
    if (error) console.error('Extended day seed failed:', error.message);
  }
}

export default function TasksTab({ user, selectedDay }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await ensureSeeded(user.id, selectedDay);
      const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('day_number');
      if (!error) setTasks(data);
      setLoading(false);
    }
    init();
  }, [user.id, selectedDay]);

  async function toggle(task) {
    const { error } = await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id);
    if (error) { console.error(error.message); return; }
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
  }

  const dayTasks = useMemo(() => tasks.filter(t => t.day_number === selectedDay), [tasks, selectedDay]);
  const week = weekForDay(selectedDay);
  const doneCount = dayTasks.filter(t => t.done).length;
  const total = dayTasks.length;
  const allDone = total > 0 && doneCount === total;

  if (loading) return <p style={s.hint}>Loading…</p>;

  return (
    <>
      <ProgressCard user={user} />

      <section style={s.section}>
        <div style={s.header}>
          <div>
            <h2 style={s.title}>Day {selectedDay}</h2>
            {week && <p style={s.weekLabel}>{week.label}</p>}
            {week?.focus && <p style={s.focus}>{week.focus}</p>}
          </div>
          {total > 0 && (
            <div style={s.ring}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#2a2a2a" strokeWidth="4" />
                <circle
                  cx="26" cy="26" r="22" fill="none"
                  stroke={allDone ? '#4ade80' : '#8b8cf8'}
                  strokeWidth="4"
                  strokeDasharray={`${(doneCount / total) * 138} 138`}
                  strokeLinecap="round"
                  transform="rotate(-90 26 26)"
                />
              </svg>
              <span style={s.ringLabel}>{doneCount}/{total}</span>
            </div>
          )}
        </div>

        {allDone && (
          <div style={s.allDoneBanner}>
            ✓ All done for today — great work. Come back tomorrow.
          </div>
        )}

        {dayTasks.length === 0 && (
          <p style={s.hint}>No tasks for this day yet.</p>
        )}

        <ul style={s.list}>
          {dayTasks.map(task => (
            <li key={task.id} style={s.item} onClick={() => toggle(task)}>
              <span style={{ ...s.check, ...(task.done ? s.checkDone : {}) }}>
                {task.done ? '✓' : ''}
              </span>
              <span style={{ ...s.tag, background: SKILL_COLORS[task.skill] + '22', color: SKILL_COLORS[task.skill] }}>
                {SKILL_LABELS[task.skill]}
              </span>
              <span style={{ ...s.text, ...(task.done ? s.textDone : {}) }}>
                {shortTitle(task.title)}
              </span>
            </li>
          ))}
        </ul>

        <p style={s.hint}>Tick each item when you've completed it in the relevant tab. Tap any item to mark it done.</p>
      </section>
    </>
  );
}

const s = {
  section: { background: '#121212', borderRadius: 16, padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 800, margin: '0 0 2px' },
  weekLabel: { fontSize: 12, color: '#8b8cf8', margin: '0 0 2px', fontWeight: 600 },
  focus: { fontSize: 11, color: '#a3a3a3', margin: 0, lineHeight: 1.4 },
  ring: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ringLabel: { position: 'absolute', fontSize: 11, fontWeight: 700, color: '#f5f5f5' },
  allDoneBanner: { background: '#4ade8015', border: '1px solid #4ade8044', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#4ade80', marginBottom: 16 },
  list: { listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 8 },
  item: { display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '10px 0', borderBottom: '1px solid #1a1a1a' },
  check: { width: 20, height: 20, borderRadius: 6, border: '2px solid #2a2a2a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#4ade80', marginTop: 1 },
  checkDone: { background: '#4ade8022', borderColor: '#4ade80' },
  tag: { fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 },
  text: { fontSize: 14, lineHeight: 1.4, color: '#f5f5f5' },
  textDone: { color: '#4a4a4a', textDecoration: 'line-through' },
  hint: { fontSize: 11, color: '#4a4a4a', lineHeight: 1.5 },
};
