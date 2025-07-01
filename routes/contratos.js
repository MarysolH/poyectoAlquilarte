import express from 'express';
import { 
    listarContratos,
    formNuevoContrato,
    crearContrato,
    verContrato,
    formEditarContrato,
    editarContrato,
    cancelarContrato
} from '../controllers/contratosController.js';

import Propiedad from '../models/Propiedad.js';

const router = express.Router();

//Ruta para autocompletar los datos de la propiedad
router.get('/datos/:idPropiedad', async (req, res) => {
  try {
    const propiedad = await Propiedad
      .findById(req.params.idPropiedad)
      .populate('propietario');

    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    res.json({
      propietario: propiedad.propietario 
        ? `${propiedad.propietario.nombre} ${propiedad.propietario.apellido}` 
        : '',
        propietarioId: propiedad.propietario ? propiedad.propietario._id : '',
      precio: propiedad.precio
    });

  } catch (error) {
    console.error('Error al obtener datos de propiedad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get('/datos/:idPropiedad', /* … */);

router.get('/', listarContratos);

router.get('/nuevo', formNuevoContrato);
router.post('/nuevo', crearContrato);

router.get('/:id/editar', formEditarContrato);
router.post('/:id/editar', editarContrato);

router.post('/:id/cancelar', cancelarContrato);

router.get('/:id', verContrato);



export default router;