import { readFile, writeFile } from 'fs/promises';

export const leerJSON = async ruta => {
	try {
		const data = await readFile(ruta, 'utf-8');
		return JSON.parse(data);
	} catch {
		return [];
	}
};

export const escribirJSON = async (ruta, data) => {
	await writeFile(ruta, JSON.stringify(data, null, 2));
};
