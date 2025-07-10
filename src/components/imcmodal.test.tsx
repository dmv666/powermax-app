import { render, screen, fireEvent } from '@testing-library/react'
import IMCModal from './ui/ImcModal'

describe('IMCModal', () => {
  it('muestra el título y los campos de altura y peso', () => {
    render(<IMCModal onClose={() => {}} />)
    expect(screen.getByText(/completa tus datos de imc/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/altura/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/peso/i)).toBeInTheDocument()
  })

  it('no permite enviar si los campos están vacíos', () => {
    render(<IMCModal onClose={() => {}} />)
    const submit = screen.getByRole('button', { name: /guardar/i })
    fireEvent.click(submit)
  })
})