/* ============================================================================
 * worksim — 직업공통능력(2025.12 개편) 신설 하위능력 대응 신규 콘텐츠
 * 붙여넣기용. index.html 에 로드되지 않음. 설계·작업순서는 docs/worksim-ncs-additions.md
 *
 * 스키마는 index.html 기존 구조를 그대로 따른다:
 *   item  : {id,type,time,from,role,urgent,importance,best,deadline,subj,body,grade,act:{reply|hold|delegate|reject|confirm|accept:[score,comment]}}
 *   attach: ATTACHDEFS[key] = {name, body(HTML, DOCSTYLE 접두)}  |  {name, kind:'sheet', ...}
 *   quest : QUESTDEFS[key] = {title, station, graded, trigger, softExpire, dur, notify, prompt, choices:[{label,score,comment,best}]}
 *
 * 신규 필드(모든 아이템에 추가):
 *   ncs      : ['6-2', ...]  직업공통능력 하위능력 코드. 첫 항목이 주(主) 역량 — docs/ncs-competencies.json
 *   ncsOld   : ['정보처리', ...] 구 직업기초능력 하위능력 (공기업 필기 대응, 1년 병기)
 *   indicator: '…했다' 형태 행동지표 1문장 — 최적 행동의 근거. 피드백·강사 화면 노출
 *
 * 세계관 고정값(기존 콘텍스트 유지): 첫날 2026-07-07(화), 경영지원팀, 사수 박선임, 팀장 김팀장(mgr 트랙은 mgrify가 오부장으로 치환),
 *   동료 이주임·김대리, 전임자 최OO(퇴사), 이전 사옥=구로, 거래처 (주)한빛문구 유대리
 * ========================================================================== */

/* ----------------------------------------------------------------------------
 * A. 신규 인박스 아이템 — 트랙별. rankItems(rank) 안에 items.push(...) 로 삽입
 *    (all) = jr/mid/mgr 공통,  표기된 트랙에만 넣는다
 * -------------------------------------------------------------------------- */
