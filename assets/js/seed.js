// ---------------------------------------------------------------------------
// Dream Store · 시드 데이터
// 시연용 초기 데이터. 실제 운영 시에는 Supabase 테이블이 원본이 됩니다.
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  { id: 'all', label: '전체', icon: '🗂️' },
  { id: 'sales', label: '영업', icon: '🤝' },
  { id: 'hr', label: '인사', icon: '👥' },
  { id: 'finance', label: '재무', icon: '📊' },
  { id: 'planning', label: '기획', icon: '🧭' },
  { id: 'dev', label: '개발', icon: '💻' },
  { id: 'marketing', label: '마케팅', icon: '📣' },
  { id: 'common', label: '공통', icon: '✨' },
];

export const TYPES = [
  { id: 'skill', label: 'Skill' },
  { id: 'mcp', label: 'MCP' },
  { id: 'subagent', label: 'Subagent' },
  { id: 'prompt', label: '프롬프트' },
];

export const AGENTS = [
  { id: 'claude', label: 'Claude' },
  { id: 'chatgpt', label: 'ChatGPT' },
];

export const ORIGINS = [
  { id: 'build', label: '자체 제작', icon: '🛠️' },
  { id: 'curate', label: '큐레이션', icon: '🔍' },
];

export const TASK_TYPES = [
  '문서 작성',
  '데이터 분석',
  '코드 작성·리뷰',
  '고객 대응',
  '회의·보고',
  '리서치',
  '기타',
];

export const CURRENT_USER = { name: '한현석', dept: 'AI추진팀' };

const t = (o) => ({ ...o });

