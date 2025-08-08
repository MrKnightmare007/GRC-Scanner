import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaUserPlus, FaShieldAlt, FaCheck } from 'react-icons/fa';
import api from '../../api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const { username, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return { minLength, hasUpper, hasLower, hasNumber, hasSpecial };
    };

    const passwordValidation = validatePassword(password);
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    const onSubmit = async e => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!', { icon: '❌' });
            return;
        }

        if (!isPasswordValid) {
            toast.error('Please meet all password requirements!', { icon: '❌' });
            return;
        }

        setLoading(true);
        
        try {
            await api.post('/register', { username, password });
            toast.success('Account created successfully! Please login.', {
                icon: '🎉',
            });
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage, {
                icon: '❌',
            });
            console.error(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card"
                style={{ 
                    maxWidth: '450px', 
                    width: '100%',
                    background: 'rgba(26, 26, 26, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div className="card-header text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        style={{ 
                            fontSize: '3rem', 
                            color: '#00ff41', 
                            marginBottom: '1rem' 
                        }}
                    >
                        <FaShieldAlt />
                    </motion.div>
                    <h2 className="card-title">Create Account</h2>
                    <p style={{ color: '#b0b0b0', margin: 0 }}>
                        Join the cybersecurity professionals community
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            <FaUser style={{ marginRight: '0.5rem' }} />
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                            disabled={loading}
                            style={{
                                paddingLeft: '2.5rem',
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2300ff41'%3e%3cpath d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z'/%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '0.75rem center',
                                backgroundSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FaLock style={{ marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            disabled={loading}
                            style={{
                                paddingLeft: '2.5rem',
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2300ff41'%3e%3cpath d='M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'/%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '0.75rem center',
                                backgroundSize: '1rem'
                            }}
                        />
                        
                        {/* Password Requirements */}
                        {password && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                                <div style={{ 
                                    color: passwordValidation.minLength ? '#00ff41' : '#ff0066',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    {passwordValidation.minLength ? <FaCheck /> : '×'} At least 8 characters
                                </div>
                                <div style={{ 
                                    color: passwordValidation.hasUpper ? '#00ff41' : '#ff0066',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    {passwordValidation.hasUpper ? <FaCheck /> : '×'} Uppercase letter
                                </div>
                                <div style={{ 
                                    color: passwordValidation.hasLower ? '#00ff41' : '#ff0066',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    {passwordValidation.hasLower ? <FaCheck /> : '×'} Lowercase letter
                                </div>
                                <div style={{ 
                                    color: passwordValidation.hasNumber ? '#00ff41' : '#ff0066',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    {passwordValidation.hasNumber ? <FaCheck /> : '×'} Number
                                </div>
                                <div style={{ 
                                    color: passwordValidation.hasSpecial ? '#00ff41' : '#ff0066',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    {passwordValidation.hasSpecial ? <FaCheck /> : '×'} Special character
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FaLock style={{ marginRight: '0.5rem' }} />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                            disabled={loading}
                            style={{
                                paddingLeft: '2.5rem',
                                borderColor: confirmPassword && password !== confirmPassword ? '#ff0066' : '',
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2300ff41'%3e%3cpath d='M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'/%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '0.75rem center',
                                backgroundSize: '1rem'
                            }}
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <div style={{ color: '#ff0066', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                Passwords do not match
                            </div>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !isPasswordValid || password !== confirmPassword}
                        style={{ 
                            width: '100%', 
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                        {loading ? (
                            <>
                                <div className="loading-spinner"></div>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <FaUserPlus />
                                Create Account
                            </>
                        )}
                    </motion.button>
                </form>

                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #333333'
                }}>
                    <p style={{ color: '#b0b0b0', margin: 0 }}>
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            style={{ 
                                color: '#00ff41', 
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;