const NCS_NEW_ITEMS = {

  /* ===== 6-2 AI활용능력 ===== */

  ai_draft: { tracks:['jr','mid'], ncs:['6-2','1-1','6-1'], ncsOld:['정보처리','문서작성'],
    indicator:'AI가 만든 초안을 사실(주소·조건·담당자)과 대조해 오류를 고친 뒤 발송했다',
    id:'ai_draft', type:'email', time:10.9, from:'박선임', role:'우리 팀 · 사수', urgent:3, importance:4, best:'reply', deadline:14.0,
    subj:'한빛문구 안내문 — AI로 초안 뽑아뒀어요, 검토해서 오늘 중 발송',
    body:`신입님, 한빛문구 유대리님께 보낼 "하반기 거래조건 안내" 초안을 AI로 뽑아 첨부했어요.
저도 아직 안 읽어봤으니 꼼꼼히 보고 고칠 건 고쳐서 보내 주세요.

참고로 우리 실제 조건은 이래요:
- 하반기 일괄구매 할인율: 5% (작년과 동일)
- 결제: 월말 일괄 정산
- 담당: 경영지원팀 신입님 본인 (전임자 최OO님은 퇴사)
- 회사 주소: 현 사옥 (서울 강남구 테헤란로 — 인수인계서 상단 참고)

AI가 쓴 글은 그럴듯해서 더 위험해요. 틀린 데 없는지 보고 보내세요.`,
    grade:'AI 초안 검수 문항. 첨부 초안에 오류 3개가 심어져 있다: ①할인율 8%(실제 5%) ②담당자 "최OO"(퇴사한 전임자, 실제는 본인) ③회사 주소 구로 이전 사옥(실제 강남 현 사옥). 좋은 답장: 세 오류를 모두 바로잡은 안내문을 본문 또는 첨부로 작성해 거래처에 발송하는 형태(수신 유대리, 인사·용건·맺음·서명·연락처). 오류 3개 중 잡은 개수에 비례해 배점(3개 100 / 2개 70 / 1개 40 / 0개 15). AI 초안을 그대로 붙여 보냈으면 15점 이하. "AI가 썼다"는 언급은 불필요하며 있어도 감점 없음.',
    act:{reply:[100,'AI 초안의 오류(할인율·담당자·주소)를 얼마나 잡아냈는지가 점수예요. AI 결과는 반드시 사실과 대조!'],
         confirm:[45,'검토를 본인이 해달라는 지시였어요. 무엇이 틀렸는지 먼저 찾아본 뒤 물어보는 게 순서예요.'],
         hold:[20,'오늘 중 발송 지시입니다.'],
         delegate:[10,'사수가 신입에게 맡긴 검수 업무예요.'],
         reject:[5,'']} },

  ai_leak: { tracks:['jr','mid','mgr'], ncs:['6-3','6-2'], ncsOld:['정보처리','공동체윤리'],
    indicator:'개인정보가 담긴 자료를 외부 AI 서비스에 올리지 않도록 막고, 비식별화·사내 승인 도구 등 대안을 제시했다',
    id:'ai_leak', type:'msg', time:13.1, from:'이주임', role:'우리 팀 (동료)', urgent:4, importance:5, best:'reply', deadline:13.6,
    subj:'고객 명단 엑셀, 외부 AI에 올려서 요약시켜도 될까요?',
    body:`거래처 담당자 명단(이름·휴대폰·이메일·주소 300건) 정리해야 하는데 손으로 하면 한 시간이에요.
무료 AI 사이트에 파일 통째로 올리고 "회사별로 묶어서 표로 만들어줘" 하면 1분인데…
이거 해도 되나요? 지금 바로 올릴게요, 문제 있으면 말해줘요!`,
    grade:'디지털책임 + AI활용 문항. 정답 방향: ①외부 AI 서비스에 개인정보 원본 업로드는 불가(개인정보 유출·제3자 제공 소지) — 즉시 중단 요청 ②대안 제시: 이름·연락처를 지운 비식별 데이터만 사용 / 사내 승인된 AI·업무 도구 사용 / 엑셀 자체 기능(정렬·피벗) 활용 ③필요 시 보안 담당(총무·IT)에 확인. 이유 없이 "안 됨"만 쓰면 60점, 대안까지 있으면 100점, "괜찮다"·"빨리 하자"는 0~10점. 상대를 나무라는 톤은 소폭 감점.',
    act:{reply:[100,'"안 된다"에서 끝나지 않고 대안(비식별화·사내 도구)까지 줬다면 최고예요. AI 활용은 "무엇을 올리면 안 되는가"부터입니다.'],
         reject:[60,'막은 건 맞아요. 하지만 이유와 대안이 없으면 동료는 다음에 몰래 하게 돼요.'],
         confirm:[55,'보안 담당에 확인하는 건 좋지만, "지금 바로 올린다"는 사람은 먼저 멈춰야 해요.'],
         hold:[5,'이미 올리고 난 뒤엔 되돌릴 수 없어요.'],
         delegate:[15,'동료의 질문을 남에게 넘길 일이 아니에요.']} },

  ai_rule: { tracks:['mid','mgr'], ncs:['6-2','3-1','1-1'], ncsOld:['정보처리','사고력','문서이해'],
    indicator:'AI가 요약한 규정을 원문·인수인계서와 대조해 잘못된 조항을 찾아내고 수정 의견을 냈다',
    id:'ai_rule', type:'email', time:14.6, from:'김팀장', role:'우리 팀 팀장', urgent:3, importance:5, best:'reply', deadline:17.0,
    subj:'[검토 요청] AI로 정리한 "경비·연차 규정 요약" — 전사 공지 전 확인',
    body:`사내 규정이 길어서 AI로 한 장 요약을 만들었습니다(첨부). 내일 아침 전사 공지로 나갈 예정이라
오늘 중 검토해 주세요. 틀린 게 있으면 어디가 왜 틀렸는지, 어떻게 고쳐야 하는지 적어 회신 바랍니다.
전사 공지는 한 번 나가면 회수가 어려우니 신중하게 봐 주세요.`,
    grade:'AI 요약 검증 문항(고난도). 첨부 요약에 오류 3개: ①"법인카드 개인 사용분은 별도 회수하지 않음" — 실제 규정은 개인 사용분 전액 회수(인수인계서·6월 법인카드 명세 업무와 충돌) ②"연차는 사용 전일까지 신청" — 실제 3영업일 전 ③"경비 규정 제12조 3항 근거" — 존재하지 않는 조항 인용. 좋은 회신: 세 오류를 각각 [위치–무엇이 틀렸나–올바른 내용–근거] 로 지적하고, 공지 전 원문 대조 필요 의견을 덧붙임. 3개 100 / 2개 70 / 1개 40 / "이상 없음" 회신 10. 공지 자체를 반대만 하고 근거가 없으면 30.',
    act:{reply:[100,'AI 요약을 원문과 대조해 오류를 짚어냈다면 정확해요. "그럴듯함"과 "맞음"은 다릅니다.'],
         confirm:[40,'검토를 맡은 사람이 검토 없이 되묻는 건 곤란해요. 어디가 의심스러운지 찾아서 보고하세요.'],
         hold:[15,'내일 아침 공지예요. 오늘 검토가 안 되면 오류가 전사로 나갑니다.'],
         delegate:[20,'팀장이 나에게 맡긴 검토를 넘기면 책임이 흐려져요.'],
         reject:[10,'']} },

  ai_tool: { tracks:['mgr'], ncs:['6-2','3-3','6-3'], ncsOld:['기술선택','문제처리','예산관리'],
    indicator:'AI 도구 도입을 보안·데이터·비용 조건을 붙여 결정했다',
    id:'ai_tool', type:'approval', time:12.4, from:'박선임', role:'우리 팀 (도구 도입 상신)', urgent:2, importance:4, best:'reply', deadline:16.0,
    subj:'[결재] 팀 생성형 AI 유료 구독(5석) — 승인 요청',
    body:`팀장님, 보고서·메일 초안 작성 시간 절감을 위해 생성형 AI 서비스 팀 구독을 상신합니다.

[상신 내용]
- 서비스: 외부 생성형 AI (클라우드형)
- 인원: 팀원 5명 / 월 25,000원 × 5 = 125,000원 (연 1,500,000원)
- 용도: 문서 초안, 회의록 정리, 데이터 표 정리
- 비고: 무료 버전은 입력 데이터가 학습에 사용될 수 있어 유료 전환 필요

※ 팀장 전결 한도: 건당 500,000원 (연간 계약은 총액 기준)`,
    grade:'AI 도구 도입 결재(조건부 승인이 정답). 판단 포인트: ①연 총액 1,500,000원은 팀장 전결 한도(500,000원) 초과 → 팀장 단독 승인 불가, 상위 결재 필요하다는 인식 ②승인 의견에 조건 명시: 보안·IT 검토(입력 데이터 학습 미사용·보관 정책 확인), 개인정보·대외비 입력 금지 가이드, 결과물 사실 검증 책임은 작성자 ③비용 근거(시간 절감 추정) 요구. 좋은 회신 = "취지 동의 + 한도 초과라 상위 결재 상신하되, 아래 조건 충족 시 지지" 형태. 무조건 승인은 25점(한도·보안 무시), 무조건 반려는 35점(도입 자체 거부), 조건 언급 수에 비례.',
    act:{reply:[100,'한도 초과를 잡고, 보안·데이터·비용 조건을 붙여 상위 결재로 올렸다면 정확한 관리자 판단이에요.'],
         reject:[35,'반려 이유가 "AI라서"면 안 돼요. 조건을 붙여 살릴 수 있는 안이었어요.'],
         confirm:[55,'한도 초과라 상위 결재가 맞긴 한데, 팀장 의견(조건)을 붙이지 않고 그냥 넘기면 판단을 안 한 거예요.'],
         hold:[15,'도구 도입은 미루면 팀원들이 무료 버전을 몰래 쓰게 돼요 — 그게 더 위험해요.'],
         delegate:[10,'결재는 위임 대상이 아닙니다.']} },

  /* ===== 6-3 디지털책임의식 ===== */

  dr_attach: { tracks:['jr','mid'], ncs:['6-3','1-1'], ncsOld:['정보처리','문서작성'],
    indicator:'외부에 전달하는 명단에서 불필요한 개인정보를 제거·마스킹하고 필요 최소 정보만 보냈다',
    id:'dr_attach', type:'email', time:11.2, from:'이주임', role:'우리 팀 (행사 담당)', urgent:3, importance:4, best:'reply', deadline:15.0,
    subj:'워크숍 참가자 명단 — 대행사(투어플랜)에 오늘 넘겨주세요',
    body:`신입님, 8월 팀 워크숍 대행사 투어플랜에 참가자 명단 보내야 해요. 첨부 파일 그대로 전달해 주시면 됩니다.
대행사에서 필요하다는 건 "이름, 인원, 식사 알레르기" 뿐이라고 했어요.
받는 분: 투어플랜 박과장 (tourplan_park@example.com)`,
    grade:'개인정보 최소 제공 문항. 첨부 명단에는 대행사가 요청하지 않은 주민등록번호·자택주소·개인 휴대폰이 들어 있다. 정답: 이름·인원·알레르기만 남기고 나머지는 삭제(또는 마스킹)한 명단을 새로 만들어 첨부하고, 이주임에게도 원본을 외부에 그대로 보내면 안 되는 이유를 짧게 알림(선택). 원본 그대로 첨부 전달 = 10점. 삭제하되 알레르기 등 필요 정보까지 빠졌으면 60점. 첨부 없이 본문에 필요 정보만 정리해 보낸 것도 정답 인정.',
    act:{reply:[100,'필요한 정보만 골라 보냈나요? "그대로 전달"이라도 개인정보는 보내는 사람 책임이에요.'],
         confirm:[60,'개인정보가 과하다는 걸 알아차린 건 좋아요. 다만 정리해서 보내는 건 신입 선에서 할 수 있어요.'],
         hold:[15,'오늘 넘겨야 하는 자료예요.'],
         delegate:[10,'내게 온 전달 업무예요.'],
         reject:[20,'전달 자체는 해야 해요. 문제는 "무엇을" 보내느냐죠.']} },

  dr_capture: { tracks:['jr'], ncs:['6-3','7-2'], ncsOld:['공동체윤리','정보처리'],
    indicator:'업무 대화 캡처를 사적 단톡에 공유하자는 제안을 이유를 들어 거절했다',
    id:'dr_capture', type:'msg', time:15.2, from:'김대리', role:'우리 팀 (동료)', urgent:2, importance:4, best:'reject', deadline:15.8,
    subj:'ㅋㅋ 팀장님 아까 메신저 봤어요? 캡처해서 동기 단톡에 올려도 되죠',
    body:`아까 팀장님이 이주임한테 보낸 메시지 진짜 웃겼는데 ㅋㅋㅋ
내가 캡처해놨거든요. 우리 동기 단톡에 올려도 되죠? 신입님도 있잖아요 거기.
회사 얘기 아니고 그냥 웃긴 거라 괜찮을 듯?`,
    grade:'(reject 시 거절 메일 작성) 사내 메신저 대화 캡처의 외부(사적 단톡) 공유 거절 문항. 정답: ①공유 반대 — 당사자 동의 없는 사내 대화 유출, 업무 내용 포함 가능, 회사 보안 규정 위반 소지 ②관계를 해치지 않는 톤 ③"웃긴 건 우리끼리 얘기로" 같은 완충. 동조하면 0점.',
    act:{reject:[100,'동료 관계를 지키면서도 선을 그었다면 최고예요. 사내 대화 캡처는 "웃긴 거"라도 유출이에요.'],
         reply:[70,'설득하려 한 건 좋아요. 다만 "하지 말자"가 분명히 드러나야 해요.'],
         confirm:[40,'팀장에게 "김대리가 캡처했대요"라고 알리는 건 과해요. 먼저 동료에게 직접 말하세요.'],
         hold:[25,'답을 안 하면 동의로 읽혀요. 그 사이 올라갈 수 있어요.'],
         delegate:[5,'']} },

  dr_phish: { tracks:['jr','mid','mgr'], ncs:['6-3','6-1'], ncsOld:['정보처리','컴퓨터활용'],
    indicator:'비밀번호 입력을 요구하는 의심 메일의 링크를 열지 않고 보안 담당·상급자에게 확인·신고했다',
    id:'dr_phish', type:'email', time:9.6, from:'IT지원센터', role:'(발신 주소: it-support@c0mpany-sec.net)', urgent:4, importance:5, best:'confirm', deadline:12.0,
    subj:'[긴급] 사내 계정 비밀번호 만료 — 24시간 내 재설정 필요',
    body:`안녕하십니까, IT지원센터입니다.
귀하의 사내 계정 비밀번호가 금일 만료됩니다. 아래 링크에서 현재 비밀번호와 새 비밀번호를 입력해 즉시 재설정하십시오.
24시간 내 미조치 시 계정이 잠기며 메일·결재 시스템 접속이 차단됩니다.

▶ 재설정: http://c0mpany-sec.net/reset?uid=new_emp
(본 메일은 발신 전용입니다. 회신하지 마십시오.)`,
    grade:'(reply 선택 시) 피싱 메일에 회신·정보 입력한 것으로 간주 — 0~10점. 메일 내용에 계정 정보를 적었다면 0점.',
    act:{confirm:[100,'발신 도메인(c0mpany-sec.net)이 회사 도메인이 아니고, 비밀번호를 "입력"하라는 메일은 전형적 피싱이에요. 확인·신고가 정답.'],
         hold:[60,'열지 않은 건 다행이에요. 하지만 신고하지 않으면 다른 직원이 당해요.'],
         reject:[50,'"회신하지 마십시오"에 회신한 셈이에요. 발신자와 접촉하지 말고 보안 담당에 신고하세요.'],
         delegate:[20,'피싱 메일을 동료에게 넘기면 피해자가 늘어요.'],
         reply:[0,'링크·비밀번호 입력은 계정 탈취로 이어져요. 발신 도메인부터 의심하세요.']} },

  /* ===== 4-2 적응학습능력 ===== */

  al_newsys: { tracks:['jr','mid','mgr'], ncs:['4-2','6-1'], ncsOld:['자기관리','컴퓨터활용'],
    indicator:'새 업무 시스템 매뉴얼을 스스로 읽고 이후 업무에 적용했다',
    id:'al_newsys', type:'msg', time:9.4, from:'총무팀', role:'전사 안내', urgent:2, importance:3, best:'hold', noPenalty:true,
    subj:'[안내] 오늘부터 전자결재 시스템 교체 — 간단 매뉴얼 첨부',
    body:`금일(7/7)부터 전자결재가 신규 시스템(e-Approve 2.0)으로 전환됩니다. 기존 시스템은 조회만 가능합니다.
첨부한 1쪽 매뉴얼을 꼭 읽어 두세요. 특히 "반려 문서 재상신"과 "전결 한도 자동 체크" 부분이 달라졌습니다.
문의는 총무팀 내선 300. (회신 불필요)`,
    act:{hold:[100,'회신 불필요 안내는 읽고 보관 — 정확해요. 첨부 매뉴얼을 열어봤다면 오후에 도움이 될 거예요.'],
         reply:[45,'"회신 불필요" 안내예요. 읽고 익히는 게 할 일이에요.'],
         confirm:[30,'전사 안내를 상급자에게 확인할 필요는 없어요. 직접 읽으세요.'],
         delegate:[10,'내가 익혀야 하는 시스템이에요.'],
         reject:[10,'']} },

  al_ask: { tracks:['jr','mid','mgr'], ncs:['4-2','1-1','5-1'], ncsOld:['자기관리','문서작성','팀워크'],
    indicator:'새 시스템 매뉴얼에서 답을 찾아 동료에게 정확한 절차를 안내했다',
    id:'al_ask', type:'msg', time:14.9, from:'이주임', role:'우리 팀 (동료)', urgent:3, importance:3, best:'reply', deadline:15.6,
    factCheck:['반려 사유', '수정', '재상신'],
    subj:'새 결재 시스템에서 반려된 문서 어떻게 다시 올려요?',
    body:`아까 올린 기안이 반려됐는데 새 시스템은 처음이라 모르겠어요 ㅠ 예전처럼 새로 기안 쓰면 되나요?
급해서 그냥 새로 쓸까 하는데… 아침에 온 매뉴얼 보셨어요?`,
    grade:'적응학습 확인 문항. 오전 총무팀 안내의 첨부 매뉴얼에 답이 있음: "반려 문서는 새 기안 작성이 아니라 [반려함] → [반려 사유 확인] → [수정 후 재상신] 으로 처리, 새로 기안하면 결재 이력이 끊겨 감사 시 문제". 좋은 답장: 절차 3단계를 정확히 안내 + "새로 쓰면 안 되는 이유" 한 줄. 매뉴얼을 안 읽고 "새로 쓰세요"라 하면 10점. "모르겠어요/총무팀에 물어봐요"는 35점(자기 학습 회피).',
    act:{reply:[100,'매뉴얼에서 답을 찾아 정확히 안내했나요? 새 도구를 스스로 익혀 동료까지 돕는 게 적응학습이에요.'],
         confirm:[35,'상급자에게 묻기 전에 아침에 온 매뉴얼을 먼저 열어보세요. 답이 1쪽에 있어요.'],
         delegate:[30,'총무팀에 넘기는 것도 방법이지만, 이미 받은 매뉴얼 하나면 해결되는 질문이었어요.'],
         hold:[10,'동료가 급하대요. 잘못 처리(새 기안)하면 결재 이력이 끊겨요.'],
         reject:[5,'']} },

  /* ===== 7-2 직장공동체의식 ===== */

  cm_joke: { tracks:['jr','mid'], ncs:['7-2','5-3'], ncsOld:['공동체윤리','갈등관리'],
    indicator:'동료의 외모 언급·농담이 불편할 수 있음을 관계를 해치지 않는 방식으로 제지했다',
    id:'cm_joke', type:'msg', time:13.6, from:'김대리', role:'우리 팀 (동료)', urgent:2, importance:4, best:'reply', deadline:14.5,
    subj:'(팀 단톡) 이주임 오늘 살 빠졌네~ 다이어트 성공? ㅋㅋ 신입님도 한마디',
    body:`[팀 단톡방]
김대리: 이주임 오늘 살 빠졌네~ 다이어트 성공? ㅋㅋ
김대리: 아 근데 얼굴은 그대로다 ㅋㅋㅋ
김대리: 신입님도 한마디 해봐요 어때 보여요?
(이주임은 읽었지만 답이 없다)`,
    grade:'직장공동체의식 문항. 정답 방향: ①동조하지 않음 ②외모 언급이 상대에게 불편할 수 있음을 짧고 부드럽게 지적("외모 얘기는 좀…", "업무 얘기로 돌아가요") 또는 화제 전환으로 흐름을 끊음 ③이주임을 편들되 김대리를 공개 비난하지 않음. 동조·맞장구 = 0점. 아무 말 없이 넘기기(hold)는 방관. 팀장 보고(confirm)는 반복·심각 시 정당하나 1회 농담엔 과잉 — 단, 수직 조직(v) 문화에서는 confirm 점수를 75로 상향 권장.',
    act:{reply:[100,'동조하지 않으면서 흐름을 끊었다면 잘한 거예요. 직장 내 외모 언급은 "웃자고" 해도 괴롭힘이 될 수 있어요.'],
         confirm:[65,'상급자에게 알리는 건 반복될 때의 다음 단계예요. 지금은 단톡에서 흐름을 끊는 게 먼저.'],
         reject:[60,'"그런 말 하지 마세요"도 방법이지만, 공개 단톡에서 직접 비난하면 갈등이 커질 수 있어요.'],
         hold:[25,'침묵은 동조로 보여요. 이주임은 지금 혼자예요.'],
         delegate:[5,'']} },

  cm_intern: { tracks:['mgr'], ncs:['7-2','5-2','5-3'], ncsOld:['공동체윤리','리더십','갈등관리'],
    indicator:'구성원의 사적 지시(심부름)를 조직 규범 위반으로 인식하고 피해자 보호와 당사자 면담을 함께 계획했다',
    id:'cm_intern', type:'email', time:14.2, from:'정인턴', role:'우리 팀 인턴 (2주차)', urgent:3, importance:5, best:'reply', deadline:17.0,
    subj:'팀장님… 여쭤볼 게 있는데 괜찮을까요',
    body:`팀장님, 인턴 정OO입니다. 이런 걸 말씀드려도 되는지 몰라서 고민했습니다.
김대리님이 이번 주 매일 아침 커피를 사 오라고 하시고, 어제는 세탁소에서 옷을 받아오라고 하셨습니다.
"인턴이면 이런 것도 배우는 거"라고 하셔서 그런 건가 싶었는데, 제 업무(자료 정리)가 계속 밀려서요.
제가 잘못 생각하는 거면 죄송합니다.`,
    grade:'관리자 직장공동체의식 문항. 정답 요소: ①인턴에게 — 말해줘서 고맙다, 잘못 생각한 것 아니다, 사적 지시는 업무가 아니며 거절해도 된다, 불이익 없을 것 ②조치 — 김대리와 별도 면담 예정(공개 질책 아님), 팀 전체에 인턴 업무 범위 재안내 ③인턴 본업(자료 정리) 일정 조정 ④비밀 유지. "인턴이 참아야" 톤 = 0~10점. 김대리를 단톡에서 공개 질책하겠다는 답은 40점(2차 갈등). 인턴에게 회신 없이 김대리만 부르겠다는 답(confirm/delegate 계열)은 인턴 보호 누락.',
    act:{reply:[100,'인턴을 먼저 안심시키고, 당사자 면담과 팀 기준 재안내를 함께 계획했다면 정확한 관리자 대응이에요.'],
         confirm:[45,'인사팀 확인은 필요할 수 있지만, 용기 내 말한 인턴에게 먼저 답해야 해요. 그 사이 인턴은 오늘도 커피를 사러 갈 거예요.'],
         hold:[5,'인턴이 "죄송합니다"로 끝맺은 메일이에요. 답이 없으면 다시는 말하지 않을 거예요.'],
         delegate:[15,'팀 내부 규범 문제는 팀장이 직접 다뤄야 해요.'],
         reject:[0,'']} },

  /* ===== 3-2 대안발굴능력 ===== */

  alt_room: { tracks:['mid','mgr'], ncs:['3-2','3-3','1-1'], ncsOld:['사고력','문제처리','문서작성'],
    indicator:'문제에 대해 서로 다른 대안 2개 이상을 장단점과 함께 제시하고 근거를 들어 하나를 추천했다',
    id:'alt_room', type:'email', time:12.2, from:'김팀장', role:'우리 팀 팀장', urgent:2, importance:4, best:'reply', deadline:17.5,
    subj:'세미나실 예약 불편 개선안 — 대안 2개 이상, 장단점 비교해서 문서로',
    body:`오전 미팅에서 나온 세미나실 예약 문제, 신입님(대리님) 의견을 먼저 듣고 싶습니다.

현황: 세미나실 2개(A 12인, B 6인). 사내 게시판에 "선착순 댓글"로 예약 → 중복·노쇼 잦음.
지난달 노쇼 9건, 중복 예약 분쟁 4건. 예산은 거의 없다고 보세요.

부탁: 서로 성격이 다른 개선안을 2개 이상 내고, 각각 장점·단점·예상 비용(돈/시간)을 비교한 뒤
하나를 추천해 주세요. 한 쪽짜리 문서로 첨부해서 금요일 전에 — 오늘 초안이면 더 좋습니다.`,
    grade:'대안발굴 문항(서술·문서형). 채점 축: ①대안 수 — 성격이 다른 대안 2개 이상(예: 공용 캘린더 예약 시스템 / 예약 담당자 지정 / 노쇼 패널티 규칙 / 이용 시간 슬롯제 / 소회의 B는 예약 없이 선착순 등). 유사 대안 2개(둘 다 "규칙 강화")는 1개로 간주 ②각 대안에 장점·단점·비용이 모두 있는가 ③추천 1개 + 근거(현황 수치 인용 시 가산) ④문서 첨부 여부(본문 서술도 인정하되 −10). 배점: 대안 3개+비교+추천 100 / 2개+비교+추천 85 / 대안만 나열 45 / 1개 30.',
    act:{reply:[100,'성격이 다른 대안을 여러 개 놓고 비교한 뒤 추천했나요? 대안을 "만드는" 능력은 판단력의 앞단이에요.'],
         hold:[35,'금요일까지지만 "오늘 초안이면 더 좋다"고 했어요. 미룰수록 다른 일에 밀려요.'],
         confirm:[30,'의견을 물은 건 팀장이에요. 되묻지 말고 먼저 안을 내세요.'],
         delegate:[15,'내 의견을 묻는 요청이에요.'],
         reject:[5,'']} },

  /* ===== 2-x 수리능력 ===== */

  num_quote: { tracks:['mid','mgr'], ncs:['2-1','2-3','3-3'], ncsOld:['기초연산','도표분석','문제처리'],
    indicator:'비교표의 합계·세액을 검산해 오류를 찾고, 그 근거로 결정을 바꿨다',
    id:'num_quote', type:'approval', time:13.4, from:'이주임', role:'우리 팀 (구매 비교 상신)', urgent:3, importance:4, best:'reject', deadline:16.0,
    subj:'[결재] 하반기 복사용지 공급업체 선정 — B사(최저가) 승인 요청',
    body:`3개 업체 견적을 비교했습니다(첨부). 총액 기준 B사가 최저가라 B사로 선정 승인 요청드립니다.
계산은 각 업체 견적서 그대로 옮겼습니다.`,
    grade:'(reject 시 반려 사유 작성) 수리 검증 문항. 첨부 비교표 오류: ①B사 행 — 26,500×20 = 530,000 인데 표에는 503,000 (전치 오류) ②B사 VAT 누락(A·C사는 VAT 포함 총액, B사는 공급가만) → 정정하면 B사 583,000 > A사 572,000, 실제 최저가는 A사. 좋은 반려: 두 오류를 수치로 지적 + 정정 후 A사 최저 + 재상신 요청. 오류 1개만 짚으면 60점. 근거 없는 반려 20점.',
    act:{reject:[100,'B사 곱셈 오류(503,000→530,000)와 VAT 누락을 잡고 A사가 최저임을 보였다면 정확해요. 표는 항상 검산!'],
         reply:[10,'승인했다면 잘못된 업체를 선정한 거예요. 합계 한 줄만 검산해도 잡혔을 오류예요.'],
         confirm:[50,'뭔가 이상하다고 느낀 건 좋아요. 하지만 검산은 결재자 본인이 할 수 있는 일이에요.'],
         hold:[15,'결재를 묵히면 하반기 용지 공급이 늦어져요.'],
         delegate:[10,'결재는 위임 대상이 아닙니다.']} },

  /* ===== 1-3 외국어소통능력 ===== */

  fl_email: { tracks:['jr','mid'], ncs:['1-3','1-1'], ncsOld:['기초외국어','문서작성'],
    indicator:'영문 업무 메일의 요청 사항을 정확히 파악하고 필요한 정보를 영어로 간결하게 회신했다',
    id:'fl_email', type:'email', time:11.5, from:'Hana Ito', role:'Kyoto Supply Co. (해외 거래처)', urgent:3, importance:3, best:'reply', deadline:16.0,
    subj:'Re: PO #KS-2607 — please confirm delivery date and quantity',
    body:`Dear Sir/Madam,

Thank you for your purchase order #KS-2607 (name plates, 120 pcs).
Before shipping, could you please confirm the following?

1. Delivery date: our record shows July 21. Is this still correct?
2. Quantity: 120 pcs as ordered, or do you need the extra 10 pcs mentioned by Mr. Choi last month?
3. Contact person: Mr. Choi is listed. Should we update this?

We can ship on July 15 if we receive your confirmation by end of this week.

Best regards,
Hana Ito
Kyoto Supply Co., Export Team`,
    grade:'기초 외국어 문항. 사실 정보(인수인계서 기준): 납기 7/21 유지, 수량은 120개 그대로(추가 10개는 전임자가 검토만 했고 발주 안 됨), 담당자는 전임자 최OO 퇴사 → 본인으로 변경. 좋은 회신(영어): 세 질문에 번호 맞춰 답변, 담당자 변경 안내, 감사 인사, 서명. 영어가 완벽할 필요 없음 — 정보 정확성 60% + 형식(인사/용건/맺음/서명) 40%. 한국어로 회신하면 30점(상대가 못 읽음). 세 항목 중 누락 1개당 −20.',
    act:{reply:[100,'세 질문에 빠짐없이, 영어로, 담당자 변경까지 알렸다면 충분해요. 완벽한 문장보다 정확한 정보가 중요해요.'],
         delegate:[45,'영어 잘하는 동료에게 부탁하는 것도 현실적 선택이지만, 이 정도 확인 메일은 직접 할 수 있어야 해요.'],
         confirm:[40,'사실 확인(납기·수량)은 인수인계서에 있어요. 먼저 확인하고 회신하세요.'],
         hold:[20,'이번 주 내 확인이 없으면 선적이 밀려요.'],
         reject:[5,'']} },
};

