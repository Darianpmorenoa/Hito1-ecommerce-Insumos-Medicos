import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaCheckCircle, FaDownload, FaHome } from "react-icons/fa";
import "./ThankYou.css";

export default function ThankYou() {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleDownload = () => {
    alert("Generando comprobante de pago... (PDF)");
  };

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <div className="check-icon">
          <FaCheckCircle size={80} color="#20c997" />
        </div>

        <h1>Gracias</h1>
        <h2>Tu orden está siendo procesada</h2>

        <p className="thankyou-text">
          Hemos recibido tu pedido de insumos médicos con éxito. Recibirás un
          correo electrónico con los detalles de tu compra y el número de
          seguimiento una vez que el despacho sea confirmado.
        </p>

        <div className="thankyou-actions">
          <button type="button" onClick={handleDownload} className="btn-comprobante">
            <FaDownload /> Descargar comprobante
          </button>

          <button type="button" onClick={() => navigate("/")} className="btn-home">
            <FaHome /> Volver al Home
          </button>
        </div>
      </div>
    </div>
  );
}
