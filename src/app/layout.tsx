import type React from "react"
import { AuthProvider } from "@/app/contexts/AuthContext"
import { IMCProvider } from "@/app/contexts/ImcContext"
import { CartProvider } from "@/app/contexts/CartContext"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PowerMAX - Fitness Training",
  description: "Transform your body with PowerMAX fitness routines",
  icons: [
    { url: "https://res.cloudinary.com/sdhsports/image/upload/v1740755950/Designer_7_bzp4oa.jpg", sizes: "64x64", type: "image/x-icon" }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <AuthProvider>
            <IMCProvider>
              {children}
            </IMCProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}
