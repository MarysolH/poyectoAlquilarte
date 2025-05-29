# Trabajo integrador desarrollo web (Backend)

# 🚀 Alquilarte API

---

## 📋 Descripción general

Esta API está orientada a mejorar la organización interna de la inmobiliaria **Alquilarte**, una mediana empresa.  
Permite gestionar tareas, usuarios y áreas funcionales, con el objetivo de optimizar procesos administrativos, comerciales y operativos.

---

## ✨ Funcionalidades principales

- 👥 Gestión de personas (CRUD)
- 📝 Gestión de tareas (CRUD y filtrado)
- 🛠️ Panel administrativo
- 🔐 Autenticación y autorización

---

## 📚 Documentación API Alquilarte

**[[Enlace a documentación](https://documenter.getpostman.com/view/15812166/2sB2qf9dwB)]**

---

## 📁 Estructura del proyecto

/controllers - Lógica de negocio
/models - Modelos
/routes - Definición de rutas y endpoints
/views - Plantillas Pug para vistas
/data - Archivos JSON para base de datos
/utils - Contiene funciones auxiliares
/public - Contiene recursos estáticos varios como estilos .css
app.js - Archivo principal de la aplicación
package.json - Dependencias

---

# 🏗️ Sobre el trabajo integrador y el caso de estudio

## 🎯 Objetivo general

Aplicar los conocimientos adquiridos en desarrollo de sistemas para resolver problemáticas reales de pequeñas empresas, desarrollando una aplicación backend en Node.js.

---

## 🗂️ Objetivos específicos (1° entrega)

- Desarrollar backend con Node.js y Express.
- Integrar base de datos con archivos JSON.
- Aplicar asincronía con promesas y async/await.
- Modularizar código y aplicar POO (Programación Orientada a Objetos).
- Implementar rutas dinámicas y middleware personalizado.
- Utilizar Pug para vistas simples.
- Realizar pruebas con Postman o Thunder Client y documentarlas.
- Organizar proyecto con estructura clara de carpetas.

---

## 🛠️ Herramientas utilizadas

- Node.js + Express
- Motor de plantillas Pug
- Base de datos: JSON (1° entrega) - MongoDB (2° entrega)
- Postman para pruebas
- Git y GitHub para control de versiones

---

## 🏢 Caso de estudio: Inmobiliaria "Alquilarte"

- **Tipo:** Mediana empresa inmobiliaria con 3 sucursales en CABA.
- **Equipo:** 15 empleados (agentes inmobiliarios, administrativos, contador).
- **Procesos clave:**
  - Gestión de cobros, pagos, contratos y morosidad.
  - Emisión de recibos y facturas.
  - Liquidación de comisiones.
  - Gestión de expensas y conciliación bancaria.
  - Reportes contables y financieros.

---

## 🔍 Problemáticas detectadas

- Registro manual de propiedades, inquilinos y pagos con errores.
- Falta de control actualizado sobre pagos y reportes.
- Ausencia de alertas para vencimientos.
- Dificultad para coordinar visitas y mantenimiento.
- Falta de integración con sistema contable.

---

## 💡 Soluciones propuestas

- Sistema para registrar y administrar propiedades, inquilinos, contratos y pagos.
- Control y reportes actualizados de pagos y finanzas.
- Alertas configurables para vencimientos.
- Agenda para visitas y tareas de mantenimiento.
- Portal web o app para comunicación con inquilinos.
- Integración con sistema contable para automatización.

---

## ⚙️ Características principales del sistema (1° entrega mínima)

- CRUD de tareas organizadas por área (mínimo 2 áreas).
- Alta de empleados con rol y sector asignado.
- Filtros por estado, prioridad y fecha.
- Datos almacenados en archivos JSON.
- Rutas para crear, editar y eliminar tareas.
- Vista simple con Pug para visualización de datos.
