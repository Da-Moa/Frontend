# 다모아 Frontend

Next.js 프론트엔드. Backend 저장소와 별도로 설치·빌드·실행합니다.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

기본 화면은 http://localhost:3000, 기본 백엔드는 http://127.0.0.1:3001 입니다.
`.env.local`의 `BACKEND_URL`에 IP·포트·도메인을 지정합니다.
예: `http://192.168.0.10:3001`, `https://api.example.com`, `localhost:8080`.
프로토콜을 생략하면 HTTP를 사용합니다. 경로·계정 정보는 입력하지 않습니다.
주소 변경은 프론트 서버 재시작으로 반영되며 재빌드할 필요가 없습니다.
`BACKEND_URL`은 서버 전용이며 브라우저에 노출하지 않습니다.

`server.mjs`가 `/api`, `/api/*`, `/auth/v1/kakao`, `/docs`, `/docs/*`, `/realtime`을 백엔드로 중계합니다.
브라우저의 Host·Origin과 인증 쿠키, multipart 본문, WebSocket 서브프로토콜을 유지합니다.
카카오 콘솔과 백엔드의 `KAKAO_REDIRECT_URI`에는 **프론트 공개 주소**의 `/auth/v1/kakao`를 등록합니다.
예: `http://localhost:3000/auth/v1/kakao`.
나머지 화면·정적 파일·Next HMR은 Next.js가 담당합니다.
이 프로젝트는 중계 서버가 필요하므로 `next start` 대신 `npm start`를 사용합니다.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## 브라우저 회귀 테스트

별도 테스트 DB에 Backend 마이그레이션과 `db:seed:test-accounts`를 실행한 후,
백엔드를 3309번에서 실행합니다. 운영·개발 DB를 연결하면 안 됩니다.
백엔드 `KAKAO_REDIRECT_URI=http://127.0.0.1:3307/auth/v1/kakao`, `RECEIPT_WORKER_ENABLED=false`로 설정합니다.
백엔드와 동일한 테스트 전용 JWT 비밀을 아래 환경변수에 넣습니다.

```sh
npx playwright install chromium
BROWSER_BACKEND_URL=http://127.0.0.1:3309 AUTH_JWT_SECRET=<test-secret> npm run test:browser
```

Playwright가 프론트만 3307번에서 시작·종료합니다. Backend 소스나 Nest 의존성은 필요하지 않습니다.
DB를 직접 조작하는 기존 CDP 성능 점검 도구는 Backend의 `perf/browserCheck.mjs`에 보존했습니다.

## 구조와 계약

- `src/app`, `src/frontend`, `src/assets`, `public`: 화면과 브라우저 테스트
- `src/shared`: 분리 시점의 순수 타입·규칙 사본. 형제 저장소를 import하지 않습니다.
- `server.mjs`, `scripts/backendProxy.mjs`: 런타임 API·WebSocket 중계
- [Backend](https://github.com/Da-Moa/Backend): API·DB·워커·공통 Compose

이 저장소는 `Da-Moa/Da-Moa`의 main에서 관련 경로의 커밋·작성자·시각을 보존해 추출했습니다.
히스토리를 필터링했기 때문에 커밋 SHA는 변경됩니다. 기존 통합 저장소는 보존합니다.
AGPL-3.0-only 및 자산별 라이선스는 LICENSE와 각 자산 폴더를 참조하세요.
