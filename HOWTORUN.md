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

### Start the Entire Platform
The application is fully containerized. You can start the database, backend, and frontend with a single command:
```powershell
docker compose up --build
```

### Accessing the Platform
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Database (MongoDB)**: `mongodb://localhost:27017`

---

## 🧭 Navigation & Testing
- **Landing/Login**: [http://localhost:5173/login](http://localhost:5173/login)
- **Register**: Create a new account to test profile settings.
- **Global Chat**: Connect in real-time with other residents via WebSockets.
- **Complaint System**: Lodge and track maintenance requests.

---

## 💡 Troubleshooting
- **Docker Issues**: If the backend says `ECONNREFUSED`, ensure Docker Desktop is running and that you've run `docker compose up -d`.
- **Port Conflicts**: Ensure ports `5000` (Backend), `5173` (Frontend), and `27017` (MongoDB) are not being used by other applications.

---

> [!TIP]
> **Nexus** is designed as a premium, glassmorphic experience. For the best visual result, use a modern browser like Chrome or Edge and keep your window maximized!
