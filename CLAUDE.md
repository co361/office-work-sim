# office-work-sim (WORK SIM)

교육용 사무 업무 시뮬레이터. 브라우저 단일 파일 앱 — 3D 사무실(Three.js r128 + GLB) 안에서 하루(9~18시) 동안 도착하는 메일·메신저·결재를 처리하고, 끝나면 역량 리포트를 받는다. 강사는 세션 코드(`W`+5자)로 학생을 묶어 실시간 모니터링. 운영사 edmakers.kr. **모든 대화·문서·커밋 메시지는 한국어.**

## 파일
| 파일 | 역할 |
|---|---|
| `index.html` (~7,900줄) | 학생 앱 전체 — 콘텐츠·3D·채점·리포트가 한 파일 |
| `teacher.html` | 강사 대시보드 (세션 생성·모니터링·디브리핑) |
| `admin.html` | 관리자 |
| `assets/*.glb` | 3D 모델·애니메이션 (41MB, 미압축 — 최적화 과제 별도) |
| `docs/` | 기획·레퍼런스 (아래) |

## index.html 구조 앵커 (grep 으로 찾을 것, 줄번호는 변동)
- `const RANKS` 직급 3트랙(jr/mid/mgr) + 리포트 가중치 `weights` + AI 코멘트 프롬프트 `focus`
- `function rankItems(rank)` 직급별 아이템 / `function commonItems()` 공통 / `const DEPTS` 부서 4개(mgmt·hr·ga·cs) 각 `handover`(인수인계서)·`items`
- `const CULTURES` 조직문화 v(수직)/h(수평) — 채점 톤 분기
- **아이템 스키마**: `{id,type:'email'|'msg'|'approval',time,from,role,urgent,importance,best,deadline,subj,body,grade,act:{reply|hold|delegate|reject|confirm|accept:[점수,코멘트]}}` + 선택 `needsSentEmail,delegateTo,noPenalty,factCheck,slot`
  - `grade` = AI 첨삭 루브릭(서버 `api()` 호출로 LLM 채점 → `emailScore`)
  - `act[x][0]` = 행동 선택 점수 → `G.actionLogs` → 리포트 `judge` 등
- `const ATTACHDEFS` 첨부(HTML 문서 / `kind:'sheet'` 자동채점 시트) · `const WORKDEFS` 작업형(form/sheet/audit) · `DESK_START` 바탕화면 초기 파일
- `const QUESTDEFS` 3D 퀘스트(`station` 키: copier·cabinet·shelf·island·door·plant·pantry·meet·mailrack·boss, `choices` graded → judge)
- `function handleAction / commitAction` 액션 처리 · `function buildReport()` 리포트 6축 계산(time·judge·comm·deleg·info·press) · `drawRadar`
- 세계관 고정값: 첫날 2026-07-07(화) · 경영지원팀 · 사수 박선임 · 팀장 김팀장(mgr 트랙은 `mgrify()`가 오부장으로 치환) · 동료 이주임·김대리 · 전임자 최OO(퇴사) · 이전 사옥 구로 · 거래처 (주)한빛문구 유대리

## 현재 작업: 직업공통능력(NCS 2025.12 개편) 보강
2025.12 직업기초능력 → **직업공통능력 7영역·21하위**로 개편. 신설: AI활용·디지털책임의식·산업안전보건의식·적응학습·디지털활용·직장공동체의식. worksim 역량 라벨·태깅·리포트를 신 체계로 정렬하고 신설 영역 콘텐츠를 추가하는 중.

**읽는 순서**
1. `docs/worksim-ncs-additions.md` — 인수 문서. §6 작업 순서 13단계, §8 결정 사항, §9 측정 표준
2. `docs/ncs-new-items.js` — 붙여넣기용 신규 아이템 14·퀘스트 3·첨부 5·기존 태깅표·리포트 패치. **`node docs/ncs-new-items.js` 로 자기검사** (수정 후에도 항상 실행)
3. `docs/ncs-competencies.json` — 21/34 하위능력 코드 (태깅 기준)
4. `docs/ncs-reference.md` — 체계·평가방식·향상방법 레퍼런스. `[검증필요]` 표시는 ncs.go.kr 표준 PDF 대조 후 확정

**미결 (co님 결정 대기)** — `worksim-ncs-additions.md §8`: ① Day 2 시나리오 vs 선별 삽입 vs 토글 (권장 Day 2) ② 채점 4단계화 시점 ③ 민감 소재 톤 ④ Day 2 핸드오버 개인화 ⑤ 공개 문항 수집 범위. 결정 전엔 §6 단계 1~3(가중치·태깅·첨부)까지만 진행 가능.

## 규칙
- 콘텐츠 추가 시 `ncs`(신 코드, [0]=주역량)·`ncsOld`·`indicator`(행동지표 1문장) 필수. `best` 는 `act` 최고점이어야 함
- 첨부 문서 하단의 정답 근거 주석(`att-meta` "※ 검산/대조")은 **플레이어에게 보이면 안 됨** — `grade` 로 옮기고 삭제
- `assets/` 는 이 작업에서 건드리지 않음 (3D 최적화는 별건: gltf-transform 감축·압축, 목표 41MB→5MB)
- 브랜치 `claude/unity-local-setup-aw5aye` 에서 작업, 작은 단위로 커밋
- 공개 NCS 문항 재구성 시 공공누리 유형 확인, 기출 복원본 사용 금지, 세계관으로 치환한 재구성본만 삽입