export const TOOLS = [
  // ── 개발 ────────────────────────────────────────────────────────────────
  t({
    id: 'github-mcp', name: 'GitHub MCP', icon: '🐙', type: 'mcp', origin: 'curate',
    agents: ['claude', 'chatgpt'], category: 'dev',
    tagline: '이슈·PR·코드 검색을 에이전트가 직접 처리',
    description:
      'GitHub 공식 MCP 서버입니다. 저장소 탐색, 이슈 생성, PR 리뷰 코멘트 작성, 코드 검색까지 에이전트가 직접 수행합니다. 브라우저를 오가며 컨텍스트를 잃는 일이 사라집니다.',
    useCase:
      '스프린트 마감마다 이번 주 머지된 PR을 전부 읽고 릴리즈 노트를 쓰는 데 2시간씩 썼습니다. 지금은 "이번 주 main에 머지된 PR 요약해서 릴리즈 노트 초안 만들어줘" 한 줄이면 끝납니다. 이슈 라벨 정리도 맡기고 있습니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add github -- npx -y @modelcontextprotocol/server-github' },
    author: { name: '정우진', dept: '플랫폼개발팀' },
    createdAt: '2026-04-18', installs: 118, reuse: 0.86, mau: 96, rating: 4.8, reviews: 31, savedHours: 142,
  }),
  t({
    id: 'playwright-mcp', name: 'Playwright MCP', icon: '🎭', type: 'mcp', origin: 'curate',
    agents: ['claude'], category: 'dev',
    tagline: '브라우저를 직접 조작해 QA 시나리오를 자동 검증',
    description:
      '에이전트가 실제 브라우저를 띄워 화면을 보고 클릭·입력하며 동작을 검증합니다. 스크린샷을 근거로 판단하므로 "된다고 하는데 안 되는" 상황이 줄어듭니다.',
    useCase:
      '릴리즈 전 회귀 테스트 시나리오 40개를 QA 담당자가 수동으로 돌렸습니다. 지금은 시나리오 문서를 그대로 주면 에이전트가 브라우저에서 실행하고 실패 지점을 스크린샷으로 잡아줍니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add playwright -- npx -y @playwright/mcp@latest' },
    author: { name: '서지호', dept: '품질보증팀' },
    createdAt: '2026-05-02', installs: 64, reuse: 0.78, mau: 47, rating: 4.6, reviews: 17, savedHours: 88,
  }),
  t({
    id: 'context7-mcp', name: 'Context7 MCP', icon: '📚', type: 'mcp', origin: 'curate',
    agents: ['claude', 'chatgpt'], category: 'dev',
    tagline: '라이브러리 최신 문서를 실시간으로 주입',
    description:
      '에이전트가 오래된 학습 데이터로 옛날 API를 쓰는 문제를 해결합니다. 질문 시점의 공식 문서를 가져와 컨텍스트에 넣어주므로, 버전이 빠르게 바뀌는 프레임워크 작업에서 특히 효과가 큽니다.',
    useCase:
      '에이전트가 만들어준 코드가 deprecated API를 써서 매번 직접 문서를 찾아 고쳤습니다. 설치 후로는 "최신 문서 기준으로 작성해줘" 한마디로 해결돼, 수정 왕복이 거의 사라졌습니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add context7 -- npx -y @upstash/context7-mcp' },
    author: { name: '정우진', dept: '플랫폼개발팀' },
    createdAt: '2026-05-21', installs: 57, reuse: 0.81, mau: 44, rating: 4.7, reviews: 14, savedHours: 61,
  }),
  t({
    id: 'code-review-skill', name: '사내 코드리뷰 체크리스트', icon: '🔎', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'dev',
    tagline: '우리 팀 컨벤션으로 1차 리뷰를 대신합니다',
    description:
      '사내 코딩 컨벤션, 보안 코딩 가이드, 과거 장애 사례에서 뽑은 체크리스트를 Skill로 묶었습니다. PR을 올리기 전 스스로 1차 리뷰를 돌려 지적 사항을 미리 정리할 수 있습니다.',
    useCase:
      '시니어 개발자가 리뷰에서 반복 지적하던 항목(널 체크 누락, 로깅에 개인정보 포함, 예외 삼키기)을 규칙화했습니다. 리뷰 왕복 횟수가 평균 3.2회에서 1.4회로 줄었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/dream-code-review/ 에 SKILL.md 배치' },
    author: { name: '정우진', dept: '플랫폼개발팀' },
    createdAt: '2026-03-27', installs: 73, reuse: 0.9, mau: 61, rating: 4.9, reviews: 24, savedHours: 118,
  }),
  t({
    id: 'vuln-report-skill', name: '취약점 진단 리포트 작성', icon: '🛡️', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'dev',
    tagline: '스캐너 결과를 고객 제출용 보고서로 변환',
    description:
      '진단 도구가 뱉은 원시 결과를 우리 회사 표준 진단 보고서 양식으로 변환합니다. 위험도 분류, 조치 권고문, 요약 페이지까지 한 번에 구성됩니다.',
    useCase:
      '고객사 정기 진단 보고서 한 건을 쓰는 데 꼬박 하루가 걸렸습니다. 지금은 초안까지 30분이면 나오고, 담당자는 검토와 고객 맞춤 코멘트에만 집중합니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/vuln-report/ 에 SKILL.md 배치' },
    author: { name: '오세준', dept: '보안진단본부' },
    createdAt: '2026-04-09', installs: 41, reuse: 0.88, mau: 36, rating: 4.9, reviews: 15, savedHours: 132,
  }),
  t({
    id: 'api-spec-skill', name: 'API 명세 자동 생성', icon: '📐', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'dev',
    tagline: '컨트롤러 코드에서 OpenAPI 명세를 역생성',
    description:
      '기존 코드에서 엔드포인트, 요청·응답 스키마, 에러 코드를 추출해 OpenAPI 3.1 문서를 만듭니다. 문서화가 밀린 레거시 서비스에 특히 유용합니다.',
    useCase:
      '연동 요청이 올 때마다 명세를 손으로 정리해 보냈습니다. 지금은 저장소를 지정하면 초안이 나와, 연동 대응 리드타임이 3일에서 반나절로 줄었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/api-spec/ 에 SKILL.md 배치' },
    author: { name: '문가영', dept: '서비스개발2팀' },
    createdAt: '2026-06-01', installs: 29, reuse: 0.72, mau: 19, rating: 4.4, reviews: 9, savedHours: 44,
  }),

  // ── 영업 ────────────────────────────────────────────────────────────────
  t({
    id: 'proposal-skill', name: '고객사 제안서 초안 생성', icon: '📄', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'sales',
    tagline: 'RFP를 넣으면 우리 제품 기준 제안 목차가 나옵니다',
    description:
      '고객사 RFP 문서를 읽고 요구사항을 항목화한 뒤, 우리 회사 솔루션 라인업에 매핑해 제안서 목차와 핵심 메시지 초안을 만듭니다. 과거 수주 제안서의 논리 구조를 학습 자료로 포함했습니다.',
    useCase:
      'RFP를 받고 제안 목차를 잡는 데만 이틀이 걸렸습니다. 지금은 오전에 초안을 받아 오후에 팀 리뷰를 돌립니다. 제안 착수 속도가 빨라져 검토 시간을 더 확보하게 됐습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/proposal-draft/ 에 SKILL.md 배치' },
    author: { name: '김도현', dept: '공공영업1팀' },
    createdAt: '2026-03-14', installs: 96, reuse: 0.84, mau: 78, rating: 4.8, reviews: 28, savedHours: 186,
  }),
  t({
    id: 'sales-log-skill', name: '영업일지 요약·CRM 정리', icon: '🗒️', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'sales',
    tagline: '메모 한 줄을 CRM 입력 양식으로 정돈',
    description:
      '미팅 직후 휘갈긴 메모를 고객사·담당자·논의 주제·다음 액션·예상 수주 시점으로 구조화합니다. CRM 입력 포맷 그대로 출력됩니다.',
    useCase:
      '미팅이 몰린 날은 일지 작성이 밀려 주말에 몰아 썼습니다. 지금은 이동 중 음성 메모를 붙여넣기만 하면 정리돼, 기억이 선명할 때 바로 기록됩니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/sales-log/ 에 SKILL.md 배치' },
    author: { name: '배수민', dept: '금융영업팀' },
    createdAt: '2026-04-22', installs: 82, reuse: 0.79, mau: 63, rating: 4.5, reviews: 22, savedHours: 104,
  }),
  t({
    id: 'competitor-agent', name: '경쟁사 동향 리서치 에이전트', icon: '🔭', type: 'subagent', origin: 'build',
    agents: ['claude'], category: 'sales',
    tagline: '주간 경쟁사 소식을 자동 수집·요약',
    description:
      '지정한 경쟁사 목록에 대해 보도자료, 채용 공고, 공공 입찰 공고를 훑어 변화 신호를 정리하는 서브에이전트입니다.',
    useCase:
      '매주 월요일 오전에 경쟁사 동향을 손으로 검색해 정리했습니다. 지금은 브리핑이 먼저 와 있어, 그 시간에 대응 전략을 논의합니다.',
    install: { label: 'Subagent 설치', snippet: '~/.claude/agents/competitor-scout.md 배치' },
    author: { name: '김도현', dept: '공공영업1팀' },
    createdAt: '2026-05-30', installs: 38, reuse: 0.74, mau: 27, rating: 4.5, reviews: 11, savedHours: 52,
  }),

  // ── 인사 ────────────────────────────────────────────────────────────────
  t({
    id: 'jd-writer-skill', name: '채용 공고 작성', icon: '📢', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'hr',
    tagline: '직무 요건을 지원자 언어로 번역',
    description:
      '현업이 준 거친 요건 메모를 채용 공고 형식으로 다듬습니다. 우리 회사 채용 브랜딩 톤과 필수/우대 요건 분리 기준을 규칙으로 담았습니다.',
    useCase:
      '현업에서 "경력 5년, Java 잘하는 사람" 정도로 요청이 오면 인사팀이 되물어가며 공고를 만들었습니다. 지금은 초안을 먼저 만들어 현업에 확인받는 방식으로 바뀌어 왕복이 크게 줄었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/jd-writer/ 에 SKILL.md 배치' },
    author: { name: '한지우', dept: '인재개발팀' },
    createdAt: '2026-04-05', installs: 44, reuse: 0.71, mau: 29, rating: 4.6, reviews: 13, savedHours: 58,
  }),
  t({
    id: 'interview-skill', name: '면접 질문 설계', icon: '🎙️', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'hr',
    tagline: '이력서 기반 맞춤 질문과 평가 기준을 함께',
    description:
      '지원자 이력서와 채용 요건을 대조해 검증이 필요한 지점을 뽑고, 질문과 함께 "이런 답이면 상/중/하" 평가 기준까지 제시합니다.',
    useCase:
      '면접관마다 질문 수준이 달라 평가가 들쭉날쭉했습니다. 공통 기준이 생기면서 면접 후 합의 논의 시간이 절반으로 줄었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/interview-design/ 에 SKILL.md 배치' },
    author: { name: '한지우', dept: '인재개발팀' },
    createdAt: '2026-05-11', installs: 36, reuse: 0.83, mau: 28, rating: 4.7, reviews: 12, savedHours: 47,
  }),
  t({
    id: 'hr-policy-agent', name: '인사 규정 Q&A 에이전트', icon: '📕', type: 'subagent', origin: 'build',
    agents: ['claude'], category: 'hr',
    tagline: '취업규칙·복리후생 문의에 근거 조항과 함께 답변',
    description:
      '사내 인사 규정 문서를 근거로 질문에 답하고, 반드시 해당 조항을 함께 인용합니다. 규정에 없는 사항은 "확인 필요"로 명시해 임의 답변을 막습니다.',
    useCase:
      '연차·경조사·재택 규정 문의가 인사팀에 하루 20건 넘게 들어왔습니다. 단순 문의가 걸러지면서 인사팀이 제도 설계에 쓰는 시간이 늘었습니다.',
    install: { label: 'Subagent 설치', snippet: '~/.claude/agents/hr-policy.md 배치' },
    author: { name: '류하은', dept: '인사팀' },
    createdAt: '2026-05-25', installs: 51, reuse: 0.8, mau: 41, rating: 4.6, reviews: 16, savedHours: 76,
  }),

  // ── 재무 ────────────────────────────────────────────────────────────────
  t({
    id: 'budget-skill', name: '예산 집행 현황 분석', icon: '💰', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'finance',
    tagline: '집행률 이상 항목을 먼저 짚어줍니다',
    description:
      '부서별 예산 집행 데이터를 넣으면 계획 대비 편차가 큰 항목을 우선 정렬하고, 잔여 기간 기준 소진 예상 시점을 계산합니다.',
    useCase:
      '월말마다 부서별 집행률을 피벗으로 돌려 이상 항목을 찾았습니다. 지금은 "이번 달 주의가 필요한 계정" 목록이 바로 나와 확인 시간이 크게 줄었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/budget-analysis/ 에 SKILL.md 배치' },
    author: { name: '신재호', dept: '재무회계팀' },
    createdAt: '2026-04-30', installs: 33, reuse: 0.85, mau: 27, rating: 4.7, reviews: 10, savedHours: 63,
  }),
  t({
    id: 'invoice-skill', name: '세금계산서 대사', icon: '🧾', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'finance',
    tagline: '발행 내역과 회계 전표를 대조해 불일치만 추출',
    description:
      '세금계산서 발행 내역과 전표 데이터를 대조해 금액·일자·거래처가 어긋나는 건만 뽑아 사유 후보와 함께 제시합니다.',
    useCase:
      '분기 마감 때 수백 건을 눈으로 대조했습니다. 지금은 불일치 후보만 확인하면 돼, 마감 야근이 사라졌습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/invoice-recon/ 에 SKILL.md 배치' },
    author: { name: '신재호', dept: '재무회계팀' },
    createdAt: '2026-06-08', installs: 21, reuse: 0.9, mau: 18, rating: 4.8, reviews: 7, savedHours: 71,
  }),
  t({
    id: 'postgres-mcp', name: 'PostgreSQL MCP', icon: '🐘', type: 'mcp', origin: 'curate',
    agents: ['claude'], category: 'finance',
    tagline: '자연어로 묻고 SQL 결과로 받습니다',
    description:
      '읽기 전용으로 DB에 연결해 스키마를 이해하고 질의를 수행합니다. SQL을 직접 쓰지 않는 담당자도 데이터를 확인할 수 있습니다.',
    useCase:
      '간단한 집계도 개발팀에 요청해 하루씩 기다렸습니다. 읽기 전용 계정을 붙인 뒤로는 직접 물어보고 바로 확인합니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres $DB_URL' },
    author: { name: '문가영', dept: '서비스개발2팀' },
    createdAt: '2026-05-16', installs: 47, reuse: 0.76, mau: 34, rating: 4.5, reviews: 13, savedHours: 69,
  }),

  // ── 기획 ────────────────────────────────────────────────────────────────
  t({
    id: 'prd-skill', name: 'PRD 작성 도우미', icon: '📝', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'planning',
    tagline: '아이디어를 검토 가능한 기획 문서로',
    description:
      '거친 아이디어를 배경·문제 정의·타겟·핵심 가치·기능 목록·성공 지표 구조로 정리합니다. 빠진 항목은 질문으로 되물어 문서의 구멍을 막습니다.',
    useCase:
      '기획 초안을 쓰다 보면 성공 지표나 비범위 정의를 빠뜨려 리뷰에서 되돌아왔습니다. 지금은 되물어주는 항목만 채워도 리뷰 통과율이 확 올랐습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/prd-writer/ 에 SKILL.md 배치' },
    author: { name: '한현석', dept: 'AI추진팀' },
    createdAt: '2026-03-20', installs: 88, reuse: 0.87, mau: 72, rating: 4.9, reviews: 26, savedHours: 151,
  }),
  t({
    id: 'meeting-skill', name: '회의록 → 액션아이템 변환', icon: '✅', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'planning',
    tagline: '결정 사항과 담당자·기한을 자동 분리',
    description:
      '회의록 원문에서 결정된 것, 보류된 것, 액션아이템을 분리하고 담당자와 기한을 표로 정리합니다. 담당자가 불명확한 항목은 따로 표시합니다.',
    useCase:
      '회의는 했는데 누가 뭘 하기로 했는지 흐려지는 일이 잦았습니다. 회의 직후 액션아이템 표를 공유하면서 후속 누락이 눈에 띄게 줄었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/meeting-action/ 에 SKILL.md 배치' },
    author: { name: '윤소라', dept: '전략기획팀' },
    createdAt: '2026-04-02', installs: 104, reuse: 0.82, mau: 84, rating: 4.7, reviews: 33, savedHours: 168,
  }),
  t({
    id: 'notion-mcp', name: 'Notion MCP', icon: '🗃️', type: 'mcp', origin: 'curate',
    agents: ['claude', 'chatgpt'], category: 'planning',
    tagline: '문서를 찾고 쓰는 일을 에이전트에게',
    description:
      'Notion 워크스페이스를 검색하고 페이지를 생성·수정합니다. 흩어진 기획 문서를 찾아 읽는 시간을 줄여줍니다.',
    useCase:
      '"작년에 비슷한 검토 했던 것 같은데" 하고 문서를 뒤지는 데 시간을 많이 썼습니다. 지금은 물어보면 관련 문서를 찾아 요약까지 해줍니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add notion -- npx -y @notionhq/notion-mcp-server' },
    author: { name: '윤소라', dept: '전략기획팀' },
    createdAt: '2026-05-08', installs: 62, reuse: 0.73, mau: 43, rating: 4.4, reviews: 18, savedHours: 72,
  }),
  t({
    id: 'exec-report-skill', name: '경영보고 슬라이드 구성', icon: '📈', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'planning',
    tagline: '보고 대상에 맞춰 메시지 순서를 재배치',
    description:
      '같은 내용도 실무 리뷰용과 경영진 보고용은 순서가 달라야 합니다. 결론 우선 구조로 재배열하고 장표별 핵심 메시지를 한 줄로 뽑아줍니다.',
    useCase:
      '실무 자료를 경영진 보고용으로 다시 만드느라 반복 작업이 많았습니다. 지금은 구조 변환을 먼저 받아 다듬는 방식으로 바꿨습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/exec-report/ 에 SKILL.md 배치' },
    author: { name: '윤소라', dept: '전략기획팀' },
    createdAt: '2026-06-12', installs: 45, reuse: 0.8, mau: 35, rating: 4.6, reviews: 12, savedHours: 66,
  }),

  // ── 마케팅 ──────────────────────────────────────────────────────────────
  t({
    id: 'copy-skill', name: '콘텐츠 카피 생성', icon: '✍️', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'marketing',
    tagline: '채널별 톤에 맞춰 카피를 한 번에',
    description:
      '하나의 메시지를 링크드인·블로그·뉴스레터·배너 등 채널 특성에 맞게 변형합니다. 보안 업계 용어 사용 기준을 규칙으로 담았습니다.',
    useCase:
      '캠페인마다 채널별 카피를 따로 썼습니다. 지금은 한 번에 변형본을 받아 고르는 방식이라 제작 시간이 크게 줄었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/copy-writer/ 에 SKILL.md 배치' },
    author: { name: '조은채', dept: '마케팅커뮤니케이션팀' },
    createdAt: '2026-04-26', installs: 39, reuse: 0.7, mau: 25, rating: 4.3, reviews: 11, savedHours: 41,
  }),
  t({
    id: 'seo-skill', name: 'SEO 키워드 리서치', icon: '🔑', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'marketing',
    tagline: '검색 의도까지 분류한 키워드 세트',
    description:
      '주제어에서 연관 키워드를 확장하고 정보형·비교형·구매형으로 검색 의도를 분류해 콘텐츠 우선순위를 제안합니다.',
    useCase:
      '키워드 도구 결과를 손으로 분류하는 데 반나절이 들었습니다. 지금은 분류된 결과를 검토만 하면 됩니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/seo-research/ 에 SKILL.md 배치' },
    author: { name: '조은채', dept: '마케팅커뮤니케이션팀' },
    createdAt: '2026-06-03', installs: 24, reuse: 0.66, mau: 14, rating: 4.2, reviews: 8, savedHours: 27,
  }),
  t({
    id: 'brave-mcp', name: 'Brave Search MCP', icon: '🦁', type: 'mcp', origin: 'curate',
    agents: ['claude'], category: 'marketing',
    tagline: '최신 웹 검색 결과를 에이전트 컨텍스트로',
    description:
      '실시간 웹 검색 결과를 에이전트가 직접 조회합니다. 시장 동향이나 최신 기사처럼 학습 데이터에 없는 정보를 다룰 때 필요합니다.',
    useCase:
      '시장 리서치를 할 때 검색하고 읽고 정리하는 과정을 반복했습니다. 지금은 질문을 주면 조사와 요약을 함께 받아 검증에 집중합니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add brave-search -- npx -y @modelcontextprotocol/server-brave-search' },
    author: { name: '조은채', dept: '마케팅커뮤니케이션팀' },
    createdAt: '2026-05-19', installs: 55, reuse: 0.69, mau: 36, rating: 4.4, reviews: 15, savedHours: 58,
  }),

  // ── 공통 ────────────────────────────────────────────────────────────────
  t({
    id: 'filesystem-mcp', name: 'Filesystem MCP', icon: '📁', type: 'mcp', origin: 'curate',
    agents: ['claude'], category: 'common',
    tagline: '로컬 폴더의 문서를 직접 읽고 정리',
    description:
      '지정한 폴더 범위 안에서 파일을 읽고 씁니다. 접근 가능한 경로를 명시적으로 제한할 수 있어 통제된 범위에서 사용할 수 있습니다.',
    useCase:
      '문서 수십 개를 하나씩 열어 내용을 대조했습니다. 지금은 폴더를 지정하고 "이 중 개정 필요한 문서 찾아줘"로 끝냅니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/work' },
    author: { name: '한현석', dept: 'AI추진팀' },
    createdAt: '2026-03-30', installs: 121, reuse: 0.75, mau: 88, rating: 4.5, reviews: 29, savedHours: 124,
  }),
  t({
    id: 'slack-mcp', name: 'Slack MCP', icon: '💬', type: 'mcp', origin: 'curate',
    agents: ['claude'], category: 'common',
    tagline: '채널 대화를 읽고 요약·정리',
    description:
      '채널과 스레드를 조회해 요약하거나 메시지를 보냅니다. 자리를 비운 사이 쌓인 논의를 따라잡는 데 특히 유용합니다.',
    useCase:
      '휴가 복귀 후 채널 수십 개를 스크롤로 훑었습니다. 지금은 "지난 주 내가 언급된 스레드 요약해줘"로 30분 만에 복귀합니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add slack -- npx -y @modelcontextprotocol/server-slack' },
    author: { name: '배수민', dept: '금융영업팀' },
    createdAt: '2026-04-14', installs: 93, reuse: 0.71, mau: 66, rating: 4.3, reviews: 25, savedHours: 97,
  }),
  t({
    id: 'tone-skill', name: '문서 톤앤매너 교정', icon: '🖋️', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'common',
    tagline: '사외 발송 문서의 표현을 사내 기준으로',
    description:
      '고객사 발송 문서의 어투, 과장 표현, 보안 업계에서 조심해야 할 단정적 표현을 점검하고 대안을 제시합니다.',
    useCase:
      '사외 문서는 팀장 검토를 꼭 거쳐야 했는데, 표현 지적이 대부분이었습니다. 사전 교정을 돌린 뒤로 검토가 내용 중심으로 바뀌었습니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/tone-check/ 에 SKILL.md 배치' },
    author: { name: '류하은', dept: '인사팀' },
    createdAt: '2026-05-06', installs: 77, reuse: 0.77, mau: 58, rating: 4.6, reviews: 21, savedHours: 89,
  }),
  t({
    id: 'email-skill', name: '이메일 초안 작성', icon: '📧', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'common',
    tagline: '상황과 상대에 맞춘 메일을 3안으로',
    description:
      '용건과 상대를 알려주면 정중함 수준이 다른 3개 안을 제시합니다. 거절, 일정 조율, 사과처럼 어려운 메일에서 효과가 큽니다.',
    useCase:
      '까다로운 메일 한 통에 30분씩 붙들려 있었습니다. 지금은 3안 중 고르고 다듬어 5분이면 보냅니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/email-draft/ 에 SKILL.md 배치' },
    author: { name: '배수민', dept: '금융영업팀' },
    createdAt: '2026-04-11', installs: 112, reuse: 0.68, mau: 74, rating: 4.4, reviews: 30, savedHours: 133,
  }),
  t({
    id: 'excel-skill', name: 'Excel·CSV 분석', icon: '📉', type: 'skill', origin: 'build',
    agents: ['claude'], category: 'common',
    tagline: '표를 던지면 이상치와 인사이트를 먼저',
    description:
      '스프레드시트를 읽어 기초 통계, 이상치, 눈에 띄는 패턴을 정리합니다. 피벗을 돌리기 전 방향을 잡는 데 씁니다.',
    useCase:
      '데이터를 받으면 어디부터 볼지 정하는 데 시간이 걸렸습니다. 지금은 요약을 먼저 받고 관심 지점만 깊게 봅니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/sheet-analysis/ 에 SKILL.md 배치' },
    author: { name: '신재호', dept: '재무회계팀' },
    createdAt: '2026-05-14', installs: 69, reuse: 0.74, mau: 49, rating: 4.5, reviews: 19, savedHours: 81,
  }),
  t({
    id: 'memory-mcp', name: 'Memory MCP', icon: '🧠', type: 'mcp', origin: 'curate',
    agents: ['claude'], category: 'common',
    tagline: '대화가 바뀌어도 맥락을 기억',
    description:
      '반복해서 설명하던 프로젝트 배경과 선호를 저장해 다음 대화에서 이어 씁니다. 매번 처음부터 설명하는 낭비를 줄입니다.',
    useCase:
      '새 대화를 열 때마다 프로젝트 배경을 붙여넣었습니다. 지금은 바로 본론으로 들어갑니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add memory -- npx -y @modelcontextprotocol/server-memory' },
    author: { name: '한현석', dept: 'AI추진팀' },
    createdAt: '2026-06-17', installs: 43, reuse: 0.72, mau: 31, rating: 4.4, reviews: 10, savedHours: 39,
  }),
  t({
    id: 'weekly-skill', name: '주간보고 자동 정리', icon: '🗓️', type: 'skill', origin: 'build',
    agents: ['claude', 'chatgpt'], category: 'common',
    tagline: '한 주의 흔적을 모아 보고 양식으로',
    description:
      '이슈 트래커, 일정, 메모에 남은 한 주의 활동을 모아 사내 주간보고 양식으로 정리합니다. 다음 주 계획 초안까지 제안합니다.',
    useCase:
      '금요일 오후를 주간보고에 썼습니다. 지금은 초안을 받아 다듬는 데 15분이면 끝나, 그 시간을 회고에 씁니다.',
    install: { label: 'Skill 설치', snippet: '~/.claude/skills/weekly-report/ 에 SKILL.md 배치' },
    author: { name: '문가영', dept: '서비스개발2팀' },
    createdAt: '2026-03-24', installs: 134, reuse: 0.81, mau: 103, rating: 4.7, reviews: 38, savedHours: 214,
  }),
  t({
    id: 'seq-thinking-mcp', name: 'Sequential Thinking MCP', icon: '🧩', type: 'mcp', origin: 'curate',
    agents: ['claude'], category: 'common',
    tagline: '복잡한 문제를 단계로 쪼개 사고',
    description:
      '에이전트가 문제를 단계별로 분해해 검토하도록 유도합니다. 한 번에 답하면 자주 틀리는 복잡한 판단에서 정확도가 올라갑니다.',
    useCase:
      '조건이 얽힌 업무 규칙을 물으면 그럴듯하지만 틀린 답이 나오곤 했습니다. 설치 후 단계별 근거가 보여 검증이 쉬워졌습니다.',
    install: { label: 'MCP 설정', snippet: 'claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking' },
    author: { name: '서지호', dept: '품질보증팀' },
    createdAt: '2026-06-20', installs: 31, reuse: 0.7, mau: 22, rating: 4.3, reviews: 8, savedHours: 33,
  }),
];