/* ----------------------------------------------------------------------------
 * B. 신규 첨부 — ATTACHDEFS 에 병합. body 는 DOCSTYLE + HTML (기존 m1 견적서 형식 참조)
 * -------------------------------------------------------------------------- */
const NCS_NEW_ATTACH = {

  ai_draft_doc: { name:'한빛문구_하반기_거래조건_안내_AI초안.docx', body:`
<div class="att-h">하반기 거래조건 안내</div>
<div class="att-meta">수신: (주)한빛문구 영업1팀 유대리 · 발신: 경영지원팀 · 2026-07-07</div>
<p>안녕하세요, 유대리님. 하반기 거래조건을 아래와 같이 안내드립니다.</p>
<ul>
<li>하반기 일괄구매 할인율: <b>8%</b> 적용</li>
<li>결제 조건: 월말 일괄 정산</li>
<li>납품지: <b>서울시 구로구 디지털로 ○○ (본사)</b></li>
<li>담당자: 경영지원팀 <b>최OO</b> (02-000-0000)</li>
</ul>
<p>궁금한 점은 언제든 연락 주십시오. 감사합니다.</p>
<div class="att-meta">※ 본 문서는 생성형 AI로 작성된 초안입니다.</div>` },

  ai_rule_doc: { name:'경비·연차_규정_요약_AI.pdf', body:`
<div class="att-h">사내 경비·연차 규정 한 장 요약</div>
<div class="att-meta">생성형 AI 요약 · 원문: 사내 규정집 제3장(경비), 제5장(휴가) · 2026-07-06</div>
<table class="att-tbl">
<tr><th>항목</th><th>요약 내용</th><th>근거</th></tr>
<tr><td>법인카드 사용</td><td>업무 목적에 한해 사용. 개인 사용분은 <b>별도 회수하지 않으며</b> 사후 소명으로 갈음</td><td>경비 규정 제12조 3항</td></tr>
<tr><td>경비 정산 기한</td><td>사용 월 익월 5일까지 전자결재 상신</td><td>경비 규정 제14조</td></tr>
<tr><td>연차 신청</td><td>사용 <b>전일까지</b> 전자결재로 신청</td><td>휴가 규정 제5조</td></tr>
<tr><td>반차</td><td>오전(09–13) / 오후(13–18) 구분, 연차 0.5일 차감</td><td>휴가 규정 제6조</td></tr>
</table>
<div class="att-meta">※ 인수인계서 대조: 법인카드 개인 사용분은 <u>전액 회수</u>(6월 명세 업무 참조) · 연차는 <u>3영업일 전</u> 신청 · 경비 규정 제12조는 2항까지만 존재</div>` },

  dr_roster: { name:'8월_워크숍_참가자명단.xlsx', body:`
<div class="att-h">8월 팀 워크숍 참가자 명단</div>
<div class="att-meta">작성: 이주임 · 2026-07-06 · 대외비</div>
<table class="att-tbl">
<tr><th>이름</th><th>주민등록번호</th><th>휴대폰(개인)</th><th>자택 주소</th><th>식사 알레르기</th></tr>
<tr><td>김팀장</td><td>780312-1******</td><td>010-1234-5678</td><td>서울 송파구 ○○로 12</td><td>없음</td></tr>
<tr><td>박선임</td><td>860925-2******</td><td>010-2345-6789</td><td>경기 성남시 ○○동 34</td><td>갑각류</td></tr>
<tr><td>이주임</td><td>930418-2******</td><td>010-3456-7890</td><td>서울 관악구 ○○길 56</td><td>없음</td></tr>
<tr><td>김대리</td><td>900207-1******</td><td>010-4567-8901</td><td>서울 마포구 ○○로 78</td><td>땅콩</td></tr>
<tr><td>신입</td><td>020115-3******</td><td>010-5678-9012</td><td>서울 강서구 ○○동 90</td><td>없음</td></tr>
</table>
<div class="att-meta">※ 대행사 요청 항목: 이름 · 인원 · 식사 알레르기</div>` },

  al_manual: { name:'e-Approve_2.0_간단매뉴얼.pdf', body:`
<div class="att-h">e-Approve 2.0 간단 매뉴얼 (1쪽)</div>
<div class="att-meta">총무팀 · 2026-07-07 시행 · 문의 내선 300</div>
<table class="att-tbl">
<tr><th>업무</th><th>기존 시스템</th><th>e-Approve 2.0 (변경)</th></tr>
<tr><td>기안 작성</td><td>[새 문서] → 양식 선택</td><td>[새 기안] → 양식 선택 → <b>전결 한도 자동 체크</b>(초과 시 결재선 자동 상향)</td></tr>
<tr><td><b>반려 문서 처리</b></td><td>새 기안 다시 작성</td><td><b>[반려함] → [반려 사유 확인] → [수정 후 재상신]</b>. 새 기안으로 다시 쓰면 결재 이력이 끊겨 감사 시 문제 — 금지</td></tr>
<tr><td>결재 위임</td><td>메일로 요청</td><td>[설정] → [부재 시 위임자 지정] (기간 필수)</td></tr>
<tr><td>첨부</td><td>10MB</td><td>50MB, 개인정보 포함 파일은 업로드 시 <b>자동 경고</b></td></tr>
</table>
<div class="att-meta">※ 기존 시스템은 7/31까지 조회만 가능</div>` },

  num_compare: { name:'복사용지_업체_견적비교표.xlsx', body:`
<div class="att-h">하반기 복사용지(A4 80g, 20박스) 업체 견적 비교</div>
<div class="att-meta">작성: 이주임 · 2026-07-07</div>
<table class="att-tbl">
<tr><th>업체</th><th>단가(박스)</th><th>수량</th><th>공급가액</th><th>VAT</th><th>총액(VAT 포함)</th><th>납기</th></tr>
<tr><td>A사 (한빛문구)</td><td class="n">26,000</td><td class="n">20</td><td class="n">520,000</td><td class="n">52,000</td><td class="n">572,000</td><td>2영업일</td></tr>
<tr><td><b>B사 (오피스몰)</b></td><td class="n">26,500</td><td class="n">20</td><td class="n"><b>503,000</b></td><td class="n">—</td><td class="n"><b>503,000</b></td><td>3영업일</td></tr>
<tr><td>C사 (페이퍼로)</td><td class="n">27,000</td><td class="n">20</td><td class="n">540,000</td><td class="n">54,000</td><td class="n">594,000</td><td>1영업일</td></tr>
<tr class="tt"><td colspan="6">선정(최저가): <b>B사 503,000원</b></td><td></td></tr>
</table>
<div class="att-meta">※ 검산: B사 26,500×20 = 530,000 (표는 503,000 — 전치 오류) · B사 VAT 53,000 누락 → 정정 총액 583,000 · 실제 최저 = A사 572,000</div>` },
};

