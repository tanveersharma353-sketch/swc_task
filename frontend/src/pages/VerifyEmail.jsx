/**
 * Email Verification Page
 * Verify email with token
 */

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const VerifyEmail = ({ onVerifySuccess, user }) => {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Get token from URL if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    if (urlToken) {
      setToken(urlToken)
      handleVerify(urlToken)
    }
  }, [])

  const handleVerify = async (verificationToken) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const tokenToUse = verificationToken || token

      if (!tokenToUse) {
        setError('Please enter a verification token')
        setLoading(false)
        return
      }

      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        token: tokenToUse,
      })

      setSuccess('Email verified successfully!')
      setTimeout(() => {
        onVerifySuccess()
      }, 1500)
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setResendLoading(true)
    setError('')
    setSuccess('')

    try {
      // In development, show the token
      console.log(
        '📧 In development mode, check your console for verification token',
        'verificationLink'
      )
      setSuccess('Check your console for the verification token (development mode)')
    } catch (err) {
      setError('Failed to resend email')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">✉️ Verify Email</h1>
        <p className="auth-subtitle">Confirm your email address to continue</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleVerify()
          }}
        >
          <div className="form-group">
            <label className="form-label">Verification Token</label>
            <input
              type="text"
              className="form-input"
              placeholder="Paste your verification token here"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
            />
            <small style={{ color: '#718096', marginTop: '8px', display: 'block' }}>
              Check your email for the verification token
            </small>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleResendEmail}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px',
              fontWeight: '600',
            }}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
