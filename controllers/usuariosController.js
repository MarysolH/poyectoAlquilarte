import bcrypt from 'bcrypt';
import Usuarios from '../models/Usuarios.js';

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
    try {
        // Obtener todos los usuarios
        const usuarios = await Usuarios.find();  

        const totalUsuarios = usuarios.length;
        const totalAdmins = await Usuarios.countDocuments({ nivelAcceso: /Admin/i });
        const totalEmpleados = await Usuarios.countDocuments({ nivelAcceso: /Empleado/i });

        // Pasar los usuarios a la vista
        res.render('registro/usuarios', {
            usuarios,
            totalUsuarios,
            totalAdmins,
            totalEmpleados,
            usuario: req.session?.usuario || null
        });
    } catch (error) {
        res.status(500).render('registro/error', { mensaje: 'Error al obtener usuarios.' });
    }
};

export const nuevoUsuarioGet = async (req, res) => {
    const cantidadEmpleados = await Usuarios.countDocuments({nivelAcceso: 'Admin'});

    // Si no hay empleados, mostrar vista para crear usuario
    if (cantidadEmpleados === 0) {
        return res.render('registro/nuevo');
    }

    // Si ya hay empleados, solo permitir acceso a empleados logueados
    if (!req.session.usuario || req.session.usuario.nivelAcceso !== 'Admin') {
        return res.status(403).render('autenticacion/error', { mensaje: 'Acceso denegado. Solo los administradores pueden crear usuarios.' });
    }

    res.render('registro/nuevo');
};

// Procesar nuevo usuario
export const nuevoUsuarioPost = async (req, res) => {
    const { usuario, contraseña, nivelAcceso } = req.body;

    // Validaciones básicas
    if (!usuario || !contraseña || !nivelAcceso) {
        return res.render('registro/error', {
        mensaje: 'Todos los campos son obligatorios.'
        });
    }

    if (contraseña.length < 6) {
        return res.render('registro/error', {
        mensaje: 'La contraseña debe tener al menos 6 caracteres.'
        });
    }

    try {
        // Verificar si ya existe el usuario
        const existeUsuario = await Usuarios.findOne({ usuario });
        if (existeUsuario) {
            return res.render('registro/error', {
                mensaje: `El nombre de usuario "${usuario}" ya está en uso.`
            });
        }

        // Hashear la contraseña antes de guardar
        const saltRound = 10;
        const contraseñaHasheada = await bcrypt.hash(contraseña, saltRound);

        // Crear y guardar el nuevo usuario
        const nuevoUsuario = new Usuarios({
            usuario,
            contraseña: contraseñaHasheada,
            nivelAcceso
        });

        await nuevoUsuario.save();

        // Redirigir según contexto
        const existeAdmin = await Usuarios.exists({nivelAcceso: /Admin/i});
        if (existeAdmin === 1) {
            // Es el primer usuario, lo mandamos a login
            return res.redirect('/login');
        } else {
            // Usuario creado desde el panel de administración
            return res.redirect('/registro');
        }
    } catch (error) {
        res.status(500).render('registro/error', {
            mensaje: 'Error al guardar el usuario. Intente nuevamente.'
        });
    }
};

// Mostrar formulario para editar usuario
export const editarUsuarioGet = async (req, res) => {
  const id = req.params.id;
  try {
    const usuario = await Usuarios.findById(id);
    if (!usuario) {
      return res.status(404).render('registro/error', {mensaje: 'Usuario no encontrado'});
    }
    res.render('registro/editar', {usuario});
  } catch (error) {
    res.status(500).render('registro/error', {mensaje: 'Error al buscar usuario'});
  }
};

// Procesar edición
export const editarUsuarioPost = async (req, res) => {
  const id = req.params.id;
  const {contraseña, nivelAcceso} = req.body;

  try {
    const usuario = await Usuarios.findById(id);
    if (!usuario) {
      return res.status(404).render('registro/error', { mensaje: 'Usuario no encontrado' });
    }

    // Solo actualizamos la contraseña si se ingresó una nueva
    if (contraseña && contraseña.length >= 6) {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      usuario.contraseña = hashedPassword;
    } else if (contraseña && contraseña.length > 0 && contraseña.length < 6) {
      return res.status(400).render('registro/error', { mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Siempre actualizamos el nivel de acceso
    usuario.nivelAcceso = nivelAcceso;

    await usuario.save();

    res.redirect('/registro');
  } catch (error) {
    res.status(500).render('registro/error', {mensaje: 'Error al actualizar usuario'});
  }
};

// Confirmación de eliminación
export const eliminarUsuarioGet = async (req, res) => {
  const id = req.params.id;
  try {
    const usuario = await Usuarios.findById(id);
    if (!usuario) {
      return res.status(404).render('registro/error', {mensaje: 'Usuario no encontrado para eliminar'});
    }
    res.render('registro/confirmarEliminar', {usuario});
  } catch (error) {
    res.status(500).render('registro/error', {mensaje: 'Error al buscar usuario'});
  }
};

// Procesar eliminación
export const eliminarUsuarioPost = async (req, res) => {
  const id = req.params.id;
  try {
    const usuario = await Usuarios.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).render('registro/error', {mensaje: 'Usuario no encontrado para eliminar'});
    }
    res.redirect('/registro');
  } catch (error) {
    res.status(500).render('registro/error', {mensaje: 'Error al eliminar usuario'});
  }
};

// Filtrar solo administradores
export const listarAdministradores = async (req, res) => {
  const usuarios = await Usuarios.find({ nivelAcceso: /Admin/i });

  // Contadores globales para las cards
  const totalUsuarios = await Usuarios.countDocuments();
  const totalAdmins = await Usuarios.countDocuments({ nivelAcceso: /Admin/i });
  const totalEmpleados = await Usuarios.countDocuments({ nivelAcceso: /Empleado/i });

  res.render('registro/usuarios', {
    usuarios,
    totalUsuarios,
    totalAdmins,
    totalEmpleados,
    usuario: req.session?.usuario || null
  });
};

// Filtrar solo empleados
export const listarEmpleados = async (req, res) => {
  const usuarios = await Usuarios.find({ nivelAcceso: /Empleado/i });

  // Contadores globales para las cards
  const totalUsuarios = await Usuarios.countDocuments();
  const totalAdmins = await Usuarios.countDocuments({ nivelAcceso: /Admin/i });
  const totalEmpleados = await Usuarios.countDocuments({ nivelAcceso: /Empleado/i });

  res.render('registro/usuarios', {
    usuarios,
    totalUsuarios,
    totalAdmins,
    totalEmpleados,
    usuario: req.session?.usuario || null
  });
};