/* ----------------------------------------------------------------------------
 * C. 신규 3D 퀘스트 — QUESTDEFS 에 병합 (graded → judge 역량 + ncs 태그 집계)
 *    station 은 STATIONS 키 사용: copier · cabinet · shelf · island · door · plant · pantry · meet · mailrack · boss
 * -------------------------------------------------------------------------- */
const NCS_NEW_QUESTS = {

  q_usb: { ncs:['6-3'], ncsOld:['정보처리'],
    indicator:'출처 불명 저장매체를 개인 PC에 연결하지 않고 보안 담당에 인계했다',
    title:'택배 데스크에 놓인 낯선 USB', station:'mailrack', graded:true,
    trigger:{type:'time', at:11.0}, softExpire:2.0, dur:8,
    notify:{from:'총무팀', text:'택배 데스크에 주인 없는 USB가 하나 놓여 있다고 합니다. 가까운 분이 확인 부탁드려요.', cls:'t-quest'},
    prompt:'택배 데스크 위에 라벨 없는 USB 메모리가 놓여 있습니다. 주변에 주인은 없어요. 어떻게 하시겠어요?',
    choices:[
      {label:'만지지 않고 총무팀·보안 담당에게 인계한다', score:100, comment:'정답이에요. 출처 불명 USB는 악성코드 유포의 고전적 수법입니다. 내용 확인은 보안 담당의 일이에요.', best:true},
      {label:'팀장에게 알리고 지시를 기다린다', score:70, comment:'보고는 좋아요. 다만 이런 건 보안 담당 라인이 정해져 있으니 바로 인계하면 됩니다.'},
      {label:'주인을 찾아주려고 내 PC에 꽂아 내용을 확인한다', score:0, comment:'선의라도 절대 금지예요. USB 하나로 사내망 전체가 감염될 수 있습니다.'},
      {label:'내 일 아니니 그대로 둔다', score:35, comment:'방치하면 다른 직원이 꽂아볼 수 있어요. 보이는 사람이 인계하는 게 매너입니다.'},
    ], onDone:null },

  q_ai_record: { ncs:['6-3','6-2'], ncsOld:['공동체윤리','정보처리'],
    indicator:'회의 녹음·AI 요약 전에 참석자 동의와 민감 정보 여부를 확인했다',
    title:'회의 AI 녹음·요약', station:'meet', graded:true,
    trigger:{type:'time', at:13.8}, softExpire:1.5, dur:8,
    notify:{from:'김대리', text:'14시 거래처 미팅 회의록, 제 폰 AI 녹음 앱으로 자동 요약할게요. 신입님이 회의실 세팅 좀 봐줘요.', cls:'t-quest'},
    prompt:'회의실입니다. 김대리가 개인 휴대폰의 AI 녹음·요약 앱을 켜두고 나갔어요. 곧 거래처 2명이 들어옵니다. 어떻게 하시겠어요?',
    choices:[
      {label:'거래처 참석자에게 녹음·AI 요약 사실을 알리고 동의를 구한 뒤, 개인 폰 대신 회사 승인 도구가 있는지 확인한다', score:100, comment:'정확해요. 외부인 포함 회의 녹음은 사전 동의가 원칙이고, 개인 앱은 회의 내용(거래 조건)이 외부 서버로 갈 수 있어요.', best:true},
      {label:'녹음은 그대로 두고 회의록에 "AI 요약 기반"이라고만 적는다', score:30, comment:'표기만으로는 동의 문제가 해결되지 않아요. 상대는 녹음되는 줄도 모릅니다.'},
      {label:'김대리가 켜둔 거니 그대로 진행한다', score:10, comment:'외부인 동의 없는 녹음 + 개인 앱 업로드, 두 가지 문제가 그대로 남아요.'},
      {label:'녹음 앱을 몰래 끄고 아무 말 안 한다', score:45, comment:'문제는 막았지만 김대리와 소통이 없으면 다음 회의에서 반복돼요.'},
    ], onDone:null },

  q_cable: { ncs:['7-3'], ncsOld:['공동체윤리'],
    indicator:'사무실의 전기·화재 위험 요소를 인지하고 즉시 조치 또는 담당자에게 알렸다',
    title:'탕비실 멀티탭', station:'pantry', graded:true,
    trigger:{type:'time', at:15.4}, softExpire:2.0, dur:8,
    notify:{from:'총무팀', text:'탕비실 전기포트 쪽에서 탄 냄새가 난다는 얘기가 있어요. 가까운 분이 봐주실 수 있을까요?', cls:'t-quest'},
    prompt:'탕비실입니다. 멀티탭 하나에 전기포트·전자레인지·커피머신·냉장고가 모두 꽂혀 있고, 멀티탭은 싱크대 물 튀는 자리 바로 아래에 있어요. 플러그 한 곳이 살짝 변색됐습니다. 어떻게 하시겠어요?',
    choices:[
      {label:'고전력 기기 플러그를 뽑아 부하를 줄이고, 멀티탭을 물기 없는 곳으로 옮긴 뒤 총무팀에 변색 사실을 알린다', score:100, comment:'정답이에요. 즉시 위험 제거(부하·물기) + 담당 보고. 사무실 화재 원인 1위가 전기예요.', best:true},
      {label:'총무팀에 알리기만 하고 자리로 돌아간다', score:60, comment:'보고는 맞아요. 다만 플러그 하나 뽑는 건 지금 할 수 있는 조치예요 — 변색은 과열 신호입니다.'},
      {label:'냄새가 심하지 않으니 그냥 둔다', score:5, comment:'변색 = 과열. 오늘 밤 사무실에 아무도 없을 때가 가장 위험해요.'},
      {label:'변색된 플러그를 다른 멀티탭 구멍으로 옮겨 꽂는다', score:25, comment:'원인(과부하·물기)이 그대로라 위치만 바뀐 셈이에요.'},
    ], onDone:null },
};

