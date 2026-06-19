import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    unidadesDisponibles: [
      {
        unidad: {
          type: String,
          required: true,
          trim: true
        },
        precio: {
          type: Number,
          min: 0,
          default: 0
        }
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('Producto', productoSchema)