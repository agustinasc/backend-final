import Pedido from '../models/Pedido.js'

// GET /api/pedidos  → listar todos (con datos de cliente y productos)
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('cliente', 'nombre telefono')
      .populate('items.producto', 'nombre')
      .sort({ fechaEntrega: 1 })
    res.json(pedidos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' })
  }
}

// GET /api/pedidos/:id  → ver uno
export const obtenerPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nombre telefono direccion')
      .populate('items.producto', 'nombre unidadesDisponibles')
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(pedido)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido' })
  }
}

// POST /api/pedidos  → crear
export const crearPedido = async (req, res) => {
  try {
    const { cliente, fechaEntrega, observaciones, items } = req.body

    const pedido = await Pedido.create({
      cliente,
      fechaEntrega,
      observaciones,
      items,
      cargadoPor: req.usuario?.id   // viene del token (middleware proteger)
    })

    res.status(201).json(pedido)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pedido' })
  }
}

// PUT /api/pedidos/:id  → editar
export const actualizarPedido = async (req, res) => {
  try {
    const { cliente, fechaEntrega, observaciones, items } = req.body
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { cliente, fechaEntrega, observaciones, items },
      { new: true, runValidators: true }
    )
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(pedido)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido' })
  }
}

// DELETE /api/pedidos/:id  → borrar (solo admin)
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id)
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json({ mensaje: 'Pedido eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el pedido' })
  }
}