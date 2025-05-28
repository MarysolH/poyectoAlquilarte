import express from 'express';
import { loginGet, loginPost } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', loginGet);
router.post('/login', loginPost);

export default router;
