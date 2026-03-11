import httpx
import uuid
import urllib.parse
from typing import Optional

class ImageService:
    BASE_URL = "https://image.pollinations.ai/prompt"
    
    # AI Specialist 정명우: 고품질 이미지를 위한 기본 프롬프트 강화 문구
    DEFAULT_POSITIVE_PROMPT = "masterpiece, high quality, 8k, sharp focus, highly detailed"
    DEFAULT_NEGATIVE_PROMPT = "blurry, low quality, distorted, bad anatomy, text, watermark"

    async def generate_image_url(
        self, 
        prompt: str, 
        negative_prompt: Optional[str] = None,
        width: int = 512, 
        height: int = 512, 
        seed: Optional[int] = None
    ) -> str:
        """
        AI Specialist 로직:
        1. 사용자의 프롬프트를 강화하고
        2. 네거티브 프롬프트를 적용하며
        3. Pollinations.ai API에 맞게 안전한 URL을 생성합니다.
        """
        
        # 1. 프롬프트 강화 (Prompt Engineering)
        enhanced_prompt = f"{prompt}, {self.DEFAULT_POSITIVE_PROMPT}"
        
        # 2. URL 인코딩 (특수문자 및 공백 처리)
        encoded_prompt = urllib.parse.quote(enhanced_prompt)
        
        # 3. 기본 URL 구성
        url = f"{self.BASE_URL}/{encoded_prompt}?width={width}&height={height}&nologo=true"
        
        # 4. 네거티브 프롬프트 적용 (있을 경우)
        final_negative = negative_prompt if negative_prompt else self.DEFAULT_NEGATIVE_PROMPT
        url += f"&negative={urllib.parse.quote(final_negative)}"
        
        # 5. 시드(Seed) 처리 - 결과의 일관성 또는 다양성 확보
        if seed is None:
            seed = uuid.uuid4().int % 1000000
        url += f"&seed={seed}"
        
        # 6. 추가 최적화 파라미터 (enhance=true는 Pollinations에서 품질 개선 옵션으로 사용될 수 있음)
        url += "&enhance=true"

        return url

image_service = ImageService()
