/**
Archivo principal del servidor de la aplicación "Alquilarte".
Este archivo configura y lanza un servidor Express que permite:
- Mostrar una lista de personas registradas.
- Agregar nuevas personas mediante un formulario.
- Ver el detalle de cada persona por su ID.
Utiliza archivos JSON como base de datos, el motor de vistas Pug y estructura modular.
 */

// Importamos express para crear el servidor web
import express from 'express';

// Importamos estas funciones que nos permiten leer y escribir 
// datos en archivos JSON de manera asincrónica.
import { readFile, writeFile } from 'fs/promises';

// Importamos la clase Persona desde un archivo separado.
import Persona from './models/Persona.js';

// Creamos una instancia de la aplicación 
// Express que manejará las peticiones.
const app = express();
const PORT = 3000;

//Variable para almacenar el usuario
let usuarioActual = null;

// Definimos las rutas de los archivo JSON que usaremos como "base de datos".
const DB_PERSONAS = './data/personas.json';
const DB_TAREAS = './data/tareas.json';
const DB_USUARIOS = './data/usuarios.json';

// Middleware para procesar los datos que llegan en formularios HTML 
app.use(express.urlencoded({ extended: true }));

// Middleware para procesar datos JSON en las peticiones HTTP.
app.use(express.json());

//Para usar archivos desde la carpeta public (estilos css)
app.use(express.static('public'));

// Middleware para que usuario esté disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.usuario = usuarioActual;
  next();
});

// Configuramos Pug como el motor de plantillas 
// para renderizar las vistas en el servidor
app.set('view engine', 'pug');
app.set('views', './views');


//Función asincrónica para leer los datos del archivo JSON.(Usuarios)
const leerUsuarios = async () => {
    try {
        const data = await readFile(DB_USUARIOS, 'utf-8');
        return JSON.parse(data);
    } catch {
        return[];
    }
};

//Función asincrónica para leer los datos del archivo JSON.(Personas)
const leerDatos = async () => {
    try {
        const data = await readFile(DB_PERSONAS, 'utf-8');
        return JSON.parse(data);
    } catch {
        return[];
    }
};
// Función asincrónica para escribir datos en el archivo JSON.
const escribirDatos = async (data) => {
    await writeFile(DB_PERSONAS, JSON.stringify(data, null, 2));
};


// Función asincrónica para leer tareas desde un archivo JSON (Tareas)
const leerTareas = async () => {
    try {
        const data = await readFile(DB_TAREAS, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};
// Función asincrónica para escribir tareas en un archivo JSON
const escribirTareas = async (data) => {
    await writeFile(DB_TAREAS, JSON.stringify(data, null, 2));
};

//Ruta al inicio de sesion
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { usuario, contraseña } = req.body;
    const usuarios = await leerUsuarios();

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña);

    if (usuarioEncontrado) {
        usuarioActual = usuarioEncontrado;
        return res.redirect('/');
    }
    
    res.render('autenticacion/error', { mensaje: 'Usuario y/o contraseña incorrecto. Vuelva a intentar' });
});

// Ruta raíz que redirige a la página principal
app.get('/', (req, res) => {
    if (!usuarioActual) {
        return res.redirect('/login');
    }

    res.render('index');
});

// Rutas relacionadas con la gestión personas

// Muestra el listado de personas y un formulario 
// para agregar nuevas personas.
app.get('/cuenta', async (req, res) => {
    const personas = await leerDatos();
    res.render('personas/lista', { personas });
});

// Agregar una nueva persona
app.post('/cuenta', async (req, res) => {
    const { id, nombre, apellido, mail, sector, rol } = req.body;
    const personas = await leerDatos();
    const existe = personas.find(p => p.id === parseInt(id));

    if (existe) {
        return res.status(400).render('personas/error', { mensaje: 'Ya existe una persona con ese ID' });
    }

    const nueva = new Persona(parseInt(id), nombre, apellido, mail, sector, rol);
    personas.push(nueva);
    await escribirDatos(personas);
    res.render('personas/exito', { mensaje: 'Persona agregada correctamente' });
});

// Muestra los detalles de una persona específica 
app.get('/cuenta/:id', async (req, res) => {
    const personas = await leerDatos();

    const id = parseInt(req.params.id);
    const persona = personas.find(p => p.id === id);

    if (!persona) {
        return res.status(404).render('personas/error', { mensaje: 'No se encontró la persona' });
    }

    res.render('personas/persona', { persona });
});

// Muestra formulario para editar datos de una persona
app.get('/cuenta/:id/editar', async (req, res) => {
    const personas = await leerDatos();
    const id = parseInt(req.params.id);
    const persona = personas.find(p => p.id === id);

    if (!persona) {
        return res.status(404).render('personas/error', { mensaje: 'No se encontró la persona para editar' });
    }

    res.render('personas/editar', { persona });
});


// Recibe los datos de un formulario y guarda la actualización 
// de datos de una  persona registrada en el archivo JSON.
app.post('/cuenta/:id/editar', async (req, res) => {
    const personas = await leerDatos();
    const id = parseInt(req.params.id);
    const index = personas.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).render('personas/error', { mensaje: 'No se encontró la persona para editar' });
    }

    const { nombre, apellido, mail, sector, rol } = req.body;
    personas[index] = { ...personas[index], nombre, apellido, mail, sector, rol };
    await escribirDatos(personas);
    res.render('personas/exito', { mensaje: 'Persona actualizada correctamente' })
    ;
});

