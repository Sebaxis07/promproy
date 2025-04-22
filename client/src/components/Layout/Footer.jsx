import React from 'react';
import { FaGraduationCap, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <FaGraduationCap className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">CalcuNotas</span>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-400">
              &copy; {currentYear} CalcuNotas - Sistema de Cálculo de Promedios Chilenos
            </p>
            <p className="text-center md:text-right text-xs text-gray-500 mt-1">
              Desarrollado con React, MongoDB y ❤️
            </p>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-700 pt-4">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaGithub className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
          
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Acerca de</a>
            <a href="#" className="hover:text-white">Contacto</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;