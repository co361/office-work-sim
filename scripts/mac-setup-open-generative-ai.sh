#!/bin/bash
# Open Generative AI - 맥(Apple Silicon) 자동 설치 스크립트
#
# 하는 일
#   1) 맥 환경 점검 (macOS / Apple Silicon / Node.js / npm)
#   2) 공식 GitHub 릴리스에서 arm64 .dmg 내려받기
#   3) /Applications 에 설치하고 Gatekeeper 차단 표시 해제
#   4) muapi CLI 설치 및 동작 확인
#   5) (선택) Generative Media Skills 를 지정한 폴더에 설치
#
# 안 하는 일 (직접 해야 함)
#   - 계정 로그인, API 키 저장 (키는 이 스크립트가 절대 다루지 않음)
#   - 로컬 모델 가중치 내려받기 (앱 안에서 Settings > Local Models 로 진행)
#
# 사용법
#   bash mac-setup-open-generative-ai.sh                    # 대화형
#   bash mac-setup-open-generative-ai.sh --skills-dir ~/ai  # 스킬 설치 폴더 지정
#   bash mac-setup-open-generative-ai.sh --no-skills        # 스킬 설치 건너뜀
#   bash mac-setup-open-generative-ai.sh --yes              # 확인 질문 없이 진행

set -u -o pipefail

REPO="Anil-matcha/Open-Generative-AI"
APP_NAME="Open Generative AI.app"
APP_PATH="/Applications/${APP_NAME}"
DOWNLOAD_DIR="${HOME}/Downloads"
FALLBACK_DMG="https://github.com/${REPO}/releases/download/v1.0.9/Open.Generative.AI-1.0.9-arm64.dmg"

SKILLS_DIR=""
INSTALL_SKILLS="ask"
ASSUME_YES="no"

while [ $# -gt 0 ]; do
  case "$1" in
    --skills-dir) SKILLS_DIR="${2:-}"; INSTALL_SKILLS="yes"; shift 2 ;;
    --no-skills)  INSTALL_SKILLS="no"; shift ;;
    --yes|-y)     ASSUME_YES="yes"; shift ;;
    -h|--help)    sed -n '2,25p' "$0"; exit 0 ;;
    *) echo "알 수 없는 옵션: $1"; exit 1 ;;
  esac
done

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$*"; }
step() { printf '\n\033[1m[%s] %s\033[0m\n' "$1" "$2"; }

ask() {  # ask "질문" -> 0 이면 예
  [ "$ASSUME_YES" = "yes" ] && return 0
  local reply
  printf '  %s [y/N] ' "$1"
  read -r reply </dev/tty || return 1
  case "$reply" in y|Y|yes|YES|ㅛ) return 0 ;; *) return 1 ;; esac
}

FAILED=0
note_fail() { FAILED=$((FAILED+1)); fail "$1"; }

bold "Open Generative AI 맥 설치 스크립트"

# ---------------------------------------------------------------- 1. 환경 점검
step 1 "환경 점검"

if [ "$(uname -s)" != "Darwin" ]; then
  fail "이 스크립트는 macOS 전용입니다 (현재: $(uname -s))"
  exit 1
fi
ok "macOS $(sw_vers -productVersion)"

ARCH="$(uname -m)"
if [ "$ARCH" = "arm64" ]; then
  ok "Apple Silicon (${ARCH}) — arm64 설치본을 받습니다"
  WANT_ARM64=1
else
  warn "인텔 맥 (${ARCH}) — arm64가 아닌 설치본을 받습니다"
  WANT_ARM64=0
fi

MEM_BYTES="$(sysctl -n hw.memsize 2>/dev/null || echo 0)"
MEM_GB=$(( MEM_BYTES / 1024 / 1024 / 1024 ))
if [ "$MEM_GB" -gt 0 ]; then
  if [ "$MEM_GB" -ge 16 ]; then
    ok "메모리 ${MEM_GB}GB — 로컬 이미지 모델 전부 사용 가능"
  else
    warn "메모리 ${MEM_GB}GB — 로컬 모델은 SD 1.5 계열(Dreamshaper 8 등)만 쓰세요. Z-Image는 시스템이 멈출 수 있습니다"
  fi
fi

AVAIL_GB="$(df -g / | awk 'NR==2 {print $4}')"
if [ -n "${AVAIL_GB:-}" ] && [ "$AVAIL_GB" -lt 3 ]; then
  note_fail "디스크 여유 공간 ${AVAIL_GB}GB — 최소 3GB 이상 확보해 주세요"
else
  ok "디스크 여유 공간 ${AVAIL_GB:-?}GB"
fi

if command -v node >/dev/null 2>&1; then
  ok "Node.js $(node --version)"
  HAS_NODE=1
else
  warn "Node.js 없음 — CLI/자동화 단계는 건너뜁니다. https://nodejs.org 에서 LTS 설치 후 다시 실행하세요"
  HAS_NODE=0
fi

