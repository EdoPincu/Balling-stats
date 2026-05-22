import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function MatchDetail() {
  const { matchId } = useParams();
  const matches = useStore((s) => s.matches);
  const players = useStore((s) => s.players);
  const hotkeys = useStore((s) => s.hotkeys);
  const removeEvent = useStore((s) => s.removeEvent);
  const addEventToMatch = useStore((s) => s.addEventToMatch);

  const match = matches.find((m) => m.id === matchId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addPlayerId, setAddPlayerId] = useState('');
  const [addType, setAddType] = useState('2pt');
  const [addMade, setAddMade] = useState(true);

  if (!match) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p>Match not found</p>
        <Link to="/history" className="btn btn-primary" style={{ marginTop: '16px' }}>BACK TO HISTORY</Link>
      </div>
    );
  }

  const getPlayer = (id) => players.find((p) => p.id === id);
  const allPlayerIds = [...match.team1, ...match.team2];

  const getTeamScore = (teamIds) =>
    match.events
      .filter((e) => teamIds.includes(e.playerId) && e.made && (e.type === '2pt' || e.type === '3pt'))
      .reduce((sum, e) => sum + e.points, 0);

  const getPlayerMatchStats = (playerId) => {
    const events = match.events.filter((e) => e.playerId === playerId);
    return {
      points: events.filter((e) => e.made && (e.type === '2pt' || e.type === '3pt')).reduce((s, e) => s + e.points, 0),
      assists: events.filter((e) => e.type === 'assist').length,
      blocks: events.filter((e) => e.type === 'block').length,
      steals: events.filter((e) => e.type === 'steal').length,
      rebounds: events.filter((e) => e.type === 'rebound').length,
      fgMade: events.filter((e) => (e.type === '2pt' || e.type === '3pt') && e.made).length,
      fgAtt: events.filter((e) => e.type === '2pt' || e.type === '3pt').length,
    };
  };

  const handleAddEvent = () => {
    if (!addPlayerId) return;
    const points = addType === '3pt' ? 3 : addType === '2pt' ? 2 : 0;
    const madeVal = addType === 'assist' || addType === 'block' || addType === 'steal' ? true : addMade;
    addEventToMatch(matchId, { playerId: addPlayerId, type: addType, made: madeVal, points: madeVal ? points : 0 });
    setShowAddForm(false);
    setAddPlayerId('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/history" className="back-btn">←</Link>
        <h1>Match Detail</h1>
      </div>

      {/* Score */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>
          {new Date(match.date).toLocaleDateString()} · {match.team1.length}v{match.team2.length}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--primary)', marginBottom: '8px' }}>TEAM 1</div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '32px', color: 'var(--text-bright)' }}>{getTeamScore(match.team1)}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-retro)', fontSize: '14px', color: 'var(--text-dim)' }}>VS</div>
          <div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--accent2)', marginBottom: '8px' }}>TEAM 2</div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '32px', color: 'var(--text-bright)' }}>{getTeamScore(match.team2)}</div>
          </div>
        </div>
      </div>

      {/* Player Stats Table */}
      <div className="card" style={{ marginBottom: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--text-dim)', marginBottom: '16px' }}>BOX SCORE</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>PLAYER</th>
              <th style={{ textAlign: 'center', padding: '8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--primary)' }}>PTS</th>
              <th style={{ textAlign: 'center', padding: '8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>FG</th>
              <th style={{ textAlign: 'center', padding: '8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>AST</th>
              <th style={{ textAlign: 'center', padding: '8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>REB</th>
              <th style={{ textAlign: 'center', padding: '8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>BLK</th>
              <th style={{ textAlign: 'center', padding: '8px', fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--text-dim)' }}>STL</th>
            </tr>
          </thead>
          <tbody>
            {[
              ...match.team1.map((id) => ({ id, team: 1 })),
              ...match.team2.map((id) => ({ id, team: 2 })),
            ].map(({ id, team }, i, arr) => {
              const stats = getPlayerMatchStats(id);
              const fgPct = stats.fgAtt > 0 ? Math.round((stats.fgMade / stats.fgAtt) * 100) : 0;
              const isTeamBreak = i === match.team1.length;
              return (
                <tr
                  key={id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    borderTop: isTeamBreak ? '3px solid var(--border)' : undefined,
                  }}
                >
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ color: team === 1 ? 'var(--primary)' : 'var(--accent2)', fontSize: '10px', marginRight: '6px' }}>
                      {team === 1 ? '🔴' : '🔵'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-main)', color: 'var(--text-bright)' }}>
                      {getPlayer(id)?.name}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 8px', fontFamily: 'var(--font-main)', color: 'var(--primary)' }}>
                    {stats.points}
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 8px', fontSize: '13px', color: 'var(--text)' }}>
                    {stats.fgMade}/{stats.fgAtt} ({fgPct}%)
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text)' }}>{stats.assists}</td>
                  <td style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text)' }}>{stats.rebounds}</td>
                  <td style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text)' }}>{stats.blocks}</td>
                  <td style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text)' }}>{stats.steals}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Event Log with edit */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--text-dim)' }}>PLAY LOG</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-accent btn-sm">
            {showAddForm ? 'CANCEL' : '+ ADD STAT'}
          </button>
        </div>

        {showAddForm && (
          <div className="animate-in" style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Player</label>
              <select value={addPlayerId} onChange={(e) => setAddPlayerId(e.target.value)}>
                <option value="">Select...</option>
                {allPlayerIds.map((id) => (
                  <option key={id} value={id}>{getPlayer(id)?.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Stat</label>
              <select value={addType} onChange={(e) => setAddType(e.target.value)}>
                <option value="2pt">2PT Shot</option>
                <option value="3pt">3PT Shot</option>
                <option value="assist">Assist</option>
                <option value="rebound">Rebound</option>
                <option value="block">Block</option>
                <option value="steal">Steal</option>
              </select>
            </div>
            {(addType === '2pt' || addType === '3pt') && (
              <div style={{ flex: '0 0 auto' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Result</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setAddMade(true)}
                    className="btn btn-sm"
                    style={{ background: addMade ? 'var(--accent)' : 'transparent', color: addMade ? '#1a1a2e' : 'var(--text)', borderColor: addMade ? 'var(--accent)' : 'var(--border)' }}
                  >
                    MADE
                  </button>
                  <button
                    onClick={() => setAddMade(false)}
                    className="btn btn-sm"
                    style={{ background: !addMade ? 'var(--danger)' : 'transparent', color: !addMade ? '#fff' : 'var(--text)', borderColor: !addMade ? 'var(--danger)' : 'var(--border)' }}
                  >
                    MISSED
                  </button>
                </div>
              </div>
            )}
            <button onClick={handleAddEvent} className="btn btn-primary btn-sm">ADD</button>
          </div>
        )}

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {match.events.length === 0 && (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>No events</p>
          )}
          {[...match.events].reverse().map((ev) => (
            <div
              key={ev.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: '13px',
              }}
            >
              <span className={`badge ${ev.made !== false ? 'badge-made' : 'badge-missed'}`}>
                {hotkeys[ev.type]?.label || ev.type}
                {(ev.type === '2pt' || ev.type === '3pt') && (ev.made ? ' ✓' : ' ✗')}
              </span>
              <span style={{ color: 'var(--text-bright)', flex: 1 }}>{getPlayer(ev.playerId)?.name}</span>
              <button
                onClick={() => removeEvent(matchId, ev.id)}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '14px' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
