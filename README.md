# DesignOps
A multi-cloud architecture design platform that provides real-time cost insights, AI-powered diagram assistance, and comprehensive resource metrics across AWS, Azure, and GCP. 

## Project Structure

```
DesignOps/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── app/          # Core app files (App.js, Layout.js, routes.js)
│   │   ├── pages/        # Page components (Home/, Workspace/)
│   │   ├── components/   # Reusable components (panels/, workspace/, ui/)
│   │   ├── state/        # State management (workspaceStore, componentStore, etc.)
│   │   ├── services/     # API and service integrations
│   │   ├── data/         # Static data files (components/, mockWorkspaces.json)
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
├── backend/              # Python FastAPI backend
│   ├── src/
│   │   ├── index.py     # Main application entry point
│   │   ├── routes/      # API route handlers (components, workspaces, cost)
│   │   ├── services/    # Business logic services
│   │   └── data/        # Backend data files
│   └── pyproject.toml   # Python dependencies
│
└── shared/              # Shared schemas and utilities
    └── componentSchema.js
```

## Tech Stack

### Backend
- **Python** (>=3.9) - Core programming language
- **FastAPI** (>=0.128.0) - Modern, fast web framework for building APIs
- **Uvicorn** (>=0.39.0) - ASGI server for running FastAPI applications

### Frontend
- **React** (^19.2.0) - UI library for building user interfaces
- **JavaScript** (ES2020+) - Programming language
- **Vite** (^7.2.4) - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework for styling

## Dependencies

### Backend Dependencies
The backend uses **uv** for Python package management. Dependencies are defined in `backend/pyproject.toml`:
- `fastapi>=0.128.0`
- `uvicorn>=0.39.0`

### Frontend Dependencies
The frontend uses **npm** for package management. Dependencies are defined in `frontend/package.json`:
- React and React DOM (^19.2.0)
- Vite and Vite React plugin
- ESLint for code linting

## Getting Started

### Prerequisites
- **uv** - Python package installer and resolver ([Installation guide](https://github.com/astral-sh/uv))
- **Node.js** and **npm** - For frontend development

### Running the Project

#### Backend (using uv)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using uv:
   ```bash
   uv sync
   ```

3. Run the FastAPI server:
   ```bash
   uv run uvicorn src.index:app --reload
   ```

   The backend API will be available at `http://localhost:8000`

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

### Development Notes

- The frontend is configured to proxy API requests from `/api` to `http://localhost:8000` (see `frontend/vite.config.js`)
- The backend health check endpoint is available at `http://localhost:8000/health`