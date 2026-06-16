# 🎯 FocusTrack AI

FocusTrack AI is a smart study and attention tracking platform that helps students understand their real focus levels during study sessions.

Unlike traditional timers, FocusTrack AI uses AI-powered attention analysis to detect distractions, monitor focus, and provide meaningful productivity insights.

---

## 🚀 Features

### 👤 Authentication
- Secure user authentication using Clerk
- Sign Up / Login
- Session management

### 📚 Study Session Tracking
- Start study sessions
- End study sessions
- Track session duration

### 🧠 AI Focus Analysis
- Face detection
- Eye detection
- Looking-away detection
- Real-time focus score calculation

### 📊 Analytics Dashboard
- Average focus score
- Total study time
- Distraction count
- Session history

### 📧 Email Notifications
- Welcome emails using Resend
- Automated onboarding workflow

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Clerk Authentication

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### AI Service
- Python
- FastAPI
- OpenCV
- MediaPipe

### Email Service
- Resend

### Authentication
- Clerk

---

## 📂 Project Structure

```text
focus-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── focusController.js
│   └── sessionController.js
│
├── models/
│   ├── User.js
│   ├── FocusLog.js
│   └── StudySession.js
│
├── routes/
│   ├── focusRoutes.js
│   ├── sessionRoutes.js
│   └── webhookRoutes.js
│
├── services/
│   ├── aiService.js
│   └── emailService.js
│
├── utils/
│   ├── calculateFocusScore.js
│   ├── formatResponse.js
│   └── validators.js
│
├── .env
├── server.js
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLERK_SECRET_KEY=your_clerk_secret_key

RESEND_API_KEY=your_resend_api_key

PYTHON_AI_URL=http://127.0.0.1:8000
```

---

## 📦 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/focustrack-ai.git
```

### Install Dependencies

```bash
npm install
```

### Run Backend

```bash
npm run dev
```

---

## 🔄 System Flow

```text
User
 ↓
Clerk Authentication
 ↓
Study Session Started
 ↓
AI Attention Analysis
 ↓
Focus Score Generated
 ↓
MongoDB Storage
 ↓
Analytics Dashboard
 ↓
Resend Email Notifications
```

---

## 🎯 Project Goal

FocusTrack AI aims to help students move beyond simple study timers by measuring actual attention and focus levels. The platform provides actionable insights that help users improve concentration, reduce distractions, and build better study habits.

---

## 👨‍💻 Author

Vasant Jevengekar

Bachelor of Science in Computer Science

Vishwa Vishwani Institute of Systems and Management
