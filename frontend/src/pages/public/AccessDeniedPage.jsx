import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div className="card" style={{ maxWidth: '500px', padding: '48px 32px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-rose)',
            margin: '0 auto 20px',
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '12px' }}>
          403 — Access Denied
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px', lineHeight: '1.6' }}>
          You do not have the required role or event assignment to access this resource. If you believe this is an error, please request authorization from the event photographer.
        </p>
        <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/')}>
          Return to Platform
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
