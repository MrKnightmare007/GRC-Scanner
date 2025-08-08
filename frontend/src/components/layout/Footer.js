import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={{
            background: '#000000',
            borderTop: '1px solid #333333',
            padding: '2rem 0',
            marginTop: '4rem',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}
                >
                    <div style={{ maxWidth: '600px' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: '#00ff41'
                        }}>
                            <FaShieldAlt />
                            GRC SCANNER
                        </div>
                        <p style={{ color: '#b0b0b0', lineHeight: '1.6', margin: '0 auto' }}>
                            Advanced cybersecurity scanning platform for comprehensive web application security assessment.
                        </p>
                    </div>    
                <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: '3rem',
                        width: '100%'
                    }}>
                        <div>
                            <h4 style={{ 
                                color: '#00ff41', 
                                marginBottom: '1rem',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Quick Links
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <a href="#" style={{ color: '#b0b0b0', textDecoration: 'none' }}>
                                        Security Headers
                                    </a>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <a href="#" style={{ color: '#b0b0b0', textDecoration: 'none' }}>
                                        OWASP Top 10
                                    </a>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <a href="#" style={{ color: '#b0b0b0', textDecoration: 'none' }}>
                                        Port Scanning
                                    </a>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <a href="#" style={{ color: '#b0b0b0', textDecoration: 'none' }}>
                                        Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ 
                                color: '#00ff41', 
                                marginBottom: '1rem',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Connect
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                <a href="#" style={{ color: '#b0b0b0', fontSize: '1.5rem' }}>
                                    <FaGithub />
                                </a>
                                <a href="#" style={{ color: '#b0b0b0', fontSize: '1.5rem' }}>
                                    <FaLinkedin />
                                </a>
                                <a href="#" style={{ color: '#b0b0b0', fontSize: '1.5rem' }}>
                                    <FaTwitter />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>      
          <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{
                        borderTop: '1px solid #333333',
                        paddingTop: '1rem',
                        textAlign: 'center',
                        color: '#b0b0b0'
                    }}
                >
                    <p>
                        &copy; 2025 GRC Scanner. Made with{' '}
                        <FaHeart style={{ color: '#ff0066', margin: '0 0.25rem' }} />
                        for cybersecurity professionals.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;