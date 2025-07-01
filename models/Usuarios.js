import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const usuarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  nivelAcceso: { type: String, required: true }
});

usuarioSchema.plugin(AutoIncrement, {inc_field: 'usuarioId'});

export default mongoose.model('Usuario', usuarioSchema);