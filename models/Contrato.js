import mongoose from 'mongoose';

const contratoSchema = new mongoose.Schema({
  propiedad: { type: mongoose.Schema.Types.ObjectId, ref: 'Propiedad', required: true },
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  inquilino: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  precio: { type: Number, required: true },
  estado: { type: String, enum: ['activo', 'finalizado', 'cancelado'], default: 'activo' },
  observaciones: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('Contrato', contratoSchema);