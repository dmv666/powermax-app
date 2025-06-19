"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { X } from "lucide-react";

export default function Component() {
  const routines = [
    {
      title: "Rutina de Fuerza",
      description: "Construye músculo y aumenta tu fuerza con este programa intensivo.",
      frequency: "3 días a la semana",
      duration: "60 minutos",
      level: "Intermedio",
    },
    {
      title: "Rutina de Cardio",
      description: "Mejora tu resistencia y quema calorías con este programa cardiovascular.",
      frequency: "4 días a la semana",
      duration: "45 minutos",
      level: "Principiante",
    },
    {
      title: "Rutina de Yoga",
      description: "Mejora tu flexibilidad y equilibrio con este programa de yoga.",
      frequency: "3 días a la semana",
      duration: "60 minutos",
      level: "Todos los niveles",
    },
  ];

  // --- Lógica para los modales del footer ---
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleOpenContactModal = () => {
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
  };

  const handleOpenTermsModal = () => {
    setShowTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };

  const handleOpenPrivacyModal = () => {
    setShowPrivacyModal(true);
  };

  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false);
  };
  // --- Fin de la lógica para modales ---

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/sdhsports/image/upload/v1742563367/powermax_logo_oficial_awxper.png"
                alt="PowerMAX Logo"
                width={80}
                height={80}
                className="mr-2 rounded-full"
              />
              <span className="text-xl font-bold hidden sm:block">PowerMAX</span>
            </Link>
            <nav className="hidden md:flex gap-8">
              <a href="/store" className="text-black hover:text-gray-700 font-medium">
                Tienda
              </a>
            </nav>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary">Iniciar Sesion</Button>
            <Button>Registrarse</Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-black text-center mb-12">Rutinas</h1>

        {/* Routines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {routines.map((routine, index) => (
            <Card
              key={index}
              className="p-4 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">{routine.title}</CardTitle>
                <CardDescription className="text-gray-700">{routine.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-700">
                  <p>{routine.frequency}</p>
                  <p>Duración: {routine.duration}</p>
                  <p>Nivel: {routine.level}</p>
                </div>
                <Button className="w-full mt-4">Comenzar</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routines.map((routine, index) => (
            <Card
              key={`second-${index}`}
              className="p-4 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">{routine.title}</CardTitle>
                <CardDescription className="text-gray-700">{routine.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-700">
                  <p>{routine.frequency}</p>
                  <p>Duración: {routine.duration}</p>
                  <p>Nivel: {routine.level}</p>
                </div>
                <Button className="w-full mt-4">Comenzar</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer con modales */}
      <footer className="bg-gray-50 py-8 mt-16 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <button onClick={handleOpenContactModal} className="hover:text-black transition-colors">
              Contacto
            </button>
            <button onClick={handleOpenTermsModal} className="hover:text-black transition-colors">
              Términos y Condiciones
            </button>
            <button onClick={handleOpenPrivacyModal} className="hover:text-black transition-colors">
              Política de Privacidad
            </button>
          </div>
        </div>
      </footer>
      
      {/* --- MODALES --- */}
      {/* Modal de Contacto */}
      {showContactModal && (
        <Modal onClose={handleCloseContactModal}>
          <section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 max-w-2xl w-full">
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-2xl font-bold">Contacto</h2>
              <button onClick={handleCloseContactModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 w-full">
              <p className="text-gray-700">Estamos aquí para ayudarte. Contáctanos a través de los siguientes medios:</p>
              
              <div className="pt-2">
                <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                <p className="text-gray-600">soporte@powermax.com</p>
              </div>
              
              <div className="pt-2">
                <h3 className="font-semibold mb-1">Teléfono</h3>
                <p className="text-gray-600">+123 456 789</p>
              </div>
              
              <div className="pt-2">
                <h3 className="font-semibold mb-1">Horario de Atención</h3>
                <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00<br />Sábados: 10:00 - 14:00</p>
              </div>
              
              <div className="pt-2">
                <h3 className="font-semibold mb-1">Dirección</h3>
                <p className="text-gray-600">Calle Fitness #123<br />Ciudad Deportiva, CP 12345</p>
              </div>
            </div>
            <div className="mt-6 w-full">
              <Button variant="secondary" onClick={handleCloseContactModal} className="w-full">Cerrar</Button>
            </div>
          </section>
        </Modal>
      )}

      {/* Modal de Términos y Condiciones */}
      {showTermsModal && (
        <Modal onClose={handleCloseTermsModal}>
          <section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center w-full top-0 bg-white pb-4 border-b z-10">
              <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
              <button onClick={handleCloseTermsModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 w-full pt-6 mt-2">
              <p className="text-gray-700">Última actualización: 14 de marzo, 2025</p>
              
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-1">1. Aceptación de los Términos</h3>
                <p className="text-gray-600">Al acceder y utilizar los servicios de PowerMAX, aceptas estar vinculado por estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">2. Uso del Servicio</h3>
                <p className="text-gray-600">PowerMAX proporciona una plataforma para acceder a rutinas de ejercicio y contenido relacionado con el fitness. Todo el contenido ofrecido en nuestra plataforma es solo para fines informativos y educativos. Siempre debes consultar con un profesional de la salud antes de comenzar cualquier programa de ejercicio.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">3. Cuentas de Usuario</h3>
                <p className="text-gray-600">Al crear una cuenta en PowerMAX, eres responsable de mantener la seguridad de tu cuenta y contraseña. La empresa no puede y no será responsable de ninguna pérdida o daño por tu incumplimiento de esta obligación de seguridad.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">4. Limitación de Responsabilidad</h3>
                <p className="text-gray-600">En ningún caso PowerMAX, sus directores, empleados o agentes serán responsables de cualquier daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar el servicio.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">5. Cambios en los Términos</h3>
                <p className="text-gray-600">Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 30 días de anticipación.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">6. Cancelación</h3>
                <p className="text-gray-600">Puedes cancelar tu cuenta en cualquier momento. Todas las disposiciones de los Términos que por su naturaleza deberían sobrevivir a la terminación sobrevivirán, incluyendo, sin limitación, las disposiciones de propiedad, renuncias de garantía y limitaciones de responsabilidad.</p>
              </div>
            </div>
            
            <div className="mt-6 w-full">
              <Button variant="secondary" onClick={handleCloseTermsModal} className="w-full">Cerrar</Button>
            </div>
          </section>
        </Modal>
      )}

      {/* Modal de Política de Privacidad */}
      {showPrivacyModal && (
        <Modal onClose={handleClosePrivacyModal}>
          <section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center w-full mb-4 top-0 bg-white pb-2">
              <h2 className="text-2xl font-bold">Política de Privacidad</h2>
              <button onClick={handleClosePrivacyModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 w-full">
              <p className="text-gray-700">Última actualización: 14 de marzo, 2025</p>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">1. Recopilación de Información</h3>
                <p className="text-gray-600">Recopilamos varios tipos de información para proporcionar y mejorar nuestro servicio, incluyendo pero no limitado a información personal como nombre, dirección de correo electrónico, edad, altura y peso (para calculadoras de IMC), así como información de uso como su interacción con nuestra plataforma.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">2. Uso de la Información</h3>
                <p className="text-gray-600">Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, para comunicarnos con usted, y para desarrollar nuevos servicios. Sus datos de salud y fitness solo se utilizan para proporcionar cálculos y recomendaciones personalizadas.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">3. Compartir de Información</h3>
                <p className="text-gray-600">No vendemos, intercambiamos ni transferimos su información personal a terceros sin su consentimiento, excepto cuando sea necesario para proporcionar un servicio que haya solicitado.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">4. Protección de Datos</h3>
                <p className="text-gray-600">Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. Sus datos personales se almacenan en redes seguras y solo son accesibles por un número limitado de personas.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">5. Cookies</h3>
                <p className="text-gray-600">Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Puede elegir que su navegador rechace las cookies, pero esto puede impedir que aproveche algunas funcionalidades de nuestro servicio.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">6. Sus Derechos</h3>
                <p className="text-gray-600">Tiene derecho a acceder, corregir o eliminar su información personal. Si desea ejercer alguno de estos derechos, contáctenos a través de la información proporcionada en la sección de contacto.</p>
              </div>
            </div>
            <div className="mt-6 w-full">
              <Button variant="secondary" onClick={handleClosePrivacyModal} className="w-full">Cerrar</Button>
            </div>
          </section>
        </Modal>
      )}

    </div>
  )
}