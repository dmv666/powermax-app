"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { useAuth } from "@/app/contexts/AuthContext"

const db = getFirestore()

type IMCData = {
  weight: number
  height: number
  bmi: number
}

type IMCContextType = {
  imcData: IMCData | null
  loading: boolean
  saveIMCData: (data: IMCData) => Promise<void>
}

const IMCContext = createContext<IMCContextType>({
  imcData: null,
  loading: true,
  saveIMCData: async () => {}
})

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

  const saveIMCData = async (data: IMCData) => {
    if (!user) return
  
    const userRef = doc(db, "users", user.uid) // Usamos la colección "users"
    
    try {
      await setDoc(userRef, { imcData: data }, { merge: true }) // Usamos merge para no sobreescribir otros datos del usuario
      setImcData(data)
    } catch (error) {
      console.error("Error guardando los datos de IMC:", error)
    }
  }
  

  return (
    <IMCContext.Provider value={{ imcData, loading, saveIMCData }}>
      {children}
    </IMCContext.Provider>
  )
}

export const useIMC = () => useContext(IMCContext)
