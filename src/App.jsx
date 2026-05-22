import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Players from './pages/Players';
import NewMatch from './pages/NewMatch';
import LiveMatch from './pages/LiveMatch';
import Stats from './pages/Stats';
import MatchHistory from './pages/MatchHistory';
import MatchDetail from './pages/MatchDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/new-match" element={<NewMatch />} />
        <Route path="/live/:matchId" element={<LiveMatch />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/history" element={<MatchHistory />} />
        <Route path="/match/:matchId" element={<MatchDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
