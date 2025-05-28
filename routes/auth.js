import express from 'express';
import { loginGet, loginPost, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', loginGet);
router.post('/login', loginPost);
router.get('/logout', logout);

export default router;
