import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { Table, Button } from 'react-bootstrap'
import clienteAxios from '../../api/api'
import '../admin/AdminHome.css'

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await clienteAxios.get('/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUsuarios(res.data)
      } catch {
        setError('No se pudo cargar la lista de usuarios.')
      }
    }
    obtenerUsuarios()
  }, [])

  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-title">Usuarios</h1>
        <p className="admin-subtitle">Listado de clientes registrados en la plataforma.</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Table hover responsive className="bg-white rounded shadow-sm">
          <thead style={{ backgroundColor: 'var(--color-dark)', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  {error ? error : 'Cargando usuarios...'}
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre} {u.apellido}</td>
                  <td>{u.email}</td>
                  <td>{u.telefono}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${u.rol}`}>
                      {u.rol}
                    </span>
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