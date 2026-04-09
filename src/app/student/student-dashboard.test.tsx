import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StudentDashboard } from './student-dashboard'
import * as actions from '@/lib/actions'

// Mock the server action
vi.mock('@/lib/actions', () => ({
  submitAttendance: vi.fn(() => Promise.resolve({ error: null }))
}))

// Mock Geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn()
}
// @ts-ignore
global.navigator.geolocation = mockGeolocation

describe('StudentDashboard Integration', () => {
  const mockSession = {
    id: 'session-123',
    latitude: 48.8584,
    longitude: 2.2945,
    radius: 100,
    groups: { name: 'Cours de Test' }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Bypass Supabase check for tests
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
  })

  it('should allow student to mark attendance when within radius', async () => {
    // Mock user being at the exact same location (dist = 0)
    mockGeolocation.getCurrentPosition.mockImplementation((success) => 
      success({
        coords: { latitude: 48.8584, longitude: 2.2945 }
      })
    )

    render(<StudentDashboard activeSession={mockSession} studentId="student-456" />)

    // Check if session info is displayed
    expect(screen.getByText('Cours de Test')).toBeInTheDocument()

    // Find and click the confirmation button
    const submitBtn = screen.getByRole('button', { name: /Confirmer ma présence/i })
    fireEvent.click(submitBtn)

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Présence Validée !')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verify server action was called
    expect(actions.submitAttendance).toHaveBeenCalledWith('session-123', 'student-456')
  })

  it('should show error when student is too far from school', async () => {
    // Mock user being far (approx 10km away)
    mockGeolocation.getCurrentPosition.mockImplementation((success) => 
      success({
        coords: { latitude: 49.0, longitude: 2.3 }
      })
    )

    render(<StudentDashboard activeSession={mockSession} studentId="student-456" />)

    const submitBtn = screen.getByRole('button', { name: /Confirmer ma présence/i })
    fireEvent.click(submitBtn)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Vous êtes à/i)).toBeInTheDocument()
      expect(screen.getByText(/Vous devez être dans un rayon de 100m/i)).toBeInTheDocument()
    })

    // Verify server action was NOT called
    expect(actions.submitAttendance).not.toHaveBeenCalled()
  })

  it('should show error when GPS access is denied', async () => {
    // Mock location retrieval failure
    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => 
      error({ message: 'User denied Geolocation' })
    )

    render(<StudentDashboard activeSession={mockSession} studentId="student-456" />)

    // Wait for GPS error message
    await waitFor(() => {
      expect(screen.getByText(/Veuillez autoriser la géolocalisation pour émarger/i)).toBeInTheDocument()
    })
    
    const submitBtn = screen.getByRole('button', { name: /Confirmer ma présence/i })
    expect(submitBtn).toBeDisabled()
  })
})
