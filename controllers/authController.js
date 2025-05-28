import { leerJSON } from '../utils/fileUtils.js';

const DB_USUARIOS = './data/usuarios.json';

//Variable para almacenar el usuario
let usuarioActual = null;

export const getUsuarioActual = () => usuarioActual;

export const loginGet = (req, res) => {
	res.render('login');
};

export const loginPost = async (req, res) => {
	const { usuario, contraseña } = req.body;
	const usuarios = await leerJSON(DB_USUARIOS);

	const usuarioEncontrado = usuarios.find(
		u => u.usuario === usuario && u.contraseña === contraseña
	);

	if (usuarioEncontrado) {
		usuarioActual = usuarioEncontrado;
		return res.redirect('/');
	}

	res.render('autenticacion/error', {
		mensaje: 'Usuario y/o contraseña incorrecto. Vuelva a intentar',
	});
};

export const logout = (req, res) => {
	usuarioActual = null;

	res.redirect('login');
}