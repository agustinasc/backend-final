import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Pedidos from './pages/Pedidos'
import NuevoPedido from './pages/NuevoPedido'
import OrdenProduccion from './pages/OrdenProduccion'
import EditarPedido from './pages/EditarPedido'
import Configuracion from './pages/Configuracion'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Usuarios from './pages/Usuarios'

export const UserContext = React.createContext(null)

function ProtectedRoute({ children, soloAdmin = false }) {
  const token = localStorage.getItem('token')

  // Leer el usuario guardado en el login
  let perfil = null
  try {
    perfil = JSON.parse(localStorage.getItem('usuario'))
  } catch {
    perfil = null
  }

  // Sin token = no logueado
  if (!token) return <Navigate to="/" />

  // Ruta solo para admin
  if (soloAdmin && perfil?.rol !== 'admin') return <Navigate to="/pedidos" />

  return (
    <UserContext.Provider value={perfil}>
      {children}
    </UserContext.Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
        <Route path="/nuevo-pedido" element={<ProtectedRoute><NuevoPedido /></ProtectedRoute>} />
        <Route path="/editar-pedido/:id" element={<ProtectedRoute><EditarPedido /></ProtectedRoute>} />
        <Route path="/orden-produccion" element={<ProtectedRoute><OrdenProduccion /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute soloAdmin><Productos /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute soloAdmin><Usuarios /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
