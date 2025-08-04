"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, X, Dumbbell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useIMC } from "@/app/contexts/ImcContext";
import { useRutina } from "@/app/hooks/useRutina"; // Importar el hook
import IMCModal from "@/components/ui/ImcModal";
import Modal from "@/components/ui/Modal";

const dashboardBgImages = [
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148816/Designer_3_i730su.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148142/Designer_1_h64ely.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740147631/Designer_oztiom.jpg"
];

// Definimos un tipo para cada día de la rutina para mejorar la seguridad del tipado
type RoutineDay = {
  dia: string;
  ejercicios: string[];
};

// Función para obtener colores según el día
const getColorByDay = (dia: string) => {
  // CORRECCIÓN: Añadimos una firma de índice para decirle a TypeScript
  // que este objeto puede ser accedido con cualquier clave de tipo string.
  const colors: { [key: string]: { icon: string; gradient: string } } = {
    "Lunes": { icon: "text-blue-500", gradient: "from-blue-100 to-blue-300" },
    "Martes": { icon: "text-green-500", gradient: "from-green-100 to-green-300" },
    "Miércoles": { icon: "text-yellow-500", gradient: "from-yellow-100 to-yellow-300" },
    "Jueves": { icon: "text-purple-500", gradient: "from-purple-100 to-purple-300" },
    "Viernes": { icon: "text-pink-500", gradient: "from-pink-100 to-pink-300" },
    "Sábado": { icon: "text-red-500", gradient: "from-red-100 to-red-300" },
    "Domingo": { icon: "text-gray-500", gradient: "from-gray-100 to-gray-300" }
  };
  return colors[dia] || { icon: "text-gray-500", gradient: "from-gray-100 to-gray-300" };
};

// Calcula calorías recomendadas y objetivo según IMC
function getCaloriasRecomendadas(imcData: { weight: number; height: number; bmi: number }) {
  const peso = imcData.weight;
  const altura = imcData.height * 100; // en cm
  // Ejemplo: hombre, 30 años
  const caloriasMantenimiento = 66 + (13.7 * peso) + (5 * altura) - (6.8 * 30);
  let objetivo = "mantener tu peso";
  let calorias = caloriasMantenimiento;

  if (imcData.bmi < 18.5) {
    objetivo = "subir de peso";
    calorias += 300;
  } else if (imcData.bmi >= 25) {
    objetivo = "bajar de peso";
    calorias -= 300;
  }

  return { calorias: Math.round(calorias), objetivo };
}

type Objetivo = "subir de peso" | "mantener tu peso" | "bajar de peso";
const platosSaludables: Record<Objetivo, string[]> = {
  "subir de peso": [
    "Avena con frutos secos y miel",
    "Pollo a la plancha con arroz integral y aguacate",
    "Batido de plátano, leche y mantequilla de maní"
  ],
  "mantener tu peso": [
    "Ensalada de atún con huevo y verduras",
    "Pechuga de pollo con quinoa y brócoli",
    "Yogur natural con frutas"
  ],
  "bajar de peso": [
    "Ensalada de pollo y espinaca",
    "Salmón al horno con verduras",
    "Tortilla de claras con tomate y espinaca"
  ]
};

