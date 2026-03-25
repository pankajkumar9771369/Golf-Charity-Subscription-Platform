import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // For dev. In prod, use standard relative path or env
});

// Add a request interceptor to append the JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
