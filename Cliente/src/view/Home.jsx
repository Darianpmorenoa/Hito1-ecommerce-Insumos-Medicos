import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import clienteAxios from '../api/api';
import { Link } from "react-router-dom";


function Home() {

  const [productos, setProductos] = useState([]);

  useEffect(() => {

    const obtenerProductos = async () => {

      try {
        const response = await clienteAxios.get('/productos');
        setProductos(response.data);

      } catch (error) {
        console.error(error);

      }
    };

    obtenerProductos();

  }, []);


const productosDestacados = productos.slice(0, 4);

  return (
    <main>
      <Hero />
      <section id="productos-galeria" className="py-5">
        <Container>
          <h2 className="fw-bold mb-4">Productos Recomendados</h2>
          <Row xs={1} sm={2} md={4} className="g-4">
            {productosDestacados.map((p) => (
              <Col key={p.id_producto}>
                <ProductCard
                  id_producto={p.id_producto}
                  nombre_producto={p.nombre_producto}
                  marca={p.marca}
                  imagen={p.imagen}
                  precio={p.precio}
                  descripcion={p.descripcion}
                />
              </Col>
            ))}
          </Row>

          <div className="text-center mt-4">
            <Link to="/productos">
              <button className="btn btn-primary px-4 py-2">
                Ver catálogo completo →
              </button>
            </Link>
          </div>

        </Container>
      </section>
    </main>
  )
}

export default Home;

