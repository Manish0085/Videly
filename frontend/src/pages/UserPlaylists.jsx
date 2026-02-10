import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MdOutlinePlaylistPlay, MdLock, MdPublic } from 'react-icons/md';

function UserPlaylists() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const { data } = await api.get(`/playlists/user/${user._id || user.id}`);
                setPlaylists(data?.data || []);
            } catch (error) {
                console.error("Failed to fetch playlists", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPlaylists();
        }
    }, [user]);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Loading playlists...</div>;

    return (
        <div style={{ color: 'white' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2.5rem' }}>Playlists</h1>

            {playlists.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '10vh', color: '#aaa' }}>
                    <MdOutlinePlaylistPlay size={120} style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.05)' }} />
                    <p style={{ fontSize: '1.1rem' }}>No playlists created yet.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2.5rem 1.5rem'
                }}>
                    {playlists.map(playlist => (
                        <Link
                            key={playlist._id || playlist.id}
                            to={`/playlist/${playlist._id || playlist.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}
                        >
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                background: '#333',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {playlist.videos?.[0]?.thumbnail ? (
                                    <img
                                        src={playlist.videos[0].thumbnail}
                                        alt={playlist.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2c2c2c' }}>
                                        <MdOutlinePlaylistPlay size={40} color="#555" />
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%',
                                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                                    fontWeight: 600
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>{playlist.videos?.length || 0}</span>
                                    <MdOutlinePlaylistPlay size={24} />
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{playlist.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaaaaa', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {playlist.isPublic ? <MdPublic size={16} /> : <MdLock size={16} />}
                                    <span>{playlist.isPublic ? 'Public' : 'Private'} • Playlist</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#aaaaaa', marginTop: '4px', fontWeight: 600 }}>VIEW FULL PLAYLIST</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserPlaylists;
