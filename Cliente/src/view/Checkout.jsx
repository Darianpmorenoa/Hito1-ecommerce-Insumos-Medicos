import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import clienteAxios from '../api/api';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalCart, clearCart } = useContext(CartContext);
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [tokenActivo, setTokenActivo] = useState('');

  // Sincronización exacta con localStorage al cargar el componente
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (!tokenGuardado) {
      setErrorMensaje('🚨 No se detectó una sesión activa. Por favor, inicia sesión para comprar.');
    } else {
      setTokenActivo(tokenGuardado);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje('');
    
    if (!cart || cart.length === 0) {
      setErrorMensaje('El carrito está vacío. Agrega insumos médicos antes de pagar.');
      return;
    }

    // Rescatamos el token asegurando que use la variable correcta
    const tokenActual = localStorage.getItem('token') || tokenActivo;
    if (!tokenActual) {
      setErrorMensaje('🚨 No se detectó token de autenticación. Por favor, inicia sesión nuevamente.');
      return;
    }

    setLoading(true);

    try {
      // Mapeamos los datos para que coincidan con tus consultas en Neon
      const productosPayload = cart.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.count || 1,
        precio: item.precio
      }));

      const payload = {
        productos: productosPayload,
        total: totalCart,
        metodo_pago: metodoPago
      };

      // Pasamos la variable correcta 'tokenActual' y dentro de los paréntesis
      const response = await clienteAxios.post('/ordenes', payload, {
        headers: {
          'Authorization': `Bearer ${tokenActual}`
        }
      });

      // Validamos los estados de respuesta exitosos del backend
      if (response.status === 201 || response.status === 200 || response.data?.ok) {
        alert("🧾 ¡Pago procesado con éxito! Boleta guardada y stock actualizado en Neon.");
        
        if (typeof clearCart === 'function') {
          clearCart();
        }
        navigate('/ThankYou');
      }
    } catch (error) {
      console.error("Error al registrar el checkout en Neon:", error);
      setErrorMensaje(
        error.response?.data?.message || 
        'Error de autorización (401). Intenta cerrar sesión e ingresar nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form-section">
        <h2>Finalizar Compra</h2>
        
        {errorMensaje && (
          <div className="checkout-alert-error" style={{ color: 'red', fontWeight: 'bold', marginBottom: '15px' }}>
            {errorMensaje}
          </div>
        )}

        <form className="checkout-form" onSubmit={handleSubmit}>
          
          <section className="form-group">
            <h3>1. Información de Envío</h3>
            <div className="fila-inputs">
              <input type="text" placeholder="Nombre" required defaultValue="darian" />
              <input type="text" placeholder="Apellido" required defaultValue="moreno" />
            </div>
            <input type="text" placeholder="Dirección (Calle, número, depto)" required defaultValue="Viña del Huerto Ote." />
            <div className="fila-inputs">
              <input type="text" placeholder="Ciudad / Comuna" required defaultValue="Puente Alto" />
              <input type="text" placeholder="Región" required defaultValue="metropolitana" />
            </div>
            <input type="tel" placeholder="Teléfono de contacto" required defaultValue="939180836" />
          </section>

          <section className="form-group">
            <h3>2. Método de Pago</h3>
            <div className="payment-options">
              <label className={`payment-card ${metodoPago === 'tarjeta' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={metodoPago === 'tarjeta'}
                  onChange={() => setMetodoPago('tarjeta')}
                  required
                />
                Tarjeta de Crédito/Débito
              </label>

              <label className={`payment-card ${metodoPago === 'transferencia' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={metodoPago === 'transferencia'}
                  onChange={() => setMetodoPago('transferencia')}
                />
                Transferencia Bancaria
              </label>
            </div>
          </section>

          <button 
            type="submit" 
            className="confirmar-btn" 
            disabled={loading}
          >
            {loading ? 'Procesando Compra...' : `Pagar Ahora ($${totalCart?.toLocaleString('es-CL')})`}
          </button>
        </form>
      </div>

      <aside className="checkout-summary-section">
        <h3>Resumen</h3>
        <p>Total de productos: {cart?.length || 0}</p>
        <hr />
        <h4>Total a pagar: <strong>${totalCart?.toLocaleString('es-CL')}</strong></h4>
      </aside>
    </div>
  );
}