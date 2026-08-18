import { useEffect, useState } from 'react';
import { lessonForDay } from '../data/ieltsContent';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';

const SKILL_LABELS = { reading: 'Reading', writing: 'Writing', listening: 'Listening', speaking: 'Speaking', vocabulary: 'Vocabulary' };
const SKILL_COLORS = { reading: '#4ade80', writing: '#fb923c', listening: '#60a5fa', speaking: '#f87171', vocabulary: '#8b8cf8' };

export default function LearnTab({ user, selectedDay }) {
  const lesson = lessonForDay(selectedDay);
  const [readToday, setReadToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRead() {
      setLoading(true);
      const { data } = await supabase
        .from('tasks')
        .select('id, done')
        .eq('user_id', user.id)
        .eq('day_number', selectedDay)
        .eq('skill', 'review')
        .ilike('title', 'Daily lesson%')
        .maybeSingle();
      setReadToday(data?.done || false);
      setLoading(false);
    }
    checkRead();
  }, [selectedDay, user.id]);

  async function markRead() {
    // Reuses the existing tasks table so this shows up in your Today checklist too,
    // rather than creating a separate tracking system.
    const { data: existing } = await supabase
      .from('tasks')
      .select('id')
      .eq('user_id', user.id)
      .eq('day_number', selectedDay)
      .eq('skill', 'review')
      .ilike('title', 'Daily lesson%')
      .maybeSingle();

    if (existing) {
      await supabase.from('tasks').update({ done: true }).eq('id', existing.id);
    } else {
      await supabase.from('tasks').insert({
        user_id: user.id,
        day_number: selectedDay,
        skill: 'review',
        title: `Daily lesson: ${lesson.title}`,
        done: true,
      });
    }
    setReadToday(true);
  }

  if (loading) return null;

  return (
    <section style={s.section}>
      <div style={s.header}>
        <span style={{ ...s.skillBadge, background: SKILL_COLORS[lesson.skill] + '22', color: SKILL_COLORS[lesson.skill] }}>
          {SKILL_LABELS[lesson.skill]}
        </span>
        <h2 style={s.title}>{lesson.title}</h2>
      </div>

      <p style={s.hint}>Read this before you practice today — it's the technique or rule today's testing will actually use.</p>

      <div style={s.card}>
        <p style={s.sectionLabel}>What this teaches</p>
        <p style={s.body}>{lesson.teaches}</p>

        <p style={s.sectionLabel}>Why it matters for your score</p>
        <p style={s.body}>{lesson.whyItMatters}</p>

        <div style={s.tryNextBox}>
          <p style={s.tryNextLabel}>Try it now</p>
          <p style={s.tryNextText}>{lesson.tryNext}</p>
        </div>
      </div>

      <button style={readToday ? s.readBtnDone : s.readBtn} onClick={markRead} disabled={readToday}>
        {readToday ? '✓ Marked as read for today' : 'Mark as read'}
      </button>
    </section>
  );
}

const s = {
  section: { background: theme.colors.card, borderRadius: theme.radius.card, padding: 20 },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  skillBadge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 },
  title: { fontSize: 19, margin: 0, color: theme.colors.text },
  hint: { color: theme.colors.textMuted, fontSize: 12, marginBottom: 16, lineHeight: 1.5 },
  card: { background: theme.colors.bg, borderRadius: 10, padding: 18 },
  sectionLabel: { fontSize: 12, fontWeight: 700, color: theme.colors.lavender, margin: '14px 0 6px', textTransform: 'uppercase', letterSpacing: 0.5 },
  body: { fontSize: 14, lineHeight: 1.7, color: theme.colors.text, margin: 0 },
  tryNextBox: { marginTop: 18, paddingTop: 16, borderTop: `1px solid ${theme.colors.border}` },
  tryNextLabel: { fontSize: 12, fontWeight: 700, color: '#4ade80', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.5 },
  tryNextText: { fontSize: 14, lineHeight: 1.6, color: '#cbd5e1', margin: 0 },
  readBtn: { marginTop: 16, padding: '10px 18px', borderRadius: 8, border: 'none', background: theme.colors.lavender, color: 'white', fontWeight: 600, cursor: 'pointer' },
  readBtnDone: { marginTop: 16, padding: '10px 18px', borderRadius: 8, border: `1px solid #4ade80`, background: 'none', color: '#4ade80', fontWeight: 600, cursor: 'default' },
};
