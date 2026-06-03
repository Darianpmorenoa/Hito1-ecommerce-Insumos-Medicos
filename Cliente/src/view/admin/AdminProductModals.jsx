import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import clienteAxios from '../../api/api';

export default function AdminProductModals({ show, handleClose, refreshProductos, productToEdit }) {
  
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    id_categoria: '',
    marca: '',
    precio: '',
    descripcion: '',
    imagen_url: '',
    stock: 0
  });

  // useEffect para detectar si el modal se abre en modo edición o creación
  useEffect(() => {
    if (productToEdit) {
      setNuevoProducto({
        nombre_producto: productToEdit.nombre_producto || '',
        id_categoria: productToEdit.id_categoria || '',
        marca: productToEdit.marca || '',
        precio: productToEdit.precio || '',
        descripcion: productToEdit.descripcion || '',
        imagen_url: productToEdit.imagen || '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 0
      });
    } else {
      // Modo Creación: Limpiamos todos los campos del formulario
      setNuevoProducto({
        nombre_producto: '',
        id_categoria: '',
        marca: '',
        precio: '',
        descripcion: '',
        imagen_url: '',
        stock: 0
      });
    }
  }, [productToEdit, show]);

  const handleChange = (e) => {
    const valor = e.target.name === 'stock' ? Number(e.target.value) : e.target.value;

    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: valor
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nuevoProducto.id_categoria) {
      alert("Por favor, selecciona una categoría para el producto.");
      return;
    }
    
    const datosAEnviar = {
      ...nuevoProducto,
      id_categoria: parseInt(nuevoProducto.id_categoria, 10),
      precio: parseFloat(nuevoProducto.precio),
      stock: parseInt(nuevoProducto.stock, 10) || 0,
      imagen_url: nuevoProducto.imagen_url.trim() || 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80'
    };

    try {
      if (productToEdit) {
        // MODO EDICIÓN: al endpoint PUT /productos/:id
        await clienteAxios.put(`/productos/${productToEdit.id_producto}`, datosAEnviar);
        alert('¡Producto e inventario actualizados con éxito! 🔄');
      } else {
        // MODO CREACIÓN: al endpoint POST /productos
        await clienteAxios.post('/productos', datosAEnviar);
        alert('¡Producto agregado al inventario con éxito! 🚀');
      }
      
      refreshProductos();
      handleClose();     
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert(error.response?.data?.error || error.response?.data?.message || "Hubo un error al guardar el producto.");
    }
  }; 

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {productToEdit ? 'Editar Producto / Inventario' : 'Agregar Nuevo Producto'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          
          {/* 1. Nombre */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nombre del Producto</Form.Label>
            <Form.Control 
              type="text" 
              name="nombre_producto" 
              value={nuevoProducto.nombre_producto} 
              onChange={handleChange} 
              placeholder="Ej: Jeringa 10ml"
              required 
            />
          </Form.Group>

          {/* 2. Categoría */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Categoría</Form.Label>
            <Form.Select 
              name="id_categoria" 
              value={nuevoProducto.id_categoria} 
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona una Categoría --</option>
              <option value="1">Salud</option>
              <option value="2">Quirófano</option>
              <option value="3">Terapia</option>
              <option value="4">Higiene</option>
              <option value="5">Diagnóstico</option>
            </Form.Select>
          </Form.Group>

          {/* 3. Marca */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Marca</Form.Label>
            <Form.Control 
              type="text" 
              name="marca" 
              value={nuevoProducto.marca} 
              onChange={handleChange} 
              placeholder="Ej: Medline"
              required 
            />
          </Form.Group>

          {/* 4. Precio */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Precio ($)</Form.Label>
            <Form.Control 
              type="number" 
              name="precio" 
              value={nuevoProducto.precio} 
              onChange={handleChange} 
              placeholder="Ej: 4500"
              required 
            />
          </Form.Group>

          {/* 5. CANTIDAD EN STOCK (NUEVO CAMPO INYECTADO) */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-primary">Cantidad en Stock (Inventario)</Form.Label>
            <Form.Control 
              type="number" 
              name="stock" 
              min="0"
              value={nuevoProducto.stock} 
              onChange={handleChange} 
              placeholder="Ej: 10"
              required 
            />
            <Form.Text className="text-muted">
              Si dejas el stock en 0, pasará automáticamente a estado "Inactivo" en la tienda.
            </Form.Text>
          </Form.Group>

          {/* 6. Descripción */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descripción</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="descripcion" 
              value={nuevoProducto.descripcion} 
              onChange={handleChange} 
              placeholder="Escribe los detalles técnicos..."
              required 
            />
          </Form.Group>

          {/* 7. Imagen */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">URL de la Imagen</Form.Label>
            <Form.Control 
              type="text" 
              name="imagen_url" 
              placeholder="https://ejemplo.com/imagen.jpg" 
              value={nuevoProducto.imagen_url} 
              onChange={handleChange} 
            />
          </Form.Group>

        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {productToEdit ? 'Guardar Cambios' : 'Guardar Producto'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}