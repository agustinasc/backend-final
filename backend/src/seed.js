import 'dotenv/config'
import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

import bcrypt from 'bcryptjs'
import { connectDB } from './config/db.js'
import Usuario from './models/Usuario.js'

const crearAdmin = async () => {
  await connectDB()

  const username = 'admin'
  const passwordPlano = 'cambiar123'   // cambiala después del primer login

  // ¿ya existe?
  const existe = await Usuario.findOne({ username })
  if (existe) {
    console.log('⚠️  El usuario admin ya existe. No se crea de nuevo.')
    process.exit(0)
  }

  // Para hashear la contraseña
  const hash = await bcrypt.hash(passwordPlano, 10)

  await Usuario.create({
    nombre: 'Administradora',
    username,
    password: hash,
    rol: 'admin'
  })

  console.log('✅ Admin creado. Usuario:', username, '| Contraseña:', passwordPlano)
  process.exit(0)
}

crearAdmin()