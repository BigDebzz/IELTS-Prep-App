// src/styles/theme.js
// True black theme — pure black page background with slightly-raised near-black
// cards, so content still has depth on OLED-style black rather than everything
// flattening into one shade. Fonts kept as the system stack (fastest load, most
// legible on every device) but sized/weighted for clarity on black specifically.

export const theme = {
  colors: {
    bg: '#000000',
    card: '#121212',
    cardAlt: '#000000',
    text: '#f5f5f5',
    textMuted: '#a3a3a3',
    olive: '#a3e635',
    oliveDark: '#65a30d',
    lavender: '#8b8cf8',
    lavenderLight: '#2a2a5c',
    coral: '#fb923c',
    coralLight: '#3d2412',
    border: '#2a2a2a',
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
    card: '0 10px 30px rgba(0,0,0,0.6)',
    pop: '0 12px 40px rgba(0,0,0,0.8)',
  },
  font: {
    family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, Inter, sans-serif`,
  },
};
