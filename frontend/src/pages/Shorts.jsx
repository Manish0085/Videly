import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { MdThumbUp, MdThumbUpOffAlt, MdComment, MdShare, MdMoreVert, MdMusicNote, MdClose, MdVolumeOff, MdVolumeUp, MdPlayArrow } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

function ShortItem({ video, isTarget }) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(video.isLiked);
    const [isSubscribed, setIsSubscribed] = useState(video.isSubscribed);
    const [subscribersCount, setSubscribersCount] = useState(video.subscribersCount);
    const [likesCount, setLikesCount] = useState(video.likesCount);
    const [showComments, setShowComments] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isTarget && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isTarget]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.8
        };

        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().then(() => {
                        setIsPlaying(true);
                    }).catch(() => { });
                } else {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            const progress = (video.currentTime / video.duration) * 100;
            setProgress(progress);
        };

        video.addEventListener('timeupdate', updateProgress);
        return () => video.removeEventListener('timeupdate', updateProgress);
    }, []);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) return alert("Please login to like");
        const prevLiked = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        try {
            await api.post(`/likes/toggle/v/${video._id || video.id}`);
        } catch (error) {
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        }
    };

    const handleSubscribe = async (e) => {
        e.stopPropagation();
        if (!user) return alert("Please login to subscribe");
        const prevSubscribed = isSubscribed;
        const prevCount = subscribersCount;
        setIsSubscribed(!isSubscribed);
        setSubscribersCount(prev => isSubscribed ? prev - 1 : prev + 1);
        try {
            await api.post(`/subscriptions/c/${video.owner?.id || video.owner?._id}`);
        } catch (error) {
            setIsSubscribed(prevSubscribed);
            setSubscribersCount(prevCount);
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}/shorts?id=${video._id || video.id}`;
        if (navigator.share) {
            navigator.share({
                title: video.title,
                url: url
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                height: 'calc(100vh - 56px)',
                width: '100%',
                maxWidth: '360px',
                margin: '0 auto',
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {/* Progress Bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                zIndex: 50
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--primary)',
                    transition: 'width 0.1s linear'
                }} />
            </div>

            <video
                ref={videoRef}
                src={video.videoFile}
                loop
                playsInline
                muted={isMuted}
                onClick={togglePlayPause}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    cursor: 'pointer'
                }}
            ></video>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    padding: '24px',
                    zIndex: 40,
                    animation: 'fadeIn 0.3s ease',
                    pointerEvents: 'none'
                }}>
                    <MdPlayArrow size={56} color="white" />
                </div>
            )}

            {/* Mute/Unmute Button */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 20,
                    transition: 'all 0.2s ease'
                }}
            >
                {isMuted ? <MdVolumeOff size={26} color="white" /> : <MdVolumeUp size={26} color="white" />}
            </button>

            {/* Comments Overlay */}
            {showComments && (
                <div style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, left: 0,
                    background: 'rgba(0,0,0,0.98)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    animation: 'slideUp 0.3s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 600 }}>Comments</h3>
                        <button
                            onClick={() => setShowComments(false)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <MdClose size={26} />
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
                        <CommentSection videoId={video._id || video.id} />
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1rem 1.25rem 1.5rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                pointerEvents: 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', pointerEvents: 'auto' }}>
                    <Link to={`/c/${video.owner?.username}`} style={{ flexShrink: 0 }}>
                        <img
                            src={video.owner?.avatar}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                border: '2px solid white',
                                objectFit: 'cover'
                            }}
                            alt="avatar"
                        />
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                        }}>
                            @{video.owner?.username}
                        </span>
                        <p style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: '2px 0 0 0'
                        }}>
                            {subscribersCount >= 1000 ? `${(subscribersCount / 1000).toFixed(1)}K` : subscribersCount} subscribers
                        </p>
                    </div>
                    <button
                        onClick={handleSubscribe}
                        style={{
                            background: isSubscribed ? 'rgba(255, 255, 255, 0.15)' : 'white',
                            color: isSubscribed ? 'white' : 'black',
                            padding: '9px 20px',
                            borderRadius: '24px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            border: isSubscribed ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                        }}
                    >
                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                </div>

                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'white',
                    marginBottom: '10px',
                    lineHeight: '1.5',
                    textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                    maxHeight: '3em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {video.title}
                </h3>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '0.85rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '7px 12px',
                    borderRadius: '14px',
                    width: 'fit-content'
                }}>
                    <MdMusicNote size={18} />
                    <marquee scrollamount="2" style={{ width: '160px' }}>
                        Original Audio - @{video.owner?.username}
                    </marquee>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{
                position: 'absolute',
                right: '16px',
                bottom: '6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '26px',
                alignItems: 'center',
                zIndex: 10
            }}>
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={handleLike}
                        style={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(12px)',
                            padding: '15px',
                            borderRadius: '50%',
                            color: isLiked ? '#FF0000' : 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isLiked ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        {isLiked ? <MdThumbUp size={30} /> : <MdThumbUpOffAlt size={30} />}
                    </button>
                    <p style={{
                        fontSize: '0.8rem',
                        marginTop: '6px',
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                    }}>
                        {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => setShowComments(true)}
                        style={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(12px)',
                            padding: '15px',
                            borderRadius: '50%',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <MdComment size={30} />
                    </button>
                    <p style={{
                        fontSize: '0.8rem',
                        marginTop: '6px',
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                    }}>
                        {video.commentsCount || 0}
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={handleShare}
                        style={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(12px)',
                            padding: '15px',
                            borderRadius: '50%',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <MdShare size={30} />
                    </button>
                    <p style={{
                        fontSize: '0.8rem',
                        marginTop: '6px',
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                    }}>
                        Share
                    </p>
                </div>

                <button style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(12px)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '15px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                }}>
                    <MdMoreVert size={30} />
                </button>

                <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isPlaying ? 'spin 3s linear infinite' : 'none',
                    overflow: 'hidden'
                }}>
                    <img
                        src={video.owner?.avatar}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                        alt="avatar"
                    />
                </div>
            </div>

            <style>
                {`
                @keyframes spin { 
                    from { transform: rotate(0deg); } 
                    to { transform: rotate(360deg); } 
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                `}
            </style>
        </div>
    );
}

function Shorts() {
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const targetId = searchParams.get('id');

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const { data } = await api.get('/videos/shorts');
                setShorts(data?.data || []);
            } catch (error) {
                console.error("Failed to fetch shorts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShorts();
    }, []);

    if (loading) return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 56px)',
            color: 'white'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Loading shorts...</p>
            </div>
        </div>
    );

    if (shorts.length === 0) return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 56px)',
            color: 'white',
            textAlign: 'center'
        }}>
            <div>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No shorts available</p>
                <p style={{ color: 'var(--text-secondary)' }}>Check back later for new content</p>
            </div>
        </div>
    );

    return (
        <div style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            bottom: 0,
            height: 'calc(100vh - 56px)',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
            background: '#000'
        }}>
            <style>
                {`
                div::-webkit-scrollbar { 
                    display: none; 
                }
                `}
            </style>
            {shorts.map(item => (
                <ShortItem
                    key={item._id || item.id}
                    video={item}
                    isTarget={(item._id || item.id) === targetId}
                />
            ))}
        </div>
    );
}

export default Shorts;
