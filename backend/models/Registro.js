import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: 3,
      maxlength: 60,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    latitud: {
      type: Number,
      required: [true, 'La latitud es obligatoria'],
    },
    longitud: {
      type: Number,
      required: [true, 'La longitud es obligatoria'],
    },
    imagenBase64: {
      type: String,
      default: '',
    },
    estadoRed: {
      type: String,
      default: 'desconocido',
    },
    origen: {
      type: String,
      default: 'web-movil',
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Registro', registroSchema);