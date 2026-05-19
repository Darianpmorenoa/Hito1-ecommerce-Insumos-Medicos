import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { Table, Button } from 'react-bootstrap'
import clienteAxios from '../../api/api'
import '../admin/AdminHome.css'

export default function AdminOrders() {
  const [ordenes, setOrdenes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
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
    obtenerOrdenes()
  }, [])

  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-title">Órdenes de compra</h1>
        <p className="admin-subtitle">Listado de todas las órdenes realizadas.</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="admin-table-actions">
          <Button className="admin-btn-add">+ Nueva orden</Button>
          <Button className="admin-btn-download">⬇ Descargar</Button>
        </div>

        <Table hover responsive className="bg-white rounded shadow-sm">
          <thead style={{ backgroundColor: 'var(--color-dark)', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>Código boleta</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Método de pago</th>
              <th>Estado</th>
              <th>Acciones</th>
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
                  <td>{o.metodo_pago}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${o.estado?.toLowerCase()}`}>
                      {o.estado}
                    </span>
                  </td>
                  <td className="admin-table-btns">
                    <Button size="sm" className="admin-btn-edit">Editar</Button>
                    <Button size="sm" className="admin-btn-delete">Eliminar</Button>
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