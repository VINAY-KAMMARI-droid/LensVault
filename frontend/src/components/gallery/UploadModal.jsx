import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, X, File } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { mediaApi } from '../../api/mediaApi';

const UploadModal = ({ isOpen, onClose, albumId, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      setError('Please select at least one photo or video file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await mediaApi.uploadMedia(albumId, formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload files.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Event Media" maxWidth="600px">
      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Drop / Select Area */}
      <div
        style={{
          border: '2px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 20px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary)',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud size={40} color="var(--gold-primary)" style={{ marginBottom: '10px' }} />
        <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '6px' }}>
          Choose photographs or videos to upload
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Supported formats: JPEG, PNG, WebP, MP4, WebM (up to 200MB per file)
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          style={{ display: 'none' }}
        />
      </div>

      {/* Selected Files Preview List */}
      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Selected Files ({selectedFiles.length}):
          </div>
          <div
            style={{
              maxHeight: '160px',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
            }}
          >
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: idx < selectedFiles.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <File size={14} color="var(--gold-primary)" />
                  <span style={{ color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {file.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({formatSize(file.size)})</span>
                </div>
                {!isUploading && (
                  <button onClick={() => handleRemoveFile(idx)} style={{ color: 'var(--text-muted)' }}>
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Uploading media...</span>
            <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{uploadProgress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: 'var(--gold-primary)',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button variant="secondary" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          loading={isUploading}
          disabled={!selectedFiles.length || isUploading}
        >
          Start Upload
        </Button>
      </div>
    </Modal>
  );
};

export default UploadModal;
