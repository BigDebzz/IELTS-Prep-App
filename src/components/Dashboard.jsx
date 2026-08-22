import { useEffect, useState } from 'react';
import { signOut } from '../lib/useAuth';
import { theme } from '../styles/theme';
import LearnTab from './LearnTab';
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
  return Math.max(1, diff + 1); // No upper cap — plan continues indefinitely past day 30
}

export default function Dashboard({ user }) {
  const [startDate, setStartDate] = useState(() => localStorage.getItem('ielts_start_date') || new Date().toISOString().slice(0, 10));
  const [selectedDay, setSelectedDay] = useState(1);
  const [tab, setTab] = useState('learn');

  useEffect(() => {
    localStorage.setItem('ielts_start_date', startDate);
    setSelectedDay(dayFromStart(startDate));
  }, [startDate]);

  const tabs = [
    { key: 'learn', label: 'Daily Tips' },
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
  const [showDayPicker, setShowDayPicker] = useState(false);

  return (
    <div style={s.page}>
      <div style={s.shell}>
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

        {/* Compact day strip — collapsed by default so content comes first */}
        <div style={s.dayBar}>
          <div style={s.dayBarTop}>
            <button style={s.dayToggle} onClick={() => setShowDayPicker(!showDayPicker)}>
              {showDayPicker ? '▾' : '▸'} Day {selectedDay}{selectedDay === today ? ' · Today' : ''}
              {week && <span style={s.weekChip}>{week.label}</span>}
            </button>
            <label style={s.dateLabel}>
              Start date
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={s.dateInput} />
            </label>
          </div>
          {showDayPicker && (
            <div style={s.dayPills}>
              {Array.from({ length: Math.max(30, today + 6) }, (_, i) => i + 1).map(d => (
                <button
                  key={d}
                  onClick={() => { setSelectedDay(d); setShowDayPicker(false); }}
                  style={{
                    ...s.dayPill,
                    ...(d === selectedDay ? s.dayPillActive : {}),
                    ...(d === today && d !== selectedDay ? s.dayPillToday : {}),
                    ...(d > 30 ? s.dayPillExtended : {}),
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        <main style={s.main}>
          {tab === 'learn' && <LearnTab user={user} selectedDay={selectedDay} />}
          {tab === 'tasks' && <TasksTab user={user} selectedDay={selectedDay} />}
          {tab === 'vocabulary' && <VocabularyTab user={user} selectedDay={selectedDay} />}
          {tab === 'reading' && <ReadingTab user={user} selectedDay={selectedDay} onNavigateDay={setSelectedDay} />}
          {tab === 'listening' && <ListeningTab user={user} selectedDay={selectedDay} onNavigateDay={setSelectedDay} />}
          {tab === 'writing' && <WritingTab user={user} selectedDay={selectedDay} onNavigateDay={setSelectedDay} />}
          {tab === 'speaking' && <SpeakingTab user={user} selectedDay={selectedDay} onNavigateDay={setSelectedDay} />}
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
  dayBar: { background: theme.colors.card, borderRadius: theme.radius.card, padding: '12px 16px', marginBottom: 16, boxShadow: theme.shadow.card },
  dayBarTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  dayToggle: { background: 'none', border: 'none', color: theme.colors.text, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 },
  weekChip: { fontSize: 10, color: theme.colors.lavender, background: theme.colors.lavenderLight, padding: '2px 8px', borderRadius: 20, fontWeight: 400 },
  dateLabel: { fontSize: 11, color: theme.colors.textMuted, display: 'flex', flexDirection: 'column', gap: 4 },
  dateInput: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.input, padding: '4px 10px', fontSize: 12, color: theme.colors.text, background: theme.colors.bg },
  dayPills: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 },
  dayPill: { width: 30, height: 30, borderRadius: '50%', border: 'none', background: theme.colors.bg, color: theme.colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  dayPillActive: { background: theme.colors.lavender, color: '#fff' },
  dayPillToday: { boxShadow: `0 0 0 2px ${theme.colors.olive}` },
  dayPillExtended: { opacity: 0.7 },
  main: {},
};
