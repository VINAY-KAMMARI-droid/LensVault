import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  FolderPlus,
  ArrowLeft,
  Edit3,
  Trash2,
  FolderOpen,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { eventApi } from '../../api/eventApi';
import { albumApi } from '../../api/albumApi';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import CreateEventModal from '../../components/events/CreateEventModal';
import ClientAssignmentModal from '../../components/events/ClientAssignmentModal';
import EmptyState from '../../components/common/EmptyState';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({ albumName: '', description: '' });
  const [albumLoading, setAlbumLoading] = useState(false);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const [eventRes, albumsRes] = await Promise.all([
        eventApi.getEventById(eventId),
        albumApi.getEventAlbums(eventId),
      ]);
      setEvent(eventRes.data);
      setAlbums(albumsRes.data || []);
    } catch (err) {
      setError('Failed to load event details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumForm.albumName.trim()) return;

    setAlbumLoading(true);
    try {
      await albumApi.createAlbum(eventId, albumForm);
      setAlbumForm({ albumName: '', description: '' });
      setAlbumModalOpen(false);
      await fetchEventData();
    } catch (err) {
      setError('Failed to create album: ' + err.message);
    } finally {
      setAlbumLoading(false);
    }
  };

  const handleDeleteAlbum = async (e, albumId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this album and all media files within it?')) return;

    try {
      await albumApi.deleteAlbum(albumId);
      await fetchEventData();
    } catch (err) {
      setError('Failed to delete album: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading event..." />;
  }

  if (!event) {
    return (
      <div>
        <Alert type="error" message="Event not found" />
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/photographer/events')}>
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/photographer/events')}
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
        <span>Back to Events List</span>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Badge variant="gold">{event.eventType}</Badge>
                <Badge variant={event.status === 'ACTIVE' ? 'emerald' : 'blue'}>{event.status}</Badge>
              </div>
              <h1 style={{ fontSize: '2rem', color: '#fff', fontWeight: 800, marginBottom: '10px' }}>
                {event.eventName}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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
              </div>

              {event.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '12px', maxWidth: '700px' }}>
                  {event.description}
                </p>
              )}
            </div>

            {/* Actions Toolbar */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                icon={Users}
                onClick={() => setClientModalOpen(true)}
              >
                Manage Clients ({event.clientCount || 0})
              </Button>
              <Button
                variant="secondary"
                icon={Edit3}
                onClick={() => setEditEventModalOpen(true)}
              >
                Edit Event
              </Button>
              <Button
                variant="primary"
                icon={FolderPlus}
                onClick={() => setAlbumModalOpen(true)}
              >
                New Album
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Albums Grid */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Albums & Media Collections</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Organize media into themed collections for your clients
            </span>
          </div>

          <Button variant="primary" size="sm" icon={FolderPlus} onClick={() => setAlbumModalOpen(true)}>
            Add Album
          </Button>
        </div>

        {albums.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No albums in this event yet"
            description="Create an album (e.g. 'Ceremony', 'Portraits', 'Reception') to begin uploading media."
            actionText="Create First Album"
            onAction={() => setAlbumModalOpen(true)}
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
                onClick={() => navigate(`/photographer/events/${eventId}/albums/${album.id}`)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
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
                      }}
                    >
                      <FolderOpen size={20} />
                    </div>

                    <button
                      onClick={(e) => handleDeleteAlbum(e, album.id)}
                      title="Delete album"
                      style={{ color: 'var(--text-muted)', padding: '6px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-rose)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>
                    {album.albumName}
                  </h3>
                  {album.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
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
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>Open Album →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={editEventModalOpen}
        onClose={() => setEditEventModalOpen(false)}
        eventToEdit={event}
        onSuccess={fetchEventData}
      />

      <ClientAssignmentModal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        eventId={eventId}
        eventName={event.eventName}
      />

      {/* New Album Modal */}
      <Modal
        isOpen={albumModalOpen}
        onClose={() => setAlbumModalOpen(false)}
        title="Create New Album"
      >
        <form onSubmit={handleCreateAlbum}>
          <div className="form-group">
            <label className="form-label">Album Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ceremony & Vows"
              value={albumForm.albumName}
              onChange={(e) => setAlbumForm({ ...albumForm, albumName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="e.g. Key candid moments, vow exchange, and floral exit..."
              value={albumForm.description}
              onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <Button variant="secondary" onClick={() => setAlbumModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={albumLoading}>
              Create Album
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventDetailPage;
