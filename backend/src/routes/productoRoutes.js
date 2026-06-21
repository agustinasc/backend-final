import express from 'express'
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js'
import { proteger, soloAdmin } from '../middlewares/auth.js'
import { reglasProducto } from '../validations/productoValidation.js'
import { validar } from '../middlewares/validar.js'

const router = express.Router()

router.get('/', proteger, obtenerProductos)
router.get('/:id', proteger, obtenerProducto)
router.post('/', proteger, crearProducto)
router.put('/:id', proteger, actualizarProducto)
router.delete('/:id', proteger, soloAdmin, eliminarProducto)
router.post('/', proteger, reglasProducto, validar, crearProducto)
router.put('/:id', proteger, reglasProducto, validar, actualizarProducto)


export default router