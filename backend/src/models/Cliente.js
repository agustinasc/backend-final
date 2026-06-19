import mongoose from 'mongoose'

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    telefono: {
      type: String,
      trim: true
    },
    direccion: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Cliente', clienteSchema)