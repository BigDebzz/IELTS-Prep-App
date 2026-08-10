import { useAuth } from './lib/useAuth';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '100vh', background: '#0f172a', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>;
  return user ? <Dashboard user={user} /> : <AuthScreen />;
}
