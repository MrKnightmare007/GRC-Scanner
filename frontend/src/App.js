import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="animated-bg"></div>
            <Navbar />
            <main className="fade-in">
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/register' element={<Register />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='/dashboard' element={<Dashboard />} />
                </Routes>
            </main>
            <Footer />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1a1a1a',
                        color: '#ffffff',
                        border: '1px solid #333333',
                        borderRadius: '8px',
                        fontFamily: 'Rajdhani, sans-serif',
                    },
                    success: {
                        iconTheme: {
                            primary: '#00ff41',
                            secondary: '#1a1a1a',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ff0066',
                            secondary: '#1a1a1a',
                        },
                    },
                }}
            />
        </Router>
    );
};

export default App;
