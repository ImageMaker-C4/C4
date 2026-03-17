from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.image import Image as ImageModel
from app.schemas.image import ImageResponse
from typing import List

router = APIRouter()

@router.get("/gallery", response_model=List[ImageResponse])
async def get_gallery(db: Session = Depends(get_db)):
    images = db.query(ImageModel).order_by(ImageModel.created_at.desc()).all()
    return images
