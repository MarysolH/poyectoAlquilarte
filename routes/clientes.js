import express from 'express';
import {
  listarClientes,
  nuevoClienteGet,
  nuevoClientePost,
  editarClienteGet,
  editarClientePost,
  eliminarClienteGet,
  eliminarClientePost,
  listarInquilinos,
  listarPropietarios,
  listarPorApellido
} from '../controllers/clientesController.js';

const router = express.Router();

router.get('/', listarClientes);
router.get('/nuevo', nuevoClienteGet);
router.post('/nuevo', nuevoClientePost);
router.get('/:id/editar', editarClienteGet);
router.post('/:id/editar', editarClientePost);
router.get('/:id/eliminar', eliminarClienteGet);
router.post('/:id/eliminar', eliminarClientePost);
router.get('/inquilinos', listarInquilinos);
router.get('/propietarios', listarPropietarios);
router.get('/buscar', listarPorApellido);



export default router;