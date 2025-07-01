import Contrato from '../models/Contrato.js';
import Cliente from '../models/Cliente.js';
import Propiedad from '../models/Propiedad.js';

// 1) Mostrar formulario para nuevo contrato
export const formNuevoContrato = async (req, res) => {
  try {
    const propiedades  = await Propiedad.find();
    const propietarios = await Cliente.find({ tipo: 'propietario' });
    const inquilinos    = await Cliente.find({ tipo: 'inquilino' });
    res.render('contratos/nuevo', { 
        propiedades, 
        propietarios, 
        inquilinos 
    });
  } catch (error) {
    console.error('Error al cargar formulario de contrato:', error);
    res.status(500).send('Error interno al cargar formulario');
  }
};

// 2) Guardar contrato
export const crearContrato = async (req, res) => {
  try {
    console.log('POST /contratos/nuevo →', req.body);
    const { propiedad, propietario, inquilino, fecha_inicio, fecha_fin, precio, estado, observaciones } = req.body;
    await Contrato.create({ 
        propiedad, 
        propietario, 
        inquilino, 
        fecha_inicio, 
        fecha_fin, 
        precio, 
        estado, 
        observaciones });

       // Si el contrato está activo, actualizamos la propiedad
    if (estado === 'activo') {
      await Propiedad.findByIdAndUpdate(propiedad, { estado: 'alquilada' });
      console.log(`Propiedad ${propiedad} marcada como alquilada`);
    } 
    res.redirect('/contratos');
    
  } catch (error) {
    console.error('Error al crear contrato:', error);
    res.status(500).send('Error interno al guardar contrato');
  }
};

// 3) Listar todos los contratos (panel)
export const listarContratos = async (req, res) => {
  try {
    const contratos = await Contrato.find()
      .populate('propiedad')
      .populate('propietario')
      .populate('inquilino');

    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin30Dias = new Date(hoy);
    fin30Dias.setDate(hoy.getDate() + 30);

    const contratosActivos = contratos.filter(c => c.estado === 'activo').length;
    const proximosAVencer = contratos.filter(c =>
      c.estado === 'activo' &&
      c.fecha_fin >= hoy &&
      c.fecha_fin <= fin30Dias
    ).length;

    const ingresosMes = contratos
      .filter(c =>
        c.fecha_inicio >= inicioMes &&
        c.fecha_inicio <= hoy
      )
      .reduce((sum, c) => sum + Number(c.precio), 0);

    const filtro = req.query.filtro;
    let contratosFiltrados = contratos;

    if (filtro === 'activos') {
      contratosFiltrados = contratos.filter(c => c.estado === 'activo');
    } else if (filtro === 'proximos') {
      contratosFiltrados = contratos.filter(c =>
        c.estado === 'activo' &&
        c.fecha_fin >= hoy &&
        c.fecha_fin <= fin30Dias
      );
    } 

    res.render('contratos/panel', { 
      contratos: contratosFiltrados,
      contratosActivos,
      proximosAVencer,
      ingresosMes
    });
  } catch (error) {
    console.error('Error al listar contratos:', error);
    res.status(500).send('Error al listar contratos');
  }
};

// 4) Ver detalle de un contrato
export const verContrato = async (req, res) => {
  try {
    const contrato = await Contrato.findById(req.params.id)
      .populate('propiedad')
      .populate('propietario')
      .populate('inquilino');
    if (!contrato) return res.status(404).render('error', { mensaje: 'Contrato no encontrado' });
    res.render('contratos/detalle', { contrato });
  } catch (error) {
    console.error('Error al cargar detalle de contrato:', error);
    res.status(500).send('Error al cargar detalle');
  }
};

// 5) Mostrar formulario de edición
export const formEditarContrato = async (req, res) => {
  try {
    const contrato    = await Contrato.findById(req.params.id);
    if (!contrato) return res.status(404).render('error', { mensaje: 'Contrato no encontrado' });

    const propiedades  = await Propiedad.find();
    const propietarios = await Cliente.find({ tipo: 'propietario' });
    const inquilinos    = await Cliente.find({ tipo: 'inquilino' });

    res.render('contratos/editar', { contrato, propiedades, propietarios, inquilinos });
  } catch (error) {
    console.error('Error al cargar edición de contrato:', error);
    res.status(500).send('Error interno al cargar edición');
  }
};

// 6) Procesar edición
export const editarContrato = async (req, res) => {
  try {
    const { propiedad, propietario, inquilino, fecha_inicio, fecha_fin, precio, estado, observaciones } = req.body;
    await Contrato.findByIdAndUpdate(
      req.params.id,
      { 
        propiedad, 
        propietario, 
        inquilino, 
        fecha_inicio, 
        fecha_fin, 
        precio, 
        estado, 
        observaciones },
        
      { runValidators: true }
    );
    res.redirect('/contratos');
  } catch (error) {
    console.error('Error al guardar edición de contrato:', error);
    res.status(500).send('Error interno al guardar edición');
  }
};

// 7) Cancelar contrato (marcar como 'cancelado')
export const cancelarContrato = async (req, res) => {
  try {
    await Contrato.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelado' },
      { runValidators: true }
    );
    res.redirect('/contratos');
  } catch (error) {
    console.error('Error al cancelar contrato:', error);
    res.status(500).send('Error al cancelar el contrato');
  }
};