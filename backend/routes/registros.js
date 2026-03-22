import express from 'express';
import Registro from '../models/Registro.js';

const router = express.Router();

// Crear registro
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, latitud, longitud, imagenBase64, estadoRed, origen } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Nombre y descripción son obligatorios',
      });
    }

    if (latitud === undefined || longitud === undefined) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La ubicación es obligatoria',
      });
    }

    const nuevoRegistro = new Registro({
      nombre,
      descripcion,
      latitud,
      longitud,
      imagenBase64: imagenBase64 || '',
      estadoRed: estadoRed || 'desconocido',
      origen: origen || 'web-movil',
    });

    const guardado = await nuevoRegistro.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Registro guardado correctamente',
      data: guardado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al guardar el registro',
      error: error.message,
    });
  }
});

// Obtener todos
router.get('/', async (_req, res) => {
  try {
    const registros = await Registro.find().sort({ createdAt: -1 });

    res.json({
      ok: true,
      total: registros.length,
      data: registros,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar registros',
      error: error.message,
    });
  }
});

// Obtener uno por id
router.get('/:id', async (req, res) => {
  try {
    const registro = await Registro.findById(req.params.id);

    if (!registro) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Registro no encontrado',
      });
    }

    res.json({
      ok: true,
      data: registro,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar el registro',
      error: error.message,
    });
  }
});

export default router;