import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', charityId: '' });
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data);
      } catch (err) {
        console.error('Failed to fetch charities', err);
      }
    };
    fetchCharities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.charityId) return setError('Please select a charity to support');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '4rem 0' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Join the platform where your golf game makes a real difference.
        </p>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Select Charity to Support (Min 10% donation)</label>
            <select 
              className="input-field" 
              value={formData.charityId} 
              onChange={(e) => setFormData({...formData, charityId: e.target.value})}
              required
              style={{ background: 'var(--bg-secondary)', color: 'white' }}
            >
              <option value="">-- Choose a cause --</option>
              {charities.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Create Account
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
