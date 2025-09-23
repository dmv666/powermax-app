// components/ui/ProductCard.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Product, useCart } from "@/app/contexts/CartContext";

type ProductCardProps = {
  product: Product;
  isAdmin: boolean;
  onDelete: (id: string) => void;
};

export default function ProductCard({ product, isAdmin, onDelete }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative rounded-3xl shadow-xl bg-white/90 hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100">
      {/* Contenedor de la Imagen */}
      <div className="relative w-full h-64">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300"
        />
      </div>

      {/* Contenido Fijo (Visible Siempre) */}
      <div className="p-5 flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-800 truncate">{product.name}</h2>
        <p className="text-lg text-indigo-600 font-semibold">${product.price.toFixed(2)}</p>
      </div>

      {/* Overlay con Descripción y Botón (Aparece en Hover) */}
      <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div>
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            {product.description.length > 180
          ? product.description.slice(0, 180) + "..."
          : product.description}
          </p>
        </div>
        <Button
          onClick={e => {
            e.stopPropagation(); // <-- Esto evita que se abra el modal
            addToCart(product);
          }}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold flex items-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          Añadir al Carrito
        </Button>
      </div>
        
      {/* Botón de eliminar para el admin */}
      {isAdmin && (
        <Button
          onClick={e => {
             e.stopPropagation();
             onDelete(product.id);
          }}
          variant="ghost"
          className="absolute top-3 right-3 bg-white/80 hover:bg-red-100 p-2 rounded-full shadow transition z-10"
          title="Eliminar producto"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </Button>
      )}
    </div>
  );
}