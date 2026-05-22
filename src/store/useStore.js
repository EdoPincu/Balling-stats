import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_HOTKEYS = {
  '2pt': { key: 'p', label: '2PT Shot' },
  '3pt': { key: 't', label: '3PT Shot' },
  assist: { key: 'a', label: 'Assist' },
  block: { key: 'b', label: 'Block' },
  steal: { key: 's', label: 'Steal' },
  rebound: { key: 'r', label: 'Rebound' },
};

const useStore = create(
  persist(
    (set, get) => ({
      players: [],
      matches: [],
      hotkeys: DEFAULT_HOTKEYS,
      activeMatch: null,

      addPlayer: (name) => {
        const player = { id: uuidv4(), name, createdAt: Date.now() };
        set((s) => ({ players: [...s.players, player] }));
        return player;
      },

      updatePlayer: (id, updates) =>
        set((s) => ({
          players: s.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deletePlayer: (id) =>
        set((s) => ({ players: s.players.filter((p) => p.id !== id) })),

      setHotkeys: (hotkeys) => set({ hotkeys }),
      resetHotkeys: () => set({ hotkeys: DEFAULT_HOTKEYS }),

      createMatch: (team1Ids, team2Ids) => {
        const match = {
          id: uuidv4(),
          date: Date.now(),
          team1: team1Ids,
          team2: team2Ids,
          events: [],
          completed: false,
        };
        set((s) => ({ matches: [...s.matches, match], activeMatch: match.id }));
        return match;
      },

      addEvent: (matchId, playerId, type, made = true, points = 0) => {
        const event = { id: uuidv4(), playerId, type, made, points, timestamp: Date.now() };
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId ? { ...m, events: [...m.events, event] } : m
          ),
        }));
      },

      removeEvent: (matchId, eventId) =>
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId
              ? { ...m, events: m.events.filter((e) => e.id !== eventId) }
              : m
          ),
        })),

      endMatch: (matchId) =>
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId ? { ...m, completed: true } : m
          ),
          activeMatch: null,
        })),

      deleteMatch: (matchId) =>
        set((s) => ({
          matches: s.matches.filter((m) => m.id !== matchId),
          activeMatch: s.activeMatch === matchId ? null : s.activeMatch,
        })),

      updateMatchEvent: (matchId, eventId, updates) =>
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  events: m.events.map((e) =>
                    e.id === eventId ? { ...e, ...updates } : e
                  ),
                }
              : m
          ),
        })),

      addEventToMatch: (matchId, event) =>
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId
              ? { ...m, events: [...m.events, { ...event, id: uuidv4(), timestamp: Date.now() }] }
              : m
          ),
        })),

      getPlayerStats: (playerId, filter = 'all') => {
        const { matches } = get();
        let relevantMatches = matches.filter(
          (m) =>
            m.completed &&
            (m.team1.includes(playerId) || m.team2.includes(playerId))
        );

        relevantMatches.sort((a, b) => b.date - a.date);

        if (filter === 'last1' && relevantMatches.length > 0)
          relevantMatches = [relevantMatches[0]];
        else if (filter === 'last3') relevantMatches = relevantMatches.slice(0, 3);

        const stats = {
          games: relevantMatches.length,
          points: 0,
          assists: 0,
          blocks: 0,
          steals: 0,
          rebounds: 0,
          fgMade: 0,
          fgAttempts: 0,
          fg2Made: 0,
          fg2Attempts: 0,
          fg3Made: 0,
          fg3Attempts: 0,
        };

        for (const match of relevantMatches) {
          for (const ev of match.events) {
            if (ev.playerId !== playerId) continue;
            switch (ev.type) {
              case '2pt':
                stats.fgAttempts++;
                stats.fg2Attempts++;
                if (ev.made) {
                  stats.fgMade++;
                  stats.fg2Made++;
                  stats.points += 2;
                }
                break;
              case '3pt':
                stats.fgAttempts++;
                stats.fg3Attempts++;
                if (ev.made) {
                  stats.fgMade++;
                  stats.fg3Made++;
                  stats.points += 3;
                }
                break;
              case 'assist':
                stats.assists++;
                break;
              case 'block':
                stats.blocks++;
                break;
              case 'steal':
                stats.steals++;
                break;
              case 'rebound':
                stats.rebounds++;
                break;
            }
          }
        }

        stats.fgPercent =
          stats.fgAttempts > 0
            ? Math.round((stats.fgMade / stats.fgAttempts) * 100)
            : 0;

        return stats;
      },
    }),
    {
      name: 'basketball-stats-storage',
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        hotkeys: { ...DEFAULT_HOTKEYS, ...persisted.hotkeys },
      }),
    }
  )
);

export default useStore;
