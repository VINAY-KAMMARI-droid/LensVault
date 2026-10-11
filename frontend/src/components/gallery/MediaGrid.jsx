import React, { useState } from 'react';
import { Play, Download, Trash2, Eye, Video as VideoIcon, Image as ImageIcon } from 'lucide-react';
import { mediaApi } from '../../api/mediaApi';
import LightboxModal from './LightboxModal';

const MediaGrid = ({
  mediaList = [],
  canDownload = true,
  canDelete = false,
  onDeleteMedia,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleOpenPreview = (index) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {mediaList.map((item, idx) => {
          const isVideo = item.mediaType === 'VIDEO';
          const previewUrl = mediaApi.getMediaPreviewUrl(item.id);

          return (
            <div
              key={item.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-secondary)',
              }}
              onClick={() => handleOpenPreview(idx)}
            >
              {/* Media Thumbnail Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '66.6%', // 3:2 photography aspect ratio
                  backgroundColor: '#0a0d14',
                  overflow: 'hidden',
                }}
              >
                {isVideo ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#111827',
                    }}
                  >
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(212, 175, 55, 0.25)',
                        border: '2px solid var(--gold-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gold-primary)',
                      }}
                    >
                      <Play size={24} style={{ marginLeft: '4px' }} />
                    </div>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt={item.originalFilename}
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                  />
                )}

                {/* Type Badge Top-Left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(10, 13, 20, 0.75)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {isVideo ? <VideoIcon size={12} color="var(--accent-blue)" /> : <ImageIcon size={12} color="var(--gold-primary)" />}
                  <span>{item.mediaType}</span>
                </div>
              </div>

              {/* Card Bottom Info Bar */}
              <div
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                    title={item.originalFilename}
                  >
                    {item.originalFilename}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {formatFileSize(item.fileSize)}
                  </div>
                </div>

                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {canDownload && (
                    <button
                      onClick={() => mediaApi.downloadMediaFile(item.id, item.originalFilename)}
                      title="Download file"
                      style={{
                        padding: '6px',
                        color: 'var(--text-secondary)',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      <Download size={15} />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => onDeleteMedia && onDeleteMedia(item.id)}
                      title="Delete media"
                      style={{
                        padding: '6px',
                        color: 'var(--text-secondary)',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-rose)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        mediaList={mediaList}
        currentIndex={selectedIndex}
        onNavigate={(idx) => setSelectedIndex(idx)}
        canDownload={canDownload}
      />
    </>
  );
};

export default MediaGrid;
