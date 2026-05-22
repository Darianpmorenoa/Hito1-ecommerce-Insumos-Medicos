import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Auth'
import clienteAxios from '../../api/api'
import './AdminLogin.css'

export default function AdminLogin() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
  
    try {
      const res = await clienteAxios.post('/usuarios/login', { email, password })
      if (res.data.usuario.rol !== 'admin') {
        setError('No tienes permisos de administrador.')
        return
      }
      login(res.data.token, res.data.usuario.rol)
      navigate('/admin/home')
    } catch {
      setError('Credenciales incorrectas.')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-brand">
        <h1>Medi<span>Supply</span></h1>
        <p>Panel de administración</p>
      </div>

      <div className="admin-login-card">
        <h2>Acceso corporativo</h2>
        <p className="admin-login-subtitle">Ingresa tus credenciales para continuar</p>

        {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@medisupply.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-btn">Ingresar</button>
        </form>
      </div>
    </div>
  )
}