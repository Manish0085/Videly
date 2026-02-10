import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MdHome,
    MdOutlineExplore,
    MdOutlineHistory,
    MdOutlineThumbUpOffAlt,
    MdOutlinePeople,
    MdOutlineVideoSettings,
    MdOutlinePlaylistPlay
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onClose, isMobile }) {
    const location = useLocation();
    const { user } = useAuth();

    // Main items available to all
    const mainItems = [
        { icon: MdHome, label: 'Home', path: '/' },
        { icon: MdOutlineExplore, label: 'Shorts', path: '/shorts' },
        { icon: MdOutlinePeople, label: 'Community', path: '/community' },
    ];

    // Library items available to all (though some might be empty if logged out)
    const personalItems = [
        { icon: MdOutlineHistory, label: 'History', path: '/history' },
        { icon: MdOutlinePlaylistPlay, label: 'Playlists', path: '/playlists' },
        { icon: MdOutlineThumbUpOffAlt, label: 'Liked Videos', path: '/liked-videos' },
    ];

    const SidebarLink = ({ item }) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
            <Link
                to={item.path}
                onClick={() => isMobile && onClose && onClose()}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'var(--hover)' : 'transparent',
                    color: isActive ? 'var(--white)' : 'var(--text-main)',
                    gap: '1.5rem',
                    margin: '0 0.5rem',
                    transition: 'background 0.2s'
                }}
            >
                <Icon size={24} style={{ flexShrink: 0 }} />
                <span style={{
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.2s',
                    fontWeight: isActive ? 500 : 400
                }}>
                    {item.label}
                </span>
            </Link>
        );
    };

    return (
        <aside style={{
            position: 'fixed',
            left: 0,
            top: '56px',
            height: 'calc(100vh - 56px)',
            width: isOpen ? '240px' : '72px',
            backgroundColor: 'var(--bg)',
            padding: '0.5rem 0',
            transition: 'all 0.3s ease',
            overflowX: 'hidden',
            overflowY: 'auto',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            borderRight: isOpen ? 'none' : '1px solid rgba(255,255,255,0.05)',
            transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
            boxShadow: isMobile && isOpen ? '4px 0 12px rgba(0,0,0,0.3)' : 'none'
        }}>
            <div style={{ paddingBottom: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid #333' }}>
                {mainItems.map(item => <SidebarLink key={item.label} item={item} />)}
            </div>

            <div style={{ paddingBottom: '0.5rem', marginBottom: '0.5rem', borderBottom: user ? '1px solid #333' : 'none' }}>
                <p style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'white', opacity: isOpen ? 1 : 0, marginBottom: '0.25rem' }}>You</p>
                {personalItems.map(item => <SidebarLink key={item.label} item={item} />)}
            </div>

            {user && (
                <div>
                    <SidebarLink item={{ icon: MdOutlineVideoSettings, label: 'Dashboard', path: '/dashboard' }} />
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
