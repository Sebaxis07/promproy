// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Azul
        secondary: '#10B981',  // Verde
        warning: '#F59E0B',    // Amarillo
        danger: '#EF4444',     // Rojo
        success: '#10B981',    // Verde
        info: '#3B82F6',       // Azul
        dark: '#1F2937',       // Gris oscuro
        'grade-passing': '#10B981',  // Verde (nota aprobatoria)
        'grade-failing': '#EF4444',  // Rojo (nota reprobatoria)
      },
    },
  },
  plugins: [],
}