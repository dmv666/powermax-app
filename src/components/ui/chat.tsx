"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { MessageCircle, Dumbbell, Apple, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tipos de datos para los formularios
type DietaForm = {
  objetivo: string;
  edad: string;
  peso: string;
  altura: string;
  genero: string;
  restricciones?: string;
};

type RutinaForm = {
  objetivo: string;
  edad: string;
  experiencia: string;
  lugar: string;
  genero: string;
};

type OptionType = "dieta" | "rutina";

const Chat: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [option, setOption] = useState<OptionType | null>(null);
  const [form, setForm] = useState<Partial<DietaForm & RutinaForm>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const handleOptionSelect = (opt: OptionType) => {
    setOption(opt);
    setStep(2);
    setResponse("");
    setForm({});
  };

  const goBackToSelection = () => {
    setStep(1);
    setOption(null);
    setResponse("");
    setForm({});
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    let prompt = "";
    if (option === "dieta") {
      const { objetivo, edad, peso, altura, genero, restricciones } = form as DietaForm;
      prompt = `Crea una dieta personalizada para una persona con el siguiente objetivo: ${objetivo}, edad: ${edad}, peso: ${peso}kg, altura: ${altura}cm, género: ${genero}, alergias o restricciones: ${restricciones || 'ninguna'}. La dieta debe ser saludable, segura y estar bien estructurada por comidas (desayuno, almuerzo, cena, snacks), incluye los pesos de las porciones de cada alimento en gramos, y la cantidad de calorias que incluye cada una.`;
    } else if (option === "rutina") {
      const { objetivo, edad, experiencia, lugar, genero } = form as RutinaForm;
      prompt = `Crea una rutina de ejercicio personalizada para una semana completa con el objetivo de: ${objetivo}, edad: ${edad}, nivel de experiencia: ${experiencia}, lugar de entrenamiento: ${lugar}, género: ${genero}. Asegúrate de que sea detallada, adecuada y progresiva, incluyendo ejercicios, series, repeticiones y descansos.`;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.result || "No se pudo generar una respuesta.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setResponse("Ocurrió un error al conectar con el servidor. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const commonInputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all";

  return (
    // Se añade `relative z-10` para asegurar que este contenedor esté por encima de otros elementos de la página
    <div className="w-full max-w-4xl mx-auto px-4 pt-10 md:pt-16 pb-10 relative z-10">
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-sm min-h-[200px]">
        {step === 1 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">¿Qué tipo de asistencia necesitas hoy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => handleOptionSelect("dieta")} className="group flex items-center justify-center gap-3 p-6 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all">
                <Apple className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium text-gray-800">Dieta personalizada</span>
              </button>
              <button onClick={() => handleOptionSelect("rutina")} className="group flex items-center justify-center gap-3 p-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all">
                <Dumbbell className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium text-gray-800">Rutina de ejercicio</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
            <div className="mb-6 flex items-center border-b border-gray-200">
              <button onClick={goBackToSelection} className="p-2 mr-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex space-x-4">
                <button onClick={() => handleOptionSelect("dieta")} className={`flex items-center gap-2 py-3 px-4 font-medium transition-all ${option === "dieta" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-800"}`}>
                  <Apple className="w-5 h-5" /> Dieta
                </button>
                <button onClick={() => handleOptionSelect("rutina")} className={`flex items-center gap-2 py-3 px-4 font-medium transition-all ${option === "rutina" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}>
                  <Dumbbell className="w-5 h-5" /> Rutina
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center text-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="mt-4 text-lg font-medium text-gray-700">Generando tu plan...</p>
              </div>
            ) : response ? (
              <div className="mt-4 p-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  {option === "dieta" ? <Apple className="w-5 h-5 text-green-600" /> : <Dumbbell className="w-5 h-5 text-blue-600" />}
                  Tu plan personalizado
                </h3>
                <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap">{response}</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {option === "dieta" ? (
                    <>
                      <input className={commonInputClasses} name="objetivo" placeholder="Objetivo (ej: bajar de peso)" onChange={handleChange} required />
                      <input className={commonInputClasses} name="edad" type="number" placeholder="Edad" onChange={handleChange} required />
                      <input className={commonInputClasses} name="peso" type="number" placeholder="Peso (kg)" onChange={handleChange} required />
                      <input className={commonInputClasses} name="altura" type="number" placeholder="Altura (cm)" onChange={handleChange} required />
                      <select className={commonInputClasses} name="genero" onChange={handleChange} required defaultValue="">
                        <option value="" disabled>Selecciona tu género</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                      </select>
                      <input className={commonInputClasses} name="restricciones" placeholder="Restricciones o alergias" onChange={handleChange} />
                    </>
                  ) : (
                    <>
                      <input className={commonInputClasses} name="objetivo" placeholder="Objetivo (ej: ganar músculo)" onChange={handleChange} required />
                      <input className={commonInputClasses} name="edad" type="number" placeholder="Edad" onChange={handleChange} required />
                      <select className={commonInputClasses} name="experiencia" onChange={handleChange} required defaultValue="">
                        <option value="" disabled>Nivel de experiencia</option>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                      </select>
                      <select className={commonInputClasses} name="lugar" onChange={handleChange} required defaultValue="">
                        <option value="" disabled>¿Dónde entrenarás?</option>
                        <option value="casa">En Casa</option>
                        <option value="gimnasio">Gimnasio</option>
                      </select>
                      <select className={commonInputClasses} name="genero" onChange={handleChange} required defaultValue="">
                        <option value="" disabled>Selecciona tu género</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                      </select>
                    </>
                  )}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <MessageCircle className="w-5 h-5 mr-2" />}
                  {loading ? "Generando..." : "Generar recomendación"}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;