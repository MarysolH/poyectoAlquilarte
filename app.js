import express from 'express';
import authRoutes from './routes/auth.js';
import personasRoutes from './routes/personas.js';
import tareasRoutes from './routes/tareas.js';
import { adminPanel } from './controllers/adminController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRoutes from './routes/dashboard.js';
import clientesRoutes from './routes/clientes.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import propiedadesRoutes from './routes/propiedades.js';
import pingRoutes from './routes/index.js';
import reportesRoutes from './routes/reportes.js';
import contratosRoutes from './routes/contratos.js';
import { verificarSesion } from './controllers/authController.js';
import registroRoutes from './routes/registro.js';


const app = express();

// Necesario para rutas absolutas en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para procesar los datos que llegan en formularios HTML
app.use(express.urlencoded({ extended: true }));

// Middleware para procesar datos JSON en las peticiones HTTP.
app.use(express.json());

// Middleware para cookies
app.use(cookieParser());

//Para usar archivos desde la carpeta public (estilos css)
app.use(express.static('public'));
app.use(session({
  secret: 'clave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 hora (milisegundos)
  }
}));

// Middleware para que usuario esté disponible en todas las vistas
app.use((req, res, next) => {
	res.locals.usuario = req.session.usuario || null;
	next();
});

// Para autenticación
app.use(authRoutes);

// Para registro de usuarios
app.use('/registro', registroRoutes);


app.use(verificarSesion);

// Para dashboard
app.use('/dashboard', dashboardRoutes);

//Para clientes
app.use('/clientes', clientesRoutes);

//Para propiedades
app.use('/propiedades', propiedadesRoutes);

//Para reportería
app.use('/reportes', reportesRoutes);

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

// Ruta para contratos
app.use('/contratos', contratosRoutes);


app.use('/', pingRoutes);

export default app;
