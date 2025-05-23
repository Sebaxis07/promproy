import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',  // Cambiamos a ruta relativa para usar el proxy de Vite
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para incluir el token en cada petición
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Log detallado del error para debugging
      console.error('Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;