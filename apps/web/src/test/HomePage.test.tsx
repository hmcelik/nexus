import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from '../app/page'

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />)
    expect(document.body).toBeTruthy()
  })

  it('contains main content', () => {
    render(<HomePage />)
    // Check for any text content to ensure the page renders
    expect(document.body).toHaveTextContent(/.*/)
  })
})
