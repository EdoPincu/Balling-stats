import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Players() {
  const players = useStore((s) => s.players);
  const addPlayer = useStore((s) => s.addPlayer);
  const updatePlayer = useStore((s) => s.updatePlayer);
  const deletePlayer = useStore((s) => s.deletePlayer);
  const getPlayerStats = useStore((s) => s.getPlayerStats);

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addPlayer(newName.trim());
    setNewName('');
  };

  const startEdit = (player) => {
    setEditingId(player.id);
    setEditName(player.name);
  };

  const saveEdit = () => {
    if (editName.trim()) {
      updatePlayer(editingId, { name: editName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <h1>👥 Players</h1>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter player name..."
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary">+ ADD</button>
      </form>

      {players.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏀</div>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: '11px', color: 'var(--text-dim)' }}>
            NO PLAYERS YET
          </p>
          <p style={{ color: 'var(--text-dim)', marginTop: '8px' }}>
            Add your squad to get started
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {players.map((player) => {
          const stats = getPlayerStats(player.id, 'all');
          return (
            <div key={player.id} className="card animate-in" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-retro)',
                  fontSize: '14px',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                {editingId === player.id ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      autoFocus
                      style={{ flex: 1 }}
                    />
                    <button onClick={saveEdit} className="btn btn-accent btn-sm">✓</button>
                    <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">✕</button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontFamily: 'var(--font-main)', fontSize: '18px', color: 'var(--text-bright)' }}>
                      {player.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {stats.games} games · {stats.points} pts · {stats.fgPercent}% FG
                    </div>
                  </>
                )}
              </div>

              {editingId !== player.id && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEdit(player)} className="btn btn-ghost btn-sm">✏️</button>
                  <button onClick={() => deletePlayer(player.id)} className="btn btn-danger btn-sm">🗑️</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
