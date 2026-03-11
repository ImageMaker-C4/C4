# AI 이미지 생성 웹사이트 API 명세서

이 문서는 백엔드(FastAPI)와 프론트엔드(React/Next.js) 간의 통신을 위한 API 명세입니다.

- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json`

---

## 1. 이미지 생성 요청

사용자가 입력한 프롬프트를 바탕으로 AI 이미지를 생성합니다. (현재 Pollinations.ai 무료 API 연동 중)

### **POST** `/api/generate`

**Request Body:**

| 필드명 | 타입 | 필수 여부 | 설명 | 기본값 |
| :--- | :--- | :--- | :--- | :--- |
| `prompt` | string | 필수 | 생성하고자 하는 이미지의 상세 묘사 | - |
| `negative_prompt` | string | 선택 | 제외하고 싶은 요소 (현재 모델에 따라 무시될 수 있음) | null |
| `width` | integer | 선택 | 이미지 가로 해상도 | 512 |
| `height` | integer | 선택 | 이미지 세로 해상도 | 512 |

**Response Body (200 OK):**

```json
{
  "id": "uuid-string-1234",
  "prompt": "A futuristic city with neon lights",
  "url": "https://image.pollinations.ai/prompt/A%20futuristic%20city%20with%20neon%20lights?width=512&height=512&nologo=true&seed=12345",
  "status": "completed",
  "created_at": "2024-03-20T10:00:00.000Z"
}
```

---

## 2. 특정 이미지 상세 조회

특정 ID를 가진 이미지의 생성 상태와 결과 URL을 조회합니다.

### **GET** `/api/images/{image_id}`

**Path Parameters:**

- `image_id`: 이미지의 고유 ID (UUID)

**Response Body (200 OK):**

```json
{
  "id": "uuid-string-1234",
  "prompt": "A beautiful AI-generated sunset",
  "url": "https://via.placeholder.com/512",
  "status": "completed",
  "created_at": "2024-03-20T10:00:00.000Z"
}
```

---

## 3. 갤러리 목록 조회

지금까지 생성된 모든 이미지 목록을 가져옵니다.

### **GET** `/api/gallery`

**Response Body (200 OK):**

```json
[
  {
    "id": "uuid-1",
    "prompt": "Sunlight hitting a glass building",
    "url": "https://url-to-image-1.jpg",
    "status": "completed",
    "created_at": "2024-03-20T09:00:00Z"
  },
  {
    "id": "uuid-2",
    "prompt": "Neon city in rain",
    "url": "https://url-to-image-2.jpg",
    "status": "completed",
    "created_at": "2024-03-20T09:30:00Z"
  }
]
```

---

## 에러 응답 구조 (Common)

에러 발생 시 다음과 같은 구조로 응답합니다.

| 상태 코드 | 의미 |
| :--- | :--- |
| `400` | 잘못된 요청 파라미터 |
| `404` | 해당 ID의 이미지를 찾을 수 없음 |
| `500` | 서버 내부 오류 (AI API 호출 실패 등) |

**Error Response Body:**

```json
{
  "detail": "에러 메시지 내용"
}
```
