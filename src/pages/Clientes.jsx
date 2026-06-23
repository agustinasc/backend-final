import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchClientes = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/clientes')
      setClientes(data || [])
    } catch {
      setClientes([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const handleGuardar = async () => {
    setError('')
    if (!nombre.trim()) return setError('El nombre es obligatorio')

    try {
      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, {
          nombre: nombre.trim(),
          telefono: telefono.trim()
        })
      } else {
        await api.post('/clientes', {
          nombre: nombre.trim(),
          telefono: telefono.trim()
        })
      }
    } catch {
      return setError(editandoId ? 'Error al actualizar el cliente' : 'Error al agregar el cliente')
    }

    setNombre('')
    setTelefono('')
    setEditandoId(null)
    fetchClientes()
  }

  const handleEditar = (cliente) => {
    setEditandoId(cliente._id)
    setNombre(cliente.nombre)
    setTelefono(cliente.telefono || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelar = () => {
    setEditandoId(null)
    setNombre('')
    setTelefono('')
    setError('')
  }

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este cliente?')
    if (!confirmar) return
    try {
      await api.delete(`/clientes/${id}`)
      fetchClientes()
    } catch {
      setError('Error al eliminar el cliente')
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-amber-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">👥 Clientes</h1>
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
          <h2 className="font-bold text-gray-700">{editandoId ? '✏️ Editar Cliente' : '+ Nuevo Cliente'}</h2>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Nombre del cliente"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Teléfono <span className="text-gray-400">(opcional)</span></label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Ej: 3834000001"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleGuardar}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {editandoId ? 'Guardar Cambios' : 'Agregar Cliente'}
            </button>
            {editandoId && (
              <button
                onClick={handleCancelar}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : clientes.length === 0 ? (
            <p className="text-center text-gray-500">No hay clientes cargados.</p>
          ) : (
            clientes.map(cliente => (
              <div key={cliente._id} className="bg-white rounded-xl shadow-sm p-4 border border-amber-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{cliente.nombre}</p>
                  {cliente.telefono && <p className="text-sm text-gray-400">{cliente.telefono}</p>}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditar(cliente)}
                    className="text-sm text-amber-600 hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(cliente._id)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
