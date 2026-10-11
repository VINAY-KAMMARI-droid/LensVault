import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardStats: () => axiosClient.get('/admin/dashboard'),
  getAllUsers: (role, search) => axiosClient.get('/admin/users', { params: { role, search } }),
  updateUserStatus: (userId, active) =>
    axiosClient.patch(`/admin/users/${userId}/status`, { active }),
  getAuditLogs: () => axiosClient.get('/admin/audit-logs'),
};
