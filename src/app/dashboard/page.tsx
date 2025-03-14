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
    if (!imcLoading && !imcData) {
      setShowModal(true)
    }
  }, [imcData, imcLoading])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
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
        <h1 className="text-3xl font-bold text-center mb-8">Bienvenido a tu Dashboard, {user.displayName || user.email}</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tus Estadísticas</h2>
          <p>Aquí irán tus estadísticas de entrenamiento...</p>
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
