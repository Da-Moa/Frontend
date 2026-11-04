# Frontend 기술 스택

[README](../README.md) · [Install](INSTALL.md) · [Structure](STRUCTURE.md)

버전은 현재 저장소의 `package-lock.json` 기준입니다.

| 영역 | 기술 |
| --- | --- |
| 런타임 | Node.js 22.18 이상 |
| 프레임워크 | Next.js 16.4.4 · React 19.3.0 · TypeScript 6.0.3 |
| 중계 | Node HTTP 서버 · http-proxy 1.18.1 · 런타임 `BACKEND_URL` |
| UI | React · CSS · lucide-react |
| 영수증 | 브라우저 Web Worker · @jsquash/avif · WASM AVIF 인코딩 |
| 계좌 입력 | korean-account |
| 테스트 | Node test runner · Playwright 1.64.0 · Chromium |
| CI | GitHub Actions · 단위·타입 검사·ARM64 이미지 검증·GHCR 게시·컴포넌트 배포 요청 |

API·인증·DB·영수증 워커는 [Backend](https://github.com/Da-Moa/Backend)가 담당합니다.
프론트 중계 서버는 브라우저의 Host·Origin과 쿠키·WebSocket 인증 정보를 유지합니다.

## 이미지·글꼴 출처

| 자료 | 위치와 라이선스 |
| --- | --- |
| 다모아 로고 | [public/logo](../public/logo) |
| 은행 아이콘 | [아이콘 폴더](../public/banks) · [출처 및 라이선스](../public/banks/LICENSE.korea-bank-icons.txt) |
| 국기 아이콘 | [아이콘 폴더](../public/flags) · [라이선스](../public/flags/LICENSE) |
| 로컬 글꼴 | [글꼴 폴더](../src/assets/fonts) · [OFL](../src/assets/fonts/OFL.txt) |
| UI 아이콘 | `lucide-react` 패키지의 라이선스 적용 |

프로젝트 자체의 라이선스는 [AGPL-3.0-only](../LICENSE)이며,
외부 라이브러리·이미지·글꼴의 라이선스는 각 자료에 적용됩니다.
