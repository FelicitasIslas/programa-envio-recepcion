const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  tipoModulo: {
    type: String,
    required: true,
    trim: true
  },
  latitud: {
    type: Number,
    required: true
  },
  longitud: {
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    default: ''
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registro', registroSchema);