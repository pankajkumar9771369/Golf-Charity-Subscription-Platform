import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { n: '01', title: 'Subscribe', desc: 'Choose a Monthly or Yearly plan. A portion of your fee goes directly to your chosen charity every single month.' },
  { n: '02', title: 'Track Your Scores', desc: 'Enter your latest Stableford rounds. We keep your 5 most recent scores — the ones that count for the draw.' },
  { n: '03', title: 'Enter the Draw', desc: 'Each month, 5 numbers from 1-45 are drawn. Match 3, 4, or all 5 to win a share of the prize pool.' },
  { n: '04', title: 'Win & Give', desc: 'Winners receive prizes paid directly to their account. Unclaimed jackpots roll over to next month — growing the pot!' },
];

const Concept = () => (
  <div className="container" style={{ padding: '5rem 0' }}>
    <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How It Works</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.7 }}>
        Give Golf is a subscription platform where your love of golf funds real charitable causes — 
        and gives you a shot at winning real prizes every month.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
      {steps.map((s, i) => (
        <motion.div
          key={s.n}
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-glow)', marginBottom: '1rem' }}>{s.n}</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{s.title}</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.desc}</p>
        </motion.div>
      ))}
    </div>

    <div className="card" style={{ marginTop: '4rem', textAlign: 'center', padding: '3rem', background: 'var(--accent-glow)' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Prize Pool Breakdown</h2>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div><div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>40%</div><div style={{ color: 'var(--text-secondary)' }}>5-Number Match (Jackpot)</div></div>
        <div><div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>35%</div><div style={{ color: 'var(--text-secondary)' }}>4-Number Match</div></div>
        <div><div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>25%</div><div style={{ color: 'var(--text-secondary)' }}>3-Number Match</div></div>
      </div>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
        If no one matches all 5 numbers, the jackpot rolls over to next month — growing until someone wins it!
      </p>
    </div>
  </div>
);

export default Concept;
