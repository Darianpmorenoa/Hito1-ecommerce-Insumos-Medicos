import React, { useState, useContext } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje('');
    
    if (!cart || cart.length === 0) {
      setErrorMensaje('El carrito está vacío. Agrega insumos médicos antes de pagar.');
      return;
    }

    // Rescatamos el token de autenticación del usuario logueado
    const token = localStorage.getItem('token'); 
    if (!token) {
      setErrorMensaje('Debes iniciar sesión para poder procesar tu compra.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Mapeamos los datos del carrito para que cuadren con la consulta SQL
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

      // Pasamos el token en los headers como tercer parámetro en Axios
      const response = await clienteAxios.post('/ordenes', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Validamos la respuesta exitosa del backend unificado en CommonJS
      if (response.status === 201 || response.status === 200 || response.data?.ok) {
        alert("🧾 ¡Pago procesado con éxito! Boleta guardada y stock actualizado en Neon.");
        clearCart();
        navigate('/ThankYou');
      }
    } catch (error) {
      console.error("Error al registrar el checkout en Neon:", error);
      setErrorMensaje(
        error.response?.data?.message || 
        'Hubo un problema de conexión con el servidor al registrar tu compra.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="checkout-container">
      <div className="checkout-form-section">
        <h2>Finalizar Compra</h2>
        
        {errorMensaje && <div className="checkout-alert-error" style={{color: 'red', marginBottom: '15px'}}>{errorMensaje}</div>}

        <form className="checkout-form" onSubmit={handleSubmit}>
          
          <section className="form-group">
            <h3>1. Información de Envío</h3>
            <div className="fila-inputs">
              <input type="text" placeholder="Nombre" required />
              <input type="text" placeholder="Apellido" required />
            </div>
            <input type="text" placeholder="Dirección (Calle, número, depto)" required />
            <div className="fila-inputs">
              <input type="text" placeholder="Ciudad / Comuna" required />
              <input type="text" placeholder="Región" required />
            </div>
            <input type="tel" placeholder="Teléfono de contacto" required />
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

          <button type="submit" className="confirmar-btn" disabled={loading}>
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