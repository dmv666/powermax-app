"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, BarChart, X } from "lucide-react";
import Modal from "@/components/ui/Modal";

const images = [
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148816/Designer_3_i730su.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148142/Designer_1_h64ely.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740147631/Designer_oztiom.jpg"
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalTienda, setShowModalTienda] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Cambia cada 4 segundos

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleOpenModalTienda = () => {
    setShowModalTienda(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

 const handleCloseModalTienda = () => {
    setShowModalTienda(false);
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    window.location.href = "/auth/login";
  };

  // Manejadores para los modales del footer
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative w-32 h-32 mb-8">
          <Image
            src="https://res.cloudinary.com/sdhsports/image/upload/v1742563367/powermax_logo_oficial_awxper.png"
            alt="PowerMAX Logo"
            layout="fill"
            objectFit="contain"
            className="rounded-full"
          />
        </div>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-8 text-xl font-semibold text-gray-700">Cargando PowerMAX...</p>
        <p className="mt-2 text-gray-500">Preparando tu experiencia fitness</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-background py-4 px-6 flex items-center sticky justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/sdhsports/image/upload/v1742563367/powermax_logo_oficial_awxper.png"
              alt="PowerMAX Logo"
              width={80}
              height={80}
              className="mr-2 rounded-full"
            />
            <span className="text-xl font-bold">PowerMAX</span>
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/rutines" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/store" className="hover:text-gray-600">Tienda</Link>
            <Link href="/about-us" className="hover:text-gray-600">Acerca De PowerMAX</Link>
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
            <Button variant="secondary" size="lg" onClick={handleOpenModal}>Calcular IMC</Button>
            <Button variant="secondary" size="lg" onClick={handleOpenModalTienda}>Visitar Tienda</Button>
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
          <button onClick={handleOpenContactModal} className="hover:text-gray-900">Contacto</button>
          <button onClick={handleOpenTermsModal} className="hover:text-gray-900">Términos y Condiciones</button>
          <button onClick={handleOpenPrivacyModal} className="hover:text-gray-900">Política de Privacidad</button>
        </div>
      </footer>

      {/* Modal de IMC */}
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <section className="flex flex-col items-center justify-center text-center bg-white p-8 rounded-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95">
            <h2 className="text-xl font-bold mb-4">¿Quieres calcular tu IMC?</h2>
            <p>Para hacer esto debes iniciar sesión. ¿Deseas hacerlo?</p>
            <div className="flex gap-4 mt-6">
              <Button onClick={handleLoginRedirect}>Sí, Iniciar Sesión</Button>
              <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            </div>
          </section>
        </Modal>
      )}

            {/* Modal de IMC */}
      {showModalTienda && (
        <Modal onClose={handleCloseModalTienda}>
          <section className="flex flex-col items-center justify-center text-center bg-white p-8 rounded-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95">
            <h2 className="text-xl font-bold mb-4">¿Quieres ingresar a la Tienda?</h2>
            <p>Para hacer esto debes iniciar sesión. ¿Deseas hacerlo?</p>
            <div className="flex gap-4 mt-6">
              <Button onClick={handleLoginRedirect}>Sí, Iniciar Sesión</Button>
              <Button variant="secondary" onClick={handleCloseModalTienda}>Cancelar</Button>
            </div>
          </section>
        </Modal>
      )}

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
     {/* Header fijo con borde y fondo sólido */}
     <div className="flex justify-between items-center w-full top-0 bg-white pb-4 border-b z-10">
       <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
       <button onClick={handleCloseTermsModal} className="text-gray-500 hover:text-gray-700">
         <X className="h-5 w-5" />
       </button>
     </div>
     
     {/* Contenido con espacio superior */}
     <div className="space-y-4 w-full pt-6 mt-2">
       <p className="text-gray-700">Última actualización: 14 de marzo, 2025</p>
       
       {/* Aseguramos que el primer elemento tenga suficiente espacio */}
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

    </main>
  );
}