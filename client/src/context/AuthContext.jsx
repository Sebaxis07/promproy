import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../config/axios';
import { toast } from 'react-toastify';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al iniciar o recargar la página
  useEffect(() => {
    checkAuth();
  }, []);

  // Configurar interceptor de Axios para manejar errores de autorización
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && isAuthenticated) {
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    // Limpiar el interceptor cuando se desmonte el componente
    return () => {
      axiosClient.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await axiosClient.get('/auth/verify');
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        console.error('Error de verificación:', error);
        toast.error('Error al verificar la autenticación');
      }
    } finally {
      setLoading(false);
    }
  };

  // Actualizar handleLogout para limpiar todo correctamente
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axiosClient.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      // Log what we're sending to help debug
      console.log('Sending registration data:', userData);
      
      const response = await axiosClient.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        toast.success('Registro exitoso');
        return true;
      } else {
        toast.error('Error en el registro: Respuesta inválida del servidor');
        return false;
      }
    } catch (error) {
      console.error('Error de registro:', error);
      // Log more details from the error response
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axiosClient.post('/auth/login', credentials);
      
      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        toast.success('Sesión iniciada correctamente');
        return true;
      } else {
        toast.error('Error en el inicio de sesión: Respuesta inválida del servidor');
        return false;
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      const errorMessage = error.response?.data?.message || 'Credenciales incorrectas';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    handleLogout();
    toast.info('Sesión cerrada');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;