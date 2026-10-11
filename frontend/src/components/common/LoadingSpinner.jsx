import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 28, text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '12px' }}>
      <Loader2 size={size} color="var(--gold-primary)" style={{ animation: 'spin 1s linear infinite' }} />
      {text && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
