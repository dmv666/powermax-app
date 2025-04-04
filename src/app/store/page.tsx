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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando tienda de PowerMAX...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/sdhsports/image/upload/v1742563367/powermax_logo_oficial_awxper.png"
              alt="PowerMAX Logo"
              width={80}
              height={80}
              className="mr-2 rounded-full"
            />
            <span className="text-xl font-bold hidden sm:block">PowerMAX</span>
          </Link>
        </div>
      </nav>

      <div className="p-6">
        <h1 className="text-3xl font-bold">Tienda</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-105">
              <Image
                src={product.image}
                alt={product.name}
                width={250}
                height={180}
                className="rounded-lg object-cover h-48"
              />
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-lg text-gray-700">${product.price}</p>
              {isAdmin && (
                <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" className="mt-2">
                  Eliminar
                </Button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-6 p-4 border rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
            <input type="text" placeholder="Nombre" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 rounded w-full mt-2" />
            <input type="number" placeholder="Precio" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="border p-2 rounded w-full mt-2" />
            <input type="text" placeholder="URL de la imagen" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="border p-2 rounded w-full mt-2" />
            <Button onClick={handleAddProduct} className="mt-4">Agregar</Button>
          </div>
        )}
      </div>
    </div>
  );
}