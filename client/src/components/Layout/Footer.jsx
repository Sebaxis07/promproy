import React from 'react';
import { FaGraduationCap, FaGithub, FaLinkedin, FaHeart, FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-800/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
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
            <p className="text-blue-200/60 text-sm text-center md:text-left">
              Simplificando el cálculo de promedios para estudiantes chilenos
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/about" className="text-blue-200/80 hover:text-white transition-colors duration-200 text-sm">
                Acerca de
              </Link>
              <Link to="/contact" className="text-blue-200/80 hover:text-white transition-colors duration-200 text-sm">
                Contacto
              </Link>
              <Link to="/terms" className="text-blue-200/80 hover:text-white transition-colors duration-200 text-sm">
                Términos
              </Link>
              <Link to="/privacy" className="text-blue-200/80 hover:text-white transition-colors duration-200 text-sm">
                Privacidad
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold text-white mb-4">Síguenos</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/50 transition-all duration-300">
                  <FaGithub className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors duration-300" />
                </div>
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/50 transition-all duration-300">
                  <FaLinkedin className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors duration-300" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200/60 text-sm">
              &copy; {currentYear} CalcuNotas. Todos los derechos reservados.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-blue-200/60 text-sm">Desarrollado con</span>
              <FaHeart className="h-4 w-4 mx-2 text-red-400" />
              <span className="text-blue-200/60 text-sm">y</span>
              <FaCode className="h-4 w-4 mx-2 text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;