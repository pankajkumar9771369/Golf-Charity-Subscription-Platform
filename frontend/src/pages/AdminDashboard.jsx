import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Users, Gift, Heart, ShieldCheck, Play, Check } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('draws');
  
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [draws, setDraws] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);

  // New charity form state
  const [newCharity, setNewCharity] = useState({ name: '', description: '', active: true, featured: false });
  // Draw simulation state
  const [drawType, setDrawType] = useState('random');
  const [drawMonth, setDrawMonth] = useState('March 2026');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [uRes, cRes, dRes, wRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/charities'),
          api.get('/draws'),
          api.get('/winners/all')
        ]);
        setUsers(uRes.data);
        setCharities(cRes.data);
        setDraws(dRes.data);
        setWinners(wRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleCreateCharity = async (e) => {
    e.preventDefault();
    try {
      if (newCharity._id) {
        await api.put(`/charities/${newCharity._id}`, newCharity);
        alert('Charity updated!');
      } else {
        await api.post('/charities', newCharity);
        alert('Charity created!');
      }
      setNewCharity({ name: '', description: '', active: true, featured: false });
      const res = await api.get('/charities');
      setCharities(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving charity');
    }
  };

  const handleDeleteCharity = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this charity?')) return;
    try {
      await api.delete(`/charities/${id}`);
      const res = await api.get('/charities');
      setCharities(res.data);
    } catch (err) {
      alert('Error deleting charity');
    }
  };

  const handleEditCharity = (charity) => {
    setNewCharity(charity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulateDraw = async () => {
    try {
      const res = await api.post('/draws/simulate', { drawMonth, type: drawType });
      setDraws([res.data.draw, ...draws]);
      alert(res.data.potentialWinnersMsg);
    } catch (err) {
      alert(err.response?.data?.message || 'Error simulating draw');
    }
  };

  const handlePublishDraw = async (drawId) => {
    if (publishingId) return;
    setPublishingId(drawId);
    try {
      const res = await api.post(`/draws/publish/${drawId}`);
      alert(`Draw published successfully! Match 5: ${res.data.match5Winners}, Match 4: ${res.data.match4Winners}, Match 3: ${res.data.match3Winners}`);
      
      // Refresh draws and winners
      const [dRes, wRes] = await Promise.all([api.get('/draws'), api.get('/winners/all')]);
      setDraws(dRes.data);
      setWinners(wRes.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing draw');
    } finally {
      setPublishingId(null);
    }
  };

  const handleVerifyWinner = async (winnerId, status) => {
    try {
      await api.put(`/winners/${winnerId}/status`, { status });
      const wRes = await api.get('/winners/all');
      setWinners(wRes.data);
    } catch (err) {
      alert('Verification failed');
    }
  };

  const handlePayWinner = async (winnerId) => {
    try {
      const res = await api.post(`/winners/${winnerId}/pay`);
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payout failed');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Admin Panel...</div>;

  // Calculate Metrics
  const activeSubs = users.filter(u => u.subscription?.status === 'active').length;
  const historicPrizePool = draws.reduce((acc, d) => acc + (d.totalPrizePool || 0), 0);
  const pendingPayouts = winners.filter(w => w.status === 'pending' || w.status === 'approved').reduce((acc, w) => acc + w.prizeAmount, 0);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Admin Control Center</h1>
      
      {/* Reports & Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Users</p>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>{users.length}</div>
          <p style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{activeSubs} Active Subscribers</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Prize Pools</p>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--accent-primary)' }}>${historicPrizePool.toFixed(2)}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Charity Impact</p>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>${(activeSubs * 10 * 0.10).toFixed(2)}/mo</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Based on active $10 plans</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Payouts</p>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--danger)' }}>${pendingPayouts.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <button className={activeTab === 'draws' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('draws')}><Gift size={18} /> Draws Engine</button>
        <button className={activeTab === 'winners' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('winners')}><ShieldCheck size={18} /> Winner Verification</button>
        <button className={activeTab === 'users' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('users')}><Users size={18} /> User Management</button>
        <button className={activeTab === 'charities' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('charities')}><Heart size={18} /> Charities</button>
      </div>

      {/* Draw Engine */}
      {activeTab === 'draws' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Simulate New Draw</h3>
            <div className="form-group">
              <label>Draw Month</label>
              <input type="text" className="input-field" value={drawMonth} onChange={(e) => setDrawMonth(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Draw Algorithm</label>
              <select className="input-field" value={drawType} onChange={(e) => setDrawType(e.target.value)}>
                <option value="random">True Random (Standard Lottery)</option>
                <option value="algorithm">Algorithmic (Score Weighted)</option>
              </select>
            </div>
            <button className="btn-primary" onClick={handleSimulateDraw} style={{ width: '100%' }}><Play size={18} /> Run Simulation</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Recent Draws</h3>
            {draws.map(draw => (
              <div key={draw._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)' }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem' }}>{draw.drawMonth}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status: <span style={{ color: draw.status === 'published' ? 'var(--success)' : 'var(--accent-primary)' }}>{draw.status.toUpperCase()}</span> | Type: {draw.type}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Numbers: {draw.winningNumbers.join(', ')}</p>
                </div>
                {draw.status === 'simulated' && (
                  <button 
                    className="btn-primary" 
                    onClick={() => handlePublishDraw(draw._id)}
                    disabled={publishingId === draw._id}
                    style={{ opacity: publishingId === draw._id ? 0.7 : 1, cursor: publishingId === draw._id ? 'not-allowed' : 'pointer' }}
                  >
                    <Check size={18} /> {publishingId === draw._id ? 'Publishing...' : 'Publish'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner Verification */}
      {activeTab === 'winners' && (
        <div className="card">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>User</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Draw</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Match Tier</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Prize</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {winners.map(w => (
                <tr key={w._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <div>{w.user.name}</div>
                    {w.proofImageUrl && (
                      <a href={w.proofImageUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'underline' }}>View Proof</a>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0' }}>{w.draw.drawMonth}</td>
                  <td style={{ padding: '1rem 0' }}>{w.matchTier}</td>
                  <td style={{ padding: '1rem 0', color: 'var(--success)' }}>${w.prizeAmount.toFixed(2)}</td>
                  <td style={{ padding: '1rem 0', color: w.status === 'approved' ? 'var(--success)' : 'var(--accent-primary)' }}>{w.status.toUpperCase()}</td>
                  <td style={{ padding: '1rem 0' }}>
                    {w.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleVerifyWinner(w._id, 'approved')}>Approve</button>
                        <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => handleVerifyWinner(w._id, 'rejected')}>Reject</button>
                      </div>
                    ) : w.status === 'approved' ? (
                      <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#5850ec', minWidth: '100px' }} onClick={() => handlePayWinner(w._id)}>Pay with Stripe</button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {winners.length === 0 && <p style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No winners generated yet.</p>}
        </div>
      )}

      {/* Users & Charities Tabs */}
      {activeTab === 'users' && (
        <div className="card">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Entity</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Role</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Subscription</th>
                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Charity</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <strong>{u.name}</strong><br/>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{u.email}</span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>{u.role}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ color: u.subscription.status === 'active' ? 'var(--success)' : 'var(--text-secondary)' }}>
                      {u.subscription.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>{u.charity?.charityId?.name || 'None'} ({u.charity?.contributionPct}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'charities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{newCharity._id ? 'Edit Charity' : 'Add Charity'}</h3>
            <form onSubmit={handleCreateCharity}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="input-field" value={newCharity.name} onChange={(e) => setNewCharity({...newCharity, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input-field" rows="3" value={newCharity.description} onChange={(e) => setNewCharity({...newCharity, description: e.target.value})} required></textarea>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" className="input-field" placeholder="https://..." value={newCharity.imageUrl} onChange={(e) => setNewCharity({...newCharity, imageUrl: e.target.value})} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={newCharity.featured} onChange={(e) => setNewCharity({...newCharity, featured: e.target.checked})} />
                <label style={{ margin: 0 }}>Featured on Homepage?</label>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Charity</button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Active Charities</h3>
            {charities.map(c => (
              <div key={c._id} className="card" style={{ padding: '1rem', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{c.name} {c.featured && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}>(Featured)</span>}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.description}</p>
                  {c.events && c.events.length > 0 && (
                    <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                      <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Upcoming Events</strong>
                      <ul style={{ listStyleType: 'none', padding: 0, margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                        {c.events.map((evt, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{evt.title}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{new Date(evt.date).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleEditCharity(c)}>Edit</button>
                  <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => {
                    const title = prompt('Event Title:');
                    const date = prompt('Event Date (YYYY-MM-DD):');
                    if (title && date) {
                      const updatedEvents = [...(c.events || []), { title, date }];
                      api.put(`/charities/${c._id}`, { events: updatedEvents }).then(() => {
                        api.get('/charities').then(res => setCharities(res.data));
                        alert('Event added!');
                      });
                    }
                  }}>+ Event</button>
                  <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => handleDeleteCharity(c._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
