// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/error.js';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import gradeRoutes from './routes/grades.js';  // Añadir esta importación

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);  // Añadir esta ruta

// Middleware de manejo de errores (DESPUÉS de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Manejar rechazos de promesas no capturadas
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Cerrar el servidor
  server.close(() => process.exit(1));
});