/* ----------------------------------------------------------------------------
 * D. 기존 아이템 태깅 — 로컬에서 각 아이템 정의에 ncs/ncsOld 필드로 붙인다
 *    todo:true 는 내용 확인 후 확정할 것(부서 아이템은 WORKDEFS kind 로 1차 추정)
 * -------------------------------------------------------------------------- */
const NCS_TAGS = {
  /* 공통 */
  c_welcome:  { ncs:['1-2','7-2'],       ncsOld:['의사표현','공동체윤리'] },
  c_security: { ncs:['7-3','7-1'],       ncsOld:['공동체윤리'],           note:'법정 의무교육 일정 등록 — 산업안전보건의식 기존 커버' },
  c_meeting:  { ncs:['4-3','1-1'],       ncsOld:['시간관리','문서이해'] },
  c_conflict: { ncs:['5-3','3-3','4-3'], ncsOld:['갈등관리','문제처리','시간관리'] },
  c_lunch:    { ncs:['4-3','5-1'],       ncsOld:['시간관리','팀워크'] },
  /* 직급 */
  coach_jr:   { ncs:['1-1'],             ncsOld:['문서작성'],             note:'학습 안내(hold)' },
  jr_minutes: { ncs:['1-1','4-3'],       ncsOld:['문서작성','시간관리'] },
  jr_fix:     { ncs:['7-1','1-1','3-3'], ncsOld:['근로윤리','문서작성','문제처리'] },
  coach_ps:   { ncs:['3-1'],             ncsOld:['사고력'],               note:'학습 안내(hold)' },
  ps1:        { ncs:['3-1','3-3','1-1'], ncsOld:['문제처리','사고력','문서작성'] },
  ps2:        { ncs:['3-3','1-1','5-2'], ncsOld:['문제처리','문서작성','리더십'] },
  ps3:        { ncs:['3-1','3-3'],       ncsOld:['문제처리'],             todo:true },
  mgr_rev:    { ncs:['1-1','3-1'],       ncsOld:['문서이해','사고력'] },
  mgr_appr:   { ncs:['2-1','3-3','7-1'], ncsOld:['기초연산','문제처리','근로윤리'] },
  mgr_deleg:  { ncs:['5-1','5-2','4-3'], ncsOld:['인적자원관리','리더십','시간관리'] },
  mgr_rev2:   { ncs:['1-1','3-1'],       ncsOld:['문서이해','사고력'] },
  mgr_perf:   { ncs:['5-2','5-3','1-2'], ncsOld:['리더십','갈등관리','의사표현'] },
  mgr_esc:    { ncs:['3-3','5-2','1-1'], ncsOld:['문제처리','리더십','문서작성'] },
  /* 부서 — WORKDEFS kind 기준 1차 추정: sheet→2-3/6-1, audit→3-1/1-1, form→1-1 */
  m1:{ncs:['1-1','2-1'],ncsOld:['문서이해','기초연산'],todo:true}, m2:{ncs:['2-3','6-1','7-1'],ncsOld:['도표작성','컴퓨터활용','근로윤리'],todo:true},
  m3:{ncs:['1-1'],ncsOld:['문서작성'],todo:true}, m4:{ncs:['3-1','1-1'],ncsOld:['사고력','문서이해'],todo:true},
  m5:{todo:true}, m6:{todo:true}, m7:{todo:true}, m8:{todo:true},
  h1:{todo:true}, h2:{todo:true}, h3:{todo:true}, h4:{ncs:['3-1','1-1'],ncsOld:['사고력','문서이해'],todo:true},
  h5:{todo:true}, h6:{todo:true}, h8:{todo:true}, h9:{ncs:['2-3','6-1'],ncsOld:['도표작성','컴퓨터활용'],todo:true},
  g1:{ncs:['2-3','6-1'],ncsOld:['도표작성','컴퓨터활용'],todo:true}, g2:{ncs:['1-1'],ncsOld:['문서작성'],todo:true},
  g3:{todo:true}, g4:{ncs:['3-1','1-1'],ncsOld:['사고력','문서이해'],todo:true}, g5:{todo:true}, g6:{todo:true}, g7:{todo:true}, g8:{todo:true},
  s1:{todo:true}, s2:{ncs:['1-1'],ncsOld:['문서작성'],todo:true}, s3:{todo:true}, s4:{ncs:['3-1','1-1'],ncsOld:['사고력','문서이해'],todo:true},
  s5:{todo:true}, s6:{todo:true}, s8:{todo:true},
  /* 3D 퀘스트(기존) */
  q_printer:{ncs:['5-1','7-2'],ncsOld:['팀워크','공동체윤리']}, q_tea:{ncs:['5-1','7-2'],ncsOld:['고객서비스','공동체윤리']},
};

