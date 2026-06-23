import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [cambiandoPassword, setCambiandoPassword] = useState(null)
  const [nuevaPassword, setNuevaPassword] = useState('')
  const navigate = useNavigate()

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/usuarios')
      setUsuarios(data || [])
    } catch {
      setUsuarios([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleGuardar = async () => {
    setError('')
    if (!nombre.trim()) return setError('El nombre es obligatorio')
    if (!username.trim()) return setError('El usuario es obligatorio')
    if (!password.trim()) return setError('La contraseña es obligatoria')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')

    setGuardando(true)
    try {
      await api.post('/usuarios', { nombre, username, password, rol: 'vendedor' })
      setNombre('')
      setUsername('')
      setPassword('')
      fetchUsuarios()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el usuario')
    }
    setGuardando(false)
  }

  const handleCambiarPassword = async (userId) => {
    setError('')
    if (!nuevaPassword.trim()) return
    if (nuevaPassword.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')

    try {
      await api.put(`/usuarios/${userId}`, { password: nuevaPassword })
      setCambiandoPassword(null)
      setNuevaPassword('')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña')
    }
  }

  const handleEliminar = async (userId, nombreUsuario) => {
    const confirmar = window.confirm(`¿Seguro que querés eliminar a ${nombreUsuario}?`)
    if (!confirmar) return

    try {
      await api.delete(`/usuarios/${userId}`)
      fetchUsuarios()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar el usuario')
    }
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

        {/* Formulario nuevo usuario */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="font-bold text-gray-700">+ Nuevo Vendedor</h2>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Nombre del vendedor"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/ /g, ''))}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="sin espacios, ej: juan"
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

        {/* Lista de usuarios */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-gray-700">Usuarios activos</h2>
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-center text-gray-500">No hay usuarios.</p>
          ) : (
            usuarios.map(u => (
              <div key={u._id} className="bg-white rounded-xl shadow-sm p-4 border border-amber-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{u.nombre}</p>
                    <p className="text-sm text-gray-400">@{u.username} · {u.rol}</p>
                  </div>
                  {u.rol !== 'admin' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setCambiandoPassword(u._id); setNuevaPassword(''); setError('') }}
                        className="text-sm text-amber-600 hover:underline"
                      >
                        🔑 Contraseña
                      </button>
                      <button
                        onClick={() => handleEliminar(u._id, u.nombre)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>

                {cambiandoPassword === u._id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="password"
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      placeholder="Nueva contraseña"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      onClick={() => handleCambiarPassword(u._id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => { setCambiandoPassword(null); setNuevaPassword('') }}
                      className="text-sm text-gray-400 hover:underline px-2"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
