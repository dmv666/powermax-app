import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Image from "next/image";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number | string;
    image: string;
    description: string;
    calories?: number;
    protein?: number;
    [key: string]: unknown;
  } | null;
}

export default function ProductModal({ open, onClose, product }: ProductModalProps) {
  if (!product) return null;

  const formattedPrice = Number(product.price).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 z-50 flex flex-row gap-8 items-center">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-shrink-0 flex items-center justify-center w-64 h-64">
          <Image
            src={product.image}
            alt={product.name}
            width={220}
            height={220}
            className="rounded-xl object-contain bg-gray-50 shadow max-h-56"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{product.name}</h2>
          <p className="text-xl font-semibold text-blue-600 mb-4">{formattedPrice}</p>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line overflow-y-auto max-h-64 pr-2">
            {product.description}
          </div>
          {/* Información adicional si existe */}
          {product.calories && (
            <p className="text-sm text-gray-600 mt-4">Calorías: <span className="font-semibold">{product.calories}</span></p>
          )}
          {product.protein && (
            <p className="text-sm text-gray-600">Proteína: <span className="font-semibold">{product.protein}g</span></p>
          )}
        </div>
      </div>
    </Dialog>
  );
}