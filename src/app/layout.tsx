import type React from "react"
import {AuthProvider} from "@/app/contexts/AuthContext"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PowerMAX - Fitness Training",
  description: "Transform your body with PowerMAX fitness routines",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  )
}
