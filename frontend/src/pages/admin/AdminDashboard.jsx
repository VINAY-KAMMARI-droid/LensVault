import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Camera,
  FolderOpen,
  Image as ImageIcon,
  HardDrive,
  ShieldAlert,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        setError('Failed to load administrator statistics: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving platform metrics..." />;
  }

  const formatStorage = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb > 1024) {
      return (mb / 1024).toFixed(2) + ' GB';
    }
    return mb.toFixed(1) + ' MB';
  };

  return (
    <div>
      {/* Admin Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
          LensVault Platform Administration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          System telemetry, user moderation, storage utilization, and security audit logs
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-blue)',
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
              {stats?.totalUsers || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Registered Users ({stats?.totalPhotographers || 0} Photographers, {stats?.totalClients || 0} Clients)
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'var(--gold-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)',
            }}
          >
            <FolderOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
              {stats?.totalEvents || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total Events ({stats?.totalAlbums || 0} Albums)
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)',
            }}
          >
            <ImageIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
              {stats?.totalMedia || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Media Files Uploaded</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)',
            }}
          >
            <HardDrive size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
              {formatStorage(stats?.totalStorageBytes)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Disk Storage Utilized</div>
          </div>
        </div>
      </div>

      {/* Quick Links & Recent Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--gold-primary)" />
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Recent Audit Activity</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/audit-logs')}>
              View All
            </Button>
          </div>

          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.recentActivity.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{log.action}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>{log.details}</div>
                  <div style={{ color: 'var(--gold-primary)', fontSize: '0.76rem', marginTop: '4px' }}>
                    Actor: {log.actorEmail}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
              No audit logs recorded yet.
            </div>
          )}
        </div>

        {/* Administration Actions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '14px' }}>
              Moderation & Governance
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              As administrator, you can inspect registered photographers, examine client assignments, deactivate compromised accounts, and audit all data transactions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button
              variant="secondary"
              icon={Users}
              onClick={() => navigate('/admin/users')}
              style={{ width: '100%' }}
            >
              Manage Registered Users
            </Button>
            <Button
              variant="outline"
              icon={ArrowRight}
              onClick={() => navigate('/admin/audit-logs')}
              style={{ width: '100%' }}
            >
              Inspect Security Audit Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
