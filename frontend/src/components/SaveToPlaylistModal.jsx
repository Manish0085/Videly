import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaLock, FaGlobe } from 'react-icons/fa';

function SaveToPlaylistModal({ videoId, onClose }) {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '', isPublic: true });

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const { data } = await api.get(`/playlists/user/${user._id}`);
                setPlaylists(data.data);
            } catch (error) {
                console.error("Failed to fetch playlists", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserPlaylists();
        }
    }, [user]);

    const handleToggleVideo = async (playlist) => {
        const exists = playlist.videos.includes(videoId);
        try {
            if (exists) {
                await api.patch(`/playlists/remove/${videoId}/${playlist._id}`);
                setPlaylists(prev => prev.map(p =>
                    p._id === playlist._id
                        ? { ...p, videos: p.videos.filter(id => id !== videoId) }
                        : p
                ));
            } else {
                await api.patch(`/playlists/add/${videoId}/${playlist._id}`);
                setPlaylists(prev => prev.map(p =>
                    p._id === playlist._id
                        ? { ...p, videos: [...p.videos, videoId] }
                        : p
                ));
            }
        } catch (error) {
            console.error("Failed to update playlist", error);
            alert("Action failed. Please try again.");
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylist.name.trim()) return;

        try {
            const { data } = await api.post('/playlists', newPlaylist);
            const createdPlaylist = data.data;

            // Immediately add current video to the new playlist
            await api.patch(`/playlists/add/${videoId}/${createdPlaylist._id}`);

            setPlaylists(prev => [{ ...createdPlaylist, videos: [videoId] }, ...prev]);
            setShowCreate(false);
            setNewPlaylist({ name: '', description: '', isPublic: true });
        } catch (error) {
            console.error("Failed to create playlist", error);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: '#202020', padding: '1.5rem', borderRadius: '12px',
                width: '100%', maxWidth: '300px', maxHeight: '80vh', overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem' }}>Save to...</h2>
                    <button onClick={onClose} style={{ color: 'white', fontSize: '1.2rem' }}>&times;</button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {playlists.map(playlist => (
                            <label key={playlist._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={playlist.videos.some(vid => (vid._id || vid) === videoId)}
                                    onChange={() => handleToggleVideo(playlist)}
                                />
                                <span style={{ flex: 1 }}>{playlist.name}</span>
                                {playlist.isPublic ? <FaGlobe size={12} color="#aaa" /> : <FaLock size={12} color="#aaa" />}
                            </label>
                        ))}
                    </div>
                )}

                <hr style={{ margin: '1rem 0', borderColor: '#333' }} />

                {!showCreate ? (
                    <button
                        onClick={() => setShowCreate(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', background: 'transparent', padding: 0 }}
                    >
                        <FaPlus /> Create new playlist
                    </button>
                ) : (
                    <form onSubmit={handleCreatePlaylist} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                            type="text"
                            placeholder="Enter playlist name..."
                            value={newPlaylist.name}
                            onChange={e => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #555', color: 'white', padding: '0.25rem 0' }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Privacy</label>
                            <select
                                value={newPlaylist.isPublic}
                                onChange={e => setNewPlaylist(prev => ({ ...prev, isPublic: e.target.value === 'true' }))}
                                style={{ background: '#333', color: 'white', padding: '0.25rem', borderRadius: '4px', border: 'none' }}
                            >
                                <option value="true">Public</option>
                                <option value="false">Private</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button type="button" onClick={() => setShowCreate(false)} style={{ background: 'transparent', color: 'white' }}>Cancel</button>
                            <button
                                type="submit"
                                disabled={!newPlaylist.name.trim()}
                                style={{ color: newPlaylist.name.trim() ? 'var(--primary)' : '#555', background: 'transparent', fontWeight: 600 }}
                            >
                                CREATE
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default SaveToPlaylistModal;
