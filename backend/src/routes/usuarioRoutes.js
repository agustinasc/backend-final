import express from 'express'
import {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuarioController.js'
import { proteger, soloAdmin } from '../middlewares/auth.js'

const router = express.Router()

// Gestión de usuarios: solo admin en todas las operaciones.
router.get('/', proteger, soloAdmin, obtenerUsuarios)
router.get('/:id', proteger, soloAdmin, obtenerUsuario)
router.post('/', proteger, soloAdmin, crearUsuario)
router.put('/:id', proteger, soloAdmin, actualizarUsuario)
router.delete('/:id', proteger, soloAdmin, eliminarUsuario)

export default router