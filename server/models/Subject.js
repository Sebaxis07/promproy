import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema para las evaluaciones (ponderaciones)
const EvaluationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la evaluación es requerido'],
    trim: true
  },
  weight: {
    type: Number,
    required: [true, 'La ponderación es requerida'],
    min: 0,
    max: 100
  }
});

// Esquema para las calificaciones
const GradeSchema = new Schema({
  evaluationName: {
    type: String,
    required: [true, 'El nombre de la evaluación es requerido'],
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'El valor de la calificación es requerido'],
    min: 1.0,
    max: 7.0
  },
  weight: {
    type: Number,
    required: [true, 'La ponderación es requerida'],
    min: 0,
    max: 100
  },
  note: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Esquema principal de asignatura
const SubjectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la asignatura es requerido'],
    trim: true
  },
  teacher: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  evaluations: [EvaluationSchema],
  grades: [GradeSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Subject', SubjectSchema);