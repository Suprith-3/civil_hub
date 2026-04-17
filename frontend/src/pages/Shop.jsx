import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar, ProductCard, AnimatedGrid } from '../components/ANIMATED_COMPONENTS';

const Shop = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const products = [
        { id: 1, title: 'Premium Portland Cement', price: 450, rating: 5, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500' },
        { id: 2, title: 'Steel Reinforcement Bars', price: 5800, rating: 4, image: 'https://images.unsplash.com/photo-1533035350221-afc03303fd3e?q=80&w=500' },
        { id: 3, title: 'Ceramic Floor Tiles', price: 1200, rating: 5, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500' },
        { id: 4, title: 'Construction Helmet (Pro)', price: 850, rating: 4, image: 'https://images.unsplash.com/photo-1590496793907-2708b4af774f?q=80&w=500' },
        { id: 5, title: 'Power Drill (Heavy Duty)', price: 3400, rating: 5, image: 'https://images.unsplash.com/photo-1504148455328-497c5efae15d?q=80&w=500' },
        { id: 6, title: 'Bricks (Fine Quality)', price: 12, rating: 4, image: 'https://images.unsplash.com/photo-1516733245465-4f0f62629671?q=80&w=500' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
            <Navbar user={user} onLogout={() => window.location.href = '/login'} />
            
            <div style={{ padding: '40px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ fontSize: '32px', color: '#1A1A1A', marginBottom: '8px' }}
                    >
                        BuildHub Marketplace 🛒
                    </motion.h1>
                    <p style={{ color: '#666' }}>Quality materials delivered straight to your site.</p>
                </header>

                <AnimatedGrid 
                    columns={3}
                    items={products.map(p => (
                        <ProductCard 
                            key={p.id} 
                            {...p} 
                            onAddCart={() => alert(`${p.title} added to cart!`)} 
                        />
                    ))}
                />
            </div>
        </div>
    );
};

export default Shop;