/* ----------------------------------------------------------------------------
 * E. 리포트 — 7번째 축 "디지털능력" + 하위능력별 집계. buildReport() 에 삽입할 코드 조각
 * -------------------------------------------------------------------------- */
const NCS_REPORT_PATCH = {

  /* RANKS[*].weights 에 추가 */
  weights: { jr:{digital:1.0}, mid:{digital:1.1}, mgr:{digital:1.0} },

  /* skills 배열 뒤에 push. logs = G.actionLogs, arrived = 도착 아이템 */
  digitalFormula: `
  // 7) 디지털능력(6-x): ncs 첫 코드가 6-으로 시작하는 아이템·퀘스트의 행동 점수 평균.
  //    이메일 채점(emailScore)이 있으면 행동 60% + 첨삭 40% 혼합 (comm 과 동일 철학). 표본 없으면 60(보류).
  const isDigital = it => it && Array.isArray(it.ncs) && it.ncs.some(c=>c.startsWith('6-'));
  const digPool = logs.filter(l=>{ const it=G.items.find(x=>x.id===l.id) || (typeof QUESTDEFS!=='undefined'&&QUESTDEFS[l.id]); return isDigital(it); })
    .map(l=>{ const it=G.items.find(x=>x.id===l.id); return (it&&it.emailScore!=null) ? Math.round(l.score*0.6+it.emailScore*0.4) : l.score; })
    .concat(arrived.filter(i=>isDigital(i)&&!i.done&&!i.noPenalty).map(()=>20));
  const digital = digPool.length ? avg(digPool) : 60;
  skills.push(['디지털 · AI 활용과 책임', digital]);
  // WKEY 에 'digital' 추가: const WKEY = ['time','judge','comm','deleg','info','press','digital'];
  `,

  /* 하위능력별 점수(강사 화면·export 용). buildReport 끝에서 G.reportData.ncsBreakdown 에 저장 */
  breakdownFn: `
  function ncsBreakdown(logs, arrived){
    const acc = {};                                      // code → [scores]
    const push = (code, s) => { (acc[code] = acc[code] || []).push(s); };
    logs.forEach(l=>{
      const it = G.items.find(x=>x.id===l.id) || (typeof QUESTDEFS!=='undefined' && QUESTDEFS[l.id]);
      if(!it || !Array.isArray(it.ncs)) return;
      const s = (it.emailScore!=null) ? Math.round(l.score*0.6 + it.emailScore*0.4) : l.score;
      it.ncs.forEach((code, i)=> push(code, i===0 ? s : Math.round(s*0.5 + 50*0.5)));   // 부(副) 역량은 절반 가중(중심 50 회귀)
    });
    arrived.filter(i=>!i.done && !i.noPenalty && Array.isArray(i.ncs)).forEach(i=> i.ncs.forEach(c=>push(c, 20)));
    const out = {};
    Object.keys(acc).forEach(c=>{ out[c] = { n: acc[c].length, score: Math.round(acc[c].reduce((a,b)=>a+b,0)/acc[c].length) }; });
    return out;                                          // {'6-2':{n:3,score:72}, ...}
  }`,

  /* 라벨 교체(신 용어 + 구 용어 병기 1년) */
  labels: {
    time:   '시간관리 (우선순위·마감)',
    judge:  '문제분석 · 의사결정 (상황판단)',
    comm:   '문서소통 (업무 이메일)',
    deleg:  '협업 · 의사결정 (위임과 배분)',
    info:   '문서이해 · 디지털활용 (정보 정확성)',
    press:  '적응 · 갈등관리 (압박 상황 대처)',
    digital:'디지털 · AI 활용과 책임',
  },

  /* 등급 → KRIVET 5수준 병기 */
  levelOf: `const LEVEL = t => t>=85?'숙련~전문':t>=70?'적응':t>=55?'준비~적응':t>=40?'준비':'초보';
  $('rpGrade').textContent = grade+' 등급 · '+LEVEL(total)+' 수준';`,
};

