import React from 'react';
import { Camera, FolderPlus } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Camera,
  title = 'No items found',
  description = 'There are currently no items to display in this section.',
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        margin: '20px 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold-primary)',
          marginBottom: '16px',
        }}
      >
        <Icon size={30} />
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', fontSize: '0.92rem', marginBottom: actionText ? '20px' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
