import { useContext } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import './ProductCard.css';

const ProductCard = ({ nombre_producto, marca, imagen, precio, id_producto, descripcion }) => {
  const { addToCart } = useContext(CartContext);

  const productData = { nombre_producto, marca, imagen, precio, id_producto, descripcion };

  return (
    <div className="product-card h-100 shadow-sm card">
      <div className="product-card-img">
        {imagen ? (
          <img src={imagen} alt={nombre_producto} className="card-img-top" />
        ) : (
          <span className="d-block text-center p-4 fs-1">🩺</span>
        )}
      </div>
      
      <div className="product-card-body card-body d-flex flex-column">
        <h6 className="product-card-name card-title text-dark fw-bold">{nombre_producto}</h6>
        <small className="product-card-brand text-muted mb-2">{marca}</small>
        
        <div className="mt-auto">
          <p className="product-card-price fw-bold text-primary fs-5">
          ${precio ? Number(precio).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
          </p>

          <div className="d-grid gap-2">
            <Link to={`/producto/${id_producto}`}>
              <Button 
                variant="outline-primary" 
                className="w-100 fw-bold"
              >
                Ver detalles 👀
              </Button>
            </Link>

            <Button 
              className="product-card-btn btn-dark w-100 fw-bold"
              onClick={() => addToCart(productData)}
            >
              Añadir al carrito 🛒
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;