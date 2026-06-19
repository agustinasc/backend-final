import 'dotenv/config'
import dns from 'node:dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { connectDB } from './config/db.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API Panadería funcionando 🥖' })
})

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`))
})