import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./page";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Mocks de Firebase y Next.js Router (necesarios para que el componente funcione)
jest.mock("firebase/auth");
jest.mock("@/lib/firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("RegisterPage", () => {
  // Limpia los mocks antes de cada test para que no interfieran entre sí
  beforeEach(() => {
    (createUserWithEmailAndPassword as jest.Mock).mockClear();
  });

it("muestra error si las contraseñas no coinciden", async () => {
  render(<RegisterPage />);
  
  // Usamos selectores específicos para cada campo
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.com" } });
  fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Test User" } });
  fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: "123456" } });
  fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: "654321" } }); // Contraseñas diferentes
  
  fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));
  
  // Usamos `waitFor` para esperar a que el estado del error se actualice
  await waitFor(() => {
    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
  });
});


  it("muestra un error de Firebase si el email ya está en uso", async () => {
    // Le decimos que para este test, debe fallar con un error específico.
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error("Firebase: Error (auth/email-already-in-use).")
    );
    render(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "usado@test.com" } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Usuario Existente" } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: "123456" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));
    
    // Verificamos que se muestra el mensaje de error real de Firebase
    const firebaseError = await screen.findByText(/auth\/email-already-in-use/i);
    expect(firebaseError).toBeInTheDocument();
  });
});