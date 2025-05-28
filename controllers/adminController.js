import { leerJSON } from '../utils/fileUtils.js';

const DB_PERSONAS = './data/personas.json';

export const adminPanel = async (req, res) => {
	const personas = await leerJSON(DB_PERSONAS);
	res.render('admin', { personas });
};
