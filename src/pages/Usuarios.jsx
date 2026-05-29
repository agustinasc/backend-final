import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const FUNCTION_URL = 'https://qscmkejcdsgvbjbljmgx.supabase.co/functions/v1/gestionar-usuarios'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const navigate = useNavigate()

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  const fetchUsuarios = async () => {
    setLoading(true)
    const token = await getToken()
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ accion: 'listar' })
    })
    const { data } = await res.json()
    setUsuarios(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleGuardar = async () => {
    setError('')
    if (!nombre.trim()) return setError('El nombre es obligatorio')
    if (!email.trim()) return setError('El email es obligatorio')
    if (!password.trim()) return setError('La contraseña es obligatoria')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')

    setGuardando(true)
    const token = await getToken()
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ accion: 'crear', nombre, email, password })
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else {
      setNombre('')
      setEmail('')
      setPassword('')
      fetchUsuarios()
    }
    setGuardando(false)
  }

  const handleEliminar = async (userId, nombreUsuario) => {
    const confirmar = window.confirm(`¿Seguro que querés eliminar a ${nombreUsuario}?`)
    if (!confirmar) return

    const token = await getToken()
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ accion: 'eliminar', userId })
    })
    const data = await res.json()
    if (!data.error) fetchUsuarios()
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-amber-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">👤 Usuarios</h1>
        <button
          onClick={() => navigate('/configuracion')}
          className="text-amber-200 hover:text-white text-sm"
        >
          ← Volver
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="font-bold text-gray-700">+ Nuevo Vendedor</h2>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Nombre del vendedor"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="email@panaderia.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Agregar Vendedor'}
          </button>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-gray-700">Usuarios activos</h2>
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-center text-gray-500">No hay usuarios.</p>
          ) : (
            usuarios.map(u => (
              <div key={u.id} className="bg-white rounded-xl shadow-sm p-4 border border-amber-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{u.nombre}</p>
                  <p className="text-sm text-gray-400">{u.rol}</p>
                </div>
                {u.rol !== 'admin' && (
                  <button
                    onClick={() => handleEliminar(u.id, u.nombre)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}