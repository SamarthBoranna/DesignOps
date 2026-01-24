from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import components, workspaces, cost

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(components.router)
app.include_router(workspaces.router)
app.include_router(cost.router)

@app.get("/health")
def health():
    return {"status": "ok"}
