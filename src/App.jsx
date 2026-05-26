import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import Pedidos from './pages/Pedidos'
import NuevoPedido from './pages/NuevoPedido'
import OrdenProduccion from './pages/OrdenProduccion'
import EditarPedido from './pages/EditarPedido'
import Configuracion from './pages/Configuracion'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="min-h-screen bg-amber-50 flex items-center justify-center text-amber-700">Cargando...</div>

  return session ? children : <Navigate to="/" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
        <Route path="/nuevo-pedido" element={<ProtectedRoute><NuevoPedido /></ProtectedRoute>} />
        <Route path="/orden-produccion" element={<ProtectedRoute><OrdenProduccion /></ProtectedRoute>} />
        <Route path="/editar-pedido/:id" element={<ProtectedRoute><EditarPedido /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App