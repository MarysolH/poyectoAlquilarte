import Propiedad from '../models/Propiedad.js';
import Cliente from '../models/Cliente.js'; // ver si lo agregamos

// Listar todas las propiedades
export const listarPropiedades = async (req, res) => {
  try {
    const filtro = req.query.filtro;

    let propiedades;

    if (filtro === 'alquiladas') {
      propiedades = await Propiedad.find({ estado: 'alquilada' }).populate('propietario');
    } else if (filtro === 'reservadas') {
      propiedades = await Propiedad.find({ estado: 'reservada' }).populate('propietario');
    } else {
      propiedades = await Propiedad.find().populate('propietario');
    }

    const total = await Propiedad.countDocuments();
    const totalAlquiladas = await Propiedad.countDocuments({ estado: 'alquilada' });
    const totalReservadas = await Propiedad.countDocuments({ estado: 'reservada' });

    res.render('propiedades/panel', {
      propiedades,
      total,
      totalAlquiladas,
      totalReservadas,
      filtro
    });
    
  } catch (error) {
    console.error('Error al listar propiedades:', error);
    res.status(500).render('propiedades/error', { mensaje: 'Error al listar propiedades' });
  }
};

// Mostrar formulario para nueva propiedad
export const nuevaPropiedadGet = async (req, res) => {
  try {
    const clientes = await Cliente.find({ tipo: 'propietario' });
    
    res.render('propiedades/nueva', { clientes });
  } catch (error) {
    console.error('Error al cargar formulario de nueva propiedad:', error);
    res.status(500).render('propiedades/error', { mensaje: 'Error al cargar formulario' });
  }
};

// Procesar creación de nueva propiedad
export const nuevaPropiedadPost = async (req, res) => {
  const { direccion, tipo, estado, precio, descripcion, propietario } = req.body;
  try {
    const nueva = new Propiedad({ direccion, tipo, estado, precio, descripcion, propietario });
    await nueva.save();
    res.redirect('/propiedades');
  } catch (error) {
    console.error('Error al crear propiedad:', error);
    res.status(500).render('propiedades/error', { mensaje: 'Error al crear propiedad' });
  }
};

// Detalle de una propiedad
export const detallePropiedad = async (req, res) => {
  const { id } = req.params;
  try {
    const propiedad = await Propiedad.findById(id).populate('propietario');
    if (!propiedad) return res.status(404).render('propiedades/error', { mensaje: 'Propiedad no encontrada' });
    res.render('propiedades/detalle', { propiedad });
  } catch (error) {
    res.status(500).send('Error al cargar detalle de propiedad');
  }
};

// Mostrar formulario de edición
export const editarPropiedadGet = async (req, res) => {
  const { id } = req.params;
  try {
    const propiedad = await Propiedad.findById(id);
    const propietarios = await Cliente.find({ tipo: 'propietario' });
    
    if (!propiedad) return res.status(404).render('propiedades/error', { mensaje: 'Propiedad no encontrada' });
    res.render('propiedades/editar', { propiedad, propietarios });
  } catch (error) {
    res.status(500).render('propiedades/error', { mensaje: 'Error al cargar la edición' });
  }
};

// Procesar edición
export const editarPropiedadPost = async (req, res) => {
  const { id } = req.params;
  const { direccion, tipo, estado, precio, descripcion, propietario } = req.body;
  try {
    const propiedad = await Propiedad.findByIdAndUpdate(id, {
      direccion, tipo, estado, precio, descripcion, propietario 
    }, { new: true });

    if (!propiedad) return res.status(404).render('propiedades/error', { mensaje: 'Propiedad no encontrada' });
    res.redirect('/propiedades');
  } catch (error) {
    console.error('Error al editar propiedad:', error);
    res.status(500).render('propiedades/error', { mensaje: 'Error al editar propiedad' });
  }
};

// Confirmación para eliminar
export const eliminarPropiedadGet = async (req, res) => {
  const { id } = req.params;
  try {
    const propiedad = await Propiedad.findById(id);
    if (!propiedad) return res.status(404).render('propiedades/error', { mensaje: 'Propiedad no encontrada' });
    res.render('propiedades/eliminar', { propiedad });
  } catch (error) {
    res.status(500).render('propiedades/error', { mensaje: 'Error al cargar eliminación' });
  }
};

// Procesar eliminación
export const eliminarPropiedadPost = async (req, res) => {
  const { id } = req.params;
  try {
    const propiedad = await Propiedad.findByIdAndDelete(id);
    if (!propiedad) return res.status(404).render('propiedades/error', { mensaje: 'Propiedad no encontrada' });
    res.redirect('/propiedades');
  } catch (error) {
    res.status(500).render('propiedades/error', { mensaje: 'Error al eliminar propiedad' });
  }
};

// Listar propiedades alquiladas
export const listarPropiedadesAlquiladas = async (req, res) => {
  try {
    const propiedades = await Propiedad.find({ estado: 'alquilada' }).populate('propietario');
    const totalAlquiladas = propiedades.length;

    res.render('propiedades/panel', {
      propiedades,
      total: totalAlquiladas,
      totalAlquiladas,
      totalReservadas: 0 // o pasar lo que corresponda
    });
  } catch (error) {
    console.error('Error al listar propiedades alquiladas:', error);
    res.status(500).render('propiedades/error', { mensaje: 'Error al listar propiedades alquiladas' });
  }
};

// Listar propiedades reservadas
export const listarPropiedadesReservadas = async (req, res) => {
  try {
    const propiedades = await Propiedad.find({ estado: 'reservada' }).populate('propietario');
    const totalReservadas = propiedades.length;

    res.render('propiedades/panel', {
      propiedades,
      total: totalReservadas,
      totalAlquiladas: 0,
      totalReservadas
    });
  } catch (error) {
    console.error('Error al listar propiedades reservadas:', error);
    res.status(500).render('propiedades/error', { mensaje: 'Error al listar propiedades reservadas' });
  }
};