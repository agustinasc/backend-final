import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [unidad, setUnidad] = useState('kg')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/productos')
      setProductos(data || [])
    } catch {
      setProductos([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleGuardar = async () => {
    setError('')
    if (!nombre.trim()) return setError('El nombre es obligatorio')

    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, { nombre: nombre.trim(), unidad })
      } else {
        await api.post('/productos', { nombre: nombre.trim(), unidad })
      }
    } catch {
      return setError(editandoId ? 'Error al actualizar el producto' : 'Error al agregar el producto')
    }

    setNombre('')
    setUnidad('kg')
    setEditandoId(null)
    fetchProductos()
  }

  const handleEditar = (producto) => {
    setEditandoId(producto._id)
    setNombre(producto.nombre)
    setUnidad(producto.unidad || 'kg')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelar = () => {
    setEditandoId(null)
    setNombre('')
    setUnidad('kg')
    setError('')
  }

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este producto?')
    if (!confirmar) return
    try {
      await api.delete(`/productos/${id}`)
      fetchProductos()
    } catch {
      alert('No se pudo eliminar el producto')
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-amber-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🍞 Productos</h1>
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
          <h2 className="font-bold text-gray-700">{editandoId ? '✏️ Editar Producto' : '+ Nuevo Producto'}</h2>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Unidad</label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="kg">Kg</option>
              <option value="unidad">Unidad</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleGuardar}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {editandoId ? 'Guardar Cambios' : 'Agregar Producto'}
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
          ) : productos.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos cargados.</p>
          ) : (
            productos.map(producto => (
              <div key={producto._id} className="bg-white rounded-xl shadow-sm p-4 border border-amber-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{producto.nombre}</p>
                  <p className="text-sm text-gray-400">{producto.unidad}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditar(producto)}
                    className="text-sm text-amber-600 hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(producto._id)}
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
