import api from '../api';

export const testBackendConnection = async () => {
    try {
        // Test the health endpoint that doesn't require auth
        const response = await api.get('/health');
        return { 
            success: true, 
            message: `Backend is accessible - ${response.data.message}` 
        };
    } catch (error) {
        console.error('Backend connection test failed:', error);
        
        // Try the root endpoint as fallback
        try {
            const rootResponse = await api.get('/');
            return { 
                success: true, 
                message: `Backend is accessible - ${rootResponse.data.message}` 
            };
        } catch (rootError) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Backend is not accessible',
                status: error.response?.status || 'No response'
            };
        }
    }
};

export const testAuthEndpoint = async (token) => {
    try {
        const response = await api.get('/history', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, message: 'Authentication working' };
    } catch (error) {
        console.error('Auth test failed:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Authentication failed',
            status: error.response?.status || 'No response'
        };
    }
};