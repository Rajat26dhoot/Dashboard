# 📱🛠️ Full-Stack Payment Dashboard App (NestJS + React Native)

A modern full-stack dashboard application for managing payments, users, and real-time statistics. Built with **React Native (Expo)** for the mobile frontend and **NestJS** for the backend.

---

## 🚀 Tech Stack

### 📲 Frontend (React Native)
- React Native (Expo)
- React Navigation
- Axios
- react-native-chart-kit
- Redux Toolkit or Context API
- Expo secure store

### 🖥️ Backend (NestJS)
- NestJS
- TypeORM or Prisma
- PostgreSQL or MongoDB
- JWT Authentication
- Class-validator



---

## 🔑 Features

### ✅ React Native App

* Authentication (JWT-based)
* Dashboard with charts & metrics
* Payment listing and filtering
* Add simulated payments
* Role-based UI (admin, viewer)
* Profile and settings screens

### ✅ NestJS Backend

* JWT Auth with Guards
* User & Role Management
* Payments CRUD & stats endpoint

---

## ⚙️ Getting Started

### 🛠️ Clone the Repository

```bash
git clone https://github.com/your-username/fullstack-dashboard-app.git
cd fullstack-dashboard-app
```

---

## 🖥️ Backend Setup

```bash
cd backend
npm install
```

### Create `.env` File

```env
PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_database_url
```

### Run Backend Server

```bash
npm run start
```


## 📱 Frontend Setup

```bash
cd my-app
npm install
npx expo start
```

> Make sure to update your API base URL in the API service file.

---

## 🔐 Authentication Flow

* Login returns a JWT token.
* Token is stored in `expo secure store`.
* Token is used in `Authorization: Bearer <token>` header.
* Protected routes and role checks handled via backend guards.

---

## 📊 Sample API Endpoints

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/auth/login`     | Log in with email & password   |
| GET    | `/users`          | List users (admin only)        |
| POST   | `/users`          | Add user (admin only)          |
| GET    | `/payments`       | List payments                  |
| POST   | `/payments`       | Add a new payment              |
| GET    | `/payments/stats` | Payment statistics (dashboard) |
| GET    | `/payments/{id}`  | Payment detail by id           |

---

## 🧪 Running Tests

```bash
# Backend
cd backend
npm run test
```

---

