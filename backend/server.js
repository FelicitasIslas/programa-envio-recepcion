import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import registrosRoutes from './routes/registros.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://statuesque-llama-321f54.netlify.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    mensaje: 'API funcionando correctamente'
  });
});

app.use('/api/registros', registrosRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error.message);
  });