export default class Tarea {
    constructor(id, titulo, descripcion, area, estado = 'pendiente', prioridad = 'media', responsableId = null, fechaInicio = null, fechaVencimiento = null) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.area = area;
        this.estado = estado;
        this.prioridad = prioridad;
        this.responsableId = responsableId;
        this.fechaInicio = fechaInicio;       // Formato: 'YYYY-MM-DD'
        this.fechaVencimiento = fechaVencimiento; 
    }
}

