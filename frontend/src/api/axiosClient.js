import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT
axiosClient.interceptors.request.config = axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lensvault_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401s and format standard errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthPath = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthPath) {
        localStorage.removeItem('lensvault_token');
        localStorage.removeItem('lensvault_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    
    // Provide a standardized error message from backend ApiError
    const backendMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(backendMessage));
  }
);

export default axiosClient;
export { BASE_URL };
