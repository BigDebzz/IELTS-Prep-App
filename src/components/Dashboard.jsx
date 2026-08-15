import { useEffect, useState } from 'react';
import { signOut } from '../lib/useAuth';
import { theme } from '../styles/theme';
import TasksTab from './TasksTab';
import VocabularyTab from './VocabularyTab';
import ReadingTab from './ReadingTab';
import ListeningTab from './ListeningTab';
import WritingTab from './WritingTab';
import SpeakingTab from './SpeakingTab';
import { weekForDay } from '../data/planData';

function dayFromStart(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / 86400000);
  return Math.min(30, Math.max(1, diff + 1));
}

// Unclamped version — used only to detect and explain when you're past Day 30,
// since the clamp above used to silently keep showing Day 30's content forever
// with no indication that the 30-day plan had actually ended.
function rawDayFromStart(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / 86400000);
  return diff + 1;
}

export default function Dashboard({ user }) {
  const [startDate, setStartDate] = useState(() => localStorage.getItem('ielts_start_date') || new Date().toISOString().slice(0, 10));
  const [selectedDay, setSelectedDay] = useState(1);
  const [tab, setTab] = useState('tasks');

  useEffect(() => {
    localStorage.setItem('ielts_start_date', startDate);
    setSelectedDay(dayFromStart(startDate));
  }, [startDate]);

  const tabs = [
    { key: 'tasks', label: 'Today' },
    { key: 'vocabulary', label: 'Vocabulary' },
    { key: 'reading', label: 'Reading' },
    { key: 'listening', label: 'Listening' },
    { key: 'writing', label: 'Writing' },
    { key: 'speaking', label: 'Speaking' },
  ];

  const initials = (user.email || '?').slice(0, 2).toUpperCase();
  const week = weekForDay(selectedDay);
  const today = dayFromStart(startDate);
  const rawToday = rawDayFromStart(startDate);
  const planEnded = rawToday > 30;

  return (
    <div style={s.page}>
      <div style={s.shell}>
        {/* Top nav — pill-shaped like the reference */}
        <header style={s.header}>
          <div style={s.brand}>
            <span style={s.brandMark}>◆</span>
            <span style={s.brandName}>IELTS Prep</span>
          </div>
          <nav style={s.nav}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ ...s.navBtn, ...(tab === t.key ? s.navBtnActive : {}) }}>
                {t.label}
              </button>
            ))}
          </nav>
          <div style={s.headerRight}>
            <div style={s.avatar}>{initials}</div>
            <button style={s.logoutBtn} onClick={signOut}>Sign out</button>
          </div>
        </header>

        {/* Day calendar strip — borrowed from reference's month calendar concept */}
        {planEnded && (
          <div style={s.planEndedBanner}>
            Your 30-day plan finished {rawToday - 30} day{rawToday - 30 === 1 ? '' : 's'} ago (based on your start date).
            You're currently viewing Day 30's content, which repeats — Vocabulary's daily word batch and the plan
            checklist stay fixed at Day 30 rather than continuing to rotate. Reset your start date below to begin a
            new 30-day cycle for fresh content, or manually click through different day numbers to review past days.
          </div>
        )}
        <div style={s.dayBar}>
          <div style={s.dayBarTop}>
            <div>
              <p style={s.dayBarLabel}>Day {selectedDay} of 30{selectedDay === today ? ' · Today' : ''}</p>
              {week && <p style={s.weekLabel}>{week.label}</p>}
            </div>
            <label style={s.dateLabel}>
              Start date
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={s.dateInput} />
            </label>
          </div>
          <div style={s.dayPills}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  ...s.dayPill,
                  ...(d === selectedDay ? s.dayPillActive : {}),
                  ...(d === today && d !== selectedDay ? s.dayPillToday : {}),
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <main style={s.main}>
          {tab === 'tasks' && <TasksTab user={user} selectedDay={selectedDay} />}
          {tab === 'vocabulary' && <VocabularyTab user={user} selectedDay={selectedDay} />}
          {tab === 'reading' && <ReadingTab user={user} selectedDay={selectedDay} />}
          {tab === 'listening' && <ListeningTab user={user} selectedDay={selectedDay} />}
          {tab === 'writing' && <WritingTab user={user} selectedDay={selectedDay} />}
          {tab === 'speaking' && <SpeakingTab user={user} selectedDay={selectedDay} />}
        </main>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: theme.colors.bg, padding: '20px 12px' },
  shell: { maxWidth: 1000, margin: '0 auto' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: theme.colors.card, borderRadius: theme.radius.card, padding: '14px 20px',
    marginBottom: 16, boxShadow: theme.shadow.card, flexWrap: 'wrap', gap: 12,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8 },
  brandMark: { color: theme.colors.lavender, fontSize: 20 },
  brandName: { fontSize: 18, fontWeight: 700, color: theme.colors.text },
  nav: { display: 'flex', gap: 4, background: theme.colors.bg, borderRadius: theme.radius.pill, padding: 4, flexWrap: 'wrap' },
  navBtn: { border: 'none', background: 'none', padding: '8px 16px', borderRadius: theme.radius.pill, fontSize: 13, fontWeight: 600, color: theme.colors.textMuted, cursor: 'pointer' },
  navBtnActive: { background: theme.colors.lavender, color: '#fff' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: theme.colors.lavenderLight, color: theme.colors.lavender, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  logoutBtn: { border: 'none', background: 'none', color: theme.colors.textMuted, fontSize: 12, cursor: 'pointer' },
  planEndedBanner: { background: theme.colors.coral + '15', border: `1px solid ${theme.colors.coral}`, borderRadius: theme.radius.card, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: theme.colors.coral, lineHeight: 1.5 },
  dayBar: { background: theme.colors.card, borderRadius: theme.radius.card, padding: '16px 20px', marginBottom: 16, boxShadow: theme.shadow.card },
  dayBarTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  dayBarLabel: { fontSize: 16, fontWeight: 700, color: theme.colors.text, margin: 0 },
  weekLabel: { fontSize: 12, color: theme.colors.lavender, margin: '2px 0 0' },
  dateLabel: { fontSize: 11, color: theme.colors.textMuted, display: 'flex', flexDirection: 'column', gap: 4 },
  dateInput: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.input, padding: '4px 10px', fontSize: 12, color: theme.colors.text, background: theme.colors.bg },
  dayPills: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  dayPill: { width: 30, height: 30, borderRadius: '50%', border: 'none', background: theme.colors.bg, color: theme.colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  dayPillActive: { background: theme.colors.lavender, color: '#fff' },
  dayPillToday: { boxShadow: `0 0 0 2px ${theme.colors.olive}` },
  main: {},
};
