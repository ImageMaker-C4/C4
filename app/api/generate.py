from fastapi import APIRouter, HTTPException
from app.schemas.image import ImageGenerateRequest, ImageResponse
from app.services.image_service import image_service
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/generate", response_model=ImageResponse)
async def generate_image(request: ImageGenerateRequest):
    """
    User sends a prompt (chat format), we return one image.
    Each request is independent to avoid labeling mix-ups.
    """
    try:
        # 1. Unique ID for this specific transaction
        image_id = str(uuid.uuid4())
        
        # 2. Get the specific image URL for this prompt
        # Pollinations.ai is deterministic with seed, providing a stable 1:1 mapping
        generated_url = await image_service.generate_image_url(
            prompt=request.prompt,
            width=request.width,
            height=request.height
        )

        # 3. Return both the image and the original prompt to the frontend
        # This allows the frontend to double-check the label
        new_image = ImageResponse(
            id=image_id,
            prompt=request.prompt,
            url=generated_url,
            status="completed",
            created_at=datetime.now()
        )
        
        return new_image
    except Exception as e:
        # Log error or handle specifically
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
