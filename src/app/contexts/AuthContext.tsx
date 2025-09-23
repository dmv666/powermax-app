"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"

const googleProvider = new GoogleAuthProvider()
const db = getFirestore()

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      })
    }

    return user
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error)
    throw error
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user)
        setLoading(false)
      })
      return unsubscribe
    })
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
