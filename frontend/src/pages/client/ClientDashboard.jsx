import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Calendar, MapPin, Camera, Download, Lock } from 'lucide-react';
import { clientApi } from '../../api/clientApi';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/events/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientEvents = async () => {
      setLoading(true);
      try {
        const res = await clientApi.getAssignedEvents();
        setEvents(res.data || []);
      } catch (err) {
        setError('Failed to load your assigned events: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientEvents();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving your private event galleries..." />;
  }

  return (
    <div>
      {/* Client Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
          Welcome back, {user?.fullName || 'Client'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Browse your private photography collections, preview memories in full resolution, and download permitted media assets.
        </p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {events.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No events assigned to your account"
          description="Your photographer has not yet assigned any event galleries to your email address. Once an event is linked, it will appear here automatically."
        />
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>
              Your Assigned Events ({events.length})
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {events.map((event) => (
              <div key={event.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <EventCard
                  event={event}
                  isClientView={true}
                  onView={() => navigate(`/client/events/${event.id}`)}
                />
                <div
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: event.downloadAllowedForClient ? 'var(--accent-emerald)' : 'var(--text-muted)',
                    padding: '0 4px',
                  }}
                >
                  {event.downloadAllowedForClient ? (
                    <>
                      <Download size={13} />
                      <span>Master High-Resolution Downloads Enabled</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      <span>Gallery Preview Only (Downloads Restricted)</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
