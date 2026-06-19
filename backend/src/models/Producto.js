import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    unidadesDisponibles: {
      type: [String],          // un array de textos: ["lata", "kg", "unidad"]
      required: true,
      trim: true,
      default: []
     },
    precio: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
)

export default mongoose.model('Producto', productoSchema)