// Muestra formulario de confirmación para eliminar una persona
app.get('/cuenta/:id/eliminar', async (req, res) => {
    const personas = await leerDatos();
    const id = parseInt(req.params.id);
    const persona = personas.find(p => p.id === id);

    if (!persona) {
        return res.status(404).render('error', { mensaje: 'No se encontró la persona a eliminar' });
    }

    res.render('personas/confirmarEliminar', { persona });
});

// Procesa la eliminación de una persona del archivo JSON
app.post('/cuenta/:id/eliminar', async (req, res) => {
    let personas = await leerDatos();
    const id = parseInt(req.params.id);
    const existe = personas.find(p => p.id === id);

    if (!existe) {
        return res.status(404).render('personas/error', { mensaje: 'No se encontró la persona a eliminar' });
    }

    personas = personas.filter(p => p.id !== id);
    await escribirDatos(personas);
    res.render('personas/exito', { mensaje: 'Persona eliminada correctamente' });
});

// Ruta para el Panel administrador con listado y acciones
app.get('/admin', async (req, res) => {
    const personas = await leerDatos();
    res.render('admin', { personas });
});


// Rutas relacionadas con la gestión de tareas

// Muestra el listado de tareas, con opción de filtar por área
app.get('/tareas', async (req, res) => {
    const { estado, prioridad, desde, hasta } = req.query;
    const tareas = await leerTareas();
    const personas = await leerDatos();

    let tareasFiltradas = tareas;

    if (estado) {
        tareasFiltradas = tareasFiltradas.filter(t => t.estado === estado);
    }

    if (prioridad) {
        tareasFiltradas = tareasFiltradas.filter(t => t.prioridad === prioridad);
    }

    if (desde) {
        tareasFiltradas = tareasFiltradas.filter(t => t.fechaVencimiento && t.fechaVencimiento >= desde);
    }

    if (hasta) {
        tareasFiltradas = tareasFiltradas.filter(t => t.fechaVencimiento && t.fechaVencimiento <= hasta);
    }


    res.render('tareas/listado', { tareas: tareasFiltradas, personas });
});

// Muestra formulario para crear una nueva tarea
app.get('/tareas/nueva', async (req, res) => {
    const personas = await leerDatos();
    res.render('tareas/agregar', { personas, tarea: {} });
});

// Procesa la creación de una nueva tarea
app.post('/tareas', async (req, res) => {
    const tareas = await leerTareas();
    const { titulo, descripcion, area, asignado, prioridad, fechaInicio, fechaVencimiento } = req.body;

// Genera un ID nuevo usando el ID más alto existente (Ver si: Puede usarse en persona tambien?)
    const nuevoId = tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1;

    const nuevaTarea = {
        id: nuevoId,
        titulo,
        descripcion,
        area,
        asignado: asignado ? parseInt(asignado) : null,
        estado: 'pendiente', // Por ejemplo: estado inicial
        prioridad,
        fechaInicio,
        fechaVencimiento
    };

  tareas.push(nuevaTarea);
  await escribirTareas(tareas);

  res.redirect('/tareas');
});

// Muestra detalles de una tarea específica
app.get('/tareas/:id', async (req, res) => {
  const tareas = await leerTareas();
  const personas = await leerDatos();
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).render('tareas/error', { mensaje: 'Tarea no encontrada' });
  }

  res.render('tareas/ver', { tarea, personas });
});

// Muestra formulario para editar una tarea
app.get('/tareas/:id/editar', async (req, res) => {
  const tareas = await leerTareas();
  const personas = await leerDatos();
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).render('tareas/error', { mensaje: 'Tarea no encontrada para editar' });
  }

  res.render('tareas/editar', { tarea, personas });
});

// Procesa la edición de tarea
app.post('/tareas/:id/editar', async (req, res) => {
  const tareas = await leerTareas();
  const id = parseInt(req.params.id);
  const index = tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).render('tareas/error', { mensaje: 'Tarea no encontrada para editar' });
  }

  const { titulo, descripcion, area, asignado, estado, prioridad, fechaInicio, fechaVencimiento } = req.body;
  tareas[index] = {
    ...tareas[index],
    titulo,
    descripcion,
    area,
    asignado: asignado ? parseInt(asignado) : null,
    estado,
    prioridad,
    fechaInicio,
    fechaVencimiento
  };

  await escribirTareas(tareas);
  res.redirect('/tareas');
});

// Muestra formulario de confirmación para eliminar una tarea
app.get('/tareas/:id/eliminar', async (req, res) => {
  const tareas = await leerTareas();
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).render('tareas/error', { mensaje: 'Tarea no encontrada para eliminar' });
  }

  res.render('tareas/confirmarEliminar', { tarea });
});

// Procesa la eliminación de una tarea
app.post('/tareas/:id/eliminar', async (req, res) => {
  let tareas = await leerTareas();
  const id = parseInt(req.params.id);
  const existe = tareas.find(t => t.id === id);

  if (!existe) {
    return res.status(404).render('tareas/error', { mensaje: 'Tarea no encontrada para eliminar' });
  }

  tareas = tareas.filter(t => t.id !== id);
  await escribirTareas(tareas);
  res.redirect('/tareas');
});

// Iniciamos el servidor 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});