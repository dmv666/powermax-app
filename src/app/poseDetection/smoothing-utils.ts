import type { PoseLandmark, SmoothedLandmark } from "./types"

// Aumentar el tamaño del buffer para un suavizado más intenso
const SMOOTHING_BUFFER_SIZE = 10 // Aumentado de 5 a 10 para mayor suavizado

// Función para inicializar un landmark suavizado
export function initializeSmoothedLandmark(landmark: PoseLandmark): SmoothedLandmark {
  return {
    ...landmark,
    prevX: Array(SMOOTHING_BUFFER_SIZE).fill(landmark.x),
    prevY: Array(SMOOTHING_BUFFER_SIZE).fill(landmark.y),
    prevZ: Array(SMOOTHING_BUFFER_SIZE).fill(landmark.z),
    visibility: landmark.visibility || 0, // Asegurar que visibility nunca sea undefined
  }
}

// Función para actualizar un landmark suavizado con un nuevo valor
// Implementamos un filtro de suavizado más potente con ponderación
export function updateSmoothedLandmark(smoothed: SmoothedLandmark, current: PoseLandmark): SmoothedLandmark {
  // Actualizar los buffers
  const prevX = [...(smoothed.prevX || []), current.x].slice(-SMOOTHING_BUFFER_SIZE)
  const prevY = [...(smoothed.prevY || []), current.y].slice(-SMOOTHING_BUFFER_SIZE)
  const prevZ = [...(smoothed.prevZ || []), current.z].slice(-SMOOTHING_BUFFER_SIZE)

  // Aplicar ponderación - los valores más recientes tienen más peso
  let weightedSumX = 0
  let weightedSumY = 0
  let weightedSumZ = 0
  let totalWeight = 0

  // Aplicar pesos exponenciales - los valores más recientes tienen mucho más peso
  for (let i = 0; i < prevX.length; i++) {
    // Peso exponencial: los últimos valores tienen mucho más peso
    const weight = Math.exp(0.4 * i)
    weightedSumX += prevX[i] * weight
    weightedSumY += prevY[i] * weight
    weightedSumZ += prevZ[i] * weight
    totalWeight += weight
  }

  // Calcular los promedios ponderados
  const x = weightedSumX / totalWeight
  const y = weightedSumY / totalWeight
  const z = weightedSumZ / totalWeight

  // Mantener la visibilidad del landmark actual
  return {
    x,
    y,
    z,
    visibility: current.visibility || 0, // Asegurar que visibility nunca sea undefined
    prevX,
    prevY,
    prevZ,
  }
}

// Función para convertir landmarks a formato compatible con MediaPipe
export function toNormalizedLandmarks(landmarks: SmoothedLandmark[]): any[] {
  return landmarks.map(({ x, y, z, visibility }) => ({ x, y, z, visibility }))
}

// Función para suavizar todos los landmarks
export function smoothLandmarks(
  currentLandmarks: PoseLandmark[],
  previousSmoothedLandmarks?: SmoothedLandmark[],
): SmoothedLandmark[] {
  // Si no hay landmarks previos, inicializar todos
  if (!previousSmoothedLandmarks || previousSmoothedLandmarks.length !== currentLandmarks.length) {
    return currentLandmarks.map((landmark) => {
      // Asegurar que visibility nunca sea undefined
      const safeLandmark = {
        ...landmark,
        visibility: landmark.visibility || 0,
      }
      return initializeSmoothedLandmark(safeLandmark)
    })
  }

  // Actualizar cada landmark con suavizado
  return currentLandmarks.map((landmark, index) => {
    // Asegurar que visibility nunca sea undefined
    const safeLandmark = {
      ...landmark,
      visibility: landmark.visibility || 0,
    }
    return updateSmoothedLandmark(previousSmoothedLandmarks[index], safeLandmark)
  })
}

