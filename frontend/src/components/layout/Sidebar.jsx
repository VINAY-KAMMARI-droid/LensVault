import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Camera,
  LayoutDashboard,
  Calendar,
  Users,
  Shield,
  FileText,
  LogOut,
  FolderOpen,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const Sidebar = () => {
  const { user, logout, isPhotographer, isClient, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleVariant = () => {
    if (isAdmin) return 'rose';
    if (isPhotographer) return 'gold';
    return 'blue';
  };

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--gold-subtle)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)',
          }}
        >
          <Camera size={20} />
        </div>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Lens<span style={{ color: 'var(--gold-primary)' }}>Vault</span>
          </span>
          <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Secure Platform
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '20px 14px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 10px' }}>
          Navigation
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {isPhotographer && (
            <>
              <NavLink
                to="/photographer"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/photographer/events"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Calendar size={18} />
                <span>My Events</span>
              </NavLink>
            </>
          )}

          {isClient && (
            <>
              <NavLink
                to="/client"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FolderOpen size={18} />
                <span>Assigned Events</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Shield size={18} />
                <span>Platform Overview</span>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>User Management</span>
              </NavLink>

              <NavLink
                to="/admin/audit-logs"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>Audit Logs</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-tertiary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || 'User'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email}
            </div>
          </div>
          <Badge variant={getRoleVariant()}>{user?.role}</Badge>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: '#fb7185',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.92rem;
          transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          color: #fff;
          background-color: var(--bg-tertiary);
        }
        .sidebar-link.active {
          color: var(--gold-primary);
          background-color: var(--gold-subtle);
          font-weight: 600;
          border-left: 3px solid var(--gold-primary);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
