import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaGraduationCap, FaSignOutAlt, FaUserCircle, FaChartLine, FaHome, FaBookOpen } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    const baseClass = "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105";
    const activeClass = "bg-blue-600/20 text-blue-300 shadow-lg backdrop-blur-sm border border-blue-500/30";
    const inactiveClass = "text-blue-100/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm";
    
    return `${baseClass} ${isActiveRoute(path) ? activeClass : inactiveClass}`;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-800/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full shadow-lg">
                    <FaGraduationCap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    CalcuNotas
                  </span>
                  <div className="text-xs text-blue-300/70 -mt-1">Sistema Académico</div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                      <FaHome className="inline mr-2" />
                      Panel Principal
                    </Link>
                    <Link to="/subjects" className={navLinkClass("/subjects")}>
                      <FaBookOpen className="inline mr-2" />
                      Asignaturas
                    </Link>
                    
                    {/* User Menu */}
                    <div className="flex items-center ml-6 pl-6 border-l border-white/20">
                      <div className="flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                          <FaUserCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-sm">
                          <div className="text-white font-medium">{user?.name}</div>
                          <div className="text-blue-200/70 text-xs">Estudiante</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="ml-4 group relative px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-300 text-sm font-medium"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Salir
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="px-4 py-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg transition-all duration-300 text-sm font-medium transform hover:scale-105"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              >
                <span className="sr-only">Abrir menú</span>
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                    }`}
                  />
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-2 bg-slate-900/90 backdrop-blur-xl border-t border-white/10">
            {isAuthenticated ? (
              <>
                {/* User Info Mobile */}
                <div className="flex items-center px-3 py-3 bg-white/5 rounded-lg border border-white/10 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <FaUserCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-blue-200/70 text-sm">Estudiante</div>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActiveRoute("/dashboard") 
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="inline mr-3" />
                  Panel Principal
                </Link>
                
                <Link
                  to="/subjects"
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActiveRoute("/subjects") 
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaBookOpen className="inline mr-3" />
                  Asignaturas
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-all duration-300 border border-red-500/20 hover:border-red-400/40 mt-4"
                >
                  <FaSignOutAlt className="inline mr-3" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;