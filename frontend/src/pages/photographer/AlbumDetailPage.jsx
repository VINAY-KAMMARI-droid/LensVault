import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  ArrowLeft,
  Trash2,
  Edit3,
  FolderOpen,
  Image as ImageIcon,
} from 'lucide-react';
import { albumApi } from '../../api/albumApi';
import { mediaApi } from '../../api/mediaApi';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import MediaGrid from '../../components/gallery/MediaGrid';
import UploadModal from '../../components/gallery/UploadModal';
import EmptyState from '../../components/common/EmptyState';

const AlbumDetailPage = () => {
  const { eventId, albumId } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const fetchAlbumData = async () => {
    setLoading(true);
    try {
      const [albumRes, mediaRes] = await Promise.all([
        albumApi.getAlbumById(albumId),
        mediaApi.getAlbumMedia(albumId),
      ]);
      setAlbum(albumRes.data);
      setMediaList(mediaRes.data || []);
    } catch (err) {
      setError('Failed to fetch album media: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbumData();
  }, [albumId]);

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media file?')) return;

    try {
      await mediaApi.deleteMedia(mediaId);
      await fetchAlbumData();
    } catch (err) {
      setError('Failed to delete media: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading album media..." />;
  }

  if (!album) {
    return (
      <div>
        <Alert type="error" message="Album not found" />
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(`/photographer/events/${eventId}`)}>
          Back to Event
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <Link to="/photographer/events" style={{ color: 'var(--text-secondary)' }}>Events</Link>
        <span>/</span>
        <Link to={`/photographer/events/${eventId}`} style={{ color: 'var(--text-secondary)' }}>{album.eventName}</Link>
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
          <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
            {album.albumName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {album.description || 'Collection of event photographs and playable footage'} • {mediaList.length} total files
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="primary"
            icon={UploadCloud}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload Media
          </Button>
        </div>
      </div>

      {/* Media Grid or Empty State */}
      {mediaList.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media in this album yet"
          description="Upload JPEG, PNG, WebP photos or MP4/WebM videos to populate this album."
          actionText="Upload First Media"
          onAction={() => setUploadModalOpen(true)}
        />
      ) : (
        <MediaGrid
          mediaList={mediaList}
          canDownload={true}
          canDelete={true}
          onDeleteMedia={handleDeleteMedia}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        albumId={albumId}
        onUploadSuccess={fetchAlbumData}
      />
    </div>
  );
};

export default AlbumDetailPage;