/* ----------------------------------------------------------------------------
 * F. 자기 검증 — node docs/ncs-new-items.js 로 실행하면 스키마·점수·태그 코드 검사
 * -------------------------------------------------------------------------- */
if (typeof module !== 'undefined' && require.main === module) {
  const fs = require('fs'), path = require('path');
  const comp = JSON.parse(fs.readFileSync(path.join(__dirname, 'ncs-competencies.json'), 'utf8'));
  const codes = new Set(comp.new.areas.flatMap(a=>a.sub.map(s=>s.id)));
  const olds  = new Set(comp.old.areas.flatMap(a=>a.sub));
  const ACTS  = ['reply','hold','delegate','reject','confirm','accept'];
  let err = 0;
  const bad = (m)=>{ console.error('✗ '+m); err++; };
  const checkTags = (id, o)=>{
    (o.ncs||[]).forEach(c=>{ if(!codes.has(c)) bad(id+': 알 수 없는 ncs 코드 '+c); });
    (o.ncsOld||[]).forEach(c=>{ if(!olds.has(c)) bad(id+': 알 수 없는 ncsOld '+c); });
  };
  Object.entries(NCS_NEW_ITEMS).forEach(([k, it])=>{
    if(it.id!==k) bad(k+': id 불일치');
    if(!it.tracks||!it.tracks.length) bad(k+': tracks 없음');
    if(!['email','msg','approval'].includes(it.type)) bad(k+': type '+it.type);
    if(!it.act || !it.act[it.best]) bad(k+': act['+it.best+'] 없음');
    Object.entries(it.act||{}).forEach(([a,v])=>{
      if(!ACTS.includes(a)) bad(k+': 알 수 없는 act '+a);
      if(!Array.isArray(v)||typeof v[0]!=='number'||v[0]<0||v[0]>100) bad(k+': act.'+a+' 점수 형식');
    });
    if(it.act && it.act[it.best][0] !== Math.max(...Object.values(it.act).map(v=>v[0]))) bad(k+': best 가 최고점이 아님');
    if(!it.indicator) bad(k+': indicator 없음');
    if(it.time<9||it.time>18) bad(k+': time 범위');
    if(it.deadline!=null && it.deadline<=it.time) bad(k+': deadline ≤ time');
    checkTags(k, it);
  });
  Object.entries(NCS_NEW_QUESTS).forEach(([k,q])=>{
    if(q.choices.filter(c=>c.best).length!==1) bad(k+': best 선택지가 1개가 아님');
    const top = Math.max(...q.choices.map(c=>c.score));
    if(q.choices.find(c=>c.best).score!==top) bad(k+': best 가 최고점이 아님');
    checkTags(k, q);
  });
  Object.entries(NCS_TAGS).forEach(([k,t])=>checkTags(k,t));
  const attachRefs = ['ai_draft_doc','ai_rule_doc','dr_roster','al_manual','num_compare'];
  attachRefs.forEach(a=>{ if(!NCS_NEW_ATTACH[a]) bad('첨부 누락 '+a); });
  const byCode = {};
  [...Object.values(NCS_NEW_ITEMS), ...Object.values(NCS_NEW_QUESTS)].forEach(o=>o.ncs.forEach((c,i)=>{ byCode[c]=(byCode[c]||0)+(i===0?1:0); }));
  console.log('신규 아이템', Object.keys(NCS_NEW_ITEMS).length, '· 퀘스트', Object.keys(NCS_NEW_QUESTS).length, '· 첨부', Object.keys(NCS_NEW_ATTACH).length);
  console.log('주(主) 역량 커버(신규):', JSON.stringify(byCode));
  console.log('태깅 TODO:', Object.values(NCS_TAGS).filter(t=>t.todo).length, '개');
  console.log(err ? ('검사 실패 '+err+'건') : '✓ 검사 통과');
  process.exit(err?1:0);
}
