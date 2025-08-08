import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        // Check if token is expired
        if (decoded.exp < currentTime) {
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

export const getTokenFromStorage = () => {
    const token = localStorage.getItem('token');
    return isTokenValid(token) ? token : null;
};

export const clearAuthData = () => {
    localStorage.removeItem('token');
};

export const setAuthToken = (token) => {
    if (isTokenValid(token)) {
        localStorage.setItem('token', token);
        return true;
    }
    return false;
};