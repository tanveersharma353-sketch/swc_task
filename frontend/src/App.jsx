/**
 * Main App Component
 * Handles routing between Auth and Chat pages
 */

import React, { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ChatRoom from './pages/ChatRoom'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('login') // login, register, verify, chat
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
      setCurrentPage('chat')
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
    setCurrentPage('chat')
  }

  const handleRegisterSuccess = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
    setCurrentPage('verify')
  }

  const handleVerifyEmailSuccess = () => {
    setCurrentPage('chat')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    setCurrentPage('login')
  }

  if (loading) {
    return (
      <div className="flex-center h-full bg-gradient-to-br from-purple-500 to-purple-700">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="app">
      {currentPage === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'register' && (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'verify' && (
        <VerifyEmail
          onVerifySuccess={handleVerifyEmailSuccess}
          user={user}
        />
      )}

      {currentPage === 'chat' && isAuthenticated && (
        <ChatRoom user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
