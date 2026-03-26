import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    // Fetch user scores
    const fetchDashboardData = async () => {
      try {
        const [scoreRes, winnerRes] = await Promise.all([
          api.get('/scores'),
          api.get('/winners/my')
        ]);
        setScores(scoreRes.data);
        setWinners(winnerRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, navigate]);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newScore < 1 || newScore > 45) return alert('Score must be 1-45');
      const res = await api.post('/scores', { value: Number(newScore) });
      setScores(res.data);
      setNewScore('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving score');
    }
  };

  const subscribeMock = async (plan) => {
    try {
      const res = await api.post('/subscriptions/create', { plan });
      window.location.href = res.data.url; // Redirect to Stripe Checkout
    } catch (err) {
      alert(err.response?.data?.message || 'Subscription failed');
    }
  };

  const handleProofUpload = async (winnerId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('proofImage', file);
    try {
      await api.post(`/winners/${winnerId}/proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Proof submitted successfully!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading proof');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        
        {/* Main Content Area */}
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Welcome, {user.name}</h1>
          
          {!user.subscription || user.subscription.status !== 'active' ? (
            <div className="card" style={{ background: 'rgba(234, 179, 8, 0.05)', borderColor: 'var(--accent-primary)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <ShieldAlert color="var(--accent-primary)" size={32} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Subscription Required</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Activate your subscription to start entering scores, participating in the monthly draw, and supporting your chosen charity.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={() => subscribeMock('monthly')}>Subscribe Monthly ($10)</button>
                    <button className="btn-secondary" onClick={() => subscribeMock('yearly')}>Subscribe Yearly ($100)</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Your Recent Scores
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '0.25rem 0.75rem', borderRadius: '100px' }}>
                  {scores.length}/5 Active
                </span>
              </h3>
              
              <form onSubmit={handleScoreSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Enter Stableford Score (1-45)" 
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  min="1" max="45"
                  required
                />
                <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={18} /> Add Score
                </button>
              </form>

              {scores.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No scores entered yet. Enter your first round above!</p>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {scores.map((score, idx) => (
                    <div key={score._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Round {idx + 1}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '1.125rem' }}>{score.value} pts</span>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => alert('Editing via overlay...')}>Edit</button>
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                    Only your 5 most recent rounds are kept for the monthly draw.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card">
            <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Subscription Status</h4>
            {user.subscription?.status === 'active' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} /> Active ({user.subscription.plan})
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Renews: {new Date(user.subscription.renewalDate).toLocaleDateString()}</p>
              </div>
            ) : (
              <div style={{ color: 'var(--danger)', fontWeight: 600 }}>Inactive</div>
            )}
          </div>

          <div className="card">
            <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Participation Summary</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
              {scores.length === 5 ? 'Eligible' : 'Not Eligible'}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Upcoming: Next Month</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Draws Entered: 1</p>
          </div>

          <div className="card">
            <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Charity Impact</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {user.charity?.contributionPct || 10}%
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                onClick={() => {
                  const newPct = prompt('Enter new contribution percentage (min 10%):', user.charity?.contributionPct || 10);
                  if (newPct && Number(newPct) >= 10) {
                    api.put('/charities/profile/contribution', { contributionPct: Number(newPct) })
                       .then(res => {
                         setUser(res.data.user);
                         alert('Contribution percentage updated!');
                       })
                       .catch(err => alert(err.response?.data?.message || 'Update failed'));
                  }
                }}
              >
                Increase
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Of your fee goes to charity</p>
            {user.charity?.charityId ? (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.charity.charityId.name}</p>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.875rem' }}
                  onClick={async () => {
                    try {
                      console.log('Donating to:', user.charity.charityId);
                      const charId = user.charity.charityId._id || user.charity.charityId;
                      const res = await api.post(`/charities/donate/${charId}`);
                      window.location.href = res.data.url;
                    } catch (err) {
                      alert(`Donation failed: ${err.response?.data?.message || err.message}`);
                    }
                  }}
                >
                  Independent Donation
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>No charity selected yet.</p>
            )}
          </div>

          <div className="card">
            <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Winnings Summary</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
              ${winners.reduce((acc, curr) => acc + curr.prizeAmount, 0).toFixed(2)}
            </div>
            
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {winners.filter(w => w.status === 'pending').length} payouts pending review
            </p>
            
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {winners.slice(0, 3).map(w => (
                <div key={w._id} className="card" style={{ padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{w.draw?.drawMonth || 'Draw'}</span>
                    <span style={{ 
                      color: w.status === 'approved' || w.status === 'paid' ? 'var(--success)' : 
                            (w.status === 'rejected' ? 'var(--danger)' : 'var(--accent-primary)')
                    }}>
                      {w.status.toUpperCase()}
                    </span>
                  </div>
                  
                    {w.status === 'pending' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Action Required: Upload Scorecard Screenshot</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleProofUpload(w._id, e.target.files[0])}
                          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '100%' }}
                        />
                      </div>
                    )}
                    {(w.status === 'approved' || w.status === 'paid') && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem' }}>
                        ✅ Proof verified. {w.status === 'paid' ? 'Prize has been paid out.' : 'Awaiting payout.'}
                      </p>
                    )}
                    {w.status === 'rejected' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>❌ Proof rejected. Please re-upload a clearer screenshot.</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleProofUpload(w._id, e.target.files[0])}
                          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '100%' }}
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
