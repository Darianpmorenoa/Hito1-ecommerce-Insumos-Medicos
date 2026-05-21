import { createContext, useState } from "react";

export const AuthContext = createContext();

// Verifica si el token existe y no ha expirado
const tokenValido = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(tokenValido());
  const [rol, setRol] = useState(() => tokenValido() ? localStorage.getItem('rol') : null);

  const login = (token, rolUsuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rolUsuario);
    setIsLogged(true);
    setRol(rolUsuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setIsLogged(false);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ isLogged, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};