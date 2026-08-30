/**
 * Message List Component
 * Displays all messages in the chat
 */

import React from 'react'
import '../styles/MessageList.css'

const MessageList = ({ messages, currentUser }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="messages-container">
        <div className="empty-state">
          <p>👋 Welcome to the chat room!</p>
          <p>Start a conversation by sending a message.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="messages-container">
      {messages.map((msg, index) => {
        if (msg.isSystemMessage) {
          return (
            <div key={index} className="system-message">
              <p>{msg.message}</p>
              <small>{formatTime(msg.timestamp)}</small>
            </div>
          )
        }

        const isCurrentUser = msg.senderId === currentUser.id

        return (
          <div
            key={msg._id || index}
            className={`message ${isCurrentUser ? 'message-right' : 'message-left'}`}
          >
            <div className="message-bubble">
              <div className="message-header">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="message-text">{msg.message}</p>
              {msg.isEdited && <small className="message-edited">(edited)</small>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
