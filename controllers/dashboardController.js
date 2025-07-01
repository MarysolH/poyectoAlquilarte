import Propiedad from '../models/Propiedad.js';
import Cliente from '../models/Cliente.js';
import Persona from '../models/Persona.js';

export const mostrarDashboard = async (req, res) => {
  try {
    const total = await Propiedad.countDocuments();
    const totalAlquiladas = await Propiedad.countDocuments({ estado: 'alquilada' });
    const totalReservadas = await Propiedad.countDocuments({ estado: 'reservada' });

    const ultimasPropiedades = await Propiedad.find().sort({ _id: -1 }).limit(3);
    const ultimosClientes = await Cliente.find().sort({ _id: -1 }).limit(3);
    const ultimasPersonas = await Persona.find().sort({ _id: -1 }).limit(3);

    const tareasSimuladas = [
        { descripcion: 'Revisión de contrato de alquiler', responsable: 'Martín Gómez', prioridad: 'Alta', fecha: '2025-06-28' },
        { descripcion: 'Actualizar estado de propiedad 103', responsable: 'Lucía Pérez', prioridad: 'Media', fecha: '2025-06-27' },
        { descripcion: 'Enviar recordatorio de pago', responsable: 'Carlos Díaz', prioridad: 'Alta', fecha: '2025-06-26' },
        { descripcion: 'Llamar a propietario por renovación', responsable: 'Ana Torres', prioridad: 'Baja', fecha: '2025-06-25' },
      ];
    res.render('dashboard', {
      total,
      totalAlquiladas,
      totalReservadas,
      ultimasPropiedades,
      ultimosClientes,
      ultimasPersonas,
      tareasSimuladas
    });
  } catch (error) {
    console.error('Error al cargar el dashboard:', error);
    res.status(500).send('Error al mostrar el dashboard');
  }
};
      