if [ "$HAS_NODE" = "1" ] && command -v npm >/dev/null 2>&1; then
  ok "npm $(npm --version)"
  HAS_NPM=1
else
  HAS_NPM=0
fi

# ------------------------------------------------------- 2. 설치본 내려받기
step 2 "공식 릴리스에서 설치본 내려받기"

if [ -d "$APP_PATH" ]; then
  warn "이미 설치되어 있습니다: ${APP_PATH}"
  if ask "덮어쓰고 최신 버전으로 다시 설치할까요? (아니오를 고르면 설치를 건너뜁니다)"; then
    REINSTALL=1
  else
    REINSTALL=0
    ok "기존 앱을 그대로 둡니다"
  fi
else
  REINSTALL=1
fi

DMG_PATH=""
if [ "$REINSTALL" = "1" ]; then
  echo "  최신 릴리스 정보를 확인하는 중..."
  API_JSON="$(curl -fsSL --max-time 30 "https://api.github.com/repos/${REPO}/releases/latest" 2>/dev/null || echo "")"

  DMG_URL=""
  if [ -n "$API_JSON" ]; then
    if [ "$WANT_ARM64" = "1" ]; then
      DMG_URL="$(printf '%s' "$API_JSON" | grep -o '"browser_download_url": *"[^"]*arm64\.dmg"' | head -1 | sed 's/.*"\(https[^"]*\)"/\1/')"
    else
      DMG_URL="$(printf '%s' "$API_JSON" | grep -o '"browser_download_url": *"[^"]*\.dmg"' | grep -v arm64 | head -1 | sed 's/.*"\(https[^"]*\)"/\1/')"
    fi
  fi

  if [ -z "$DMG_URL" ]; then
    warn "최신 릴리스에서 맞는 .dmg를 못 찾았습니다 — 확인된 버전(v1.0.9)으로 대체합니다"
    [ "$WANT_ARM64" = "1" ] && DMG_URL="$FALLBACK_DMG" \
      || DMG_URL="https://github.com/${REPO}/releases/download/v1.0.9/Open.Generative.AI-1.0.9.dmg"
  fi

  case "$DMG_URL" in
    https://github.com/${REPO}/releases/download/*) : ;;
    https://objects.githubusercontent.com/*) : ;;
    *) note_fail "공식 저장소 주소가 아니라 중단합니다: ${DMG_URL}"; DMG_URL="" ;;
  esac

  if [ -n "$DMG_URL" ]; then
    mkdir -p "$DOWNLOAD_DIR"
    DMG_PATH="${DOWNLOAD_DIR}/$(basename "$DMG_URL")"
    ok "받을 파일: $(basename "$DMG_URL")"
    if curl -fL --progress-bar --max-time 1800 -o "${DMG_PATH}.part" "$DMG_URL"; then
      mv "${DMG_PATH}.part" "$DMG_PATH"
      ok "저장 완료: ${DMG_PATH} ($(du -h "$DMG_PATH" | cut -f1))"
      echo "  SHA-256: $(shasum -a 256 "$DMG_PATH" | cut -d' ' -f1)"
    else
      rm -f "${DMG_PATH}.part"
      note_fail "내려받기 실패 — 네트워크를 확인하고 다시 실행하세요"
      DMG_PATH=""
    fi
  fi
fi

# ------------------------------------------------------------- 3. 앱 설치
step 3 "앱 설치와 첫 실행 차단 해제"

if [ -n "$DMG_PATH" ] && [ -f "$DMG_PATH" ]; then
  MOUNT_POINT="$(mktemp -d /tmp/ogai-mount.XXXXXX)"
  if hdiutil attach "$DMG_PATH" -nobrowse -quiet -mountpoint "$MOUNT_POINT"; then
    SRC_APP="$(find "$MOUNT_POINT" -maxdepth 1 -name '*.app' -print -quit)"
    if [ -n "$SRC_APP" ]; then
      [ -d "$APP_PATH" ] && rm -rf "$APP_PATH"
      if cp -R "$SRC_APP" /Applications/ 2>/dev/null || sudo cp -R "$SRC_APP" /Applications/; then
        ok "설치 완료: ${APP_PATH}"
      else
        note_fail "/Applications 복사 실패 — DMG를 직접 열어 끌어다 놓으세요"
      fi
    else
      note_fail "DMG 안에서 앱을 못 찾았습니다"
    fi
    hdiutil detach "$MOUNT_POINT" -quiet || true
  else
    note_fail "DMG 마운트 실패 — 파일이 손상됐을 수 있으니 다시 받아 보세요"
  fi
  rmdir "$MOUNT_POINT" 2>/dev/null || true
fi

if [ -d "$APP_PATH" ]; then
  if xattr -cr "$APP_PATH" 2>/dev/null; then
    ok "Gatekeeper 차단 표시 해제 완료 (xattr -cr)"
  else
    warn "차단 해제 실패 — 시스템 설정 > 개인 정보 보호 및 보안에서 '확인 없이 열기'를 눌러 주세요"
  fi
  VER="$(defaults read "${APP_PATH}/Contents/Info" CFBundleShortVersionString 2>/dev/null || echo '확인 불가')"
  ok "설치된 앱 버전: ${VER}"
