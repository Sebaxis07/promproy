import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaGraduationCap, FaSignOutAlt, FaUserCircle, FaChartLine, FaHome, FaBookOpen, FaBell, FaCog, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/subjects', label: 'Asignaturas', icon: FaBookOpen },
    { path: '/analytics', label: 'Estadísticas', icon: FaChartLine },
  ];

  return (
    <>
      {/* Navbar Principal */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 border-b border-blue-500/20' 
          : 'bg-gradient-to-r from-slate-900/80 via-blue-900/80 to-slate-800/80 backdrop-blur-xl border-b border-white/10'
      }`}>
        
        {/* Efecto de brillo superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        
        <nav className="relative max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 py-4">
            
            {/* Logo Premium */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                {/* Círculos de brillo animados */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-blue-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 animate-pulse transition-all duration-1000"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/40 to-blue-600/40 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Container del logo */}
                <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4 rounded-2xl shadow-2xl border border-blue-400/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <FaGraduationCap className="h-8 w-8 text-white filter drop-shadow-lg" />
                  
                  {/* Brillo interno */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-2xl"></div>
                </div>
              </div>
              
              <div className="ml-5">
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent tracking-tight group-hover:tracking-wide transition-all duration-500">
                  CalcuNotas
                </h1>
                <p className="text-xs text-blue-300/70 font-semibold tracking-widest uppercase mt-0.5 group-hover:text-blue-200/90 transition-colors duration-500">
                  Sistema Académico
                </p>
              </div>
            </Link>

            {/* Navegación Central - Solo Desktop */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 shadow-xl">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group relative flex items-center px-6 py-3 mx-1 rounded-xl font-semibold text-sm transition-all duration-500 transform hover:scale-105 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50 border border-blue-400/50' 
                          : 'text-blue-200/80 hover:text-white hover:bg-slate-700/70'
                      }`}
                    >
                      <Icon className={`mr-3 transition-all duration-500 ${
                        isActive ? 'text-lg scale-110' : 'text-base group-hover:scale-110'
                      }`} />
                      {item.label}
                      
                      {/* Indicador activo */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      )}
                      
                      {/* Efecto hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/10 to-blue-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Acciones de Usuario */}
            <div className="flex items-center space-x-3">
              
              {/* Búsqueda - Solo si está autenticado */}
              {isAuthenticated && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110 border border-transparent hover:border-slate-600/50"
                  >
                    <FaSearch className="h-5 w-5" />
                  </button>
                  
                  {/* Barra de búsqueda expandible */}
                  <div className={`absolute right-0 top-full mt-2 transition-all duration-500 ${
                    isSearchOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                  }`}>
                    <input
                      type="text"
                      placeholder="Buscar asignaturas..."
                      className="w-64 px-4 py-3 bg-slate-800/90 backdrop-blur-xl text-white placeholder-blue-300/50 rounded-xl border border-slate-600/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xl"
                    />
                  </div>
                </div>
              )}

              {/* Notificaciones - Solo si está autenticado */}
              {isAuthenticated && (
                <button className="relative p-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110 border border-transparent hover:border-slate-600/50">
                  <FaBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-xs text-white items-center justify-center font-bold border-2 border-slate-900">3</span>
                  </span>
                </button>
              )}

              {/* Perfil de Usuario o Botones de Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-500">
                      <FaUserCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-white font-semibold text-sm">{user?.name || 'Usuario'}</p>
                      <p className="text-blue-300/70 text-xs">Estudiante</p>
                    </div>
                    <svg className={`w-4 h-4 text-blue-300 group-hover:text-white transition-all duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Menú Desplegable de Usuario */}
                  <div className={`absolute right-0 top-full mt-3 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/50 transition-all duration-500 ${
                    isUserMenuOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-3'
                  }`}>
                    <div className="p-4">
                      {/* Header del usuario */}
                      <div className="flex items-center space-x-4 pb-4 border-b border-slate-700/50">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <FaUserCircle className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{user?.name || 'Usuario'}</h3>
                          <p className="text-blue-300/70 text-sm">Estudiante</p>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-green-400 text-xs font-semibold">En línea</span>
                          </div>
                        </div>
                      </div>

                      {/* Opciones del menú */}
                      <div className="py-3 space-y-1">
                        <Link
                          to="/profile"
                          className="w-full flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUserCircle className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300" />
                          Mi Perfil
                        </Link>
                        <Link
                          to="/settings"
                          className="w-full flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaCog className="mr-3 text-lg group-hover:rotate-90 transition-transform duration-500" />
                          Configuración
                        </Link>
                        <button className="w-full flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 group">
                          <FaBell className="mr-3 text-lg group-hover:animate-bounce" />
                          Notificaciones
                        </button>
                      </div>

                      <div className="h-px bg-slate-700/50 my-3"></div>

                      {/* Cerrar sesión */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-500/30"
                      >
                        <FaSignOutAlt className="mr-3 text-lg group-hover:translate-x-1 transition-transform duration-300" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login"
                    className="px-6 py-2.5 text-blue-200 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300 font-semibold"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/50 border border-blue-500/30"
                  >
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Menú Móvil */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden relative p-3 rounded-xl text-blue-200 hover:text-white hover:bg-slate-700/50 transition-all duration-300 hover:scale-110 border border-transparent hover:border-slate-600/50"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
                  <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Menú Móvil Flotante */}
      <div className={`lg:hidden fixed inset-x-4 top-24 z-40 transition-all duration-700 ease-out ${
        isMenuOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-8'
      }`}>
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="p-6 space-y-4">
            
            {/* User Info Mobile - Solo si está autenticado */}
            {isAuthenticated && (
              <div className="flex items-center px-5 py-4 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 mb-4 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <FaUserCircle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">{user?.name || 'Usuario'}</div>
                  <div className="text-blue-200/70 text-sm font-medium">Estudiante</div>
                </div>
              </div>
            )}

            {/* Navegación móvil */}
            {isAuthenticated ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleNavigation}
                      className={`w-full flex items-center px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-500 hover:scale-105 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                          : 'text-blue-200 hover:text-white hover:bg-slate-700/70'
                      }`}
                    >
                      <Icon className="mr-4 text-xl group-hover:scale-110 transition-transform duration-300" />
                      {item.label}
                      {isActive && <div className="ml-auto w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>}
                    </Link>
                  );
                })}
                
                <div className="h-px bg-slate-700/50 my-4"></div>
                
                {/* Acciones adicionales móvil */}
                <button className="w-full flex items-center px-6 py-4 text-blue-200 hover:text-white hover:bg-slate-700/70 rounded-2xl transition-all duration-300 group">
                  <FaSearch className="mr-4 text-xl group-hover:scale-110 transition-transform duration-300" />
                  Buscar
                </button>

                {/* Cerrar sesión móvil */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-6 py-4 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-2xl transition-all duration-500 border border-red-500/30 hover:border-red-400/50 group"
                >
                  <FaSignOutAlt className="mr-4 text-xl group-hover:translate-x-1 transition-transform duration-300" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleNavigation}
                  className="w-full flex items-center px-6 py-4 text-blue-200 hover:text-white hover:bg-slate-700/70 rounded-2xl transition-all duration-300 group font-semibold text-base"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavigation}
                  className="w-full flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-2xl transition-all duration-500 shadow-xl hover:scale-105 border border-blue-500/30 font-semibold text-base"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(isMenuOpen || isUserMenuOpen || isSearchOpen) && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-all duration-500"
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
            setIsSearchOpen(false);
          }}
        />
      )}

      {/* Espaciado correcto para el contenido */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;