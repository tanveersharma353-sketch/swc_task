/**
 * Chat Room Page
 * Real-time chat interface with Socket.io
 */

import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import UserInfo from '../components/UserInfo'
import '../styles/ChatRoom.css'

const ChatRoom = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Initialize Socket.io connection
  useEffect(() => {
    const token = localStorage.getItem('token')

    socketRef.current = io(API_URL, {
      auth: {
        token,
      },
    })

    // Emit user join event
    socketRef.current.emit('user_join', {
      username: user.username,
      userId: user.id,
    })

    // Listen for messages
    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    // Listen for user joined
    socketRef.current.on('user_joined', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random(),
          isSystemMessage: true,
          message: data.message,
          timestamp: data.timestamp,
        },
      ])
    })

    // Listen for user left
    socketRef.current.on('user_left', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random(),
          isSystemMessage: true,
          message: data.message,
          timestamp: data.timestamp,
        },
      ])
    })

    // Listen for typing indicator
    socketRef.current.on('user_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username]
          }
          return prev
        })
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== data.username))
      }
    })

    // Clean up on unmount
    return () => {
      socketRef.current.disconnect()
    }
  }, [user, API_URL])

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (messageText) => {
    if (messageText.trim()) {
      socketRef.current.emit('send_message', {
        message: messageText,
      })
    }
  }

  const handleTyping = (isTyping) => {
    socketRef.current.emit('user_typing', { isTyping })
  }

  return (
    <div className="chat-room">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <h1 className="chat-title">💬 Chat Room</h1>
            <p className="users-count">Online Users: {onlineUsers.length}</p>
          </div>
          <div className="header-right">
            <UserInfo user={user} onLogout={onLogout} />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {/* Messages Area */}
          <div className="messages-wrapper">
            <MessageList messages={messages} currentUser={user} />
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              <span>{typingUsers.join(', ')} is typing...</span>
            </div>
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
        />
      </div>
    </div>
  )
}

export default ChatRoom
