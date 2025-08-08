import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
    FaSearch, 
    FaDownload, 
    FaShieldAlt, 
    FaExclamationTriangle, 
    FaCheckCircle, 
    FaTimesCircle,
    FaClock,
    FaNetworkWired,
    FaBug,
    FaLock,
    FaChartLine,
    FaHistory,
    FaSpinner
} from 'react-icons/fa';
import api from '../../api';
import { getTokenFromStorage, clearAuthData } from '../../utils/auth';
import AuthDebug from '../debug/AuthDebug';

const Dashboard = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [results, setResults] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [currentScanId, setCurrentScanId] = useState(null);
    const [scanStatus, setScanStatus] = useState('');
    const [scanProgress, setScanProgress] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        const token = getTokenFromStorage();
        if (!token) {
            toast.error('Please login to access the dashboard', { icon: '🔒' });
            clearAuthData();
            navigate('/login');
            return;
        }
        setIsAuthenticated(true);
    }, [navigate]);

    const handleAuthError = (err) => {
        if (err.response?.status === 401) {
            toast.error('Session expired. Please login again.', { icon: '🔒' });
            clearAuthData();
            setIsAuthenticated(false);
            navigate('/login');
            return true;
        }
        return false;
    };

    const fetchScanHistory = async () => {
        try {
            const token = getTokenFromStorage();
            if (!token) {
                clearAuthData();
                navigate('/login');
                return;
            }

            const res = await api.get('/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScanHistory(res.data.scans);
        } catch (err) {
            console.error('Error fetching scan history:', err.response ? err.response.data : err.message);
            if (!handleAuthError(err)) {
                toast.error('Failed to fetch scan history', { icon: '📊' });
            }
        }
    };

    const checkScanStatus = async (scanId) => {
        try {
            const token = getTokenFromStorage();
            if (!token) {
                clearAuthData();
                navigate('/login');
                return;
            }

            const res = await api.get(`/scan/status/${scanId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const status = res.data.status;
            const progress = res.data.progress;
            
            setScanStatus(status);
            setScanProgress(progress || '');

            if (status === 'Completed' || status === 'Failed') {
                setScanning(false);
                setCurrentScanId(null);
                fetchScanHistory(); // Refresh history to show the completed scan
                if (status === 'Completed' && res.data.scan_results) {
                    setResults({
                        report_id: scanId,
                        scan_results: res.data.scan_results
                    });
                    toast.success('Security scan completed successfully!', { icon: '🎉' });
                } else if (status === 'Failed') {
                    toast.error('Security scan failed. Please try again.', { icon: '❌' });
                }
            }
        } catch (err) {
            console.error('Error checking scan status:', err.response ? err.response.data : err.message);
            if (!handleAuthError(err)) {
                setScanning(false);
                setCurrentScanId(null);
                setScanStatus('Failed to get status.');
                setScanProgress('');
                toast.error('Failed to check scan status', { icon: '⚠️' });
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchScanHistory();
        }

        let statusInterval;
        if (scanning && currentScanId && isAuthenticated) {
            statusInterval = setInterval(() => {
                checkScanStatus(currentScanId);
            }, 3000); // Poll every 3 seconds
        }

        return () => {
            if (statusInterval) {
                clearInterval(statusInterval);
            }
        };
    }, [scanning, currentScanId, isAuthenticated]);

    const onChange = e => setUrl(e.target.value);

    const onSubmit = async e => {
        e.preventDefault();
        
        const token = getTokenFromStorage();
        if (!token) {
            toast.error('Please login to start a scan', { icon: '🔒' });
            clearAuthData();
            navigate('/login');
            return;
        }

        setScanning(true);
        setScanStatus('Initiating scan...');
        setScanProgress('');
        setResults(null); // Clear previous results
        
        try {
            const res = await api.post('/scan', { url }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentScanId(res.data.report_id);
            setScanStatus(res.data.status || 'Scan started.');
            toast.success('Security scan initiated successfully!', { icon: '🔍' });
            
            // If scan completed immediately (unlikely but possible)
            if (res.data.status === 'Completed' && res.data.scan_results) {
                setResults({
                    report_id: res.data.report_id,
                    scan_results: res.data.scan_results
                });
                setScanning(false);
                setCurrentScanId(null);
                toast.success('Scan completed successfully!', { icon: '✅' });
            }
        } catch (err) {
            console.error('Error during scan initiation:', err.response ? err.response.data : err.message);
            setScanning(false);
            setScanStatus('Scan initiation failed.');
            setScanProgress('');
            
            if (!handleAuthError(err)) {
                const errorMessage = err.response?.data?.message || 'Failed to initiate scan. Please try again.';
                toast.error(errorMessage, { icon: '❌' });
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const downloadReport = async (scanId) => {
        try {
            const token = getTokenFromStorage();
            if (!token) {
                toast.error('Please login to download reports', { icon: '🔒' });
                clearAuthData();
                navigate('/login');
                return;
            }

            const response = await api.get(`/report/pdf/${scanId}`, {
                responseType: 'blob'
                // Note: PDF download endpoint doesn't require auth in backend
            });
            
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `scan_report_${scanId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Security report downloaded successfully!', { icon: '📄' });
        } catch (err) {
            console.error('Error downloading report:', err.response ? err.response.data : err.message);
            if (!handleAuthError(err)) {
                toast.error('Failed to download report. Please try again.', { icon: '❌' });
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <FaCheckCircle style={{ color: '#00ff41' }} />;
            case 'Failed': return <FaTimesCircle style={{ color: '#ff0066' }} />;
            case 'Scanning': return <FaSpinner className="loading-spinner" />;
            default: return <FaClock style={{ color: '#ffaa00' }} />;
        }
    };

    const getScanResultIcon = (item) => {
        if (item.includes('[+]')) return <FaCheckCircle style={{ color: '#00ff41', marginRight: '0.5rem' }} />;
        if (item.includes('[-]')) return <FaTimesCircle style={{ color: '#ff0066', marginRight: '0.5rem' }} />;
        return <FaExclamationTriangle style={{ color: '#ffaa00', marginRight: '0.5rem' }} />;
    };

    // Show loading while checking authentication
    if (!isAuthenticated) {
        return (
            <div className="container" style={{ 
                minHeight: '80vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <FaSpinner className="loading-spinner" style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                    <p style={{ color: '#b0b0b0' }}>Verifying authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 className="cyber-title" style={{ fontSize: '2.5rem', margin: 0 }}>
                        <FaShieldAlt style={{ marginRight: '1rem' }} />
                        Security Dashboard
                    </h1>
                </div>

                {/* Debug Component - Remove this in production */}
                <AuthDebug />

                {/* Scan Form */}
                <motion.div 
                    className="card mb-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card-header">
                        <h3 className="card-title">
                            <FaSearch style={{ marginRight: '0.5rem' }} />
                            Initiate Security Scan
                        </h3>
                        <p style={{ color: '#b0b0b0', margin: 0 }}>
                            Enter a target URL to perform comprehensive security analysis
                        </p>
                    </div>
                    
                    <form onSubmit={onSubmit} style={{ padding: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Target URL</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={onChange}
                                    required
                                    disabled={scanning}
                                    style={{
                                        paddingLeft: '2.5rem',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2300ff41'%3e%3cpath d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z'/%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: '0.75rem center',
                                        backgroundSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>
                        
                        <motion.button
                            type="submit"
                            className="btn btn-primary"
                            disabled={scanning}
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1.1rem',
                                padding: '0.75rem 2rem'
                            }}
                            whileHover={{ scale: scanning ? 1 : 1.02 }}
                            whileTap={{ scale: scanning ? 1 : 0.98 }}
                        >
                            {scanning ? (
                                <>
                                    <FaSpinner className="loading-spinner" />
                                    Scanning in Progress...
                                </>
                            ) : (
                                <>
                                    <FaSearch />
                                    Start Security Scan
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Scan Status */}
                <AnimatePresence>
                    {scanStatus && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="alert alert-info mb-4"
                            style={{
                                background: 'rgba(0, 102, 255, 0.1)',
                                border: '1px solid rgba(0, 102, 255, 0.3)',
                                borderRadius: '8px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '1.5rem' }}>
                                    {getStatusIcon(scanStatus)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                        Status: {scanStatus}
                                    </div>
                                    {scanProgress && (
                                        <div style={{ color: '#b0b0b0' }}>
                                            {scanProgress}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {scanning && (
                                <div className="progress mt-2">
                                    <div className="progress-bar" style={{ width: '100%' }}></div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scan Results */}
                <AnimatePresence>
                    {results && results.scan_results && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="card mb-4"
                        >
                            <div className="card-header">
                                <h3 className="card-title">
                                    <FaChartLine style={{ marginRight: '0.5rem' }} />
                                    Security Analysis Results
                                </h3>
                                <p style={{ color: '#b0b0b0', margin: 0 }}>
                                    Comprehensive security assessment completed
                                </p>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                {/* Security Headers */}
                                {results.scan_results.security_headers && (
                                    <motion.div 
                                        className="mb-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <h4 style={{ 
                                            color: '#00ff41', 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: '1rem'
                                        }}>
                                            <FaLock style={{ marginRight: '0.5rem' }} />
                                            Security Headers Analysis
                                        </h4>
                                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                                            {results.scan_results.security_headers["Security Headers"].map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`scan-result-item ${
                                                        item.includes('[+]') ? 'scan-result-success' : 'scan-result-danger'
                                                    }`}
                                                    style={{ display: 'flex', alignItems: 'center' }}
                                                >
                                                    {getScanResultIcon(item)}
                                                    {item}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* OWASP Analysis */}
                                {results.scan_results.owasp_analysis && results.scan_results.owasp_analysis["OWASP Top 10"] && (
                                    <motion.div 
                                        className="mb-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h4 style={{ 
                                            color: '#ffaa00', 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: '1rem'
                                        }}>
                                            <FaBug style={{ marginRight: '0.5rem' }} />
                                            OWASP Top 10 Analysis
                                        </h4>
                                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                                            {results.scan_results.owasp_analysis["OWASP Top 10"].map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="scan-result-item scan-result-warning"
                                                    style={{ display: 'flex', alignItems: 'center' }}
                                                >
                                                    <FaExclamationTriangle style={{ color: '#ffaa00', marginRight: '0.5rem' }} />
                                                    {item}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Port Scan */}
                                {results.scan_results.port_scan && results.scan_results.port_scan["Port Scan"] && (
                                    <motion.div 
                                        className="mb-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h4 style={{ 
                                            color: '#0066ff', 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: '1rem'
                                        }}>
                                            <FaNetworkWired style={{ marginRight: '0.5rem' }} />
                                            Port Scan Results
                                        </h4>
                                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                                            {results.scan_results.port_scan["Port Scan"].map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`scan-result-item ${
                                                        item.includes('[+]') ? 'scan-result-success' : 'scan-result-danger'
                                                    }`}
                                                    style={{ display: 'flex', alignItems: 'center' }}
                                                >
                                                    {getScanResultIcon(item)}
                                                    {item}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Download Button */}
                                <motion.button
                                    onClick={() => downloadReport(results.report_id)}
                                    className="btn btn-primary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '1.1rem',
                                        padding: '0.75rem 2rem',
                                        background: 'linear-gradient(45deg, #00ff41, #00cc33)',
                                        border: 'none'
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <FaDownload />
                                    Download Security Report
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scan History */}
                <motion.div 
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="card-header">
                        <h3 className="card-title">
                            <FaHistory style={{ marginRight: '0.5rem' }} />
                            Scan History
                        </h3>
                        <p style={{ color: '#b0b0b0', margin: 0 }}>
                            Previous security assessments and reports
                        </p>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        {scanHistory.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '2rem',
                                color: '#b0b0b0'
                            }}>
                                <FaHistory style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                                <p>No scan history available. Start your first security scan above.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Target URL</th>
                                            <th>Scan Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scanHistory.map((scan, index) => (
                                            <motion.tr
                                                key={scan.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <td style={{ 
                                                    fontFamily: 'monospace',
                                                    color: '#00ff41'
                                                }}>
                                                    {scan.url}
                                                </td>
                                                <td style={{ color: '#b0b0b0' }}>
                                                    {new Date(scan.scan_date).toLocaleString()}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {getStatusIcon(scan.status)}
                                                        <span className={`badge badge-${
                                                            scan.status === 'Completed' ? 'success' : 
                                                            scan.status === 'Failed' ? 'danger' : 'warning'
                                                        }`}>
                                                            {scan.status}
                                                        </span>
                                                    </div>
                                                    {scan.progress && scan.status !== 'Completed' && (
                                                        <small style={{ color: '#b0b0b0', display: 'block', marginTop: '0.25rem' }}>
                                                            {scan.progress}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    {scan.status === 'Completed' && (
                                                        <motion.button
                                                            onClick={() => downloadReport(scan.id)}
                                                            className="btn btn-outline"
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                fontSize: '0.9rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem'
                                                            }}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <FaDownload />
                                                            Download
                                                        </motion.button>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;