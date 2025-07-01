import { Router } from 'express';
import { reporteDashboard } from '../controllers/reportesController.js';

const router = Router();

router.get('/', reporteDashboard);

export default router;
