// components/ui/badge.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Suponiendo que tienes un archivo utils para combinar clases, si no, lo creamos abajo.

// Usamos `cva` para definir los estilos base y las variantes del badge.
const badgeVariants = cva(
  // Clases base que se aplican a TODAS las variantes.
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    // Aquí definimos los diferentes estilos que puede tener el badge.
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Esta es la variante que usamos para el carrito. Le da el fondo rojo.
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    // Variante por defecto si no se especifica ninguna.
    defaultVariants: {
      variant: "default",
    },
  }
);

// Definimos las propiedades que nuestro componente Badge puede aceptar.
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// El componente Badge en sí.
function Badge({ className, variant, ...props }: BadgeProps) {
  // `cn` combina las clases de las variantes con cualquier otra clase que le pasemos.
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };