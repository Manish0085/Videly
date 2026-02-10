import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBars, FaBell, FaFileUpload, FaPlay } from 'react-icons/fa';
import { MdOutlineFileUpload, MdNotificationsNone } from 'react-icons/md';

function Header({ toggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'var(--bg)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                <button onClick={toggleSidebar} style={{
                    fontSize: '1.2rem',
                    padding: '8px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}>
                    <FaBars />
                </button>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--primary)', width: '30px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaPlay size={10} style={{ marginLeft: '2px', color: 'white' }} />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>StreamBox</span>
                </Link>
            </div>

            <form onSubmit={handleSearch} style={{
                flex: 1,
                maxWidth: '600px',
                display: 'flex',
                alignItems: 'center',
                margin: '0 2rem'
            }}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '40px 0 0 40px',
                    padding: '0 1rem',
                    height: '40px',
                    transition: 'border-color 0.2s'
                }}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            height: '100%',
                            fontSize: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>
                <button type="submit" style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    width: '64px',
                    height: '40px',
                    borderRadius: '0 40px 40px 0',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderLeft: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                }}>
                    <FaSearch size={16} />
                </button>
            </form>

            <style>
                {`
                @media (max-width: 768px) {
                    form {
                        max-width: 200px !important;
                        margin: 0 0.5rem !important;
                    }
                }
                @media (max-width: 480px) {
                    form {
                        display: none !important;
                    }
                }
                `}
            </style>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user ? (
                    <>
                        <Link to="/upload" style={{ padding: '8px', borderRadius: '50%' }} title="Upload Video">
                            <MdOutlineFileUpload size={24} />
                        </Link>
                        <button style={{ padding: '8px', borderRadius: '50%' }}>
                            <MdNotificationsNone size={24} />
                        </button>
                        <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                onClick={() => { }} // toggle menu
                                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
                            />
                        </div>
                    </>
                ) : (
                    <Link to="/login" style={{
                        border: '1px solid #333',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#3ea6ff',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                    }}>
                        <div style={{ border: '1px solid #3ea6ff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaSearch size={10} />
                        </div>
                        Sign in
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Header;
