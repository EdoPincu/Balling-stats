import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function MatchHistory() {
  const matches = useStore((s) => s.matches);
  const players = useStore((s) => s.players);
  const deleteMatch = useStore((s) => s.deleteMatch);

  const getPlayer = (id) => players.find((p) => p.id === id);
  const sorted = [...matches].sort((a, b) => b.date - a.date);

  const getTeamScore = (match, teamIds) => {
    return match.events
      .filter((e) => teamIds.includes(e.playerId) && e.made && (e.type === '2pt' || e.type === '3pt'))
      .reduce((sum, e) => sum + e.points, 0);
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <h1>📋 Match History</h1>
      </div>

      {sorted.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: '11px', color: 'var(--text-dim)' }}>
            NO MATCHES YET
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sorted.map((match) => {
          const t1Score = getTeamScore(match, match.team1);
          const t2Score = getTeamScore(match, match.team2);
          const date = new Date(match.date);

          return (
            <div key={match.id} className="card animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                  {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge" style={{
                    background: match.completed ? 'rgba(6,214,160,0.2)' : 'rgba(255,209,102,0.2)',
                    color: match.completed ? 'var(--accent)' : 'var(--secondary)',
                  }}>
                    {match.completed ? 'FINAL' : 'LIVE'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-retro)', fontSize: '8px', color: 'var(--primary)', marginBottom: '4px' }}>TEAM 1</div>
                  <div style={{ fontFamily: 'var(--font-retro)', fontSize: '24px', color: 'var(--text-bright)' }}>{t1Score}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--text-dim)' }}>VS</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-retro)', fontSize: '8px', color: 'var(--accent2)', marginBottom: '4px' }}>TEAM 2</div>
                  <div style={{ fontFamily: 'var(--font-retro)', fontSize: '24px', color: 'var(--text-bright)' }}>{t2Score}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  {match.team1.map((id) => getPlayer(id)?.name || 'Unknown').join(', ')}
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  {match.team2.map((id) => getPlayer(id)?.name || 'Unknown').join(', ')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Link to={`/match/${match.id}`} className="btn btn-ghost btn-sm">VIEW DETAILS</Link>
                <button onClick={() => deleteMatch(match.id)} className="btn btn-danger btn-sm">DELETE</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
