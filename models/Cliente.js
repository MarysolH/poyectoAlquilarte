import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  mail: { type: String, required: true, match: /.+@.+\..+/ },
  telefono: { type: String },
  tipo: { type: String,  required: true, lowercase: true, enum: ['inquilino', 'propietario']},
});

export default mongoose.model('Cliente', clienteSchema);
