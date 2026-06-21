import express from 'express'
import {
  obtenerPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido,
  eliminarPedido
} from '../controllers/pedidoController.js'
import { proteger, soloAdmin } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', proteger, obtenerPedidos)
router.get('/:id', proteger, obtenerPedido)
router.post('/', proteger, crearPedido)
router.put('/:id', proteger, actualizarPedido)
router.delete('/:id', proteger, soloAdmin, eliminarPedido)

export default router