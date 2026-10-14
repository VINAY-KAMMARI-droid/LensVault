```javascript
import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://lensvault-backend.onrender.com/api/v1';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lensvault_token');

    if (token) {
      config.headers.Authorization = `Bearer ${ token } `;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle authentication errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthPath =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');

      if (!isAuthPath) {
        localStorage.removeItem('lensvault_token');
        localStorage.removeItem('lensvault_user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }

    const backendMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(backendMessage));
  }
);

export default axiosClient;
export { BASE_URL };
```