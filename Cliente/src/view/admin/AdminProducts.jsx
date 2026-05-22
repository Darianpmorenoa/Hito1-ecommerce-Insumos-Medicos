import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Table, Button } from 'react-bootstrap';
import clienteAxios from '../../api/api';
import '../admin/AdminHome.css';
import AdminProductModals from './AdminProductModals';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Para traer los productos desde Neon
  const obtenerProductos = async () => {
    try {
      const response = await clienteAxios.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    obtenerProductos();
  }, []);

  //Borra en la base de datos y actualiza la pantalla al instante
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto del inventario?")) {
      return;
    }

    try {
      const response = await clienteAxios.delete(`/productos/${id}`);
      if (response.status === 200) {
        alert("Producto eliminado con éxito.");
        setProductos(productos.filter((p) => p.id_producto !== id));
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto. Intente nuevamente.");
    }
  };
  
  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-title">Productos</h1>
        <p className="admin-subtitle">Listado completo de productos en el inventario.</p>

        <div className="admin-table-actions">
          {/* Al hacer clic, pasamos el estado a true para renderizar el modal */}
          <Button className="admin-btn-add" onClick={() => setShowAddModal(true)}>
            + Nuevo producto
          </Button>
        </div>

        {showAddModal && (
          <AdminProductModals 
            show={showAddModal} 
            handleClose={() => setShowAddModal(false)} 
            refreshProductos={obtenerProductos}
          />
        )}

        <Table hover responsive className="bg-white rounded shadow-sm">
          <thead style={{ backgroundColor: 'var(--color-dark)', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  No hay productos en el inventario o cargando...
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id_producto}>
                  <td>{p.id_producto}</td>
                  <td>{p.nombre_producto}</td>
                  <td>{p.nombre_categoria || 'Sin categoría'}</td>
                  <td>{p.marca}</td>
                  <td>${p.precio ? p.precio.toLocaleString('es-CL') : '0'}</td>
                  <td className="admin-table-btns">
                    <Button size="sm" className="admin-btn-edit">Editar</Button>
                    <Button 
                      size="sm" 
                      className="admin-btn-delete" 
                      onClick={() => handleDeleteProduct(p.id_producto)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </main>
    </div>
  );
}