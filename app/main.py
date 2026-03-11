from fastapi import FastAPI
from app.api import generate, images, gallery

app = FastAPI(title="AI Image Generation API")

# Include routers
app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(images.router, prefix="/api", tags=["images"])
app.include_router(gallery.router, prefix="/api", tags=["gallery"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Image Generation API"}
