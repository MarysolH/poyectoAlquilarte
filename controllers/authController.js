import Usuarios from '../models/Usuarios.js';
import bcrypt from 'bcrypt';

export const loginGet = async (req, res) => {
  const cantidadAdmins = await Usuarios.countDocuments({nivelAcceso: /Admin/i});
  res.render('login', { mostrarRegistro: cantidadAdmins === 0 });
};

export const loginPost = async (req, res) => {
	const { usuario, contraseña } = req.body;

	const usuarioEncontrado = await Usuarios.findOne({usuario});

	if (usuarioEncontrado) {
		// Verifica la contraseña usando bcrypt
		const contraseñaCorrecta = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);

		if (contraseñaCorrecta) {
			req.session.usuario = {
				id: usuarioEncontrado.id,
				usuario: usuarioEncontrado.usuario,
				nivelAcceso: usuarioEncontrado.nivelAcceso
			};
			return res.redirect('/dashboard');
		} else {
			return res.render('autenticacion/error', {mensaje: 'Usuario y/o contraseña incorrecto. Vuelva a intentar'});
		}
	} else {
		return res.render('autenticacion/error', { mensaje: 'Usuario no encontrado.'});
	};
};

export const logout = (req, res) => {
  	req.session.destroy((err) => {
		if (err) {
			return res.status(500).send('Error al cerrar sesión');
		}
		res.redirect('/login');
	});
}

// Middleware para verificar la sesión
export const verificarSesion = (req, res, next) => {
	if (!req.session.usuario) {
		return res.redirect('/login');
	}
	next();
};