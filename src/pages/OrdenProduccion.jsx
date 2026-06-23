import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import jsPDF from 'jspdf'

export default function OrdenProduccion() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const fecha = searchParams.get('fecha')
  const navigate = useNavigate()

  // Recorta la fecha ISO a AAAA-MM-DD
  const soloFecha = (f) => (f ? f.substring(0, 10) : '')

  const fetchPedidos = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/pedidos')
      // Filtramos por la fecha de entrega seleccionada
      const delDia = (data || []).filter(p => soloFecha(p.fechaEntrega) === fecha)
      setPedidos(delDia)
    } catch {
      setPedidos([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (fecha) fetchPedidos()
  }, [fecha])

  // Consolidar productos del día, agrupando por producto + unidad
  const consolidar = () => {
    const mapa = {}
    pedidos.forEach(pedido => {
      (pedido.items || []).forEach(item => {
        const nombre = item.producto?.nombre || 'Producto'
        const unidad = item.unidad || ''
        const clave = `${nombre} (${unidad})`
        if (!mapa[clave]) mapa[clave] = { nombre, unidad, cantidad: 0 }
        mapa[clave].cantidad += parseFloat(item.cantidad)
      })
    })
    return Object.values(mapa)
  }

  const consolidado = consolidar()

  const fechaFormateada = fecha
    ? format(new Date(fecha + 'T00:00:00'), "EEEE d 'de' MMMM yyyy", { locale: es })
    : ''

  const handleDescargarPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.setTextColor(146, 64, 14)
    doc.text('ORDEN DE PRODUCCION', 105, 20, { align: 'center' })

    // Fecha
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Fecha de entrega: ${fechaFormateada}`, 20, 35)
    doc.text(`Emitida el: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 20, 43)

    // Línea separadora
    doc.setDrawColor(146, 64, 14)
    doc.line(20, 48, 190, 48)

    // Consolidado
    doc.setFontSize(14)
    doc.setTextColor(146, 64, 14)
    doc.text('Resumen de Produccion', 20, 58)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    consolidado.forEach((item, i) => {
      doc.text(`• ${item.nombre}: ${item.cantidad} ${item.unidad}`, 25, 68 + i * 10)
    })

    // Línea separadora
    const yDetalle = 68 + consolidado.length * 10 + 10
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yDetalle, 190, yDetalle)

    // Detalle por cliente
    doc.setFontSize(14)
    doc.setTextColor(146, 64, 14)
    doc.text('Detalle por Cliente', 20, yDetalle + 10)

    let y = yDetalle + 20
    pedidos.forEach(pedido => {
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'bold')
      doc.text(pedido.cliente?.nombre || 'Cliente', 20, y)
      doc.setFont(undefined, 'normal')
      y += 7
      ;(pedido.items || []).forEach(item => {
        doc.text(`  - ${item.producto?.nombre}: ${item.cantidad} ${item.unidad}`, 20, y)
        y += 7
      })
      if (pedido.observaciones) {
        doc.setTextColor(120, 120, 120)
        doc.text(`  Obs: ${pedido.observaciones}`, 20, y)
        doc.setTextColor(0, 0, 0)
        y += 7
      }
      y += 3
    })

    doc.save(`orden-produccion-${fecha}.pdf`)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-amber-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📄 Orden de Producción</h1>
        <button
          onClick={() => navigate('/pedidos')}
          className="text-amber-200 hover:text-white text-sm"
        >
          ← Volver
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-amber-800 capitalize">{fechaFormateada}</h2>
                  <p className="text-sm text-gray-500">{pedidos.length} pedido(s) para este día</p>
                </div>
                <button
                  onClick={handleDescargarPDF}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  ⬇ Descargar PDF
                </button>
              </div>

              {/* Consolidado */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Resumen de Producción</h3>
                <div className="flex flex-col gap-2">
                  {consolidado.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-amber-50 rounded-lg px-4 py-2">
                      <span className="font-medium text-gray-800">{item.nombre}</span>
                      <span className="text-amber-700 font-bold">{item.cantidad} {item.unidad}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalle por cliente */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Detalle por Cliente</h3>
                <div className="flex flex-col gap-3">
                  {pedidos.map(pedido => (
                    <div key={pedido._id} className="border border-gray-100 rounded-lg p-3">
                      <p className="font-semibold text-gray-800 mb-1">{pedido.cliente?.nombre}</p>
                      {(pedido.items || []).map((item, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          — {item.producto?.nombre}: <strong>{item.cantidad}</strong> {item.unidad}
                        </p>
                      ))}
                      {pedido.observaciones && (
                        <p className="text-xs text-gray-400 mt-1">📝 {pedido.observaciones}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
