import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            style={{ width: '270px', height: '100%', backgroundColor: 'var(--bg-secondary)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Top Bar */}
        <div
          className="mobile-topbar"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            style={{ color: '#fff', padding: '6px' }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontWeight: 800, color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
            LensVault
          </span>
          <div style={{ width: '24px' }} />
        </div>

        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }} className="main-content-pad">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .main-content-pad { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
