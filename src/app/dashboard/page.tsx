"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useIMC } from "@/app/contexts/ImcContext";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import IMCModal from "@/components/ui/ImcModal";
import Image from "next/image";
import Link from "next/link";

const dashboardBgImages = [
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148816/Designer_3_i730su.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148142/Designer_1_h64ely.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740147631/Designer_oztiom.jpg"
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { imcData, loading: imcLoading } = useIMC();
  const [showModal, setShowModal] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

// Modify this useEffect to only run once when imcData/imcLoading changes
// Add a dependency check to prevent unnecessary updates
useEffect(() => {
  if (!imcLoading) {
    if (!imcData) {
      setShowModal(true); // Si no hay datos, lo abrimos
    } else {
      setShowModal(false); // Si ya hay datos, cerramos el modal
    }
  }
}, [imcData, imcLoading]); // Only these dependencies
  
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dashboardBgImages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleViewProfile = () => {
    router.push("/dashboard/profile");
  };

  const getIMCStatus = (bmi: number) => {
    if (bmi < 18.5) return "Bajo de peso";
    if (bmi >= 18.5 && bmi < 24.9) return "Peso normal";
    if (bmi >= 25 && bmi < 29.9) return "Sobrepeso";
    return "Obesidad";
  };

  if (loading || imcLoading) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
    </div>
    <p className="mt-4 text-lg font-medium text-gray-700">Cargando tu dashboard...</p>
    <p className="text-sm text-gray-500 mt-2">Estamos preparando y cargando tus datos</p>
  </div>
  }
  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
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
          <div className="hidden md:flex gap-4">
            <Link href="/rutinas" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/store" className="hover:text-gray-600">Tienda</Link>
            <Link href="/acerca-de" className="hover:text-gray-600">Acerca De PowerMAX</Link>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleViewProfile}>Ver Perfil</Button>
          <Button onClick={handleLogout}>Cerrar Sesión</Button>
        </div>
      </nav>

      {/* Carrusel con la información del usuario */}
      <div className="relative w-full mx-auto mt-10">
        <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
          {dashboardBgImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt="Carrusel"
              layout="fill"
              objectFit="cover"
              className={`absolute transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Bienvenido, {user.displayName || user.email}</h1>
            {imcData && (
              <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg font-medium text-black">
                  <strong>Altura:</strong> {imcData.height} m
                </p>
                <p className="text-lg font-medium text-black">
                  <strong>Peso:</strong> {imcData.weight} kg
                </p>
                <p className="text-lg font-medium text-black">
                  <strong>IMC:</strong> {imcData.bmi}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    getIMCStatus(imcData.bmi) === "Peso normal"
                      ? "text-green-500"
                      : getIMCStatus(imcData.bmi) === "Sobrepeso"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  <strong>Estado:</strong> {getIMCStatus(imcData.bmi)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de IMC (si no hay datos) */}
      {showModal && <IMCModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
