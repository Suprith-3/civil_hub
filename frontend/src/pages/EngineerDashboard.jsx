import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, PrimaryButton, SecondaryButton } from '../components/ANIMATED_COMPONENTS';
import { engineersAPI } from '../services/api';
import { FiUsers, FiCalendar, FiDollarSign, FiPlus } from 'react-icons/fi';

const EngineerDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const res = await engineersAPI.getMyWorkers();
                setWorkers(res.data.workers);
            } catch (err) {
                console.error("Failed to fetch workers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkers();
    }, []);

    const stats = [
        { label: 'My Workers', count: workers.length, icon: <FiUsers />, color: '#FF6B35' },
        { label: 'Active Jobs', count: 4, icon: <FiCalendar />, color: '#004E89' },
        { label: 'Total Advance', count: '₹12,400', icon: <FiDollarSign />, color: '#06D6A0' },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
            <Navbar user={user} onLogout={() => {
                localStorage.clear();
                window.location.href = '/login';
            }} />

            <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', color: '#1A1A1A' }}>Engineer Console</h1>
                        <p style={{ color: '#666' }}>Manage your team and track projects.</p>
                    </div>
                    <PrimaryButton><FiPlus /> Post New Job</PrimaryButton>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}
                        >
                            <div style={{ fontSize: '24px', color: 'white', backgroundColor: stat.color, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '14px', color: '#666', margin: 0 }}>{stat.label}</h3>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stat.count}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Workers Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Team Overview</h2>
                    {loading ? <p>Loading team...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #EEE', textAlign: 'left', color: '#999', fontSize: '14px' }}>
                                    <th style={{ padding: '12px 0' }}>Worker Name</th>
                                    <th>Skill</th>
                                    <th>Rate</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.length > 0 ? workers.map((w, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #F9F9F9' }}>
                                        <td style={{ padding: '16px 0', fontWeight: '500' }}>{w.workers?.users?.name || 'Unknown'}</td>
                                        <td>{w.workers?.skills ? JSON.parse(w.workers.skills).join(', ') : 'N/A'}</td>
                                        <td>₹{w.hourly_rate}/hr</td>
                                        <td><span style={{ backgroundColor: '#E8F8F5', color: '#06D6A0', padding: '4px 8px', borderRadius: '20px', fontSize: '12px' }}>Active</span></td>
                                        <td><SecondaryButton style={{ padding: '4px 12px', fontSize: '12px' }}>Assign Work</SecondaryButton></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No workers in your team yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EngineerDashboard;
