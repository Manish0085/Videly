import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { MdHistory, MdOutlineHistory } from 'react-icons/md';
import { Link } from 'react-router-dom';

function History() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/users/history');
                const historyData = data?.data || [];
                setHistory([...historyData].reverse());
            } catch (error) {
                console.error("Failed to fetch history", error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) return (
        <div style={{ textAlign: 'center', marginTop: '10vh', color: 'white' }}>
            <MdOutlineHistory size={120} style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.05)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Keep track of what you watch</h2>
            <p style={{ color: '#aaa', marginTop: '0.75rem', maxWidth: '300px', margin: '0.75rem auto' }}>
                Watch history isn't viewable when you're signed out.
            </p>
            <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                marginTop: '1.5rem', border: '1px solid #333', color: '#3ea6ff',
                padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600
            }}>
                Sign in
            </Link>
        </div>
    );

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading history...</div>;

    return (
        <div style={{ color: 'white', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700 }}>
                Watch history
            </h1>

            {history.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '5rem', color: '#aaa' }}>
                    <p style={{ fontSize: '1rem' }}>This list has no videos.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map((video, index) => (
                        <VideoCard key={(video._id || video.id) + index} video={video} horizontal={true} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;
