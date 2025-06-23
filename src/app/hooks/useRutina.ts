import { useState, useEffect } from "react";
import { rutinasPorTipo, Rutina, RutinaTipo } from "@/lib/rutinas";

export function useRutina(tipo: string) {
  const [rutina, setRutina] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Solo acepta los tipos válidos
      if (["mantenimiento", "tonificar", "bajar de peso", "ganar peso"].includes(tipo)) {
        setRutina(rutinasPorTipo[tipo as RutinaTipo]);
      } else {
        setRutina([]);
      }
      setLoading(false);
    }, 300);
  }, [tipo]);

  return { rutina, loading };
}