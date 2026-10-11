import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, LogIn, Key, User, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      // Route dynamically to appropriate role dashboard
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'CLIENT') {
        navigate('/client');
      } else {
        navigate('/photographer');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '24px',
        background: 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.08), rgba(10, 13, 20, 1) 70%)',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
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
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              Lens<span style={{ color: 'var(--gold-primary)' }}>Vault</span>
            </span>
          </Link>
          <h2 style={{ fontSize: '1.25rem', marginTop: '16px', color: '#fff' }}>
            Sign In to LensVault
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Access your events and client galleries
          </p>
        </div>

        {isExpired && (
          <Alert type="info" message="Your session has expired. Please sign in again." />
        )}

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. alexander@lensvault.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', marginTop: '10px' }}
            loading={loading}
            icon={LogIn}
          >
            Sign In
          </Button>
        </form>

        {/* Demo Accounts Quick-Fill Section */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', textAlign: 'center', fontWeight: 700 }}>
            Demo Accounts for Academic Evaluation:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickFill('photographer@lensvault.com', 'Photographer@123')}
            >
              Photographer
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickFill('client.sarah@lensvault.com', 'Client@123')}
            >
              Client (Sarah)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickFill('client.david@lensvault.com', 'Client@123')}
            >
              Client (David)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickFill('admin@lensvault.com', 'Admin@123')}
            >
              Administrator
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>
            Register as Photographer or Client
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
