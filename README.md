# 🔱 Tirumala Smart Pilgrimage & Temple Management

A premium AI-powered full-stack web application designed for pilgrim flow forecasting, logistics planning, and smart infrastructure management at the Tirumala Tirupati Devasthanams (TTD).

---

## 🚀 Quick Start (Run Concurrently)

Follow these two steps to get the entire project up and running:

### 1. Install All Dependencies
Run the command in the root folder to install dependencies for both `frontend` and `backend`:
```bash
npm run install-all
```

### 2. Start Development Servers
Start both the Express backend and Vite frontend servers concurrently:
```bash
npm run dev
```

* 🖥️ **Frontend:** [http://localhost:5173](http://localhost:5173)
* ⚙️ **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 🔑 Dashboard Access Guide

The platform manages multiple user roles. Use the quick-login section at the bottom of the **Sign In** page (`/login`) to directly switch dashboards:

| User Role | Navigation Target | Features Included |
| :--- | :--- | :--- |
| **Temple Admin** | `/temple_overview` | TTD Command Center, Laddu Production Silos, Annaprasadam Buffets, Security CCTV feeds, and System Sim Feed Controllers. |
| **Pilgrim** | `/pilgrim` | Transportation Intelligence Hub, 3D Terrain Explorer, Travel Planner, Sacred Places, and AI Assistant. |
| **Government** | `/government` | Macro Planning Analytics, Regional Influx Models, and Infrastructure stress forecasts. |
| **Hotel Partner** | `/hotel` | Occupancy forecasting and staffing recommendations. |
| **Travel Agency** | `/travel` | Transport dispatch metrics and commuter demand forecasts. |

---

## 🛠️ Simulating Alerts & Operations (Admin Only)

When logged in as a **Temple Admin**, you can use the interactive widgets inside the **TTD Command Center**:
* **Sim Feed Toggle (Nominal vs Alert)**:
  * Click **Nominal** to simulate stable pilgrim flows (~65,000 devotees, full stock silos, regular RFID/CCTV feeds).
  * Click **Alert** to test emergency responses (~235,000 devotee spike, rapid stock drainage under threshold, custom CCTV bounding boxes, and warning logs).
* **Security CCTV Monitor**: Inside the *Security Command* tab, switch the roster card to **Live CCTV Monitor** to view simulated security feed diagnostics and change target camera nodes.

---

## 📂 Project Structure

```
├── backend/                  # Node.js + Express.js backend API
│   ├── src/                  # Backend source files
│   └── package.json          # Backend dependencies
├── frontend/                 # Vite + React + Tailwind frontend SPA
│   ├── src/                  # React dashboard pages and 3D components
│   └── package.json          # Frontend dependencies
├── package.json              # Root script orchestrator
└── README.md                 # Project guide
```

---

## ⚙️ Manual Commands (Optional)

If you prefer to run components in separate terminal windows:

* **Run Frontend Only**:
  ```bash
  npm run frontend
  ```
* **Run Backend Only**:
  ```bash
  npm run backend
  ```
