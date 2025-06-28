import express from 'express';
import authRoutes from './routes/auth.js';
import personasRoutes from './routes/personas.js';
import tareasRoutes from './routes/tareas.js';
import { getUsuarioActual } from './controllers/authController.js';
import { adminPanel } from './controllers/adminController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRoutes from './routes/dashboard.js';
import clientesRoutes from './routes/clientes.js';
import session from 'express-session';
import propiedadesRoutes from './routes/propiedades.js';
import pingRoutes from './routes/index.js';


const app = express();

// Necesario para rutas absolutas en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para procesar los datos que llegan en formularios HTML
app.use(express.urlencoded({ extended: true }));

// Middleware para procesar datos JSON en las peticiones HTTP.
app.use(express.json());

//Para usar archivos desde la carpeta public (estilos css)
app.use(express.static('public'));


// Para dashboard
app.use('/dashboard', dashboardRoutes);

//Para clientes
app.use('/clientes', clientesRoutes);

//Para propiedades
app.use('/propiedades', propiedadesRoutes);

// Middleware para que usuario esté disponible en todas las vistas
/*app.use((req, res, next) => {
	res.locals.usuario = getUsuarioActual();
	next();
});*/
//Para usar mientras no hay autenticacion
app.use((req, res, next) => {
  // Usuario falso para desarrollo:
  res.locals.usuario = {
    nivelAcceso: 'Admin',
    usuario: 'devUser'
  };
  next();
});

// Configuramos Pug como el motor de plantillas
// para renderizar las vistas en el servidor
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas principales
app.use('/', authRoutes);
app.use('/personas', personasRoutes);
app.use('/tareas', tareasRoutes);
app.get('/admin', adminPanel);

// Ruta principal: redirige al dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/admin', (req, res) => {
  res.redirect('/personas');
});

app.use(session({
  secret: 'clave-secreta',
  resave: false,
  saveUninitialized: false
}));

app.use('/', pingRoutes);

export default app;
