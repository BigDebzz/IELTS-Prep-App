// src/lib/useTimer.js
// Shared countdown timer hook. All four skill tabs use this so the logic
// lives in one place. Auto-submits (calls onExpire) when it hits zero.

import { useEffect, useRef, useState } from 'react';

export function useTimer(totalSeconds, { onExpire, autoStart = false } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(autoStart);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setExpired(true);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start() { setRunning(true); setExpired(false); }
  function stop() { setRunning(false); }
  function reset(newSeconds) {
    clearInterval(intervalRef.current);
    setSecondsLeft(newSeconds ?? totalSeconds);
    setRunning(false);
    setExpired(false);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const pct = secondsLeft / totalSeconds;
  const urgent = pct < 0.15; // last 15% — turns red

  return { secondsLeft, running, expired, display, urgent, pct, start, stop, reset };
}

// Reusable timer bar — always visible once shown, shows start button when not yet running
export function TimerBar({ timer, label, onStart }) {
  return (
    <div style={ts.wrap}>
      <div style={ts.row}>
        <span style={ts.label}>{label}</span>
        {!timer.running && !timer.expired && (
          <button style={ts.startBtn} onClick={onStart || timer.start}>▶ Start</button>
        )}
        {(timer.running || timer.expired) && (
          <span style={{ ...ts.time, color: (timer.urgent || timer.expired) ? '#f87171' : '#f5f5f5' }}>
            {timer.expired ? '⏰ Time up' : timer.display}
          </span>
        )}
      </div>
      <div style={ts.track}>
        <div style={{
          ...ts.fill,
          width: `${Math.max(0, timer.pct) * 100}%`,
          background: (timer.urgent || timer.expired) ? '#f87171' : '#8b8cf8',
          transition: timer.running ? 'width 1s linear, background 0.3s' : 'none',
        }} />
      </div>
    </div>
  );
}

const ts = {
  wrap: { background: '#000000', borderRadius: 8, padding: '10px 14px', marginBottom: 14 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 12, color: '#a3a3a3' },
  time: { fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  track: { height: 4, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  startBtn: { fontSize: 12, padding: '4px 12px', borderRadius: 20, border: 'none', background: '#4ade80', color: '#000', fontWeight: 700, cursor: 'pointer' },
};
