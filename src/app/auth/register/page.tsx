"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
      })

      router.push("/dashboard")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/sdhsports/image/upload/v1740153481/Designer_5_dpeytw.jpg"
          alt="Gym background"
          fill
          className="object-cover"
          priority
        />
      </div>

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

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Comienza tu Entrenamiento</h1>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

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
              <Label htmlFor="name" className="text-white">
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                className="bg-white/80"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-white/80"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-black/90">
              Registrarme
            </Button>

            <div className="text-center">
              <span className="text-white">O, Si tienes una cuenta</span>
              <Link href="/auth/login">
                <Button variant="link" className="text-white">
                  Iniciar Sesion
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
