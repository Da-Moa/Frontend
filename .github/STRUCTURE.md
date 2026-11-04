# Frontend 프로젝트 구조

[README](../README.md) · [Install](INSTALL.md) · [Stack](STACK.md)

```text
Frontend/
├── server.mjs                 # Next.js 실행과 HTTP·WebSocket 중계
├── next.config.mjs            # Next.js 개발·빌드 설정
├── .env.example               # 서버 주소·프론트 환경변수 예시
├── .github/                   # 설치·스택·구조·CI
├── docs/                      # 분리 검증 기록
├── public/                    # 로고·은행·국기 등 정적 파일
├── scripts/                   # 중계 설정·테스트 출력·글꼴 도구
└── src/
    ├── app/                   # App Router 페이지·레이아웃
    ├── assets/                # 이미지·로컬 글꼴
    ├── frontend/
    │   ├── domain/            # 모임·지출·사용자 UI와 API 요청
    │   ├── global/            # 인증·공통 UI·WebSocket
    │   ├── page/              # 페이지 조합
    │   └── test/              # 단위·브라우저 테스트
    └── shared/                # 순수 타입·계좌·금액·정산 규칙
```

## 요청 처리

브라우저는 프론트 주소로 요청합니다. `server.mjs`가 다음 경로를 `BACKEND_URL`로 중계합니다.

- `/api`, `/api/*`: API·인증·상태·영수증
- `/auth/v1/kakao`: 카카오 콜백
- `/docs`, `/docs/*`: API 문서
- `/realtime`: WebSocket

나머지 화면·정적 파일·개발 HMR은 Next.js가 처리합니다.
백엔드 주소는 서버 시작 시 읽으며 브라우저용 공개 환경변수로 주입하지 않습니다.

## 저장소 경계

Frontend에는 Backend 소스와 Nest 런타임 의존성을 두지 않습니다.
`src/shared/domain/*/contracts.ts`는 Backend DTO에서 추출한 구조적 타입입니다.
계약 변경 후 Backend의 `contracts:export`로 동기화하고 두 저장소를 각각 검사합니다.
각 저장소의 Git 기록과 설치·빌드·실행은 독립적입니다.
