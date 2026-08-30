# Backend - Real-Time Chat Application

Node.js & Express backend with Socket.io for real-time messaging.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/chat_db
JWT_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:5173
```

### 3. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── server.js              # Main application file
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js           # User schema
│   └── Message.js        # Message schema
├── routes/
│   ├── auth.js           # Authentication endpoints
│   └── messages.js       # Message endpoints
├── middleware/
│   └── auth.js           # JWT middleware
├── controllers/           # Business logic (optional expansion)
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md             # This file
```

---

## 🔌 API Endpoints

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Pass123!",
  "confirmPassword": "Pass123!"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abcdef",
    "username": "john_doe",
    "email": "john@example.com",
    "isEmailVerified": false
  },
  "verificationLink": "http://localhost:5173/verify-email?token=..."
}
```

#### Verify Email
```bash
POST /api/auth/verify-email
Content-Type: application/json

{ "token": "verification_token_here" }
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Pass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abcdef",
    "username": "john_doe",
    "email": "john@example.com",
    "isEmailVerified": true,
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe"
  }
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Messages

#### Fetch Chat History
```bash
GET /api/messages?limit=50&skip=0
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "messages": [
    {
      "_id": "64abcdef",
      "sender": "john_doe",
      "senderId": "64abcdef",
      "message": "Hello everyone!",
      "timestamp": "2024-01-15T10:30:00Z",
      "isEdited": false
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

#### Delete Message
```bash
DELETE /api/messages/:messageId
Authorization: Bearer <jwt_token>
```

---

## 🔌 Socket.io Events

### Client Events (Client → Server)

#### User Join
```javascript
socket.emit('user_join', {
  username: 'john_doe',
  userId: '64abcdef'
});
```

#### Send Message
```javascript
socket.emit('send_message', {
  message: 'Hello world!'
});
```

#### User Typing
```javascript
socket.emit('user_typing', {
  isTyping: true
});
```

### Server Events (Server → Client)

#### Receive Message
```javascript
socket.on('receive_message', (data) => {
  console.log(`${data.sender}: ${data.message}`);
  // data: { sender, senderId, message, timestamp, _id }
});
```

#### User Joined
```javascript
socket.on('user_joined', (data) => {
  console.log(`${data.username} joined`);
  // data: { username, message, timestamp }
});
```

#### User Left
```javascript
socket.on('user_left', (data) => {
  console.log(`${data.username} left`);
  // data: { username, message, timestamp }
});
```

#### User Typing
```javascript
socket.on('user_typing', (data) => {
  console.log(`${data.username} is typing...`);
  // data: { username, isTyping }
});
```

---

## 🗄️ Database Models

### User Model

```javascript
{
  _id: ObjectId,
  username: String (unique, 3-30 chars),
  email: String (unique, valid email),
  password: String (hashed, min 6 chars),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  avatar: String (URL),
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model

```javascript
{
  _id: ObjectId,
  sender: String,
  senderId: ObjectId (ref: User),
  message: String (max 1000 chars),
  timestamp: Date,
  isEdited: Boolean,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

✅ **Password Hashing** - Bcrypt with 10 rounds  
✅ **JWT Authentication** - 7-day token expiration  
✅ **CORS Protection** - Configurable origin  
✅ **Input Validation** - Email format, password strength  
✅ **Email Verification** - Token-based verification  
✅ **Authorization** - User-scoped operations  

---

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy!

### Deploy to Railway

1. Connect GitHub repo to [railway.app](https://railway.app)
2. Create service for `backend` directory
3. Add environment variables
4. Auto-deploy on push

### Deploy to Fly.io

```bash
cd backend
flyctl launch
flyctl secrets set DATABASE_URL=<uri> JWT_SECRET=<secret>
flyctl deploy
```

---

## 📦 Dependencies

- **express** - Web framework
- **socket.io** - Real-time communication
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **nodemon** (dev) - Auto-reload server

---

## 🐛 Troubleshooting

### Cannot connect to MongoDB
- Verify `DATABASE_URL` is correct
- Check MongoDB Atlas IP whitelist
- Ensure cluster is active

### CORS Error
- Verify `FRONTEND_URL` in `.env`
- Check that frontend URL matches exactly

### Socket.io not connecting
- Ensure `FRONTEND_URL` is set correctly
- Check firewall/proxy WebSocket support

### JWT Token Invalid
- Regenerate `JWT_SECRET` if changed
- Clear token in localStorage and re-login

---

## 📚 More Info

- [Express Documentation](https://expressjs.com)
- [Socket.io Docs](https://socket.io/docs)
- [Mongoose Docs](https://mongoosejs.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

**Happy coding! 🚀**
