import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaGraduationCap, FaSignOutAlt, FaUserCircle, FaChartLine } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaGraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-white">CalcuNotas</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Panel Principal
                  </Link>
                  <Link 
                    to="/subjects" 
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Asignaturas
                  </Link>
                  <div className="relative ml-3">
                    <div className="flex items-center">
                      <div className="text-gray-300 mr-2">
                        <FaUserCircle className="inline mr-1" />
                        <span>{user?.name}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <FaSignOutAlt className="mr-1" />
                        Salir
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-primary text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Abrir menú</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Panel Principal
              </Link>
              <Link
                to="/subjects"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Asignaturas
              </Link>
              <div className="text-gray-300 px-3 py-2">
                <FaUserCircle className="inline mr-1" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;