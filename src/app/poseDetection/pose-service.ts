import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"

// Inicializar el PoseLandmarker con configuración mejorada para estabilidad
export async function createPoseLandmarker(): Promise<PoseLandmarker> {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
  )

  const landmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task", // Usar modelo heavy para mejor precisión
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1, // Limitar a 1 pose para evitar detecciones falsas
    minPoseDetectionConfidence: 0.6, // Aumentado para reducir falsos positivos
    minPosePresenceConfidence: 0.6, // Aumentado para mayor estabilidad
    minTrackingConfidence: 0.6, // Aumentado para mejor seguimiento
  })

  return landmarker
}

// Obtener acceso a la cámara
export async function getCamera(constraints: MediaStreamConstraints): Promise<MediaStream> {
  return await navigator.mediaDevices.getUserMedia(constraints)
}

