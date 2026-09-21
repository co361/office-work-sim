# worksim 직업공통능력 보강 — 인수 문서 (로컬 작업용)

> 2026-09-21 작성. 기준: `docs/ncs-reference.md`(체계·평가·검증), `docs/ncs-competencies.json`(코드), **`docs/ncs-new-items.js`(붙여넣기용 콘텐츠 + 자기검사)**.
> 로컬 세션 첫 명령: `node docs/ncs-new-items.js` → `✓ 검사 통과` 확인 후 §6 작업 순서대로.

---

## 0. 무엇을 왜

2025.12 개편으로 **신설**된 하위능력(AI활용 · 디지털책임의식 · 산업안전보건의식 · 적응학습 · 디지털활용 · 직장공동체의식)과 worksim이 **측정하지 않던** 하위능력(대안발굴 · 수리 · 외국어)을 채운다. 기존 5액션 체계(`reply/hold/delegate/reject/confirm`)·AI 루브릭(`grade`)·첨부·3D 퀘스트 구조를 그대로 쓰고, 리포트는 6축 → **7축(디지털능력 추가)** 최소 변경.

---

## 1. 추가 콘텐츠 한눈에

| 하위능력 | id | 유형 | 트랙 | 시각 | 최적 | 핵심 장치 |
|---|---|---|---|---|---|---|
| **6-2 AI활용** | `ai_draft` | email+첨부 | jr·mid | 10.9 | reply | AI 초안에 오류 3개(할인율·담당자·주소) 심어 검수 |
| | `ai_rule` | email+첨부 | mid·mgr | 14.6 | reply | AI 규정 요약 오류 3개(회수 규정·연차 기한·없는 조항) |
| | `ai_tool` | approval | mgr | 12.4 | reply | AI 구독 결재 — 한도 초과 + 보안·데이터 조건부 |
| **6-3 디지털책임** | `ai_leak` | msg | all | 13.1 | reply | 고객 명단 외부 AI 업로드 제지 + 대안 |
| | `dr_attach` | email+첨부 | jr·mid | 11.2 | reply | 명단에서 불필요 개인정보 제거 후 전달 |
| | `dr_capture` | msg | jr | 15.2 | reject | 사내 대화 캡처 단톡 공유 거절 |
| | `dr_phish` | email | all | 9.6 | confirm | 피싱 메일 — 도메인 식별·신고 |
| | `q_usb` | 3D 퀘스트 | all | 11.0 | 선택지 | 택배 데스크 낯선 USB |
| | `q_ai_record` | 3D 퀘스트 | all | 13.8 | 선택지 | 회의 개인폰 AI 녹음 — 동의·승인 도구 |
| **4-2 적응학습** | `al_newsys` | msg+첨부 | all | 9.4 | hold | 새 결재 시스템 매뉴얼(회신 불필요, attachRead 측정) |
| | `al_ask` | msg | all | 14.9 | reply | 매뉴얼에서만 답 나오는 동료 질문(`factCheck`) |
| **7-2 직장공동체** | `cm_joke` | msg | jr·mid | 13.6 | reply | 단톡 외모 농담 — 동조 않고 흐름 끊기 |
| | `cm_intern` | email | mgr | 14.2 | reply | 인턴 사적 심부름 — 보호 + 면담 |
| **3-2 대안발굴** | `alt_room` | email(문서) | mid·mgr | 12.2 | reply | 대안 2개+장단점+추천(오전 회의 결정과 연결) |
| **2-1/2-3 수리** | `num_quote` | approval+첨부 | mid·mgr | 13.4 | reject | 비교표 전치 오류 + VAT 누락 → 최저가 뒤집힘 |
| **1-3 외국어** | `fl_email` | email | jr·mid | 11.5 | reply | 영문 확인 메일 3항목(납기·수량·담당자) |
| **7-3 산업안전** | `q_cable` | 3D 퀘스트 | all | 15.4 | 선택지 | 탕비실 멀티탭 과부하·물기·변색 |
| | `c_security` (기존) | — | — | — | accept | 15시 안전교육 → 7-3 태깅 |

첨부 5개: `ai_draft_doc` `ai_rule_doc` `dr_roster` `al_manual` `num_compare` (모두 오류/정답 근거를 `att-meta` 주석으로 하단에 명시 — **플레이어에게 보이면 안 되므로 로컬에서 그 줄은 `grade`로 옮기고 첨부에서 삭제**).

