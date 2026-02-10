import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { MdThumbUpOffAlt, MdOutlineThumbUpOffAlt } from 'react-icons/md';
import { Link } from 'react-router-dom';

function LikedVideos() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                const { data } = await api.get('/likes/videos');
                const likedData = data?.data || [];
                // If it's a list of Like objects, extract the video part
                setVideos(likedData.map(item => item.video || item));
            } catch (error) {
                console.error("Failed to fetch liked videos", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchLikedVideos();
        } else {
            setLoading(false);
        }
    }, [user]);

    // UI for logged-out state (Similar to YouTube)
    if (!user) return (
        <div style={{ textAlign: 'center', marginTop: '10vh', color: 'white' }}>
            <MdOutlineThumbUpOffAlt size={120} style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.05)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Enjoy your favorite videos</h2>
            <p style={{ color: '#aaa', marginTop: '0.75rem', maxWidth: '400px', margin: '0.75rem auto' }}>
                Sign in to access videos that you've liked from any device.
            </p>
            <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                marginTop: '1.5rem', border: '1px solid #333', color: '#3ea6ff',
                padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 600,
                textDecoration: 'none'
            }}>
                Sign in
            </Link>
        </div>
    );

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading liked videos...</div>;

    return (
        <div style={{ color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Liked videos</h1>
            </div>

            {videos.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {videos.map(video => (
                        <VideoCard key={video._id || video.id} video={video} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '10vh' }}>
                    <MdThumbUpOffAlt size={120} style={{ color: 'rgba(255,255,255,0.05)', marginBottom: '2rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>No liked videos yet</h2>
                    <p style={{ color: '#aaa', marginTop: '0.75rem' }}>Videos you like will show up here.</p>
                </div>
            )}
        </div>
    );
}

export default LikedVideos;
