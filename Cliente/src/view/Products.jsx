import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoriaActiva = searchParams.get('categoria');
  const { productosLista } = useContext(CartContext);

  const baseProductos = Array.isArray(productosLista) ? productosLista : [];

  const productosFiltrados = categoriaActiva
    ? baseProductos.filter((p) => p.nombre_categoria === categoriaActiva)
    : baseProductos;

  return (
    <Container className="py-4">
      <h2 className="mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}>
        {categoriaActiva ? categoriaActiva : 'Todos los productos'}
      </h2>
      <p className="text-muted mb-4">{productosFiltrados.length} productos encontrados</p>

      <Row>
        {productosFiltrados.map((p) => (
          <Col key={p.id_producto} md={3} className="mb-4">
            <ProductCard 
              id_producto={p.id_producto}
              nombre_producto={p.nombre_producto}
              marca={p.marca}
              imagen={p.imagen}
              precio={p.precio}
              descripcion={p.descripcion}
              stock={p.stock} 
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}