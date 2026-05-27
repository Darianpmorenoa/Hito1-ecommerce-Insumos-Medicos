import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { CartContext } from '../../context/CartContext'
import './AdminHome.css'

const secciones = [
  { label: 'Productos',          to: '/admin/productos', descripcion: 'Gestiona el inventario' },
  { label: 'Órdenes de compra',  to: '/admin/ordenes',   descripcion: 'Revisa y actualiza pedidos' },
  { label: 'Usuarios',           to: '/admin/usuarios',  descripcion: 'Administra los clientes' },
]

export default function AdminHome() {
  const navigate = useNavigate()

  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-title">Bienvenido, Admin</h1>
        <p className="admin-subtitle">Desde aquí puedes gestionar toda la plataforma.</p>

        <div className="admin-home-cards">
          {secciones.map(({ label, to, descripcion }) => (
            <div key={to} className="admin-home-card" onClick={() => navigate(to)}>
              <h3>{label}</h3>
              <p>{descripcion}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}