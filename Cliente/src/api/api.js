import axios from 'axios';

// 1. URL base usando la variable de entorno de Render
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

// 2. Instancia personalizada de axios
const clienteAxios = axios.create({
  baseURL: API_URL,
});

// 3. Interceptor para inyectar automáticamente el token JWT
clienteAxios.interceptors.request.use(
  (config) => {
    // Rescatamos el token fresco desde el almacenamiento local
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

export default clienteAxios;