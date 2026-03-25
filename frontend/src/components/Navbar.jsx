import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, LogOut, User as UserIcon, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0' }}>
      <Link to="/" style={{ fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Heart size={24} color="var(--accent-primary)" />
        Give<span style={{color: 'var(--accent-primary)'}}>Golf</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontWeight: 500 }}>
        <Link to="/charities" style={{ color: 'var(--text-secondary)' }}>Our Charities</Link>
        <Link to="/concept" style={{ color: 'var(--text-secondary)' }}>How it Works</Link>
        
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
            {user.role === 'admin' ? (
              <Link to="/admin" className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
                <Shield size={16} /> Admin Panel
              </Link>
            ) : (
              <Link to="/dashboard" className="btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <UserIcon size={16} /> Dashboard
              </Link>
            )}
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>Sign In</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
