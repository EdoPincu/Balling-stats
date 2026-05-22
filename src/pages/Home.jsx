import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Home() {
  const players = useStore((s) => s.players);
  const matches = useStore((s) => s.matches);
  const activeMatch = useStore((s) => s.activeMatch);

  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '64px', marginBottom: '8px' }}>🏀</div>
      <h1
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '32px',
          color: 'var(--primary)',
          marginBottom: '4px',
          lineHeight: 1.4,
        }}
      >
        BALLIN'
      </h1>
      <h2
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '14px',
          color: 'var(--secondary)',
          marginBottom: '40px',
          letterSpacing: '3px',
        }}
      >
        STATS TRACKER
      </h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '48px',
          fontFamily: 'var(--font-retro)',
          fontSize: '11px',
        }}
      >
        <div>
          <div style={{ color: 'var(--accent)', fontSize: '28px', fontFamily: 'var(--font-main)' }}>
            {players.length}
          </div>
          <div style={{ color: 'var(--text-dim)' }}>PLAYERS</div>
        </div>
        <div style={{ width: '2px', background: 'var(--border)' }} />
        <div>
          <div style={{ color: 'var(--secondary)', fontSize: '28px', fontFamily: 'var(--font-main)' }}>
            {matches.filter((m) => m.completed).length}
          </div>
          <div style={{ color: 'var(--text-dim)' }}>GAMES</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '360px', margin: '0 auto' }}>
        {activeMatch && (
          <Link to={`/live/${activeMatch}`} className="btn btn-accent" style={{ justifyContent: 'center', fontSize: '18px', padding: '18px' }}>
            🔥 RESUME MATCH
          </Link>
        )}

        <Link to="/new-match" className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '18px', padding: '18px' }}>
          🏀 NEW MATCH
        </Link>

        <Link to="/players" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
          👥 PLAYERS
        </Link>

        <Link to="/stats" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
          📊 STATS
        </Link>

        <Link to="/history" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
          📋 MATCH HISTORY
        </Link>

        <Link to="/settings" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
          ⚙️ SETTINGS
        </Link>
      </div>

      <div
        style={{
          marginTop: '48px',
          fontFamily: 'var(--font-retro)',
          fontSize: '8px',
          color: 'var(--text-dim)',
          letterSpacing: '2px',
        }}
      >
        TRACK YOUR SQUAD
      </div>
    </div>
  );
}