### 1-1. 하루 부하 문제 — 결정 필요
신규를 전부 넣으면 jr 트랙은 **기존 ~13건 + 신규 9건 + 퀘스트 3개**가 된다. 하루 시뮬(9~18시)에 과밀. 선택지:

- **A. Day 2 시나리오 (권장)** — "둘째 날: 디지털·AI의 날". 같은 사무실·같은 인물, 신규 아이템 중심 + 기존 공통 아이템 일부 재사용. 콘텐츠 수명이 2배가 되고, 대학에 "2회차 과정"으로 팔 수 있으며, **1일차↔2일차 비교가 곧 사전·사후 데이터**가 된다. 구현: `G.day=2`, `rankItems(rank, day)`, DEPTS 핸드오버는 "어제 내가 쓴 업무 일지"로 치환.
- **B. 트랙별 선별 삽입** — 트랙당 4~5개만: jr `ai_draft dr_attach dr_phish al_newsys+al_ask cm_joke`, mid `ai_rule ai_leak num_quote alt_room fl_email`, mgr `ai_tool ai_rule cm_intern num_quote alt_room`. 나머지는 옵션 풀.
- **C. 모드 토글** — 강사가 세션 생성 시 "NCS 확장" 체크 → 신규 세트 활성. teacher.html 세션 설정에 플래그 1개.

A를 권한다. B는 빠르지만 기존 밸런스를 흔들고, C는 A의 부분집합이다.

---

## 2. 데이터 모델 변경

### 2-1. 아이템 공통 필드 (신규·기존 전부)
```js
ncs:      ['6-2','1-1'],   // 직업공통능력 하위능력. [0] = 주(主) 역량
ncsOld:   ['정보처리','문서작성'], // 구 직업기초능력. 공기업 필기 대응, 1년 병기
indicator:'AI가 만든 초안을 사실과 대조해 오류를 고친 뒤 발송했다', // 행동지표 — 최적 행동의 근거 1문장
```
- `indicator`는 **피드백 토스트**(`commitAction` 후)와 **강사 화면 아이템 상세**에 노출. 학습자가 "무엇을 했어야 했는지"를 행동 문장으로 본다 (NCS 면접 행동지표와 같은 문법).
- 기존 아이템 태깅은 `NCS_TAGS` 참조. `todo:true` 32개는 내용 보고 확정.

### 2-2. 퀘스트(`QUESTDEFS`)에도 `ncs/ncsOld/indicator` 추가. `completeQuest` 의 graded 분기는 이미 `G.actionLogs`에 넣으므로 집계는 자동.

### 2-3. 채점 4단계화 (선택, 2차)
현재 `act.reply:[100,'…']` 단일 점수. 필기형 SJT와 맞추려면 선지 등급을 명시:
```js
act:{ reply:[100,'…', 'best'], confirm:[45,'…','acceptable'], hold:[20,'…','poor'], reject:[5,'','harmful'] }
```
세 번째 요소는 강사 화면 색상·리포트 "치명적 선택 n회" 집계용. 점수 로직은 불변이라 하위호환.

### 2-4. 리포트 7축 + 하위능력 집계
`NCS_REPORT_PATCH` 참조:
- `RANKS[*].weights.digital` 추가 (jr 1.0 / mid 1.1 / mgr 1.0)
- `buildReport()`의 `skills` 배열에 `digitalFormula` 삽입, `WKEY`에 `'digital'`
- `drawRadar` 는 축 수를 `skills.length`로 이미 받는지 확인(고정 6이면 수정)
- `ncsBreakdown(logs, arrived)` → `G.reportData.ncsBreakdown = {'6-2':{n,score},…}` 저장 → 강사 화면·export
- 라벨 교체(`labels`) + 등급 옆 KRIVET 수준 병기(`levelOf`)
- `RANKS[*].focus`(AI 종합 코멘트 프롬프트)에 한 줄 추가: `"디지털·AI 활용은 '결과 검증'과 '올리면 안 되는 정보'를 기준으로 평가"`

### 2-5. 강사 화면(`teacher.html`) / 관리자(`admin.html`)
- 학생 행에 **하위능력 열** (7영역 접기/펼치기, 21코드 점수·표본수)
- **CSV export**: `학생, 직급, 부서, 문화, 총점, 등급, 수준, time…digital(7축), 1-1…7-3(21코드), 처리/도착 건수, 치명적 선택 수` — 대학 사전·사후 t검정용
- 아이템 상세에 `indicator` + `ncs` 배지
- 세션 생성 옵션: Day 1 / Day 2 (§1-1 A 채택 시)

