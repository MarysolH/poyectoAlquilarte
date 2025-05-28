import express from 'express';
import {
	listaPersonas,
	agregarPersona,
	detallePersona,
	editarPersonaGet,
	editarPersonaPost,
	eliminarPersonaGet,
	eliminarPersonaPost,
	adminPanel,
} from '../controllers/personasController.js';

const router = express.Router();

router.get('/', listaPersonas);
router.post('/', agregarPersona);

router.get('/:id', detallePersona);
router.get('/:id/editar', editarPersonaGet);
router.post('/:id/editar', editarPersonaPost);
router.get('/:id/eliminar', eliminarPersonaGet);
router.post('/:id/eliminar', eliminarPersonaPost);

export default router;
