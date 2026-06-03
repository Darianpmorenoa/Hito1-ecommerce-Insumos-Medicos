import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Table, Button, Badge } from 'react-bootstrap';
import clienteAxios from '../../api/api';
import '../admin/AdminHome.css';
import AdminProductModals from './AdminProductModals';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

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

  // Abre el modal listo para CREAR un producto nuevo
  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setShowModal(true);
  };

  // Abre el modal listo para EDITAR cargando el producto seleccionado
  const handleOpenEditModal = (producto) => {
    setProductToEdit(producto);
    setShowModal(true);
  };

  // Cierra el modal y limpia el producto en edición
  const handleCloseModal = () => {
    setProductToEdit(null);
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-title">Productos</h1>
        <p className="admin-subtitle">Listado completo de productos en el inventario.</p>

        <div className="admin-table-actions">
          <Button className="admin-btn-add" onClick={handleOpenAddModal}>
            + Nuevo producto
          </Button>
        </div>

        {showModal && (
          <AdminProductModals 
            show={showModal} 
            handleClose={handleCloseModal} 
            refreshProductos={obtenerProductos}
            productToEdit={productToEdit} 
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
              <th>Disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
                  No hay productos en el inventario o cargando...
                </td>
              </tr>
            ) : (
              productos.map((p) => {
                const stockNumerico = Number(p.stock) || 0;
                return (
                  <tr key={p.id_producto}>
                    <td>{p.id_producto}</td>
                    <td>{p.nombre_producto}</td>
                    <td>{p.nombre_categoria || 'Sin categoría'}</td>
                    <td>{p.marca}</td>
                    
                    <td>
                      {p.precio 
                        ? Number(p.precio).toLocaleString('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }) 
                        : '$0'}
                    </td>

                    {/* COLUMNA DE DISPONIBILIDAD MEDIANTE BADGES DINÁMICOS */}
                    <td>
                      <span className={`admin-badge ${stockNumerico > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-2 py-1 rounded small fw-bold`}>
                        {stockNumerico > 0 ? `En Stock (${stockNumerico})` : 'Agotado'}
                      </span>
                    </td>

                    <td className="admin-table-btns">
                      {/* BOTÓN PRINCIPAL: AHORA LA EDICIÓN ES LA ENCARGADA DE SUBIR/BAJAR EL STOCK */}
                      <Button 
                        size="sm" 
                        className="admin-btn-edit me-2"
                        onClick={() => handleOpenEditModal(p)}
                      >
                        Editar 
                      </Button>
                      
                      {/* REEMPLAZO: El botón Activar/Desactivar ahora es un Badge puramente informativo y estético */}
                      <Badge 
                        bg={stockNumerico > 0 ? "success" : "danger"}
                        className="py-2 px-3 small d-inline-block text-center shadow-sm"
                        style={{ minWidth: '110px', fontSize: '0.78rem' }}
                      >
                        {stockNumerico > 0 ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </main>
    </div>
  );
}