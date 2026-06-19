import jwt from 'jsonwebtoken'

// Verifica que haya un token válido
export const proteger = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado, falta el token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded   // guardamos { id, rol } para usarlo en la ruta
    next()                  // todo ok, que siga
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

// Verifica que además sea admin
export const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso solo para administradores' })
  }
  next()
}