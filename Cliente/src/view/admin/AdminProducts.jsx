import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Table, Button } from 'react-bootstrap';
import clienteAxios from '../../api/api';
import '../admin/AdminHome.css';

export default function AdminProducts() {

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

  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-title">Productos</h1>
        <p className="admin-subtitle">Listado completo de productos en el inventario.</p>

        <div className="admin-table-actions">
          <Button className="admin-btn-add">+ Nuevo producto</Button>
        </div>

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
            {productos.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.id_producto}</td>
                <td>{p.nombre_producto}</td>
                <td>{p.nombre_categoria}</td>
                <td>{p.marca}</td>
                <td>${p.precio.toLocaleString('es-CL')}</td>
                <td className="admin-table-btns">
                  <Button size="sm" className="admin-btn-edit">Editar</Button>
                  <Button size="sm" className="admin-btn-delete">Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </main>
    </div>
  )
}