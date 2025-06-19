"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { useAuth } from "@/app/contexts/AuthContext"

const db = getFirestore()

type IMCData = {
  weight: number
  height: number
  bmi: number
  state: "underweight" | "normal" | "overweight" | "obesity"
}

type IMCContextType = {
  imcData: IMCData | null
  loading: boolean
  saveIMCData: (data: Omit<IMCData, "state">) => Promise<void>
}

const IMCContext = createContext<IMCContextType>({
  imcData: null,
  loading: true,
  saveIMCData: async () => {}
})

function getIMCState(bmi: number): IMCData["state"] {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obesity";
}

export const IMCProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [imcData, setImcData] = useState<IMCData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIMCData = async () => {
      if (!user) return

      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        if (userData.imcData) {
          setImcData(userData.imcData)
        }
      }
      setLoading(false)
    }

    fetchIMCData()
  }, [user])

// ...existing code...
const saveIMCData = async (data: Omit<IMCData, "state">) => {
  if (!user) return

  const state = getIMCState(data.bmi)
  const dataWithState: IMCData = { ...data, state }

  const userRef = doc(db, "users", user.uid)
  try {
    await setDoc(userRef, { imcData: dataWithState }, { merge: true })
    setImcData(dataWithState)
  } catch (error) {
    console.error("Error guardando los datos de IMC:", error)
  }
}
// ...existing code...

  return (
    <IMCContext.Provider value={{ imcData, loading, saveIMCData }}>
      {children}
    </IMCContext.Provider>
  )
}

export const useIMC = () => useContext(IMCContext)
