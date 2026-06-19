import express from 'express'
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js'
import { proteger, soloAdmin } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', proteger, obtenerProductos)
router.get('/:id', proteger, obtenerProducto)
router.post('/', proteger, crearProducto)
router.put('/:id', proteger, actualizarProducto)
router.delete('/:id', proteger, soloAdmin, eliminarProducto)

export default router