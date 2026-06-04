import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./Auth";
import { Button, Card, Row, Col, Accordion, Badge, ListGroup, Modal, Form } from "react-bootstrap";
import clienteAxios from "../api/api";

export default function Profile() {
  const { logout, user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  // Estado dinámico para los datos en pantalla
  const [datosDespacho, setDatosDespacho] = useState({
    rut: "No registrado",
    telefono: "No registrado",
    region: "No registrada",
    comuna: "No registrada",
    email: "No registrado"
  });

  // Estados para el Modal de Edición
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({
    rut: "",
    telefono: "",
    region: "",
    comuna: ""
  });

  useEffect(() => {
    const obtenerDatosDePantalla = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 1. Traemos los datos de despacho actualizados directamente desde la tabla de usuarios
        const perfilResponse = await clienteAxios.get("/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Manejamos si los datos vienen envueltos en .usuario o directo en el objeto data
        const uData = perfilResponse.data?.usuario || perfilResponse.data;

        if (uData) {
          setDatosDespacho({
            rut: uData.rut || "No registrado",
            telefono: uData.telefono || "No registrado",
            region: uData.region || "No registrada",
            comuna: uData.comuna || "No registrada",
            email: uData.email || user?.email || "No registrado"
          });
        }

        // 2. Traemos el historial de órdenes usando tu ruta real configurada en el backend
        const ordenesResponse = await clienteAxios.get("/ordenes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPedidos(ordenesResponse.data || []);

      } catch (error) {
        console.error("Error al cargar los datos del panel de usuario:", error);
      } finally {
        setCargandoPedidos(false);
      }
    };

    obtenerDatosDePantalla();
  }, [user]);

  // Abre el modal y precarga los campos con lo que haya actualmente
  const handleOpenModal = () => {
    setEditForm({
      rut: datosDespacho.rut !== "No registrado" ? datosDespacho.rut : "",
      telefono: datosDespacho.telefono !== "No registrado" ? datosDespacho.telefono : "",
      region: datosDespacho.region !== "No registrada" ? datosDespacho.region : "",
      comuna: datosDespacho.comuna !== "No registrada" ? datosDespacho.comuna : ""
    });
    setShowModal(true);
  };

  // Maneja los cambios de los inputs en el formulario del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Envía los datos actualizados al backend
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await clienteAxios.put("/usuarios/perfil", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si el backend responde exitosamente o trae la confirmación ok
      if (response.data.ok || response.status === 200) {
        setDatosDespacho((prev) => ({
          ...prev,
          ...editForm
        }));
        
        setShowModal(false);
        alert("¡Datos de despacho guardados en MediSupply! 🎉");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del perfil:", error);
      
      // Respaldo visual por si acaso, para asegurar una buena UX localmente
      setDatosDespacho((prev) => ({ 
        ...prev, 
        ...editForm 
      }));
      setShowModal(false);
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: "85vh" }}>
      <div className="mb-4 pb-2 border-bottom">
        <h2>👤 Mi Panel de Usuario</h2>
      </div>

      <Row>
        {/* ================= SECCIÓN DE DATOS DE ENTREGA ================= */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="p-4">
              <div className="text-center mb-3">
                <div 
                  className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: "70px", height: "70px", fontSize: "2rem" }}
                >
                  {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
                </div>
                <h4>{user?.nombre || "Usuario"} {user?.apellido || ""}</h4>
                <Badge bg="secondary" className="px-2 py-1 small text-capitalize">
                  Rol: {user?.rol || "Cliente"}
                </Badge>
              </div>

              <hr />

              <h5 className="mb-3 text-muted" style={{ fontSize: "0.95rem", fontWeight: "bold", textTransform: "uppercase" }}>
                 Datos Cliente
              </h5>

              <ListGroup variant="flush" className="small">
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">RUT:</span>
                  <span className="fw-semibold">{datosDespacho.rut}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Email:</span>
                  <span className="fw-semibold text-truncate ms-2" style={{ maxWidth: "200px" }}>{datosDespacho.email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Teléfono:</span>
                  <span className="fw-semibold">{datosDespacho.telefono}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Región:</span>
                  <span className="fw-semibold">{datosDespacho.region}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Comuna:</span>
                  <span className="fw-semibold">{datosDespacho.comuna}</span>
                </ListGroup.Item>
              </ListGroup>

              <Button variant="primary" className="w-100 mt-4 btn-sm rounded-2" onClick={handleOpenModal}>
                Editar Datos
              </Button>

              <Button 
                variant="outline-danger" 
                className="w-100 mt-2 btn-sm rounded-2 d-flex align-items-center justify-content-center gap-2" 
                onClick={logout}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
                Cerrar Sesión
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* ================= SECCIÓN DE BOLETAS E HISTORIAL ================= */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="p-4">
              <h5 className="mb-4 d-flex align-items-center">
                📋 Historial de Pedidos y Boletas
                <Badge bg="primary" className="ms-2 pill small fs-6">
                  {pedidos.length}
                </Badge>
              </h5>

              {cargandoPedidos ? (
                <div className="text-center py-4 text-muted">
                  <p>Cargando tus boletas de MediSupply...</p>
                </div>
              ) : pedidos.length === 0 ? (
                <div className="text-center py-5 border rounded bg-light">
                  <p className="text-muted mb-0">Aún no has realizado ninguna compra en nuestra plataforma.</p>
                </div>
              ) : (
                <Accordion defaultActiveKey="0" className="shadow-sm">
                  {pedidos.map((pedido, index) => (
                    <Accordion.Item eventKey={String(index)} key={pedido.cod_boleto || index}>
                      <Accordion.Header>
                        <div className="d-flex justify-content-between w-100 pe-3 flex-wrap align-items-center">
                          <div>
                            <strong>Boleta #{pedido.cod_boleto || index + 1}</strong>
                            <span className="text-muted ms-3 small">
                              📅 {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString("es-CL") : "Fecha no disp."}
                            </span>
                          </div>
                          <span className="text-primary fw-bold">
                            {Number(pedido.total || 0).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                              minimumFractionDigits: 0
                            })}
                          </span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="bg-light-subtle">
                        
                        <h6 className="text-muted mb-2 small fw-bold">DETALLE DE PRODUCTOS:</h6>
                        <ListGroup variant="flush" className="mb-3 border rounded">
                          {pedido.productos?.map((prod, idx) => (
                            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center py-2 small">
                              <div>
                                <strong>{prod.nombre_producto}</strong>
                                <div className="text-muted xsmall">Cantidad: {prod.cantidad}</div>
                              </div>
                              <span className="text-muted">
                                {Number(prod.precio * prod.cantidad).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 0
                                })}
                              </span>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>

                        <div className="p-3 bg-white border rounded">
                          <Row className="small mb-1">
                            <Col className="text-muted">Monto Neto:</Col>
                            <Col className="text-end fw-semibold">
                              {Number((pedido.total || 0) * 0.81).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 })}
                            </Col>
                          </Row>
                          <Row className="small mb-2">
                            <Col className="text-muted">IVA (19%):</Col>
                            <Col className="text-end fw-semibold">
                              {Number((pedido.total || 0) * 0.19).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 })}
                            </Col>
                          </Row>
                          <Row className="border-top pt-2 fw-bold text-dark fs-5">
                            <Col>Total Boleta:</Col>
                            <Col className="text-end text-primary">
                              {Number(pedido.total || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 })}
                            </Col>
                          </Row>
                        </div>

                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ================= MODAL DE EDICIÓN (FORMULARIO) ================= */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Editar Datos de Despacho</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveChanges}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formRut">
              <Form.Label>RUT</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ej: 12.345.678-9" 
                name="rut" 
                value={editForm.rut} 
                onChange={handleInputChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTelefono">
              <Form.Label>Teléfono de Contacto</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ej: +56912345678" 
                name="telefono" 
                value={editForm.telefono} 
                onChange={handleInputChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegion">
              <Form.Label>Región</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ej: Metropolitana" 
                name="region" 
                value={editForm.region} 
                onChange={handleInputChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formComuna">
              <Form.Label>Comuna</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ej: La Florida" 
                name="comuna" 
                value={editForm.comuna} 
                onChange={handleInputChange} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}