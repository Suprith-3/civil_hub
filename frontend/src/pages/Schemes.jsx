import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, ServiceCard, PrimaryButton } from '../components/ANIMATED_COMPONENTS';
import { schemesAPI, aiAPI } from '../services/api';
import { FiBookOpen, FiStar, FiInfo } from 'react-icons/fi';

const Schemes = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [schemes, setSchemes] = useState([]);
    const [recommendations, setRecommendations] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sRes = await schemesAPI.getAll();
                setSchemes(sRes.data.schemes);
                
                // Get AI powered recommendations
                const rRes = await aiAPI.recommendSchemes(user?.role, 'construction safety and housing benefits');
                setRecommendations(rRes.data.recommendation);
            } catch (err) {
                console.error("Failed to fetch schemes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.role]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
            <Navbar user={user} onLogout={() => window.location.href = '/login'} />
            
            <div style={{ padding: '40px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', color: '#1A1A1A', marginBottom: '8px' }}>Government Schemes 🏛️</h1>
                    <p style={{ color: '#666' }}>Welfare schemes and benefits tailored for you.</p>
                </header>

                {/* AI Recommendation Section */}
                {recommendations && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                            backgroundColor: '#004E89', 
                            color: 'white', 
                            padding: '32px', 
                            borderRadius: '20px', 
                            marginBottom: '40px',
                            boxShadow: '0 8px 24px rgba(0, 78, 137, 0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <FiStar style={{ color: '#FBD863', fontSize: '24px' }} />
                            <h2 style={{ fontSize: '20px', margin: 0 }}>AI Smart Recommendation</h2>
                        </div>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.9 }}>{recommendations}</p>
                    </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {schemes.length > 0 ? schemes.map((s, i) => (
                        <ServiceCard 
                            key={i}
                            title={s.name}
                            icon={FiBookOpen}
                            description={s.description}
                        />
                    )) : (
                        schemes.length === 0 && !loading && (
                            <p style={{ color: '#999' }}>No schemes found for your profile at the moment.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Schemes;
