
import Persona from '../models/Persona.js';

// Mostrar lstado de personas
export const listaPersonas = async (req, res) => {
	try {
		const personas = await Persona.find();
		console.log('Personas encontradas:', personas);

		res.render('personas/lista', { personas });
	} catch (error) {
		console.error('Error al obtener personas:', error);
		res.status(500).render('personas/error', {mensaje: 'Error al obtener personas'});
	}
};


// Agregar una nueva persona
export const agregarPersona = async (req, res) => {
	const { nombre, apellido, mail, sector, rol } = req.body;
	
	try {
		const nueva = new Persona({ nombre, apellido, mail, sector, rol }); // SIN id
		await nueva.save();
		console.log('Persona guardada:', nueva);

		res.render('personas/exito', {
			mensaje: `Persona agregada correctamente con ID ${nueva.id}`, // opcional mostrarlo
		});
	} catch (error) {
		console.error('Error al agregar persona:', error)
		res.status(500).render('personas/error', {
			mensaje: 'Error al agregar persona',
		});
	}
};


// Muestra los detalles de una persona específica
export const detallePersona = async (req, res) => {
	const id = req.params.id;

	try {
		const persona = await Persona.findOne({ id: parseInt(id)});

		if (!persona) {
			return res.status(404).render('personas/error', { mensaje: 'No se encontró la persona' });
		}

		res.render('personas/persona', { persona });
	} catch (error) {
		res.status(500).render('personas/error', {mensaje: 'Error al buscar persona'});
	}
};


// Muestra formulario para editar datos de una persona
export const editarPersonaGet = async (req, res) => {
	const id = req.params.id;
	
	try {
		const persona = await Persona.findOne({ id: parseInt(id)});

		if (!persona) {
			return res.status(404).render('personas/error', {
				mensaje: 'No se encontró la persona para editar',
			});
		}

		res.render('personas/editar', { persona });
	} catch (error) {
		res.status(500).render('personas/error', {mensaje: 'Error al buscar persona'});
	}
};


// Guardar cambios de edición
export const editarPersonaPost = async (req, res) => {
	const id = req.params.id;
	const { nombre, apellido, mail, sector, rol } = req.body;

	try {
		const persona = await Persona.findOneAndUpdate(
			{ id: parseInt(id) },
			{ nombre, apellido, mail, sector, rol },
			{ new: true }
		);

		if (!persona) {
			return res.status(404).render('personas/error', {
				mensaje: 'No se encontró la persona para editar',
			});
		}

		res.render('personas/exito', { mensaje: 'Persona actualizada correctamente'});
	} catch (error) {
		res.status(500).render('personas/error', {mensaje: 'Error al actualizar persona'});
	}
};


//Confirmación para eliminar una persona
export const eliminarPersonaGet = async (req, res) => {
	const id = req.params.id;

	try {
		const persona = await Persona.findOne({ id: parseInt(id)});

		if (!persona) {
			return res.status(404).render('error', { mensaje: 'No se encontró la persona a eliminar' });
		}

		res.render('personas/confirmarEliminar', { persona });
	} catch (error) {
		res.status(500).render('personas/error', {mensaje: 'Error al actualizar persona'});
	}
};


// Eliminar persona
export const eliminarPersonaPost = async (req, res) => {
	const id = req.params.id;

	try {
		const persona = await Persona.findOneAndDelete({ id: parseInt(id)});
		
		if (!persona) {
		return res.status(404).render('personas/error', { mensaje: 'No se encontró la persona a eliminar'});
		} 
		res.render('personas/exito', { mensaje: 'Persona eliminada correctamente' });
	} catch (error) {
			res.status(500).render('personas/error', {mensaje: 'Error al eliminar persona'});
	}
};
