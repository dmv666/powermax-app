"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { useAuth } from "@/app/contexts/AuthContext"

const db = getFirestore()

type IMCData = {
  weight: number
  height: number
  bmi: number
  routine: string
  state: "underweight" | "normal" | "overweight" | "obesity"
  plan?: string | null // Cambiamos para ser más explícito
}

type SaveIMCDataInput = Pick<IMCData, "weight" | "height" | "bmi"> & { plan?: string };

type IMCContextType = {
  imcData: IMCData | null
  loading: boolean
  saveIMCData: (data: SaveIMCDataInput) => Promise<void>
  updatePlan: (plan: string) => Promise<void> // Nueva función para actualizar solo el plan
}

const IMCContext = createContext<IMCContextType>({
  imcData: null,
  loading: true,
  saveIMCData: async () => {},
  updatePlan: async () => {}
})

function getIMCState(bmi: number): IMCData["state"] {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obesity";
}

function getRoutineByIMC(bmi: number) {
  if (bmi < 18.5) return "Ganar peso";
  if (bmi < 25) return "Mantenimiento";
  if (bmi < 30) return "Tonificar";
  return "Bajar de peso";
}

export const IMCProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [imcData, setImcData] = useState<IMCData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIMCData = async () => {
      if (!user) {
        setImcData(null)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          if (userData.imcData) {
            // Asegurar que el plan sea explícitamente null si no existe
            const imcDataWithPlan = {
              ...userData.imcData,
              plan: userData.imcData.plan || null
            }
            setImcData(imcDataWithPlan)
          } else {
            setImcData(null)
          }
        } else {
          setImcData(null)
        }
      } catch (error) {
        console.error("Error fetching IMC data:", error)
        setImcData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchIMCData()
  }, [user])

  const saveIMCData = async (data: SaveIMCDataInput) => {
    if (!user) return

    const state = getIMCState(data.bmi)
    const routine = getRoutineByIMC(data.bmi)
    const dataWithState: IMCData = { 
      ...data, 
      state, 
      routine,
      plan: data.plan || null // Asegurar que sea null si no hay plan
    }

    const userRef = doc(db, "users", user.uid)
    try {
      await setDoc(userRef, { imcData: dataWithState }, { merge: true })
      setImcData(dataWithState)
    } catch (error) {
      console.error("Error guardando los datos de IMC:", error)
    }
  }

  // Nueva función para actualizar solo el plan
  const updatePlan = async (plan: string) => {
    if (!user || !imcData) return

    const updatedIMCData: IMCData = {
      ...imcData,
      plan: plan
    }

    const userRef = doc(db, "users", user.uid)
    try {
      await setDoc(userRef, { imcData: updatedIMCData }, { merge: true })
      setImcData(updatedIMCData)
      console.log(`Plan actualizado a: ${plan}`)
    } catch (error) {
      console.error("Error actualizando el plan:", error)
    }
  }

  return (
    <IMCContext.Provider value={{ imcData, loading, saveIMCData, updatePlan }}>
      {children}
    </IMCContext.Provider>
  )
}

export const useIMC = () => useContext(IMCContext)