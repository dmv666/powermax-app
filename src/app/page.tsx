"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, BarChart } from "lucide-react";

const images = [
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148816/Designer_3_i730su.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148142/Designer_1_h64ely.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740147631/Designer_oztiom.jpg"
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-background py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/sdhsports/image/upload/v1739534621/Designer_l6amas.png"
              alt="PowerMAX Logo"
              width={80}
              height={80}
              className="mr-2"
            />
            <span className="text-xl font-bold">PowerMAX</span>
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/rutinas" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/tienda" className="hover:text-gray-600">Tienda</Link>
            <Link href="/acerca-de" className="hover:text-gray-600">Acerca De PowerMAX</Link>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
          <Button variant="default">Iniciar Sesión</Button>
          </Link>

          <Link href="/auth/register">
          <Button variant="default">Registrarse</Button>
          </Link>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex flex-col items-center justify-center text-white gap-8 px-4 overflow-hidden">
        {/* Carrusel como fondo */}
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            src={images[currentIndex]}
            alt="Carrusel de fondo"
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-black/40"></div> {/* Oscurecer imagen */}
        </div>

        {/* Contenido encima del fondo */}
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold">Transforma tu Cuerpo con PowerMAX</h1>
          <p className="text-lg mt-2">Elige tu rutina ideal y alcanza tus metas fitness</p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button variant="secondary" size="lg">Explorar Rutinas</Button>
            <Button variant="secondary" size="lg">Calcular IMC</Button>
            <Button variant="secondary" size="lg">Visitar Tienda</Button>
          </div>
        </div>
      </section>

      {/* Sección de Rutinas */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-3">Rutina de Fuerza</h3>
            <p className="text-gray-600 mb-6">Construye músculo y aumenta tu fuerza con este programa intensivo.</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /><span>3 días a la semana</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" /><span>Duración: 60 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5" /><span>Nivel: Intermedio</span>
              </div>
            </div>
            <Button className="w-full">Comenzar</Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-3">Rutina de Cardio</h3>
            <p className="text-gray-600 mb-6">Mejora tu resistencia y quema calorías con este programa cardiovascular.</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /><span>4 días a la semana</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" /><span>Duración: 45 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5" /><span>Nivel: Principiante</span>
              </div>
            </div>
            <Button className="w-full">Comenzar</Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-3">Rutina de Yoga</h3>
            <p className="text-gray-600 mb-6">Mejora tu flexibilidad y equilibrio con este programa de yoga.</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /><span>3 días a la semana</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" /><span>Duración: 60 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5" /><span>Nivel: Todos los niveles</span>
              </div>
            </div>
            <Button className="w-full">Comenzar</Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-end gap-6 text-sm text-gray-600">
          <Link href="/contacto" className="hover:text-gray-900">Contacto</Link>
          <Link href="/terminos" className="hover:text-gray-900">Términos y Condiciones</Link>
          <Link href="/privacidad" className="hover:text-gray-900">Política de Privacidad</Link>
        </div>
      </footer>
    </main>
  );
}
