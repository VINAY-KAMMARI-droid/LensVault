import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Download, Lock } from 'lucide-react';
import { albumApi } from '../../api/albumApi';
import { mediaApi } from '../../api/mediaApi';
import { clientApi } from '../../api/clientApi';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import MediaGrid from '../../components/gallery/MediaGrid';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

const ClientAlbumView = () => {
  const { eventId, albumId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [album, setAlbum] = useState(null);
  const [event, setEvent] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // download permission passed via state or fetched via event
  const [canDownload, setCanDownload] = useState(location.state?.canDownload ?? true);

  useEffect(() => {
    const fetchAlbumAndMedia = async () => {
      setLoading(true);
      try {
        const [albumRes, mediaRes, eventRes] = await Promise.all([
          albumApi.getAlbumById(albumId),
          mediaApi.getAlbumMedia(albumId),
          clientApi.getClientEventDetails(eventId),
        ]);
        setAlbum(albumRes.data);
        setMediaList(mediaRes.data || []);
        setEvent(eventRes.data);
        setCanDownload(eventRes.data.downloadAllowedForClient);
      } catch (err) {
        setError('Failed to fetch album media: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumAndMedia();
  }, [eventId, albumId]);

  if (loading) {
    return <LoadingSpinner text="Loading gallery media..." />;
  }

  if (!album) {
    return (
      <div>
        <Alert type="error" message="Album not found or access restricted" />
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(`/client/events/${eventId}`)}>
          Back to Event
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <Link to="/client" style={{ color: 'var(--text-secondary)' }}>My Events</Link>
        <span>/</span>
        <Link to={`/client/events/${eventId}`} style={{ color: 'var(--text-secondary)' }}>{album.eventName}</Link>
        <span>/</span>
        <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{album.albumName}</span>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
              {album.albumName}
            </h1>
            {canDownload ? (
              <Badge variant="emerald" icon={Download}>Downloads Enabled</Badge>
            ) : (
              <Badge variant="rose" icon={Lock}>Preview Only</Badge>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {album.description || 'Collection of photographs and footage'} • {mediaList.length} total media files
          </p>
        </div>
      </div>

      {/* Media Grid or Empty State */}
      {mediaList.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No photographs or videos in this album yet"
          description="Your photographer has created this album, but files haven't been uploaded yet. Please check back later."
        />
      ) : (
        <MediaGrid
          mediaList={mediaList}
          canDownload={canDownload}
          canDelete={false}
        />
      )}
    </div>
  );
};

export default ClientAlbumView;
