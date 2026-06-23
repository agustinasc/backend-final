import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    unidad: {
      type: String,
      enum: ['kg', 'unidad'],
      default: 'kg'
    },
    unidadesDisponibles: [          // lo dejamos por si lo usás a futuro
      {
        unidad: { type: String, trim: true },
        precio: { type: Number, min: 0, default: 0 }
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('Producto', productoSchema)