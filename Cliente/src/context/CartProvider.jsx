import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import clienteAxios from "../api/api";

export const CartProvider = ({ children }) => {
  // Estado original para el carrito con localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [totalCart, setTotalCart] = useState(0);

  // 2. Guarda los productos que vienen de la base de datos
  const [productosLista, setProductosLista] = useState([]);

  // 3. Conexión con la API de Render/Neon para traer el catálogo
  const obtenerProductos = async () => {
    try {
      const res = await clienteAxios.get('/productos');
      setProductosLista(res.data.result || res.data);
    } catch (error) {
      console.error("Error al cargar el catálogo desde el Backend:", error);
    }
  };

  // 4. NUEVO EFFECT: Llama a los productos automáticamente al abrir la aplicación
  useEffect(() => {
    obtenerProductos();
  }, []);

  // Efecto para actualizar totales y localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const newTotal = cart.reduce((acc, item) => acc + item.precio * item.count, 0);
    setTotalCart(newTotal);
  }, [cart]);

  // Función para añadir al carrito
  const addToCart = (product) => {
    const foundProduct = cart.find((item) => item.id_producto === product.id_producto);
    if (foundProduct) {
      setCart(cart.map((item) =>
        item.id_producto === product.id_producto
          ? { ...item, count: item.count + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, count: 1 }]);
    }
  };

  // Función para remover del carrito
  const removeFromCart = (id_producto) => {
    const foundProduct = cart.find((item) => item.id_producto === id_producto);
    if (!foundProduct) return;
    if (foundProduct.count > 1) {
      setCart(cart.map((item) =>
        item.id_producto === id_producto
          ? { ...item, count: item.count - 1 }
          : item
      ));
    } else {
      setCart(cart.filter((item) => item.id_producto !== id_producto));
    }
  };

  // Función original para vaciar el carrito
  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        setCart, 
        addToCart, 
        removeFromCart, 
        totalCart, 
        clearCart,
        productosLista
      }}
    >
      {children}
    </CartContext.Provider>
  );
};