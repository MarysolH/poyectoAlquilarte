import { leerJSON, escribirJSON } from '../utils/fileUtils.js';

const DB_TAREAS = './data/tareas.json';
const DB_PERSONAS = './data/personas.json';

// Función asincrónica para leer tareas desde un archivo JSON (Tareas)
const leerTareas = async () => {
	return await leerJSON(DB_TAREAS);
};
// Función asincrónica para escribir tareas en un archivo JSON
const escribirTareas = async data => {
	await escribirJSON(DB_TAREAS, data);
};
const leerPersonas = async () => {
	return await leerJSON(DB_PERSONAS);
};

// Muestra el listado de tareas, con opción de filtar por área
export const listaTareas = async (req, res) => {
	const { estado, prioridad, desde, hasta } = req.query;
	const tareas = await leerTareas();
	const personas = await leerPersonas();

	let tareasFiltradas = tareas;

	if (estado) {
		tareasFiltradas = tareasFiltradas.filter(t => t.estado === estado);
	}

	if (prioridad) {
		tareasFiltradas = tareasFiltradas.filter(t => t.prioridad === prioridad);
	}

	if (desde) {
		tareasFiltradas = tareasFiltradas.filter(
			t => t.fechaVencimiento && t.fechaVencimiento >= desde
		);
	}

	if (hasta) {
		tareasFiltradas = tareasFiltradas.filter(
			t => t.fechaVencimiento && t.fechaVencimiento <= hasta
		);
	}
	res.render('tareas/listado', { tareas: tareasFiltradas, personas });
};

// Muestra formulario para crear una nueva tarea
export const nuevaTareaGet = async (req, res) => {
	const personas = await leerPersonas();
	res.render('tareas/agregar', { personas, tarea: {} });
};

// Procesa la creación de una nueva tarea
export const nuevaTareaPost = async (req, res) => {
	const tareas = await leerTareas();
	const {
		titulo,
		descripcion,
		area,
		asignado,
		prioridad,
		fechaInicio,
		fechaVencimiento,
	} = req.body;

	// Genera un ID nuevo usando el ID más alto existente (Ver si: Puede usarse en persona tambien?)
	const nuevoId =
		tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1;

	const nuevaTarea = {
		id: nuevoId,
		titulo,
		descripcion,
		area,
		asignado: asignado ? parseInt(asignado) : null,
		estado: 'pendiente', // Por ejemplo: estado inicial
		prioridad,
		fechaInicio,
		fechaVencimiento,
	};

	tareas.push(nuevaTarea);
	await escribirTareas(tareas);

	res.redirect('/tareas');
};

// Muestra detalles de una tarea específica
export const detalleTarea = async (req, res) => {
	const tareas = await leerTareas();
	const personas = await leerPersonas();
	const id = parseInt(req.params.id);
	const tarea = tareas.find(t => t.id === id);

	if (!tarea) {
		return res
			.status(404)
			.render('tareas/error', { mensaje: 'Tarea no encontrada' });
	}

	res.render('tareas/ver', { tarea, personas });
};

// Muestra formulario para editar una tarea
export const editarTareaGet = async (req, res) => {
	const tareas = await leerTareas();
	const personas = await leerPersonas();
	const id = parseInt(req.params.id);
	const tarea = tareas.find(t => t.id === id);

	if (!tarea) {
		return res
			.status(404)
			.render('tareas/error', { mensaje: 'Tarea no encontrada para editar' });
	}

	res.render('tareas/editar', { tarea, personas });
};

// Procesa la edición de tarea
export const editarTareaPost = async (req, res) => {
	const tareas = await leerTareas();
	const id = parseInt(req.params.id);
	const index = tareas.findIndex(t => t.id === id);

	if (index === -1) {
		return res
			.status(404)
			.render('tareas/error', { mensaje: 'Tarea no encontrada para editar' });
	}

	const {
		titulo,
		descripcion,
		area,
		asignado,
		estado,
		prioridad,
		fechaInicio,
		fechaVencimiento,
	} = req.body;
	tareas[index] = {
		...tareas[index],
		titulo,
		descripcion,
		area,
		asignado: asignado ? parseInt(asignado) : null,
		estado,
		prioridad,
		fechaInicio,
		fechaVencimiento,
	};

	await escribirTareas(tareas);
	res.redirect('/tareas');
};

// Muestra formulario de confirmación para eliminar una tarea
export const eliminarTareaGet = async (req, res) => {
	const tareas = await leerTareas();
	const id = parseInt(req.params.id);
	const tarea = tareas.find(t => t.id === id);

	if (!tarea) {
		return res
			.status(404)
			.render('tareas/error', { mensaje: 'Tarea no encontrada para eliminar' });
	}

	res.render('tareas/confirmarEliminar', { tarea });
};

// Procesa la eliminación de una tarea
export const eliminarTareaPost = async (req, res) => {
	let tareas = await leerTareas();
	const id = parseInt(req.params.id);
	const existe = tareas.find(t => t.id === id);

	if (!existe) {
		return res
			.status(404)
			.render('tareas/error', { mensaje: 'Tarea no encontrada para eliminar' });
	}

	tareas = tareas.filter(t => t.id !== id);
	await escribirTareas(tareas);
	res.redirect('/tareas');
};
