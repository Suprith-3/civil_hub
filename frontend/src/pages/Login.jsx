import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const AnimatedLoginPage = () => {
  const [role, setRole] = useState(''); // Empty by default
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = [
    { id: 'user', label: 'Customer', icon: '👤' },
    { id: 'engineer', label: 'Engineer', icon: '🧑💼' },
    { id: 'worker', label: 'Worker', icon: '👷' },
    { id: 'shop', label: 'Shopkeeper', icon: '🏪' }
  ];

  // Check for secret admin access via URL param: ?secret=admin or tab=register
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('secret') === 'admin') {
      setRole('admin');
      setActiveTab('login');
      setEmail('supreethm763@gmail.com'); // Autofill for convenience
    }
    if (params.get('tab') === 'register') {
      setActiveTab('register');
    }
  }, []);

  // Specific fields for roles
  const [companyName, setCompanyName] = useState('');
  const [shopName, setShopName] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // File states
  const [degreeCert, setDegreeCert] = useState(null);
  const [dlCert, setDlCert] = useState(null);
  const [levelCert, setLevelCert] = useState(null);
  const [shopPhoto, setShopPhoto] = useState(null);
  const [shopDoc, setShopDoc] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const isLogin = activeTab === 'login';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    let payload;
    let headers = {};

    if (isLogin) {
      payload = { email, password, role };
    } else {
      // Use FormData for registration if files are involved
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('role', role);

      if (role === 'engineer') {
        formData.append('company_name', companyName);
        if (degreeCert) formData.append('degree_cert', degreeCert);
        if (dlCert) formData.append('dl_cert', dlCert);
        if (levelCert) formData.append('level_cert', levelCert);
      } else if (role === 'shop') {
        formData.append('shop_name', shopName);
        formData.append('gst_number', gstNumber);
        if (shopPhoto) formData.append('shop_photo', shopPhoto);
        if (shopDoc) formData.append('shop_document', shopDoc);
      }

      payload = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    }

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload, { headers });

      if (res.data.status === 'pending') {
        setSuccess('Registration successful! Waiting for admin approval.');
        return;
      }

      setSuccess(`${isLogin ? 'Login' : 'Registration'} successful!`);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = `/${role === 'shop' ? 'shopkeeper' : role}-dashboard`;
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FF6B35 0%, #004E89 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 400px) 1fr',
        maxWidth: '1000px',
        width: '100%',
        overflow: 'hidden',
        minHeight: '600px'
      }}>
        {/* Left Branding */}
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
          color: 'white',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1
            onDoubleClick={() => {
              setRole('admin');
              setActiveTab('login');
              alert('Admin Mode Activated');
            }}
            style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 10px 0', cursor: 'pointer', userSelect: 'none' }}
          >
            BuildHub
          </h1>
          <p style={{ opacity: 0.9, lineHeight: '1.6', marginBottom: '30px' }}>
            Connect with skilled workers, hire engineers, and buy construction materials all in one place.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {['10K+ Workers', '5K+ Engineers', '1K+ Shops', '50K+ Projects'].map(s => (
              <div key={s} style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
          {/* STEP 1: ROLE SELECTION */}
          <h3 style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
            1. Select Your Role
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{
                  padding: '10px 5px',
                  border: role === r.id ? '2px solid #FF6B35' : '1px solid #E0E0E0',
                  borderRadius: '10px',
                  background: role === r.id ? '#FFF5F0' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '24px' }}>{r.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: role === r.id ? '#FF6B35' : '#666' }}>{r.label}</div>
              </button>
            ))}
          </div>

          {!role ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA', borderRadius: '15px', border: '2px dashed #DDD' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>Please select a role above to proceed</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #EEE', marginBottom: '25px' }}>
                {['login', 'register'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    style={{
                      padding: '10px 5px',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === t ? '2px solid #FF6B35' : 'none',
                      color: activeTab === t ? '#FF6B35' : '#999',
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      cursor: 'pointer'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth}>
                {error && <div style={{ padding: '10px', background: '#FFE8E8', color: '#D62828', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}

                {activeTab === 'register' && (
                  <>
                    <input style={inputStyle} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                    <input style={inputStyle} placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />

                    {role === 'engineer' && (
                      <>
                        <input style={inputStyle} placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                        <label style={labelStyle}>Degree Certificate</label>
                        <input style={fileInputStyle} type="file" onChange={e => setDegreeCert(e.target.files[0])} required />
                        <label style={labelStyle}>Driving License (DL)</label>
                        <input style={fileInputStyle} type="file" onChange={e => setDlCert(e.target.files[0])} required />
                        <label style={labelStyle}>Level Certificate</label>
                        <input style={fileInputStyle} type="file" onChange={e => setLevelCert(e.target.files[0])} required />
                      </>
                    )}

                    {role === 'shop' && (
                      <>
                        <input style={inputStyle} placeholder="Shop Name" value={shopName} onChange={e => setShopName(e.target.value)} required />
                        <input style={inputStyle} placeholder="GST Number" value={gstNumber} onChange={e => setGstNumber(e.target.value)} required />
                        <label style={labelStyle}>Shop Photo</label>
                        <input style={fileInputStyle} type="file" onChange={e => setShopPhoto(e.target.files[0])} required />
                        <label style={labelStyle}>Shop Document</label>
                        <input style={fileInputStyle} type="file" onChange={e => setShopDoc(e.target.files[0])} required />
                      </>
                    )}
                  </>
                )}

                <input style={inputStyle} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <div style={{ position: 'relative' }}>
                  <input style={inputStyle} type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '12px', cursor: 'pointer', color: '#999' }}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#FF6B35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  {loading ? 'Processing...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  marginBottom: '10px',
  border: '1px solid #DDD',
  borderRadius: '8px',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none'
};

const labelStyle = {
  fontSize: '12px',
  color: '#666',
  fontWeight: '600',
  marginBottom: '5px',
  display: 'block',
  marginLeft: '5px'
};

const fileInputStyle = {
  width: '100%',
  padding: '8px 10px',
  marginBottom: '15px',
  border: '1px solid #DDD',
  borderRadius: '8px',
  fontSize: '12px',
  background: '#F9F9F9'
};

export default AnimatedLoginPage;
