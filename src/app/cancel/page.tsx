export default function CancelPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold text-red-600">❌ Pago cancelado</h1>
      <p className="mt-4 text-lg">
        No se completó la transacción. Si fue un error, puedes intentarlo de nuevo.
      </p>
    </main>
  );
}

