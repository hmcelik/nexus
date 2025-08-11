import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SessionProvider } from 'next-auth/react'
import '@testing-library/jest-dom'
import HomePage from '../app/page'

// Mock session for testing
const mockSession = {
  expires: '1',
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
}

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <SessionProvider session={mockSession}>
        <HomePage />
      </SessionProvider>,
    )
    expect(document.body).toBeTruthy()
  })

  it('contains main content', () => {
    render(
      <SessionProvider session={mockSession}>
        <HomePage />
      </SessionProvider>,
    )
    // Check for the main heading
    expect(screen.getByText('Visual Bot Development Platform')).toBeInTheDocument()
  })
})
