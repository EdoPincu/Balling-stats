import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Stats() {
  const players = useStore((s) => s.players);
  const getPlayerStats = useStore((s) => s.getPlayerStats);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('points');

  const playerStats = players
    .map((p) => ({ ...p, stats: getPlayerStats(p.id, filter) }))
    .filter((p) => p.stats.games > 0)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.stats[sortBy] ?? 0) - (a.stats[sortBy] ?? 0);
    });

  const filters = [
    { value: 'last1', label: 'Last Match' },
    { value: 'last3', label: 'Last 3' },
    { value: 'all', label: 'All Time' },
  ];

  const sortOptions = [
    { value: 'wins', label: 'W' },
    { value: 'points', label: 'PTS' },
    { value: 'assists', label: 'AST' },
    { value: 'rebounds', label: 'REB' },
    { value: 'fgPercent', label: 'FG%' },
    { value: 'blocks', label: 'BLK' },
    { value: 'steals', label: 'STL' },
    { value: 'games', label: 'GP' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <h1>📊 Stats</h1>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="btn btn-sm"
            style={{
              background: filter === f.value ? 'var(--primary)' : 'transparent',
              color: filter === f.value ? '#fff' : 'var(--text)',
              borderColor: filter === f.value ? 'var(--primary)' : 'var(--border)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
          SORT BY:
        </span>
        {sortOptions.map((s) => (
          <button
            key={s.value}
            onClick={() => setSortBy(s.value)}
            className="btn btn-sm"
            style={{
              background: sortBy === s.value ? 'var(--secondary)' : 'transparent',
              color: sortBy === s.value ? '#1a1a2e' : 'var(--text-dim)',
              borderColor: sortBy === s.value ? 'var(--secondary)' : 'var(--border)',
              padding: '6px 12px',
              fontSize: '11px',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {playerStats.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: '11px', color: 'var(--text-dim)' }}>
            NO STATS YET
          </p>
          <p style={{ color: 'var(--text-dim)', marginTop: '8px' }}>
            Complete a match to see stats
          </p>
        </div>
      )}

      {/* Stats Table */}
      {playerStats.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>#</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>PLAYER</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--accent)' }}>W/L</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>GP</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--primary)' }}>PTS</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>AST</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>FG%</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>REB</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>BLK</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>STL</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: i === 0 ? 'rgba(255,209,102,0.05)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-retro)', fontSize: '12px', color: i === 0 ? 'var(--secondary)' : 'var(--text-dim)' }}>
                    {i + 1}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontFamily: 'var(--font-main)', color: 'var(--text-bright)', fontSize: '15px' }}>{p.name}</div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--accent)' }}>
                    <span style={{ color: 'var(--accent)' }}>{p.stats.wins}</span>-<span style={{ color: 'var(--danger)' }}>{p.stats.losses}</span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text-dim)' }}>{p.stats.games}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'var(--font-main)', color: 'var(--primary)', fontSize: '16px' }}>
                    {p.stats.points}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text)' }}>{p.stats.assists}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{
                      color: p.stats.fgPercent >= 50 ? 'var(--accent)' : p.stats.fgPercent >= 30 ? 'var(--secondary)' : 'var(--danger)',
                    }}>
                      {p.stats.fgPercent}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text)' }}>{p.stats.rebounds}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text)' }}>{p.stats.blocks}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text)' }}>{p.stats.steals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
