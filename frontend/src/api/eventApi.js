import axiosClient from './axiosClient';

export const eventApi = {
  getEvents: (search) => axiosClient.get('/events', { params: { search } }),
  getEventById: (id) => axiosClient.get(`/events/${id}`),
  createEvent: (data) => axiosClient.post('/events', data),
  updateEvent: (id, data) => axiosClient.put(`/events/${id}`, data),
  deleteEvent: (id) => axiosClient.delete(`/events/${id}`),
  getDashboardStats: () => axiosClient.get('/events/stats/dashboard'),

  // Client assignments & permissions
  getEventClients: (eventId) => axiosClient.get(`/events/${eventId}/clients`),
  assignClient: (eventId, data) => axiosClient.post(`/events/${eventId}/clients`, data),
  updateClientPermissions: (eventId, clientId, data) =>
    axiosClient.put(`/events/${eventId}/clients/${clientId}/permissions`, data),
  revokeClientAccess: (eventId, clientId) =>
    axiosClient.delete(`/events/${eventId}/clients/${clientId}`),
};
