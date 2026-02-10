import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const { data } = await api.get(`/videos/search?query=${encodeURIComponent(query)}`);
                setVideos(data?.data || []);
            } catch (err) {
                console.error('Search failed:', err);
                setError('Failed to load search results');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (!query) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Enter a search query to find videos
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Searching for "{query}"...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <p style={{ color: '#ef4444', fontSize: '1.1rem' }}>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                Search results for: <span style={{ color: 'var(--text-secondary)' }}>"{query}"</span>
            </h2>

            {videos.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        No videos found for "{query}"
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        Try different keywords or check your spelling
                    </p>
                </div>
            ) : (
                <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Found {videos.length} result{videos.length !== 1 ? 's' : ''}
                    </p>
                    <div className="video-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {videos.map(video => (
                            <VideoCard key={video._id || video.id} video={video} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchResults;
