import Persona from '../models/Persona.js';
import Cliente from '../models/Cliente.js';
import Propiedad from '../models/Propiedad.js';

export const reporteDashboard = async (req, res) => {
  try {
    // Total clientes
    const totalClientes = await Cliente.countDocuments();

    // Total inquilinos
    const totalInquilinos = await Cliente.countDocuments({ tipo: 'inquilino' });

    // Total propietarios
    const totalPropietarios = await Cliente.countDocuments({
      tipo: 'propietario',
    });

    // Personas
    const totalEmpleados = await Persona.countDocuments();
    const empleadosPorRol = await Persona.aggregate([
      { $group: { _id: '$rol', total: { $sum: 1 } } },
    ]);
    const ultimosEmpleados = await Persona.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Últimos clientes
    const ultimosClientes = await Cliente.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Propiedades
    const totalPropiedades = await Propiedad.countDocuments();

    const propiedadesPorEstado = await Propiedad.aggregate([
      { $group: { _id: '$estado', total: { $sum: 1 } } },
    ]);

    const propiedadesPorTipo = await Propiedad.aggregate([
      { $group: { _id: '$tipo', total: { $sum: 1 } } },
    ]);

    const propiedadesPorRangoPrecio = await Propiedad.aggregate([
      {
        $bucket: {
          groupBy: '$precio',
          boundaries: [0, 50000, 100000, 200000, 500000, 1000000, 10000000],
          default: 'Más de 10M',
          output: { total: { $sum: 1 } },
        },
      },
    ]);

    // Monto promedio de propiedades
    const promedioPrecioAgg = await Propiedad.aggregate([
      { $group: { _id: null, promedio: { $avg: '$precio' } } },
    ]);
    const promedioPrecio = promedioPrecioAgg[0]?.promedio || 0;

    // Totales de propiedades alquiladas y reservadas
    const totalAlquiladas = await Propiedad.countDocuments({
      estado: 'alquilada',
    });
    const totalReservadas = await Propiedad.countDocuments({
      estado: 'reservada',
    });

    const montoAlquileresMensualesAgg = await Propiedad.aggregate([
      { $match: { estado: 'alquilada' } },
      { $group: { _id: null, total: { $sum: '$precio' } } },
    ]);

    const totalAlquileresMensuales = montoAlquileresMensualesAgg[0]?.total || 0;

    res.render('reportes/dashboard', {
      usuario: req.usuario || null,

      // Clientes
      totalClientes,
      totalInquilinos,
      totalPropietarios,
      ultimosClientes,

      // Personas
      totalEmpleados,
      empleadosPorRol,
      ultimosEmpleados,

      // Propiedades
      totalPropiedades,
      propiedadesPorEstado,
      propiedadesPorTipo,
      propiedadesPorRangoPrecio,
      promedioPrecio,
      totalAlquiladas,
      totalReservadas,
      totalAlquileresMensuales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el reporte');
  }
};
