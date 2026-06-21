import bcrypt from 'bcryptjs'
import Usuario from '../models/Usuario.js'

// GET /api/usuarios  → listar todos (sin la contraseña)
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password').sort({ nombre: 1 })
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' })
  }
}

// GET /api/usuarios/:id  → ver uno (sin la contraseña)
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password')
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' })
  }
}

// POST /api/usuarios  → crear (hashea la contraseña)
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, username, password, rol } = req.body

    // ¿ya existe ese username?
    const existe = await Usuario.findOne({ username: username?.toLowerCase() })
    if (existe) {
      return res.status(400).json({ error: 'Ese nombre de usuario ya está en uso' })
    }

    const hash = await bcrypt.hash(password, 10)

    const usuario = await Usuario.create({
      nombre,
      username,
      password: hash,
      rol
    })

    // responder sin la contraseña
    res.status(201).json({
      id: usuario._id,
      nombre: usuario.nombre,
      username: usuario.username,
      rol: usuario.rol
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' })
  }
}

// PUT /api/usuarios/:id  → editar (si viene password, la re-hashea)
export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, rol, password } = req.body

    const cambios = { nombre, rol }
    if (password) {
      cambios.password = await bcrypt.hash(password, 10)
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      cambios,
      { new: true, runValidators: true }
    ).select('-password')

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' })
  }
}

// DELETE /api/usuarios/:id  → borrar (solo admin)
export const eliminarUsuario = async (req, res) => {
  try {
    // evitar que un admin se borre a sí mismo
    if (req.usuario?.id === req.params.id) {
      return res.status(400).json({ error: 'No podés eliminar tu propio usuario' })
    }

    const usuario = await Usuario.findByIdAndDelete(req.params.id)
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' })
  }
}