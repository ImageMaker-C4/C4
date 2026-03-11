from fastapi import APIRouter
from app.schemas.image import ImageResponse
from typing import List
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/gallery", response_model=List[ImageResponse])
async def get_gallery():
    # This is a prototype. In a real scenario, this would query a database.
    # For now, it returns a mock response with a few images.
    mock_images = [
        ImageResponse(
            id=str(uuid.uuid4()),
            prompt="Sunlight hitting a glass building",
            url="https://via.placeholder.com/512",
            status="completed",
            created_at=datetime.now()
        ),
        ImageResponse(
            id=str(uuid.uuid4()),
            prompt="Neon city in rain",
            url="https://via.placeholder.com/512",
            status="completed",
            created_at=datetime.now()
        )
    ]
    return mock_images
