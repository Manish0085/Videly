import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TweetCard from '../components/TweetCard';
import { FaPaperPlane } from 'react-icons/fa';

function Community() {
    const { user } = useAuth();
    const [tweets, setTweets] = useState([]);
    const [newTweet, setNewTweet] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        try {
            const { data } = await api.get('/tweets');
            setTweets(data?.data || []);
        } catch (error) {
            console.error("Failed to fetch tweets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTweet = async (e) => {
        e.preventDefault();
        if (!newTweet.trim()) return;

        setIsSubmitting(true);
        try {
            const { data } = await api.post('/tweets', { content: newTweet });
            // Ideally backend returns populated owner, but we can optimistically add with current user
            const optimisticTweet = {
                ...data.data,
                owner: {
                    username: user.username,
                    avatar: user.avatar
                },
                likesCount: 0,
                isLiked: false
            };
            setTweets([optimisticTweet, ...tweets]);
            setNewTweet('');
        } catch (error) {
            console.error("Failed to create tweet", error);
            alert("Error creating community post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTweet = (tweetId) => {
        setTweets(prev => prev.filter(t => t._id !== tweetId));
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading community...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Community</h1>

            {user && (
                <div style={{
                    background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px',
                    marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <img
                            src={user.avatar}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            alt="avatar"
                        />
                        <div style={{ flex: 1 }}>
                            <textarea
                                value={newTweet}
                                onChange={(e) => setNewTweet(e.target.value)}
                                placeholder="Public update..."
                                style={{
                                    width: '100%', background: 'transparent', border: 'none',
                                    borderBottom: '1px solid #444', color: 'white', resize: 'none',
                                    padding: '0.5rem 0', outline: 'none', minHeight: '60px',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button
                                    onClick={handleCreateTweet}
                                    disabled={isSubmitting || !newTweet.trim()}
                                    style={{
                                        background: isSubmitting ? '#444' : 'var(--white)',
                                        color: 'black', padding: '0.5rem 1.5rem', borderRadius: '20px',
                                        fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    {isSubmitting ? 'Posting...' : 'POST'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tweets.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#aaa', marginTop: '3rem' }}>
                        No community posts yet.
                    </div>
                ) : (
                    tweets.map(tweet => (
                        <TweetCard key={tweet._id} tweet={tweet} onDelete={handleDeleteTweet} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Community;
