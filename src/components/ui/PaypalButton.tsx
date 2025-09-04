"use client";

import { useEffect, useRef } from "react";

// Declaramos que "paypal" existirá en window.
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

interface PaypalButtonProps {
  planId: string;
  onSuccess?: () => void; // Callback para cuando el pago es exitoso
}

export default function PaypalButton({ planId, onSuccess }: PaypalButtonProps) {
  // Usamos useRef para rastrear si el botón ya fue renderizado
  const isRendered = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Función para verificar si el contenedor existe en el DOM
    const isContainerInDOM = () => {
      const container = document.getElementById(`paypal-button-container-${planId}`);
      return container !== null && document.body.contains(container);
    };

    // Función para limpiar el contenedor
    const clearContainer = () => {
      if (containerRef.current && isContainerInDOM()) {
        containerRef.current.innerHTML = '';
      }
    };

    // Función para renderizar el botón
    const renderButton = () => {
      // Verificaciones más estrictas
      if (
        isRendered.current || 
        !window.paypal || 
        !containerRef.current || 
        !isContainerInDOM()
      ) {
        return;
      }

      // Pequeña demora para asegurar que el DOM esté estable
      const timeoutId = setTimeout(() => {
        // Verificar nuevamente si el contenedor sigue en el DOM
        if (!isContainerInDOM()) {
          console.warn(`Contenedor removido del DOM para plan: ${planId}`);
          return;
        }

        // Limpiar el contenedor antes de renderizar
        clearContainer();

        window.paypal!
          .Buttons({
            style: {
              shape: "rect",
              color: "blue",
              layout: "vertical",
              label: "subscribe",
            },
            createSubscription: (_data: unknown, actions: { 
              subscription: { 
                create: (opts: { plan_id: string }) => Promise<string> 
              } 
            }) => {
              return actions.subscription.create({
                plan_id: planId,
              });
            },
            onApprove: (data: { subscriptionID?: string }) => {
              console.log(`Suscripción creada con ID: ${data.subscriptionID ?? "Sin ID"}`);
              // Llamar al callback onSuccess si existe
              if (onSuccess) {
                onSuccess();
              }
            },
            onCancel: (data: unknown) => {
              console.log('Suscripción cancelada:', data);
            },
            onError: (err: unknown) => {
              console.error('Error al procesar suscripción de PayPal:', err);
            }
          })
          .render(`#paypal-button-container-${planId}`)
          .then(() => {
            if (isContainerInDOM()) {
              isRendered.current = true;
              console.log(`Botón PayPal renderizado correctamente para plan: ${planId}`);
            }
          })
          .catch((err: unknown) => {
            console.error(`Error al renderizar botón PayPal para plan ${planId}:`, err);
            isRendered.current = false;
          });
      }, 100); // Pequeña demora de 100ms

      // Guardar el timeout para limpiarlo si es necesario
      timeoutRef.current = timeoutId;
    };

    // Si PayPal ya está disponible, renderizar después de un pequeño delay
    if (window.paypal && isContainerInDOM()) {
      renderButton();
    } else {
      // Esperar a que PayPal esté disponible
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkPaypal = () => {
        attempts++;
        
        if (window.paypal && isContainerInDOM()) {
          renderButton();
        } else if (attempts < maxAttempts) {
          timeoutRef.current = setTimeout(checkPaypal, 100);
        } else {
          console.error(`PayPal SDK no se cargó o contenedor no disponible después de ${maxAttempts * 100}ms para plan: ${planId}`);
        }
      };

      timeoutRef.current = setTimeout(checkPaypal, 100);
    }

    // Función de limpieza
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Solo limpiar si el contenedor aún existe
      if (isContainerInDOM()) {
        clearContainer();
      }
      isRendered.current = false;
    };
  }, [onSuccess, planId]);

  return (
    <div 
      ref={containerRef}
      id={`paypal-button-container-${planId}`}
      className="w-full mt-auto min-h-[45px] flex items-center justify-center z-0"
    />
  );
}