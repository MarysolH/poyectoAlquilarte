import Cliente from '../models/Cliente.js';

// Listar todos los clientes
export const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();

    const total = clientes.length;
    const totalInquilinos = await Cliente.countDocuments({ tipo: /inquilino/i });
    const totalPropietarios = await Cliente.countDocuments({ tipo: /propietario/i });
    
    res.render('clientes/panel', {
      clientes,
      total,
      totalInquilinos,
      totalPropietarios,
      usuario: req.session?.usuario || null
    });
  } catch (error) {
    res.status(500).render('clientes/error', { mensaje: 'Error al obtener clientes' });
  }
};

// Mostrar formulario para agregar cliente
export const nuevoClienteGet = (req, res) => {
  res.render('clientes/nuevo');
};

// Procesar nuevo cliente
export const nuevoClientePost = async (req, res) => {
  const { nombre, apellido, mail, telefono, tipo } = req.body;

  try {
    const nuevo = new Cliente({ nombre, apellido, mail, telefono, tipo });
    await nuevo.save();
    res.redirect('/clientes');
  } catch (error) {
    res.status(500).render('clientes/error', { mensaje: 'Error al guardar cliente' });
  }
};

// Mostrar formulario para editar cliente
export const editarClienteGet = async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).render('clientes/error', { mensaje: 'Cliente no encontrado' });
    }
    res.render('clientes/editar', { cliente });
  } catch (error) {
    res.status(500).render('clientes/error', { mensaje: 'Error al buscar cliente' });
  }
};

// Procesar edición
export const editarClientePost = async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, mail, telefono, tipo } = req.body;

  try {
    const cliente = await Cliente.findByIdAndUpdate(id, {
      nombre, apellido, mail, telefono, tipo
    }, { new: true });

    if (!cliente) {
      return res.status(404).render('clientes/error', { mensaje: 'Cliente no encontrado para editar' });
    }

    res.redirect('/clientes');
  } catch (error) {
    res.status(500).render('clientes/error', { mensaje: 'Error al actualizar cliente' });
  }
};

// Confirmación de eliminación
export const eliminarClienteGet = async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).render('clientes/error', { mensaje: 'Cliente no encontrado para eliminar' });
    }
    res.render('clientes/confirmarEliminar', { cliente });
  } catch (error) {
    res.status(500).render('clientes/error', { mensaje: 'Error al buscar cliente' });
  }
};

// Procesar eliminación
export const eliminarClientePost = async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await Cliente.findByIdAndDelete(id);
    if (!cliente) {
      return res.status(404).render('clientes/error', { mensaje: 'Cliente no encontrado para eliminar' });
    }
    res.redirect('/clientes');
  } catch (error) {
    res.status(500).render('clientes/error', { mensaje: 'Error al eliminar cliente' });
  }
};

// Filtrar solo inquilinos
export const listarInquilinos = async (req, res) => {
  const clientes = await Cliente.find({ tipo: /inquilino/i });

  // Contadores globales para las cards
  const total = await Cliente.countDocuments();
  const totalInquilinos = await Cliente.countDocuments({ tipo: /inquilino/i });
  const totalPropietarios = await Cliente.countDocuments({ tipo: /propietario/i });

  res.render('clientes/panel', {
    clientes,
    total,
    totalInquilinos,
    totalPropietarios,
    usuario: req.session?.usuario || null
  });
};

// Filtrar solo propietarios
export const listarPropietarios = async (req, res) => {
  const clientes = await Cliente.find({ tipo: /propietario/i });

  // Contadores globales para las cards
  const total = await Cliente.countDocuments();
  const totalInquilinos = await Cliente.countDocuments({ tipo: /inquilino/i });
  const totalPropietarios = await Cliente.countDocuments({ tipo: /propietario/i });

  res.render('clientes/panel', {
    clientes,
    total,
    totalInquilinos,
    totalPropietarios,
    usuario: req.session?.usuario || null
  });
};

// Listar por apellido
export const listarPorApellido = async (req, res) => {
  try {
    const { apellido } = req.query;

    const clientes = await Cliente.find({
      apellido: { $regex: apellido, $options: 'i' } // búsqueda parcial y sin importar mayúsculas
    });

    const total = await Cliente.countDocuments();
    const totalInquilinos = await Cliente.countDocuments({ tipo: /inquilino/i });
    const totalPropietarios = await Cliente.countDocuments({ tipo: /propietario/i });

    res.render('clientes/panel', {
      clientes,
      total,
      totalInquilinos,
      totalPropietarios,
      usuario: req.session?.usuario || null
    });
  } catch (error) {
    res.status(500).render('clientes/error', { mensaje: 'Error al buscar clientes' });
  }
};