import React from 'react';

const Badge = ({ children, variant = 'gold', icon: Icon }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'blue': return 'badge-blue';
      case 'emerald': return 'badge-emerald';
      case 'rose': return 'badge-rose';
      default: return 'badge-gold';
    }
  };

  return (
    <span className={`badge ${getVariantClass()}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
