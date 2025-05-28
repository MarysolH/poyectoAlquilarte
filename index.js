import express from 'express';
import authRoutes from './routes/auth.js';
import personasRoutes from './routes/personas.js';
import tareasRoutes from './routes/tareas.js';
import { getUsuarioActual } from './controllers/authController.js';
import { adminPanel } from './controllers/adminController.js';

const app = express();
const PORT = 3000;

// Middleware para procesar los datos que llegan en formularios HTML
app.use(express.urlencoded({ extended: true }));

// Middleware para procesar datos JSON en las peticiones HTTP.
app.use(express.json());

//Para usar archivos desde la carpeta public (estilos css)
app.use(express.static('public'));

// Middleware para que usuario esté disponible en todas las vistas
app.use((req, res, next) => {
	res.locals.usuario = getUsuarioActual();
	next();
});

// Configuramos Pug como el motor de plantillas
// para renderizar las vistas en el servidor
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas principales
app.use('/', authRoutes);
app.use('/cuenta', personasRoutes);
app.use('/tareas', tareasRoutes);

// Ruta raíz que redirige a la página principal
app.get('/', (req, res) => {
	if (!getUsuarioActual()) {
		return res.redirect('/login');
	}
	res.render('index');
});

app.get('/admin', adminPanel);

// Iniciamos el servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
