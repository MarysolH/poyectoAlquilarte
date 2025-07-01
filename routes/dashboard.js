import express from 'express';
import { mostrarDashboard } from '../controllers/dashboardController.js';
import { verificarSesion } from '../controllers/authController.js';

const router = express.Router();

// Ruta protegida
router.get('/', verificarSesion, mostrarDashboard);

export default router;