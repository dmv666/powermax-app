"use client";

import { useCart } from "@/app/contexts/CartContext";
import { Button } from "./button";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, removeFromCart, getCartTotal } = useCart();

  const handlePayment = async () => {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cartItems }),
    });
    const data = await response.json();
    if (response.ok) {
      const stripe = await stripePromise;
      await stripe!.redirectToCheckout({ sessionId: data.id });
    } else {
      console.error(data.error);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-2xl font-bold">Tu Carrito</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">Tu carrito está vacío.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover"/>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700">
                Pagar
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}