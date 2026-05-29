import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const FUNCTION_URL = 'https://qscmkejcdsgvbjbljmgx.supabase.co/functions/v1/gestionar-usuarios'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'login', username })
      })

      const data = await res.json()

      if (data.error || !data.email) {
        setError('Usuario o contraseña incorrectos')
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password
      })

      if (error) {
        setError('Usuario o contraseña incorrectos')
      } else {
        navigate('/pedidos')
      }
    } catch {
      setError('Error al conectar con el servidor')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-amber-700 text-center mb-2">🥖 Panadería</h1>
        <p className="text-center text-gray-500 mb-6">Sistema de Pedidos</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="usuario"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}