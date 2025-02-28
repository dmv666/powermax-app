"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      router.push("/dashboard") // Redirige al dashboard si la autenticación es exitosa
    } catch (error: unknown) {
      setError((error as Error).message)
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/sdhsports/image/upload/v1740153481/Designer_5_dpeytw.jpg"
          alt="Gym background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Logo */}
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <Image
          src="https://res.cloudinary.com/sdhsports/image/upload/v1739534621/Designer_l6amas.png"
          alt="PowerMAX Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
        <span className="text-white text-2xl font-bold">PowerMAX</span>
      </Link>

      {/* Formulario */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="bg-white/80"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-white/80"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" variant="default">
              Iniciar Sesión
            </Button>

            <div className="text-center">
              <span className="text-white pr-3">¿No tienes una cuenta?</span>
              <Link href="/auth/register">
                <Button variant="default" className="text-white">
                  Registrarse
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
