export type Rutina = {
  dia: string;
  ejercicios: string[];
};

export type RutinaTipo = "mantenimiento" | "tonificar" | "bajar de peso" | "ganar peso";

export const rutinasPorTipo: Record<RutinaTipo, Rutina[]> = {
  mantenimiento: [
    { dia: "Lunes", ejercicios: ["Caminata 30min", "Flexiones 3x10", "Abdominales 3x15"] },
    { dia: "Miércoles", ejercicios: ["Bicicleta 40min", "Sentadillas 3x12"] }
  ],
  tonificar: [
    { dia: "Lunes", ejercicios: ["Press banca 4x8", "Remo 4x10", "Plancha 3x1min"] },
    { dia: "Miércoles", ejercicios: ["Sentadillas 4x10", "Peso muerto 4x8"] }
  ],
  "bajar de peso": [
    { dia: "Lunes", ejercicios: ["Cardio HIIT 20min", "Burpees 3x15", "Mountain climbers 3x20"] },
    { dia: "Miércoles", ejercicios: ["Correr 30min", "Jumping jacks 3x30"] }
  ],
  "ganar peso": [
    { dia: "Lunes", ejercicios: ["Press banca 5x5", "Dominadas 4x6", "Sentadillas 5x5"] },
    { dia: "Miércoles", ejercicios: ["Peso muerto 5x5", "Remo con barra 4x8"] }
  ]
};