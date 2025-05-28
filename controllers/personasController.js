import { leerJSON, escribirJSON } from '../utils/fileUtils.js';
import Persona from '../models/Persona.js';

const DB_PERSONAS = './data/personas.json';

//Función asincrónica para leer los datos del archivo JSON.(Personas)
const leerDatos = async () => {
	return await leerJSON(DB_PERSONAS);
};
// Función asincrónica para escribir datos en el archivo JSON.
const escribirDatos = async data => {
	await escribirJSON(DB_PERSONAS, data);
};

// Muestra el listado de personas y un formulario
// para agregar nuevas personas.
export const listaPersonas = async (req, res) => {
	const personas = await leerDatos();
	res.render('personas/lista', { personas });
};

// Agregar una nueva persona
export const agregarPersona = async (req, res) => {
	const { id, nombre, apellido, mail, sector, rol } = req.body;
	const personas = await leerDatos();
	const existe = personas.find(p => p.id === parseInt(id));

	if (existe) {
		return res.status(400).render('personas/error', {
			mensaje: 'Ya existe una persona con ese ID',
		});
	}

	const nueva = new Persona(parseInt(id), nombre, apellido, mail, sector, rol);
	personas.push(nueva);
	await escribirDatos(personas);
	res.render('personas/exito', { mensaje: 'Persona agregada correctamente' });
};

// Muestra los detalles de una persona específica
export const detallePersona = async (req, res) => {
	const personas = await leerDatos();

	const id = parseInt(req.params.id);
	const persona = personas.find(p => p.id === id);

	if (!persona) {
		return res
			.status(404)
			.render('personas/error', { mensaje: 'No se encontró la persona' });
	}

	res.render('personas/persona', { persona });
};

// Muestra formulario para editar datos de una persona
export const editarPersonaGet = async (req, res) => {
	const personas = await leerDatos();
	const id = parseInt(req.params.id);
	const persona = personas.find(p => p.id === id);

	if (!persona) {
		return res.status(404).render('personas/error', {
			mensaje: 'No se encontró la persona para editar',
		});
	}

	res.render('personas/editar', { persona });
};

// Recibe los datos de un formulario y guarda la actualización
// de datos de una  persona registrada en el archivo JSON.
export const editarPersonaPost = async (req, res) => {
	const personas = await leerDatos();
	const id = parseInt(req.params.id);
	const index = personas.findIndex(p => p.id === id);

	if (index === -1) {
		return res.status(404).render('personas/error', {
			mensaje: 'No se encontró la persona para editar',
		});
	}

	const { nombre, apellido, mail, sector, rol } = req.body;
	personas[index] = { ...personas[index], nombre, apellido, mail, sector, rol };
	await escribirDatos(personas);
	res.render('personas/exito', {
		mensaje: 'Persona actualizada correctamente',
	});
};

// Muestra formulario de confirmación para eliminar una persona
export const eliminarPersonaGet = async (req, res) => {
	const personas = await leerDatos();
	const id = parseInt(req.params.id);
	const persona = personas.find(p => p.id === id);

	if (!persona) {
		return res
			.status(404)
			.render('error', { mensaje: 'No se encontró la persona a eliminar' });
	}

	res.render('personas/confirmarEliminar', { persona });
};

// Procesa la eliminación de una persona del archivo JSON
export const eliminarPersonaPost = async (req, res) => {
	let personas = await leerDatos();
	const id = parseInt(req.params.id);
	const existe = personas.find(p => p.id === id);

	if (!existe) {
		return res.status(404).render('personas/error', {
			mensaje: 'No se encontró la persona a eliminar',
		});
	}

	personas = personas.filter(p => p.id !== id);
	await escribirDatos(personas);
	res.render('personas/exito', { mensaje: 'Persona eliminada correctamente' });
};