---

## 3. 세계관·시간표 정합성 체크

신규 시각은 기존과 충돌 없음(기존: 9.2 coach · 9.9 mgr_rev · 10.4 ps1 · 10.5 q_printer · 11.3 mgr_appr · 11.7 jr_minutes · 11.9 mgr_deleg · 12.7 ps2 · 13.2 mgr_rev2 · 14.0 mgr_perf/q_tea · 14.3 jr_fix · 15.7 mgr_esc). 단 Day 1에 전부 넣을 경우 **13.1~13.8 사이 4건**(ai_leak·num_quote·cm_joke·q_ai_record) 밀집 — B안이면 시각 재배치.

고정값 확인 목록 (로컬에서 `DEPTS.*.handover` 원문과 대조):
- [ ] 현 사옥 주소 표기 — `ai_draft` 본문 "서울 강남구 테헤란로" ↔ 인수인계서 상단 실제 표기로 맞출 것
- [ ] 법인카드 개인 사용분 **전액 회수** — `ai_rule` 정답 근거. `m2`(법인카드 명세 시트) 규정과 동일해야 함
- [ ] 연차 **3영업일 전** 신청 — 규정집·핸드오버에 없다면 `DESK_START` 규정 파일 또는 핸드오버에 한 줄 추가
- [ ] `fl_email` 의 PO #KS-2607 / 7월 21일 납기 / 120개 / 추가 10개 미발주 — 핸드오버에 "해외 거래처 Kyoto Supply" 항목 추가 필요 (현재 없음)
- [ ] 정인턴(`cm_intern`) — 기존 인물표에 없음. mgr 트랙 `rankRoster()`에 추가하거나 3D 배치 없이 메일 인물로만 존재
- [ ] `alt_room` 현황 수치(세미나실 A12/B6, 노쇼 9건, 분쟁 4건)는 `jr_minutes` 회의록 논의 ②와 일치
- [ ] mgr 트랙 `mgrify()` 치환 확인: 신규 본문의 "김팀장"→"오부장", "신입님"→"팀장님" 이 자연스러운지 (`ai_rule`, `alt_room` 발신자가 김팀장)

---

## 4. 공개 NCS 문항 수집 → worksim 변환

