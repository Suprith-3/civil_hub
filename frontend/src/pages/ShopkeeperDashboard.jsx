import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, PrimaryButton, SecondaryButton, AnimatedInput } from '../components/ANIMATED_COMPONENTS';
import { shopAPI } from '../services/api';
import { FiPackage, FiDollarSign, FiPlus, FiShoppingBag, FiMapPin } from 'react-icons/fi';

const ShopkeeperDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Add product form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '' });

    useEffect(() => {
        // Fetch products added by this shopkeeper
        const fetchProducts = async () => {
            try {
                // In a real app we would pass shopkeeper ID, but let's assume the API filters by token
                const res = await shopAPI.getProducts(); 
                setProducts(res.data.products || []);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await shopAPI.addProduct(newProduct);
            alert("Product added successfully!");
            setShowAddForm(false);
            // Refresh list
            const res = await shopAPI.getProducts();
            setProducts(res.data.products || []);
        } catch (err) {
            console.error("Failed to add product", err);
            alert("Error adding product.");
        }
    };

    const stats = [
        { label: 'Total Products', count: products.length || 12, icon: <FiPackage />, color: '#004E89' },
        { label: 'Total Orders', count: 45, icon: <FiShoppingBag />, color: '#FF6B35' },
        { label: 'Revenue', count: '₹1,24,500', icon: <FiDollarSign />, color: '#06D6A0' },
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
                        <h1 style={{ fontSize: '28px', color: '#1A1A1A' }}>{user?.shop_name || 'My Shop'} Console</h1>
                        <p style={{ color: '#666' }}>Manage inventory and track Flipkart/Amazon style orders.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <SecondaryButton><FiMapPin /> Update Map Location</SecondaryButton>
                        <PrimaryButton onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? 'Cancel' : <><FiPlus /> Add Product</>}
                        </PrimaryButton>
                    </div>
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

                {/* Add Product Form */}
                {showAddForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Add New Item to Shop</h2>
                        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <AnimatedInput label="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                            <AnimatedInput label="Price (₹)" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                            <AnimatedInput label="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                            <AnimatedInput label="Initial Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                            <PrimaryButton style={{ gridColumn: 'span 2' }}>Save Product</PrimaryButton>
                        </form>
                    </motion.div>
                )}

                {/* Inventory Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Current Inventory</h2>
                    {loading ? <p>Loading inventory...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #EEE', textAlign: 'left', color: '#999', fontSize: '14px' }}>
                                    <th style={{ padding: '12px 0' }}>Item Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map((p, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #F9F9F9' }}>
                                        <td style={{ padding: '16px 0', fontWeight: '500' }}>{p.name}</td>
                                        <td>{p.category}</td>
                                        <td>₹{p.price}</td>
                                        <td>
                                            <span style={{ backgroundColor: p.stock > 10 ? '#E8F8F5' : '#FFE8E8', color: p.stock > 10 ? '#06D6A0' : '#D62828', padding: '4px 8px', borderRadius: '20px', fontSize: '12px' }}>
                                                {p.stock} units
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No items listed yet. Click "Add Product" to start selling.</td>
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

export default ShopkeeperDashboard;
