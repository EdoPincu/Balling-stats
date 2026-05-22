import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Settings() {
  const hotkeys = useStore((s) => s.hotkeys);
  const setHotkeys = useStore((s) => s.setHotkeys);
  const resetHotkeys = useStore((s) => s.resetHotkeys);

  const [editing, setEditing] = useState(null);
  const [tempKey, setTempKey] = useState('');

  const startEdit = (type) => {
    setEditing(type);
    setTempKey(hotkeys[type].key);
  };

  const saveKey = () => {
    if (tempKey.length === 1) {
      const newHotkeys = { ...hotkeys, [editing]: { ...hotkeys[editing], key: tempKey.toLowerCase() } };
      setHotkeys(newHotkeys);
    }
    setEditing(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <h1>⚙️ Settings</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: '11px', color: 'var(--secondary)' }}>
            HOTKEY BINDINGS
          </h3>
          <button onClick={resetHotkeys} className="btn btn-ghost btn-sm">RESET DEFAULTS</button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>
          During a live match, press a player's number (1-10) to select them, then press a stat key to record the play.
          Hold <kbd style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', fontFamily: 'var(--font-retro)', fontSize: '10px' }}>Shift</kbd> for a missed shot.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(hotkeys).map(([type, hk]) => (
            <div
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'var(--bg)',
                borderRadius: '8px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-main)', color: 'var(--text-bright)', fontSize: '15px' }}>
                  {hk.label}
                </div>
                {(type === '2pt' || type === '3pt') && (
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Shift + key = missed shot
                  </div>
                )}
              </div>

              {editing === type ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value.slice(-1))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveKey();
                      if (e.key === 'Escape') setEditing(null);
                    }}
                    maxLength={1}
                    autoFocus
                    style={{ width: '50px', textAlign: 'center', fontFamily: 'var(--font-retro)', fontSize: '16px' }}
                  />
                  <button onClick={saveKey} className="btn btn-accent btn-sm">✓</button>
                  <button onClick={() => setEditing(null)} className="btn btn-ghost btn-sm">✕</button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(type)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '2px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-retro)',
                    fontSize: '16px',
                    transition: 'all 0.15s',
                  }}
                >
                  {hk.key.toUpperCase()}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: '11px', color: 'var(--danger)', marginBottom: '16px' }}>
          DANGER ZONE
        </h3>
        <button
          onClick={() => {
            if (window.confirm('This will delete ALL data including players, matches, and stats. Are you sure?')) {
              localStorage.removeItem('basketball-stats-storage');
              window.location.reload();
            }
          }}
          className="btn btn-danger"
        >
          🗑️ CLEAR ALL DATA
        </button>
      </div>
    </div>
  );
}
