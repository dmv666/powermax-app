"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { DrawingUtils, PoseLandmarker } from "@mediapipe/tasks-vision"
import { exercises, translateJointName, getJointLandmarkIndex } from "./exercises"
import { getJointAngle } from "./angle-utils"
import { areJointLandmarksVisible } from "./landmark-utils"
import { createPoseLandmarker, getCamera } from "./pose-service"
import { AngleState, type SmoothedLandmark } from "./types"
import {
  getColorForAngle,
  getBackgroundColorForState,
  getTextColorForState,
  stateColors,
  rgbToString,
} from "./color-utils"
import { smoothLandmarks } from "./smoothing-utils"
import { Menu, X, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"


// Mapeo de ejercicios a videos de referencia
const exerciseVideos: Record<string, string> = {
  squat: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758210018/WhatsApp_Video_2025-09-18_at_8.06.22_AM_tdsr4i.mp4",           // Sentadilla libre (Squat)
  deadlift: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758210014/WhatsApp_Video_2025-09-18_at_8.06.21_AM_1_tt3bha.mp4",     // Peso muerto convencional (Deadlift)
  lunges: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758210022/WhatsApp_Video_2025-09-18_at_8.06.26_AM_hjjae6.mp4",         // Zancadas (Lunges)
  calfRaises: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758209989/WhatsApp_Video_2025-09-18_at_8.06.11_AM_1_tasmaa.mp4",  // Elevación de talones (Calf raises)
  benchPress: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758210016/WhatsApp_Video_2025-09-18_at_8.06.21_AM_2_tywkaw.mp4",  // Press de banca (Bench press)
  dips: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758209902/WhatsApp_Video_2025-09-18_at_8.06.10_AM_1_yb7qv1.mp4",              // Fondos en paralelas (Dips)
  latPulldown: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758210009/WhatsApp_Video_2025-09-18_at_8.06.11_AM_2_sv4jpm.mp4",// Jalón al pecho (Lat Pulldown)
  pullUps: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758209938/WhatsApp_Video_2025-09-18_at_8.06.11_AM_htdgif.mp4",        // Dominadas (Pull-ups)
  shoulderPress: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758210011/WhatsApp_Video_2025-09-18_at_8.06.21_AM_uhz0ia.mp4", // Press militar (Shoulder Press)
  barbellRow: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758210020/WhatsApp_Video_2025-09-18_at_8.06.22_AM_1_itowu5.mp4",  // Remo con barra (Barbell Row)
  bicepsCurl: "https://res.cloudinary.com/dbeaem1xr/video/upload/v1758209819/WhatsApp_Video_2025-09-18_at_8.06.10_AM_s4pmab.mp4",  // Curl de bíceps (Biceps Curl)
}

// Componente de feedback corregido y completo
const ExerciseFeedback: React.FC<{
  exercise: (typeof exercises)[0] | null
  angles: { [key: string]: number }
  angleStates: { [key: string]: AngleState }
  gripCorrect: boolean
  handFeedback: string
  progress: number
  isCorrect: boolean
  repetitionCount: number
  exerciseTimer: number
}> = ({
  exercise,
  angles,
  angleStates,
  gripCorrect,
  handFeedback,
  progress,
  isCorrect,
  repetitionCount,
  exerciseTimer,
}) => {
  if (!exercise) return null

  // Calcular porcentaje de corrección general
  const totalJoints = exercise.joints.length
  const correctJoints = Object.entries(angleStates).filter(([joint, state]) => state === AngleState.GOOD).length
  const correctPercentage = totalJoints > 0 ? Math.round((correctJoints / totalJoints) * 100) : 0

  // Determinar mensaje general
  let overallMessage = ""
  if (correctPercentage >= 90) {
    overallMessage = "¡Excelente forma! Mantén la posición."
  } else if (correctPercentage >= 70) {
    overallMessage = "Buena forma. Pequeños ajustes necesarios."
  } else if (correctPercentage >= 50) {
    overallMessage = "Forma aceptable. Presta atención a las articulaciones marcadas."
  } else {
    overallMessage = "Necesitas mejorar tu forma. Revisa las instrucciones."
  }

  // Generar consejos específicos
  const specificTips = Object.entries(angleStates)
    .filter(([joint, state]) => state !== AngleState.GOOD && state !== AngleState.DEAD_ZONE)
    .map(([joint, state]) => {
      const angle = angles[joint]
      const jointName = translateJointName(joint)
      const range = exercise.angleRanges[joint]

      if (state === AngleState.WARNING) {
        return `${jointName}: Casi correcto (${angle?.toFixed(1)}°). Ajusta ligeramente.`
      } else if (state === AngleState.DANGER) {
        if (angle < range.min) {
          return `${jointName}: Demasiado flexionado (${angle?.toFixed(1)}°). Extiende más.`
        } else {
          return `${jointName}: Demasiado extendido (${angle?.toFixed(1)}°). Flexiona más.`
        }
      }
      return ""
    })
    .filter((tip) => tip !== "")

    

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
      <h3 className="text-xl font-bold mb-2">{exercise.name}</h3>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span>Precisión de forma:</span>
          <span className="font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              progress >= 80 ? "bg-green-600" : progress >= 50 ? "bg-yellow-500" : "bg-red-600"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Contador de repeticiones */}
      {(exercise.id === "squat" ||
        exercise.id === "benchPress" ||
        exercise.id === "shoulderPress" ||
        exercise.id === "deadlift") && (
        <div className="mb-4 text-center">
          <span className="text-3xl font-bold">{repetitionCount}</span>
          <span className="text-lg ml-2">repeticiones</span>
        </div>
      )}

      {/* Timer para ejercicios estáticos */}
      {(exercise.id === "plank" || exercise.id === "sidePlank") && (
        <div className="mb-4 text-center">
          <span className="text-3xl font-bold">{Math.floor(exerciseTimer)}</span>
          <span className="text-lg ml-2">segundos</span>
        </div>
      )}

      {/* Estado general */}
      <div
        className={`p-3 rounded-lg mb-4 text-center ${
          isCorrect ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}
      >
        <p className="font-bold">{isCorrect ? "¡Forma correcta!" : "Ajusta tu postura"}</p>
      </div>

      <p className="font-medium mb-3">{overallMessage}</p>

      {specificTips.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold mb-1">Ajustes necesarios:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {specificTips.map((tip, index) => (
              <li key={index} className="text-sm">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(exercise.id === "latPulldown" || exercise.id === "pullUps") && (
        <div className={`p-2 rounded ${gripCorrect ? "bg-green-100" : "bg-yellow-100"} mt-2`}>
          <p className="text-sm font-medium">
            <span className="font-bold">Agarre: </span>
            {handFeedback}
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>{exercise.description}</p>
      </div>
    </div>
  )
}

const PoseDetection: React.FC = () => {
  const [webcamRunning, setWebcamRunning] = useState<boolean>(false)
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)

  const [leftJoint, setLeftJoint] = useState<string>("default")
  const [rightJoint, setRightJoint] = useState<string>("default")
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("default")
  const [angles, setAngles] = useState<{ [key: string]: number }>({})
  const [angleStates, setAngleStates] = useState<{ [key: string]: AngleState }>({})

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null)
  const referenceVideoRef = useRef<HTMLVideoElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastDetectionTimeRef = useRef<number>(0)
  const detectedPoseRef = useRef<any>(null)
  const smoothedLandmarksRef = useRef<SmoothedLandmark[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth()
  const router = useRouter()
  const [offcanvasOpen, setOffcanvasOpen] = useState(false)

  // Función para cerrar sesión
  function handleLogout() {
    // Implementa aquí la lógica de logout si existe, o elimina esta función si no es necesaria
    router.push("/auth/login")
  }

  // Obtener el ejercicio seleccionado
  const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId) || null

  // Verificar si el ejercicio seleccionado tiene un video de referencia
  const hasReferenceVideo = selectedExerciseId !== "default" && exerciseVideos[selectedExerciseId] !== undefined

  // Inicialización del PoseLandmarker
  useEffect(() => {
    const initPoseLandmarker = async () => {
      setIsLoading(true)
      setLoading(true)
      try {
        const landmarker = await createPoseLandmarker()
        setPoseLandmarker(landmarker)
      } catch (error) {
        console.error("Error al crear PoseLandmarker:", error)
      } finally {
        setIsLoading(false)
        setLoading(false)
      }
    }

    initPoseLandmarker()

    // Limpiar recursos al desmontar
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Efecto para cargar el video de referencia cuando cambia el ejercicio seleccionado
  useEffect(() => {
    if (referenceVideoRef.current) {
      if (hasReferenceVideo) {
        referenceVideoRef.current.src = exerciseVideos[selectedExerciseId]
        referenceVideoRef.current.load()
      } else {
        referenceVideoRef.current.src = ""
      }
    }
  }, [selectedExerciseId, hasReferenceVideo])

  // Ajustar el tamaño de los canvas al tamaño del video
  useEffect(() => {
    const resizeCanvases = () => {
      if (videoRef.current && canvasRef.current && canvas2Ref.current) {
        const { videoWidth, videoHeight } = videoRef.current
        if (videoWidth && videoHeight) {
          canvasRef.current.width = videoWidth
          canvasRef.current.height = videoHeight
          canvas2Ref.current.width = videoWidth
          canvas2Ref.current.height = videoHeight
        }
      }
    }

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener("loadedmetadata", resizeCanvases)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadedmetadata", resizeCanvases)
      }
    }
  }, [webcamRunning])

  // Función de predicción optimizada con suavizado mejorado y control de tasa
  const predictWebcam = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const canvasCtx = canvas?.getContext("2d")
    const canvas2 = canvas2Ref.current
    const canvasCtx2 = canvas2?.getContext("2d")

    if (!canvas || !canvasCtx || !canvas2 || !canvasCtx2 || !poseLandmarker || !video) {
      console.log("Algunos elementos no están disponibles.")
      return
    }

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas2.width = video.videoWidth
      canvas2.height = video.videoHeight
    }

    const drawingUtils = new DrawingUtils(canvasCtx)

    // Control de tasa de detección para mejorar rendimiento y estabilidad
    const now = performance.now()
    const elapsed = now - lastDetectionTimeRef.current

    // Reducir la tasa de detección para mejorar estabilidad (40ms ≈ 25 FPS)
    const shouldDetect = elapsed > 40 // Reducido a 25 FPS para mayor estabilidad

    try {
      let result

      if (shouldDetect) {
        // Detectar poses solo cuando sea necesario
        result = await poseLandmarker.detectForVideo(video, now)
        lastDetectionTimeRef.current = now

        // Si se detectó al menos una pose, guardarla como referencia
        if (result.landmarks && result.landmarks.length > 0) {
          detectedPoseRef.current = result

          // Aplicar suavizado a los landmarks
          if (result.landmarks[0]) {
            smoothedLandmarksRef.current = smoothLandmarks(result.landmarks[0], smoothedLandmarksRef.current)
          }
        }
      } else {
        // Usar la última detección si no es momento de detectar
        result = detectedPoseRef.current || { landmarks: [] }
      }

      // Limpiar canvas
      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

      // Aplicar transformación para invertir horizontalmente el canvas de predicción
      canvasCtx.scale(-1, 1)
      canvasCtx.translate(-canvas.width, 0)

      canvasCtx2.save()
      canvasCtx2.clearRect(0, 0, canvas2.width, canvas2.height)

      // Aplicar transformación para invertir horizontalmente el canvas de texto
      canvasCtx2.scale(-1, 1)
      canvasCtx2.translate(-canvas2.width, 0)

      const newAngles: { [key: string]: number } = {}
      const newAngleStates: { [key: string]: AngleState } = {}

      // Solo procesar si tenemos landmarks suavizados
      if (smoothedLandmarksRef.current.length > 0) {
        const smoothedLandmarks = smoothedLandmarksRef.current

        // Dibujar las conexiones - convertir a formato compatible
        const normalizedLandmarks = smoothedLandmarks.map(({ x, y, z, visibility }) => ({
          x,
          y,
          z,
          visibility,
        }))

        drawingUtils.drawConnectors(normalizedLandmarks, PoseLandmarker.POSE_CONNECTIONS, {
          color: "black", // Líneas en negro
          lineWidth: 3, // Líneas más gruesas
        })

        // El resto del código de procesamiento de landmarks permanece igual...
        // Si hay un ejercicio seleccionado, calcular todos los ángulos relevantes
        if (selectedExercise) {
          // Primero dibujar los landmarks que no son articulaciones del ejercicio
          const exerciseJointIndices = selectedExercise.joints.map(getJointLandmarkIndex)
          const otherLandmarks = smoothedLandmarks
            .filter((landmark, i) => !exerciseJointIndices.includes(i) && i < 33 && landmark.visibility > 0.5)
            .map(({ x, y, z, visibility }) => ({ x, y, z, visibility }))

          if (otherLandmarks.length > 0) {
            drawingUtils.drawLandmarks(otherLandmarks, {
              radius: 3,
              color: "white",
              fillColor: rgbToString(stateColors.deadZone), // Negro para landmarks no relevantes
            })
          }

          // Calcular todos los ángulos primero para poder usar la correlación
          for (const joint of selectedExercise.joints) {
            if (areJointLandmarksVisible(smoothedLandmarks, joint)) {
              const angle = getJointAngle(smoothedLandmarks, joint, selectedExercise.id)
              if (angle !== null) {
                newAngles[joint] = angle
              }
            }
          }

          // Luego dibujar los landmarks de las articulaciones con colores basados en el estado
          for (const joint of selectedExercise.joints) {
            const landmarkIndex = getJointLandmarkIndex(joint)
            if (landmarkIndex >= 0 && smoothedLandmarks[landmarkIndex].visibility > 0.5) {
              // Verificar si tenemos un ángulo calculado para esta articulación
              if (newAngles[joint] !== undefined) {
                const angle = newAngles[joint]

                // Determinar el color basado en el ángulo, pasando todos los ángulos para correlación
                const { color, state } = getColorForAngle(angle, selectedExercise, joint, newAngles)
                newAngleStates[joint] = state

                // Dibujar el landmark con el color correspondiente
                drawingUtils.drawLandmarks(
                  [
                    {
                      x: smoothedLandmarks[landmarkIndex].x,
                      y: smoothedLandmarks[landmarkIndex].y,
                      z: smoothedLandmarks[landmarkIndex].z,
                      visibility: smoothedLandmarks[landmarkIndex].visibility,
                    },
                  ],
                  {
                    radius: 8, // Aumentar tamaño para mejor visibilidad
                    color: "white",
                    fillColor: color,
                  },
                )

                // Imprimir información de depuración en la consola
                console.log(`Joint: ${joint}, Angle: ${angle.toFixed(2)}°, State: ${state}`)
              }
            }
          }
        } else {
          // Modo manual: calcular ángulos según las selecciones actuales
          // Dibujar todos los landmarks normalmente
          drawingUtils.drawLandmarks(normalizedLandmarks, {
            radius: 3,
            color: "white",
            fillColor: rgbToString(stateColors.deadZone), // Negro para modo manual
          })

          // Lado izquierdo
          if (leftJoint !== "default" && areJointLandmarksVisible(smoothedLandmarks, leftJoint)) {
            const angle = getJointAngle(smoothedLandmarks, leftJoint)
            if (angle !== null) {
              newAngles[leftJoint] = angle
              newAngleStates[leftJoint] = AngleState.GOOD // En modo manual, siempre es "good"

              // Resaltar el landmark seleccionado
              const landmarkIndex = getJointLandmarkIndex(leftJoint)
              if (landmarkIndex >= 0) {
                drawingUtils.drawLandmarks(
                  [
                    {
                      x: smoothedLandmarks[landmarkIndex].x,
                      y: smoothedLandmarks[landmarkIndex].y,
                      z: smoothedLandmarks[landmarkIndex].z,
                      visibility: smoothedLandmarks[landmarkIndex].visibility,
                    },
                  ],
                  {
                    radius: 8,
                    color: "white",
                    fillColor: rgbToString(stateColors.good), // Verde para modo manual
                  },
                )
              }
            }
          }

          // Lado derecho
          if (rightJoint !== "default" && areJointLandmarksVisible(smoothedLandmarks, rightJoint)) {
            const angle = getJointAngle(smoothedLandmarks, rightJoint)
            if (angle !== null) {
              newAngles[rightJoint] = angle
              newAngleStates[rightJoint] = AngleState.GOOD // En modo manual, siempre es "good"

              // Resaltar el landmark seleccionado
              const landmarkIndex = getJointLandmarkIndex(rightJoint)
              if (landmarkIndex >= 0) {
                drawingUtils.drawLandmarks(
                  [
                    {
                      x: smoothedLandmarks[landmarkIndex].x,
                      y: smoothedLandmarks[landmarkIndex].y,
                      z: smoothedLandmarks[landmarkIndex].z,
                      visibility: smoothedLandmarks[landmarkIndex].visibility,
                    },
                  ],
                  {
                    radius: 8,
                    color: "white",
                    fillColor: rgbToString(stateColors.good), // Verde para modo manual
                  },
                )
              }
            }
          }
        }
      }

      setAngles(newAngles)
      setAngleStates(newAngleStates)

      // Restaurar la transformación para dibujar el texto correctamente
      canvasCtx2.restore()
      canvasCtx2.save()

      // Dibujar los ángulos en el canvas con fondo para mejor legibilidad
      let yPosition = 50
      Object.entries(newAngles).forEach(([joint, angle]) => {
        // Traducir el nombre del joint para mostrar
        const jointName = translateJointName(joint)

        // Obtener el estado del ángulo
        const state = newAngleStates[joint] || AngleState.GOOD

        // Obtener colores basados en el estado
        const bgColor = getBackgroundColorForState(state)
        const textColor = getTextColorForState(state)

        // Dibujar un fondo semi-transparente para el texto
        canvasCtx2.fillStyle = bgColor
        canvasCtx2.fillRect(40, yPosition - 20, 250, 30)

        // Dibujar el texto
        canvasCtx2.fillStyle = textColor
        canvasCtx2.font = "20px Arial"
        canvasCtx2.fillText(`${jointName}: ${angle.toFixed(2)}°`, 50, yPosition)
        yPosition += 40 // Más espacio entre líneas
      })

      canvasCtx.restore()
      canvasCtx2.restore()
    } catch (error) {
      console.error("Error en la detección:", error)
    }

    // Continuar el ciclo de predicción solo si la webcam está en ejecución
    if (webcamRunning) {
      animationRef.current = requestAnimationFrame(predictWebcam)
    }
  }, [webcamRunning, poseLandmarker, leftJoint, rightJoint, selectedExercise])

  // Habilitar la cámara
  const enableCam = useCallback(async () => {
    if (!poseLandmarker) {
      console.log("¡Espera! El poseLandMarker no se ha cargado aún.")
      return
    }

    // Detener cualquier stream anterior
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
          frameRate: { ideal: 30 }, // Solicitar 30 FPS para mejor fluidez
        },
      }
      const stream = await getCamera(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.addEventListener(
          "loadeddata",
          () => {
            setWebcamRunning(true)
            // Iniciar la predicción después de que los datos del video estén cargados
            lastDetectionTimeRef.current = performance.now()
            requestAnimationFrame(predictWebcam)
          },
          { once: true },
        )
      }
    } catch (error) {
      console.error("Error al acceder a la cámara:", error)
    }
  }, [poseLandmarker, predictWebcam])

  // Efecto para reiniciar la predicción cuando cambian los joints seleccionados o el ejercicio
  useEffect(() => {
    if (webcamRunning) {
      // Si ya está corriendo, cancelar el frame actual y reiniciar
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Reiniciar la predicción
      animationRef.current = requestAnimationFrame(predictWebcam)
    }
  }, [leftJoint, rightJoint, selectedExerciseId, webcamRunning, predictWebcam])

  // Manejadores para el cambio en los selectores de joints
  const handleLeftJointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLeftJoint(e.target.value)
    setSelectedExerciseId("default") // Desactivar el modo ejercicio al seleccionar manualmente
  }

  const handleRightJointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRightJoint(e.target.value)
    setSelectedExerciseId("default") // Desactivar el modo ejercicio al seleccionar manualmente
  }

  // Manejador para seleccionar un ejercicio
  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exerciseId = e.target.value
    setSelectedExerciseId(exerciseId)

    if (exerciseId !== "default") {
      // Si se selecciona un ejercicio, resetear las selecciones manuales
      setLeftJoint("default")
      setRightJoint("default")
    }
  }

  // Detener la cámara
  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setWebcamRunning(false)
    detectedPoseRef.current = null
    smoothedLandmarksRef.current = []
  }, [])

  // Calcula valores por defecto para las props del feedback
  const totalJoints = selectedExercise?.joints.length || 0
  const correctJoints = Object.entries(angleStates).filter(([joint, state]) => state === AngleState.GOOD).length
  const progress = totalJoints > 0 ? Math.round((correctJoints / totalJoints) * 100) : 0
  const isCorrect = progress >= 80 // Puedes ajustar este umbral
  const repetitionCount = 0 // TODO: Implementa la lógica real
  const exerciseTimer = 0 // TODO: Implementa la lógica real
  const gripCorrect = true // TODO: Implementa la lógica real
  const handFeedback = "" // TODO: Implementa la lógica real

  // Función para ver el perfil
  const handleViewProfile = () => {
		router.push("/dashboard/profile");
	};

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando Detector de Movimientos...</p>
        <p className="text-sm text-gray-500 mt-2">Inicializando el modelo de detección</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4">
      {/* Navbar Offcanvas estilo Bootstrap */}
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
            <Link href="/dashboard" className="hover:text-gray-600">Panel</Link>
            <Link href="/rutines" className="hover:text-gray-600">Rutinas</Link>
            <Link href="/store" className="hover:text-gray-600">Tienda</Link>
            <Link href="/poseDetection" className="text-blue-600 font-medium hover:text-blue-700 border-b-2 border-blue-600 pb-1">Detector de movimientos</Link>
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
              <Link href="/dashboard" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Panel</Link>
              <Link href="/rutines" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Rutinas</Link>
              <Link href="/store" className="hover:text-gray-600" onClick={() => setOffcanvasOpen(false)}>Tienda</Link>
              <Link href="/poseDetection" className="text-blue-600" onClick={() => setOffcanvasOpen(false)}>Detector de movimientos</Link>
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
      
      <h1 className="text-center text-2xl md:text-3xl font-bold mt-20 mb-4">Pose Detection using MediaPipe</h1>

      {/* Botones para controlar la cámara */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
        <button
          onClick={enableCam}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
          disabled={webcamRunning || isLoading}
        >
          {isLoading ? "Cargando..." : "Activar Cámara"}
        </button>

        {webcamRunning && (
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Detener Cámara
          </button>
        )}
      </div>

      {/* Selectores para las articulaciones y ejercicios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 w-full">
        <select
          id="exerciseSelect"
          className="p-2 border rounded w-full text-sm md:text-base"
          value={selectedExerciseId}
          onChange={handleExerciseChange}
        >
          <option value="default">Seleccionar Ejercicio</option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>

        <select
          id="leftSideSelect"
          className="p-2 border rounded w-full text-sm md:text-base"
          value={leftJoint}
          onChange={handleLeftJointChange}
          disabled={selectedExerciseId !== "default"}
        >
          <option value="default">Seleccionar Articulación Izquierda</option>
          <option value="leftShoulder">Hombro Izquierdo</option>
          <option value="leftElbow">Codo Izquierdo</option>
          <option value="leftWrist">Muñeca Izquierda</option>
          <option value="leftHip">Cadera Izquierda</option>
          <option value="leftKnee">Rodilla Izquierda</option>
          <option value="leftAnkle">Tobillo Izquierdo</option>
        </select>

        <select
          id="rightSideSelect"
          className="p-2 border rounded w-full text-sm md:text-base"
          value={rightJoint}
          onChange={handleRightJointChange}
          disabled={selectedExerciseId !== "default"}
        >
          <option value="default">Seleccionar Articulación Derecha</option>
          <option value="rightShoulder">Hombro Derecho</option>
          <option value="rightElbow">Codo Derecho</option>
          <option value="rightWrist">Muñeca Derecha</option>
          <option value="rightHip">Cadera Derecha</option>
          <option value="rightKnee">Rodilla Derecha</option>
          <option value="rightAnkle">Tobillo Derecho</option>
        </select>
      </div>

      {/* Información del ejercicio seleccionado */}
      {selectedExercise && (
        <div className="mb-6 text-center w-full">
          <p className="text-sm md:text-base text-gray-600">{selectedExercise.description}</p>
        </div>
      )}
{/* Contenedor principal: cámara y panel derecho en fila en lg, columna en móvil */}
<div className="flex flex-col gap-6 w-full items-center justify-center lg:flex-row lg:items-start lg:gap-8">
  {/* Sección de la cámara (video + canvas) */}
  <div className="relative w-full max-w-[860px] aspect-[860/645] border border-gray-300 rounded overflow-hidden lg:w-[860px] lg:h-[645px]">
    <video
      ref={videoRef}
      autoPlay
      playsInline
      width="860"
      height="645"
      className="absolute top-0 left-0 w-full h-full transform scale-x-[-1] object-cover"
    />

    <canvas
      ref={canvasRef}
      id="output_canvas"
      width="860"
      height="645"
      className="absolute top-0 left-0 w-full h-full"
    />

    <canvas
      ref={canvas2Ref}
      id="output_canvas2"
      width="860"
      height="645"
      className="absolute top-0 left-0 w-full h-full z-10"
    />

    {!webcamRunning && !isLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
        <p>Cámara desactivada</p>
      </div>
    )}

    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
        <p>Cargando modelo...</p>
      </div>
    )}
  </div>

  {/* Panel derecho: instrucciones + feedback + video de referencia */}
  <div className="flex flex-col gap-4 w-full max-w-[400px] lg:w-[400px]">
    {/* Instrucciones generales */}
    {!selectedExercise && (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-md font-semibold mb-2">Instrucciones</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Selecciona un ejercicio del menú desplegable</li>
          <li>Posiciónate frente a la cámara de modo que tu cuerpo completo sea visible</li>
          <li>Mantén una buena iluminación para mejorar la detección</li>
          <li>Sigue las instrucciones específicas para cada ejercicio</li>
          <li>Observa el feedback en tiempo real para corregir tu postura</li>
        </ol>
      </div>
    )}

    {/* Componente de feedback */}
    {selectedExercise && (
      <ExerciseFeedback
        exercise={selectedExercise}
        angles={angles}
        angleStates={angleStates}
        gripCorrect={gripCorrect}
        handFeedback={handFeedback}
        progress={progress}
        isCorrect={isCorrect}
        repetitionCount={repetitionCount}
        exerciseTimer={exerciseTimer}
      />
    )}

    {/* Video de referencia */}
    <div className="relative w-full max-w-[400px] aspect-video border border-gray-300 rounded overflow-hidden bg-gray-100 lg:h-[360px]">
      {hasReferenceVideo ? (
        <video ref={referenceVideoRef} controls className="w-full h-full object-cover">
          <source src={exerciseVideos[selectedExerciseId]} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center px-4">
          <p>Selecciona un ejercicio complejo para ver el video de referencia</p>
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  )
}

export default PoseDetection

