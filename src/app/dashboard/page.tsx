"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { useIMC } from "@/app/contexts/ImcContext"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import IMCModal from "@/components/ui/ImcModal"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { imcData, loading: imcLoading } = useIMC()
  const [showModal, setShowModal] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log({ user, loading })
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!imcLoading && imcData) {
      setShowModal(false) // Si ya hay datos, cerramos el modal
    } else if (!imcLoading && !imcData) {
      setShowModal(true) // Si no hay datos, lo abrimos
    }
  }, [imcData, imcLoading])

  useEffect(() => {
    console.log("IMC Data:", imcData)
  }, [imcData])
  

  const handleLogout = async () => {
    try {
      await signOut(auth) // Cerramos sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }
  
  // Redirigir cuando el usuario se vuelve null después del logout
  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])
  

  const getIMCStatus = (bmi: number) => {
    if (bmi < 18.5) return "Bajo de peso"
    if (bmi >= 18.5 && bmi < 24.9) return "Peso normal"
    if (bmi >= 25 && bmi < 29.9) return "Sobrepeso"
    return "Obesidad"
  }

  if (loading || imcLoading) {
    return <div className="min-h-screen flex justify-center">Cargando...</div>
  }

  if (!user) {
    return null
  }
  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Bienvenido a tu Dashboard, {user.displayName || user.email}
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tus Estadísticas</h2>
          {imcData ? (
            <div className="text-center">
              <p className="text-lg">
                <strong>Altura:</strong> {imcData.height} m
              </p>
              <p className="text-lg">
                <strong>Peso:</strong> {imcData.weight} kg
              </p>
              <p className="text-lg">
                <strong>IMC:</strong> {imcData.bmi}
              </p>
              <p className={`text-lg font-semibold ${getIMCStatus(imcData.bmi) === "Peso normal" ? "text-green-500" : getIMCStatus(imcData.bmi) === "Sobrepeso" ? "text-yellow-500" : "text-red-500"}`}>
                <strong>Estado:</strong> {getIMCStatus(imcData.bmi)}
              </p>
            </div>
          ) : (
            <p>No se encontraron datos de IMC.</p>
          )}
        </div>

        <div className="flex justify-center">
          <Button onClick={handleLogout} className="mt-8">
            Cerrar Sesión
          </Button>
        </div>
      </div>
      {showModal && <IMCModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
