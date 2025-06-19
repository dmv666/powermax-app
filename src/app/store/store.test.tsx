import { render } from '@testing-library/react'
import StorePage from './page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}))
jest.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}))

describe('StorePage', () => {
  it('redirige si no hay usuario', () => {
    render(<StorePage />)
    // Aquí puedes verificar que useRouter().replace fue llamado
  })
})