import React from 'react';
import { Camera, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '50px 0 30px',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--gold-subtle)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                }}
              >
                <Camera size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Lens<span style={{ color: 'var(--gold-primary)' }}>Vault</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              "Your memories. Beautifully delivered." A modern, secure, and private digital media delivery platform for professional photographers and their esteemed clients.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>
              Platform Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <Link to="/#features" style={{ color: 'var(--text-secondary)' }}>Key Features</Link>
              <Link to="/#how-it-works" style={{ color: 'var(--text-secondary)' }}>How It Works</Link>
              <Link to="/#benefits" style={{ color: 'var(--text-secondary)' }}>Photographer & Client Benefits</Link>
              <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
            </div>
          </div>

          {/* Security & Architecture */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>
              Security & Compliance
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '12px' }}>
              Built with Spring Security, HMAC-SHA256 JWT validation, private server storage, and granular client-level download controls.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontSize: '0.82rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Full Role-Based Media Isolation</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} LensVault Platform. All rights reserved. Academic Project Demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted for professional photography studios</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
