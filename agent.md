# 프로젝트: AI 이미지 생성 웹사이트
## 팀 구성 및 역할 분담 (Team Roles)

### 1. Agent: Frontend Lead (하동건)
- **역할**: 사용자 인터페이스 개발 및 클라이언트 사이드 로직 담당
- **주요 작업**:
  - React/Next.js 기반 웹 애플리케이션 아키텍처 설계
  - 프롬프트 입력 UI, 생성 상태 인디케이터, 이미지 결과 그리드 구현
  - 테마 시스템(Dark/Light 모드) 및 반응형 레이아웃 적용

### 2. Agent: Backend Architect (이지훈)
- **역할**: 서버 인프라 및 데이터 흐름 관리
- **주요 작업**:
  - RESTful API 또는 GraphQL 서버 구축
  - 외부 AI API(OpenAI, Replicate 등) 연동 및 에러 핸들링
  - 생성된 이미지의 저장소(S3 등) 연동 및 CDN 설정

### 3. Agent: AI Specialist (정명우)
- **역할**: 이미지 생성 모델 최적화 및 결과 품질 관리
- **주요 작업**:
  - 모델 파라미터 튜닝 및 프롬프트 인핸서(Enhancer) 개발
  - 이미지 생성 비용 최적화 및 속도 개선
  - 유해 콘텐츠 필터링 및 안전 가이드라인 적용

---
## 협업 가이드라인
- 모든 코드는 PR(Pull Request)을 통해 리뷰 후 병합한다.
- API 명세는 Swagger 또는 Postman을 통해 공유한다.
- 디자인 시스템은 Figma를 참조하여 일관성을 유지한다.
