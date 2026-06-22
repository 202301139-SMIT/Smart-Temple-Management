# Tirupati Tourism Forecasting & Smart Temple Management

A full-stack web application designed for forecasting pilgrim tourism at the Tirupati Balaji Temple and providing smart management actions for pilgrims.

## Project Structure

The project is structured as a monorepo containing both the frontend and backend:

*   **`frontend/`**: React single page application built with Vite, Tailwind CSS, Material UI (MUI), and Radix UI components.
*   **`backend/`**: Express.js server on Node.js handling the forecasting logic, API routes, and pilgrim actions.
*   **`package.json`**: Root configuration that coordinates scripts for installing and running the entire application concurrently.

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Installation

Instead of installing packages in each folder manually, you can install the root, frontend, and backend dependencies all at once using the custom root script:

```bash
npm run install-all
```

This runs the installer in both subdirectories under the hood:
*   Frontend dependencies (`npm install --prefix frontend`)
*   Backend dependencies (`npm install --prefix backend`)

### 2. Running in Development Mode

To start both the Express backend and the Vite frontend concurrently:

```bash
npm run dev
```

*   The **Frontend** will be available at [http://localhost:5173](http://localhost:5173) (or the next available port indicated by Vite).
*   The **Backend** will run on its configured port (defaulting to [http://localhost:5000](http://localhost:5000) or as specified in `backend/server.js`).

---

## Useful Commands

| Command | Description |
| :--- | :--- |
| `npm run install-all` | Installs dependencies for root, frontend, and backend. |
| `npm run dev` | Starts both the frontend and backend development servers simultaneously. |
| `npm run frontend` | Runs only the frontend dev server. |
| `npm run backend` | Runs only the backend start script. |
