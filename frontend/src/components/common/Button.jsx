import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // primary | secondary | danger | outline
  size = 'md', // sm | md | lg
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  onClick,
  style = {},
  className = '',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'btn-secondary';
      case 'danger': return 'btn-danger';
      case 'outline': return 'btn-outline';
      default: return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    if (size === 'sm') return 'btn-sm';
    return '';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...style,
      }}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
    >
      {loading ? (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
