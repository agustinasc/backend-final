import { body } from 'express-validator'

export const reglasPedido = [
  body('cliente')
    .notEmpty().withMessage('El cliente es obligatorio')
    .isMongoId().withMessage('El id de cliente no es válido'),

  body('fechaEntrega')
    .notEmpty().withMessage('La fecha de entrega es obligatoria')
    .isISO8601().withMessage('La fecha de entrega no es válida'),

  body('items')
    .isArray({ min: 1 }).withMessage('El pedido debe tener al menos un ítem'),

  body('items.*.producto')
    .notEmpty().withMessage('Cada ítem debe tener un producto')
    .isMongoId().withMessage('El id de producto no es válido'),

  body('items.*.unidad')
    .trim()
    .notEmpty().withMessage('Cada ítem debe indicar la unidad'),

  body('items.*.cantidad')
    .notEmpty().withMessage('Cada ítem debe tener una cantidad')
    .isFloat({ min: 0 }).withMessage('La cantidad no puede ser negativa')
]