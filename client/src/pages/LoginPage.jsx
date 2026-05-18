// client/src/pages/LoginPage.jsx — Login & Register page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LoginPage = () => {
 const [mode, setMode] = useState('login'); // 'login' | 'register'
 const [formData, setFormData] = useState({ name: '', email: '', password: '' });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const { login } = useAuth();
 const navigate = useNavigate();

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setError('');

 try {
 const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
 const res = await api.post(endpoint, formData);
 login(res.data.user, res.data.token);
 navigate('/dashboard');
 } catch (err) {
 setError(err.response?.data?.message || 'Something went wrong');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div style={{
 minHeight: '100vh',
 background: 'var(--gradient-hero)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '24px',
 }}>
 <div style={{ width: '100%', maxWidth: '420px' }}>
 {/* Logo */}
 <div style={{ textAlign: 'center', marginBottom: '32px' }}>
 <div style={{ fontSize: '3rem', marginBottom: '8px' }}></div>
 <h1 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'var(--gradient-glow)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
 AI Analytics
 </h1>
 <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
 Employee Performance System
 </p>
 </div>

 {/* Card */}
 <div className="card">
 {/* Tab Toggle */}
 <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '24px' }}>
 {['login', 'register'].map((m) => (
 <button
 key={m}
 onClick={() => { setMode(m); setError(''); }}
 style={{
 flex: 1,
 padding: '9px',
 border: 'none',
 borderRadius: '6px',
 background: mode === m ? 'var(--gradient-accent)' : 'transparent',
 color: mode === m ? '#fff' : 'var(--text-secondary)',
 fontWeight: 600,
 fontSize: '0.875rem',
 cursor: 'pointer',
 transition: 'var(--transition)',
 textTransform: 'capitalize',
 fontFamily: 'Inter, sans-serif',
 }}
 >
 {m === 'login' ? ' Login' : ' Register'}
 </button>
 ))}
 </div>

 {error && <div className="alert alert-error">{error}</div>}

 <form onSubmit={handleSubmit}>
 {mode === 'register' && (
 <div className="form-group">
 <label className="form-label" htmlFor="auth-name">Full Name</label>
 <input id="auth-name" name="name" type="text" className="form-input"
 placeholder="Your full name" value={formData.name} onChange={handleChange} required />
 </div>
 )}

 <div className="form-group">
 <label className="form-label" htmlFor="auth-email">Email</label>
 <input id="auth-email" name="email" type="email" className="form-input"
 placeholder="you@company.com" value={formData.email} onChange={handleChange} required />
 </div>

 <div className="form-group">
 <label className="form-label" htmlFor="auth-password">Password</label>
 <input id="auth-password" name="password" type="password" className="form-input"
 placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={6} />
 </div>

 <button
 id="auth-submit-btn"
 type="submit"
 className="btn btn-primary btn-lg"
 disabled={loading}
 style={{ width: '100%', marginTop: '8px' }}
 >
 {loading
 ? <><span className="spinner" /> {mode === 'login' ? 'Logging in...' : 'Creating account...'}</>
 : mode === 'login' ? ' Login' : ' Create Account'}
 </button>
 </form>
 </div>
 </div>
 </div>
 );
};

export default LoginPage;
