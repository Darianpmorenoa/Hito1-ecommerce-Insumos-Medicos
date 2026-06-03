import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { Table, Button, Form } from 'react-bootstrap' //
import clienteAxios from '../../api/api'
import '../admin/AdminHome.css'

export default function AdminOrders() {
  const [ordenes, setOrdenes] = useState([])
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  // 1. Obtener todas las órdenes
  const obtenerOrdenes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await clienteAxios.get('/ordenes/todas', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrdenes(res.data)
    } catch {
      setError('No se pudo cargar las órdenes.')
    }
  }

  useEffect(() => {
    obtenerOrdenes()
  }, [])

  // 2. FUNCIÓN NUEVA: Actualizar el estado en la Base de Datos
  const handleCambiarEstado = async (cod_boleta, nuevoEstado) => {
    try {
      setError('')
      setMensajeExito('')
      const token = localStorage.getItem('token')
      
      // Enviamos la actualización al backend
      await clienteAxios.put(`/ordenes/actualizar-estado/${cod_boleta}`, 
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setMensajeExito(`Orden #${cod_boleta} actualizada a "${nuevoEstado}" con éxito.`)
      
      // Volvemos a pedir las órdenes para refrescar la vista con los datos reales
      obtenerOrdenes()
    } catch {
      setError('No se pudo actualizar el estado de la orden.')
    }
  }

  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-title">Órdenes de compra</h1>
        <p className="admin-subtitle">Listado de todas las órdenes realizadas por los clientes.</p>

        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        {mensajeExito && <p style={{ color: 'green', fontWeight: 'bold' }}>{mensajeExito}</p>}

        <Table hover responsive className="bg-white rounded shadow-sm mt-4">
          <thead style={{ backgroundColor: 'var(--color-dark)', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>Código boleta</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Método de pago</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  {error ? error : 'Sin órdenes registradas aún'}
                </td>
              </tr>
            ) : (
              ordenes.map((o) => (
                <tr key={o.cod_boleta}>
                  <td>{o.cod_boleta}</td>
                  <td>B-{String(o.cod_boleta).padStart(4, '0')}</td>
                  <td>{o.nombre} {o.apellido}</td>
                  <td>${Number(o.total).toLocaleString('es-CL')}</td>
                  <td className="text-capitalize">{o.metodo_pago || o.forma_pago || 'Tarjeta'}</td>
                  
                  {/* CONTROL DE ESTADO REAL ASOCIADO (SELECTOR INTERACTIVO) */}
                  <td>
                    <Form.Select 
                      size="sm"
                      value={o.estado?.toLowerCase() || 'pendiente'}
                      onChange={(e) => handleCambiarEstado(o.cod_boleta, e.target.value)}
                      className={`admin-select-status status-${o.estado?.toLowerCase()}`}
                      style={{ width: '130px', fontSize: '0.85rem' }}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aceptado">Aceptado</option>
                      <option value="en proceso">En Proceso</option>
                      <option value="completado">Completado</option>
                    </Form.Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </main>
    </div>
  )
}