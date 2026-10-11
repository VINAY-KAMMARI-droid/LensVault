import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Camera,
  FolderOpen,
  ArrowLeft,
  Download,
  Lock,
  Image as ImageIcon,
} from 'lucide-react';
import { clientApi } from '../../api/clientApi';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';

const ClientEventView = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const [eventRes, albumsRes] = await Promise.all([
          clientApi.getClientEventDetails(eventId),
          clientApi.getClientEventAlbums(eventId),
        ]);
        setEvent(eventRes.data);
        setAlbums(albumsRes.data || []);
      } catch (err) {
        setError('Failed to load event details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (loading) {
    return <LoadingSpinner text="Opening event gallery..." />;
  }

  if (!event) {
    return (
      <div>
        <Alert type="error" message="Event not accessible or permission denied" />
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/client')}>
          Back to My Events
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/client')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.88rem',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to My Assigned Events</span>
      </button>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Event Header Banner */}
      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        {event.coverImageUrl && (
          <div
            style={{
              width: '100%',
              height: '240px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src={event.coverImageUrl}
              alt={event.eventName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, var(--bg-card) 0%, rgba(18, 24, 36, 0.4) 100%)',
              }}
            />
          </div>
        )}

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Badge variant="gold">{event.eventType}</Badge>
            {event.downloadAllowedForClient ? (
              <Badge variant="emerald" icon={Download}>Downloads Enabled</Badge>
            ) : (
              <Badge variant="rose" icon={Lock}>Preview Only</Badge>
            )}
          </div>

          <h1 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: 800, marginBottom: '10px' }}>
            {event.eventName}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="var(--gold-primary)" />
              <span>{event.eventDate}</span>
            </div>
            {event.venue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--gold-primary)" />
                <span>{event.venue}</span>
              </div>
            )}
            {event.photographerName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={16} color="var(--gold-primary)" />
                <span>Photographer: {event.photographerName}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '720px' }}>
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Albums Collection */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '18px' }}>
          Event Albums ({albums.length})
        </h2>

        {albums.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No albums published yet"
            description="Your photographer has not yet uploaded media to albums for this event. Please check back shortly!"
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {albums.map((album) => (
              <div
                key={album.id}
                className="card card-hover"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onClick={() =>
                  navigate(`/client/events/${eventId}/albums/${album.id}`, {
                    state: { canDownload: event.downloadAllowedForClient },
                  })
                }
              >
                <div>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--gold-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-primary)',
                      marginBottom: '14px',
                    }}
                  >
                    <FolderOpen size={20} />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>
                    {album.albumName}
                  </h3>
                  {album.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '14px' }}>
                      {album.description}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={14} color="var(--gold-primary)" />
                    <span>{album.mediaCount || 0} Media Files</span>
                  </div>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>Explore Album →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientEventView;
