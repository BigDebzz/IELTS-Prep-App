import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';

// Groups raw mock_scores rows by day, computing one honest overall per day.
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

// All the rule-based feedback logic — no AI, just your real numbers.
function generateFeedback(dailyOveralls) {
  if (dailyOveralls.length === 0) return null;

  const latest = dailyOveralls[dailyOveralls.length - 1];
  const prev = dailyOveralls.length > 1 ? dailyOveralls[dailyOveralls.length - 2] : null;

  // Trend
  let trend = null;
  if (prev && latest.overall > prev.overall) trend = { direction: 'up', text: `Up from ${prev.overall} — keep this momentum.` };
  else if (prev && latest.overall < prev.overall) trend = { direction: 'down', text: `Down from ${prev.overall}. A dip is normal — don't stop.` };
  else if (prev) trend = { direction: 'same', text: `Same as last session. Push harder on your weakest skill today.` };

  // Skill-level feedback
  const skillFeedback = [];
  const skills = [
    { key: 'writing', label: 'Writing' },
    { key: 'speaking', label: 'Speaking' },
    { key: 'listening', label: 'Listening' },
    { key: 'reading', label: 'Reading' },
  ];

  const scored = skills.filter(s => latest[s.key] != null);
  const unscored = skills.filter(s => latest[s.key] == null);

  if (scored.length > 0) {
    const sorted = [...scored].sort((a, b) => latest[b.key] - latest[a.key]);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    if (sorted.length > 1) {
      skillFeedback.push({
        type: 'strong',
        text: `${strongest.label} is your strongest right now at Band ${latest[strongest.key]}.`,
      });
      if (latest[weakest.key] < latest[strongest.key]) {
        skillFeedback.push({
          type: 'focus',
          text: `${weakest.label} needs the most work — Band ${latest[weakest.key]}. Spend extra time there today.`,
        });
      }
    }

    // Band-level specific advice
    const overall = latest.overall;
    if (overall < 5) {
      skillFeedback.push({ type: 'tip', text: 'At this stage: focus on answering the question fully before worrying about vocabulary or grammar. Task Response is what matters most below Band 5.' });
    } else if (overall < 6) {
      skillFeedback.push({ type: 'tip', text: 'To reach Band 6: develop each point with a specific example. One vague claim = Band 5. One supported claim = Band 6.' });
    } else if (overall < 7) {
      skillFeedback.push({ type: 'tip', text: 'To reach Band 7: reduce repeated grammar errors. Find your top 2 mistakes in your feedback and fix those specifically — don\'t try to fix everything at once.' });
    } else {
      skillFeedback.push({ type: 'tip', text: 'Band 7+ achieved. To push higher: work on collocation and natural phrasing. The gap between 7 and 8 is consistency, not new skills.' });
    }
  }

  if (unscored.length > 0 && scored.length < 4) {
    skillFeedback.push({
      type: 'missing',
      text: `${unscored.map(s => s.label).join(', ')} not yet scored today. Practice ${unscored[0].label} to get a complete picture.`,
    });
  }

  return { latest, prev, trend, skillFeedback, dailyOveralls };
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
  const feedback = generateFeedback(dailyOveralls);
  const points = dailyOveralls.slice(-10);

  if (!feedback) {
    return (
      <div style={s.card}>
        <p style={s.emptyTitle}>No scores yet</p>
        <p style={s.emptyHint}>Complete a Writing or Speaking practice to see your progress and personalised feedback here.</p>
      </div>
    );
  }

  const { latest, trend, skillFeedback } = feedback;

  // SVG graph
  const w = 600, h = 120, pad = 16;
  const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (Math.min(p.overall, 9) / 9) * (h - pad * 2);
    return [x, y];
  });
  const linePath = coords.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1][0]},${h - pad} L${coords[0][0]},${h - pad} Z`;

  const trendColor = trend?.direction === 'up' ? theme.colors.success : trend?.direction === 'down' ? theme.colors.danger : theme.colors.textMuted;

  return (
    <div style={s.card}>
      <div style={s.top}>
        <div>
          <p style={s.label}>Overall band</p>
          <p style={s.score}>{latest.overall}</p>
        </div>
        <div style={s.skillGrid}>
          {['listening', 'reading', 'writing', 'speaking'].map(sk => (
            <div key={sk} style={s.skillCell}>
              <span style={s.skillLabel}>{sk[0].toUpperCase()}</span>
              <span style={{ ...s.skillVal, color: latest[sk] != null ? theme.colors.text : theme.colors.textMuted }}>
                {latest[sk] != null ? latest[sk] : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {trend && (
        <p style={{ ...s.trend, color: trendColor }}>{trend.text}</p>
      )}

      {points.length > 1 && (
        <>
          <svg viewBox={`0 0 ${w} ${h}`} style={s.svg} preserveAspectRatio="none">
            <path d={areaPath} fill={theme.colors.lavender} opacity={0.1} />
            <path d={linePath} fill="none" stroke={theme.colors.lavender} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {coords.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={3} fill={theme.colors.lavender} />
            ))}
          </svg>
          <div style={s.graphLegend}>
            <span>Day {points[0].day_number}</span>
            <span>Day {points[points.length - 1].day_number}</span>
          </div>
        </>
      )}

      <div style={s.feedbackSection}>
        {skillFeedback.map((fb, i) => (
          <div key={i} style={{ ...s.feedbackItem, borderLeft: `3px solid ${fb.type === 'strong' ? theme.colors.success : fb.type === 'focus' ? theme.colors.danger : fb.type === 'tip' ? theme.colors.lavender : theme.colors.textMuted}` }}>
            <span style={s.feedbackIcon}>
              {fb.type === 'strong' ? '✓' : fb.type === 'focus' ? '!' : fb.type === 'tip' ? '→' : '○'}
            </span>
            <p style={s.feedbackText}>{fb.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  card: { background: theme.colors.card, borderRadius: theme.radius.card, padding: 20, marginBottom: 16, boxShadow: theme.shadow.card },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  label: { fontSize: 11, color: theme.colors.textMuted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 1 },
  score: { fontSize: 40, fontWeight: 900, color: theme.colors.text, margin: 0, lineHeight: 1 },
  skillGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' },
  skillCell: { display: 'flex', alignItems: 'center', gap: 6 },
  skillLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: 700, width: 14 },
  skillVal: { fontSize: 16, fontWeight: 700 },
  trend: { fontSize: 12, margin: '0 0 10px', lineHeight: 1.4 },
  svg: { width: '100%', height: 120, marginBottom: 4 },
  graphLegend: { display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.colors.textMuted, marginBottom: 12 },
  feedbackSection: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 },
  feedbackItem: { display: 'flex', alignItems: 'flex-start', gap: 10, background: theme.colors.bg, borderRadius: 8, padding: '10px 12px' },
  feedbackIcon: { fontSize: 13, fontWeight: 700, color: theme.colors.textMuted, flexShrink: 0, marginTop: 1 },
  feedbackText: { fontSize: 13, color: theme.colors.text, margin: 0, lineHeight: 1.5 },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: theme.colors.text, margin: '0 0 6px' },
  emptyHint: { fontSize: 12, color: theme.colors.textMuted, margin: 0, lineHeight: 1.5 },
};
