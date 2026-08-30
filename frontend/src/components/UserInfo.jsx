/**
 * User Info Component
 * Displays current user information and logout button
 */

import React, { useState } from 'react'
import '../styles/UserInfo.css'

const UserInfo = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="user-info">
      <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
        <img
          src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          alt={user?.username}
          className="user-avatar"
        />
        <span className="user-name">{user?.username}</span>
      </div>

      {showDropdown && (
        <div className="user-dropdown">
          <div className="dropdown-item">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="dropdown-item">
            <strong>Status:</strong> {user?.isEmailVerified ? '✅ Verified' : '⏳ Pending'}
          </div>
          <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
          <button className="logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserInfo
