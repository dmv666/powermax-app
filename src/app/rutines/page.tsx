"use client"

import { useState } from "react";
import { UserCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

const routines = [
	{
		title: "Yoga Flex",
		duration: "80 min",
		description:
			"Mejora tu flexibilidad, respiración y libera estrés corporal y mental con una secuencia de posturas y relajación.",
		recommendations: ["Colchoneta", "Ropa cómoda", "Espacio tranquilo", "Botella de agua"],
		exercises: [
			{
				name: "Respiración diafragmática (5 min)",
				explanation: "Sentado, inhalar profundo por nariz, llenar abdomen, exhalar lento por boca.",
				precaution: "No forzar la respiración, mantener espalda recta.",
				videoUrl: "https://www.yotube.com/watch?v=8QyVZrV3d3o",
			},
			{
				name: "Saludo al sol (15 min)",
				explanation: "Secuencia de posturas enlazadas (montaña, flexión, plancha, perro boca abajo, cobra).",
				precaution: "No bloquear codos ni rodillas.",
				videoUrl: "https://www.yotube.com/watch?v=73sjwzFQn6g",
			},
			{
				name: "Postura del guerrero (10 min)",
				explanation: "Pierna adelante flexionada, otra atrás extendida, brazos en cruz.",
				precaution: "Rodilla delantera alineada al tobillo.",
				videoUrl: "https://www.yotube.com/watch?v=2pLT-olgUJs",
			},
			{
				name: "Postura del árbol (10 min)",
				explanation: "Apoyar pie en muslo contrario, manos unidas al pecho.",
				precaution: "No apoyar pie en rodilla, mirar al frente para equilibrio.",
				videoUrl: "https://www.yotube.com/watch?v=JpV4p8g6U8E",
			},
			{
				name: "Postura del puente (10 min)",
				explanation: "Acostado, pies en el suelo, elevar cadera suavemente.",
				precaution: "No forzar cuello ni espalda baja.",
				videoUrl: "https://www.yotube.com/watch?v=5r6yzFEXajQ",
			},
			{
				name: "Estiramientos suaves y relajación (30 min)",
				explanation: "Piernas abiertas, brazos estirados, postura del niño y savasana final.",
				precaution: "Soltar tensiones, cerrar ojos, respirar profundo.",
				videoUrl: "https://www.yotube.com/watch?v=ZQ2dRZyG5wE",
			},
		],
	},
	{
		title: "Crazy cardio",
		duration: "80 min",
		description: "Mejora tu resistencia, quema calorías y fortalece tu corazón con intervalos de alta intensidad.",
		recommendations: ["Ropa ligera", "Buen calzado", "Cuerda para saltar", "Agua"],
		exercises: [
			{
				name: "Calentamiento articular (10 min)",
				explanation: "Movilidad de cuello, hombros, cadera, rodillas y tobillos.",
				precaution: "No forzar rangos.",
				videoUrl: "https://www.yotube.com/watch?v=R0mMyV5OtcM",
			},
			{
				name: "Jumping jacks (5 min)",
				explanation: "Saltar abriendo brazos y piernas, volver cerrando.",
				precaution: "Aterrizar suave para no cargar rodillas.",
				videoUrl: "https://www.yotube.com/watch?v=c4DAnQ6DtF8",
			},
			{
				name: "Burpees (10 min, 30 seg trabajo/30 seg pausa)",
				explanation: "Bajada a plancha, flexión, salto arriba.",
				precaution: "Espalda recta en plancha.",
				videoUrl: "https://www.yotube.com/watch?v=TU8QYVW0gDU",
			},
			{
				name: "Saltar la cuerda (10 min, intervalos 1 min trabajo / 30 seg pausa)",
				explanation: "Saltos cortos, pies juntos.",
				precaution: "Mantener codos cerca al cuerpo.",
				videoUrl: "https://www.yotube.com/watch?v=QXIFv2pA9Lw",
			},
			{
				name: "Sprints en sitio (10 min, intervalos)",
				explanation: "Correr levantando rodillas al pecho.",
				precaution: "No inclinar tronco hacia atrás.",
				videoUrl: "https://www.yotube.com/watch?v=QohvW0r4y8k",
			},
			{
				name: "Circuito final (20 min, repetir 4 rondas)",
				explanation: "20 mountain climbers + 15 sentadillas + 10 burpees.",
				precaution: "Mantener respiración constante.",
				videoUrl: "https://www.yotube.com/watch?v=1gQ9ZzYw6zA",
			},
			{
				name: "Estiramientos finales (15 min)",
				explanation: "Piernas, brazos y espalda.",
				precaution: "No rebotar en estiramientos.",
				videoUrl: "https://www.yotube.com/watch?v=FCD5p6l6QwM",
			},
		],
	},
	{
		title: "Calistenia Básica",
		duration: "80 min",
		description: "Trabaja fuerza usando solo tu peso corporal con ejercicios funcionales y progresivos.",
		recommendations: ["Barra de dominadas", "Suelo firme", "Ropa deportiva"],
		exercises: [
			{
				name: "Calentamiento dinámico (10 min)",
				explanation: "Movilidad articular y trote suave.",
				precaution: "Ritmo moderado.",
				videoUrl: "https://www.yotube.com/watch?v=R0mMyV5OtcM",
			},
			{
				name: "Flexiones (15 min, 4x12 reps)",
				explanation: "Manos al ancho de hombros, bajar pecho cerca del suelo.",
				precaution: "No arquear espalda.",
				videoUrl: "https://www.yotube.com/watch?v=IODxDxX7oi4",
			},
			{
				name: "Dominadas asistidas (15 min, 4x8 reps)",
				explanation: "Sujetarse de barra, subir hasta barbilla.",
				precaution: "No balancearse excesivamente.",
				videoUrl: "https://www.yotube.com/watch?v=HRV5YKKaeVw",
			},
			{
				name: "Sentadillas (15 min, 4x15 reps)",
				explanation: "Bajar hasta 90°, rodillas alineadas con pies.",
				precaution: "No levantar talones.",
				videoUrl: "https://www.yotube.com/watch?v=aclHkVaku9U",
			},
			{
				name: "Plancha (10 min, 5x1 min)",
				explanation: "Codos y puntas de pies apoyados, cuerpo recto.",
				precaution: "No hundir cadera.",
				videoUrl: "https://www.yotube.com/watch?v=pSHjTRCQxIw",
			},
			{
				name: "Fondos en banco (10 min, 4x12 reps)",
				explanation: "Manos en banco, bajar y subir flexionando codos.",
				precaution: "No encoger hombros.",
				videoUrl: "https://www.yotube.com/watch?v=0326dy_-CzM",
			},
			{
				name: "Estiramientos (5 min)",
				explanation: "Brazos, pecho y piernas.",
				precaution: "",
				videoUrl: "https://www.yotube.com/watch?v=FCD5p6l6QwM",
			},
		],
	},
	{
		title: "Explosividad",
		duration: "80 min",
		description: "Mejora tu potencia y velocidad con ejercicios explosivos y sprints.",
		recommendations: ["Zapatillas deportivas", "Espacio libre", "Escalón o cajón"],
		exercises: [
			{
				name: "Calentamiento con skipping (10 min)",
				explanation: "Correr en sitio, rodillas arriba.",
				precaution: "Ritmo progresivo.",
				videoUrl: "https://www.yotube.com/watch?v=QohvW0r4y8k",
			},
			{
				name: "Saltos en cajón (15 min, 4x10 reps)",
				explanation: "Saltar sobre cajón y bajar controlado.",
				precaution: "Caer con rodillas flexionadas.",
				videoUrl: "https://www.yotube.com/watch?v=52rDhH4z2rA",
			},
			{
				name: "Sprint cortos (15 min, 10x30 seg)",
				explanation: "Carreras rápidas de 20-30 m.",
				precaution: "Trotar suave al volver.",
				videoUrl: "https://www.yotube.com/watch?v=QohvW0r4y8k",
			},
			{
				name: "Saltos laterales (15 min, 4x15 reps)",
				explanation: "Brincar de un lado a otro.",
				precaution: "Controlar aterrizaje.",
				videoUrl: "https://www.yotube.com/watch?v=QohvW0r4y8k",
			},
			{
				name: "Push-ups explosivos (15 min, 4x10 reps)",
				explanation: "Flexión y empuje rápido (con palmada opcional).",
				precaution: "No dejar caer el pecho.",
				videoUrl: "https://www.yotube.com/watch?v=IODxDxX7oi4",
			},
			{
				name: "Burpees con salto alto (10 min)",
				explanation: "Igual que burpee, pero salto más vertical.",
				precaution: "Aterrizar suave.",
				videoUrl: "https://www.yotube.com/watch?v=TU8QYVW0gDU",
			},
		],
	},
	{
		title: "Cardio Core",
		duration: "80 min",
		description: "Aumenta tu resistencia y fortalece el abdomen con ejercicios de cardio y core.",
		recommendations: ["Colchoneta", "Botella de agua"],
		exercises: [
			{
				name: "Trote suave (10 min)",
				explanation: "Correr a ritmo cómodo.",
				precaution: "Pisada suave.",
				videoUrl: "https://www.yotube.com/watch?v=QohvW0r4y8k",
			},
			{
				name: "Mountain climbers (10 min, 5x1 min)",
				explanation: "En plancha, llevar rodillas alternadas al pecho.",
				precaution: "No elevar demasiado cadera.",
				videoUrl: "https://www.yotube.com/watch?v=nmwgirgXLYM",
			},
			{
				name: "Jump squats (15 min, 4x12 reps)",
				explanation: "Sentadilla y salto vertical.",
				precaution: "Caer con rodillas semiflexionadas.",
				videoUrl: "https://www.yotube.com/watch?v=U4s4mEQ5VqU",
			},
			{
				name: "Plancha lateral (10 min, 4x40 seg cada lado)",
				explanation: "Apoyo en codo y pies, cuerpo recto.",
				precaution: "No hundir cadera.",
				videoUrl: "https://www.yotube.com/watch?v=K2VljzCC16g",
			},
			{
				name: "Bicicleta abdominal (15 min, 4x20 reps)",
				explanation: "Alternar codo a rodilla contraria.",
				precaution: "No forzar cuello.",
				videoUrl: "https://www.yotube.com/watch?v=9FGilxCbdz8",
			},
			{
				name: "Circuito final (15 min)",
				explanation: "1 min saltos + 1 min plancha + 1 min burpees.",
				precaution: "Descansar 1 min entre rondas.",
				videoUrl: "https://www.yotube.com/watch?v=1gQ9ZzYw6zA",
			},
		],
	},
	{
		title: "Essential Yoga",
		duration: "80 min",
		description: "Recupera tus músculos, mejora la postura y la movilidad articular con yoga y estiramientos.",
		recommendations: ["Colchoneta", "Espacio tranquilo", "Música relajante"],
		exercises: [
			{
				name: "Respiración profunda (5 min)",
				explanation: "Inhalar contando 4, exhalar contando 6.",
				precaution: "No hiperventilar.",
				videoUrl: "https://www.yotube.com/watch?v=8QyVZrV3d3o",
			},
			{
				name: "Estiramientos dinámicos (15 min)",
				explanation: "Balanceo suave de brazos y piernas.",
				precaution: "No movimientos bruscos.",
				videoUrl: "https://www.yotube.com/watch?v=FCD5p6l6QwM",
			},
			{
				name: "Postura del perro boca abajo (10 min)",
				explanation: "Apoyo manos y pies, cadera arriba.",
				precaution: "No forzar talones al suelo.",
				videoUrl: "https://www.yotube.com/watch?v=73sjwzFQn6g",
			},
			{
				name: "Torsión espinal (10 min)",
				explanation: "Acostado, rodillas dobladas giran hacia un lado.",
				precaution: "Mantener hombros apoyados.",
				videoUrl: "https://www.yotube.com/watch?v=ZQ2dRZyG5wE",
			},
			{
				name: "Movilidad de cadera (15 min)",
				explanation: "Postura de la paloma.",
				precaution: "No hundir cadera dolorosamente.",
				videoUrl: "https://www.yotube.com/watch?v=2pLT-olgUJs",
			},
			{
				name: "Postura del niño + relajación (25 min)",
				explanation: "Brazos extendidos, frente al suelo, luego savasana.",
				precaution: "Soltar tensión, mantener respiración lenta.",
				videoUrl: "https://www.yotube.com/watch?v=ZQ2dRZyG5wE",
			},
		],
	},
];

export default function Component() {
	useAuth();
	const router = useRouter();

	// --- Navbar y offcanvas ---
	const [offcanvasOpen, setOffcanvasOpen] = useState(false);

	// --- Modal de rutina seleccionada ---
	const [selectedRoutine, setSelectedRoutine] = useState<number | null>(null);

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

	// --- Modales de footer ---
	const [showContactModal, setShowContactModal] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
						<Link
							href="/rutines"
							className="text-blue-600 font-medium hover:text-blue-700 border-b-2 border-blue-600 pb-1"
						>
							Rutinas
						</Link>
						<Link href="/store" className="hover:text-gray-600">
							Tienda
						</Link>
						<Link href="/poseDetection" className="hover:text-gray-600">
							Detector de movimientos
						</Link>
						<Link href="/chat" className="hover:text-gray-600">
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
								href="/rutines"
								className="text-blue-600 font-medium hover:text-blue-700"
								onClick={() => setOffcanvasOpen(false)}
							>
								Rutinas
							</Link>
							<Link
								href="/store"
								className="hover:text-gray-600"
								onClick={() => setOffcanvasOpen(false)}
							>
								Tienda
							</Link>
							<Link
								href="/poseDetection"
								className="hover:text-gray-600"
								onClick={() => setOffcanvasOpen(false)}
							>
								Detector de movimientos
							</Link>
							<Link
								href="/chat"
								className="hover:text-gray-600"
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

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-12 pt-32">
				<h1 className="text-3xl font-bold text-black text-center mb-12">Rutinas</h1>
				{/* Routines Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					{routines.map((routine, idx) => (
						<Card
							key={idx}
							className="p-4 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-105"
						>
							<CardHeader>
								<CardTitle className="text-xl font-semibold text-black">
									{routine.title}
								</CardTitle>
								<CardDescription className="text-gray-700">
									{routine.description}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="space-y-2 text-sm text-gray-700">
									<p>Duración: {routine.duration}</p>
								</div>
								<Button className="w-full mt-4" onClick={() => setSelectedRoutine(idx)}>
									Comenzar
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</main>

			{/* Modal de rutina seleccionada */}
			{selectedRoutine !== null && (
				<Modal onClose={() => setSelectedRoutine(null)}>
					<section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<div className="flex justify-between items-center w-full mb-4">
							<h2 className="text-2xl font-bold">
								{routines[selectedRoutine].title}{" "}
								<span className="text-base font-normal text-gray-500">
									({routines[selectedRoutine].duration})
								</span>
							</h2>
							<button
								onClick={() => setSelectedRoutine(null)}
								className="text-gray-500 hover:text-gray-700"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="mb-4">
							<p className="text-gray-700">{routines[selectedRoutine].description}</p>
						</div>
						<div className="mb-4">
							<h3 className="font-semibold mb-1">Recomendaciones:</h3>
							<ul className="list-disc pl-5 text-gray-600">
								{routines[selectedRoutine].recommendations.map((rec, i) => (
									<li key={i}>{rec}</li>
								))}
							</ul>
						</div>
						<div className="mb-4 w-full">
							<h3 className="font-semibold mb-2">Ejercicios:</h3>
							<ol className="list-decimal pl-5 space-y-3">
								{routines[selectedRoutine].exercises.map((ex, i) => (
									<li key={i}>
										<span className="font-medium">{ex.name}</span>
										<div className="ml-2 text-gray-700">{ex.explanation}</div>
										{ex.precaution && (
											<div className="ml-2 text-xs text-red-500">
												Precaución: {ex.precaution}
											</div>
										)}
										{ex.videoUrl && (
											<div className="ml-2 mt-2">
												<div className="rounded-lg overflow-hidden border shadow w-full max-w-md">
													<iframe
														width="100%"
														height="220"
														src={ex.videoUrl.replace("watch?v=", "embed/")}
														title={`Video de referencia: ${ex.name}`}
														frameBorder="0"
														allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
														allowFullScreen
													></iframe>
												</div>
											</div>
										)}
									</li>
								))}
							</ol>
						</div>
						<div className="mt-6 w-full">
							<Button
								variant="secondary"
								onClick={() => setSelectedRoutine(null)}
								className="w-full"
							>
								Cerrar
							</Button>
						</div>
					</section>
				</Modal>
			)}

			{/* Footer con modales */}
			<footer className="bg-gray-50 py-8 mt-16 border-t">
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex justify-center gap-8 text-sm text-gray-600">
						<button
							onClick={() => setShowContactModal(true)}
							className="hover:text-black transition-colors"
						>
							Contacto
						</button>
						<button
							onClick={() => setShowTermsModal(true)}
							className="hover:text-black transition-colors"
						>
							Términos y Condiciones
						</button>
						<button
							onClick={() => setShowPrivacyModal(true)}
							className="hover:text-black transition-colors"
						>
							Política de Privacidad
						</button>
					</div>
				</div>
			</footer>

			{/* Modales de footer */}
			{showContactModal && (
				<Modal onClose={() => setShowContactModal(false)}>
					<section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
						<div className="flex justify-between items-center w-full mb-4">
							<h2 className="text-2xl font-bold">Contacto</h2>
							<button
								onClick={() => setShowContactModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="space-y-4 w-full">
							<p className="text-gray-700">
								Estamos aquí para ayudarte. Contáctanos a través de los siguientes medios:
							</p>
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
								<p className="text-gray-600">
									Lunes a Viernes: 9:00 - 18:00
									<br />
									Sábados: 10:00 - 14:00
								</p>
							</div>
							<div className="pt-2">
								<h3 className="font-semibold mb-1">Dirección</h3>
								<p className="text-gray-600">
									Calle Fitness #123
									<br />
									Ciudad Deportiva, CP 12345
								</p>
							</div>
						</div>
						<div className="mt-6 w-full">
							<Button
								variant="secondary"
								onClick={() => setShowContactModal(false)}
								className="w-full"
							>
								Cerrar
							</Button>
						</div>
					</section>
				</Modal>
			)}
			{showTermsModal && (
				<Modal onClose={() => setShowTermsModal(false)}>
					<section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<div className="flex justify-between items-center w-full top-0 bg-white pb-4 border-b z-10">
							<h2 className="text-2xl font-bold">Términos y Condiciones</h2>
							<button onClick={() => setShowTermsModal(false)} className="text-gray-500 hover:text-gray-700">
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="space-y-4 w-full pt-6 mt-2">
							<p className="text-gray-700">Última actualización: 14 de marzo, 2025</p>

							<div className="mt-6">
								<h3 className="font-semibold text-lg mb-1">1. Aceptación de los Términos</h3>
								<p className="text-gray-600">
									Al acceder y utilizar los servicios de PowerMAX, aceptas estar vinculado por estos términos y condiciones. Si no
									estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">2. Uso del Servicio</h3>
								<p className="text-gray-600">
									PowerMAX proporciona una plataforma para acceder a rutinas de ejercicio y contenido relacionado con el fitness.
									Todo el contenido ofrecido en nuestra plataforma es solo para fines informativos y educativos. Siempre debes
									consultar con un profesional de la salud antes de comenzar cualquier programa de ejercicio.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">3. Cuentas de Usuario</h3>
								<p className="text-gray-600">
									Al crear una cuenta en PowerMAX, eres responsable de mantener la seguridad de tu cuenta y contraseña. La
									empresa no puede y no será responsable de ninguna pérdida o daño por tu incumplimiento de esta obligación de
									seguridad.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">4. Limitación de Responsabilidad</h3>
								<p className="text-gray-600">
									En ningún caso PowerMAX, sus directores, empleados o agentes serán responsables de cualquier daño directo,
									indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar el servicio.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">5. Cambios en los Términos</h3>
								<p className="text-gray-600">
									Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos términos en cualquier
									momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 30 días de anticipación.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">6. Cancelación</h3>
								<p className="text-gray-600">
									Puedes cancelar tu cuenta en cualquier momento. Todas las disposiciones de los Términos que por su naturaleza
									deberían sobrevivir a la terminación sobrevivirán, incluyendo, sin limitación, las disposiciones de propiedad,
									renuncias de garantía y limitaciones de responsabilidad.
								</p>
							</div>
						</div>

						<div className="mt-6 w-full">
							<Button variant="secondary" onClick={() => setShowTermsModal(false)} className="w-full">
								Cerrar
							</Button>
						</div>
					</section>
				</Modal>
			)}
			{showPrivacyModal && (
				<Modal onClose={() => setShowPrivacyModal(false)}>
					<section className="flex flex-col items-start bg-white p-8 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<div className="flex justify-between items-center w-full mb-4 top-0 bg-white pb-2">
							<h2 className="text-2xl font-bold">Política de Privacidad</h2>
							<button onClick={() => setShowPrivacyModal(false)} className="text-gray-500 hover:text-gray-700">
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="space-y-4 w-full">
							<p className="text-gray-700">Última actualización: 14 de marzo, 2025</p>

							<div>
								<h3 className="font-semibold text-lg mb-1">1. Recopilación de Información</h3>
								<p className="text-gray-600">
									Recopilamos varios tipos de información para proporcionar y mejorar nuestro servicio, incluyendo pero no limitado
									a información personal como nombre, dirección de correo electrónico, edad, altura y peso (para calculadoras de
									IMC), así como información de uso como su interacción con nuestra plataforma.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">2. Uso de la Información</h3>
								<p className="text-gray-600">
									Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, para comunicarnos
									con usted, y para desarrollar nuevos servicios. Sus datos de salud y fitness solo se utilizan para proporcionar
									cálculos y recomendaciones personalizadas.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">3. Compartir de Información</h3>
								<p className="text-gray-600">
									No vendemos, intercambiamos ni transferimos su información personal a terceros sin su consentimiento, excepto
									cuando sea necesario para proporcionar un servicio que haya solicitado.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">4. Protección de Datos</h3>
								<p className="text-gray-600">
									Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. Sus
									datos personales se almacenan en redes seguras y solo son accesibles por un número limitado de personas.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">5. Cookies</h3>
								<p className="text-gray-600">
									Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Puede elegir que su navegador rechace las
									cookies, pero esto puede impedir que aproveche algunas funcionalidades de nuestro servicio.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg mb-1">6. Sus Derechos</h3>
								<p className="text-gray-600">
									Tiene derecho a acceder, corregir o eliminar su información personal. Si desea ejercer alguno de estos derechos,
									contáctenos a través de la información proporcionada en la sección de contacto.
								</p>
							</div>
						</div>
						<div className="mt-6 w-full">
							<Button variant="secondary" onClick={() => setShowPrivacyModal(false)} className="w-full">
								Cerrar
							</Button>
						</div>
					</section>
				</Modal>
			)}

			{/* Loader mientras se cargan las rutinas */}
			{false && (
				<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
					<div className="relative">
						<div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
					</div>
					<p className="mt-4 text-lg font-medium text-gray-700">Cargando Rutinas...</p>
					<p className="text-sm text-gray-500 mt-2">Preparando tus ejercicios personalizados</p>
				</div>
			)}
		</div>
	);
}

