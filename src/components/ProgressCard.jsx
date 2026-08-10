import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';

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

  const withOverall = scores.filter(s => s.overall != null);
  const latest = withOverall[withOverall.length - 1];
  const points = withOverall.slice(-10);

  if (points.length === 0) {
    return (
      <div style={s.card}>
        <p style={s.emptyTitle}>No scores logged yet</p>
        <p style={s.emptyHint}>Complete a Writing or Speaking practice to see your band trend here.</p>
      </div>
    );
  }

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
          <p style={s.scoreLabel}>Latest overall band</p>
          <p style={s.scoreValue}>{latest.overall}</p>
        </div>
        <span style={s.trendBadge}>{points.length} logged {points.length === 1 ? 'score' : 'scores'}</span>
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
  trendBadge: { fontSize: 11, color: theme.colors.lavender, background: theme.colors.lavenderLight, padding: '4px 10px', borderRadius: 999 },
  svg: { width: '100%', height: 140 },
  legend: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.colors.textMuted, marginTop: 4 },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: theme.colors.text, margin: '0 0 4px' },
  emptyHint: { fontSize: 12, color: theme.colors.textMuted, margin: 0 },
};
