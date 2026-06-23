import Producto from '../models/Producto.js'

// GET /api/productos  → listar todos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ nombre: 1 })
    res.json(productos)
  } catch (error) {
    console.log(error) 
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
}

// GET /api/productos/:id  → ver uno
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(producto)
  } catch (error) {
    console.log(error) 
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
}

// POST /api/productos  → crear
export const crearProducto = async (req, res) => {
  try {
    const { nombre, unidad, unidadesDisponibles } = req.body
    const producto = await Producto.create({ nombre, unidad, unidadesDisponibles })
    res.status(201).json(producto)
  } catch (error) {
    console.log(error) 
    res.status(500).json({ error: 'Error al crear el producto' })
  }
}

// PUT /api/productos/:id  → editar
export const actualizarProducto = async (req, res) => {
  try {
    const { nombre, unidad, unidadesDisponibles } = req.body
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, unidad, unidadesDisponibles },
      { new: true, runValidators: true }
    )
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(producto)
  } catch (error) {
    console.log(error) 
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
}

// DELETE /api/productos/:id  → borrar (solo admin)
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id)
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json({ mensaje: 'Producto eliminado correctamente' })
  } catch (error) {
    console.log(error) 
    res.status(500).json({ error: 'Error al eliminar el producto' })
  }
}