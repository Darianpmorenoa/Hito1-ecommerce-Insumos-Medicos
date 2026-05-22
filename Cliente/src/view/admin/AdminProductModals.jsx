import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import clienteAxios from '../../api/api';

export default function AdminProductModals({ show, handleClose, refreshProductos }) {
  
  // Estado inicializado con los campos del formulario
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    id_categoria: '',
    marca: '',
    precio: '',
    descripcion: '',
    imagen_url: ''
  });

  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nuevoProducto.id_categoria) {
      alert("Por favor, selecciona una categoría para el producto.");
      return;
    }

    // ASEGURAMOS LOS DATOS ANTES DE ENVIAR
    const datosAEnviar = {
      ...nuevoProducto,
      id_categoria: parseInt(nuevoProducto.id_categoria, 10),
      // Si la imagen está vacía, link por defecto para que no se caiga la BD
      imagen_url: nuevoProducto.imagen_url.trim() || 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80'
    };

    try {
      // Enviamos los datos limpios y preparados
      await clienteAxios.post('/productos', datosAEnviar);
      
      alert('¡Producto agregado con éxito! 🚀');
      refreshProductos();
      handleClose();     
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert(error.response?.data?.error || error.response?.data?.message || "Hubo un error al guardar el producto.");
    }
  }; 

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          
          {/* 1. Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control 
              type="text" 
              name="nombre_producto" 
              value={nuevoProducto.nombre_producto} 
              onChange={handleChange} 
              placeholder="Ej: Jeringa 10ml"
              required 
            />
          </Form.Group>

          {/* 2. Categoría con Menú Desplegable (Select) */}
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
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
            <Form.Label>Marca</Form.Label>
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
            <Form.Label>Precio ($)</Form.Label>
            <Form.Control 
              type="number" 
              name="precio" 
              value={nuevoProducto.precio} 
              onChange={handleChange} 
              placeholder="Ej: 4500"
              required 
            />
          </Form.Group>

          {/* 5. Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
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

          {/* 6. Imagen */}
          <Form.Group className="mb-3">
            <Form.Label>URL de la Imagen</Form.Label>
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
            Guardar Producto
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}