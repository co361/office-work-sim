# Open Generative AI 설치·검증 기록

가이드 「유료 영상 AI 대신 쓰는 무료 스튜디오 입문 가이드」의 설치 프롬프트를 실행한 결과입니다.
작업 환경은 GUI가 없는 원격 리눅스 컨테이너(Ubuntu 24.04 x86_64, DISPLAY 없음)라서,
데스크톱 앱 설치·로그인·화면 생성은 **사용자 PC에서 직접** 해야 합니다.
아래는 이 환경에서 실제로 검증한 것과, 사용자 PC에서 그대로 따라 하면 되는 절차입니다.

---

## 1. 이 환경에서 실행한 명령과 결과

| 명령 | 결과 |
|---|---|
| `node --version` | `v22.22.2` ✅ (LTS 이상) |
| `npm --version` | `10.9.7` ✅ |
| `npm install -g muapi-cli` | 설치 성공 → `/opt/node22/bin/muapi` |
| `muapi --version` | `muapi CLI 0.2.7` ✅ |
| `muapi auth status` | `API key: not set` — 키 미설정 (의도된 상태, 키는 저장하지 않음) |
| `muapi image models` | 이미지 모델 **102개** 출력 ✅ |
| `muapi video models` | 영상 모델 **145개** 출력 ✅ |
| `muapi models list` | 전체 **268개** 출력 ✅ ("200개 넘게" 표현 확인됨) |
| `npx skills add SamurAIGPT/Generative-Media-Skills --all` | 스킬 **13개** 설치 성공 ✅ |
| 공식 저장소 shallow clone | 성공 — 라이선스 `MIT` ✅, `package.json` 버전 `2.0.0` |

설치된 스킬 13개: `muapi-ad-creative`, `muapi-ai-clipping`, `muapi-cinema-director`,
`muapi-instagram-post`, `muapi-logo-creator`, `muapi-nano-banana`,
`muapi-product-video-ad-maker`, `muapi-seedance-2`, `muapi-social-media-video`,
`muapi-ugc-video-factory`, `muapi-ui-design`, `muapi-youtube-shorts`, `muapi-youtube-thumbnail`

## 2. 이 환경에서 못 한 것과 이유

| 항목 | 상태 | 이유 |
|---|---|---|
| 데스크톱 앱 설치·실행 | ❌ | Electron 앱이라 화면(GUI)이 필요한데 이 컨테이너에는 디스플레이가 없음 |
| 무료 계정 로그인 | ❌ | 사용자 계정 정보가 없고, 비밀번호·API 키는 다루지 않는다는 제약 |
| Image Studio 이미지 1장 생성 | ❌ | 위와 동일 (클라우드 생성은 계정 키 필요) |
| Video Studio 영상 1개 생성 | ❌ | 위와 동일 |
| 로컬 모델(sd.cpp) 생성 | ❌ | 로컬 추론은 **데스크톱 앱 전용** (웹/헤드리스에서는 불가) |

생성된 결과물 경로: **없음** (생성 단계 미수행)

## 3. 사용자 PC에서 이어서 할 일 (순서대로)

1. 릴리스 페이지에서 내 OS용 설치본 받기 — https://github.com/Anil-matcha/Open-Generative-AI/releases
   - 맥 M 시리즈: `...-arm64.dmg` / 맥 인텔: `arm64` 없는 `.dmg`
   - 윈도우: `...Setup...exe` / 우분투: `.deb` 권장, `.AppImage`는 대안
2. 첫 실행 차단 해제
   - 맥: `xattr -cr "/Applications/Open Generative AI.app"` → 우클릭 → 열기
   - 윈도우: SmartScreen에서 **추가 정보 → 실행**
   - 우분투 24.04에서 `.AppImage`가 조용히 죽으면 → **`.deb`로 설치** (아래 4절 참고)
3. 앱에서 무료 계정 로그인
4. Image Studio에서 이미지 1장 → Video Studio에서 그 이미지를 시작 프레임으로 짧은 영상 1개
5. 자동화까지 쓸 경우: `muapi auth configure` 로 키 저장 후 `muapi auth status`로 확인

> 설치 없이 먼저 써 보려면 https://muapi.ai/open-generative-ai (웹 버전, 로컬 추론만 빠짐)

## 4. 원문 가이드에서 고치면 좋은 점 (실제 확인 결과)

1. **`muapi image models`는 키 검증이 아님.** 키를 저장하지 않은 상태에서도 모델 목록이
   정상 출력됩니다(위 표 참조). 키가 저장됐는지 확인하려면 **`muapi auth status`**를 쓰고,
   `API key: not set`이 아니어야 합니다. "아무것도 안 나오면 키 저장 단계로 돌아가세요"는
   실제 동작과 맞지 않습니다.
2. **스킬은 전역이 아니라 "명령을 실행한 폴더"에 깔립니다.** `npx skills add ...`는
   `./.agents/skills/` 아래에 설치하고 `./.claude/skills/`에 심볼릭 링크를 겁니다.
   따라서 **작업할 프로젝트 폴더로 이동한 뒤** 실행해야 클로드 코드가 인식합니다.
3. **우분투 24.04 항목 보강 필요.** `.AppImage` 실패 원인은 `libfuse2` 외에
   `apparmor_restrict_unprivileged_userns`(24.04부터 기본 활성) 문제가 더 흔합니다.
   공식 권장 해법은 `.deb` 설치(AppArmor 프로파일 동봉)입니다.
4. **버전 표기.** 저장소 최신 태그는 `v2.0.0`(package.json도 2.0.0)인데
   README의 다운로드 링크는 아직 `v1.0.9`를 가리킵니다. 가이드처럼 "릴리스 페이지에서
   가장 위 최신 버전"을 고르라고 안내하는 쪽이 안전합니다.
5. **Cinema Studio 수치는 정확합니다.** 소스 확인 결과 초점 거리는 8·14·24·35·50·85mm
   (기본값 35mm), 조리개는 f/1.4(얕은 심도)·f/4(균형)·f/11(전후 선명) 세 종류로
   가이드 설명과 일치합니다.
6. **로컬 영상 생성 주의.** Wan2GP 서버를 연결해도 현재 영상 모델은 Video Studio에
   완전히 연결돼 있지 않습니다(공식 README 기준 로드맵 단계). 로컬은 이미지 위주로 쓰는 게 안전합니다.

## 5. 참고한 공식 출처

- 공식 저장소: https://github.com/Anil-matcha/Open-Generative-AI (MIT)
- 웹 버전: https://muapi.ai/open-generative-ai
- CLI: https://www.npmjs.com/package/muapi-cli (0.2.7)
- 스킬 묶음: https://github.com/SamurAIGPT/Generative-Media-Skills
- 로컬 영상 서버: https://github.com/deepbeepmeep/Wan2GP
