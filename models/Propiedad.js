import mongoose from 'mongoose';

const propiedadSchema = new mongoose.Schema({
  direccion: { type: String, required: true },
  tipo: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String },
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  estado: { type: String, enum: ['disponible', 'reservada', 'alquilada'], default: 'disponible' }, 
});

export default mongoose.model('Propiedad', propiedadSchema);