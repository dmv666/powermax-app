import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'

// Mock adicional específico para este test si es necesario
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks()
  })


it('muestra el título de iniciar sesión', () => {
  render(<LoginPage />)
  // Buscamos un rol 'heading' (h1, h2, etc.) que contenga el texto. Es mucho más preciso.
  expect(
    screen.getByRole('heading', { name: /iniciar sesión/i })
  ).toBeInTheDocument()
})


it('muestra error si los campos están vacíos y se envía el formulario', async () => {
  render(<LoginPage />);

  // 1. Es una mejor práctica obtener los campos por su label.
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/contraseña/i);

  // 2. Encontramos y hacemos clic en el botón de submit como antes.
  const submitButton = screen
    .getAllByRole('button', { name: /iniciar sesión/i })
    .find((button) => (button as HTMLButtonElement).type === 'submit');

  if (!submitButton) {
    throw new Error('No se encontró el botón de submit');
  }

  fireEvent.click(submitButton);

  // 3. Verificamos que los campos ahora son inválidos.
  // No necesitamos 'waitFor' si la validación es síncrona,
  // pero no hace daño dejarlo por si acaso.
  await waitFor(() => {
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
  });
});

  it('tiene un botón para continuar con Google', () => {
    render(<LoginPage />)
    
    // Busca el botón de Google
    const googleButton = screen.getByRole('button', { name: /google/i })
    expect(googleButton).toBeInTheDocument()
  })

  
})