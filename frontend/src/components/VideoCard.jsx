import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';
import { MdOutlineExplore } from 'react-icons/md';

function VideoCard({ video, horizontal = false }) {
    const isShort = video.isShort;
    const videoId = video._id || video.id;
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const playUrl = isShort ? `/shorts?id=${videoId}` : `/watch/${videoId}`;

    if (isShort && !horizontal) {
        return (
            <Link
                to={playUrl}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'transform 0.2s' }}
            >
                <div style={{
                    aspectRatio: '9/16',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#000',
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <video
                        ref={videoRef}
                        src={video.videoFile}
                        muted
                        playsInline
                        loop
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            display: isHovered ? 'block' : 'none'
                        }}
                    />
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            display: isHovered ? 'none' : 'block'
                        }}
                    />
                    <div style={{
                        position: 'absolute', bottom: '12px', left: '12px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                    }}>
                        <MdOutlineExplore size={18} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>SHORTS</span>
                    </div>
                </div>
                <div>
                    <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        lineHeight: '1.2rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'white',
                        marginBottom: '4px'
                    }}>
                        {video.title}
                    </h3>
                    <p style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>{video.views} views</p>
                </div>
            </Link>
        );
    }

    if (horizontal) {
        return (
            <Link
                to={playUrl}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ display: 'flex', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}
            >
                <div style={{ width: '160px', flexShrink: 0, position: 'relative', aspectRatio: isShort ? '9/16' : '16/9', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                    <video
                        ref={videoRef}
                        src={video.videoFile}
                        muted
                        playsInline
                        loop
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            display: isHovered ? 'block' : 'none'
                        }}
                    />
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            display: isHovered ? 'none' : 'block'
                        }}
                    />
                    {!isShort && (
                        <span style={{
                            position: 'absolute', bottom: '4px', right: '4px',
                            background: 'rgba(0,0,0,0.8)', color: 'white', padding: '1px 4px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500
                        }}>
                            {formatDuration(video.duration)}
                        </span>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'white',
                        marginBottom: '4px'
                    }}>
                        {video.title}
                    </h4>
                    <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>
                        <div>{video.owner?.username}</div>
                        <div>{video.views} views • {timeAgo(video.createdAt)}</div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
            <Link to={playUrl} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
                <video
                    ref={videoRef}
                    src={video.videoFile}
                    muted
                    playsInline
                    loop
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        display: isHovered ? 'block' : 'none'
                    }}
                />
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        display: isHovered ? 'none' : 'block'
                    }}
                />
                <span style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 500
                }}>
                    {formatDuration(video.duration)}
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to={`/c/${video.owner?.username}`} style={{ flexShrink: 0 }}>
                    <img
                        src={video.owner?.avatar || 'https://via.placeholder.com/36'}
                        alt={video.owner?.username}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                </Link>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.4', marginBottom: '4px', color: 'white' }}>
                        <Link to={playUrl}>{video.title}</Link>
                    </h3>
                    <Link to={`/c/${video.owner?.username}`} style={{ color: '#aaaaaa', fontSize: '0.9rem', display: 'block' }}>
                        {video.owner?.username}
                    </Link>
                    <div style={{ color: '#aaaaaa', fontSize: '0.9rem' }}>
                        {video.views} views • {timeAgo(video.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
