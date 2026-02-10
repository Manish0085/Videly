import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';
import { FaThumbsUp, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdThumbUpOffAlt, MdThumbUp } from 'react-icons/md';

function CommentItem({ comment, videoId, onReplyAdded }) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(comment.isLiked);
    const [likesCount, setLikesCount] = useState(comment.likesCount);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [repliesLoading, setRepliesLoading] = useState(false);

    const handleLike = async () => {
        if (!user) return alert("Please login to like");
        const prevLiked = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        try {
            await api.post(`/likes/toggle/c/${comment._id}`);
        } catch (error) {
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        }
    };

    const handleFetchReplies = async () => {
        if (!showReplies && replies.length === 0) {
            setRepliesLoading(true);
            try {
                const { data } = await api.get(`/comments/replies/${comment._id}`);
                setReplies(data.data || []);
            } catch (error) {
                console.error("Failed to fetch replies", error);
            } finally {
                setRepliesLoading(false);
            }
        }
        setShowReplies(!showReplies);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        try {
            const { data } = await api.post(`/comments/reply/${comment._id}`, { content: replyContent });
            const newReply = {
                ...data.data,
                owner: { username: user.username, avatar: user.avatar, _id: user._id }
            };
            setReplies(prev => [...prev, newReply]);
            setReplyContent("");
            setShowReplyInput(false);
            setShowReplies(true);
            if (onReplyAdded) onReplyAdded(comment._id);
        } catch (error) {
            console.error("Failed to post reply", error);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <img
                src={comment.owner?.avatar || 'https://via.placeholder.com/40'}
                alt={comment.owner?.username}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>@{comment.owner?.username}</span>
                    <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{timeAgo(comment.createdAt)}</span>
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '4px', lineHeight: '1.4' }}>
                    {(() => {
                        try {
                            const parsed = JSON.parse(comment.content);
                            return parsed.content || comment.content;
                        } catch (e) {
                            return comment.content;
                        }
                    })()}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={handleLike} style={{ gap: '4px', color: isLiked ? 'white' : '#aaa' }}>
                        {isLiked ? <MdThumbUp size={16} /> : <MdThumbUpOffAlt size={16} />}
                        <span style={{ fontSize: '0.75rem' }}>{likesCount || ''}</span>
                    </button>
                    <button
                        onClick={() => user ? setShowReplyInput(!showReplyInput) : alert("Please login")}
                        style={{ fontSize: '0.75rem', fontWeight: 600, color: '#aaa', padding: '4px 8px', borderRadius: '12px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        Reply
                    </button>
                </div>

                {showReplyInput && (
                    <form onSubmit={handleReplySubmit} style={{ marginTop: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Add a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: 'white', padding: '0.25rem 0', outline: 'none', fontSize: '0.85rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button type="button" onClick={() => setShowReplyInput(false)} style={{ fontSize: '0.8rem' }}>Cancel</button>
                            <button type="submit" disabled={!replyContent.trim()} className="pill-btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Reply</button>
                        </div>
                    </form>
                )}

                {comment.repliesCount > 0 && (
                    <button onClick={handleFetchReplies} style={{ color: '#3ea6ff', fontSize: '0.85rem', fontWeight: 600, marginTop: '4px', gap: '8px' }}>
                        {showReplies ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                        {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                    </button>
                )}

                {showReplies && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {repliesLoading ? <p style={{ fontSize: '0.8rem' }}>Loading replies...</p> :
                            replies.map(reply => (
                                <CommentItem key={reply._id || reply.id} comment={reply} videoId={videoId} />
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

function CommentSection({ videoId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await api.get(`/comments/${videoId}`);
                setComments(data?.data || []);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchComments();
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        try {
            const { data } = await api.post(`/comments/${videoId}`, { content: newComment });
            const addedComment = { ...data.data, owner: { username: user.username, avatar: user.avatar, _id: user._id } };
            setComments(prev => [addedComment, ...prev]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    const handleReplyAdded = (parentId) => {
        setComments(prev => prev.map(c =>
            (c._id === parentId || c.id === parentId) ? { ...c, repliesCount: (c.repliesCount || 0) + 1 } : c
        ));
    };

    if (loading) return <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Loading comments...</div>;

    return (
        <div style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>{comments.length} Comments</h3>

            {user ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <img
                        src={user.avatar}
                        alt={user.username}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: 'white', padding: '0.5rem 0', outline: 'none', fontSize: '0.9rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', gap: '0.5rem' }}>
                            <button type="button" onClick={() => setNewComment("")} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Cancel</button>
                            <button type="submit" disabled={!newComment.trim()} className="pill-btn" style={{
                                background: newComment.trim() ? '#3ea6ff' : 'rgba(255,255,255,0.1)',
                                color: newComment.trim() ? 'black' : '#888',
                                padding: '0.5rem 1.25rem'
                            }}>Comment</button>
                        </div>
                    </div>
                </form>
            ) : (
                <p style={{ marginBottom: '2rem', color: '#aaa' }}>Please login to comment</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {comments.map(comment => (
                    <CommentItem key={comment._id || comment.id} comment={comment} videoId={videoId} onReplyAdded={handleReplyAdded} />
                ))}
            </div>
        </div>
    );
}

export default CommentSection;
