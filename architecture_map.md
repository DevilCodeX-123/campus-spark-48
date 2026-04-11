# Campus Spark: Microservices Architecture Map 🗺️

Your system is now powered by a high-scalability distributed architecture. Each feature is isolated into its own "Micro-Server" running on a unique port.

## 🗼 Port Assignments & Responsibilities

| Service | Port | Primary Responsibility | "The Why" |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8080` | Entry point, Proxying, Security | Shields the internal network and provides a unified API URL for the frontend. |
| **Auth Service** | `3001` | Login, Signup, RBAC, JWT | Centralizes security. If this goes down, only login/signup is affected. |
| **Event Service** | `3002` | CRUD, Budgeting, Categories | Manages the core product (Events). Scaled independently for high browsing traffic. |
| **Registration** | `3003` | Tickets, QR Codes, Live Updates | Handles critical real-time traffic (WebSockets) without lagging other services. |
| **Ad Service** | `3004` | Ads, Monetization, Analytics | A specialized utility for serving ads without cluttering core event data. |

## 🚀 How to Launch
Run the master start script from the root:
```bash
node start-backend.js
```
This will automatically launch all 5 services simultaneously.
