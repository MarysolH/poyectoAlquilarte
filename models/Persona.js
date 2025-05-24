// Clase que representa a una persona del sistema
export default class Persona {
    constructor(id, nombre, apellido, mail, sector, rol) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.mail = mail;
      this.sector = sector;
      this.rol = rol;
    }
}