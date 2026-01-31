import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FacebookPage from './pages/FacebookPage';
import YouTubePage from './pages/YouTubePage';
import InstagramPage from './pages/InstagramPage';
import TikTokPage from './pages/TikTokPage';
import useTheme from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Navigate to="/youtube" replace />} />
          <Route path="/youtube" element={<YouTubePage />} />
          <Route path="/facebook" element={<FacebookPage />} />
          <Route path="/instagram" element={<InstagramPage />} />
          <Route path="/tiktok" element={<TikTokPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
