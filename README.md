# CampusConnect — AI-Powered Campus Event Platform

CampusConnect is a robust, full-stack microservices-based platform designed for managing college events with a strictly enforced 5-tier role hierarchy.

## 🚀 Architecture
The platform is built on a microservices architecture for scalability and separation of concerns.

```ascii
[ Frontend (React/Vite/Tailwind) ]
           |
           v
[ API Gateway (Port 8080) ]
           |
    ---------------------------------------------------------
    |                       |                               |
[ Auth Service ]       [ Event Service ]        [ Registration Service ]
  (Port 3001)            (Port 3002)               (Port 3003)
      |                      |                          |
[ CC_Auth DB ]         [ CC_Events DB ]          [ CC_Reg DB ]
```

## 👑 Role Hierarchy
1. **Tier 1 — Website Owner**: Full platform control, secret access route.
2. **Tier 2 — Website Admin**: Platform-wide management and college approvals.
3. **Tier 3 — College Event Head**: College-specific event and budget management.
4. **Tier 4 — Event Organizer Helper**: Assigned event operations and check-ins.
5. **Tier 5 — Student**: Event discovery and registration.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Lucide React, TanStack Query.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB Atlas (Multi-database structure).
- **Real-time**: Socket.io (Seat hold synchronization).
- **Docker**: Containerized services and frontend.

## 📦 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- MongoDB Atlas account (URI provided in .env)

### Installation
1. Clone the repository.
2. Configure environment variables in `.env` (provided in root).
3. Run the platform using Docker:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:5173`.

### 🔐 Auth Details
- **Owner Secret Route**: `/owner-access-9x72k`
- **Owner Secret Key**: `ownerpass2024`

## 📧 EmailJS Configuration
The platform uses EmailJS (Service ID: `service_282i3zi`) for:
- Email verification.
- Registration confirmation (with QR text).
- Seat hold warnings.
- College approval/rejection notifications.

## ⏱️ Seat Hold System
- When a student initiates registration, a seat is "held" for 90 seconds.
- A countdown timer appears on the UI.
- If the student doesn't confirm within 90s, the seat is automatically released.
- Implemented using MongoDB TTL indexes and Socket.io events.
