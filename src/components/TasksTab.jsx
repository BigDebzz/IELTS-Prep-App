import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getTasksForDay, weekForDay, SKILL_COLORS, SKILL_LABELS } from '../data/planData';
import ProgressCard from './ProgressCard';

export async function ensureSeeded(userId) {
  const { count, error: countErr } = await supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (countErr) { console.error(countErr.message); return; }
  if (count && count > 0) return;
  const rows = [];
  for (let day = 1; day <= 30; day++) {
    getTasksForDay(day).forEach(t => rows.push({ user_id: userId, day_number: day, skill: t.skill, title: t.title, done: false }));
  }
  const { error } = await supabase.from('tasks').insert(rows);
  if (error) console.error('Seed failed:', error.message);
}

export default function TasksTab({ user, selectedDay }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await ensureSeeded(user.id);
      const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('day_number');
      if (!error) setTasks(data);
      setLoading(false);
    }
    init();
  }, [user.id]);

  async function toggle(task) {
    const { error } = await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id);
    if (error) { console.error(error.message); return; }
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
  }

  const dayTasks = useMemo(() => tasks.filter(t => t.day_number === selectedDay), [tasks, selectedDay]);
  const week = weekForDay(selectedDay);
  const doneCount = dayTasks.filter(t => t.done).length;

  if (loading) return <p style={s.hint}>Loading tasks…</p>;

  return (
    <>
      <ProgressCard user={user} />

      <section style={s.section}>
        <div style={s.dayHeader}>
          <h2 style={s.title}>Day {selectedDay}</h2>
          {week && <span style={s.weekBadge}>{week.label}</span>}
        </div>
        {week && <p style={s.weekFocus}>{week.focus}</p>}
        {dayTasks.length > 0 && (
          <p style={s.progressText}>{doneCount} of {dayTasks.length} done</p>
        )}

        {dayTasks.length === 0 && <p style={s.hint}>No tasks for this day.</p>}

        <ul style={s.list}>
          {dayTasks.map(task => (
            <li key={task.id} style={s.item}>
              <label style={s.label}>
                <input type="checkbox" checked={task.done} onChange={() => toggle(task)} style={s.checkbox} />
                <span style={{ ...s.tag, background: SKILL_COLORS[task.skill] + '22', color: SKILL_COLORS[task.skill] }}>{SKILL_LABELS[task.skill]}</span>
                <span style={{ ...s.text, ...(task.done ? s.done : {}) }}>{task.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

const s = {
  section: { background: '#1e293b', borderRadius: 12, padding: 20 },
  title: { fontSize: 20, margin: 0 },
  hint: { color: '#94a3b8', fontSize: 13 },
  dayHeader: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 },
  weekBadge: { fontSize: 11, background: '#33415522', color: '#a5b4fc', padding: '4px 10px', borderRadius: 20 },
  weekFocus: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  progressText: { color: '#818cf8', fontSize: 12, fontWeight: 600, marginBottom: 16 },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  item: {},
  label: { display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' },
  checkbox: { marginTop: 3, width: 18, height: 18, flexShrink: 0 },
  tag: { fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 },
  text: { fontSize: 14, lineHeight: 1.4 },
  done: { color: '#64748b', textDecoration: 'line-through' },
};
