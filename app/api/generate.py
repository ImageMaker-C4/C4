from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.image import Image as ImageModel
from app.schemas.image import ImageGenerateRequest, ImageResponse
from app.services.image_service import image_service
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/generate", response_model=ImageResponse)
async def generate_image(request: ImageGenerateRequest, db: Session = Depends(get_db)):
    """
    User sends a prompt (chat format), we return one image.
    Each request is independent to avoid labeling mix-ups.
    """
    try:
        # 1. Unique ID for this specific transaction
        image_id = str(uuid.uuid4())
        
        # 2. Get the specific image URL for this prompt
        generated_url = await image_service.generate_image_url(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            width=request.width,
            height=request.height
        )

        # 3. Save to database
        db_image = ImageModel(
            id=image_id,
            prompt=request.prompt,
            url=generated_url,
            status="completed",
            created_at=datetime.utcnow()
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)

        return db_image
    except Exception as e:
        # Log error or handle specifically
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
