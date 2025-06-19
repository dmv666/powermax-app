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
  doc
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, PlusCircle, UserCircle } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function StorePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<{ name: string; price: string; image: string }>({
    name: "",
    price: "",
    image: ""
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
    if (!newProduct.name || !newProduct.price || !newProduct.image) return;
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
      });
      setNewProduct({ name: "", price: "", image: "" });
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
              className="mr-2 rounded-full border-2  group-hover:scale-110 transition-transform"
            />
            <span className="text-2xl font-extrabold tracking-tight hidden sm:block group-hover:text-red-600 transition-colors">PowerMAX</span>
          </Link>
        </div>
        <div className="flex gap-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative p-0 rounded-3xl shadow-xl bg-white/90 hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100"
            >
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                <p className="text-lg text-indigo-600 font-semibold">${product.price}</p>
                {isAdmin && (
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="ghost"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-red-100 p-2 rounded-full shadow transition"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
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
    </div>
  );
}