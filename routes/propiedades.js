import express from 'express';
import {
  listarPropiedades,
  nuevaPropiedadGet,
  nuevaPropiedadPost,
  editarPropiedadGet,
  editarPropiedadPost,
  eliminarPropiedadGet,
  eliminarPropiedadPost,
  detallePropiedad
} from '../controllers/propiedadesController.js';

const router = express.Router();


router.get('/', listarPropiedades); 
router.get('/nueva', nuevaPropiedadGet); 
router.post('/nueva', nuevaPropiedadPost); 

router.get('/:id', detallePropiedad);

router.get('/:id/editar', editarPropiedadGet); 
router.post('/:id/editar', editarPropiedadPost); 

router.get('/:id/eliminar', eliminarPropiedadGet); 
router.post('/:id/eliminar', eliminarPropiedadPost); 

export default router;
