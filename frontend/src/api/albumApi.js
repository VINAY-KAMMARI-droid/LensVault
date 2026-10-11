import axiosClient from './axiosClient';

export const albumApi = {
  getEventAlbums: (eventId) => axiosClient.get(`/events/${eventId}/albums`),
  getAlbumById: (albumId) => axiosClient.get(`/albums/${albumId}`),
  createAlbum: (eventId, data) => axiosClient.post(`/events/${eventId}/albums`, data),
  updateAlbum: (albumId, data) => axiosClient.put(`/albums/${albumId}`, data),
  deleteAlbum: (albumId) => axiosClient.delete(`/albums/${albumId}`),
};
