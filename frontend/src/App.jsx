import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import UploadVideo from './pages/UploadVideo';
import WatchVideo from './pages/WatchVideo';
import ChannelProfile from './pages/ChannelProfile';
import Dashboard from './pages/Dashboard';
import LikedVideos from './pages/LikedVideos';
import PlaylistDetails from './pages/PlaylistDetails';
import UserPlaylists from './pages/UserPlaylists';
import History from './pages/History';
import Community from './pages/Community';
import Shorts from './pages/Shorts';
import SearchResults from './pages/SearchResults';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMainMargin = () => {
    if (isMobile) return '0';
    return sidebarOpen ? '240px' : '72px';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => isMobile && setSidebarOpen(false)}
          isMobile={isMobile}
        />
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 89
            }}
          />
        )}
        <main style={{
          flex: 1,
          marginLeft: getMainMargin(),
          padding: isMobile ? '1rem' : '1.5rem',
          transition: 'all 0.3s ease',
          width: '100%',
          minHeight: 'calc(100vh - 56px)'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/watch/:videoId" element={<WatchVideo />} />
            <Route path="/c/:username" element={<ChannelProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/liked-videos" element={<LikedVideos />} />
            <Route path="/playlists" element={<UserPlaylists />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
            <Route path="/history" element={<History />} />
            <Route path="/community" element={<Community />} />
            <Route path="/shorts" element={<Shorts />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