export default function DashboardPage() {
  // 1. TODAS LAS LLAMADAS A HOOKS VAN PRIMERO
  const { user, loading } = useAuth();
  const { imcData, loading: imcLoading } = useIMC();

  // Hook para obtener la rutina basada en la recomendación del IMC
  // MEJORA: Asignamos el tipo `RoutineDay[]` a la rutina
  const { rutina, loading: rutinaLoading } = useRutina(imcData?.routine?.toLowerCase() || "") as { rutina: RoutineDay[], loading: boolean };
  
  const [showModal, setShowModal] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [routineIndex, setRoutineIndex] = useState(0);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const router = useRouter();

  // Hooks para los modales del footer
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
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (rutina.length > 0) {
      const routineInterval = setInterval(() => {
        setRoutineIndex((prev) => (prev + 1) % rutina.length);
      }, 6000);
      return () => clearInterval(routineInterval);
    }
  }, [rutina]);

  // Reset routine index when rutina changes
  useEffect(() => {
    setRoutineIndex(0);
  }, [rutina]);

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
    const { signOut } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    await signOut(auth);

    localStorage.clear();
    sessionStorage.clear();

    router.push("/");
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
            <Link 
              href="/dashboard" 
              className="text-blue-600 font-medium hover:text-blue-700 border-b-2 border-blue-600 pb-1"
            >
              Dashboard
            </Link>
            <Link href="/rutines" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/store" className="hover:text-gray-600">Tienda</Link>
            <Link href="/poseDetection" className="hover:text-gray-600">Detector de movimientos</Link>
            <Link href="/chat" className="hover:text-gray-600">Chat con IA</Link>
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
              <Link 
                href="/dashboard" 
                className="text-blue-600 font-medium hover:text-blue-700"
                onClick={() => setOffcanvasOpen(false)}
              >
                Dashboard
              </Link>
              <Link href="/rutines" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Rutinas</Link>
              <Link href="/store" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Tienda</Link>
              <Link href="/poseDetection" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Detector de movimientos</Link>
              <Link href="/chat" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Chat con IA</Link>
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
              {/* CORRECCIÓN: Usamos optional chaining por si el usuario no tiene displayName o email */}
              <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.displayName || user?.email}</h1>
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
                  <p className="text-lg font-medium text-black">
                    <strong>Rutina recomendada:</strong> {imcData.routine}
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

      {/* Carrusel de rutinas dinámico */}
      {imcData && !rutinaLoading && rutina.length > 0 && (
        <div className="relative w-full mx-auto mt-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Tu rutina personalizada</h2>
          <p className="text-gray-600 mb-6">Basada en tu objetivo: <span className="font-semibold">{imcData.routine}</span></p>
          
          <div className="relative h-64 w-full max-w-xs overflow-visible flex items-center justify-center">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${routineIndex * 100}%)`,
                width: `${rutina.length * 100}%`,
              }}
            >
              {rutina.map((routine, idx) => {
                const colors = getColorByDay(routine.dia);
                // Calcula la escala y opacidad según la posición relativa
                let scale = 0.9;
                let opacity = 0.6;
                let blur = "blur-[2px]";
                if (idx === routineIndex) {
                  scale = 1;
                  opacity = 1;
                  blur = "";
                } else if (
                  idx === (routineIndex + 1) % rutina.length ||
                  idx === (routineIndex - 1 + rutina.length) % rutina.length
                ) {
                  scale = 0.95;
                  opacity = 0.8;
                  blur = "blur-[1px]";
                }
                return (
                  <div
                    key={routine.dia}
                    className={`flex-shrink-0 w-full px-2 transition-all duration-700 ${blur}`}
                    style={{
                      transform: `scale(${scale})`,
                      opacity,
                      zIndex: idx === routineIndex ? 20 : 10,
                    }}
                  >
                    <div className={`rounded-2xl shadow-2xl bg-gradient-to-br ${colors.gradient} p-6 flex flex-col items-center min-h-[200px]`}>
                      <div className="mb-2">
                        <Dumbbell className={`w-8 h-8 ${colors.icon}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{routine.dia}</h3>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="space-y-1">
                          {routine.ejercicios.map((ejercicio, ejIdx) => (
                            <p key={ejIdx} className="text-sm text-gray-700 text-center leading-tight">
                              • {ejercicio}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {rutina.length > 1 && (
            <div className="flex gap-2 mt-4">
              {rutina.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === routineIndex ? "bg-blue-600" : "bg-gray-300"}`}
                  onClick={() => setRoutineIndex(idx)}
                  aria-label={`Ver rutina del ${rutina[idx].dia}`}
                />
              ))}
            </div>
          )}
          {/* Guía nutricional recomendada */}
{imcData && (
  <div className="relative w-full mx-auto mt-10 flex flex-col items-center">
    <h2 className="text-xl font-bold mb-2 text-green-800">Guía Nutricional Recomendada</h2>
    {(() => {
      const { calorias, objetivo } = getCaloriasRecomendadas(imcData);
      return (
        <>
          <p className="text-gray-700 mb-2">
            Para <span className="font-semibold">{objetivo}</span>, te recomendamos consumir aproximadamente <span className="font-bold">{calorias} kcal</span> al día.
          </p>
          <p className="text-gray-700 mb-4">Ejemplos de platos saludables:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {platosSaludables[objetivo as Objetivo].map((plato: string, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-5 min-w-[220px] max-w-xs flex flex-col items-center border border-green-100 hover:shadow-2xl transition"
              >
                <span className="text-green-600 text-2xl mb-2">🥗</span>
                <p className="text-gray-800 text-center font-medium">{plato}</p>
              </div>
            ))}
          </div>
        </>
      );
    })()}
  </div>
)}
        </div>
      )}

      {/* Mensaje cuando no hay rutina disponible */}
      {imcData && !rutinaLoading && rutina.length === 0 && (
        <div className="relative w-full mx-auto mt-10 flex flex-col items-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Rutina no disponible</h3>
            <p className="text-yellow-700">
              No encontramos una rutina específica para &quot;{imcData.routine}&quot;. 
              Por favor, contacta con nuestro equipo para obtener una rutina personalizada.
            </p>
          </div>
        </div>
      )}

      {/* Loading state para rutinas */}
      {imcData && rutinaLoading && (
        <div className="relative w-full mx-auto mt-10 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Cargando tu rutina personalizada...</p>
          </div>
        </div>
      )}

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