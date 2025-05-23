import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaUser, 
  FaLock, 
  FaBell, 
  FaEye, 
  FaPalette, 
  FaTrash, 
  FaSave, 
  FaCamera, 
  FaEdit,
  FaCheck,
  FaTimes,
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
  FaCog,
  FaStar,
  FaRocket
} from 'react-icons/fa';

const ProfileSettings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [scrollY, setScrollY] = useState(0);
  
  // Estados para diferentes secciones
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Estados para información personal
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || 'María González',
    email: user?.email || 'maria.gonzalez@email.com',
    phone: '+56 9 1234 5678',
    birthDate: '1998-03-15',
    location: 'Santiago, Chile',
    bio: 'Estudiante de Ingeniería en Sistemas, apasionada por la tecnología y el aprendizaje continuo.',
    avatar: null
  });

  // Estados para configuración de seguridad
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginNotifications: true
  });

  // Estados para notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    gradeAlerts: true,
    assignmentReminders: true,
    weeklyReports: false,
    promotionalEmails: false,
    pushNotifications: true
  });

  // Estados para preferencias de aplicación
  const [appPreferences, setAppPreferences] = useState({
    theme: 'dark',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    autoSave: true,
    compactView: false
  });

  // Estados para privacidad
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'friends',
    showEmail: false,
    showPhone: false,
    dataSharing: false,
    analytics: true
  });

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Guardando configuraciones...', {
      personalInfo,
      securitySettings,
      notificationSettings,
      appPreferences,
      privacySettings
    });
    
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const sidebarItems = [
    { id: 'personal', label: 'Información Personal', icon: FaUser, color: 'from-blue-500 to-cyan-500' },
    { id: 'security', label: 'Seguridad', icon: FaLock, color: 'from-green-500 to-emerald-500' },
    { id: 'notifications', label: 'Notificaciones', icon: FaBell, color: 'from-purple-500 to-pink-500' },
    { id: 'preferences', label: 'Preferencias', icon: FaPalette, color: 'from-orange-500 to-red-500' },
    { id: 'privacy', label: 'Privacidad', icon: FaShieldAlt, color: 'from-indigo-500 to-purple-500' },
    { id: 'danger', label: 'Zona Peligrosa', icon: FaTrash, color: 'from-red-500 to-red-600' }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      {/* Header de la sección */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Información Personal
          </h2>
          <p className="text-blue-300/80 text-lg">Gestiona tu información personal y perfil público</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`group flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
            isEditing 
              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 shadow-lg shadow-red-500/20' 
              : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 shadow-lg shadow-blue-500/20'
          }`}
        >
          {isEditing ? <FaTimes className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> : <FaEdit className="mr-2 group-hover:scale-110 transition-transform duration-300" />}
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {/* Avatar y info básica */}
      <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-center space-x-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl border border-blue-400/30 group-hover:shadow-blue-500/50 transition-all duration-500">
              <FaUser className="h-16 w-16 text-white drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-3xl"></div>
            </div>
            {isEditing && (
              <button className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-xl border border-blue-400/50">
                <FaCamera className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">{personalInfo.name}</h3>
            <p className="text-blue-300 text-lg mb-3">{personalInfo.email}</p>
            <div className="flex items-center space-x-6 text-blue-200/70">
              <span className="flex items-center bg-blue-600/20 px-3 py-1 rounded-xl">
                <FaMapMarkerAlt className="mr-2" />
                {personalInfo.location}
              </span>
              <span className="flex items-center bg-green-600/20 px-3 py-1 rounded-xl">
                <FaCalendar className="mr-2" />
                Miembro desde 2024
              </span>
              <span className="flex items-center bg-yellow-600/20 px-3 py-1 rounded-xl">
                <FaStar className="mr-2" />
                Premium
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de información */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {[
            { label: 'Nombre Completo', key: 'name', type: 'text', icon: FaUser },
            { label: 'Email', key: 'email', type: 'email', icon: FaEnvelope },
            { label: 'Teléfono', key: 'phone', type: 'tel', icon: FaPhone }
          ].map((field) => (
            <div key={field.key} className="group">
              <label className="block text-sm font-semibold text-blue-300 mb-3 flex items-center">
                <field.icon className="mr-2" />
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  value={personalInfo[field.key]}
                  onChange={(e) => handlePersonalInfoChange(field.key, e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-blue-300/50 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 hover:bg-white/10"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 via-blue-500/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm font-semibold text-blue-300 mb-3 flex items-center">
              <FaCalendar className="mr-2" />
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={personalInfo.birthDate}
              onChange={(e) => handlePersonalInfoChange('birthDate', e.target.value)}
              disabled={!isEditing}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-blue-300/50 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 hover:bg-white/10"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-blue-300 mb-3 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Ubicación
            </label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              disabled={!isEditing}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-blue-300/50 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 hover:bg-white/10"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-blue-300 mb-3 flex items-center">
              <FaEdit className="mr-2" />
              Biografía
            </label>
            <textarea
              rows="4"
              value={personalInfo.bio}
              onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
              disabled={!isEditing}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-blue-300/50 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 resize-none hover:bg-white/10"
              placeholder="Cuéntanos algo sobre ti..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
          Seguridad
        </h2>
        <p className="text-blue-300/80 text-lg">Mantén tu cuenta segura con estas configuraciones</p>
      </div>

      {/* Cambio de contraseña */}
      <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.01] shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="relative text-xl font-semibold text-white mb-6 flex items-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl mr-4 shadow-xl">
            <FaLock className="h-6 w-6 text-white" />
          </div>
          Cambiar Contraseña
        </h3>
        
        <div className="relative grid lg:grid-cols-3 gap-6">
          {[
            { label: 'Contraseña Actual', key: 'currentPassword', placeholder: 'Contraseña actual' },
            { label: 'Nueva Contraseña', key: 'newPassword', placeholder: 'Nueva contraseña' },
            { label: 'Confirmar Contraseña', key: 'confirmPassword', placeholder: 'Confirmar contraseña' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-blue-300 mb-3">{field.label}</label>
              <input
                type="password"
                value={securitySettings[field.key]}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-blue-300/50 focus:border-green-500/50 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-500 hover:bg-white/10"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
        
        <button className="relative mt-6 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl transition-all duration-500 font-semibold transform hover:scale-105 shadow-xl hover:shadow-green-500/50">
          <span className="flex items-center">
            <FaShieldAlt className="mr-2" />
            Actualizar Contraseña
          </span>
        </button>
      </div>

      {/* Autenticación de dos factores */}
      <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.01] shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="relative text-xl font-semibold text-white mb-6 flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl mr-4 shadow-xl">
            <FaShieldAlt className="h-6 w-6 text-white" />
          </div>
          Autenticación de Dos Factores
        </h3>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-blue-200 mb-2 text-lg font-medium">Agregar una capa adicional de seguridad a tu cuenta</p>
            <p className="text-blue-300/60">Requiere un código de tu teléfono para iniciar sesión</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-6">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorAuth}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 shadow-xl"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
          Notificaciones
        </h2>
        <p className="text-blue-300/80 text-lg">Controla qué notificaciones recibes y cómo las recibes</p>
      </div>

      <div className="grid gap-6">
        {[
          { key: 'emailNotifications', label: 'Notificaciones por Email', desc: 'Recibe notificaciones importantes por email', icon: FaEnvelope, color: 'from-blue-500 to-cyan-500' },
          { key: 'gradeAlerts', label: 'Alertas de Calificaciones', desc: 'Notificaciones cuando se publiquen nuevas calificaciones', icon: FaStar, color: 'from-yellow-500 to-orange-500' },
          { key: 'assignmentReminders', label: 'Recordatorios de Tareas', desc: 'Recordatorios antes de las fechas de entrega', icon: FaCalendar, color: 'from-green-500 to-emerald-500' },
          { key: 'weeklyReports', label: 'Reportes Semanales', desc: 'Resumen semanal de tu progreso académico', icon: FaBell, color: 'from-purple-500 to-pink-500' },
          { key: 'promotionalEmails', label: 'Emails Promocionales', desc: 'Ofertas y noticias sobre nuevas funciones', icon: FaRocket, color: 'from-indigo-500 to-purple-500' },
          { key: 'pushNotifications', label: 'Notificaciones Push', desc: 'Notificaciones en tiempo real en tu dispositivo', icon: FaBell, color: 'from-red-500 to-pink-500' }
        ].map((item) => (
          <div key={item.key} className="group relative bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] shadow-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className={`bg-gradient-to-r ${item.color} p-3 rounded-2xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{item.label}</h3>
                  <p className="text-blue-300/70">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-6">
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key]}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 shadow-lg"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-orange-100 to-red-200 bg-clip-text text-transparent">
          Preferencias de Aplicación
        </h2>
        <p className="text-blue-300/80 text-lg">Personaliza la experiencia de la aplicación</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h3 className="relative text-xl font-semibold text-white mb-6 flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl mr-4 shadow-xl">
              <FaPalette className="h-6 w-6 text-white" />
            </div>
            Apariencia
          </h3>
          
          <div className="relative space-y-6">
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-3">Tema</label>
              <select
                value={appPreferences.theme}
                onChange={(e) => setAppPreferences(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 hover:bg-white/10"
              >
                <option value="dark" className="bg-gray-800">Oscuro</option>
                <option value="light" className="bg-gray-800">Claro</option>
                <option value="auto" className="bg-gray-800">Automático</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div>
                <p className="text-white font-semibold text-lg">Vista Compacta</p>
                <p className="text-blue-300/70">Reduce el espaciado entre elementos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appPreferences.compactView}
                  onChange={(e) => setAppPreferences(prev => ({ ...prev, compactView: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-600 peer-checked:to-red-600 shadow-lg"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h3 className="relative text-xl font-semibold text-white mb-6 flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl mr-4 shadow-xl">
              <FaGlobe className="h-6 w-6 text-white" />
            </div>
            Localización
          </h3>
          
          <div className="relative space-y-6">
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-3">Idioma</label>
              <select
                value={appPreferences.language}
                onChange={(e) => setAppPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:border-green-500/50 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-500 hover:bg-white/10"
              >
                <option value="es" className="bg-gray-800">Español</option>
                <option value="en" className="bg-gray-800">English</option>
                <option value="pt" className="bg-gray-800">Português</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-3">Formato de Fecha</label>
              <select
                value={appPreferences.dateFormat}
                onChange={(e) => setAppPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:border-green-500/50 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-500 hover:bg-white/10"
              >
                <option value="DD/MM/YYYY" className="bg-gray-800">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY" className="bg-gray-800">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD" className="bg-gray-800">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
          Privacidad
        </h2>
        <p className="text-blue-300/80 text-lg">Controla la visibilidad de tu información y datos</p>
      </div>

      <div className="space-y-6">
        <div className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.01] shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h3 className="relative text-xl font-semibold text-white mb-6">Visibilidad del Perfil</h3>
          <div className="relative space-y-4">
            {[
              { value: 'public', label: 'Público', desc: 'Cualquiera puede ver tu perfil' },
              { value: 'friends', label: 'Solo Amigos', desc: 'Solo tus contactos pueden ver tu perfil' },
              { value: 'private', label: 'Privado', desc: 'Solo tú puedes ver tu perfil' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-4 cursor-pointer bg-white/5 backdrop-blur-xl rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option.value}
                  checked={privacySettings.profileVisibility === option.value}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                  className="w-5 h-5 text-blue-600 bg-white/10 border-gray-500 focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <p className="text-white font-semibold text-lg">{option.label}</p>
                  <p className="text-blue-300/70">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {[
          { key: 'showEmail', label: 'Mostrar Email', desc: 'Permite que otros vean tu dirección de email', icon: FaEnvelope, color: 'from-blue-500 to-cyan-500' },
          { key: 'showPhone', label: 'Mostrar Teléfono', desc: 'Permite que otros vean tu número de teléfono', icon: FaPhone, color: 'from-green-500 to-emerald-500' },
          { key: 'dataSharing', label: 'Compartir Datos', desc: 'Compartir datos anónimos para mejorar la aplicación', icon: FaCog, color: 'from-purple-500 to-pink-500' },
          { key: 'analytics', label: 'Analytics', desc: 'Permitir recolección de datos de uso', icon: FaRocket, color: 'from-orange-500 to-red-500' }
        ].map((item) => (
          <div key={item.key} className="group relative bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.01] shadow-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className={`bg-gradient-to-r ${item.color} p-3 rounded-2xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{item.label}</h3>
                  <p className="text-blue-300/70">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-6">
                <input
                  type="checkbox"
                  checked={privacySettings[item.key]}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-600 shadow-lg"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-red-400 mb-3 bg-gradient-to-r from-red-400 via-red-300 to-red-200 bg-clip-text text-transparent">
          Zona Peligrosa
        </h2>
        <p className="text-blue-300/80 text-lg">Acciones irreversibles que afectan tu cuenta</p>
      </div>

      <div className="group relative bg-red-900/10 backdrop-blur-2xl rounded-3xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all duration-500 hover:transform hover:scale-[1.01] shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-600/5 to-red-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="relative text-xl font-semibold text-red-400 mb-6 flex items-center">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-2xl mr-4 shadow-xl">
            <FaTrash className="h-6 w-6 text-white" />
          </div>
          Eliminar Cuenta
        </h3>
        <p className="relative text-blue-300/80 mb-6 text-lg">
          Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de estar completamente seguro.
        </p>
        <div className="relative flex items-center space-x-6">
          <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-semibold transition-all duration-500 border border-red-500/50 hover:scale-105 shadow-xl hover:shadow-red-500/50">
            Eliminar mi cuenta
          </button>
          <p className="text-red-400/70">Esta acción no se puede deshacer</p>
        </div>
      </div>

      <div className="group relative bg-yellow-900/10 backdrop-blur-2xl rounded-3xl p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500 hover:transform hover:scale-[1.01] shadow-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="relative text-xl font-semibold text-yellow-400 mb-4 flex items-center">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl mr-4 shadow-xl">
            <FaSave className="h-6 w-6 text-white" />
          </div>
          Exportar Datos
        </h3>
        <p className="relative text-blue-300/80 mb-6 text-lg">
          Descarga una copia de todos tus datos antes de eliminar tu cuenta.
        </p>
        <button className="relative px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-2xl font-semibold transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-yellow-500/50">
          Descargar mis datos
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfo();
      case 'security': return renderSecurity();
      case 'notifications': return renderNotifications();
      case 'preferences': return renderPreferences();
      case 'privacy': return renderPrivacy();
      case 'danger': return renderDangerZone();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Animated Background - Igual que Home */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        {/* Floating Particles - Igual que Home */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="fixed top-28 right-8 z-50 bg-green-600/90 backdrop-blur-2xl text-white px-8 py-6 rounded-3xl border border-green-500/50 shadow-2xl animate-pulse">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-xl mr-4">
              <FaCheck className="text-lg" />
            </div>
            <div>
              <p className="font-semibold">¡Configuración guardada!</p>
              <p className="text-green-200 text-sm">Todos los cambios se han aplicado exitosamente</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Premium */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-blue-600/20 rounded-full border border-blue-500/30 backdrop-blur-sm mb-8">
              <FaCog className="mr-3 text-blue-400" />
              <span className="text-blue-200 font-medium">Panel de Configuración</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                Configuración
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                de Perfil
              </span>
            </h1>
            
            <p className="text-xl text-blue-200/80 max-w-2xl mx-auto leading-relaxed">
              Personaliza tu experiencia en CalcuNotas con configuraciones avanzadas y 
              controles de privacidad profesionales
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Premium */}
            <div className="w-96 flex-shrink-0">
              <div className="sticky top-32">
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="p-8">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <FaCog className="mr-3 text-blue-400" />
                      Configuraciones
                    </h2>
                    <nav className="space-y-3">
                      {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`group w-full flex items-center px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-500 transform hover:scale-105 ${
                              isActive 
                                ? `bg-gradient-to-r ${item.color} text-white shadow-xl` 
                                : 'text-blue-300/80 hover:text-white hover:bg-white/10'
                            } ${item.id === 'danger' ? 'border-t border-gray-600/30 mt-6 pt-8' : ''}`}
                          >
                            <div className={`${isActive ? 'bg-white/20' : `bg-gradient-to-r ${item.color}`} p-2 rounded-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <span className={item.id === 'danger' && !isActive ? 'text-red-400' : ''}>{item.label}</span>
                            {isActive && (
                              <div className="ml-auto w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido principal Premium */}
            <div className="flex-1">
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-12 shadow-2xl">
                {renderContent()}
                
                {/* Botones de acción Premium */}
                {activeSection !== 'danger' && (
                  <div className="flex justify-end space-x-6 mt-12 pt-8 border-t border-white/10">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                      }}
                      className="px-8 py-4 text-blue-300 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-500 font-semibold hover:scale-105"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-semibold transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-blue-500/50"
                    >
                      <FaSave className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements - Igual que Home */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce delay-500"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-pink-400/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-bounce delay-1500"></div>
    </div>
  );
};

export default ProfileSettings;