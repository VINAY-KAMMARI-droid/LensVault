import React, { useEffect } from 'react';
import { X, Download, ChevronLeft, ChevronRight, FileText, Lock } from 'lucide-react';
import { mediaApi } from '../../api/mediaApi';
import Button from '../common/Button';

const LightboxModal = ({
  isOpen,
  onClose,
  mediaList = [],
  currentIndex = 0,
  onNavigate,
  canDownload = true,
}) => {
  const currentMedia = mediaList[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNavigate && currentIndex < mediaList.length - 1) {
        onNavigate(currentIndex + 1);
      }
      if (e.key === 'ArrowLeft' && onNavigate && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, mediaList, onNavigate, onClose]);

  if (!isOpen || !currentMedia) return null;

  const isVideo = currentMedia.mediaType === 'VIDEO';
  const previewUrl = mediaApi.getMediaPreviewUrl(currentMedia.id);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (canDownload) {
      mediaApi.downloadMediaFile(currentMedia.id, currentMedia.originalFilename);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.96)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>
            {currentMedia.originalFilename}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({currentIndex + 1} of {mediaList.length}) • {formatFileSize(currentMedia.fileSize)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {canDownload ? (
            <Button variant="primary" size="sm" icon={Download} onClick={handleDownload}>
              Download Original
            </Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              <Lock size={14} />
              <span>Downloads Restricted by Photographer</span>
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Preview Center Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '24px',
          overflow: 'hidden',
        }}
      >
        {/* Navigation Arrows */}
        {currentIndex > 0 && onNavigate && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            style={{
              position: 'absolute',
              left: '20px',
              zIndex: 10,
              backgroundColor: 'rgba(20, 25, 35, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              borderRadius: '50%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Media Container */}
        <div
          style={{
            maxWidth: '92%',
            maxHeight: '84vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isVideo ? (
            <video
              controls
              autoPlay
              style={{
                maxWidth: '100%',
                maxHeight: '84vh',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: '#000',
              }}
              src={previewUrl}
            >
              Your browser does not support HTML5 video preview.
            </video>
          ) : (
            <img
              src={previewUrl}
              alt={currentMedia.originalFilename}
              style={{
                maxWidth: '100%',
                maxHeight: '84vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
              }}
            />
          )}
        </div>

        {currentIndex < mediaList.length - 1 && onNavigate && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            style={{
              position: 'absolute',
              right: '20px',
              zIndex: 10,
              backgroundColor: 'rgba(20, 25, 35, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              borderRadius: '50%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LightboxModal;
