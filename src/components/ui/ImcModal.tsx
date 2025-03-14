"use client"

import { useState, useEffect, FormEvent } from "react"
import { useIMC } from "@/app/contexts/ImcContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
type IMCModalProps = {
    onClose: () => void
  }
  
  export default function IMCModal({ onClose }: IMCModalProps) {
    const { imcData, saveIMCData } = useIMC()
    const [formData, setFormData] = useState({
      height: "",
      weight: ""
    })
  
    useEffect(() => {
      if (!imcData) {
        onClose() // Cierra el modal si ya hay datos de IMC
      }
    }, [imcData, onClose])
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()
      const height = parseFloat(formData.height)
      const weight = parseFloat(formData.weight)
  
      if (!height || !weight) return alert("Por favor, completa todos los campos correctamente")
  
      const bmi = parseFloat((weight / (height * height)).toFixed(2))
  
      await saveIMCData({
        height,
        weight,
        bmi
      })
  
      onClose() // Cierra el modal después de guardar
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Completa tus datos de IMC</h2>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="height">Altura (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                placeholder="1.75"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
              />
            </div>
  
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>
  
            <Button type="submit" className="w-full">Guardar</Button>
          </form>
        </div>
      </div>
    )
  }
  