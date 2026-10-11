import axiosClient from './axiosClient';

export const clientApi = {
  getAssignedEvents: () => axiosClient.get('/client/events'),
  getClientEventDetails: (eventId) => axiosClient.get(`/client/events/${eventId}`),
  getClientEventAlbums: (eventId) => axiosClient.get(`/client/events/${eventId}/albums`),
};
