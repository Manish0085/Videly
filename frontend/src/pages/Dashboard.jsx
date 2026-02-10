import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { MdOutlineBarChart, MdFavorite, MdPlayCircleOutline, MdToggleOn, MdToggleOff } from 'react-icons/md';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const statsRes = await api.get('/dashboard/stats');
            setStats(statsRes.data.data);

            const videosRes = await api.get('/dashboard/videos');
            // Ensure we handle both _id and id as per our backend DTO/Model mix
            const mappedVideos = (videosRes.data?.data || []).map(v => ({
                ...v,
                id: v._id || v.id // Standardize ID
            }));
            setVideos(mappedVideos);
        } catch (error) {
            console.error("Dashboard load failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (videoId) => {
        try {
            await api.patch(`/videos/toggle/publish/${videoId}`);
            setVideos(prev => prev.map(v => v.id === videoId ? { ...v, isPublished: !v.isPublished } : v));
        } catch (error) {
            console.error("Failed to toggle status", error);
        }
    };

    if (loading) return (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '10rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem' }}>Loading Videly Studio...</p>
            <style>{`.loading-spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ color: 'white', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Channel dashboard</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaaaaa', marginBottom: '1rem' }}>
                        <MdOutlineBarChart size={24} />
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total views</span>
                    </div>
                    <h3 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats?.totalViews?.toLocaleString() || 0}</h3>
                </div>

                <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaaaaa', marginBottom: '1rem' }}>
                        <MdFavorite size={24} />
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total likes</span>
                    </div>
                    <h3 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats?.totalLikes?.toLocaleString() || 0}</h3>
                </div>

                <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#aaaaaa', marginBottom: '1rem' }}>
                        <MdPlayCircleOutline size={24} />
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total videos</span>
                    </div>
                    <h3 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats?.totalVideos?.toLocaleString() || 0}</h3>
                </div>
            </div>

            {/* Videos Table */}
            <div style={{ background: '#1a1a1a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Video Content ({videos.length})</h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '1.2rem 2rem' }}>Video</th>
                                <th style={{ padding: '1.2rem 2rem' }}>Visibility</th>
                                <th style={{ padding: '1.2rem 2rem' }}>Date</th>
                                <th style={{ padding: '1.2rem 2rem' }}>Views</th>
                                <th style={{ padding: '1.2rem 2rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map(video => (
                                <tr key={video.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1rem 2rem', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', width: '120px', height: '68px', flexShrink: 0 }}>
                                            <img src={video.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                                            {video.isShort && (
                                                <span style={{ position: 'absolute', top: '4px', left: '4px', fontSize: '0.65rem', background: '#FF0000', padding: '1px 6px', borderRadius: '3px', fontWeight: 800 }}>SHORT</span>
                                            )}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.title}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#666' }}>{video.description?.substring(0, 40)}...</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 2rem' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: video.isPublished ? 'rgba(43,166,64,0.1)' : 'rgba(255,255,255,0.05)', color: video.isPublished ? '#2ba640' : '#888' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{video.isPublished ? 'Public' : 'Private'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 2rem', fontSize: '0.9rem', color: '#888' }}>{new Date(video.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '1rem 2rem', fontSize: '1rem', fontWeight: 600 }}>{video.views?.toLocaleString()}</td>
                                    <td style={{ padding: '1rem 2rem' }}>
                                        <button
                                            onClick={() => handleTogglePublish(video.id)}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '10px', color: video.isPublished ? '#3ea6ff' : '#666', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#3ea6ff'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            title="Toggle Visibility"
                                        >
                                            {video.isPublished ? <MdToggleOn size={28} /> : <MdToggleOff size={28} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {videos.length === 0 && (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#666' }}>
                        <MdPlayCircleOutline size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                        <p style={{ fontSize: '1.1rem' }}>No videos found in your library.</p>
                        <button style={{ marginTop: '1.5rem', background: '#3ea6ff', color: 'black', border: 'none', padding: '0.75rem 2rem', borderRadius: '24px', fontWeight: 700, cursor: 'pointer' }}>Upload Content</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
