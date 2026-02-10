import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaEllipsisV, FaTrash } from 'react-icons/fa';
import { timeAgo } from '../utils/timeAgo';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function TweetCard({ tweet, onDelete }) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(tweet.isLiked);
    const [likesCount, setLikesCount] = useState(tweet.likesCount);
    const [showOptions, setShowOptions] = useState(false);

    const isOwner = user && tweet.owner?._id === user._id;

    const handleLike = async () => {
        if (!user) return alert("Please login to like tweets");

        const previousLiked = isLiked;
        const previousCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await api.post(`/likes/toggle/t/${tweet._id}`);
        } catch (error) {
            setIsLiked(previousLiked);
            setLikesCount(previousCount);
            console.error("Failed to toggle like", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this community post?")) return;
        try {
            await api.delete(`/tweets/${tweet._id}`);
            if (onDelete) onDelete(tweet._id);
        } catch (error) {
            console.error("Failed to delete tweet", error);
            alert("Error deleting post");
        }
    };

    return (
        <div style={{
            background: 'var(--hover)',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to={`/c/${tweet.owner?.username}`}>
                        <img
                            src={tweet.owner?.avatar || 'https://via.placeholder.com/40'}
                            alt={tweet.owner?.username}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link to={`/c/${tweet.owner?.username}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', textDecoration: 'none' }}>
                                @{tweet.owner?.username}
                            </Link>
                            <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{timeAgo(tweet.createdAt)}</span>
                        </div>
                        <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.4' }}>
                            {tweet.content}
                        </p>
                    </div>
                </div>

                {isOwner && (
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            style={{ background: 'transparent', color: '#aaa', padding: '0.5rem', cursor: 'pointer', border: 'none' }}
                        >
                            <FaEllipsisV />
                        </button>
                        {showOptions && (
                            <div style={{
                                position: 'absolute', top: '100%', right: 0,
                                background: '#333', borderRadius: '8px', padding: '0.5rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10
                            }}>
                                <button
                                    onClick={handleDelete}
                                    style={{
                                        background: 'transparent', color: '#ff4444', border: 'none',
                                        padding: '0.5rem 1rem', display: 'flex', alignItems: 'center',
                                        gap: '0.5rem', cursor: 'pointer', width: '100%', whiteSpace: 'nowrap'
                                    }}
                                >
                                    <FaTrash size={12} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    onClick={handleLike}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: isLiked ? 'var(--primary)' : '#aaa'
                    }}
                >
                    <FaThumbsUp size={16} />
                    <span>{likesCount}</span>
                </button>
            </div>
        </div>
    );
}

export default TweetCard;
