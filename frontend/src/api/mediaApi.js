import axiosClient, { BASE_URL } from './axiosClient';

export const mediaApi = {
  getAlbumMedia: (albumId) => axiosClient.get(`/albums/${albumId}/media`),

  uploadMedia: (albumId, formData, onUploadProgress) => {
    return axiosClient.post(`/albums/${albumId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  deleteMedia: (mediaId) => axiosClient.delete(`/media/${mediaId}`),

  getMediaPreviewUrl: (mediaId) => {
    const token = localStorage.getItem('lensvault_token');
    return `${BASE_URL}/media/${mediaId}/preview${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  getMediaDownloadUrl: (mediaId) => {
    const token = localStorage.getItem('lensvault_token');
    return `${BASE_URL}/media/${mediaId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  downloadMediaFile: async (mediaId, filename) => {
    const token = localStorage.getItem('lensvault_token');
    const url = `${BASE_URL}/media/${mediaId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    
    // Trigger browser download directly via anchor
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'lensvault_media');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
