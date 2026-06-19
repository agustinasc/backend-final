import 'dotenv/config'
import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import clienteRoutes from './routes/clienteRoutes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API Panadería funcionando 🥖' })
})

app.use('/api/auth', authRoutes)
app.use('/api/clientes', clienteRoutes)

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`))
})