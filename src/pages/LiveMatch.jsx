import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function LiveMatch() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const matches = useStore((s) => s.matches);
  const players = useStore((s) => s.players);
  const hotkeys = useStore((s) => s.hotkeys);
  const addEvent = useStore((s) => s.addEvent);
  const removeEvent = useStore((s) => s.removeEvent);
  const endMatch = useStore((s) => s.endMatch);

  const match = matches.find((m) => m.id === matchId);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [toast, setToast] = useState(null);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  const allPlayerIds = match ? [...match.team1, ...match.team2] : [];
  const getPlayer = (id) => players.find((p) => p.id === id);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleStatInput = useCallback(
    (type, made) => {
      if (!selectedPlayer || !match) return;
      const points = type === '3pt' ? 3 : type === '2pt' ? 2 : 0;
      addEvent(matchId, selectedPlayer, type, made, points);

      const player = getPlayer(selectedPlayer);
      const label = hotkeys[type]?.label || type;
      const status = type === 'assist' || type === 'block' || type === 'steal' ? '' : made ? ' ✓' : ' ✗';
      showToast(`${player?.name}: ${label}${status}`);
      setSelectedPlayer(null);
    },
    [selectedPlayer, match, matchId, addEvent, hotkeys, showToast]
  );

  useEffect(() => {
    if (!match || match.completed) return;

    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= allPlayerIds.length) {
        e.preventDefault();
        setSelectedPlayer(allPlayerIds[num - 1]);
        return;
      }

      if (e.key === 'Escape') {
        setSelectedPlayer(null);
        return;
      }

      if (!selectedPlayer) return;

      const key = e.key.toLowerCase();
      const isShift = e.shiftKey;

      for (const [type, hk] of Object.entries(hotkeys)) {
        if (key === hk.key.toLowerCase()) {
          e.preventDefault();
          if (type === 'assist' || type === 'block' || type === 'steal' || type === 'rebound') {
            handleStatInput(type, true);
          } else {
            handleStatInput(type, !isShift);
          }
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [match, selectedPlayer, allPlayerIds, hotkeys, handleStatInput]);

  if (!match) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p>Match not found</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>GO HOME</Link>
      </div>
    );
  }

  const getTeamScore = (teamIds) => {
    return match.events
      .filter((e) => teamIds.includes(e.playerId) && e.made && (e.type === '2pt' || e.type === '3pt'))
      .reduce((sum, e) => sum + e.points, 0);
  };

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

  const handleEnd = (winnerTeam) => {
    endMatch(matchId, winnerTeam);
    navigate('/');
  };

  const team1Score = getTeamScore(match.team1);
  const team2Score = getTeamScore(match.team2);

  return (
    <div className="page" style={{ maxWidth: '1000px' }}>
      {/* Scoreboard */}
      <div
        className="card"
        style={{
          marginBottom: '24px',
          padding: '24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(17,138,178,0.1))',
          borderColor: match.completed ? 'var(--accent)' : 'var(--secondary)',
        }}
      >
        {match.completed && (
          <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--accent)', marginBottom: '8px', letterSpacing: '2px' }}>
            FINAL
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--primary)', marginBottom: '8px' }}>TEAM 1</div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '36px', color: 'var(--text-bright)' }}>{team1Score}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-retro)', fontSize: '14px', color: 'var(--text-dim)' }}>VS</div>
          <div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--accent2)', marginBottom: '8px' }}>TEAM 2</div>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '36px', color: 'var(--text-bright)' }}>{team2Score}</div>
          </div>
        </div>
      </div>

      {!match.completed && (
        <>
          {/* Hotkey Guide */}
          <div className="card" style={{ marginBottom: '16px', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-retro)', fontSize: '9px', color: 'var(--secondary)', marginBottom: '8px' }}>
              {selectedPlayer ? `PLAYER SELECTED: ${getPlayer(selectedPlayer)?.name} → PRESS STAT KEY` : 'PRESS PLAYER NUMBER (1-' + allPlayerIds.length + ')'}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
              {Object.entries(hotkeys).map(([type, hk]) => (
                <span key={type} style={{ color: 'var(--text-dim)' }}>
                  <kbd style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontFamily: 'var(--font-retro)',
                    fontSize: '10px',
                    color: 'var(--accent)',
                  }}>
                    {hk.key.toUpperCase()}
                  </kbd>
                  {' '}{hk.label}
                  {(type === '2pt' || type === '3pt') && (
                    <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}> (Shift=miss)</span>
                  )}
                </span>
              ))}
              <span style={{ color: 'var(--text-dim)' }}>
                <kbd style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontFamily: 'var(--font-retro)',
                  fontSize: '10px',
                  color: 'var(--danger)',
                }}>ESC</kbd>
                {' '}Deselect
              </span>
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--primary)', marginBottom: '8px' }}>🔴 TEAM 1</div>
              {match.team1.map((id, i) => {
                const stats = getPlayerMatchStats(id);
                const isSelected = selectedPlayer === id;
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedPlayer(id)}
                    className="card"
                    style={{
                      marginBottom: '8px',
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      boxShadow: isSelected ? '0 0 20px var(--primary-glow)' : 'none',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        fontFamily: 'var(--font-retro)',
                        fontSize: '16px',
                        color: isSelected ? 'var(--primary)' : 'var(--secondary)',
                        width: '28px',
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-main)', color: 'var(--text-bright)', fontSize: '16px' }}>
                          {getPlayer(id)?.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {stats.points}pts · {stats.assists}ast · {stats.fgMade}/{stats.fgAtt}FG · {stats.rebounds}reb · {stats.blocks}blk · {stats.steals}stl
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--accent2)', marginBottom: '8px' }}>🔵 TEAM 2</div>
              {match.team2.map((id, i) => {
                const stats = getPlayerMatchStats(id);
                const isSelected = selectedPlayer === id;
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedPlayer(id)}
                    className="card"
                    style={{
                      marginBottom: '8px',
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--accent2)' : 'var(--border)',
                      boxShadow: isSelected ? '0 0 20px rgba(17,138,178,0.3)' : 'none',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        fontFamily: 'var(--font-retro)',
                        fontSize: '16px',
                        color: isSelected ? 'var(--accent2)' : 'var(--secondary)',
                        width: '28px',
                      }}>
                        {match.team1.length + i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-main)', color: 'var(--text-bright)', fontSize: '16px' }}>
                          {getPlayer(id)?.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {stats.points}pts · {stats.assists}ast · {stats.fgMade}/{stats.fgAtt}FG · {stats.rebounds}reb · {stats.blocks}blk · {stats.steals}stl
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stat buttons for mobile / click input */}
          {selectedPlayer && (
            <div className="card animate-in" style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--secondary)', marginBottom: '12px' }}>
                INPUT FOR: {getPlayer(selectedPlayer)?.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button onClick={() => handleStatInput('2pt', true)} className="btn btn-accent btn-sm">2PT ✓</button>
                <button onClick={() => handleStatInput('2pt', false)} className="btn btn-danger btn-sm">2PT ✗</button>
                <button onClick={() => handleStatInput('3pt', true)} className="btn btn-accent btn-sm">3PT ✓</button>
                <button onClick={() => handleStatInput('3pt', false)} className="btn btn-danger btn-sm">3PT ✗</button>
                <button onClick={() => handleStatInput('assist', true)} className="btn btn-secondary btn-sm">ASSIST</button>
                <button onClick={() => handleStatInput('rebound', true)} className="btn btn-secondary btn-sm">REBOUND</button>
                <button onClick={() => handleStatInput('block', true)} className="btn btn-secondary btn-sm">BLOCK</button>
                <button onClick={() => handleStatInput('steal', true)} className="btn btn-secondary btn-sm">STEAL</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Event Log */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'var(--text-dim)' }}>PLAY LOG</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{match.events.length} plays</span>
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {match.events.length === 0 && (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px', fontSize: '13px' }}>
              No plays recorded yet
            </p>
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
              {!match.completed && (
                <button
                  onClick={() => removeEvent(matchId, ev.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '14px' }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* End Match */}
      {!match.completed && (
        <div style={{ textAlign: 'center' }}>
          {!showConfirmEnd ? (
            <button onClick={() => setShowConfirmEnd(true)} className="btn btn-danger">
              🏁 END MATCH
            </button>
          ) : (
            <div className="card animate-in" style={{ borderColor: 'var(--danger)' }}>
              <p style={{ fontFamily: 'var(--font-retro)', fontSize: '11px', color: 'var(--danger)', marginBottom: '16px' }}>
                WHO WON?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => handleEnd('team1')} className="btn" style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}>
                  🔴 TEAM 1
                </button>
                <button onClick={() => handleEnd('team2')} className="btn" style={{ background: 'var(--accent2)', color: '#fff', borderColor: 'var(--accent2)' }}>
                  🔵 TEAM 2
                </button>
                <button onClick={() => setShowConfirmEnd(false)} className="btn btn-ghost">CANCEL</button>
              </div>
            </div>
          )}
        </div>
      )}

      {match.completed && (
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn btn-primary">BACK TO HOME</Link>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
