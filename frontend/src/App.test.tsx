// frontend/src/App.test.tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Leizi Terminal', () => {
  render(<App />)
  const linkElement = screen.getByText(/Leizi Terminal/i)
  expect(linkElement).toBeInTheDocument()
})