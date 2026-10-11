import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          icon: CheckCircle,
        };
      case 'info':
        return {
          bg: 'rgba(56, 189, 248, 0.12)',
          border: 'rgba(56, 189, 248, 0.3)',
          color: '#38bdf8',
          icon: Info,
        };
      default:
        return {
          bg: 'rgba(244, 63, 94, 0.12)',
          border: 'rgba(244, 63, 94, 0.3)',
          color: '#f43f5e',
          icon: AlertCircle,
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: 'var(--radius-md)',
        color: theme.color,
        marginBottom: '16px',
        fontSize: '0.9rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon size={18} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ color: theme.color, padding: '4px' }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
