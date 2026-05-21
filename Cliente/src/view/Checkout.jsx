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

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (!tokenGuardado) {
      setErrorMensaje('🚨 No se detectó una sesión activa. Por favor, inicia sesión para comprar.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje('');
    
    if (!cart || cart.length === 0) {
      setErrorMensaje('El carrito está vacío. Agrega insumos médicos antes de pagar.');
      return;
    }

    // Rescatamos el token fresco directo del localStorage al presionar el botón
    const tokenActual = localStorage.getItem('token');
    if (!tokenActual) {
      setErrorMensaje('🚨 No se detectó token de autenticación. Por favor, inicia sesión nuevamente.');
      return;
    }

    setLoading(true);

    try {
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

      const response = await clienteAxios.post('/ordenes', payload, {
        headers: {
          'Authorization': `Bearer ${tokenActual}`
        }
      });

      if (response.status === 201 || response.status === 200 || response.data?.ok) {
        alert("🧾 ¡Pago procesado con éxito! Boleta guardada y stock actualizado en Neon.");
        if (typeof clearCart === 'function') {
          clearCart();
        }
        navigate('/thankYou');
      }
    } catch (error) {
      console.error("Error real en la petición HTTP:", error);
      
      // Si el backend dice "No hay stock" o "Error SQL"
      const mensajeServidor = error.response?.data?.error || error.response?.data?.message;
      setErrorMensaje(
        mensajeServidor 
          ? `❌ Error del Servidor: ${mensajeServidor}` 
          : '❌ Hubo un problema al conectar con el servidor. Inténtalo más tarde.'
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