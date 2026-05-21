import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge, Card, ListGroup } from "react-bootstrap";
import clienteAxios from "../api/api"; 
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams(); 
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);


 useEffect(() => {

    const obtenerProducto = async () => {
      
      try {
        const response = await clienteAxios.get(`/productos/${id}`);
        setProduct(response.data);

      } catch (error) {
        console.error(error);

      }
    };

    obtenerProducto();

  }, [id]);


  if (!product) {
    return (
      <Container className="text-center py-5">
        <h2 className="mt-5">Producto no encontrado 🔍</h2>
        <Link to="/">
          <Button variant="primary" className="mt-3">Volver a la tienda</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <nav className="mb-4">
        <Link to="/" className="text-decoration-none text-muted small">
          🏠 Home
        </Link> 
        <span className="mx-2 text-muted">/</span> 
        <span className="small text-primary fw-bold">{product.nombre_producto}</span>
      </nav>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm p-4 h-100 d-flex align-items-center justify-content-center bg-white">
            <Card.Img 
              variant="top" 
              src={product.imagen} 
              alt={product.nombre_producto}
              className="img-fluid rounded"
              style={{ maxHeight: "450px", objectFit: "contain" }}
            />
          </Card>
        </Col>

        <Col lg={6}>
          <div className="ps-lg-4">
            <Badge bg="info" className="mb-2 text-dark px-3 py-2">{product.marca}</Badge>
            <h1 className="fw-bold mb-3">{product.nombre_producto}</h1>
            
            <div className="mb-4">
              <h3 className="text-primary fw-bold">
                ${product.precio.toLocaleString("es-CL")}
              </h3>
              <p className="text-muted small">Precio con IVA incluido e impuestos locales.</p>
            </div>

            <Card className="border-0 bg-light mb-4">
              <Card.Body>
                <h6 className="fw-bold text-uppercase small text-muted mb-3">Descripción General</h6>
                <p className="mb-0 fs-6" style={{ textAlign: "justify" }}>
                  {product.descripcion}
                </p>
              </Card.Body>
            </Card>
            
            <h6 className="fw-bold text-uppercase small text-muted mb-3">Especificaciones Técnicas</h6>
            <ListGroup variant="flush" className="shadow-sm rounded border">
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">SKU</span>
                <span className="fw-bold">{product.id_producto}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">Categoría</span>
                <span className="fw-bold">{product.nombre_categoria || product.id_categoria}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">Garantía</span>
                <span className="fw-bold text-success">12 meses</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">Disponibilidad</span>
                <span className="fw-bold text-primary">En Stock</span>
              </ListGroup.Item>
            </ListGroup>

            <div className="d-grid gap-3 mt-5">
              <Button 
                variant="dark" 
                size="lg" 
                className="fw-bold py-3 shadow"
                onClick={() => addToCart(product)}
              >
                Añadir al Carrito 🛒
              </Button>
              <Link to="/" className="btn btn-outline-secondary btn-lg fw-bold">
                Seguir comprando
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