### 4-1. 수집 대상 (모두 공식·공개. 로컬에서 접근)
| 출처 | 내용 | 라이선스 확인 |
|---|---|---|
| [NCS 공정채용 필기 예시문항](https://ncs.go.kr/blind/blp/bbs_lib_list.do?libDstinCd=55) | 10영역 예시문항 PDF | 공공누리 유형 표기 확인 후 사용 |
| [2021 직업기초능력 필기평가 예시 문항집](https://ncs.go.kr/blind/rh13/bbs_lib_view.do?libDstinCd=48&libSeq=20220114102003035) · [2022 문항집](https://www.ncs.go.kr/blind/rh13/bbs_lib_view.do?libDstinCd=48&libSeq=20221230135757140) | 영역별 다수 문항 + 해설 | 동일 |
| [면접문항 예시](https://www.ncs.go.kr/blind/blp/bbs_lib_list.do?libDstinCd=56) | 경험·상황·발표·토론 예시 + 평가요소 | 동일 |
| [직업기초능력 가이드북 학습자용/교수자용](https://www.ncs.go.kr/th03/TH0302List.do?dirSeq=121) | 모듈별 사례·활동·체크리스트 | 동일 |
| [공공데이터포털 — 직업기초능력 영역별 학습자료](https://www.data.go.kr/data/15077168/fileData.do) | 위 가이드북 원본 파일 | 포털 표기 라이선스 |
| [TEENUP 직업공통능력 인증 예시](https://www.teenup.or.kr/examguide/examguide-03-00.do) | 직업계고용 5영역 예시 | 대한상의 저작권 — 형식 참고만 |
| [직업공통능력 표준 최종 PDF](https://www.ncs.go.kr/web/job/contents/%ED%95%9C%EA%B5%AD%EC%82%B0%EC%97%85%EC%9D%B8%EB%A0%A5%EA%B3%B5%EB%8B%A8_%EC%A7%81%EC%97%85%EA%B8%B0%EC%B4%88%EB%8A%A5%EB%A0%A5%20%ED%91%9C%EC%A4%80_%EC%B5%9C%EC%A2%85.pdf) | 21하위 공식 정의·수행준거 | `ncs-reference.md §1` 확정용 |

**사용 규칙**
- 산업인력공단 자료는 파일별 **공공누리 유형**을 확인한다. 제1유형(출처표시)이면 변형·상업 이용 가능, 제3·4유형이면 변경 금지 → **소재·구조만 참고하고 문장은 새로 쓴다**.
- 학원·커뮤니티의 "기출 복원" 문항은 저작권 불명 → **수집 대상에서 제외**. 기관별 실제 기출도 비공개가 원칙.
- 어떤 경우에도 worksim에는 **재구성본**만 들어간다(세계관 인물·회사로 치환). 원문 인용은 강사용 참고 자료에만.

### 4-2. 수집 파이프라인 (로컬)
```
1. PDF 다운로드 → pdftotext -layout → 문항 단위 분할(정규식: "^\d+\.\s" / "【문항" / "다음 …" 시작)
2. 문항 JSON 스키마로 정리:
   { src:{file,page,license}, area:'문제해결능력', sub:'문제처리', ncs:['3-3'], kind:'sjt|module|data|doc|interview',
     stem:'…', materials:['…'], options:['…'], answer:2, rationale:'…' }
3. kind 별 변환 규칙(§4-3)으로 worksim 객체 생성 → docs/ncs-imported-items.js
4. 세계관 치환 + grade 루브릭 작성 + act 점수 부여 (사람 검토)
5. node 자기검사(ncs-new-items.js 의 F절 재사용) → 삽입
```

### 4-3. 변환 규칙 — 문항 유형 → worksim 형태
| NCS 문항 유형 | worksim 형태 | 매핑 |
|---|---|---|
| **상황판단(SJT)** "가장 적절한 행동은?" | `item` (email/msg) 또는 선지가 **행동형**이면 `QUESTDEFS.choices` | 상황 지문→`body`, 조건 자료→`ATTACHDEFS`, 선지→`act` 5액션 중 가장 가까운 것 or `choices`, 정답→`best`, 해설→`act[*][1]` 코멘트, 평가 의도→`grade` |
| **문서이해** (지문 읽고 옳은 것) | `item` + 첨부 + `factCheck` | 지문→첨부 문서, 질문→동료의 메신저 질문, 정답 키워드→`factCheck:[…]` |
| **문서작성** (공문·보고서 요건) | `item` reply + `grade` 루브릭 | 요건 목록→`grade` 채점 축, 발신자 지시→`body` |
| **자료해석/도표** (표 읽고 계산) | `approval` + 첨부 표 (`num_quote` 패턴) 또는 `WORKDEFS kind:'sheet'` autoGrade | 표→`att-tbl`, 계산 오류를 의도적으로 심음, 정답→`reject`/`reply` |
| **모듈형 지식** (개념·절차) | `coach_*` 안내 메시지(`hold`, `noPenalty`) **+ 후속 적용 문항** | 지식은 읽기 자료로, 측정은 적용 문항에서 (al_newsys→al_ask 패턴) |
| **면접 상황문항** | `item` reply (서술) + `grade` 에 행동지표 | 평가요소→`indicator`, 우수/보통/미흡 기준→`grade` 배점 |
| **면접 경험문항(STAR)** | 리포트 후단 "오늘 경험을 STAR로 정리" 서술 칸(신규 UI) | 처리 로그를 S/T/A/R 초안으로 자동 채움 → 학생이 다듬기 → AI 첨삭 |
| **토론면접** | coworksim 영역 — worksim 범위 밖 | — |

### 4-4. 변환 예시 (형식 예시 — 공식 문항 원문이 아님)
**원형(SJT, 문제해결·조직이해)**: "귀하는 총무팀 신입이다. 팀장이 급히 지시한 비품 구매 건이 규정상 상위 결재가 필요한 금액임을 발견했다. 팀장은 외근 중이며 오늘 중 발주해야 한다. 가장 적절한 행동은? ① 팀장 지시이므로 그대로 발주 ② 팀장에게 연락해 상위 결재 필요를 알리고 지시를 받는다 ③ 규정대로 상위 결재를 직접 상신한다 ④ 내일로 미룬다"

**worksim 변환**:
```js
{ id:'imp_limit', type:'msg', time:15.1, from:'김팀장', role:'우리 팀 팀장 (외근 중)', urgent:5, importance:4, best:'confirm', deadline:16.5,
  ncs:['3-3','7-1','4-3'], ncsOld:['문제처리','근로윤리','시간관리'],
  indicator:'지시와 규정이 충돌할 때 지시자에게 사실을 알리고 결정을 받았다',
  subj:'외근 중인데 급해요 — 회의용 모니터 2대 오늘 발주 부탁', body:`…(총액 720,000원 — 팀장 전결 500,000원 초과)…`,
  act:{ confirm:[100,'한도 초과 사실을 알리고 지시를 받은 것이 정답. 지시자는 상황을 모를 수 있어요.'],
        reply:[35,'그대로 발주하면 규정 위반이 내 이름으로 남아요.'],
        delegate:[55,'상위 결재를 직접 올린 건 규정엔 맞지만, 지시자를 건너뛴 셈이에요.'],
        hold:[15,'오늘 중 발주 건이에요.'], reject:[20,''] },
  grade:'(confirm 시 메시지 작성) 한도 초과 사실 + 필요한 조치(상위 결재) + 시간 제약을 간결히 보고했는가.' }
```
원형의 선지 ③은 5액션에 정확히 대응하지 않아 `delegate`(상위로 넘김)에 55점으로 매핑 — 이런 **비대응 선지는 `choices` 형 퀘스트로 만드는 편이 정확**하다.

---

## 5. 리포트·피드백 문구 — 신 체계 반영
- 요약 문구(`rpSummary`) 조건 분기에 디지털 축 추가: `digital<50 → "AI·디지털 도구를 쓸 때 '검증'과 '올리면 안 되는 정보' 기준을 먼저 세워 보세요."`
- "다음에 이렇게 해 보세요"(`rpNext`)에 하위능력 최저 3개 코드의 `indicator` 문장을 자동 삽입 → 행동지표 기반 피드백
- 강사 코멘트(`rpDebrief`) 템플릿에 **디브리핑 질문 3개** 자동 제안 (PBL 성찰 단계): "가장 망설인 선택은? / 그때 무엇이 더 있었으면 결정이 쉬웠나? / 내일 같은 상황이면?"

---

## 6. 작업 순서 (로컬)

| 단계 | 파일 · 앵커 | 작업 | 검증 |
|---|---|---|---|
| 0 | `docs/ncs-new-items.js` | `node docs/ncs-new-items.js` | ✓ 검사 통과 |
| 1 | `index.html` `const RANKS` (~L826) | `weights.digital` 추가, `focus` 한 줄 | 콘솔 `RANKS.jr.weights.digital` |
| 2 | `index.html` `rankItems()` (~L842), `commonItems()` (~L1062), `DEPTS.*.items` (L1155/1281/1422/1544) | 기존 아이템에 `ncs/ncsOld/indicator` (NCS_TAGS) | 콘솔 `G.items.filter(i=>!i.ncs).length===0` |
| 3 | `index.html` `ATTACHDEFS` (~L6089) | NCS_NEW_ATTACH 5개 병합, 하단 정답 주석 줄 삭제 | 첨부 열어 렌더 확인 |
| 4 | `index.html` `rankItems()` | §1-1 결정에 따라 신규 아이템 삽입(A안이면 `day` 인자) | 인박스 도착 시각 확인 |
| 5 | `index.html` `QUESTDEFS` | 3개 퀘스트 병합 (`station` 키 유효) | 3D에서 마커 뜨고 선택 → 토스트 |
| 6 | `index.html` `al_ask` | `factCheck` 처리 경로가 msg 타입에서도 동작하는지 (`G.factChecks.push` L6729 부근) | 회신 후 `G.factChecks` |
| 7 | `index.html` `buildReport()` (~L7255) | `digitalFormula`, `WKEY`, 라벨, `LEVEL`, `ncsBreakdown` 저장 | 리포트 7축 레이더 |
| 8 | `index.html` `commitAction()` (~L4519) | 토스트에 `it.indicator` 노출(최적이 아니었을 때) | 플레이 |
| 9 | `teacher.html` | 하위능력 열 + CSV export + Day 옵션 | CSV 열 수 = 7+21+메타 |
| 10 | `DEPTS.*.handover` | §3 고정값 4건 추가/정합 | 텍스트 대조 |
| 11 | AI 루브릭 테스트 | 각 신규 `grade`에 좋은 답/나쁜 답 샘플 2개씩 보내 채점 분포 확인 (특히 `ai_draft` 3-2-1-0 오류 개수 배점, `alt_room` 대안 수) | 점수 단조성 |
| 12 | `docs/ncs-reference.md §1` | 표준 PDF 대조로 `[검증필요]` 해소 | — |
| 13 | §4 수집 파이프라인 | 공식 예시문항 수집 → `docs/ncs-imported-items.js` | 자기검사 |

---

## 7. 검증 시나리오 (플레이테스트)
1. **jr · 경영지원 · 수직(v)** — Day 2(또는 B안). 확인: `dr_phish` reply 시 0점 + 경고 코멘트 / `ai_draft` 첨부 3오류 중 2개만 고쳐 회신 → emailScore 60~75 / `cm_joke` confirm 이 v 문화에서 75로 상향됐는지 / 리포트 디지털 축 렌더 / `rpNext`에 indicator 문장.
2. **mgr · 인사 · 수평(h)** — `ai_tool` 조건부 승인 100 · 무조건 승인 25 / `num_quote` 반려 사유에 530,000·VAT 언급 시 100, 하나만 60 / `cm_intern` "인턴이 참아야" 톤 0점 확인.
3. **강사 화면** — 두 학생 CSV export → 21코드 열 존재, 표본 0인 코드는 빈칸(0점 아님).
4. **회귀** — Day 1 기존 플레이 점수가 태깅·라벨 변경 전후 동일(`digital` 표본 0 → 60 보류값이 총점에 미치는 영향 확인: 표본 0이면 가중 합에서 **제외**하는 것이 맞다 — `wSum` 계산 시 조건 추가).

---

## 8. 결정이 필요한 것 (co님)
1. §1-1 **A(Day 2) / B(선별) / C(토글)** — 권장 A
2. 채점 4단계화(§2-3) 지금 vs 2차
3. `cm_joke`·`cm_intern` 같은 민감 소재의 **톤 수위** — 현재는 "경계 인식" 수준. 법정 괴롭힘 예방교육 연계까지 갈지
4. Day 2 채택 시 **핸드오버 대체물**("어제 업무 일지")을 Day 1 리포트에서 자동 생성할지(개인화) vs 고정 텍스트
5. 공개 문항 수집 범위 — 10영역 전부 vs 문제해결·의사소통·조직이해(SJT 다수) 우선

---

## 9. 디지털 역량 측정 — 시장 표준과 맞추기

기업·국제 기관의 디지털 역량 측정은 자기보고 설문(DigCompSAT, NIA 실태조사) → 지식 시험(컴활·NCS 모듈형) → 실습 자격(MOS·AICE) → **시뮬레이션 수행 과제(OECD PIAAC PS-TRE)** → 현장 로그 순으로 신뢰도가 올라간다. worksim은 이미 PIAAC 계열(가상 환경에서 과제 수행 + 결과 채점). 표준과 정렬하려면 세 가지:

1. **과정 로그 채점** — 결과 점수와 별도로 "검증 행동" 기록. `ai_draft`·`ai_rule`·`num_quote`·`dr_attach`에서
   `attachRead`(첨부 열었나) · `handoverRef`(인수인계서/규정 열람 시각이 아이템 도착 이후인가) · `elapsed`(도착→처리 분) 를 `actionLogs`에 함께 저장.
   리포트 디지털 축 옆에 "검증 행동 n/4" 표기. PIAAC가 정답보다 **경로**를 채점하는 것과 같은 원리.
2. **모의 피싱 = 기업 표준 KPI** — `dr_phish`의 `reply`(링크·정보 입력) 비율은 기업 보안팀이 쓰는 "피싱 클릭률"과 동일 지표. 강사 화면에 세션 단위 클릭률(%)을 따로 표기하고 리포트 문구에 "기업 보안 교육 표준 지표"라고 명시.
3. **국제 수준 매핑** — 디지털 축 점수를 PIAAC 4수준으로 번역해 병기:
   `<40 → Below 1 (단일 앱·명시적 지시만)` / `40~64 → Level 1 (익숙한 도구, 소수 단계)` / `65~84 → Level 2 (복수 앱 통합, 결과 검증)` / `≥85 → Level 3 (암묵 제약 추론, 예외 대응)`.
   DigComp 2.2 8수준 대응은 `Level 1≈2, 2≈4, 3≈6`. 대학 IR센터 보고서 호환용.

AI 역량 채점 축(2025~26 기업 진단 도구 합의): ① 위임 판단 ② 지시 품질 ③ **검증**(핵심) ④ 책임(금지 정보 입력 여부) ⑤ 최종 판단 주체. 신규 `ai_*` 아이템 `grade`가 이 5축을 덮는지 로컬에서 대조.
