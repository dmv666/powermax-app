export type Rutina = {
  dia: string;
  ejercicios: string[];
};

export type RutinaTipo = "mantenimiento" | "tonificar" | "bajar de peso" | "ganar peso";

export const rutinasPorTipo: Record<RutinaTipo, Rutina[]> = {
  mantenimiento: [
    { dia: "Lunes", ejercicios: ["Caminata 30min", "Flexiones 3x10", "Abdominales 3x15", "Estiramientos 10min"] },
    { dia: "Miércoles", ejercicios: ["Bicicleta estática 40min", "Sentadillas al aire 3x12", "Elevación de talones 3x15"] },
    { dia: "Viernes", ejercicios: ["Baile o clase de cardio 45min", "Círculos de brazos 3x15", "Estiramientos completos 10min"] }
  ],
  tonificar: [
    { dia: "Lunes", ejercicios: ["Press banca 4x8", "Fondos en paralelas 4x10", "Aperturas con mancuernas 3x12", "Press francés 3x10", "Plancha 3x1min"] },
    { dia: "Martes", ejercicios: ["Sentadillas 4x10", "Prensa de piernas 4x12", "Curl femoral 3x12", "Elevación de talones 4x15", "Elevación de piernas colgado 3x15"] },
    { dia: "Jueves", ejercicios: ["Dominadas o Jalón al pecho 4x8", "Remo con barra 4x10", "Face pull 3x15", "Curl de bíceps con barra 3x10", "Curl martillo 3x12"] },
    { dia: "Viernes", ejercicios: ["Press militar con mancuernas 4x10", "Elevaciones laterales 3x12", "Pájaros 3x15", "Encogimientos de hombros 4x12", "Caminadora inclinada 20min"] }
  ],
  "bajar de peso": [
    { dia: "Lunes", ejercicios: ["Cardio HIIT en cinta 25min", "Burpees 3x15", "Mountain climbers 3x20", "Plancha con movimiento 3x45seg"] },
    { dia: "Martes", ejercicios: ["Sentadillas con salto (30s)", "Flexiones (30s)", "Jumping jacks (30s)", "Descanso (30s)", "Repetir circuito 5 veces"] },
    { dia: "Miércoles", ejercicios: ["Correr a ritmo constante 40min", "Zancadas caminando 3x20", "Remo en máquina 15min"] },
    { dia: "Jueves", ejercicios: ["Clase de Spinning 45min", "Escaladores 4x30", "Batir cuerdas 3x45seg"] },
    { dia: "Sábado", ejercicios: ["Caminata en montaña o senderismo 60-90min", "Saltar la cuerda 5x2min", "Abdominales bicicleta 3x30"] }
  ],
  "ganar peso": [
    { dia: "Lunes", ejercicios: ["Press banca 5x5", "Press militar de pie 4x8", "Press inclinado con mancuernas 4x10", "Fondos lastrados 4x8", "Extensiones de tríceps en polea 4x12"] },
    { dia: "Martes", ejercicios: ["Peso muerto 5x5", "Dominadas con lastre 4x6", "Remo con barra 4x8", "Curl de bíceps con barra Z 4x10", "Face pull 3x15"] },
    { dia: "Jueves", ejercicios: ["Sentadillas libres 5x5", "Prensa de piernas 4x10", "Peso muerto rumano 4x8", "Extensiones de cuádriceps 4x12", "Curl femoral sentado 4x12"] },
    { dia: "Viernes", ejercicios: ["Press de hombros con mancuernas 4x10", "Elevaciones laterales 4x15", "Remo al mentón 4x12", "Curl martillo 4x10", "Press francés acostado 4x10"] }
  ]
};