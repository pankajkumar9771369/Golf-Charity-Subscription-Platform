import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(email, password);
      // Redirect admin to admin panel, regular users to dashboard
      if (loggedInUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@golfcharity.com');
    setPassword('Admin1234!');
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to your account</p>
        
        {/* Quick Admin Login Button */}
        <button
          type="button"
          onClick={fillAdminCredentials}
          style={{
            width: '100%',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: 'rgba(234,179,8,0.1)',
            border: '1px dashed var(--accent-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Shield size={16} /> Quick Fill: Admin Credentials
        </button>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
