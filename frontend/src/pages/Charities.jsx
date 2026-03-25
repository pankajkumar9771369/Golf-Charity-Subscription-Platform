import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Charities = () => {
  const { user, setUser } = useContext(AuthContext);
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleSelectCharity = async (charityId) => {
    if (!user) return alert('Please sign in to select a charity');
    try {
      // We would normally have a specific PUT /api/auth/me/charity endpoint
      // Using a mock standard approach for this assignment
      const res = await api.put(`/admin/users/${user._id}`, { charity: { charityId, contributionPct: 10 } });
      setUser({ ...user, charity: { charityId: charities.find(c => c._id === charityId), contributionPct: 10 } });
      alert('Charity selected successfully!');
    } catch (err) {
      alert('Failed to select charity. Ensure you have permissions or the endpoint is enabled.');
    }
  };

  const filteredCharities = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Charities...</div>;

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Charity Partners</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Explore the incredibly impactful organizations your subscription supports. Select your dedicated charity below.</p>
        
        <div style={{ position: 'relative', marginTop: '2rem' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search charities by name or cause..." 
            style={{ paddingLeft: '3rem', fontSize: '1.125rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredCharities.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>No charities found matching your search.</p>
        ) : (
          filteredCharities.map((charity, i) => (
            <motion.div 
              key={charity._id} 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {charity.featured && (
                <span style={{ alignSelf: 'flex-start', background: 'var(--accent-glow)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>FEATURED</span>
              )}
              <div style={{ height: '200px', background: `url(${charity.imageUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}></div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{charity.name}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1, marginBottom: '1.5rem' }}>{charity.description}</p>
              
              {charity.events?.length > 0 && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Upcoming Events</h4>
                  {charity.events.map((event, idx) => (
                    <div key={idx} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <strong>{new Date(event.date).toLocaleDateString()}:</strong> {event.title}
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => handleSelectCharity(charity._id)}
                className={user?.charity?.charityId?._id === charity._id ? "btn-primary" : "btn-secondary"}
                style={{ width: '100%' }}
              >
                <Heart size={18} />
                {user?.charity?.charityId?._id === charity._id ? 'Current Selection' : 'Support this Cause'}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Charities;
