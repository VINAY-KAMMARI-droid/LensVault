import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'PHOTOGRAPHER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register(formData);
      if (user.role === 'CLIENT') {
        navigate('/client');
      } else {
        navigate('/photographer');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
          maxWidth: '460px',
          padding: '36px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
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
            Create Your Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Start sharing and managing your event galleries
          </p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              placeholder="e.g. Liam Anderson"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. liam@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">I am joining as a *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${formData.role === 'PHOTOGRAPHER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormData((prev) => ({ ...prev, role: 'PHOTOGRAPHER' }))}
                style={{ justifyContent: 'center' }}
              >
                Photographer
              </button>
              <button
                type="button"
                className={`btn ${formData.role === 'CLIENT' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormData((prev) => ({ ...prev, role: 'CLIENT' }))}
                style={{ justifyContent: 'center' }}
              >
                Client
              </button>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {formData.role === 'PHOTOGRAPHER'
                ? 'Create events, upload high-res photos & videos, and manage client access.'
                : 'Browse private event galleries and download permitted media assets.'}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', marginTop: '16px' }}
            loading={loading}
            icon={UserPlus}
          >
            Create Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
