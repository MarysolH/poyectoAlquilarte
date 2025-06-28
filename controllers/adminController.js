import Persona from '../models/Persona.js';

export const adminPanel = async (req, res) => {
	try {
		const personas = await Persona.find();
		res.render('personas/admin', { personas }); 
	} catch (error) {
		console.error('Error al obtener personas:', error);
		res.status(500).render('personas/error', { mensaje: 'Error al obtener personas' });
	}
};