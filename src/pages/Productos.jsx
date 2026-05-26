import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [unidad, setUnidad] = useState('Kg')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchProductos = async () => {
    setLoading(true)
    const { data } = await supabase.from('productos').select('*').order('nombre')
    setProductos(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleGuardar = async () => {
    setError('')
    if (!nombre.trim()) return setError('El nombre es obligatorio')

    if (editandoId) {
      const { error } = await supabase
        .from('productos')
        .update({ nombre: nombre.trim(), unidad })
        .eq('id', editandoId)
      if (error) return setError('Error al actualizar el producto')
    } else {
      const { error } = await supabase
        .from('productos')
        .insert({ nombre: nombre.trim(), unidad })
      if (error) return setError('Error al agregar el producto')
    }

    setNombre('')
    setUnidad('Kg')
    setEditandoId(null)
    fetchProductos()
  }

  const handleEditar = (producto) => {
    setEditandoId(producto.id)
    setNombre(producto.nombre)
    setUnidad(producto.unidad)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelar = () => {
    setEditandoId(null)
    setNombre('')
    setUnidad('Kg')
    setError('')
  }

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este producto?')
    if (!confirmar) return
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) {
      alert('No se puede eliminar un producto que tiene pedidos asociados')
      return
    }
    fetchProductos()
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
              <option value="Kg">Kg</option>
              <option value="Unidad">Unidad</option>
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
              <div key={producto.id} className="bg-white rounded-xl shadow-sm p-4 border border-amber-100 flex justify-between items-center">
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
                    onClick={() => handleEliminar(producto.id)}
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