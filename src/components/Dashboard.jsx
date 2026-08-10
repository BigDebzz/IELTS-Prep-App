import { useEffect, useState } from 'react';
import { signOut } from '../lib/useAuth';
import TasksTab from './TasksTab';
import VocabularyTab from './VocabularyTab';
import ReadingTab from './ReadingTab';
import ListeningTab from './ListeningTab';
import WritingTab from './WritingTab';
import SpeakingTab from './SpeakingTab';

function dayFromStart(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / 86400000);
  return Math.min(30, Math.max(1, diff + 1));
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
    { key: 'tasks', label: 'Daily Tasks' },
    { key: 'vocabulary', label: 'Vocabulary' },
    { key: 'reading', label: 'Reading' },
    { key: 'listening', label: 'Listening' },
    { key: 'writing', label: 'Writing' },
    { key: 'speaking', label: 'Speaking' },
  ];

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <div>
          <h1 style={s.h1}>IELTS Prep System</h1>
          <p style={s.sub}>{user.email}</p>
        </div>
        <div style={s.headerRight}>
          <label style={s.dateLabel}>
            Start date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={s.dateInput} />
          </label>
          <button style={s.logoutBtn} onClick={signOut}>Sign out</button>
        </div>
      </header>

      <div style={s.dayGrid}>
        {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
          <button key={d} onClick={() => setSelectedDay(d)} style={{ ...s.dayBtn, background: d === selectedDay ? '#6366f1' : '#1e293b' }}>{d}</button>
        ))}
      </div>

      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ ...s.tabBtn, ...(tab === t.key ? s.tabBtnActive : {}) }}>{t.label}</button>
        ))}
      </div>

      {tab === 'tasks' && <TasksTab user={user} selectedDay={selectedDay} />}
      {tab === 'vocabulary' && <VocabularyTab user={user} />}
      {tab === 'reading' && <ReadingTab />}
      {tab === 'listening' && <ListeningTab />}
      {tab === 'writing' && <WritingTab user={user} selectedDay={selectedDay} />}
      {tab === 'speaking' && <SpeakingTab user={user} selectedDay={selectedDay} />}
    </div>
  );
}

const s = {
  wrap: { minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px 16px', maxWidth: 900, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  h1: { fontSize: 20, margin: 0 },
  sub: { color: '#94a3b8', fontSize: 13, margin: '4px 0 0' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  dateLabel: { fontSize: 13, color: '#94a3b8' },
  dateInput: { background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', borderRadius: 6, padding: '4px 8px', marginLeft: 4 },
  logoutBtn: { background: 'none', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 },
  dayGrid: { display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, marginBottom: 16 },
  dayBtn: { border: 'none', borderRadius: 6, color: '#f1f5f9', padding: '8px 0', cursor: 'pointer', fontSize: 13 },
  tabs: { display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', borderBottom: '1px solid #1e293b', paddingBottom: 4 },
  tabBtn: { background: 'none', border: 'none', color: '#94a3b8', padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderBottom: '2px solid transparent' },
  tabBtnActive: { color: '#f1f5f9', borderBottom: '2px solid #6366f1' },
};
