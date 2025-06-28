// Clase que representa a una persona del sistema
import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);


const personaSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  mail: { type: String, required: true, match: /.+@.+\..+/ },
  sector: { type: String, required: true },
  rol: { type: String, required: true },
  tipo: { type: String,  required: true, lowercase: true, enum: ['empleado']}
});

// Activamos el plugin para que autoincremente 'id'
personaSchema.plugin(AutoIncrement, { inc_field: 'id' });

export default mongoose.model('Persona', personaSchema);