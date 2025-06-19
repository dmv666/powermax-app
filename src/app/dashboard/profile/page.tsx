"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useIMC } from "@/app/contexts/ImcContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const { imcData, saveIMCData } = useIMC();
  const [formData, setFormData] = useState({
    name: "",
    height: "",
    weight: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
      }));
    }
    if (imcData) {
      setFormData((prev) => ({
        ...prev,
        height: imcData.height ? String(imcData.height) : "",
        weight: imcData.weight ? String(imcData.weight) : "",
      }));
    }
  }, [user, imcData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Actualizar nombre en Firestore
      if (user && formData.name) {
        await updateDoc(doc(db, "users", user.uid), {
          name: formData.name,
        });
      }

      // Actualizar datos de IMC
      const height = parseFloat(formData.height);
      const weight = parseFloat(formData.weight);
      if (height && weight) {
        const bmi = parseFloat((weight / (height * height)).toFixed(2));
        await saveIMCData({ height, weight, bmi });
      }

      setSuccess("Datos actualizados correctamente.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error al actualizar los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Debes iniciar sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={user.photoURL || "https://ui-avatars.com/api/?name=" + (user.displayName || user.email)}
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full mb-2"
          />
          <h2 className="text-2xl font-bold mb-1">Mi Perfil</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1" htmlFor="name">Nombre</label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="height">Altura (m)</label>
            <Input
              id="height"
              name="height"
              type="number"
              step="0.01"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="weight">Peso (kg)</label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
          {success && <p className="text-green-600 text-center">{success}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
        <Button variant="secondary" className="w-full mt-4" onClick={() => router.push("/dashboard")}>
          Volver al Dashboard
        </Button>
      </div>
    </main>
  );
}