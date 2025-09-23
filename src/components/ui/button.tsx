import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md"

    const variantStyles = {
      default: "bg-black text-white hover:bg-blue-700 hover:scale-105 active:scale-95",
      destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:scale-105 active:scale-95",
      ghost: "hover:bg-gray-100 text-gray-600 active:scale-95",
      link: "text-blue-600 underline hover:text-blue-800 active:scale-95",
    }

    const sizeStyles = {
      default: "h-10 px-5 py-2.5",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      />
      
    )
  }
)

Button.displayName = "Button"

export { Button }