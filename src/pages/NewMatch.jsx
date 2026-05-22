import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function NewMatch() {
  const players = useStore((s) => s.players);
  const createMatch = useStore((s) => s.createMatch);
  const navigate = useNavigate();

  const [teamSize, setTeamSize] = useState(3);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);

  const available = players.filter((p) => !team1.includes(p.id) && !team2.includes(p.id));

  const addToTeam = (playerId, teamNum) => {
    if (teamNum === 1 && team1.length < teamSize) {
      setTeam1([...team1, playerId]);
    } else if (teamNum === 2 && team2.length < teamSize) {
      setTeam2([...team2, playerId]);
    }
  };

  const removeFromTeam = (playerId, teamNum) => {
    if (teamNum === 1) setTeam1(team1.filter((id) => id !== playerId));
    else setTeam2(team2.filter((id) => id !== playerId));
  };

  const canStart = team1.length === teamSize && team2.length === teamSize;

  const handleStart = () => {
    const match = createMatch(team1, team2);
    navigate(`/live/${match.id}`);
  };

  const getPlayer = (id) => players.find((p) => p.id === id);

  if (players.length < 2) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/" className="back-btn">←</Link>
          <h1>🏀 New Match</h1>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <p style={{ fontFamily: 'var(--font-retro)', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '16px' }}>
            NEED MORE PLAYERS
          </p>
          <p style={{ color: 'var(--text-dim)', marginBottom: '24px' }}>
            You need at least 2 players to start a match
          </p>
          <Link to="/players" className="btn btn-primary">ADD PLAYERS</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <h1>🏀 New Match</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <label style={{ fontFamily: 'var(--font-main)', fontSize: '14px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
          TEAM SIZE
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                setTeamSize(n);
                setTeam1(team1.slice(0, n));
                setTeam2(team2.slice(0, n));
              }}
              className="btn btn-sm"
              style={{
                background: teamSize === n ? 'var(--primary)' : 'transparent',
                color: teamSize === n ? '#fff' : 'var(--text)',
                borderColor: teamSize === n ? 'var(--primary)' : 'var(--border)',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              {n}v{n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ borderColor: 'var(--primary)' }}>
          <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: '12px', color: 'var(--primary)', marginBottom: '16px' }}>
            🔴 TEAM 1 ({team1.length}/{teamSize})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '60px' }}>
            {team1.map((id, i) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,107,53,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--secondary)' }}>#{i + 1}</span>
                <span style={{ flex: 1, color: 'var(--text-bright)' }}>{getPlayer(id)?.name}</span>
                <button onClick={() => removeFromTeam(id, 1)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ borderColor: 'var(--accent2)' }}>
          <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: '12px', color: 'var(--accent2)', marginBottom: '16px' }}>
            🔵 TEAM 2 ({team2.length}/{teamSize})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '60px' }}>
            {team2.map((id, i) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(17,138,178,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--secondary)' }}>#{team1.length + i + 1}</span>
                <span style={{ flex: 1, color: 'var(--text-bright)' }}>{getPlayer(id)?.name}</span>
                <button onClick={() => removeFromTeam(id, 2)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {available.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-main)', fontSize: '14px', color: 'var(--text-dim)', marginBottom: '16px' }}>
            AVAILABLE PLAYERS
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {available.map((player) => (
              <div key={player.id} style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => addToTeam(player.id, 1)}
                  disabled={team1.length >= teamSize}
                  className="btn btn-sm"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    opacity: team1.length >= teamSize ? 0.3 : 1,
                    borderRadius: '8px 0 0 8px',
                    padding: '8px 10px',
                  }}
                >
                  🔴
                </button>
                <span style={{
                  padding: '8px 14px',
                  background: 'var(--bg)',
                  border: '2px solid var(--border)',
                  borderLeft: 'none',
                  borderRight: 'none',
                  fontFamily: 'var(--font-main)',
                  fontSize: '14px',
                  color: 'var(--text-bright)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {player.name}
                </span>
                <button
                  onClick={() => addToTeam(player.id, 2)}
                  disabled={team2.length >= teamSize}
                  className="btn btn-sm"
                  style={{
                    borderColor: 'var(--accent2)',
                    color: 'var(--accent2)',
                    opacity: team2.length >= teamSize ? 0.3 : 1,
                    borderRadius: '0 8px 8px 0',
                    padding: '8px 10px',
                  }}
                >
                  🔵
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="btn btn-accent"
        style={{
          width: '100%',
          justifyContent: 'center',
          fontSize: '20px',
          padding: '18px',
          opacity: canStart ? 1 : 0.4,
        }}
      >
        🏀 START MATCH
      </button>
    </div>
  );
}
