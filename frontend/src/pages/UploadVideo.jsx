import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFileVideo, FaImage } from 'react-icons/fa';

function UploadVideo() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null,
        isShort: false
    });
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('videoFile', formData.videoFile);
        data.append('thumbnail', formData.thumbnail);
        data.append('isShort', formData.isShort);

        try {
            await api.post('/videos', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            navigate(formData.isShort ? '/shorts' : '/');
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Upload Video</h2>
            </div>

            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                background: '#1a1a1a',
                padding: '2.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{
                        border: '2px dashed #444',
                        padding: '2rem',
                        textAlign: 'center',
                        borderRadius: '12px',
                        position: 'relative',
                        background: 'rgba(255,255,255,0.02)',
                        transition: 'all 0.3s'
                    }}>
                        <FaFileVideo size={40} color="#3ea6ff" style={{ marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{formData.videoFile ? formData.videoFile.name : 'Select Video File'}</p>
                        <input
                            type="file"
                            name="videoFile"
                            accept="video/*"
                            required
                            onChange={handleChange}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                opacity: 0, cursor: 'pointer'
                            }}
                        />
                    </div>

                    <div style={{
                        border: '2px dashed #444',
                        padding: '2rem',
                        textAlign: 'center',
                        borderRadius: '12px',
                        position: 'relative',
                        background: 'rgba(255,255,255,0.02)',
                        transition: 'all 0.3s'
                    }}>
                        <FaImage size={40} color="#3ea6ff" style={{ marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{formData.thumbnail ? formData.thumbnail.name : 'Select Thumbnail'}</p>
                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            required
                            onChange={handleChange}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                opacity: 0, cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title (required)"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        style={{
                            background: 'transparent', border: '1px solid #333', padding: '0.8rem 1rem',
                            borderRadius: '8px', fontSize: '1rem', outline: 'none', color: 'white'
                        }}
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        style={{
                            background: 'transparent', border: '1px solid #333', padding: '0.8rem 1rem',
                            borderRadius: '8px', fontSize: '1rem', outline: 'none', color: 'white',
                            resize: 'none'
                        }}
                    ></textarea>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.02)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Upload as Shorts</h4>
                            <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Shorts are vertical videos under 60 seconds.</p>
                        </div>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                name="isShort"
                                checked={formData.isShort}
                                onChange={handleChange}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: formData.isShort ? '#3ea6ff' : '#444',
                                transition: '.4s', borderRadius: '34px'
                            }}>
                                <span style={{
                                    position: 'absolute', content: '""', height: '18px', width: '18px', left: formData.isShort ? '28px' : '4px', bottom: '3px',
                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>
                </div>

                {uploadProgress > 0 && (
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#aaa' }}>
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div style={{ width: '100%', background: '#333', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${uploadProgress}%`, background: '#3ea6ff', height: '100%', transition: 'width 0.3s' }}></div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => navigate(-1)} style={{ padding: '0.7rem 1.5rem', fontWeight: 600, color: '#aaa' }}>Cancel</button>
                    <button
                        type="submit"
                        disabled={loading || !formData.videoFile || !formData.title}
                        style={{
                            background: loading ? '#333' : '#3ea6ff',
                            color: loading ? '#888' : 'black',
                            padding: '0.7rem 2.5rem',
                            borderRadius: '30px',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '0.95rem'
                        }}
                    >
                        {loading ? 'Processing...' : 'Publish'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UploadVideo;
