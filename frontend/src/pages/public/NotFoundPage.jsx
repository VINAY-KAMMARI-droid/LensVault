import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
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
      <div className="card" style={{ maxWidth: '480px', padding: '48px 32px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--gold-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)',
            margin: '0 auto 20px',
          }}
        >
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '12px' }}>
          404 — Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
          The gallery, album, or destination you are searching for does not exist or has been removed.
        </p>
        <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
