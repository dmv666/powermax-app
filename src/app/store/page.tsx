"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// NUEVO: Importaciones para el carrito y los nuevos componentes
import { useCart, Product } from "@/app/contexts/CartContext";
import ProductCard from "@/components/ui/ProductCard";
import CartSidebar from "@/components/ui/CartSidebar";
import { Badge } from "@/components/ui/badge";

// Componentes de UI y Iconos
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, PlusCircle, UserCircle } from "lucide-react";

export default function StorePage() {
  const { user } = useAuth();
  const router = useRouter();

  // NUEVO: Hooks y estado para el carrito
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // CAMBIO: El tipo `Product` ahora se importa de CartContext
  const [products, setProducts] = useState<Product[]>([]);
  
  // CAMBIO: `newProduct` ahora incluye el campo `description`
  const [newProduct, setNewProduct] = useState<{ name: string; price: string; image: string; description: string }>({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    fetchProducts();
    if (user?.email === "administradores@powermax.com") {
      setIsAdmin(true);
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList: Product[] = querySnapshot.docs.map((document) => {
        const data = document.data() as Omit<Product, "id">;
        return {
          id: document.id,
          name: data.name,
          price: data.price,
          image: data.image,
          // CAMBIO: Se incluye la descripción con un valor por defecto si no existe
          description: data.description || "Sin descripción disponible.",
        };
      });
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    // CAMBIO: Se valida también la descripción
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.description) return;
    
    const priceNumber = parseFloat(newProduct.price);
    if (isNaN(priceNumber)) {
      alert("Por favor, ingresa un número válido en el precio.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: priceNumber,
        image: newProduct.image,
        // CAMBIO: Se añade la descripción a la base de datos
        description: newProduct.description,
      });
      // CAMBIO: Se resetea el estado del formulario completo
      setNewProduct({ name: "", price: "", image: "", description: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setLoading(false);
    }
  };

  const handleViewProfile = () => {
    router.push("/dashboard/profile");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (user === undefined || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
        <div className="relative w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando tienda de PowerMAX...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center group">
            <Image
              src="https://res.cloudinary.com/sdhsports/image/upload/v1742563367/powermax_logo_oficial_awxper.png"
              alt="PowerMAX Logo"
              width={60}
              height={60}
              className="mr-2 rounded-full border-2 group-hover:scale-110 transition-transform"
            />
            <span className="text-2xl font-extrabold tracking-tight hidden sm:block group-hover:text-red-600 transition-colors">PowerMAX</span>
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/rutines" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <Link href="/poseDetection" className="hover:text-gray-600">Detector de Ejercicios</Link>
          </div>
        </div>
        <div className="flex gap-2 items-center">
            {/* NUEVO: Botón para abrir el carrito con contador */}
            <Button variant="outline" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="w-5 h-5" />
                {getItemCount() > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 py-0 text-xs rounded-full">
                        {getItemCount()}
                    </Badge>
                )}
            </Button>
          <Button variant="outline" onClick={handleViewProfile} className="flex items-center gap-2">
            <UserCircle className="w-5 h-5" /> Perfil
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-pink-500" /> Tienda PowerMAX
          </h1>
          {isAdmin && (
            <div className="flex items-center gap-2 bg-white/80 rounded-xl shadow px-4 py-2">
              <PlusCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">Modo administrador</span>
            </div>
          )}
        </div>

        {/* CAMBIO: Se usa el nuevo componente ProductCard para renderizar los productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={isAdmin}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {isAdmin && (
          <div className="mt-12 mx-auto max-w-lg bg-white/90 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-green-600" /> Agregar Producto
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="number"
                placeholder="Precio"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="text"
                placeholder="URL de la imagen"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {/* NUEVO: Campo de texto para la descripción */}
              <textarea
                placeholder="Descripción del producto"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none h-24"
              />
              <Button
                onClick={handleAddProduct}
                className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2 rounded-lg hover:from-pink-500 hover:to-yellow-500 transition-all"
              >
                Agregar producto
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* NUEVO: Componente del Carrito que se muestra u oculta */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}