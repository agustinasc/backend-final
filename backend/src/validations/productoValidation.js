import { body } from 'express-validator'

export const reglasProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

  body('unidadesDisponibles')
    .isArray({ min: 1 }).withMessage('Debe tener al menos una unidad de venta'),

  body('unidadesDisponibles.*.unidad')
    .trim()
    .notEmpty().withMessage('Cada unidad debe tener un nombre (ej: kg, lata, unidad)'),

  body('unidadesDisponibles.*.precio')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo')
]