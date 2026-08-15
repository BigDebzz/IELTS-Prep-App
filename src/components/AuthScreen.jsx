import { useState } from 'react';
import { signIn, signUp } from '../lib/useAuth';

export default function AuthScreen() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setInfo(''); setBusy(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) setError(error.message);
    else if (mode === 'signup') setInfo('Check your email to confirm, then sign in.');
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h1 style={s.title}>IELTS Prep System</h1>
        <p style={s.subtitle}>{mode === 'signin' ? 'Sign in' : 'Create your account'}</p>
        <form onSubmit={handleSubmit} style={s.form}>
          <input style={s.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={s.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
          {error && <p style={s.error}>{error}</p>}
          {info && <p style={s.info}>{info}</p>}
          <button style={s.button} type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <button style={s.switchBtn} onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}>
          {mode === 'signin' ? "No account? Sign up" : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

const s = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000', padding: 16 },
  card: { background: '#121212', borderRadius: 16, padding: 32, width: '100%', maxWidth: 380 },
  title: { color: '#f5f5f5', fontSize: 22, marginBottom: 4, textAlign: 'center' },
  subtitle: { color: '#a3a3a3', fontSize: 14, marginBottom: 24, textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '12px 14px', borderRadius: 8, border: '1px solid #2a2a2a', background: '#000000', color: '#f5f5f5', fontSize: 15 },
  button: { padding: '12px 14px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
  switchBtn: { marginTop: 16, background: 'none', border: 'none', color: '#8b8cf8', cursor: 'pointer', fontSize: 13, width: '100%' },
  error: { color: '#f87171', fontSize: 13, margin: 0 },
  info: { color: '#4ade80', fontSize: 13, margin: 0 },
};
