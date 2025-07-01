import express from 'express';
import {
    //registrarUsuario,
    listarUsuarios,
    nuevoUsuarioGet,
    nuevoUsuarioPost,
    editarUsuarioGet,
    editarUsuarioPost,
    eliminarUsuarioGet,
    eliminarUsuarioPost,
    listarAdministradores,
    listarEmpleados
} from '../controllers/usuariosController.js';
import { verificarSesion } from '../controllers/authController.js';

const router = express.Router();


router.get('/', verificarSesion, listarUsuarios);
router.get('/nuevo', nuevoUsuarioGet);
router.post('/nuevo', nuevoUsuarioPost);
router.get('/:id/editar', verificarSesion, editarUsuarioGet);
router.post('/:id/editar', verificarSesion, editarUsuarioPost);
router.get('/:id/eliminar', verificarSesion, eliminarUsuarioGet);
router.post('/:id/eliminar', verificarSesion, eliminarUsuarioPost);
router.get('/administradores', verificarSesion, listarAdministradores);
router.get('/empleados', verificarSesion, listarEmpleados);

export default router;