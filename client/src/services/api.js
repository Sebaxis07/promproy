// src/services/api.js
import axios from 'axios';

// Recuperar el token al iniciar la aplicación
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Configurar interceptores
axios.interceptors.request.use(
  (config) => {
    // Puedes modificar la configuración de las solicitudes aquí
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Evitar ciclos infinitos de peticiones si no hay conexión al servidor
    if (!error.response) {
      console.error('Error de red - No se pudo conectar al servidor');
    }
    
    return Promise.reject(error);
  }
);

export default axios;