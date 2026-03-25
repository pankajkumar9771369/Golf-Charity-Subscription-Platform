import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Target, Award, ArrowRight, Heart } from 'lucide-react';
import api from '../utils/api';

const FeaturedCharity = () => {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/charities');
        const spotlight = res.data.find(c => c.featured);
        if (spotlight) setFeatured(spotlight);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  if (!featured) return null;

  return (
    <section style={{ padding: '4rem 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Spotlight Charity</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.5rem' }}>{featured.name}</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {featured.description}
          </p>
          <Link to="/charities" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={18} /> Support this Cause
          </Link>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          style={{ 
            height: '400px', 
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${featured.imageUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}
        ></motion.div>
      </div>
    </section>
  );
};


const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '8rem 0 6rem',
        overflow: 'hidden'
      }}>
        {/* Abstract animated background elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '600px', height: '600px', background: '#4f46e5', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%', zIndex: -1 }}></div>

        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--bg-card)', border: `1px solid var(--border-light)`, borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
              Play with Purpose
            </span>
            <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '1.5rem', backgroundImage: 'linear-gradient(to right, #ffffff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Transform Your Game Into <span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'var(--accent-primary)' }}>Impact</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Join the only subscription platform where your golf performance powers life-changing charitable giving—and rewards you with exclusive monthly prize pools.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                Start Making Impact <ArrowRight size={20} />
              </Link>
              <Link to="/charities" className="btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                View Charities
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Charity Spotlight */}
      <FeaturedCharity />

      {/* Concept Section */}
      <section className="container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Support a Cause</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Choose from our curated directory of impactful charities. A portion of your monthly subscription is automatically donated.
            </p>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#818cf8' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Track 5 Scores</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Log your rounds using the standard Stableford format. We keep your latest 5 rounds active for the monthly draw.
            </p>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success)' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Win the Draw</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Match 3, 4, or 5 numbers in our monthly reward pool to win substantial payouts. Unclaimed 5-matches roll over!
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Home;
