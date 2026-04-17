/* src/pages/UserDashboard.jsx */
import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/ANIMATED_COMPONENTS';

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
            <Navbar user={user} onLogout={() => {
                localStorage.clear();
                window.location.href = '/login';
            }} />

            <div style={{ padding: '40px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 style={{ fontSize: '32px', color: '#1A1A1A' }}>
                        Welcome back, {user?.name || 'User'}! 👋
                    </h1>
                    <p style={{ color: '#666' }}>Here is what's happening in your construction project.</p>
                </motion.div>

                {/* Dashboard Grid placeholder */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginTop: '32px'
                }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            height: '200px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            padding: '24px'
                        }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#FFE8E0', borderRadius: '8px', marginBottom: '16px' }}></div>
                            <div style={{ height: '20px', width: '60%', backgroundColor: '#F0F0F0', borderRadius: '4px', marginBottom: '12px' }}></div>
                            <div style={{ height: '15px', width: '90%', backgroundColor: '#F8F8F8', borderRadius: '4px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
