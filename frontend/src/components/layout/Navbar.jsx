import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, LogOut, LayoutDashboard, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'CLIENT') return '/client';
    return '/photographer';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(10, 13, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--gold-subtle)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)',
            }}
          >
            <Camera size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.28rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Lens<span style={{ color: 'var(--gold-primary)' }}>Vault</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Media Delivery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link to="/#features" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>
            Features
          </Link>
          <Link to="/#how-it-works" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>
            How It Works
          </Link>
          <Link to="/#benefits" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>
            Photographer Benefits
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="primary"
                size="sm"
                icon={LayoutDashboard}
                onClick={() => navigate(getDashboardPath())}
              >
                Dashboard
              </Button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Logout"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{ display: 'none', color: '#fff', padding: '6px' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
