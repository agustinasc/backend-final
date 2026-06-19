import mongoose from 'mongoose'

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true
    },
    fechaEntrega: {
      type: Date,
      required: true
    },
    observaciones: {
      type: String,
      trim: true
    },
    cargadoPor: {
      type: String,
      trim: true
    },
    items: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true
        },
        unidad: {
          type: String,
          required: true,
          trim: true
        },
        cantidad: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('Pedido', pedidoSchema)