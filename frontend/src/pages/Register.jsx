import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock, MdCloudUpload, MdAccountCircle } from 'react-icons/md';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        avatar: null,
        coverImage: null
    });
    const [previews, setPreviews] = useState({
        avatar: null,
        coverImage: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.avatar) {
            setError('Avatar is required');
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.6s ease-out'
        }}>
            <div className="glass-card" style={{
                maxWidth: '600px',
                width: '100%',
                padding: '3rem 2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'var(--accent-gradient)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 8px 16px var(--primary-glow)'
                    }}>
                        <MdAccountCircle size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join our community and start streaming</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        color: '#ef4444',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '4px' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <MdPerson size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    name="fullName"
                                    className="input-field"
                                    style={{ width: '100%', paddingLeft: '3rem' }}
                                    placeholder="John Doe"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '4px' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <MdPerson size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    name="username"
                                    className="input-field"
                                    style={{ width: '100%', paddingLeft: '3rem' }}
                                    placeholder="johndoe123"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '4px' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <MdEmail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '3rem' }}
                                placeholder="name@example.com"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '4px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <MdLock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                name="password"
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '3rem' }}
                                placeholder="Create a secure password"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
                        <div className="input-group">
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '4px' }}>Avatar Image</label>
                            <label style={{
                                cursor: 'pointer',
                                height: '120px',
                                border: '2px dashed var(--glass-border)',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: previews.avatar ? `url(${previews.avatar}) center/cover` : 'rgba(0,0,0,0.2)',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease'
                            }}>
                                {!previews.avatar && (
                                    <>
                                        <MdCloudUpload size={24} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Upload Photo</span>
                                    </>
                                )}
                                <input type="file" name="avatar" accept="image/*" hidden onChange={handleChange} />
                            </label>
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '4px' }}>Cover Photo</label>
                            <label style={{
                                cursor: 'pointer',
                                height: '120px',
                                border: '2px dashed var(--glass-border)',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: previews.coverImage ? `url(${previews.coverImage}) center/cover` : 'rgba(0,0,0,0.2)',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease'
                            }}>
                                {!previews.coverImage && (
                                    <>
                                        <MdCloudUpload size={24} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Optional</span>
                                    </>
                                )}
                                <input type="file" name="coverImage" accept="image/*" hidden onChange={handleChange} />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ marginTop: '1rem', height: '52px' }}
                    >
                        {loading ? <div className="loading-spinner"></div> : 'Create Account'}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
