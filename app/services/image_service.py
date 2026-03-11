import httpx
import uuid
from typing import Optional

class ImageService:
    BASE_URL = "https://image.pollinations.ai/prompt"

    async def generate_image_url(
        self, 
        prompt: str, 
        width: int = 512, 
        height: int = 512, 
        seed: Optional[int] = None
    ) -> str:
        # URL 안전하게 만들기 (공백 처리)
        safe_prompt = prompt.replace(" ", "%20")
        url = f"{self.BASE_URL}/{safe_prompt}?width={width}&height={height}&nologo=true"
        
        if seed:
            url += f"&seed={seed}"
        else:
            # 매번 다른 이미지를 위해 랜덤 시드 추가
            url += f"&seed={uuid.uuid4().int % 1000000}"

        return url

image_service = ImageService()
