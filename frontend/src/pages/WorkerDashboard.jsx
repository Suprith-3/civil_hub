import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, ServiceCard, PrimaryButton } from '../components/ANIMATED_COMPONENTS';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FiBriefcase, FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';
import { workersAPI } from '../services/api';

// Fix Leaflet marker icons issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const WorkerDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [jobs, setJobs] = useState([]);
    const [location, setLocation] = useState([12.9716, 77.5946]); // Default to Bangalore, India

    // Note: For Leaflet maps to render properly, the container MUST have a height.
    useEffect(() => {
        // Try getting user's actual location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation([position.coords.latitude, position.coords.longitude]);
            });
        }
    }, []);

    const recentJobs = [
        { title: 'Masonry Work - Level 2', engineer: 'Rajesh Construction Ltd', address: '12th Main Road, Indiranagar', status: 'In Progress' },
        { title: 'Plumbing Repair', engineer: 'City Builders', address: 'Koramangala 4th Block', status: 'Pending Approval' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
            <Navbar user={user} onLogout={() => {
                localStorage.clear();
                window.location.href = '/login';
            }} />

            <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                {/* Left Column: Work & Status */}
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1A1A1A', marginBottom: '8px' }}>Hello, {user?.name || 'Worker'} 👷</h1>
                    <p style={{ color: '#666', marginBottom: '32px' }}>Find nearby jobs and track your daily attendance/advance payments.</p>

                    <div style={{ backgroundColor: '#FFF5F0', border: '1px solid #FF6B35', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <FiAlertCircle size={32} color="#FF6B35" />
                        <div>
                            <h3 style={{ margin: 0, color: '#1A1A1A', fontSize: '16px' }}>Available for Work Today</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Engineers can currently see you on the map to hire you.</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Your Job Assignments</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentJobs.map((job, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #004E89' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px' }}>{job.title}</h3>
                                    <span style={{ fontSize: '12px', backgroundColor: job.status === 'In Progress' ? '#E8F8F5' : '#FFF3CD', color: job.status === 'In Progress' ? '#06D6A0' : '#856404', padding: '4px 12px', borderRadius: '20px' }}>
                                        {job.status}
                                    </span>
                                </div>
                                <p style={{ margin: '0 0 8px 0', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}><FiBriefcase /> {job.engineer}</p>
                                <p style={{ margin: 0, color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiMapPin /> {job.address}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Map */}
                <div>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Job Map & Nearby</h2>
                    <div style={{ height: '400px', backgroundColor: '#E0E0E0', borderRadius: '16px', overflow: 'hidden' }}>
                        <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={location}>
                                <Popup>
                                    You are here & Available for Work!
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    
                    <div style={{ marginTop: '24px', backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Your Digital Identity</h3>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Contact Info Listed for Engineers:</p>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
                            <li>Phone: {user?.phone || '+91 9876543210'}</li>
                            <li>Skills: Masonry, General Labor</li>
                            <li>Expected Rate: ₹600/day</li>
                        </ul>
                        <PrimaryButton style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>Update Map / Profile</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
