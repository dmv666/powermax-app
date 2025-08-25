"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { useAuth } from "@/app/contexts/AuthContext"

const db = getFirestore()

// Type definitions for our IMC data structure
type IMCData = {
  weight: number
  height: number
  bmi: number
  routine: string
  state: "underweight" | "normal" | "overweight" | "obesity"
  plan?: string | null // Plan can be a string, null, or undefined
}

// Input type for saving initial IMC data
type SaveIMCDataInput = Pick<IMCData, "weight" | "height" | "bmi"> & { plan?: string };

// Defines the shape of the context data and functions
type IMCContextType = {
  imcData: IMCData | null
  loading: boolean
  saveIMCData: (data: SaveIMCDataInput) => Promise<void>
  updatePlan: (plan: string) => Promise<void>
  updateRoutine: (routine: string) => Promise<void> // The new function to update the routine
}

// Create the context with default values
const IMCContext = createContext<IMCContextType>({
  imcData: null,
  loading: true,
  saveIMCData: async () => {},
  updatePlan: async () => {},
  updateRoutine: async () => {} // Add the new function to the default context
})

// Helper function to determine health state based on BMI
function getIMCState(bmi: number): IMCData["state"] {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obesity";
}

// Helper function to recommend a routine based on BMI
function getRoutineByIMC(bmi: number) {
  if (bmi < 18.5) return "Ganar peso";
  if (bmi < 25) return "Mantenimiento";
  if (bmi < 30) return "Tonificar";
  return "Bajar de peso";
}

// The provider component that wraps the application
export const IMCProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [imcData, setImcData] = useState<IMCData | null>(null)
  const [loading, setLoading] = useState(true)

  // Effect to fetch user's IMC data when the user object changes
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

  // Function to save the initial IMC data for a user
  const saveIMCData = useCallback(async (data: SaveIMCDataInput) => {
    if (!user) return

    const state = getIMCState(data.bmi)
    const routine = getRoutineByIMC(data.bmi)
    const dataWithState: IMCData = { 
      ...data, 
      state, 
      routine,
      plan: data.plan || null
    }

    const userRef = doc(db, "users", user.uid)
    try {
      // Use merge: true to avoid overwriting other user data
      await setDoc(userRef, { imcData: dataWithState }, { merge: true })
      setImcData(dataWithState)
    } catch (error) {
      console.error("Error guardando los datos de IMC:", error)
    }
  }, [user])

  // Function to update only the user's plan
  const updatePlan = useCallback(async (plan: string) => {
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
  }, [user, imcData])
  
  // *** NEW FUNCTION TO UPDATE THE ROUTINE ***
  const updateRoutine = useCallback(async (routine: string) => {
    // Ensure user and imcData are available
    if (!user || !imcData) return;

    // Create the updated data object
    const updatedIMCData: IMCData = {
      ...imcData,
      routine: routine, // Set the new routine
    };

    const userRef = doc(db, "users", user.uid);
    try {
      // Save the updated data back to Firestore
      await setDoc(userRef, { imcData: updatedIMCData }, { merge: true });
      // Update the local state to reflect the change in the UI immediately
      setImcData(updatedIMCData);
      console.log(`Rutina actualizada a: ${routine}`);
    } catch (error) {
      console.error("Error actualizando la rutina:", error);
      // Optionally, re-throw the error if you want the component to handle it
      throw error;
    }
  }, [user, imcData]); // Dependencies for the useCallback hook

  return (
    // Provide all values and functions to children components
    <IMCContext.Provider value={{ imcData, loading, saveIMCData, updatePlan, updateRoutine }}>
      {children}
    </IMCContext.Provider>
  )
}

// Custom hook to easily consume the context
export const useIMC = () => useContext(IMCContext)
