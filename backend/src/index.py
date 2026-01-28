from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routes import components, workspaces, cost, auth

# Load environment variables at startup
load_dotenv()

# Disable redirect_slashes to prevent 307 redirects that lose auth headers
app = FastAPI(redirect_slashes=False)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(components.router)
app.include_router(workspaces.router)
app.include_router(cost.router)

@app.get("/health")
def health():
    return {"status": "ok"}
