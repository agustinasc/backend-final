import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../App'
import api from '../api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')

  const perfil = useContext(UserContext)

  const navigate = useNavigate()

  const fetchPedidos = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/pedidos')
      setPedidos(data || [])
    } catch {
      setPedidos([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPedidos()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  // La fecha viene como ISO completa (2026-06-25T00:00:00.000Z); tomamos solo la parte AAAA-MM-DD
  const soloFecha = (f) => (f ? f.substring(0, 10) : '')

  const pedidosFiltrados = fechaSeleccionada
    ? pedidos.filter(p => soloFecha(p.fechaEntrega) === fechaSeleccionada)
    : pedidos

  const agruparPorFecha = () => {
    const grupos = {}
    pedidosFiltrados.forEach(pedido => {
      const fecha = soloFecha(pedido.fechaEntrega)
      if (!grupos[fecha]) grupos[fecha] = []
      grupos[fecha].push(pedido)
    })
    return grupos
  }

  const grupos = agruparPorFecha()

  ///------------Para eliminar pedidos

  const handleEliminar = async (pedidoId) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este pedido?')
    if (!confirmar) return
    try {
      await api.delete(`/pedidos/${pedidoId}`)
      fetchPedidos()
    } catch {
      alert('No se pudo eliminar el pedido (¿sos admin?)')
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">

      {/* Header */}

      <div className="bg-amber-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🥖 Sistema de Pedidos</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/nuevo-pedido')}
            className="bg-white text-amber-700 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-amber-100 transition"
          >
            + Nuevo Pedido
          </button>
          <button
            onClick={() => navigate('/configuracion')}
            className="bg-amber-800 hover:bg-amber-900 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition"
          >
            ⚙️
          </button>
          <button
            onClick={handleLogout}
            className="text-amber-200 hover:text-white text-sm"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filtro por fecha */}
        <div className="flex gap-4 items-center mb-6">
          <div>
            <label className="text-sm text-gray-600 mr-2">Filtrar por fecha:</label>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          {fechaSeleccionada && (
            <button
              onClick={() => setFechaSeleccionada('')}
              className="text-sm text-amber-600 hover:underline"
            >
              Ver todos
            </button>
          )}
          {fechaSeleccionada && (
            <button
              onClick={() => navigate(`/orden-produccion?fecha=${fechaSeleccionada}`)}
              className="ml-auto bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
            >
              📄 Orden de Producción
            </button>
          )}
        </div>

        {/* Lista de pedidos agrupados por fecha */}
        {loading ? (
          <p className="text-center text-gray-500">Cargando pedidos...</p>
        ) : Object.keys(grupos).length === 0 ? (
          <p className="text-center text-gray-500">No hay pedidos cargados.</p>
        ) : (
          Object.entries(grupos).map(([fecha, pedidosDia]) => (
            <div key={fecha} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-amber-800">
                  📅 {format(new Date(fecha + 'T00:00:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
                </h2>
                <span className="text-sm text-gray-500">{pedidosDia.length} pedido(s)</span>
              </div>

              <div className="flex flex-col gap-3">
                {pedidosDia.map(pedido => (
                  <div key={pedido._id} className="bg-white rounded-xl shadow-sm p-4 border border-amber-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{pedido.cliente?.nombre}</p>
                        {pedido.observaciones && (
                          <p className="text-sm text-gray-400 mt-0.5">📝 {pedido.observaciones}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/editar-pedido/${pedido._id}`)}
                          className="text-sm text-amber-600 hover:underline"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(pedido._id)}
                          className="text-sm text-red-400 hover:underline"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pedido.items?.map((item, i) => (
                        <span key={i} className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                          {item.producto?.nombre}: <strong>{item.cantidad}</strong> {item.unidad}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
