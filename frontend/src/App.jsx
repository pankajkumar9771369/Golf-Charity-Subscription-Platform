import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Charities from './pages/Charities';
import Concept from './pages/Concept';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <header className="site-header" style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', position: 'sticky', top: 0, zIndex: 50 }}>
            <Navbar />
          </header>
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/charities" element={<Charities />} />
              <Route path="/concept" element={<Concept />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
