import Cliente from '../models/Cliente.js'

// GET /api/clientes  → listar todos
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ nombre: 1 })
    res.json(clientes)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' })
  }
}

// GET /api/clientes/:id  → ver uno
export const obtenerCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' })
  }
}

// POST /api/clientes  → crear
export const crearCliente = async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body
    const cliente = await Cliente.create({ nombre, telefono, direccion })
    res.status(201).json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente' })
  }
}

// PUT /api/clientes/:id  → editar
export const actualizarCliente = async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { nombre, telefono, direccion },
      { new: true, runValidators: true }
    )
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el cliente' })
  }
}

// DELETE /api/clientes/:id  → borrar (solo admin)
export const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id)
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }
    res.json({ mensaje: 'Cliente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el cliente' })
  }
}