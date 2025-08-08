import React, { useState, useEffect } from 'react';
import { getTokenFromStorage } from '../../utils/auth';
import { testBackendConnection, testAuthEndpoint } from '../../utils/apiTest';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const AuthDebug = () => {
    const [debugInfo, setDebugInfo] = useState({
        token: null,
        backendStatus: 'checking',
        authStatus: 'checking'
    });
    const [retryCount, setRetryCount] = useState(0);

    const runTests = async () => {
        // Check token
        const token = getTokenFromStorage();
        
        // Test backend connection
        const backendTest = await testBackendConnection();
        
        // Test auth if token exists
        let authTest = { success: false, message: 'No token available' };
        if (token) {
            authTest = await testAuthEndpoint(token);
        }

        setDebugInfo({
            token: token ? 'Valid token found' : 'No valid token',
            backendStatus: backendTest,
            authStatus: authTest
        });
    };

    useEffect(() => {
        runTests();
    }, []);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setDebugInfo({
            token: null,
            backendStatus: 'checking',
            authStatus: 'checking'
        });
        runTests();
    };

    const getStatusIcon = (status) => {
        if (status === 'checking') return <FaSpinner className="loading-spinner" />;
        if (status?.success) return <FaCheckCircle style={{ color: '#00ff41' }} />;
        return <FaTimesCircle style={{ color: '#ff0066' }} />;
    };

    return (
        <div className="card" style={{ margin: '1rem', padding: '1rem' }}>
            <h3 style={{ color: '#00ff41', marginBottom: '1rem' }}>Authentication Debug Info</h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(debugInfo.token ? { success: true } : { success: false })}
                    <span>Token Status: {debugInfo.token}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(debugInfo.backendStatus)}
                    <span>Backend Connection: {debugInfo.backendStatus.message}</span>
                    {debugInfo.backendStatus.status && (
                        <span style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>
                            (Status: {debugInfo.backendStatus.status})
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(debugInfo.authStatus)}
                    <span>Authentication: {debugInfo.authStatus.message}</span>
                    {debugInfo.authStatus.status && (
                        <span style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>
                            (Status: {debugInfo.authStatus.status})
                        </span>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0, 255, 65, 0.1)', borderRadius: '8px' }}>
                <h4 style={{ color: '#00ff41', marginBottom: '0.5rem' }}>Troubleshooting Steps:</h4>
                <ol style={{ color: '#b0b0b0', lineHeight: '1.6' }}>
                    <li>Make sure the backend server is running on port 5000</li>
                    <li>Test backend directly: <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff41' }}>http://localhost:5000/health</a></li>
                    <li>Check if you're logged in with a valid token</li>
                    <li>Try logging out and logging back in</li>
                    <li>Check browser console for detailed error messages</li>
                </ol>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0, 102, 255, 0.1)', borderRadius: '8px' }}>
                <h4 style={{ color: '#0066ff', marginBottom: '0.5rem' }}>Quick Fix Commands:</h4>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#b0b0b0' }}>
                    <div>Backend: <code style={{ color: '#00ff41' }}>cd GrcScanner/backend && python app.py</code></div>
                    <div>Frontend: <code style={{ color: '#00ff41' }}>cd GrcScanner/frontend && npm start</code></div>
                </div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button 
                    onClick={handleRetry}
                    style={{
                        background: 'linear-gradient(45deg, #00ff41, #00cc33)',
                        color: '#000',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🔄 Retry Tests {retryCount > 0 && `(${retryCount})`}
                </button>
            </div>
        </div>
    );
};

export default AuthDebug;