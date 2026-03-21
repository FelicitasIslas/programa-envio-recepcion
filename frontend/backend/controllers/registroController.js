const Registro = require('../models/Registro');

const crearRegistro = async (req, res) => {
  try {
    const { nombre, descripcion, latitud, longitud, tipoModulo } = req.body;

    if (!nombre || !descripcion || !latitud || !longitud || !tipoModulo) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios'
      });
    }

    const nuevoRegistro = new Registro({
      nombre,
      descripcion,
      tipoModulo,
      latitud: Number(latitud),
      longitud: Number(longitud),
      imagen: req.file ? req.file.filename : ''
    });

    await nuevoRegistro.save();

    res.status(201).json({
      mensaje: 'Registro guardado correctamente',
      data: nuevoRegistro
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al guardar el registro',
      error: error.message
    });
  }
};

const obtenerRegistros = async (req, res) => {
  try {
    const registros = await Registro.find().sort({ fecha: -1 });
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener registros',
      error: error.message
    });
  }
};

module.exports = {
  crearRegistro,
  obtenerRegistros
};