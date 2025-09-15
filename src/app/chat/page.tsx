"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Chat from "@/components/ui/chat";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle } from "lucide-react";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

  // Redireccionar si no hay usuario autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleViewProfile = () => {
		router.push("/dashboard/profile");
	};

  const handleLogout = async () => {
    try {
      // Tu lógica de logout aquí
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando Chat con IA...</p>
        <p className="text-sm text-gray-500 mt-2">Estamos preparando el asistente virtual</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
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
            <Link href="/dashboard" className="hover:text-gray-600">Panel</Link>
            <Link href="/rutines" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/store" className="hover:text-gray-600">Tienda</Link>
            <Link href="/poseDetection" className="hover:text-gray-600">Detector de movimientos</Link>
            <Link 
              href="/chat" 
              className="text-blue-600 font-medium hover:text-blue-700 border-b-2 border-blue-600 pb-1"
            >
              Chat con IA
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
          className={`fixed inset-0 z-50 transition-all duration-300 ${offcanvasOpen ? "visible" : "invisible pointer-events-none"}`}
          style={{ background: offcanvasOpen ? "rgba(0,0,0,0.4)" : "transparent" }}
          onClick={() => setOffcanvasOpen(false)}
        >
          <aside
            className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transition-transform duration-300 ${offcanvasOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h5 className="text-lg font-bold">Menú</h5>
              <button className="p-2" onClick={() => setOffcanvasOpen(false)} aria-label="Cerrar menú">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              <Link href="/" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Inicio</Link>
              <Link href="/dashboard" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Panel</Link>
              <Link href="/rutines" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Rutinas</Link>
              <Link href="/store" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Tienda</Link>
              <Link href="/poseDetection" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Detector de movimientos</Link>
              <Link 
                href="/chat" 
                className="text-blue-600 font-medium hover:text-blue-700"
                onClick={() => setOffcanvasOpen(false)}
              >
                Chat con IA
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

      {/* Contenido del chat */}
      <main className="pt-24 px-4">
        <Chat />
      </main>
    </div>
  );
}