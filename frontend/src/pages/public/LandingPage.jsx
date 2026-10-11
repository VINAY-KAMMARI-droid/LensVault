import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  ShieldCheck,
  Lock,
  Download,
  FolderOpen,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Eye,
  Zap,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '110px 0 90px',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 175, 55, 0.15), rgba(10, 13, 20, 0))',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'var(--gold-subtle)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: 'var(--gold-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            <Sparkles size={16} />
            <span>LensVault • Secure Event Media Delivery Platform</span>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 700,
              color: '#fff',
              maxWidth: '850px',
              margin: '0 auto 20px',
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
            }}
          >
            Every Event. Every Memory.{' '}
            <span style={{ color: 'var(--gold-primary)' }}>One Secure Gallery.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 36px',
              lineHeight: '1.6',
            }}
          >
            "Your memories. Beautifully delivered." Designed exclusively for professional photographers to organize event albums, assign verified client permissions, and distribute pristine high-resolution media with zero public exposure.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '50px',
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              icon={ArrowRight}
            >
              Get Started Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Features
            </Button>
          </div>

          {/* Hero Photography Banner Mockup */}
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
              position: 'relative',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              alt="LensVault Preview"
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '480px', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10, 13, 20, 0.9) 0%, rgba(10, 13, 20, 0) 50%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '30px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                  CINEMATIC CLIENT EXPERIENCE
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>
                  Private galleries protected by role-based server authentication
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Built for Professionals
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.4rem', color: '#fff', marginTop: '8px' }}>
              Everything You Need to Deliver Event Media
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Feature 1 */}
            <div className="card card-hover">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--gold-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                  marginBottom: '18px',
                }}
              >
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
                Private Server Storage
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Original photographs and 4K footage are stored safely outside the public web root. Media files are streamed strictly through authenticated backend endpoints.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-blue)',
                  marginBottom: '18px',
                }}
              >
                <FolderOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
                Event & Album Architecture
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Organize shoot coverage effortlessly. Divide massive events into targeted albums like "Ceremony", "Vows", "Family Portraits", and "Reception".
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)',
                  marginBottom: '18px',
                }}
              >
                <Download size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
                Granular Download Permissions
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Photographers retain full financial control. Enable high-resolution downloads upon final invoice payment, or keep client galleries preview-only.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card card-hover">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(244, 63, 94, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-rose)',
                  marginBottom: '18px',
                }}
              >
                <Eye size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
                Cinematic Lightbox & Native Video
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Responsive full-screen preview lightbox with keyboard navigation for images and native HTML5 video player for cinematic event teasers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Streamlined Workflow
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.4rem', color: '#fff', marginTop: '8px' }}>
              How LensVault Works
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '30px',
            }}
          >
            {[
              {
                step: '01',
                title: 'Create Your Event',
                desc: 'Set up weddings, birthdays, or farewell sessions with metadata, venue details, and cover artwork.',
              },
              {
                step: '02',
                title: 'Organize & Upload Media',
                desc: 'Upload high-resolution photographs and cinematic videos in bulk with real-time progress indicators.',
              },
              {
                step: '03',
                title: 'Assign Client Access',
                desc: 'Invite clients via email. Grant access tokens and configure custom download permissions.',
              },
              {
                step: '04',
                title: 'Deliver Securely',
                desc: 'Clients log in to an intimate, personalized portal to browse albums, preview, and download master files.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    color: 'rgba(212, 175, 55, 0.25)',
                    marginBottom: '10px',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photographer / Client Benefits */}
      <section id="benefits" style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
            }}
          >
            {/* For Photographers */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Camera size={26} color="var(--gold-primary)" />
                <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>For Photographers</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                {[
                  'Eliminates messy Google Drive or WeTransfer links',
                  'Total intellectual property protection with download locking',
                  'Track event metrics, album media counts, and client activity',
                  'Professional presentation that impresses high-ticket clients',
                  'Automated database audit trails of all deliverables',
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Clients */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ShieldCheck size={26} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>For Clients</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                {[
                  'Clean, distraction-free gallery viewing without clutter',
                  'See only events explicitly assigned to your account',
                  'Full-screen photo lightboxes and native video streaming',
                  'One-click original resolution downloads when permitted',
                  'Mobile and desktop friendly on all screen sizes',
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section style={{ padding: '70px 0', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '16px' }}>
            Ready to Deliver Your Next Event?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1rem' }}>
            Experience secure, client-ready photography delivery. Get started in seconds.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/register')} icon={Zap}>
            Create Photographer Account
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
