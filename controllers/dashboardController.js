export const mostrarDashboard = (req, res) => {
  res.render('dashboard', {
    usuario: { nombre: 'Administrador' } // por ahora simulado
  });
};