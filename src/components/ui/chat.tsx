"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { MessageCircle, Dumbbell, Apple, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

type OptionType = "dieta" | "rutina" | "";

const Chat: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [option, setOption] = useState<OptionType>("");
  const [form, setForm] = useState<Partial<DietaForm & RutinaForm>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const handleOptionSelect = (opt: OptionType) => {
    setOption(opt);
    setStep(2);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let prompt = "";

    if (option === "dieta") {
      const { objetivo, edad, peso, altura, genero, restricciones } = form as DietaForm;
      prompt = `Crea una dieta personalizada para una persona con el siguiente objetivo: ${objetivo}, edad: ${edad}, peso: ${peso}kg, altura: ${altura}cm, género: ${genero}, alergias o restricciones: ${restricciones}. La dieta debe ser saludable y segura.`;
    } else if (option === "rutina") {
      const { objetivo, edad, experiencia, lugar, genero } = form as RutinaForm;
      prompt = `Crea una rutina de ejercicio personalizada con el objetivo de: ${objetivo}, edad: ${edad}, nivel de experiencia: ${experiencia}, lugar: ${lugar}, género: ${genero}. Asegúrate de que sea adecuada y progresiva.`;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.result || "Sin respuesta.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setResponse("Ocurrió un error al generar la respuesta.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-32">
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">¿Qué tipo de asistencia necesitas?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleOptionSelect("dieta")}
                className="flex items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all group"
              >
                <Apple className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium text-gray-800">Dieta personalizada</span>
              </button>
              <button
                onClick={() => handleOptionSelect("rutina")}
                className="flex items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all group"
              >
                <Dumbbell className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium text-gray-800">Rutina de ejercicio</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              {option === "dieta" ? (
                <>
                  <Apple className="w-6 h-6 text-green-600" />
                  Personaliza tu dieta
                </>
              ) : (
                <>
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                  Personaliza tu rutina
                </>
              )}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {option === "dieta" ? (
                <>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="objetivo"
                    placeholder="Objetivo (ej: bajar de peso)"
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="edad"
                    type="number"
                    placeholder="Edad"
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="peso"
                    type="number"
                    placeholder="Peso (kg)"
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="altura"
                    type="number"
                    placeholder="Altura (cm)"
                    onChange={handleChange}
                    required
                  />
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="genero"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona tu género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="restricciones"
                    placeholder="Restricciones o alergias"
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="objetivo"
                    placeholder="Objetivo (ej: ganar músculo)"
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="edad"
                    type="number"
                    placeholder="Edad"
                    onChange={handleChange}
                    required
                  />
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="experiencia"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Nivel de experiencia</option>
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="lugar"
                    onChange={handleChange}
                    required
                  >
                    <option value="">¿Dónde entrenarás?</option>
                    <option value="casa">Casa</option>
                    <option value="gimnasio">Gimnasio</option>
                  </select>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    name="genero"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona tu género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                </>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <MessageCircle className="w-5 h-5 mr-2" />
              )}
              {loading ? "Generando..." : "Generar recomendación"}
            </Button>
          </form>
        )}

        {response && (
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              {option === "dieta" ? (
                <Apple className="w-5 h-5 text-green-600" />
              ) : (
                <Dumbbell className="w-5 h-5 text-blue-600" />
              )}
              Tu plan personalizado
            </h3>
            <div className="prose prose-blue max-w-none">
              {response.split('\n').map((line, i) => (
                <p key={i} className="mb-2 text-gray-700">{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
