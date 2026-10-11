import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FolderOpen,
  Image as ImageIcon,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Video,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { eventApi } from '../../api/eventApi';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import CreateEventModal from '../../components/events/CreateEventModal';
import EventCard from '../../components/events/EventCard';

const PhotographerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await eventApi.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      setError('Failed to fetch dashboard metrics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading photographer metrics..." />;
  }

  const chartData = [
    { name: 'Events', count: stats?.totalEvents || 0, color: 'var(--gold-primary)' },
    { name: 'Albums', count: stats?.totalAlbums || 0, color: 'var(--accent-blue)' },
    { name: 'Photos', count: stats?.totalImages || 0, color: 'var(--accent-emerald)' },
    { name: 'Videos', count: stats?.totalVideos || 0, color: 'var(--accent-rose)' },
    { name: 'Clients', count: stats?.totalClients || 0, color: 'var(--accent-amber)' },
  ];

  return (
    <div>
      {/* Top Welcome & Actions Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
            Photographer Studio Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Manage shooting schedules, organize albums, and deliver client master galleries
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Create New Event
          </Button>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1 */}
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
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
              {stats?.totalEvents || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Events</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-blue)',
            }}
          >
            <FolderOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
              {stats?.totalAlbums || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Albums</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Media Files ({stats?.totalImages || 0} Photos, {stats?.totalVideos || 0} Videos)
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)',
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff' }}>
              {stats?.totalClients || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Assigned Clients</div>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Quick Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Deliverables Breakdown</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live database metrics</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '14px' }}>
              Security Best Practices
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
              LensVault enforces strict role-based access. Always verify client email addresses before granting download permissions to ensure original full-resolution deliverables remain protected.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--gold-primary)' }} />
                <span>Upload JPEG, PNG, WebP images up to 200MB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)' }} />
                <span>Native MP4 / WebM video streaming enabled</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              style={{ width: '100%' }}
              onClick={() => navigate('/photographer/events')}
              icon={ArrowRight}
            >
              Browse All Events
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Events Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>Recent Events</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/photographer/events')}
          >
            View All ({stats?.totalEvents || 0})
          </Button>
        </div>

        {stats?.recentEvents && stats.recentEvents.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {stats.recentEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onView={(id) => navigate(`/photographer/events/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '30px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No events found. Click "Create New Event" above to get started.
          </div>
        )}
      </div>

      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchStats}
      />
    </div>
  );
};

export default PhotographerDashboard;
