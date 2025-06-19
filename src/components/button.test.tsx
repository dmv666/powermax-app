import { render, screen, fireEvent } from '@testing-library/react'
import {Button} from './ui/button'

describe('Button', () => {
  it('renderiza el texto correctamente', () => {
    render(<Button>Click aquí</Button>)
    expect(screen.getByRole('button', { name: /click aquí/i })).toBeInTheDocument()
  })

  it('llama a onClick cuando se hace click', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Presionar</Button>)
    fireEvent.click(screen.getByRole('button', { name: /presionar/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})