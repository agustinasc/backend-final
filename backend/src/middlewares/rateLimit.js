import rateLimit from 'express-rate-limit'

// Límite general: 100 requests cada 15 minutos por IP
export const limiteGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutos
  max: 100,
  message: { error: 'Demasiadas solicitudes, esperá un momento e intentá de nuevo' },
  standardHeaders: true,
  legacyHeaders: false
})

// Límite estricto para login: 5 intentos cada 15 minutos por IP
export const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de login, esperá 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false
})