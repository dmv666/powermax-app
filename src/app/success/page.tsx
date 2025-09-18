"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { db, auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, PlusCircle, UserCircle, Menu, X } from "lucide-react";


export default function SuccessPage() {
    const handleViewProfile = () => {
		router.push("/dashboard/profile");
	};
    const handleLogout = async () => {
		const { signOut } = await import("firebase/auth");
		const { auth } = await import("@/lib/firebase");
		await signOut(auth);
		localStorage.clear();
		sessionStorage.clear();
		router.push("/");
	};
    const { user } = useAuth();
    const router = useRouter();
    
    // CAMBIO: `newProduct` ahora incluye el campo `description`
    const [newProduct, setNewProduct] = useState<{ name: string; price: string; image: string; description: string }>({
      name: "",
      price: "",
      image: "",
      description: "",
    });
  
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id") ?? null;
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => setReceiptUrl(data.receipt_url))
        .catch((err) => console.error(err));
    }
  }, [sessionId]);
    

  return (
    <div className="min-h-screen bg-white">
			{/* Navbar */}
			<nav className="bg-white/90 fixed top-0 left-0 w-full z-50 shadow">
				<div className="mx-auto flex items-center py-2 px-4 ml-0 mr-0">
					<Link href="/" className="flex items-center group">
						<Image
							src="https://res.cloudinary.com/sdhsports/image/upload/v1742563367/powermax_logo_oficial_awxper.png"
							alt="PowerMAX Logo"
							width={60}
							height={60}
							className="mr-2 rounded-full border-2 group-hover:scale-110 transition-transform"
						/>
						<span className="text-2xl font-extrabold tracking-tight hidden sm:block group-hover:text-red-600 transition-colors">
							PowerMAX
						</span>
					</Link>
					<button
						className="lg:hidden p-2 ml-auto"
						aria-label="Toggle navigation"
						onClick={() => setOffcanvasOpen(true)}
					>
						<Menu className="w-7 h-7" />
					</button>
					<div className="hidden lg:flex gap-4 items-center ml-8">
						<Link href="/dashboard" className="hover:text-gray-600">
							Panel
						</Link>
						
						<Link href="/store" className="hover:text-gray-600">
							Tienda
						</Link>
						
					</div>
					<div className="hidden lg:flex gap-2 items-center ml-auto">
						<Button
							variant="outline"
							onClick={handleViewProfile}
							className="flex items-center gap-2"
						>
							<UserCircle className="w-5 h-5" /> Perfil
						</Button>
						<Button
							variant="destructive"
							onClick={handleLogout}
							className="flex items-center gap-2"
						>
							<span>Cerrar Sesión</span>
						</Button>
					</div>
				</div>
				{/* Offcanvas */}
				<div
					className={`fixed inset-0 z-50 transition-all duration-300 ${
						offcanvasOpen ? "visible" : "invisible pointer-events-none"
					}`}
					style={{
						background: offcanvasOpen ? "rgba(0,0,0,0.4)" : "transparent",
					}}
					onClick={() => setOffcanvasOpen(false)}
				>
					<aside
						className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transition-transform duration-300 ${
							offcanvasOpen ? "translate-x-0" : "translate-x-full"
						}`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-4 border-b">
							<h5 className="text-lg font-bold">Menú</h5>
							<button
								className="p-2"
								onClick={() => setOffcanvasOpen(false)}
								aria-label="Cerrar menú"
							>
								<X className="w-6 h-6" />
							</button>
						</div>
						<nav className="flex flex-col gap-2 p-4">
							<Link
								href="/"
								className="hover:text-gray-600"
								onClick={() => setOffcanvasOpen(false)}
							>
								Inicio
							</Link>
							<Link
								href="/dashboard"
								className="hover:text-gray-600"
								onClick={() => setOffcanvasOpen(false)}
							>
								Dashboard
							</Link>
							
							<Link
								href="/store"
								className="hover:text-gray-600"
								onClick={() => setOffcanvasOpen(false)}
							>
								Tienda
							</Link>
							
							<div className="border-t my-4" />
							<Button
								variant="outline"
								onClick={() => {
									setOffcanvasOpen(false);
									handleViewProfile();
								}}
								className="flex items-center gap-2 w-full justify-start"
							>
								<UserCircle className="w-5 h-5" /> Perfil
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									setOffcanvasOpen(false);
									handleLogout();
								}}
								className="flex items-center gap-2 w-full justify-start"
							>
								<span>Cerrar Sesión</span>
							</Button>
						</nav>
					</aside>
				</div>
			</nav>
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold text-green-600">✅ Pago exitoso</h1>
      <p className="mt-4 text-lg">¡Gracias por tu compra!</p>
      {receiptUrl && (
        <a
          href={receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Ver recibo
        </a>
      )}
    </main>
    </div>
  );
}