else
  note_fail "앱이 설치되지 않았습니다"
fi

# ------------------------------------------------------------ 4. muapi CLI
step 4 "muapi CLI 설치 (터미널 자동화용)"

if [ "$HAS_NPM" = "1" ]; then
  if command -v muapi >/dev/null 2>&1; then
    ok "이미 설치됨: $(muapi --version 2>/dev/null | head -1)"
  else
    echo "  설치 중... (1~2분 걸릴 수 있습니다)"
    if npm install -g muapi-cli >/dev/null 2>&1 || sudo npm install -g muapi-cli >/dev/null 2>&1; then
      ok "설치 완료: $(muapi --version 2>/dev/null | head -1)"
    else
      note_fail "muapi CLI 설치 실패 — 'sudo npm install -g muapi-cli' 를 직접 실행해 보세요"
    fi
  fi

  if command -v muapi >/dev/null 2>&1; then
    MODEL_COUNT="$(muapi image models </dev/null 2>/dev/null | grep -c '^│')"
    MODEL_COUNT="${MODEL_COUNT:-0}"
    if [ "$MODEL_COUNT" -gt 0 ]; then
      ok "모델 목록 조회 정상 (이미지 모델 ${MODEL_COUNT}개)"
    else
      warn "모델 목록이 비었습니다 — 네트워크를 확인하세요"
    fi
    KEY_LINE="$(muapi auth status </dev/null 2>/dev/null | grep -i 'API key' | head -1)"
    case "$KEY_LINE" in
      *"not set"*) warn "API 키 미설정 — 자동화를 쓸 거면 나중에 'muapi auth configure' 를 직접 실행하세요" ;;
      "")          warn "키 상태 확인 불가" ;;
      *)           ok "API 키 저장되어 있음" ;;
    esac
  fi
else
  warn "npm이 없어 건너뜁니다"
fi

# --------------------------------------------------------------- 5. 스킬
step 5 "AI 코딩 도구용 스킬 설치 (선택)"

if [ "$HAS_NPM" != "1" ]; then
  warn "npm이 없어 건너뜁니다"
elif [ "$INSTALL_SKILLS" = "no" ]; then
  ok "건너뜁니다 (--no-skills)"
else
  if [ -z "$SKILLS_DIR" ]; then
    echo "  스킬은 '명령을 실행한 폴더'에 설치됩니다. 작업 폴더를 정해 주세요."
    printf '  설치할 폴더 (엔터 = %s/ai-media): ' "$HOME"
    read -r SKILLS_DIR </dev/tty || SKILLS_DIR=""
    [ -z "$SKILLS_DIR" ] && SKILLS_DIR="${HOME}/ai-media"
  fi
  SKILLS_DIR="${SKILLS_DIR/#\~/$HOME}"
  mkdir -p "$SKILLS_DIR"
  if ( cd "$SKILLS_DIR" && npx --yes skills@latest add SamurAIGPT/Generative-Media-Skills --all </dev/null ); then
    COUNT="$(ls "${SKILLS_DIR}/.agents/skills" 2>/dev/null | wc -l | tr -d ' ')"
    ok "스킬 ${COUNT}개 설치 완료: ${SKILLS_DIR}/.agents/skills"
    ok "클로드 코드는 이 폴더에서 실행해야 스킬을 인식합니다: cd ${SKILLS_DIR}"
  else
    note_fail "스킬 설치 실패 — ${SKILLS_DIR} 에서 'npx skills add SamurAIGPT/Generative-Media-Skills --all' 를 직접 실행해 보세요"
  fi
fi

# --------------------------------------------------------------- 마무리
step 6 "결과"

if [ "$FAILED" -eq 0 ]; then
  bold "자동 설치 단계는 모두 통과했습니다."
else
  bold "실패한 항목이 ${FAILED}개 있습니다. 위의 ✗ 표시를 확인하세요."
fi

cat <<'NEXT'

  아직 직접 하셔야 하는 것 (자동화 불가)
    1. 앱 열기          open -a "Open Generative AI"
                        처음 열 때 경고가 뜨면 앱 우클릭 > 열기
    2. 무료 계정 로그인  로그인해야 클라우드 모델 목록이 열립니다
    3. 첫 이미지 생성    Image Studio 에서 문장 넣고 생성
    4. 첫 영상 생성      Video Studio 에서 그 이미지를 시작 프레임으로
    5. 로컬 모델 (선택)  Settings > Local Models 에서 엔진 설치 후 모델 받기
                        - 이미지: 맥에서 Metal GPU 로 동작, 크레딧 0원
                        - 영상: 맥 로컬 불가 (CUDA 전용) → 클라우드 사용
    6. 자동화 (선택)     muapi auth configure   (키는 본인이 직접 입력)

NEXT
exit 0
