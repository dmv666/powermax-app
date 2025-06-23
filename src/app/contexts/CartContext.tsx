"use client";

import { createContext, useState, useContext, ReactNode, } from "react";

// Definimos el tipo para un producto en el carrito (incluye cantidad)
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Definimos el tipo para el valor del contexto
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
};

// Tipo para el producto base (lo importaremos en otros archivos)
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string; // Añadimos la descripción
};

// Creamos el Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Creamos el Proveedor del Contexto (Provider)
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Lógica para añadir al carrito
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Si ya existe, incrementamos la cantidad
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Si es nuevo, lo añadimos con cantidad 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Lógica para eliminar del carrito
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };
    
  // Limpiar todo el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular el total
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Contar el número de items
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};