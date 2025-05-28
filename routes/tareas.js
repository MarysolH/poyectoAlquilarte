import express from 'express';
import {
	listaTareas,
	nuevaTareaGet,
	nuevaTareaPost,
	detalleTarea,
	editarTareaGet,
	editarTareaPost,
	eliminarTareaGet,
	eliminarTareaPost,
} from '../controllers/tareasController.js';

const router = express.Router();

router.get('/', listaTareas);
router.get('/nueva', nuevaTareaGet);
router.post('/', nuevaTareaPost);

router.get('/:id', detalleTarea);
router.get('/:id/editar', editarTareaGet);
router.post('/:id/editar', editarTareaPost);
router.get('/:id/eliminar', eliminarTareaGet);
router.post('/:id/eliminar', eliminarTareaPost);

export default router;
