import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./Auth";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import clienteAxios from "../api/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const res = await clienteAxios.post("/usuarios/login", {
        email,
        password,
      });
  
      // 1. Guardamos el token en la memoria del navegador inmediatamente
      localStorage.setItem('token', res.data.token);
  
      // 2. Sincronizamos el estado global de autenticación
      login(res.data.token, res.data.usuario.rol);
  
      const rolUsuario = res.data.usuario.rol ? res.data.usuario.rol.toLowerCase() : "";

      if (rolUsuario === 'admin') {
        navigate("/admin/home");
      } else {
        navigate("/");
      }
  
    } catch (err) {
      console.error(err.response?.data);

      // Verificamos si el backend envió una respuesta estructurada de error
      if (err.response && err.response.data) {
        const { error_type, error: mensajeBackend } = err.response.data;

        // Tipo de error específico según la respuesta del controlador
        if (error_type === "EMAIL_NOT_FOUND") {
          setError(`📧 ${mensajeBackend}`);
        } else if (error_type === "INVALID_PASSWORD") {
          setError(`🔒 ${mensajeBackend}`);
        } else {
          setError(mensajeBackend || "Credenciales incorrectas. Intenta de nuevo.");
        }
      } else {
        // En caso de que el backend local o en Render esté apagado/caído
        setError("No se pudo conectar con el servidor. Inténtalo más tarde.");
      }
    }
  };
    
  return (
    <div className="login">
      <div className="login-card">
        <h1>Bienvenido</h1>
        <p className="subtitle">inicia sesión para continuar</p>

        {/* Mensaje de error dinámico en color rojo */}
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <label>Password</label>
            <div className="ojo">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="full-width-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="ojo-icono"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="olvide-password">
            <Link to="/reset-password">Olvidé mi contraseña</Link>
          </div>

          <button type="submit" className="login-btn">
            Iniciar sesión
          </button>
        </form>

        <p className="register-text">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate acá</Link>
        </p>
      </div>
    </div>
  );
}