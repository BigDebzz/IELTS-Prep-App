import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';

// Groups raw mock_scores rows (which can each carry a partial subset of the
// 4 skills) by day, then computes one honest overall per day as the average
// of whichever skills have a real score that day — never trusting a stored
// per-row "overall" that may reflect only one skill.
function computeDailyOveralls(rows) {
  const byDay = {};
  for (const r of rows) {
    if (!byDay[r.day_number]) byDay[r.day_number] = { day_number: r.day_number, listening: null, reading: null, writing: null, speaking: null };
    const day = byDay[r.day_number];
    if (r.listening != null) day.listening = r.listening;
    if (r.reading != null) day.reading = r.reading;
    if (r.writing != null) day.writing = r.writing;
    if (r.speaking != null) day.speaking = r.speaking;
  }
  return Object.values(byDay)
    .map(day => {
      const vals = [day.listening, day.reading, day.writing, day.speaking].filter(v => v != null);
      const overall = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 4) / 4 : null;
      return { ...day, overall, skillCount: vals.length };
    })
    .filter(d => d.overall != null)
    .sort((a, b) => a.day_number - b.day_number);
}

export default function ProgressCard({ user }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('mock_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('day_number', { ascending: true });
      if (!error) setScores(data);
      setLoading(false);
    }
    load();
  }, [user.id]);

  if (loading) return null;

  const dailyOveralls = computeDailyOveralls(scores);
  const latest = dailyOveralls[dailyOveralls.length - 1];
  const points = dailyOveralls.slice(-10); // last 10 days with a score

  if (points.length === 0) {
    return (
      <div style={s.card}>
        <p style={s.emptyTitle}>No scores logged yet</p>
        <p style={s.emptyHint}>Complete a Writing or Speaking practice, or log a mock score, to see your band trend here.</p>
      </div>
    );
  }

  // Build a simple SVG line path scaled 0-9 band range
  const w = 600, h = 140, pad = 20;
  const maxBand = 9;
  const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (Math.min(p.overall, maxBand) / maxBand) * (h - pad * 2);
    return [x, y];
  });
  const linePath = coords.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1][0]},${h - pad} L${coords[0][0]},${h - pad} Z`;

  return (
    <div style={s.card}>
      <div style={s.cardTop}>
        <div>
          <p style={s.scoreLabel}>Latest daily overall (avg of skills scored that day)</p>
          <p style={s.scoreValue}>{latest.overall}</p>
          <p style={s.scoreDetail}>
            {latest.listening != null && `L ${latest.listening} `}
            {latest.reading != null && `R ${latest.reading} `}
            {latest.writing != null && `W ${latest.writing} `}
            {latest.speaking != null && `S ${latest.speaking}`}
            {latest.skillCount < 4 && ` — based on ${latest.skillCount}/4 skills`}
          </p>
        </div>
        <span style={s.trendBadge}>{points.length} {points.length === 1 ? 'day' : 'days'} logged</span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} style={s.svg} preserveAspectRatio="none">
        <path d={areaPath} fill={theme.colors.lavender} opacity={0.12} />
        <path d={linePath} fill="none" stroke={theme.colors.lavender} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} fill={theme.colors.lavender} />
        ))}
      </svg>

      <div style={s.legend}>
        <span>Day {points[0].day_number}</span>
        <span>Day {points[points.length - 1].day_number}</span>
      </div>
    </div>
  );
}

const s = {
  card: { background: theme.colors.card, borderRadius: theme.radius.card, padding: 20, marginBottom: 16, boxShadow: theme.shadow.card },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  scoreLabel: { fontSize: 12, color: theme.colors.textMuted, margin: 0 },
  scoreValue: { fontSize: 32, fontWeight: 800, color: theme.colors.text, margin: '2px 0 0' },
  scoreDetail: { fontSize: 12, color: theme.colors.textMuted, margin: '4px 0 0' },
  trendBadge: { fontSize: 11, color: theme.colors.lavender, background: theme.colors.lavenderLight, padding: '4px 10px', borderRadius: 999 },
  svg: { width: '100%', height: 140 },
  legend: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.colors.textMuted, marginTop: 4 },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: theme.colors.text, margin: '0 0 4px' },
  emptyHint: { fontSize: 12, color: theme.colors.textMuted, margin: 0 },
};
