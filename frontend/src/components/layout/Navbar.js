import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { getTokenFromStorage, clearAuthData } from '../../utils/auth';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = getTokenFromStorage();
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = () => {
        clearAuthData();
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/" className="navbar-brand">
                            <FaShieldAlt />
                            GRC SCANNER
                        </Link>
                    </motion.div>

                    <motion.ul 
                        className="navbar-nav"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link to="/dashboard" className="nav-link">
                                        <FaTachometerAlt style={{ marginRight: '0.5rem' }} />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={handleLogout}
                                        className="btn btn-outline"
                                        style={{ 
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="nav-link">
                                        <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                        <FaUserPlus style={{ marginRight: '0.5rem' }} />
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </motion.ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;