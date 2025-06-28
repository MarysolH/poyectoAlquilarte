import express from 'express';
const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).json({ ok: true, mensaje: 'pong' });
});

export default router;