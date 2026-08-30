# Frontend - Real-Time Chat Application

React + Vite frontend with Socket.io for real-time messaging.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5173`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── VerifyEmail.jsx     # Email verification
│   │   └── ChatRoom.jsx        # Main chat room
│   ├── components/
│   │   ├── MessageList.jsx     # Display messages
│   │   ├── MessageInput.jsx    # Input form
│   │   └── UserInfo.jsx        # User profile
│   ├── styles/
│   │   ├── ChatRoom.css        # Chat room styles
│   │   ├── MessageList.css     # Message list styles
│   │   ├── MessageInput.css    # Input styles
│   │   └── UserInfo.css        # User info styles
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── index.css               # Global styles
│   └── main.jsx                # React entry point
├── index.html                  # HTML template
├── .env.example                # Environment template
├── package.json                # Dependencies
├── vite.config.js              # Vite config
└── README.md                   # This file
```

---

## 🎨 Features

✅ **Clean UI** - Modern, responsive design with Tailwind-inspired styling  
✅ **Real-time Chat** - Instant message updates via Socket.io  
✅ **User Authentication** - Login and register pages  
✅ **Email Verification** - Token-based email verification  
✅ **Typing Indicator** - See when others are typing  
✅ **Auto-scroll** - Messages scroll to bottom automatically  
✅ **Session Management** - JWT token storage in localStorage  
✅ **User Profiles** - Display user info and status  

---

## 🔌 Socket.io Events

### Emitting Events (Client → Server)

```javascript
// Join chat
socket.emit('user_join', { username: 'john', userId: 'xxx' })

// Send message
socket.emit('send_message', { message: 'Hello!' })

// Send typing status
socket.emit('user_typing', { isTyping: true })
```

### Listening Events (Server → Client)

```javascript
// Receive message
socket.on('receive_message', (data) => {
  // data: { sender, senderId, message, timestamp, _id }
})

// User joined
socket.on('user_joined', (data) => {
  // data: { username, message, timestamp }
})

// User left
socket.on('user_left', (data) => {
  // data: { username, message, timestamp }
})

// User typing
socket.on('user_typing', (data) => {
  // data: { username, isTyping }
})
```

---

## 📝 Pages Overview

### Login.jsx
- Email and password login
- Error handling
- Switch to register page

### Register.jsx
- Username, email, and password registration
- Password confirmation
- Validation for password length and match

### VerifyEmail.jsx
- Email verification with token
- Token from URL query parameter
- Resend verification email option

### ChatRoom.jsx
- Main chat interface
- Real-time message display
- Socket.io connection management
- Typing indicator
- User info display
- Logout functionality

---

## 🛠️ Building for Production

```bash
npm run build
```

This generates an optimized production build in the `dist/` folder.

### Preview Build

```bash
npm run preview
```

---

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|----------|
| VITE_API_URL | Backend API base URL | `http://localhost:5000` |

---

## 📦 Dependencies

- **react** - UI framework
- **react-dom** - React rendering
- **react-router-dom** - Routing
- **socket.io-client** - Real-time communication
- **axios** - HTTP client

### Dev Dependencies

- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin for Vite

---

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Static Site
4. Build Command: `cd frontend && npm install && npm run build`
5. Publish Directory: `frontend/dist`
6. Add `VITE_API_URL` environment variable
7. Deploy!

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🐛 Troubleshooting

### Socket.io not connecting
- Verify `VITE_API_URL` points to correct backend
- Check backend server is running
- Ensure WebSocket is not blocked by firewall

### CORS errors
- Check backend CORS configuration
- Verify frontend URL matches backend's allowed origin

### Blank page on load
- Check browser console for errors
- Verify Vite dev server is running
- Clear cache and reload

### Module not found errors
- Run `npm install` again
- Delete `node_modules` and reinstall

---

## 📚 More Info

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Socket.io Client Docs](https://socket.io/docs/v4/client-api)
- [Axios Documentation](https://axios-http.com)

**Happy coding! 🚀**
