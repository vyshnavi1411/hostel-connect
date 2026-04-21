# 🚀 How to Run Nexus (HostelConnect)

Follow these steps to get the **Nexus** platform up and running on your local machine.

---

## 🛠 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Docker Desktop** (Required for the database)
- **Git**

---

## 🏃 Quick Start Guide

### 1. Start the Database
The application uses MongoDB via Docker to ensure a clean environment.
```powershell
docker compose up -d
```

### 2. Start the Backend API
Navigate to the `backend` directory and start the server.
```powershell
cd backend
npm install   # If running for the first time
npm start
```
*The API will be available at: `http://localhost:5000`*

### 3. Start the Frontend UI
Navigate to the `frontend` directory and start the development server.
```powershell
cd frontend
npm install   # If running for the first time
npm run dev
```
*The Dashboard will be available at: `http://localhost:5173`*

---

## 🧭 Navigation & Testing
- **Landing/Login**: [http://localhost:5173/login](http://localhost:5173/login)
- **Register**: Create a new account to test profile settings.
- **Dashboard**: View your student profile and (upcoming) community features.

---

## 💡 Troubleshooting
- **Docker Issues**: If the backend says `ECONNREFUSED`, ensure Docker Desktop is running and that you've run `docker compose up -d`.
- **Port Conflicts**: Ensure ports `5000` (Backend), `5173` (Frontend), and `27017` (MongoDB) are not being used by other applications.

---

> [!TIP]
> **Nexus** is designed as a premium, glassmorphic experience. For the best visual result, use a modern browser like Chrome or Edge and keep your window maximized!
