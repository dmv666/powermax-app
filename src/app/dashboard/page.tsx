"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, X, Dumbbell, Menu, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useIMC } from "@/app/contexts/ImcContext";
import { useRutina } from "@/app/hooks/useRutina";
import IMCModal from "@/components/ui/ImcModal";
import Modal from "@/components/ui/Modal";
import PaypalButton from "@/components/ui/PaypalButton";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

const dashboardBgImages = [
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148816/Designer_3_i730su.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740148142/Designer_1_h64ely.jpg",
  "https://res.cloudinary.com/sdhsports/image/upload/v1740147631/Designer_oztiom.jpg"
];

type RoutineDay = {
  dia: string;
  ejercicios: string[];
};

const getColorByDay = (dia: string) => {
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

function getCaloriasRecomendadas(imcData: { weight: number; height: number; bmi: number }) {
  const peso = imcData.weight;
  const altura = imcData.height * 100;
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

type Plato = {
  nombre: string;
  imagen: string;
  calorias: number;
  proteinas: number;
  descripcion: string;
  momento: "Desayuno" | "Almuerzo" | "Cena" | "Snack";
  dias: string[];
};

type Objetivo = "subir de peso" | "mantener tu peso" | "bajar de peso";

const platosSaludables: Record<Objetivo, Plato[]> = {
  "subir de peso": [
    {
      nombre: "Avena con frutos secos y miel",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926122/d2cba39d-0673-40b6-8a48-c7ee4edf5ae0.png",
      calorias: 450,
      proteinas: 12,
      descripcion: "Rica en carbohidratos complejos y grasas saludables",
      momento: "Desayuno",
      dias: ["Lunes", "Miércoles", "Viernes"]
    },
    {
      nombre: "Pollo a la plancha con arroz integral y aguacate",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926166/496d0f98-389d-4ecf-b343-99a9603c96a1.png",
      calorias: 650,
      proteinas: 40,
      descripcion: "Alta en proteínas y grasas saludables",
      momento: "Almuerzo",
      dias: ["Martes", "Jueves"]
    },
    {
      nombre: "Batido de plátano, leche y mantequilla de maní",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926208/b96ed2e4-8a47-4c96-89db-cc25beb1ce0d.png",
      calorias: 400,
      proteinas: 15,
      descripcion: "Perfecto para ganar masa muscular",
      momento: "Snack",
      dias: ["Todos"]
    }
  ],
  "mantener tu peso": [
    {
      nombre: "Ensalada de atún con huevo y verduras",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926246/f3b76439-5189-4109-865b-7cb63769244e.png",
      calorias: 350,
      proteinas: 25,
      descripcion: "Equilibrada en proteínas y vegetales",
      momento: "Almuerzo",
      dias: ["Lunes", "Miércoles", "Viernes"]
    },
    {
      nombre: "Pechuga de pollo con quinoa y brócoli",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926290/1f79ea3a-7ed8-4187-83fa-c98350deeaaf.png",
      calorias: 400,
      proteinas: 35,
      descripcion: "Rica en proteínas magras y fibra",
      momento: "Cena",
      dias: ["Martes", "Jueves"]
    },
    {
      nombre: "Yogur natural con frutas",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926347/7f0db5f1-c5a4-4658-9bfd-0802ccb56d6c.png",
      calorias: 200,
      proteinas: 10,
      descripcion: "Snack saludable y nutritivo",
      momento: "Snack",
      dias: ["Todos"]
    }
  ],
  "bajar de peso": [
    {
      nombre: "Ensalada de pollo y espinaca",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926406/e3f90020-2fb2-4493-99c3-78b09879d1c0.png",
      calorias: 250,
      proteinas: 30,
      descripcion: "Baja en calorías, alta en proteínas",
      momento: "Almuerzo",
      dias: ["Lunes", "Miércoles", "Viernes"]
    },
    {
      nombre: "Salmón al horno con verduras",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926445/a51deef4-af8e-49fc-8042-83fe172c0419.png",
      calorias: 300,
      proteinas: 28,
      descripcion: "Rica en ácidos grasos omega-3",
      momento: "Cena",
      dias: ["Martes", "Jueves"]
    },
    {
      nombre: "Tortilla de claras con tomate y espinaca",
      imagen: "https://res.cloudinary.com/sdhsports/image/upload/v1754926473/e137bf77-0b83-4dfd-b40d-f9ff291d4411.png",
      calorias: 180,
      proteinas: 20,
      descripcion: "Baja en calorías, alta en proteínas",
      momento: "Desayuno",
      dias: ["Todos"]
    }
  ]
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { imcData, loading: imcLoading, updatePlan, updateRoutine } = useIMC();
  const { rutina, loading: rutinaLoading } = useRutina(imcData?.routine?.toLowerCase() || "") as { rutina: RoutineDay[], loading: boolean };

  const [showModal, setShowModal] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [routineIndex, setRoutineIndex] = useState(0);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [nutritionIndex, setNutritionIndex] = useState(0);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const router = useRouter();

  const handleSelectFreePlan = useCallback(async () => {
    try {
      await updatePlan('GRATIS');
      console.log('Plan gratuito seleccionado exitosamente');
    } catch (error) {
      console.error('Error al seleccionar plan gratuito:', error);
    }
  }, [updatePlan]);

  const handleVipSuccess = useCallback(async () => {
    try {
      await updatePlan('VIP');
      console.log('Plan VIP activado exitosamente');
    } catch (error) {
      console.error('Error al activar plan VIP:', error);
    }
  }, [updatePlan]);

  const handleDeluxeSuccess = useCallback(async () => {
    try {
      await updatePlan('DELUXE');
      console.log('Plan Deluxe activado exitosamente');
    } catch (error) {
      console.error('Error al activar plan Deluxe:', error);
    }
  }, [updatePlan]);

  const handlePowerMaxSuccess = useCallback(async () => {
    try {
      await updatePlan('POWERMAX');
      console.log('Plan PowerMAX activado exitosamente');
    } catch (error) {
      console.error('Error al activar plan PowerMAX:', error);
    }
  }, [updatePlan]);

  const handleUpdateRoutine = useCallback(async (newRoutine: string) => {
    try {
      await updateRoutine(newRoutine);
      setShowRoutineModal(false);
      console.log('Rutina actualizada exitosamente a:', newRoutine);
    } catch (error) {
      console.error('Error al actualizar la rutina:', error);
    }
  }, [updateRoutine]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!imcLoading) {
      setShowModal(!imcData);
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
      }, 10000);
      return () => clearInterval(routineInterval);
    }
  }, [rutina]);

  useEffect(() => {
    if (imcData) {
      const { objetivo } = getCaloriasRecomendadas(imcData);
      const platosLength = platosSaludables[objetivo as Objetivo].length;
      const nutritionInterval = setInterval(() => {
        setNutritionIndex((prev) => (prev + 1) % platosLength);
      }, 10000);
      return () => clearInterval(nutritionInterval);
    }
  }, [imcData]);

  useEffect(() => {
    setRoutineIndex(0);
  }, [rutina]);

  useEffect(() => {
    const loadPayPalSDK = () => {
      if (document.querySelector(`script[src*="paypal.com/sdk/js"]`)) {
        setPaypalSdkLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=ARXeoOyo1QN-0or_BeVWWTDtqVZhLOHndi0AqA-70douy88bLhjakmIUo856w9YYc5hdaYvM1qFQc0ya&vault=true&intent=subscription`;
      script.async = true;
      script.onload = () => {
        setPaypalSdkLoaded(true);
        console.log("PayPal SDK cargado correctamente");
      };
      script.onerror = (error) => {
        console.error("Error al cargar el SDK de PayPal:", error);
        setPaypalSdkLoaded(false);
      };
      document.head.appendChild(script);
    };

    if (imcData && !imcData.plan) {
      loadPayPalSDK();
    }
  }, [imcData]);

  if (loading || imcLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando tu dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">Estamos preparando y cargando tus datos</p>
      </div>
    );
  }
  if (!user) return null;

  const handleLogout = async () => {
    const { signOut } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  const handleViewProfile = () => router.push("/dashboard/profile");
  const getIMCStatus = (bmi: number) => {
    if (bmi < 18.5) return "Bajo de peso";
    if (bmi >= 18.5 && bmi < 24.9) return "Peso normal";
    if (bmi >= 25 && bmi < 29.9) return "Sobrepeso";
    return "Obesidad";
  };

  const shouldShowPlans = () => !imcData?.plan;
  const handleOpenContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);
  const handleOpenTermsModal = () => setShowTermsModal(true);
  const handleCloseTermsModal = () => setShowTermsModal(false);
  const handleOpenPrivacyModal = () => setShowPrivacyModal(true);
  const handleClosePrivacyModal = () => setShowPrivacyModal(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
            <Link href="/dashboard" className="text-blue-600 font-medium hover:text-blue-700 border-b-2 border-blue-600 pb-1">
              Panel
            </Link>
            <Link href="/rutines" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/store" className="hover:text-gray-600">Tienda</Link>
            <Link href="/poseDetection" className="hover:text-gray-600">Detector de movimientos</Link>
            <Link href="/chat" className="hover:text-gray-600">Chat con IA</Link>
          </div>
          <div className="hidden lg:flex gap-2 items-center ml-auto">
            <Button variant="outline" onClick={handleViewProfile} className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" /> Perfil
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
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
              <Link href="/dashboard" className="text-blue-600 font-medium hover:text-blue-700" onClick={() => setOffcanvasOpen(false)}>
                Dashboard
              </Link>
              <Link href="/rutines" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Rutinas</Link>
              <Link href="/store" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Tienda</Link>
              <Link href="/poseDetection" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Detector de movimientos</Link>
              <Link href="/chat" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Chat con IA</Link>
              <div className="border-t my-4" />
              <Button variant="outline" onClick={() => { setOffcanvasOpen(false); handleViewProfile(); }} className="flex items-center gap-2 w-full justify-start">
                <UserCircle className="w-5 h-5" /> Perfil
              </Button>
              <Button variant="destructive" onClick={() => { setOffcanvasOpen(false); handleLogout(); }} className="flex items-center gap-2 w-full justify-start">
                <span>Cerrar Sesión</span>
              </Button>
            </nav>
          </aside>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-24">
        {/* User Info Carousel */}
        <div className="relative w-full mx-auto">
          <div className="relative w-full h-96 overflow-hidden shadow-lg">
            {dashboardBgImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt="Carrusel"
                layout="fill"
                objectFit="cover"
                className={`absolute transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
              <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.displayName || user?.email}</h1>
              {imcData && (
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
                  <p className="text-lg font-medium text-black"><strong>Altura:</strong> {imcData.height} m</p>
                  <p className="text-lg font-medium text-black"><strong>Peso:</strong> {imcData.weight} kg</p>
                  <p className="text-lg font-medium text-black"><strong>IMC:</strong> {imcData.bmi}</p>
                  <p className="text-lg font-medium text-black"><strong>Rutina recomendada:</strong> {imcData.routine}</p>
                  <p className={`text-lg font-semibold ${getIMCStatus(imcData.bmi) === "Peso normal" ? "text-green-500" : getIMCStatus(imcData.bmi) === "Sobrepeso" ? "text-yellow-500" : "text-red-500"}`}>
                    <strong>Estado:</strong> {getIMCStatus(imcData.bmi)}
                  </p>
                  <p className="text-lg font-medium text-black"><strong>Plan:</strong> {imcData.plan}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Plan Selection Block */}
          {shouldShowPlans() && (
            <div className="mt-12 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Elige tu plan en PowerMAX</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {/* Free Plan */}
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full items-center border-2 border-blue-200 min-w-[250px]">
                  <div className="w-full flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Gratis</h3>
                    <p className="text-3xl font-extrabold text-blue-600 mb-4 whitespace-nowrap">$0 USD</p>
                    <ul className="text-gray-700 text-sm mb-4 space-y-1">
                      <li>✔️ Acceso a rutinas básicas</li>
                      <li>✔️ Calculadora de IMC</li>
                      <li>✔️ Guía nutricional estándar</li>
                      <li>✔️ Soporte por email</li>
                    </ul>
                  </div>
                  <Button className="w-full mt-auto bg-blue-600 text-white hover:bg-blue-700" onClick={handleSelectFreePlan}>
                    Seleccionar
                  </Button>
                </div>
                {/* VIP Plan */}
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full items-center border-2 border-yellow-200 min-w-[250px]">
                  <div className="w-full flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-yellow-700 mb-2">VIP</h3>
                    <p className="text-3xl font-extrabold text-yellow-600 mb-4 whitespace-nowrap">$2 USD</p>
                    <ul className="text-gray-700 text-sm mb-4 space-y-1">
                      <li>✔️ Todo lo del plan Gratis</li>
                      <li>✔️ Rutinas personalizadas</li>
                      <li>✔️ Guía nutricional avanzada</li>
                      <li>✔️ Acceso a retos mensuales</li>
                    </ul>
                  </div>
                  {paypalSdkLoaded ? (
                    <PaypalButton key="vip-plan" planId="P-2U497723XE069540GNCPBVPA" onSuccess={handleVipSuccess} />
                  ) : (
                    <div className="w-full mt-auto text-center text-sm text-gray-500"><div className="animate-pulse">Cargando PayPal...</div></div>
                  )}
                </div>
                {/* Deluxe Plan */}
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full items-center border-2 border-purple-200 min-w-[250px]">
                  <div className="w-full flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">Deluxe</h3>
                    <p className="text-3xl font-extrabold text-purple-600 mb-4 whitespace-nowrap">$4 USD</p>
                    <ul className="text-gray-700 text-sm mb-4 space-y-1">
                      <li>✔️ Todo lo del plan VIP</li>
                      <li>✔️ Chat con IA ilimitado</li>
                      <li>✔️ Seguimiento de progreso</li>
                      <li>✔️ Soporte prioritario</li>
                    </ul>
                  </div>
                  {paypalSdkLoaded ? (
                    <PaypalButton key="deluxe-plan" planId="P-5XF17102C44054628NCPCKAA" onSuccess={handleDeluxeSuccess} />
                  ) : (
                    <div className="w-full mt-auto text-center text-sm text-gray-500"><div className="animate-pulse">Cargando PayPal...</div></div>
                  )}
                </div>
                {/* PowerMAX Plan */}
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full items-center border-2 border-red-200 min-w-[250px]">
                  <div className="w-full flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-red-700 mb-2">PowerMAX</h3>
                    <p className="text-3xl font-extrabold text-red-600 mb-4 whitespace-nowrap">$7 USD</p>
                    <ul className="text-gray-700 text-sm mb-4 space-y-1">
                      <li>✔️ Todo lo del plan Deluxe</li>
                      <li>✔️ Videollamadas con coach</li>
                      <li>✔️ Planes 100% personalizados</li>
                      <li>✔️ Acceso anticipado a novedades</li>
                    </ul>
                  </div>
                  {paypalSdkLoaded ? (
                    <PaypalButton key="powermax-plan" planId="P-48M60254T89967841NCPCLAA" onSuccess={handlePowerMaxSuccess} />
                  ) : (
                    <div className="w-full mt-auto text-center text-sm text-gray-500"><div className="animate-pulse">Cargando PayPal...</div></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Plan Info */}
          {imcData && imcData.plan && (
            <div className="mt-12 flex flex-col items-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md">
                <h3 className="font-bold text-lg">¡Plan Activo!</h3>
                <p className="text-sm">
                  Tienes el plan <strong>{imcData.plan.toUpperCase()}</strong> activo. ¡Disfruta de todos los beneficios!
                </p>
              </div>
            </div>
          )}
          
          {/* Grid for Routine and Nutrition */}
          <div className="mt-12 flex flex-col items-center w-full">
            {/* Routine Carousel Section */}
            {imcData && !rutinaLoading && rutina.length > 0 && (
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">Tu rutina personalizada</h2>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500" onClick={() => setShowRoutineModal(true)}>
                    <Edit className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-gray-600 mb-6">Basada en tu objetivo: <span className="font-semibold">{imcData.routine}</span></p>

                <div className="relative h-64 w-full max-w-xs overflow-visible flex items-center justify-center">
                  <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${routineIndex * 100}%)`, width: `${rutina.length * 100}%` }}>
                    {rutina.map((routine, idx) => {
                      const colors = getColorByDay(routine.dia);
                      let scale = 0.9, opacity = 0.6, blur = "blur-[2px]";
                      if (idx === routineIndex) { scale = 1; opacity = 1; blur = ""; }
                      return (
                        <div key={routine.dia} className={`flex-shrink-0 w-full px-2 transition-all duration-700 ${blur}`} style={{ transform: `scale(${scale})`, opacity, zIndex: idx === routineIndex ? 20 : 10 }}>
                          <div className={`rounded-2xl shadow-2xl bg-gradient-to-br ${colors.gradient} p-6 flex flex-col items-center min-h-[200px]`}>
                            <div className="mb-2"><Dumbbell className={`w-8 h-8 ${colors.icon}`} /></div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{routine.dia}</h3>
                            <div className="flex-1 flex flex-col justify-center">
                              <div className="space-y-1">
                                {routine.ejercicios.map((ejercicio, ejIdx) => (
                                  <p key={ejIdx} className="text-sm text-gray-700 text-center leading-tight">• {ejercicio}</p>
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
                      <button key={idx} className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === routineIndex ? "bg-blue-600" : "bg-gray-300"}`} onClick={() => setRoutineIndex(idx)} aria-label={`Ver rutina del ${rutina[idx].dia}`} />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Nutrition Guide Section */}
            {imcData && (
              <div className="flex flex-col items-center w-full mt-12">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Guía Nutricional</h2>
                {(() => {
                  const { calorias, objetivo } = getCaloriasRecomendadas(imcData);
                  const platos = platosSaludables[objetivo as Objetivo];
                  return (
                    <>
                      <p className="text-gray-600 mb-6">Objetivo: <span className="font-semibold">{objetivo}</span> - <span className="font-bold ml-1">{calorias} kcal/día</span></p>
                      <div className="relative h-96 w-full max-w-xs overflow-visible flex items-center justify-center">
                        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${nutritionIndex * 100}%)`, width: `${platos.length * 100}%` }}>
                          {platos.map((plato, idx) => {
                            let scale = 0.9, opacity = 0.6, blur = "blur-[2px]";
                            if (idx === nutritionIndex) { scale = 1; opacity = 1; blur = ""; }
                            const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
                            const isRecommendedToday = plato.dias.map(d => d.toLowerCase()).includes(today) || plato.dias.includes("Todos");
                            return (
                              <div key={idx} className={`flex-shrink-0 w-full px-2 transition-all duration-700 ${blur}`} style={{ transform: `scale(${scale})`, opacity, zIndex: idx === nutritionIndex ? 20 : 10 }}>
                                <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-6 flex flex-col items-center min-h-[320px]">
                                  <div className="w-48 h-48 rounded-full overflow-hidden mb-4 bg-white shadow-inner">
                                    <Image src={plato.imagen} alt={plato.nombre} width={192} height={192} className="object-cover w-full h-full" />
                                  </div>
                                  <div className="flex flex-col items-center space-y-2 w-full">
                                    <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">{plato.momento}</span>
                                    <h3 className="text-lg font-semibold text-gray-800 text-center">{plato.nombre}</h3>
                                    <div className="space-y-1 text-center">
                                      <p className="text-sm text-gray-600">{plato.descripcion}</p>
                                      <p className="text-sm font-medium text-gray-700">{plato.calorias} kcal | {plato.proteinas}g proteína</p>
                                      <p className="text-xs text-gray-500 mt-2">Recomendado para: {plato.dias.join(', ')}</p>
                                      {isRecommendedToday && (
                                        <p className="text-sm font-semibold text-green-600">¡Plato recomendado para hoy!</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {platos.length > 1 && (
                        <div className="flex gap-2 mt-4">
                          {platos.map((_, idx) => (
                            <button key={idx} className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === nutritionIndex ? "bg-green-600 mt-2" : "bg-gray-300 mt-2"}`} onClick={() => setNutritionIndex(idx)} aria-label={`Ver plato ${idx + 1}`} />
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-4 mt-16">
        <div className="max-w-7xl mx-auto flex justify-end gap-6 text-sm text-gray-600">
          <button onClick={handleOpenContactModal} className="hover:text-gray-900">Contacto</button>
          <button onClick={handleOpenTermsModal} className="hover:text-gray-900">Términos y Condiciones</button>
          <button onClick={handleOpenPrivacyModal} className="hover:text-gray-900">Política de Privacidad</button>
        </div>
      </footer>

      {/* Modals */}
      {showModal && <IMCModal onClose={() => setShowModal(false)} />}
            {/* Modal de Contacto */}
            {showContactModal && (
              <Modal onClose={handleCloseContactModal}>
                <section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 max-w-2xl w-full">
                  <div className="flex justify-between items-center w-full mb-4 border-b">
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
                  <div className="flex justify-between items-center w-full mb-4 top-0 bg-white border-b pb-2">
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
      {showRoutineModal && (
        <Modal onClose={() => setShowRoutineModal(false)}>
          <section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-2xl font-bold">Cambiar Rutina</h2>
              <button onClick={() => setShowRoutineModal(false)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-gray-700 mb-6 text-center w-full">Selecciona un nuevo objetivo para tu rutina.</p>
            <div className="space-y-4 w-full">
              <Button className="w-full" variant={imcData?.routine === 'Bajar de peso' ? 'default' : 'outline'} onClick={() => handleUpdateRoutine('Bajar de peso')}>Bajar de peso</Button>
              <Button className="w-full" variant={imcData?.routine === 'Mantenimiento' ? 'default' : 'outline'} onClick={() => handleUpdateRoutine('Mantenimiento')}>Mantenimiento</Button>
              <Button className="w-full" variant={imcData?.routine === 'Tonificar' ? 'default' : 'outline'} onClick={() => handleUpdateRoutine('Tonificar')}>Tonificar</Button>
              <Button className="w-full" variant={imcData?.routine === 'Ganar peso' ? 'default' : 'outline'} onClick={() => handleUpdateRoutine('Ganar peso')}>Ganar peso</Button>
            </div>
          </section>
        </Modal>
      )}
    </div>
  );
}
