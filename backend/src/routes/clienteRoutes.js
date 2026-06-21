import express from 'express'
import {
  obtenerClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../controllers/clienteController.js'
import { proteger, soloAdmin } from '../middlewares/auth.js'
import { reglasCliente } from '../validations/clienteValidation.js'
import { validar } from '../middlewares/validar.js'

const router = express.Router()

// Todas requieren estar logueado (proteger).
// Borrar requiere además ser admin (soloAdmin).
router.get('/', proteger, obtenerClientes)
router.get('/:id', proteger, obtenerCliente)
router.post('/', proteger, reglasCliente, validar, crearCliente)
router.put('/:id', proteger, reglasCliente, validar, actualizarCliente)
router.delete('/:id', proteger, soloAdmin, eliminarCliente)

export default router