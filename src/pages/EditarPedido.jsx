import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'

export default function EditarPedido() {
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [detalle, setDetalle] = useState([{ producto_id: '', cantidad: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()

  const fetchData = async () => {
    const { data: clientesData } = await supabase.from('clientes').select('*').order('nombre')
    const { data: productosData } = await supabase.from('productos').select('*').order('nombre')
    setClientes(clientesData || [])
    setProductos(productosData || [])
  }

  const fetchPedido = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        detalle_pedidos (
          id,
          cantidad,
          producto_id,
          productos (nombre, unidad)
        )
      `)
      .eq('id', id)
      .single()

    if (!error && data) {
      setClienteId(data.cliente_id)
      setFechaEntrega(data.fecha_entrega)
      setObservaciones(data.observaciones || '')
      setDetalle(data.detalle_pedidos.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad
      })))
    }
  }

  useEffect(() => {
    fetchData()
    fetchPedido()
  }, [])

  const agregarLinea = () => {
    setDetalle([...detalle, { producto_id: '', cantidad: '' }])
  }

  const eliminarLinea = (index) => {
    setDetalle(detalle.filter((_, i) => i !== index))
  }

  const actualizarLinea = (index, campo, valor) => {
    const nuevo = [...detalle]
    nuevo[index][campo] = valor
    setDetalle(nuevo)
  }

  const handleGuardar = async () => {
    setError('')

    if (!clienteId) return setError('Seleccioná un cliente')
    if (!fechaEntrega) return setError('Seleccioná una fecha de entrega')
    if (detalle.some(d => !d.producto_id || !d.cantidad)) return setError('Completá todos los productos y cantidades')

    setLoading(true)

    const { error: errorPedido } = await supabase
      .from('pedidos')
      .update({ cliente_id: clienteId, fecha_entrega: fechaEntrega, observaciones })
      .eq('id', id)

    if (errorPedido) {
      setError('Error al actualizar el pedido')
      setLoading(false)
      return
    }

    await supabase.from('detalle_pedidos').delete().eq('pedido_id', id)

    const detalleInsert = detalle.map(d => ({
      pedido_id: id,
      producto_id: d.producto_id,
      cantidad: parseFloat(d.cantidad)
    }))

    const { error: errorDetalle } = await supabase.from('detalle_pedidos').insert(detalleInsert)

    if (errorDetalle) {
      setError('Error al actualizar el detalle')
      setLoading(false)
      return
    }

    navigate('/pedidos')
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-amber-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">✏️ Editar Pedido</h1>
        <button
          onClick={() => navigate('/pedidos')}
          className="text-amber-200 hover:text-white text-sm"
        >
          ← Volver
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">

          <div>
            <label className="text-sm font-medium text-gray-700">Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Seleccioná un cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Fecha de entrega</label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Observaciones <span className="text-gray-400">(opcional)</span></label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              rows={2}
              placeholder="Ej: entregar antes de las 8am"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Productos</label>
            <div className="flex flex-col gap-2">
              {detalle.map((linea, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={linea.producto_id}
                    onChange={(e) => actualizarLinea(index, 'producto_id', e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Seleccioná producto...</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.unidad})</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={linea.cantidad}
                      onChange={(e) => actualizarLinea(index, 'cantidad', e.target.value)}
                      placeholder="Cantidad"
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      min="1"
                    />
                    <select
                      value={linea.unidad || ''}
                      onChange={(e) => actualizarLinea(index, 'unidad', e.target.value)}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">Unidad</option>
                      <option value="Kg">Kg</option>
                      <option value="Unidad">Unidad</option>
                      <option value="Lata">Lata</option>
                    </select>
                  </div>
                  {detalle.length > 1 && (
                    <button
                      onClick={() => eliminarLinea(index)}
                      className="text-red-400 hover:text-red-600 text-lg font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={agregarLinea}
              className="mt-2 text-sm text-amber-600 hover:underline"
            >
              + Agregar otro producto
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>

        </div>
      </div>
    </div>
  )
}