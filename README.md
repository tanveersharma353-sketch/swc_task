# Real-Time Chat Application

A modern, full-stack real-time chat application built with **Node.js/Express** backend and **React** frontend. Deploy instantly to Render, Railway, or Fly.io.

## 🎯 Features

✅ **User Authentication** - Email/username registration & login with JWT  
✅ **Real-Time Messaging** - Instant message broadcasting via Socket.io  
✅ **Persistent Chat History** - MongoDB-backed message storage  
✅ **Secure Passwords** - Bcrypt hashing for password security  
✅ **Email Verification** - Token-based email verification during signup  
✅ **Auto-Login** - JWT token management with auto-login capability  
✅ **Clean UI** - Tailwind CSS with responsive design  
✅ **One-Click Deploy** - Free deployment to Render/Railway/Fly.io  

## 📁 Project Structure

```
swc_task/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Message.js           # Message schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints (register, login)
│   │   └── messages.js          # Message endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── messageController.js # Message logic
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Dependencies
│   └── README.md                # Backend setup guide
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   └── ChatRoom.jsx     # Main chat room
│   │   ├── components/
│   │   │   ├── MessageList.jsx  # Display messages
│   │   │   ├── MessageInput.jsx # Input form
│   │   │   └── UserInfo.jsx     # User profile display
│   │   ├── services/
│   │   │   ├── api.js           # HTTP API calls
│   │   │   └── socket.js        # Socket.io setup
│   │   ├── styles/
│   │   │   └── globals.css      # Global styles
│   │   ├── App.css              # App styles
│   │   └── main.jsx             # React entry point
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Dependencies
│   ├── vite.config.js           # Vite configuration
│   └── README.md                # Frontend setup guide
│
├── docker-compose.yml           # Local development with Docker
└── README.md                    # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** v16+ and **npm/yarn**
- **MongoDB** (local or Atlas account - free tier available)
- **Git**

### Step 1: Clone & Setup Backend

```bash
# Clone the repository
git clone https://github.com/tanveersharma353-sketch/swc_task.git
cd swc_task/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string and JWT secret
nano .env
```

**Edit `backend/.env`:**

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/chat_db
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:5173
```

### Step 2: Setup Frontend

```bash
# In another terminal, from project root
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`:**

```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Run Both Services

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v4.x.x ready in ... ms

➜  Local:   http://localhost:5173/
```

### Step 4: Test the Application

1. Open `http://localhost:5173` in your browser
2. **Register** a new account
3. Verify your email (check console for verification link in development)
4. **Login** with credentials
5. Open another browser tab and login with a different account
6. Send messages and see real-time updates! 🎉

---

## 🌐 Deploy to the Cloud

### Option 1: Deploy to Render (Recommended - Free)

#### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click **New → Web Service**
4. Connect your GitHub repository
5. **Configuration:**
   - **Name:** `swc-chat-backend`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `node backend/server.js`
   - **Add Environment Variables:**
     - `PORT=5000`
     - `NODE_ENV=production`
     - `DATABASE_URL=` (your MongoDB Atlas URI)
     - `JWT_SECRET=` (strong random key)
     - `FRONTEND_URL=` (your frontend URL)
6. Click **Deploy**

#### Deploy Frontend to Render

1. Click **New → Static Site**
2. Connect your repository
3. **Configuration:**
   - **Name:** `swc-chat-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Add Environment Variable:**
     - `VITE_API_URL=` (your Render backend URL)
4. Click **Deploy**

### Option 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Click **Deploy from GitHub Repo**
4. Authorize GitHub and select your repository
5. Create two services:
   - **Backend Service:**
     - Select root directory: `backend`
     - Add environment variables
   - **Frontend Service:**
     - Select root directory: `frontend`
     - Build command: `npm run build`
     - Start command: `npm run preview`

### Option 3: Deploy to Fly.io

1. Install Fly CLI: [flyctl docs](https://fly.io/docs/getting-started/installing-flyctl/)
2. Authenticate: `flyctl auth login`
3. Create backend app:
   ```bash
   cd backend
   flyctl launch
   flyctl secrets set DATABASE_URL=<your_mongo_uri> JWT_SECRET=<your_secret> FRONTEND_URL=<frontend_url>
   flyctl deploy
   ```
4. Create frontend app:
   ```bash
   cd ../frontend
   flyctl launch
   flyctl secrets set VITE_API_URL=<your_backend_url>
   flyctl deploy
   ```

---

## 🔐 MongoDB Setup (Free Tier)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a **free cluster** (M0 tier)
4. Click **Connect → Drivers**
5. Copy connection string
6. Replace credentials in connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
   ```
7. Add to `.env` as `DATABASE_URL`

**⚠️ Important:** Whitelist all IPs (0.0.0.0/0) in MongoDB Network Access for easy deployment

---

## 📝 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: { token, user: { id, username, email } }
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{ "token": "verification_token" }

Response: { message: "Email verified successfully" }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: { token, user: { id, username, email } }
```

### Message Endpoints

#### Fetch Chat History
```http
GET /api/messages?limit=50
Authorization: Bearer <jwt_token>

Response: [{ _id, sender, message, timestamp }, ...]
```

---

## 🔌 Socket.io Events

### Client → Server

- **`send_message`** - Emit new message
  ```js
  socket.emit('send_message', { message: 'Hello!', sender: 'username' })
  ```

### Server → Client

- **`receive_message`** - Broadcast incoming message
  ```js
  socket.on('receive_message', (data) => {
    console.log(`${data.sender}: ${data.message}`)
  })
  ```

- **`user_joined`** - User joined chat
  ```js
  socket.on('user_joined', (data) => {
    console.log(`${data.username} joined the chat`)
  })
  ```

- **`user_left`** - User left chat
  ```js
  socket.on('user_left', (data) => {
    console.log(`${data.username} left the chat`)
  })
  ```

---

## 🛠️ Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|----------|
| PORT | Server port | `5000` |
| NODE_ENV | Environment mode | `development` or `production` |
| DATABASE_URL | MongoDB connection URI | `mongodb+srv://...` |
| JWT_SECRET | Secret key for JWT signing | `random_secure_key_here` |
| FRONTEND_URL | Frontend deployment URL | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|----------|
| VITE_API_URL | Backend API base URL | `http://localhost:5000` |

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check `DATABASE_URL` in `.env`
- Ensure MongoDB cluster is running
- Whitelist your IP in MongoDB Atlas

### "CORS error on login"
- Verify `FRONTEND_URL` matches your frontend origin
- Check backend CORS middleware configuration

### "Socket.io connection fails"
- Ensure `VITE_API_URL` points to correct backend
- Check if backend server is running
- Verify WebSocket is not blocked by firewall

### "Verification email not received"
- In development, check browser console for verification link
- Ensure email service is configured in `.env`

---

## 📚 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express, Socket.io, MongoDB, Mongoose |
| **Frontend** | React, Vite, Tailwind CSS, Socket.io-client |
| **Authentication** | JWT, Bcrypt |
| **Database** | MongoDB Atlas |
| **Deployment** | Render, Railway, Fly.io |

---

## 📄 License

MIT License - Feel free to use this project for learning and development!

---

## 🤝 Contributing

Found a bug? Have suggestions? Open an issue or submit a pull request!

---

## 📞 Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review backend/README.md and frontend/README.md
3. Open a GitHub issue

**Happy chatting! 🚀**
