import { body } from 'express-validator'

export const reglasCliente = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('telefono')
    .optional()
    .trim()
    .isLength({ min: 6 }).withMessage('El teléfono debe tener al menos 6 caracteres'),
  body('direccion')
    .optional()
    .trim()
]