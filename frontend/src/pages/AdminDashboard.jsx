import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, FiX, FiFileText, FiImage, FiUser, FiInfo, 
  FiTrash2, FiShoppingBag, FiLayers, FiAlertTriangle 
} from 'react-icons/fi';
import API_BASE_URL from '../apiConfig';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // New Scheme Form State
  const [showAddScheme, setShowAddScheme] = useState(false);
  const [newScheme, setNewScheme] = useState({
    name: '',
    description: '',
    benefits: '',
    eligibility_criteria: '',
    apply_link: '',
    category: '',
    target_role: 'all'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      window.location.href = '/login';
      return;
    }
    fetchData();
  }, [activeTab]);

  const handleAddScheme = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/schemes`, newScheme, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddScheme(false);
      setNewScheme({ name: '', description: '', benefits: '', eligibility_criteria: '', apply_link: '', category: '', target_role: 'all' });
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to add scheme.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'approvals') {
        const res = await axios.get(`${API_BASE_URL}/api/auth/admin/pending`, { headers });
        setPendingUsers(res.data);
      } else if (activeTab === 'users') {
        const res = await axios.get(`${API_BASE_URL}/api/auth/admin/users`, { headers });
        setAllUsers(res.data);
      } else if (activeTab === 'products') {
        const res = await axios.get(`${API_BASE_URL}/api/shop/products`);
        setProducts(res.data.products);
      } else if (activeTab === 'schemes') {
        const res = await axios.get(`${API_BASE_URL}/api/schemes`);
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, action, reason = '') => {
    try {
      setProcessingId(userId);
      const token = localStorage.getItem('token');
      const endpoint = action === 'approve' ? '/approve' : '/reject';
      await axios.post(`${API_BASE_URL}/api/auth/admin${endpoint}`, 
        { user_id: userId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (err) {
      alert(`Failed to ${action} user.`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will remove all their data forever.')) return;
    try {
      setProcessingId(userId);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/auth/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(allUsers.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to delete user.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      setProcessingId(productId);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/shop/admin/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteScheme = async (schemeId) => {
    if (!window.confirm('Delete this scheme/sketch?')) return;
    try {
      setProcessingId(schemeId);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/schemes/admin/scheme/${schemeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchemes(schemes.filter(s => s.id !== schemeId));
    } catch (err) {
      alert('Failed to delete scheme.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', background: 'linear-gradient(90deg, #FF6B35, #004E89)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Supreme Admin Portal
          </h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Exclusive access for: supreethm763@gmail.com</p>
        </div>
      </div>

      <div style={tabsContainerStyle}>
        {['approvals', 'users', 'products', 'schemes'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={activeTab === tab ? activeTabStyle : tabStyle}
          >
            {tab === 'approvals' && <FiCheck style={{ marginRight: '8px' }} />}
            {tab === 'users' && <FiUser style={{ marginRight: '8px' }} />}
            {tab === 'products' && <FiShoppingBag style={{ marginRight: '8px' }} />}
            {tab === 'schemes' && <FiLayers style={{ marginRight: '8px' }} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={contentAreaStyle}>
        {loading ? (
          <div style={loadingOverlayStyle}>Loading...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'approvals' && (
                <div style={gridStyle}>
                  {pendingUsers.length === 0 ? <EmptyState msg="No pending approvals." /> : (
                    pendingUsers.map(user => {
                      // Support both singular and plural nested object keys from Supabase
                      const engData = user.engineers?.[0] || user.engineer;
                      const shopData = user.shopkeepers?.[0] || user.shopkeeper;
                      
                      return (
                        <div key={user.id} style={cardStyle}>
                          <div style={cardHeaderStyle}>
                            <div style={roleBadgeStyle(user.role)}>{user.role}</div>
                            <span style={{ fontWeight: '700' }}>{user.name}</span>
                          </div>
                          <div style={cardBodyStyle}>
                            <div style={infoRowStyle}><FiFileText /> {user.email}</div>
                            <h4 style={sectionTitleStyle}>Verification Documents</h4>
                            
                            <div style={docGridStyle}>
                              {user.role === 'engineer' ? (
                                engData ? (
                                  <>
                                    <DocLink label="Degree Certificate" url={engData.degree_cert_url} />
                                    <DocLink label="Driver's License" url={engData.dl_url} />
                                    <DocLink label="Level Cert" url={engData.level_cert_url} />
                                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#4E5BE4' }}>
                                      <strong>Company:</strong> {engData.company_name || 'Individual'}
                                    </div>
                                  </>
                                ) : <div style={nullDocStyle}>No data found in engineers table.</div>
                              ) : null}

                              {user.role === 'shop' ? (
                                shopData ? (
                                  <>
                                    <div style={{ marginBottom: '10px', width: '100%' }}>
                                      <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold' }}>Shop Photo Preview:</p>
                                      {shopData.shop_photo_url ? (
                                        <img src={shopData.shop_photo_url} alt="Shop" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EEE' }} />
                                      ) : <div style={nullDocStyle}>No photo uploaded</div>}
                                    </div>
                                    <DocLink label="Business License" url={shopData.document_url} />
                                    <div style={gstTagStyle}>GST: {shopData.gst_number || 'Not Provided'}</div>
                                    <div style={{ marginTop: '5px', fontSize: '12px', color: '#D33AFB' }}>
                                      <strong>Shop Name:</strong> {shopData.shop_name}
                                    </div>
                                  </>
                                ) : <div style={nullDocStyle}>No data found in shopkeepers table.</div>
                              ) : null}

                              {user.role === 'worker' && <div style={nullDocStyle}>Worker role is auto-approved or has no documents.</div>}
                            </div>
                          </div>
                          <div style={cardActionsStyle}>
                            <button style={approveButtonStyle} onClick={() => handleApproval(user.id, 'approve')}>Approve</button>
                            <button style={rejectButtonStyle} onClick={() => handleApproval(user.id, 'reject')}>Reject</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div style={tableContainerStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td><span style={roleBadgeStyle(user.role)}>{user.role}</span></td>
                          <td>{user.status}</td>
                          <td>
                            <button onClick={() => handleDeleteUser(user.id)} style={deleteBtnStyle}><FiTrash2 /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {allUsers.length === 0 && <EmptyState msg="No users found." />}
                </div>
              )}

              {activeTab === 'products' && (
                <div style={gridStyle}>
                  {products.map(p => (
                    <div key={p.id} style={cardStyle}>
                      <div style={{ padding: '15px', fontWeight: 'bold', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between' }}>
                        {p.name}
                        <button onClick={() => handleDeleteProduct(p.id)} style={deleteBtnStyle}><FiTrash2 /></button>
                      </div>
                      <div style={{ padding: '15px', fontSize: '13px', color: '#666' }}>
                        Price: ₹{p.price} | Shop: {p.shopkeepers?.shop_name}
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <EmptyState msg="No items found." />}
                </div>
              )}

              {activeTab === 'schemes' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Government Schemes</h3>
                    <button 
                      onClick={() => setShowAddScheme(!showAddScheme)}
                      style={{ padding: '8px 16px', background: '#004E89', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {showAddScheme ? 'Cancel' : '+ Add New Scheme'}
                    </button>
                  </div>

                  {showAddScheme && (
                    <motion.form 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      onSubmit={handleAddScheme}
                      style={{ background: '#F8F9FA', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #DDD' }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input style={formInputStyle} placeholder="Scheme Name" value={newScheme.name} onChange={e => setNewScheme({...newScheme, name: e.target.value})} required />
                        <input style={formInputStyle} placeholder="Category (e.g., Housing, Agriculture)" value={newScheme.category} onChange={e => setNewScheme({...newScheme, category: e.target.value})} />
                        <textarea style={{...formInputStyle, gridColumn: 'span 2'}} placeholder="Description" value={newScheme.description} onChange={e => setNewScheme({...newScheme, description: e.target.value})} required />
                        <textarea style={formInputStyle} placeholder="Benefits" value={newScheme.benefits} onChange={e => setNewScheme({...newScheme, benefits: e.target.value})} />
                        <textarea style={formInputStyle} placeholder="Eligibility" value={newScheme.eligibility_criteria} onChange={e => setNewScheme({...newScheme, eligibility_criteria: e.target.value})} />
                        <input style={formInputStyle} placeholder="Application Link" value={newScheme.apply_link} onChange={e => setNewScheme({...newScheme, apply_link: e.target.value})} />
                        <select style={formInputStyle} value={newScheme.target_role} onChange={e => setNewScheme({...newScheme, target_role: e.target.value})}>
                          <option value="all">All Roles</option>
                          <option value="engineer">Engineers Only</option>
                          <option value="worker">Workers Only</option>
                          <option value="shop">Shopkeepers Only</option>
                        </select>
                      </div>
                      <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', background: '#2D6a4F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Save Scheme
                      </button>
                    </motion.form>
                  )}

                  <div style={gridStyle}>
                    {schemes.map(s => (
                      <div key={s.id} style={cardStyle}>
                        <div style={{ padding: '15px', fontWeight: 'bold', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between' }}>
                          {s.name}
                          <button onClick={() => handleDeleteScheme(s.id)} style={deleteBtnStyle}><FiTrash2 /></button>
                        </div>
                        <div style={{ padding: '15px', fontSize: '12px', color: '#666' }}>
                          <div style={{ marginBottom: '5px' }}><strong>Category:</strong> {s.category || 'N/A'}</div>
                          <div style={{ marginBottom: '5px' }}><strong>Target:</strong> {s.target_role}</div>
                          <p style={{ margin: '5px 0' }}>{s.description.substring(0, 100)}...</p>
                        </div>
                      </div>
                    ))}
                    {schemes.length === 0 && <EmptyState msg="No sketches/schemes found." />}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const DocLink = ({ label, url, isImage }) => {
  if (!url) return <div style={nullDocStyle}>{label}: N/A</div>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={docLinkStyle}>
      {isImage ? <FiImage /> : <FiFileText />} {label}
    </a>
  );
};

const EmptyState = ({ msg }) => (
  <div style={emptyStyle}><FiAlertTriangle style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} /><p>{msg}</p></div>
);

// STYLES
const containerStyle = { padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' };
const headerStyle = { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const tabsContainerStyle = { display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #EEE', paddingBottom: '10px' };
const tabStyle = { padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600', color: '#999', display: 'flex', alignItems: 'center', transition: '0.2s' };
const activeTabStyle = { ...tabStyle, color: '#004E89', borderBottom: '3px solid #004E89' };
const contentAreaStyle = { minHeight: '400px', position: 'relative' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
const cardStyle = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #EEE', overflow: 'hidden' };
const cardHeaderStyle = { padding: '15px', background: '#F8F9FA', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between' };
const cardBodyStyle = { padding: '15px' };
const cardActionsStyle = { padding: '10px 15px', background: '#F8F9FA', display: 'flex', gap: '10px' };
const approveButtonStyle = { flex: 1, padding: '8px', background: '#2D6a4F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const rejectButtonStyle = { flex: 1, padding: '8px', background: '#D62828', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const deleteBtnStyle = { background: 'none', border: 'none', color: '#D62828', cursor: 'pointer', fontSize: '18px', padding: '5px' };
const errorStyle = { padding: '15px', background: '#FFE8E8', color: '#D62828', borderRadius: '8px', marginBottom: '20px' };
const tableContainerStyle = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
// th, td styles inside the component if needed or globally
const roleBadgeStyle = (role) => ({ padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', background: role === 'engineer' ? '#E3F2FD' : role === 'shop' ? '#FFF3E0' : '#F3E5F5', color: role === 'engineer' ? '#1976D2' : role === 'shop' ? '#F57C00' : '#7B1FA2' });
const docLinkStyle = { padding: '5px 10px', background: '#F0F2F5', borderRadius: '6px', fontSize: '12px', color: '#004E89', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', border: '1px solid #E0E0E0', marginRight: '5px', marginBottom: '5px' };
const emptyStyle = { textAlign: 'center', padding: '80px', color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const loadingOverlayStyle = { padding: '100px', textAlign: 'center', fontSize: '18px', color: '#666' };
const docGridStyle = { display: 'flex', flexWrap: 'wrap', marginTop: '10px' };
const infoRowStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666' };
const sectionTitleStyle = { fontSize: '11px', textTransform: 'uppercase', color: '#999', marginTop: '15px', marginBottom: '5px' };
const nullDocStyle = { fontSize: '11px', color: '#999', fontStyle: 'italic', marginRight: '10px' };
const gstTagStyle = { fontSize: '11px', fontWeight: '700', color: '#333', marginTop: '5px', width: '100%' };
const formInputStyle = { width: '100%', padding: '10px 15px', border: '1px solid #DDD', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' };

export default AdminDashboard;
