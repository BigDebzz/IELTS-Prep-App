import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// One shared history browser, reused across Writing/Speaking/Reading/Listening.
// `table` is the Supabase table to read from; `renderItem` decides how each
// skill's row previews itself (since a writing draft, a speaking transcript,
// and a reading passage all need different summary text).
export default function SessionHistory({ user, table, label, renderItem, onSelectDay }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .order('day_number', { ascending: false });
      if (!error) setSessions(data || []);
      setLoading(false);
    }
    load();
  }, [user.id, table]);

  if (loading || sessions.length === 0) return null;

  return (
    <div style={s.wrap}>
      <button style={s.toggle} onClick={() => setOpen(!open)}>
        {open ? '▾' : '▸'} My {label} History ({sessions.length})
      </button>
      {open && (
        <div style={s.list}>
          {sessions.map(sess => (
            <button key={sess.day_number} style={s.item} onClick={() => onSelectDay(sess.day_number)}>
              {renderItem(sess)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { background: '#000000', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  toggle: { width: '100%', textAlign: 'left', padding: 14, background: 'none', border: 'none', color: '#8b8cf8', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  list: { padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 },
  item: { textAlign: 'left', background: '#121212', border: 'none', borderRadius: 8, padding: 12, cursor: 'pointer', width: '100%' },
};

export const historyItemStyles = {
  itemTop: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' },
  dayTag: { fontSize: 11, fontWeight: 700, color: '#8b8cf8' },
  typeTag: { fontSize: 11, color: '#a3a3a3' },
  scoreTag: { fontSize: 11, fontWeight: 700, color: '#4ade80', marginLeft: 'auto' },
  preview: { fontSize: 13, color: '#f5f5f5', margin: '0 0 4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  metaLine: { fontSize: 11, color: '#64748b', margin: 0 },
};
