import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaSearch, FaChartLine, FaLock, FaBug, FaNetworkWired } from 'react-icons/fa';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const features = [
        {
            icon: <FaShieldAlt />,
            title: "Security Headers Analysis",
            description: "Comprehensive analysis of HTTP security headers including HSTS, CSP, and more."
        },
        {
            icon: <FaBug />,
            title: "OWASP Top 10 Detection",
            description: "Identify vulnerabilities based on OWASP Top 10 security risks."
        },
        {
            icon: <FaNetworkWired />,
            title: "Port Scanning",
            description: "Advanced port scanning to identify open services and potential attack vectors."
        },
        {
            icon: <FaChartLine />,
            title: "Detailed Reports",
            description: "Generate comprehensive PDF reports with actionable security insights."
        }
    ];

    return (
        <div className="container">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center"
                style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="mb-5">
                    <h1 className="cyber-title">
                        <FaShieldAlt style={{ marginRight: '1rem', color: '#00ff41' }} />
                        GRC SCANNER
                    </h1>
                    <motion.p 
                        variants={itemVariants}
                        style={{ 
                            fontSize: '1.3rem', 
                            color: '#b0b0b0', 
                            maxWidth: '600px', 
                            margin: '0 auto 2rem',
                            lineHeight: '1.8'
                        }}
                    >
                        Advanced cybersecurity scanning platform for comprehensive web application security assessment. 
                        Identify vulnerabilities, analyze security headers, and generate detailed compliance reports.
                    </motion.p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="mb-5">
                    <Link to="/login" className="btn btn-primary">
                        <FaLock style={{ marginRight: '0.5rem' }} />
                        Login to Dashboard
                    </Link>
                    <Link to="/register" className="btn btn-secondary">
                        <FaSearch style={{ marginRight: '0.5rem' }} />
                        Start Scanning
                    </Link>
                </motion.div>

                {/* Features Grid */}
                <div style={{ marginTop: '4rem' }}>
                    {/* First row - 3 cards */}
                    <motion.div 
                        variants={itemVariants}
                        style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '2rem',
                            marginBottom: '2rem'
                        }}
                    >
                        {features.slice(0, 3).map((feature, index) => (
                            <motion.div
                                key={index}
                                className="card"
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: '0 12px 40px rgba(0, 255, 65, 0.2)'
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div style={{ 
                                    fontSize: '2.5rem', 
                                    color: '#00ff41', 
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 className="card-title text-center">{feature.title}</h3>
                                <p style={{ 
                                    color: '#b0b0b0', 
                                    textAlign: 'center',
                                    lineHeight: '1.6'
                                }}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Second row - 1 centered card */}
                    {features.length > 3 && (
                        <motion.div 
                            variants={itemVariants}
                            style={{ 
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <motion.div
                                className="card"
                                style={{ 
                                    width: '100%',
                                    maxWidth: '380px',
                                    minWidth: '280px'
                                }}
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: '0 12px 40px rgba(0, 255, 65, 0.2)'
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div style={{ 
                                    fontSize: '2.5rem', 
                                    color: '#00ff41', 
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}>
                                    {features[3].icon}
                                </div>
                                <h3 className="card-title text-center">{features[3].title}</h3>
                                <p style={{ 
                                    color: '#b0b0b0', 
                                    textAlign: 'center',
                                    lineHeight: '1.6'
                                }}>
                                    {features[3].description}
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {/* Stats Section */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-5"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginTop: '4rem',
                        padding: '2rem',
                        background: 'rgba(0, 255, 65, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 255, 65, 0.2)'
                    }}
                >
                    <div className="text-center">
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00ff41' }}>
                            99.9%
                        </div>
                        <div style={{ color: '#b0b0b0' }}>Accuracy Rate</div>
                    </div>
                    <div className="text-center">
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066ff' }}>
                            24/7
                        </div>
                        <div style={{ color: '#b0b0b0' }}>Monitoring</div>
                    </div>
                    <div className="text-center">
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff0066' }}>
                            &lt;120s
                        </div>
                        <div style={{ color: '#b0b0b0' }}>Scan Time</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;