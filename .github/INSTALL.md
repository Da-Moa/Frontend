# Frontend 설치 및 실행

[README](../README.md) · [Stack](STACK.md) · [Structure](STRUCTURE.md)

## 준비

- Node.js **22.18 이상**, npm
- 별도 실행 중인 [Backend](https://github.com/Da-Moa/Backend)

## 로컬 실행

```sh
cd /Users/user/da-moa/Frontend
npm ci
cp -n .env.example .env.local
npm run dev
```

기존 `.env.local`이 있으면 유지합니다. 브라우저에서 **http://localhost:3000**으로 접속합니다.
백엔드 준비 방법은 [Backend Install](https://github.com/Da-Moa/Backend/blob/main/.github/INSTALL.md)을 참고하세요.

## 환경변수

| 변수 | 기본값 | 용도 |
| --- | --- | --- |
| `BACKEND_URL` | `http://127.0.0.1:3001` | API·카카오 콜백·WebSocket 중계 대상 |
| `PORT` | `3000` | 프론트 서버 포트 |
| `HOST` | `0.0.0.0` | 프론트 서버 바인딩 주소 |
| `NEXT_DEV_ALLOWED_ORIGINS` | 빈 값 | 개발 서버에 추가로 허용할 호스트. 프로토콜·포트 없이 쉼표로 구분 |
| `NEXT_PUBLIC_SHEET_DRAG_SPEED_DEBUG` | `false` | 추가창 드래그 속도 표시 |

`BACKEND_URL`에는 IP·포트·도메인을 지정할 수 있습니다.
예: `http://192.168.0.10:3001`, `https://api.example.com`, `localhost:8080`.
프로토콜 생략 시 HTTP를 사용하며 경로·계정 정보는 넣지 않습니다.
이 값은 서버에서만 읽습니다. 변경 후 프론트를 재시작하면 적용되며 재빌드는 필요하지 않습니다.
`NEXT_PUBLIC_` 변수는 브라우저 번들에 포함되므로 운영에서는 빌드 후 다시 실행합니다.

## 카카오 로그인

카카오 콘솔과 **백엔드**의 `KAKAO_REDIRECT_URI`에 브라우저가 접속하는 **프론트 주소**를 똑같이 등록합니다.

```text
http://localhost:3000/auth/v1/kakao
```

LAN으로 접속한다면 `http://<프론트 IP>:3000/auth/v1/kakao`도 등록합니다.
백엔드는 기본 3001번으로 실행하고 프론트가 콜백 요청을 중계합니다.
localhost와 IP는 서로 다른 주소이므로 실제 접속 주소에 맞춰 등록해야 합니다.

## 프로덕션 실행

```sh
npm run build
npm start
```

`server.mjs`가 중계를 담당하므로 실행 명령은 `npm start`입니다.
자체 Docker 이미지를 만들려면 저장소 루트에서 `docker build -t da-moa-frontend:local .`을 실행합니다.

## 검사

```sh
npm test
npm run typecheck
npm run build
```

단위 테스트에는 중계 주소 검증, Host·Origin·인증 정보·본문·쿠키·리다이렉트 보존 검사도 포함됩니다.

## 브라우저 회귀 테스트

테스트 전용 PostgreSQL·MinIO와 Backend를 별도로 준비합니다.
테스트 DB에 마이그레이션과 `db:seed:test-accounts`를 실행하고, 백엔드는 3309번에서 실행합니다.
백엔드에는 `KAKAO_REDIRECT_URI=http://127.0.0.1:3307/auth/v1/kakao`,
`RECEIPT_WORKER_ENABLED=false`와 테스트 전용 `AUTH_JWT_SECRET`을 설정합니다.
로컬 HTTP에서 테스트할 백엔드는 `NODE_ENV=development`로 실행합니다.
운영·일반 개발 DB를 브라우저 테스트에 연결하지 않습니다.

```sh
npx playwright install chromium
BROWSER_BACKEND_URL=http://127.0.0.1:3309 AUTH_JWT_SECRET='<백엔드와 동일한 테스트 전용 비밀키>' npm run test:browser
```

Playwright는 프론트만 3307번에서 시작·종료합니다. 백엔드는 실행된 상태여야 합니다.
이 저장소가 Backend 소스나 Nest 모듈을 import하지는 않습니다.
실패 시 산출물은 `test-results/browser`에 기록합니다.
