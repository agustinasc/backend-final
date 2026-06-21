import { body } from 'express-validator'

// Para crear usuario (POST): todo obligatorio
export const reglasCrearUsuario = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio'),

  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('rol')
    .optional()
    .isIn(['admin', 'vendedor']).withMessage('El rol debe ser admin o vendedor')
]

// Para editar usuario (PUT): los campos son opcionales,
// pero si vienen, se validan.
export const reglasEditarUsuario = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('rol')
    .optional()
    .isIn(['admin', 'vendedor']).withMessage('El rol debe ser admin o vendedor')
]