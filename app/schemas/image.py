from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImageGenerateRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    width: Optional[int] = 512
    height: Optional[int] = 512

class ImageResponse(BaseModel):
    id: str
    prompt: str # To prevent labeling mix-ups, always return the prompt with the image
    url: str
    status: str
    created_at: datetime
