import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiTool, FiShoppingCart } from 'react-icons/fi';

const FeatureCard = ({ icon, title, description, color }) => {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            style={{
                background: 'white',
                padding: '40px',
                borderRadius: '24px',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            <div style={{ 
                width: '48px', 
                height: '48px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                borderRadius: '12px',
                color: color, 
                background: `${color}15` 
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>{title}</h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{description}</p>
        </motion.div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#FFFFFF', 
            fontFamily: 'Inter, -apple-system, sans-serif',
            color: '#1A1A1A'
        }}>
            {/* Navigation */}
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '24px 80px', 
                maxWidth: '1440px', 
                margin: '0 auto' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '800' }}>
                    <span style={{ background: '#E8F7F2', padding: '6px', borderRadius: '8px' }}>👷</span>
                    <span>Build<span style={{ color: '#00BA88' }}>Ecosystem</span></span>
                </div>
                <div style={{ display: 'flex', gap: '40px' }}>
                    <a href="#services" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>Services</a>
                    <a href="#shop" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>Shop</a>
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Sign In</button>
                    <button onClick={() => navigate('/login?tab=register')} style={{ 
                        background: '#0D1B2A', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px 24px', 
                        borderRadius: '50px', 
                        fontWeight: '600', 
                        cursor: 'pointer' 
                    }}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        background: '#F8F9FA', 
                        border: '1px solid #EDEDED', 
                        padding: '8px 16px', 
                        borderRadius: '100px', 
                        fontSize: '14px', 
                        color: '#666',
                        marginBottom: '40px'
                    }}
                >
                    <span style={{ width: '8px', height: '8px', background: '#00BA88', borderRadius: '50%' }}></span>
                    Now open for beta users
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ fontSize: '64px', fontWeight: '850', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' }}
                >
                    The Digital Foundation for <br />
                    <span style={{ 
                        background: 'linear-gradient(90deg, #4E5BE4 0%, #00BA88 100%)', 
                        WebkitBackgroundClip: text, 
                        WebkitTextFillColor: 'transparent' 
                    }}>Modern Construction</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '20px', lineHeight: '1.6', color: '#666', marginBottom: '48px' }}
                >
                    One unified ecosystem connecting clients, engineers, and workers. Manage <br />
                    projects, hire specialized talent, and procure materials—all in one place.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
                >
                    <button onClick={() => navigate('/login')} style={{ background: '#1D5CFF', color: 'white', border: 'none', padding: '18px 36px', borderRadius: '100px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(29,92,255,0.3)' }}>Join the Ecosystem</button>
                    <button onClick={() => navigate('/login?secret=admin')} style={{ background: 'white', border: '1px solid #EDEDED', padding: '18px 36px', borderRadius: '100px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>View Admin Demo</button>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="services" style={{ background: '#FCFCFC', padding: '100px 80px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Everything you need to build</h2>
                <p style={{ color: '#666', marginBottom: '60px', fontSize: '18px' }}>A completely integrated dashboard experience.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                    <FeatureCard 
                        icon={<FiUsers />} 
                        title="Hire Workers" 
                        color="#00BA88"
                        description="Find and hire verified construction workers near your location instantly with our map integration."
                    />
                    <FeatureCard 
                        icon={<FiTool />} 
                        title="Assign Engineers" 
                        color="#4E5BE4"
                        description="Manage multi-tier projects. Assign highly skilled engineers who can track daily worker attendance."
                    />
                    <FeatureCard 
                        icon={<FiShoppingCart />} 
                        title="Equipment Shop" 
                        color="#D33AFB"
                        description="An integrated e-commerce experience. Buy or rent materials seamlessly with one click."
                    />
                </div>
            </section>
        </div>
    );
};

const text = 'text'; // Hack for styled properties in inline styles

export default LandingPage;
