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
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { CalendarDays, Dumbbell } from "lucide-react";

const dashboardBgImages = [
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148816/Designer_3_i730su.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148142/Designer_1_h64ely.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740147631/Designer_oztiom.jpg"
];

const weekRoutines = [
  {
    day: "Lunes",
    title: "Pecho y Tríceps",
    description: "Press de banca, Fondos, Aperturas, Extensión de tríceps, Flexiones.",
    icon: <Dumbbell className="w-8 h-8 text-blue-500" />,
    color: "from-blue-100 to-blue-300"
  },
  {
    day: "Martes",
    title: "Espalda y Bíceps",
    description: "Dominadas, Remo, Curl de bíceps, Peso muerto, Pull-over.",
    icon: <Dumbbell className="w-8 h-8 text-green-500" />,
    color: "from-green-100 to-green-300"
  },
  {
    day: "Miércoles",
    title: "Piernas",
    description: "Sentadillas, Prensa, Zancadas, Elevación de talones, Peso muerto rumano.",
    icon: <Dumbbell className="w-8 h-8 text-yellow-500" />,
    color: "from-yellow-100 to-yellow-300"
  },
  {
    day: "Jueves",
    title: "Hombros y Abdomen",
    description: "Press militar, Elevaciones laterales, Crunch, Plancha, Elevación de piernas.",
    icon: <Dumbbell className="w-8 h-8 text-purple-500" />,
    color: "from-purple-100 to-purple-300"
  },
  {
    day: "Viernes",
    title: "Full Body",
    description: "Burpees, Sentadillas, Flexiones, Mountain climbers, Saltos.",
    icon: <Dumbbell className="w-8 h-8 text-pink-500" />,
    color: "from-pink-100 to-pink-300"
  },
  {
    day: "Sábado",
    title: "Cardio y Estiramientos",
    description: "Correr, Bicicleta, Estiramientos dinámicos y estáticos.",
    icon: <CalendarDays className="w-8 h-8 text-red-500" />,
    color: "from-red-100 to-red-300"
  },
  {
    day: "Domingo",
    title: "Descanso",
    description: "Recuperación activa, caminata ligera o yoga suave.",
    icon: <CalendarDays className="w-8 h-8 text-gray-500" />,
    color: "from-gray-100 to-gray-300"
  }
];

export default function DashboardPage() {
  // 1. TODAS LAS LLAMADAS A HOOKS VAN PRIMERO
  const { user, loading } = useAuth();
  const { imcData, loading: imcLoading } = useIMC();
  const [showModal, setShowModal] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [routineIndex, setRoutineIndex] = useState(0);
  const router = useRouter();

  // Hooks para los modales del footer (MOVIDOS AQUÍ)
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // useEffects
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!imcLoading) {
      if (!imcData) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }
  }, [imcData, imcLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dashboardBgImages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const routineInterval = setInterval(() => {
      setRoutineIndex((prev) => (prev + 1) % weekRoutines.length);
    }, 5000);
    return () => clearInterval(routineInterval);
  }, []);

  // 2. DESPUÉS DE LOS HOOKS, VAN LOS RETURNS CONDICIONALES
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

  // 3. FINALMENTE, EL RESTO DE LA LÓGICA Y EL RETURN PRINCIPAL
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

  // Manejadores para los modales del footer
  const handleOpenContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);
  const handleOpenTermsModal = () => setShowTermsModal(true);
  const handleCloseTermsModal = () => setShowTermsModal(false);
  const handleOpenPrivacyModal = () => setShowPrivacyModal(true);
  const handleClosePrivacyModal = () => setShowPrivacyModal(false);

  return (
    <div className="flex flex-col min-h-screen">
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
            <Link href="/rutines" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/store" className="hover:text-gray-600">Tienda</Link>
            <Link href="/poseDetection" className="hover:text-gray-600">Detector de Ejercicios</Link>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleViewProfile}>Ver Perfil</Button>
          <Button onClick={handleLogout}>Cerrar Sesión</Button>
        </div>
      </nav>

      <div className="flex-1">
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


<div className="relative w-full mx-auto mt-10 flex flex-col items-center">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Tus rutinas de la semana</h2>
  <div className="relative h-64 w-full max-w-xs overflow-visible flex items-center justify-center">
    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{
        transform: `translateX(-${routineIndex * 100}%)`,
        width: `${weekRoutines.length * 100}%`,
      }}
    >
      {weekRoutines.map((routine, idx) => {
        // Calcula la escala y opacidad según la posición relativa
        let scale = 0.9;
        let opacity = 0.6;
        let blur = "blur-[2px]";
        if (idx === routineIndex) {
          scale = 1;
          opacity = 1;
          blur = "";
        } else if (
          idx === (routineIndex + 1) % weekRoutines.length ||
          idx === (routineIndex - 1 + weekRoutines.length) % weekRoutines.length
        ) {
          scale = 0.95;
          opacity = 0.8;
          blur = "blur-[1px]";
        }
        return (
          <div
            key={routine.day}
            className={`flex-shrink-0 w-full px-2 transition-all duration-700 ${blur}`}
            style={{
              transform: `scale(${scale})`,
              opacity,
              zIndex: idx === routineIndex ? 20 : 10,
            }}
          >
            <div className={`rounded-2xl shadow-2xl bg-gradient-to-br ${routine.color} p-6 flex flex-col items-center`}>
              <div className="mb-2">{routine.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{routine.day}</h3>
              <p className="text-xl font-bold text-gray-900 mb-1">{routine.title}</p>
              <p className="text-gray-700 text-center">{routine.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  <div className="flex gap-2 mt-4">
    {weekRoutines.map((_, idx) => (
      <button
        key={idx}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === routineIndex ? "bg-blue-600" : "bg-gray-300"}`}
        onClick={() => setRoutineIndex(idx)}
        aria-label={`Ver rutina del ${weekRoutines[idx].day}`}
      />
    ))}
  </div>
</div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-4 mt-10">
        <div className="max-w-7xl mx-auto flex justify-end gap-6 text-sm text-gray-600">
          <button onClick={handleOpenContactModal} className="hover:text-gray-900">Contacto</button>
          <button onClick={handleOpenTermsModal} className="hover:text-gray-900">Términos y Condiciones</button>
          <button onClick={handleOpenPrivacyModal} className="hover:text-gray-900">Política de Privacidad</button>
        </div>
      </footer>

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
  );
}