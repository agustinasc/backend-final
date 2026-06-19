import bcrypt from 'bcryptjs'
import Usuario from '../models/Usuario.js'
import { generarToken } from '../utils/generarToken.js'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // 1. buscar el usuario
    const usuario = await Usuario.findOne({ username: username?.toLowerCase() })
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
    }

    // 2. comparar la contraseña con el hash guardado
    const coincide = await bcrypt.compare(password, usuario.password)
    if (!coincide) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
    }

    // 3. generar el token y responder
    const token = generarToken(usuario)
    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        username: usuario.username,
        rol: usuario.rol
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}