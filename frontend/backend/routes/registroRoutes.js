const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  crearRegistro,
  obtenerRegistros
} = require('../controllers/registroController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.single('imagen'), crearRegistro);
router.get('/', obtenerRegistros);

module.exports = router;