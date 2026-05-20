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
  
      // Guardamos el token en la memoria del navegador inmediatamente
      localStorage.setItem('token', res.data.token);
  
      // contexto y redirección original se mantienen abajo:
      login(res.data.token, res.data.usuario.rol);
      navigate("/");
    } catch (err) {
      setError(`Credenciales incorrectas. Intenta de nuevo.`);
      console.error(err.response?.data);
    }}
    
  return (
    <div className="login">
      <div className="login-card">
        <h1>Bienvenido</h1>
        <p className="subtitle">inicia sesión para continuar</p>

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
