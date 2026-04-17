import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiHardHat, FiBriefcase, FiShoppingBag } from 'react-icons/fi';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-logo">
                    <span className="logo-icon">👷</span>
                    <span className="logo-text">Build<span className="logo-highlight">Ecosystem</span></span>
                </div>
                <div className="nav-links">
                    <a href="#services">Services</a>
                    <a href="#shop">Shop</a>
                </div>
                <div className="nav-auth">
                    <button className="btn-signin" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn-getstarted" onClick={() => navigate('/login?tab=register')}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="beta-badge"
                >
                    <span className="dot"></span> Now open for beta users
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="hero-title"
                >
                    The Digital Foundation for <br />
                    <span className="gradient-text">Modern Construction</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hero-subtitle"
                >
                    One unified ecosystem connecting clients, engineers, and workers. Manage <br />
                    projects, hire specialized talent, and procure materials—all in one place.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="hero-btns"
                >
                    <button className="btn-join" onClick={() => navigate('/login')}>Join the Ecosystem</button>
                    <button className="btn-demo" onClick={() => navigate('/login?secret=admin')}>View Admin Demo</button>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="services" className="features-section">
                <h2 className="features-title">Everything you need to build</h2>
                <p className="features-subtitle">A completely integrated dashboard experience.</p>

                <div className="features-grid">
                    <FeatureCard 
                        icon={<FiHardHat />} 
                        title="Hire Workers" 
                        color="#00BA88"
                        description="Find and hire verified construction workers near your location instantly with our map integration."
                    />
                    <FeatureCard 
                        icon={<FiBriefcase />} 
                        title="Assign Engineers" 
                        color="#4E5BE4"
                        description="Manage multi-tier projects. Assign highly skilled engineers who can track daily worker attendance."
                    />
                    <FeatureCard 
                        icon={<FiShoppingBag />} 
                        title="Equipment Shop" 
                        color="#D33AFB"
                        description="An integrated e-commerce experience. Buy or rent materials seamlessly with one click."
                    />
                </div>
            </section>

            <style>{`
                .landing-container {
                    min-height: 100vh;
                    background-color: #FFFFFF;
                    font-family: 'Inter', -apple-system, sans-serif;
                    color: #1A1A1A;
                    overflow-x: hidden;
                }

                /* Nav Styles */
                .landing-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 80px;
                    max-width: 1440px;
                    margin: 0 auto;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 22px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .logo-highlight {
                    color: #00BA88;
                }

                .logo-icon {
                    background: #E8F7F2;
                    padding: 6px;
                    border-radius: 8px;
                    font-size: 20px;
                }

                .nav-links {
                    display: flex;
                    gap: 40px;
                }

                .nav-links a {
                    text-decoration: none;
                    color: #666;
                    font-weight: 500;
                    font-size: 15px;
                    transition: color 0.2s;
                }

                .nav-links a:hover {
                    color: #1A1A1A;
                }

                .nav-auth {
                    display: flex;
                    gap: 24px;
                    align-items: center;
                }

                .btn-signin {
                    background: none;
                    border: none;
                    color: #1A1A1A;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                }

                .btn-getstarted {
                    background: #0D1B2A;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    box-shadow: 0 10px 20px rgba(13, 27, 42, 0.2);
                }

                /* Hero Styles */
                .hero-section {
                    text-align: center;
                    padding: 100px 20px;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .beta-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #F8F9FA;
                    border: 1px border-solid #EDEDED;
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #666;
                    margin-bottom: 40px;
                }

                .beta-badge .dot {
                    width: 8px;
                    height: 8px;
                    background: #00BA88;
                    border-radius: 50%;
                }

                .hero-title {
                    font-size: 64px;
                    font-weight: 850;
                    line-height: 1.1;
                    margin-bottom: 24px;
                    letter-spacing: -2px;
                }

                .gradient-text {
                    background: linear-gradient(90deg, #4E5BE4 0%, #00BA88 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 20px;
                    line-height: 1.6;
                    color: #666;
                    margin-bottom: 48px;
                }

                .hero-btns {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                }

                .btn-join {
                    background: #1D5CFF;
                    color: white;
                    border: none;
                    padding: 18px 36px;
                    border-radius: 100px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(29, 92, 255, 0.3);
                }

                .btn-demo {
                    background: white;
                    color: #1A1A1A;
                    border: 1px border-solid #EDEDED;
                    padding: 18px 36px;
                    border-radius: 100px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                }

                /* Features Styles */
                .features-section {
                    background: #FCFCFC;
                    padding: 100px 80px;
                    text-align: center;
                }

                .features-title {
                    font-size: 36px;
                    font-weight: 800;
                    margin-bottom: 12px;
                }

                .features-subtitle {
                    color: #666;
                    margin-bottom: 60px;
                    font-size: 18px;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 32px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                @media (max-width: 900px) {
                    .landing-nav { padding: 24px 40px; }
                    .features-grid { grid-template-columns: 1fr; }
                    .hero-title { font-size: 48px; }
                }
            `}</style>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, color }) => {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="feature-card"
        >
            <div className="feature-icon" style={{ color: color, background: `${color}10` }}>
                {icon}
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{description}</p>

            <style>{`
                .feature-card {
                    background: white;
                    padding: 40px;
                    border-radius: 24px;
                    text-align: left;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    border: 1px border-solid rgba(0,0,0,0.02);
                }

                .feature-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                }

                .feature-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 12px;
                }

                .feature-desc {
                    color: #666;
                    font-size: 15px;
                    line-height: 1.6;
                }
            `}</style>
        </motion.div>
    );
};

export default LandingPage;
