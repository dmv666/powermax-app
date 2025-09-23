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
    [key: string]: unknown;
  } | null;
}

export default function ProductModal({ open, onClose, product }: ProductModalProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 z-50">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            src={product.image}
            alt={product.name}
            width={180}
            height={180}
            className="rounded-xl object-cover"
          />
          <div className="flex-1 flex flex-col items-start">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-lg font-semibold text-blue-600 mb-2">${product.price}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            {/* Aquí puedes agregar más propiedades si las tienes */}
          </div>
        </div>
      </div>
    </Dialog>
  );
}