import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBars } from 'react-icons/fa';
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
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'var(--bg)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '56px',
            }}
        >
            {/* LEFT SECTION */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        fontSize: '1.2rem',
                        padding: '8px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <FaBars />
                </button>

                {/* LOGO */}
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                    }}
                >
                    <img
                        src="/logo.png"
                        alt="Videly"
                        style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'contain',
                        }}
                    />
                    {/*  <span
                        style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                            color: 'white',
                        }}
                    >
                        Videly
                    </span>*/}
                </Link>
            </div>

            {/* SEARCH BAR */}
            <form
                onSubmit={handleSearch}
                style={{
                    flex: 1,
                    maxWidth: '600px',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0 2rem',
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        borderRadius: '40px 0 0 40px',
                        padding: '0 1rem',
                        height: '40px',
                    }}
                >
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
                            outline: 'none',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
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
                    }}
                >
                    <FaSearch size={16} />
                </button>
            </form>

            {/* RESPONSIVE CSS */}
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

            {/* RIGHT SECTION */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user ? (
                    <>
                        <Link to="/upload" title="Upload Video" style={{ padding: '8px' }}>
                            <MdOutlineFileUpload size={24} />
                        </Link>

                        <button style={{ padding: '8px', background: 'transparent', border: 'none', color: 'white' }}>
                            <MdNotificationsNone size={24} />
                        </button>

                        <img
                            src={user.avatar}
                            alt="Avatar"
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                            }}
                        />
                    </>
                ) : (
                    <Link
                        to="/login"
                        style={{
                            border: '1px solid #333',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#3ea6ff',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            textDecoration: 'none',
                        }}
                    >
                        Sign in
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Header;
