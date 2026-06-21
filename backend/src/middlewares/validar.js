import { validationResult } from 'express-validator'

// para revisar si las reglas anteriores encontraron errores
export const validar = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg }))
    })
  }
  next()
}