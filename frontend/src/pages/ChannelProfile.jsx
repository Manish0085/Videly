import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

function ChannelProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [activeTab, setActiveTab] = useState('Videos'); // 'Videos', 'Shorts', 'Playlists', 'Community'
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [subscribed, setSubscribed] = useState(false);
    const [subCount, setSubCount] = useState(0);

    useEffect(() => {
        const fetchChannelData = async () => {
            if (!username) return;
            try {
                const profileRes = await api.get(`/users/c/${username}`);
                const p = profileRes.data.data;
                setProfile(p);
                setSubscribed(p.isSubscribed);
                setSubCount(p.subscribersCount);

                const videosRes = await api.get(`/videos`);
                const shortsRes = await api.get(`/videos/shorts`);

                const userVideos = (videosRes.data?.data || []).filter(v => v.owner?.username === username);
                const userShorts = (shortsRes.data?.data || []).filter(v => v.owner?.username === username);

                setVideos([...userVideos, ...userShorts]);
            } catch (error) {
                console.error("Failed to load channel", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChannelData();
    }, [username]);

    const handleSubscribe = async () => {
        if (!user) return alert("Please login to subscribe");
        const prevSub = subscribed;
        setSubscribed(!subscribed);
        setSubCount(prev => subscribed ? prev - 1 : prev + 1);
        try {
            await api.post(`/subscriptions/c/${profile._id || profile.id}`);
        } catch (error) {
            setSubscribed(prevSub);
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Loading Channel...</div>;
    if (!profile) return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Channel not found</div>;

    const filteredContent = videos.filter(v => {
        if (activeTab === 'Videos') return !v.isShort;
        if (activeTab === 'Shorts') return v.isShort;
        return true;
    });

    const TabButton = ({ name }) => (
        <button
            onClick={() => setActiveTab(name)}
            style={{
                padding: '1rem 0',
                borderBottom: activeTab === name ? '3px solid white' : 'none',
                fontWeight: 600,
                background: 'none',
                color: activeTab === name ? 'white' : '#aaa',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
            }}
        >
            {name}
        </button>
    );

    return (
        <div style={{ color: 'white' }}>
            {/* Cover Image */}
            <div style={{ height: '22vh', minHeight: '160px', maxHeight: '350px', background: '#272727', overflow: 'hidden' }}>
                {profile.coverImage ? (
                    <img src={profile.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to right, #0f0f0f, #282828)' }}></div>
                )}
            </div>

            <div style={{ maxWidth: '1284px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div className="channel-header">
                    <img
                        src={profile.avatar}
                        alt={profile.username}
                        style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg)' }}
                    />
                    <div style={{ marginTop: '0.5rem', flex: 1 }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{profile.fullName}</h1>
                        <p style={{ color: '#aaaaaa', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
                            @{profile.username} • {subCount?.toLocaleString()} subscribers • {videos.length} videos
                        </p>
                        <p style={{ color: '#aaaaaa', fontSize: '0.9rem', marginTop: '0.75rem', maxWidth: '600px', lineHeight: '1.4' }}>
                            {profile.description || "No description available."}
                        </p>

                        <div style={{ marginTop: '1.5rem' }}>
                            {user?.username === profile.username ? (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '24px', fontWeight: 600, border: 'none' }}>Customize channel</button>
                                    <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '24px', fontWeight: 600, border: 'none' }}>Manage videos</button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSubscribe}
                                    style={{
                                        background: subscribed ? 'rgba(255,255,255,0.1)' : 'white',
                                        color: subscribed ? 'white' : 'black',
                                        padding: '0.7rem 1.75rem',
                                        borderRadius: '24px',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {subscribed ? 'Subscribed' : 'Subscribe'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', gap: '2.5rem' }}>
                        <TabButton name="Videos" />
                        <TabButton name="Shorts" />
                        <TabButton name="Playlists" />
                        <TabButton name="Community" />
                    </div>
                </div>

                <div className={activeTab === 'Shorts' ? "channel-shorts-grid" : "channel-content-grid"}>
                    {filteredContent.length > 0 ? filteredContent.map(video => (
                        <VideoCard key={video._id || video.id} video={video} />
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', marginTop: '5rem', color: '#666' }}>
                            <p style={{ fontSize: '1.1rem' }}>No {activeTab.toLowerCase()} yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChannelProfile;
