import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import { MdOutlineExplore, MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';

function Home() {
    const [videos, setVideos] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showShorts, setShowShorts] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both lists independently
                const [videosRes, shortsRes] = await Promise.all([
                    api.get('/videos'),
                    api.get('/videos/shorts')
                ]);

                const rawVideos = videosRes.data?.data || [];
                const rawShorts = shortsRes.data?.data || [];

                // DEEP CLEANING: Ensure a video cannot exist in both lists
                const shortIds = new Set(rawShorts.map(s => s.id || s._id));
                const uniqueVideos = rawVideos.filter(v => !shortIds.has(v.id || v._id));

                setVideos(uniqueVideos);
                setShorts(rawShorts);
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const ShortItem = ({ short }) => (
        <Link
            to={`/shorts?id=${short.id || short._id}`}
            style={{
                textDecoration: 'none',
                color: 'inherit',
                minWidth: '180px',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{
                aspectRatio: '9/16',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#222',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
                <img
                    src={short.thumbnail}
                    alt={short.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', bottom: '0', left: 0, right: 0,
                    padding: '20px 10px 10px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                }}>
                    <p style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'white',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.2rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                        {short.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '4px' }}>{short.views} views</p>
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #333', borderTop: '4px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem' }}>Loading StreamBox...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>;
    }

    const videoChunks = [];
    const chunkSize = 8;
    for (let i = 0; i < videos.length; i += chunkSize) {
        videoChunks.push(videos.slice(i, i + chunkSize));
    }

    return (
        <div style={{ color: 'white', paddingBottom: '2rem' }}>
            {/* NO CONTENT CASE */}
            {videos.length === 0 && (shorts.length === 0 || !showShorts) && (
                <div style={{ textAlign: 'center', marginTop: '10rem', color: '#666' }}>
                    <p style={{ fontSize: '1.1rem' }}>No videos found. Be the first to upload!</p>
                </div>
            )}

            {/* FIRST ROW OF VIDEOS */}
            {videoChunks.length > 0 && (
                <div className="video-grid" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2.5rem 1.25rem', paddingTop: '0.5rem', marginBottom: '3rem'
                }}>
                    {videoChunks[0].map(v => <VideoCard key={v.id || v._id} video={v} />)}
                </div>
            )}

            {/* SHORTS SHELF (STRICTLY FOR SHORTS ONLY) */}
            {shorts.length > 0 && showShorts && (
                <div style={{
                    marginBottom: '4rem', borderTop: '4px solid #1e1e1e', borderBottom: '4px solid #1e1e1e',
                    padding: '2rem 0', position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MdOutlineExplore size={32} color="#FF0000" />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Shorts</h2>
                        </div>
                        <button onClick={() => setShowShorts(false)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                            <MdClose size={24} />
                        </button>
                    </div>

                    <div className="shorts-shelf-grid">
                        {shorts.map(s => <ShortItem key={s.id || s._id} short={s} />)}
                    </div>

                    <style>
                        {`
                    .shorts-shelf-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                        gap: 12px;
                        padding: 0 0.5rem;
                    }
                    @media (max-width: 768px) {
                        .shorts-shelf-grid {
                            display: flex;
                            overflow-x: auto;
                            scroll-snap-type: x mandatory;
                            padding-bottom: 1rem;
                            scrollbar-width: none; /* Firefox */
                        }
                        .shorts-shelf-grid::-webkit-scrollbar {
                            display: none; /* Chrome/Safari */
                        }
                        .shorts-shelf-grid > a {
                            min-width: 160px !important; /* Smaller on mobile */
                            width: 160px;
                            flex-shrink: 0;
                            scroll-snap-align: start;
                        }
                    }
                    `}
                    </style>

                    {shorts.length > 6 && (
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <Link to="/shorts" style={{ color: '#3ea6ff', textDecoration: 'none', fontWeight: 600 }}>Expand</Link>
                        </div>
                    )}
                </div>
            )}

            {/* REMAINING VIDEOS */}
            {videoChunks.slice(1).map((chunk, idx) => (
                <div key={idx} className="video-grid" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2.5rem 1.25rem', marginBottom: '3rem'
                }}>
                    {chunk.map(v => <VideoCard key={v.id || v._id} video={v} />)}
                </div>
            ))}
        </div>
    );
}

export default Home;
