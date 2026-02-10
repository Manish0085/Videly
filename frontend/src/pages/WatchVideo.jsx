import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';
import CommentSection from '../components/CommentSection';
import SaveToPlaylistModal from '../components/SaveToPlaylistModal';
import VideoCard from '../components/VideoCard';
import {
    MdOutlineThumbUpOffAlt,
    MdThumbUp,
    MdOutlineThumbDownOffAlt,
    MdOutlineShare,
    MdOutlinePlaylistAdd,
    MdMoreHoriz
} from 'react-icons/md';

const WatchVideo = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [showDesc, setShowDesc] = useState(false);
    const viewCounted = useRef(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const { data } = await api.get(`/videos/${videoId}`);
                if (data?.data) {
                    // REDIRECT LOGIC: If this is a Short, send it to the specialized Shorts player
                    if (data.data.isShort || (data.data.duration > 0 && data.data.duration <= 60)) {
                        navigate(`/shorts?id=${videoId}`, { replace: true });
                        return;
                    }

                    setVideo(data.data);
                    setIsLiked(data.data.isLiked || false);
                    setLikesCount(data.data.likesCount || 0);
                    setIsSubscribed(data.data.isSubscribed || false);
                    setSubscribersCount(data.data.subscribersCount || 0);
                }
            } catch (error) {
                console.error("Failed to load video", error);
            } finally {
                if (videoId) setLoading(false);
            }
        };

        const fetchRecommended = async () => {
            try {
                const { data } = await api.get('/videos');
                // Recommendations for long-videos should only be other long videos
                const filtered = (data?.data || []).filter(v => (v._id || v.id) !== videoId && !v.isShort && v.duration > 60);
                setRecommendedVideos(filtered);
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            }
        };

        const incrementView = async () => {
            if (viewCounted.current === videoId) return;
            viewCounted.current = videoId;
            try {
                await api.post(`/videos/view/${videoId}`);
            } catch (error) {
                console.error("Failed to increment view", error);
            }
        };

        if (videoId) {
            setLoading(true);
            fetchVideo();
            fetchRecommended();
            incrementView();
            window.scrollTo(0, 0);
        }
    }, [videoId, navigate]);

    const handleSubscribe = async () => {
        if (!user) return alert("Please login to subscribe");
        const prevSub = isSubscribed;
        const prevCount = subscribersCount;
        setIsSubscribed(!isSubscribed);
        setSubscribersCount(prev => isSubscribed ? prev - 1 : prev + 1);
        try {
            await api.post(`/subscriptions/c/${video.owner._id}`);
        } catch (error) {
            setIsSubscribed(prevSub);
            setSubscribersCount(prevCount);
        }
    };

    const handleLike = async () => {
        if (!user) return alert("Please login to like");
        const prevLiked = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        try {
            await api.post(`/likes/toggle/v/${videoId}`);
        } catch (error) {
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: video.title,
                    text: `Check out this video: ${video.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                if (error.name !== 'AbortError') console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Loading Videly...</p>
    </div>;

    if (!video) return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Video not found</div>;

    return (
        <div className="watch-video-container">
            <style>
                {`.spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }`}
            </style>
            {/* Left Section */}
            <div>
                {/* Video Player */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    <video
                        src={video.videoFile}
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%' }}
                    ></video>
                </div>

                <h1 style={{ fontSize: '1.4rem', marginTop: '1rem', fontWeight: 600, color: '#fff' }}>{video.title}</h1>

                {/* Sub & Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Link to={`/c/${video.owner?.username}`}>
                            <img
                                src={video.owner?.avatar || 'https://via.placeholder.com/40'}
                                alt={video.owner?.username}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #333' }}
                            />
                        </Link>
                        <div style={{ marginRight: '1rem' }}>
                            <Link to={`/c/${video.owner?.username}`} style={{ color: '#fff', textDecoration: 'none' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{video.owner?.username}</h3>
                            </Link>
                            <p style={{ fontSize: '0.75rem', color: '#aaa' }}>{subscribersCount} subscribers</p>
                        </div>
                        {user?._id !== video.owner?._id && (
                            <button
                                onClick={handleSubscribe}
                                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                                style={{
                                    background: isSubscribed ? 'rgba(255,255,255,0.1)' : '#fff',
                                    color: isSubscribed ? '#fff' : '#000',
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '24px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden' }}>
                            <button onClick={handleLike} style={{ padding: '0.5rem 1rem', background: 'none', color: isLiked ? '#3ea6ff' : '#fff', display: 'flex', alignItems: 'center', gap: '6px', border: 'none', borderRight: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                                {isLiked ? <MdThumbUp size={20} /> : <MdOutlineThumbUpOffAlt size={20} />}
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{likesCount}</span>
                            </button>
                            <button style={{ padding: '0.5rem 0.8rem', background: 'none', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                <MdOutlineThumbDownOffAlt size={20} />
                            </button>
                        </div>

                        <button onClick={handleShare} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}>
                            <MdOutlineShare size={20} /> Share
                        </button>

                        <button onClick={() => user ? setShowPlaylistModal(true) : alert("Please login")} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}>
                            <MdOutlinePlaylistAdd size={22} /> Save
                        </button>

                        <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                            <MdMoreHoriz size={20} />
                        </button>
                    </div>
                </div>

                {/* Description Box */}
                <div
                    onClick={() => setShowDesc(!showDesc)}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginTop: '1.5rem',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    <div style={{ fontWeight: 700, display: 'flex', gap: '1rem', marginBottom: '8px', color: '#fff' }}>
                        <span>{video.views?.toLocaleString()} views</span>
                        <span>{timeAgo(video.createdAt)}</span>
                    </div>
                    <p style={{
                        whiteSpace: 'pre-wrap',
                        color: '#eee',
                        lineHeight: '1.5',
                        display: showDesc ? 'block' : '-webkit-box',
                        WebkitLineClamp: showDesc ? 'unset' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {video.description}
                    </p>
                    <button style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 800, marginTop: '8px', cursor: 'pointer' }}>
                        {showDesc ? 'Show less' : '...more'}
                    </button>
                </div>

                {/* Comments */}
                <div style={{ marginTop: '2rem' }}>
                    <CommentSection videoId={videoId} />
                </div>
            </div>

            {/* Recommendations Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Coming up next</h3>
                {recommendedVideos.map(v => (
                    <VideoCard key={v._id || v.id} video={v} horizontal={true} />
                ))}
                {recommendedVideos.length === 0 && (
                    <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center' }}>No recommendations yet</p>
                )}
            </div>

            {showPlaylistModal && (
                <SaveToPlaylistModal
                    videoId={videoId}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </div>
    );
}

export default WatchVideo;
