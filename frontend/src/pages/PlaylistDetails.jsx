import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import { FaLock, FaGlobe, FaTrash } from 'react-icons/fa';

function PlaylistDetails() {
    const { playlistId } = useParams();
    const { user } = useAuth();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const { data } = await api.get(`/playlists/${playlistId}`);
                setPlaylist(data.data);
            } catch (error) {
                console.error("Failed to load playlist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylist();
    }, [playlistId]);

    const handleRemoveVideo = async (videoId) => {
        try {
            await api.patch(`/playlists/remove/${videoId}/${playlistId}`);
            setPlaylist(prev => ({
                ...prev,
                videos: prev.videos.filter(v => v._id !== videoId)
            }));
        } catch (error) {
            console.error("Failed to remove video", error);
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading playlist...</div>;
    if (!playlist) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Playlist not found</div>;

    const isOwner = user?._id === playlist.owner;

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Sidebar-like Playlist Info */}
            <div style={{
                flex: '1', minWidth: '300px', background: 'linear-gradient(to bottom, #404040, #202020)',
                padding: '1.5rem', borderRadius: '12px', height: 'fit-content'
            }}>
                <div style={{ aspectRatio: '16/9', background: '#333', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden' }}>
                    {playlist.videos[0] && (
                        <img src={playlist.videos[0].thumbnail} alt="Playlist Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                </div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{playlist.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <span>{playlist.videos.length} videos</span>
                    {playlist.isPublic ? <FaGlobe title="Public" /> : <FaLock title="Private" />}
                </div>
                <p style={{ color: '#eee', fontSize: '0.9rem' }}>{playlist.description || "No description provided."}</p>
            </div>

            {/* Video List */}
            <div style={{ flex: '2', minWidth: '300px' }}>
                {playlist.videos.length === 0 ? (
                    <div style={{ color: '#aaa', textAlign: 'center', marginTop: '2rem' }}>This playlist is empty.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {playlist.videos.map((video, index) => (
                            <div key={video._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ color: '#aaa', width: '20px' }}>{index + 1}</span>
                                <div style={{ flex: 1 }}>
                                    <VideoCard video={video} />
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => handleRemoveVideo(video._id)}
                                        style={{ color: '#ff4d4d', background: 'transparent', padding: '0.5rem' }}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlaylistDetails;
