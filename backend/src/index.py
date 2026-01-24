from fastapi import FastAPI
from .routes import components, workspaces, cost

app = FastAPI()

# Include routers
app.include_router(components.router)
app.include_router(workspaces.router)
app.include_router(cost.router)

@app.get("/health")
def health():
    return {"status": "ok"}