// 도구별 대표 후기 (구조화 양식)
export const REVIEWS = [
  { toolId: 'weekly-skill', author: { name: '윤소라', dept: '전략기획팀' }, rating: 5, taskType: '회의·보고', beforeMin: 120, afterMin: 15, freqMonth: 4, comment: '금요일 오후를 통째로 돌려받았습니다. 팀원들에게 먼저 추천했어요.', createdAt: '2026-07-14' },
  { toolId: 'weekly-skill', author: { name: '오세준', dept: '보안진단본부' }, rating: 5, taskType: '문서 작성', beforeMin: 90, afterMin: 20, freqMonth: 4, comment: '양식이 우리 팀 것과 달라 한 번 손봤는데, 그 뒤로는 그대로 씁니다.', createdAt: '2026-07-09' },
  { toolId: 'weekly-skill', author: { name: '배수민', dept: '금융영업팀' }, rating: 4, taskType: '회의·보고', beforeMin: 100, afterMin: 30, freqMonth: 4, comment: '영업 활동은 자동 수집이 어려워 메모를 붙여넣어야 하지만 충분히 빨라졌습니다.', createdAt: '2026-07-02' },
  { toolId: 'proposal-skill', author: { name: '배수민', dept: '금융영업팀' }, rating: 5, taskType: '문서 작성', beforeMin: 960, afterMin: 240, freqMonth: 2, comment: 'RFP 요구사항 매핑이 정확합니다. 놓친 항목을 잡아준 적도 있어요.', createdAt: '2026-07-15' },
  { toolId: 'proposal-skill', author: { name: '김도현', dept: '공공영업1팀' }, rating: 5, taskType: '문서 작성', beforeMin: 900, afterMin: 300, freqMonth: 2, comment: '제안 착수가 빨라지니 내부 리뷰를 한 번 더 돌릴 여유가 생겼습니다.', createdAt: '2026-07-07' },
  { toolId: 'code-review-skill', author: { name: '문가영', dept: '서비스개발2팀' }, rating: 5, taskType: '코드 작성·리뷰', beforeMin: 60, afterMin: 15, freqMonth: 12, comment: 'PR 올리기 전에 한 번 돌리는 게 습관이 됐습니다. 리뷰 왕복이 확실히 줄었어요.', createdAt: '2026-07-16' },
  { toolId: 'code-review-skill', author: { name: '서지호', dept: '품질보증팀' }, rating: 5, taskType: '코드 작성·리뷰', beforeMin: 45, afterMin: 10, freqMonth: 10, comment: '과거 장애 사례가 규칙에 들어 있어 설득력이 있습니다.', createdAt: '2026-07-05' },
  { toolId: 'meeting-skill', author: { name: '한지우', dept: '인재개발팀' }, rating: 5, taskType: '회의·보고', beforeMin: 40, afterMin: 8, freqMonth: 12, comment: '담당자 불명확 항목을 따로 표시해주는 게 핵심입니다. 그 자리에서 정하게 되더군요.', createdAt: '2026-07-13' },
  { toolId: 'meeting-skill', author: { name: '신재호', dept: '재무회계팀' }, rating: 4, taskType: '회의·보고', beforeMin: 35, afterMin: 10, freqMonth: 8, comment: '녹취 품질이 나쁘면 결과도 흔들립니다. 그래도 충분히 유용합니다.', createdAt: '2026-07-01' },
  { toolId: 'github-mcp', author: { name: '문가영', dept: '서비스개발2팀' }, rating: 5, taskType: '코드 작성·리뷰', beforeMin: 120, afterMin: 20, freqMonth: 4, comment: '릴리즈 노트 작성이 완전히 달라졌습니다. 설치 5분이면 됩니다.', createdAt: '2026-07-17' },
  { toolId: 'github-mcp', author: { name: '서지호', dept: '품질보증팀' }, rating: 5, taskType: '리서치', beforeMin: 60, afterMin: 15, freqMonth: 8, comment: '이슈 히스토리를 추적할 때 브라우저를 안 열게 됐습니다.', createdAt: '2026-07-08' },
  { toolId: 'vuln-report-skill', author: { name: '서지호', dept: '품질보증팀' }, rating: 5, taskType: '문서 작성', beforeMin: 480, afterMin: 90, freqMonth: 3, comment: '고객 제출 양식이 그대로 나옵니다. 진단 인력이 분석에 집중할 수 있게 됐어요.', createdAt: '2026-07-12' },
  { toolId: 'prd-skill', author: { name: '윤소라', dept: '전략기획팀' }, rating: 5, taskType: '문서 작성', beforeMin: 240, afterMin: 60, freqMonth: 3, comment: '빠진 항목을 되물어주는 방식이 좋습니다. 문서 완성도가 올라갔습니다.', createdAt: '2026-07-11' },
  { toolId: 'prd-skill', author: { name: '김도현', dept: '공공영업1팀' }, rating: 5, taskType: '문서 작성', beforeMin: 180, afterMin: 50, freqMonth: 2, comment: '기획 문서를 안 써본 사람도 형태를 갖춘 문서를 낼 수 있습니다.', createdAt: '2026-07-03' },
  { toolId: 'email-skill', author: { name: '류하은', dept: '인사팀' }, rating: 4, taskType: '고객 대응', beforeMin: 30, afterMin: 6, freqMonth: 20, comment: '거절 메일 쓸 때 특히 유용합니다. 3안 중 고르는 방식이 마음에 들어요.', createdAt: '2026-07-10' },
  { toolId: 'hr-policy-agent', author: { name: '조은채', dept: '마케팅커뮤니케이션팀' }, rating: 5, taskType: '기타', beforeMin: 25, afterMin: 3, freqMonth: 6, comment: '조항을 같이 보여줘서 신뢰가 갑니다. 인사팀에 물어볼 일이 줄었어요.', createdAt: '2026-07-06' },
  { toolId: 'invoice-skill', author: { name: '한지우', dept: '인재개발팀' }, rating: 5, taskType: '데이터 분석', beforeMin: 600, afterMin: 120, freqMonth: 1, comment: '분기 마감 야근이 사라졌습니다. 재무팀 필수 도구입니다.', createdAt: '2026-07-04' },
  { toolId: 'filesystem-mcp', author: { name: '오세준', dept: '보안진단본부' }, rating: 4, taskType: '리서치', beforeMin: 90, afterMin: 25, freqMonth: 6, comment: '접근 경로를 제한할 수 있는 점이 좋습니다. 범위를 좁혀 쓰는 걸 권합니다.', createdAt: '2026-06-29' },
  { toolId: 'slack-mcp', author: { name: '정우진', dept: '플랫폼개발팀' }, rating: 4, taskType: '기타', beforeMin: 60, afterMin: 15, freqMonth: 4, comment: '휴가 복귀 다음 날 아침이 편해졌습니다.', createdAt: '2026-06-27' },
  { toolId: 'budget-skill', author: { name: '윤소라', dept: '전략기획팀' }, rating: 5, taskType: '데이터 분석', beforeMin: 180, afterMin: 40, freqMonth: 2, comment: '이상 항목을 먼저 보여주니 검토 순서가 잡힙니다.', createdAt: '2026-06-25' },
];
