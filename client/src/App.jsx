// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contextos
import AuthProvider from './context/AuthContext';
import SubjectProvider from './context/SubjectContext';

// Componentes de layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Componentes de autenticación
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ProfileSettings';
import ResetPassword from './components/Auth/ResetPassword';

// Componentes principales
import Dashboard from './components/Dashboard/Dashboard';
import SubjectList from './components/Subject/SubjectList';
import SubjectForm from './components/Subject/SubjectForm';
import SubjectDetail from './components/Subject/SubjectDetail';
import NotFound from './components/Layout/NotFound';
import Settings from './components/Auth/Settings';

// Rutas protegidas
import PrivateRoute from './components/Auth/PrivateRoute';

// Página de inicio
import Home from './components/Home/Home';

const App = () => {
  return (
    <AuthProvider>
      <SubjectProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-50">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
                
                {/* Rutas protegidas */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/subjects" 
                  element={
                    <PrivateRoute>
                      <SubjectList />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/subjects/new" 
                  element={
                    <PrivateRoute>
                      <SubjectForm />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/subjects/edit/:id" 
                  element={
                    <PrivateRoute>
                      <SubjectForm />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/subjects/:id" 
                  element={
                    <PrivateRoute>
                      <SubjectDetail />
                    </PrivateRoute>
                  } 
                />
                
                {/* Ruta para NotFound */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          
          {/* Configuración del sistema de notificaciones */}
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </SubjectProvider>
    </AuthProvider>
  );
};

export default App;