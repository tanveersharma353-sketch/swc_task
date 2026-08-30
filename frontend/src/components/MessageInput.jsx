/**
 * Message Input Component
 * Handles message sending and typing indicator
 */

import React, { useState, useRef } from 'react'
import '../styles/MessageInput.css'

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)

  const handleInputChange = (e) => {
    const value = e.target.value
    setMessage(value)

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true)
      onTyping(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      onTyping(false)
    }, 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
      setIsTyping(false)
      onTyping(false)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button type="submit" className="message-send-btn" disabled={!message.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

export default MessageInput
