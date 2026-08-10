// src/styles/theme.js
// Dark theme (matching the original deployed build), with layout patterns
// borrowed from the LingoLab reference: progress graph, calendar day-picker,
// "today's tasks" card, score/percentile framing — applied on the dark palette.

export const theme = {
  colors: {
    bg: '#0f172a',
    card: '#1e293b',
    cardAlt: '#0f172a',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    olive: '#a3e635',
    oliveDark: '#65a30d',
    lavender: '#818cf8',
    lavenderLight: '#312e81',
    coral: '#fb923c',
    coralLight: '#7c2d12',
    border: '#334155',
    danger: '#f87171',
    success: '#4ade80',
  },
  radius: {
    card: '16px',
    pill: '999px',
    button: '10px',
    input: '8px',
  },
  shadow: {
    card: '0 10px 30px rgba(0,0,0,0.25)',
    pop: '0 12px 40px rgba(0,0,0,0.4)',
  },
  font: {
    family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif`,
  },
};
