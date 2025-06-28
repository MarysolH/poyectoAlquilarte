import express from 'express';
import { mostrarDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', mostrarDashboard);

export default router;