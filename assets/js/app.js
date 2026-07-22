// ---------------------------------------------------------------------------
// Dream Store · 화면 및 라우팅
// ---------------------------------------------------------------------------

import { APP } from './config.js';
import { CATEGORIES, TYPES, AGENTS, ORIGINS, TASK_TYPES, IMPACT_TYPES, CURRENT_USER } from './seed.js';
import * as db from './store.js';

const $ = (s, r = document) => r.querySelector(s);
const app = () => $('#app');

// ── 유틸 ───────────────────────────────────────────────────────────────────

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const nf = (n) => Number(n).toLocaleString('ko-KR');
const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
const typeOf = (id) => TYPES.find((t) => t.id === id) || { label: id };
const originOf = (id) => ORIGINS.find((o) => o.id === id) || { label: id, icon: '' };
const agentLabel = (id) => (AGENTS.find((a) => a.id === id) || { label: id }).label;
// 과거 후기에는 impact 값이 없으므로 시간 절감으로 간주한다.
const impactOf = (id) => IMPACT_TYPES.find((x) => x.id === id) || IMPACT_TYPES[0];

function starHtml(rating) {
  const full = Math.round(Number(rating));
  return `<span class="stars">${'★'.repeat(full)}${'☆'.repeat(Math.max(0, 5 - full))}</span>`;
}

function toast(msg) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add('on'));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('on'), 2600);
}

// ── 라우터 ─────────────────────────────────────────────────────────────────

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '') || '';
  const [path, qs] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  return { view: parts[0] || 'home', id: parts[1] || null, q: new URLSearchParams(qs || '') };
}

const ROUTES = {
  home: viewHome,
  store: viewStore,
  tool: viewTool,
  review: viewReview,
  submit: viewSubmit,
  setup: viewSetup,
};

function render() {
  const r = parseRoute();
  const fn = ROUTES[r.view] || viewHome;
  app().innerHTML = `<div class="page-in">${fn(r)}</div>`;
  window.scrollTo({ top: 0 });
  markNav(r.view);
  (AFTER[r.view] || (() => {}))(r);
}

const AFTER = {};

function markNav(view) {
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('on', a.dataset.view === view);
  });
}

// ── 화면 1 · 랜딩 ──────────────────────────────────────────────────────────

function viewHome() {
  const t = db.totals();
  const tools = db.getTools();

  const popular = [...tools]
    .sort((a, b) => b.installs * (0.5 + b.reuse) - a.installs * (0.5 + a.reuse))
    .slice(0, 6);
  const fresh = [...tools].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 3);
  const top5 = db.ranking().slice(0, 5);

  return `
  <section class="hero">
    <div class="wrap hero-in">
      <h1>동료가 만든 AI 도구를 설치하면,<br>내 업무도 <em>그만큼 빨라집니다.</em></h1>
      <p>${esc(APP.company)} 임직원이 직접 만들고 발굴한 AI 도구를 한곳에서.
         설치하고, 써보고, 후기를 남기세요. 그 후기가 다음 사람의 선택을 돕습니다.</p>

      <div class="counter">
        <div class="kpi" data-icon="🧰">
          <div class="kpi-k">등록된 도구</div>
          <div class="kpi-v">${nf(t.tools)}<span class="kpi-u">개</span></div>
          <div class="kpi-note">기여자 ${nf(t.contributors)}명</div>
        </div>
        <div class="kpi" data-icon="⬇️">
          <div class="kpi-k">누적 설치</div>
          <div class="kpi-v">${nf(t.installs)}<span class="kpi-u">건</span></div>
          <div class="kpi-note">임직원 약 200명 대상</div>
        </div>
        <div class="kpi" data-icon="📝">
          <div class="kpi-k">등록된 후기</div>
          <div class="kpi-v">${nf(t.reviews)}<span class="kpi-u">건</span></div>
          <div class="kpi-note">구조화 평가 양식</div>
        </div>
      </div>
    </div>
  </section>

  <div class="wrap">
    <section class="sec">
      <div class="sec-hd">
        <h2>직무별로 찾아보기</h2>
      </div>
      <div class="cats">
        ${CATEGORIES.filter((c) => c.id !== 'all')
          .map((c) => {
            const n = db.getTools().filter((t) => t.category === c.id).length;
            return `<a class="cat" href="#/store?cat=${c.id}">${c.icon} ${esc(c.label)}
                      <span class="muted" style="font-weight:600">${n}</span></a>`;
          })
          .join('')}
      </div>
    </section>

    <section class="sec">
      <div class="sec-hd">
        <h2>이 주의 인기 도구</h2>
        <a class="more" href="#/store?sort=popular">전체 보기 →</a>
      </div>
      <div class="grid">${popular.map(cardHtml).join('')}</div>
    </section>

    <section class="sec">
      <div class="sec-hd">
        <h2>새로 등록된 도구</h2>
        <a class="more" href="#/store?sort=new">전체 보기 →</a>
      </div>
      <div class="grid">${fresh.map(cardHtml).join('')}</div>
    </section>

    <section class="sec">
      <div class="sec-hd">
        <h2>많이 쓰는 도구 TOP 5</h2>
        <a class="more" href="#/store?sort=popular">전체 보기 →</a>
      </div>
      <div class="rank">
        ${top5.map((r, i) => rankRowHtml(r, i)).join('')}
      </div>
    </section>
  </div>`;
}

function rankRowHtml({ tool }, i) {
  return `
  <div class="rrow" onclick="location.hash='#/tool/${tool.id}'">
    <div class="rnum">${i + 1}</div>
    <div class="ticon" style="width:38px;height:38px;font-size:19px;border-radius:10px">${tool.icon}</div>
    <div>
      <div class="rname">${esc(tool.name)}</div>
      <div class="rauth">${esc(tool.author.name)} · ${esc(tool.author.dept)} ·
        ${originOf(tool.origin).label}</div>
    </div>
    <div class="rstat">
      ${starHtml(tool.rating)}
      <b>${tool.rating ? Number(tool.rating).toFixed(1) : '–'}</b>
      <span class="muted">· 설치 ${nf(tool.installs)}</span>
    </div>
  </div>`;
}

// ── 카드 ───────────────────────────────────────────────────────────────────

function cardHtml(t) {
  const o = originOf(t.origin);
  return `
  <article class="tcard" onclick="location.hash='#/tool/${t.id}'">
    <div class="tcard-top">
      <div class="ticon">${t.icon}</div>
      <div style="min-width:0">
        <h3 class="tname">${esc(t.name)}</h3>
        <p class="ttag">${esc(t.tagline)}</p>
      </div>
    </div>
    <div class="tmeta">
      <span class="chip chip-${t.origin === 'build' ? 'build' : 'curate'}">${o.icon} ${o.label}</span>
      <span class="chip">${typeOf(t.type).label}</span>
      <span class="chip">${catOf(t.category).icon} ${catOf(t.category).label}</span>
      ${t.isNew ? '<span class="chip chip-new">NEW</span>' : ''}
    </div>
    <div class="tfoot">
      <span>${starHtml(t.rating)} <b>${t.rating ? Number(t.rating).toFixed(1) : '–'}</b></span>
      <span>설치 <b>${nf(t.installs)}</b></span>
    </div>
  </article>`;
}

// ── 화면 2 · 스토어 ────────────────────────────────────────────────────────

function viewStore({ q }) {
  const cat = q.get('cat') || 'all';
  const type = q.get('type') || 'all';
  const agent = q.get('agent') || 'all';
  const origin = q.get('origin') || 'all';
  const sort = q.get('sort') || 'popular';
  const kw = (q.get('q') || '').trim();

  let list = db.getTools();
  if (cat !== 'all') list = list.filter((t) => t.category === cat);
  if (type !== 'all') list = list.filter((t) => t.type === type);
  if (agent !== 'all') list = list.filter((t) => t.agents.includes(agent));
  if (origin !== 'all') list = list.filter((t) => t.origin === origin);
  if (kw) {
    const k = kw.toLowerCase();
    list = list.filter((t) =>
      [t.name, t.tagline, t.description, t.useCase, t.author.name, t.author.dept]
        .join(' ').toLowerCase().includes(k));
  }

  const sorters = {
    popular: (a, b) => b.installs * (0.5 + b.reuse) - a.installs * (0.5 + a.reuse),
    new: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
    rating: (a, b) => b.rating - a.rating,
  };
  list = [...list].sort(sorters[sort] || sorters.popular);

  const opt = (v, label, cur) =>
    `<option value="${v}"${v === cur ? ' selected' : ''}>${esc(label)}</option>`;

  return `
  <div class="wrap">
    <section class="sec" style="margin-top:34px">
      <div class="sec-hd">
        <h2>도구 둘러보기</h2>
        <a class="more" href="#/submit">＋ 내 도구 등록하기</a>
      </div>

      <div class="cats" style="margin-bottom:14px">
        ${CATEGORIES.map(
          (c) => `<a class="cat${c.id === cat ? ' on' : ''}"
                     href="#/store?${qstr({ cat: c.id, type, agent, origin, sort, q: kw })}">
                     ${c.icon} ${esc(c.label)}</a>`
        ).join('')}
      </div>

      <div class="filters">
        <div class="field search">
          <input type="text" id="f-q" placeholder="도구명, 사용 사례, 등록자로 검색" value="${esc(kw)}">
        </div>
        <div class="field">
          <label>유형</label>
          <select id="f-type">
            ${opt('all', '전체', type)}${TYPES.map((t) => opt(t.id, t.label, type)).join('')}
          </select>
        </div>
        <div class="field">
          <label>에이전트</label>
          <select id="f-agent">
            ${opt('all', '전체', agent)}${AGENTS.map((a) => opt(a.id, a.label, agent)).join('')}
          </select>
        </div>
        <div class="field">
          <label>구분</label>
          <select id="f-origin">
            ${opt('all', '전체', origin)}${ORIGINS.map((o) => opt(o.id, o.label, origin)).join('')}
          </select>
        </div>
        <div class="field">
          <label>정렬</label>
          <select id="f-sort">
            ${opt('popular', '인기순', sort)}${opt('new', '최신순', sort)}
            ${opt('rating', '평점순', sort)}
          </select>
        </div>
        <span class="count">${list.length}개</span>
      </div>

      ${list.length
        ? `<div class="grid">${list.map(cardHtml).join('')}</div>`
        : `<div class="empty"><div class="big">🔍</div>조건에 맞는 도구가 없습니다.<br>필터를 넓혀보세요.</div>`}
    </section>
  </div>`;
}

function qstr(o) {
  const p = new URLSearchParams();
  Object.entries(o).forEach(([k, v]) => {
    if (v && v !== 'all' && !(k === 'sort' && v === 'popular')) p.set(k, v);
  });
  return p.toString();
}

AFTER.store = ({ q }) => {
  const cur = {
    cat: q.get('cat') || 'all', type: q.get('type') || 'all',
    agent: q.get('agent') || 'all', origin: q.get('origin') || 'all',
    sort: q.get('sort') || 'popular', q: q.get('q') || '',
  };
  const go = (patch) => { location.hash = `#/store?${qstr({ ...cur, ...patch })}`; };

  $('#f-type')?.addEventListener('change', (e) => go({ type: e.target.value }));
  $('#f-agent')?.addEventListener('change', (e) => go({ agent: e.target.value }));
  $('#f-origin')?.addEventListener('change', (e) => go({ origin: e.target.value }));
  $('#f-sort')?.addEventListener('change', (e) => go({ sort: e.target.value }));

  const input = $('#f-q');
  if (input) {
    let timer;
    input.addEventListener('input', (e) => {
      clearTimeout(timer);
      const v = e.target.value;
      timer = setTimeout(() => {
        go({ q: v });
        setTimeout(() => {
          const el = $('#f-q');
          if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
        }, 0);
      }, 350);
    });
  }
};

// ── 화면 3 · 도구 상세 ─────────────────────────────────────────────────────

function viewTool({ id }) {
  const t = db.getTool(id);
  if (!t) return notFound();

  const reviews = db.getReviews(t.id);
  const installed = db.isInstalled(t.id);
  const o = originOf(t.origin);

  return `
  <div class="wrap" style="padding-top:28px">
    <div class="crumb"><a href="#/store">도구 둘러보기</a> ›
      <a href="#/store?cat=${t.category}">${esc(catOf(t.category).label)}</a> › ${esc(t.name)}</div>

    <div class="dhead">
      <div class="dicon">${t.icon}</div>
      <div style="min-width:0">
        <h1>${esc(t.name)}</h1>
        <p class="ttag">${esc(t.tagline)}</p>
        <div class="tmeta" style="margin-top:10px">
          <span class="chip chip-${t.origin === 'build' ? 'build' : 'curate'}">${o.icon} ${o.label}</span>
          <span class="chip">${typeOf(t.type).label}</span>
          <span class="chip">${catOf(t.category).icon} ${catOf(t.category).label}</span>
          ${t.agents.map((a) => `<span class="chip chip-brand">${esc(agentLabel(a))}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="detail" style="margin-top:24px">
      <div>
        <div class="card panel">
          <h3>📖 이 도구는</h3>
          <p>${esc(t.description)}</p>
        </div>

        <div class="card panel">
          <h3>💡 등록자의 사용 사례</h3>
          <div class="quote">${esc(t.useCase)}</div>
          <p class="muted" style="font-size:12.5px;margin-top:12px">
            — ${esc(t.author.name)} · ${esc(t.author.dept)}
          </p>
        </div>

        <div class="card panel">
          <h3>⚙️ ${esc(t.install.label)}</h3>
          <div class="snip">
            <code class="mono" id="snip">${esc(t.install.snippet || '설치 안내가 준비 중입니다.')}</code>
            <button class="btn btn-sm" id="copy">복사</button>
          </div>
          <p class="muted" style="font-size:12.5px;margin-top:10px">
            터미널 또는 에이전트 설정에 붙여넣으면 바로 사용할 수 있습니다.
          </p>
        </div>

        <div class="card panel">
          <h3>⭐ 사용 후기 <span class="muted" style="font-weight:600">${reviews.length}건</span></h3>
          ${reviews.length
            ? reviews.map(revHtml).join('')
            : `<p class="muted">아직 등록된 후기가 없습니다. 첫 후기를 남겨보세요.</p>`}
          <div style="margin-top:18px">
            <a class="btn btn-pri" href="#/review/${t.id}">후기 작성하기</a>
          </div>
        </div>
      </div>

      <aside>
        <div class="card panel">
          <button class="btn ${installed ? 'btn-done' : 'btn-pri'} btn-lg" id="install"
                  style="width:100%" ${installed ? 'disabled' : ''}>
            ${installed ? '✓ 설치됨' : '⬇ 설치하기'}
          </button>
          <div class="stat-rows" style="margin-top:18px">
            <div class="srow"><span class="k">평점</span>
              ${starHtml(t.rating)}<span class="v">${t.rating ? Number(t.rating).toFixed(1) : '–'}</span></div>
            <div class="srow"><span class="k">설치 수</span>
              <div class="bar"><i style="width:${pct(t.installs, maxOf('installs'))}%"></i></div>
              <span class="v">${nf(t.installs)}</span></div>
            <div class="srow"><span class="k">재사용률</span>
              <div class="bar"><i style="width:${Math.round(t.reuse * 100)}%"></i></div>
              <span class="v">${Math.round(t.reuse * 100)}%</span></div>
            <div class="srow"><span class="k">월 활성</span>
              <div class="bar"><i style="width:${pct(t.mau, maxOf('mau'))}%"></i></div>
              <span class="v">${nf(t.mau)}명</span></div>
            ${
              t.savedHours > 0
                ? `<div class="srow"><span class="k">월 절감</span>
                     <div class="bar"><i style="width:${pct(t.savedHours, maxOf('savedHours'))}%"></i></div>
                     <span class="v">${nf(t.savedHours)}시간</span></div>`
                : ''
            }
          </div>
        </div>

        <div class="card panel">
          <h3>👤 등록자</h3>
          <div style="display:flex;align-items:center;gap:11px">
            <div class="avatar" style="width:38px;height:38px;font-size:14px">${esc(t.author.name.slice(-2))}</div>
            <div>
              <div style="font-weight:700">${esc(t.author.name)}</div>
              <div class="muted" style="font-size:12.5px">${esc(t.author.dept)}</div>
            </div>
          </div>
          <p class="muted" style="font-size:12.5px;margin-top:12px">
            ${esc(t.createdAt)} 등록 · ${o.label} 트랙
          </p>
        </div>
      </aside>
    </div>
  </div>`;
}

const maxOf = (key) => Math.max(...db.getTools().map((t) => t[key]), 1);
const pct = (v, max) => Math.round((v / max) * 100);

function revHtml(r) {
  const saved = r.savedMin ?? 0;
  const im = impactOf(r.impact);
  // 시간 절감 후기만 정량 수치를 함께 보여준다.
  const timeFacts =
    r.impact === 'time' && saved > 0
      ? `<span class="fact">${nf(r.beforeMin)}분 → ${nf(r.afterMin)}분</span>
         <span class="fact">월 ${nf(r.freqMonth)}회</span>
         <span class="fact">월 <b>${(saved / 60).toFixed(1)}시간</b> 절감</span>`
      : '';

  return `
  <div class="rev">
    <div class="rev-hd">
      <div class="avatar" style="width:26px;height:26px;font-size:11px">${esc(r.author.name.slice(-2))}</div>
      <span class="nm">${esc(r.author.name)}</span>
      <span class="muted" style="font-size:12px">${esc(r.author.dept)}</span>
      ${starHtml(r.rating)}
      <span class="dt">${esc(r.createdAt)}</span>
    </div>
    <div class="rev-body">${esc(r.comment)}</div>
    <div class="rev-facts">
      <span class="fact">${esc(r.taskType)}</span>
      <span class="fact fact-impact">${im.icon} ${esc(im.label)}</span>
      ${timeFacts}
    </div>
  </div>`;
}

AFTER.tool = ({ id }) => {
  $('#copy')?.addEventListener('click', async () => {
    const text = $('#snip')?.textContent || '';
    try { await navigator.clipboard.writeText(text); } catch { /* 무시 */ }
    toast('설치 명령을 복사했습니다');
  });

  $('#install')?.addEventListener('click', async () => {
    await db.installTool(id);
    toast('설치 완료 — 에이전트를 다시 시작하면 적용됩니다');
    render();
  });
};

// ── 화면 4 · 후기 작성 ─────────────────────────────────────────────────────

function viewReview({ id }) {
  const t = db.getTool(id);
  if (!t) return notFound();

  return `
  <div class="wrap" style="padding-top:28px;max-width:760px">
    <div class="crumb"><a href="#/store">도구 둘러보기</a> ›
      <a href="#/tool/${t.id}">${esc(t.name)}</a> › 후기 작성</div>

    <div class="dhead" style="margin-bottom:20px">
      <div class="dicon" style="width:58px;height:58px;font-size:28px;border-radius:15px">${t.icon}</div>
      <div>
        <h1 style="font-size:22px">${esc(t.name)} 사용 후기</h1>
        <p class="ttag">이 도구가 어떻게 도움이 됐는지 알려주세요. 다음 사람의 선택에 그대로 쓰입니다.</p>
      </div>
    </div>

    <div class="card panel">
      <div class="form">
        <div class="frow">
          <label>이 도구는 어땠나요?</label>
          <div class="rate" id="rate">
            ${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-n="${n}">★</button>`).join('')}
          </div>
        </div>

        <div class="frow">
          <label>어떤 업무에 사용했나요?</label>
          <div class="picks" id="task">
            ${TASK_TYPES.map((x, i) => `<button type="button" class="pick${i === 0 ? ' on' : ''}" data-v="${esc(x)}">${esc(x)}</button>`).join('')}
          </div>
        </div>

        <div class="frow">
          <label>어떤 점이 좋았나요?</label>
          <div class="picks" id="impact">
            ${IMPACT_TYPES.map(
              (x, i) => `<button type="button" class="pick${i === 0 ? ' on' : ''}" data-v="${x.id}"
                           title="${esc(x.hint)}">${x.icon} ${esc(x.label)}</button>`,
            ).join('')}
          </div>
          <span class="hint" id="impact-hint">${esc(IMPACT_TYPES[0].detail)}</span>
        </div>

        <div id="time-block">
          <div class="fgrid">
            <div class="frow">
              <label>도입 전 소요 시간</label>
              <input type="number" id="before" min="0" step="5" value="60">
              <span class="hint">1회당 분</span>
            </div>
            <div class="frow">
              <label>도입 후 소요 시간</label>
              <input type="number" id="after" min="0" step="5" value="15">
              <span class="hint">1회당 분</span>
            </div>
            <div class="frow">
              <label>월 사용 빈도</label>
              <input type="number" id="freq" min="1" step="1" value="8">
              <span class="hint">회 / 월</span>
            </div>
          </div>

          <div class="calc" style="margin-top:18px">
            <div>
              <div class="calc-k">이 도구로 아끼는 시간</div>
              <div class="calc-v"><span id="calc">6.0</span>시간 / 월</div>
            </div>
            <div class="calc-note">
              (도입 전 − 도입 후) × 월 빈도 로 자동 계산됩니다.
              입력값은 전사 절감 시간 집계에 그대로 반영됩니다.
            </div>
          </div>
        </div>

        <div class="frow">
          <label>한 줄 사례 <span class="muted" style="font-weight:600">(선택)</span></label>
          <textarea id="comment" placeholder="어떤 상황에서 어떻게 도움이 됐는지 적어주세요. 다음 사람에게 가장 큰 도움이 됩니다."></textarea>
        </div>

        <div style="display:flex;gap:10px">
          <button class="btn btn-pri btn-lg" id="submit">후기 등록</button>
          <a class="btn btn-lg" href="#/tool/${t.id}">취소</a>
        </div>
      </div>
    </div>
  </div>`;
}

AFTER.review = ({ id }) => {
  let rating = 5;
  let task = TASK_TYPES[0];
  let impact = IMPACT_TYPES[0].id;

  const paint = () => {
    document.querySelectorAll('#rate button').forEach((b) => {
      b.classList.toggle('on', Number(b.dataset.n) <= rating);
    });
  };
  paint();

  document.querySelectorAll('#rate button').forEach((b) => {
    b.addEventListener('click', () => { rating = Number(b.dataset.n); paint(); });
  });

  document.querySelectorAll('#task .pick').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#task .pick').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      task = b.dataset.v;
    });
  });

  // 시간 절감을 고른 경우에만 정량 입력을 받는다.
  const syncImpact = () => {
    const meta = IMPACT_TYPES.find((x) => x.id === impact);
    $('#time-block').hidden = impact !== 'time';
    $('#impact-hint').textContent = meta.detail;
  };

  document.querySelectorAll('#impact .pick').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#impact .pick').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      impact = b.dataset.v;
      syncImpact();
    });
  });
  syncImpact();

  const recalc = () => {
    const before = Number($('#before').value || 0);
    const after = Number($('#after').value || 0);
    const freq = Number($('#freq').value || 0);
    const hours = Math.max(0, (before - after) * freq) / 60;
    $('#calc').textContent = hours.toFixed(1);
  };
  ['#before', '#after', '#freq'].forEach((s) => $(s)?.addEventListener('input', recalc));
  recalc();

  $('#submit')?.addEventListener('click', async () => {
    const isTime = impact === 'time';
    const before = isTime ? Number($('#before').value || 0) : 0;
    const after = isTime ? Number($('#after').value || 0) : 0;
    const freq = isTime ? Number($('#freq').value || 0) : 0;

    if (isTime) {
      if (after > before) return toast('도입 후 시간이 도입 전보다 클 수 없습니다');
      if (freq < 1) return toast('월 사용 빈도를 1회 이상으로 입력해주세요');
    }

    await db.addReview({
      toolId: id, author: CURRENT_USER, rating, taskType: task, impact,
      beforeMin: before, afterMin: after, freqMonth: freq,
      comment: $('#comment').value.trim() || '업무에 도움이 되었습니다.',
    });

    if (isTime) {
      const saved = ((before - after) * freq / 60).toFixed(1);
      toast(`후기 등록 완료 — 월 ${saved}시간이 전사 집계에 반영됐습니다`);
    } else {
      toast('후기 등록 완료 — 소중한 의견 감사합니다');
    }
    location.hash = `#/tool/${id}`;
  });
};

// ── 화면 5 · 도구 등록 ─────────────────────────────────────────────────────

function viewSubmit() {
  return `
  <div class="wrap" style="padding-top:28px;max-width:820px">
    <div class="crumb"><a href="#/store">도구 둘러보기</a> › 도구 등록</div>

    <div class="dhead" style="margin-bottom:8px">
      <div class="dicon" style="width:58px;height:58px;font-size:28px;border-radius:15px">＋</div>
      <div>
        <h1 style="font-size:24px">내 도구 등록하기</h1>
        <p class="ttag">직접 만든 도구도, 써보고 좋았던 오픈소스도 모두 등록 대상입니다.</p>
      </div>
    </div>

    <div class="card panel" style="margin-bottom:14px">
      <h3>🧭 어떤 트랙으로 등록하나요?</h3>
      <div class="picks" id="origin">
        <button type="button" class="pick on" data-v="build">🛠️ 자체 제작 — 내가 만든 Skill·MCP</button>
        <button type="button" class="pick" data-v="curate">🔍 큐레이션 — 써보고 검증한 오픈소스</button>
      </div>
      <p class="muted" style="font-size:12.5px;margin-top:12px">
        개발 역량이 없어도 괜찮습니다. 써보고 좋았던 도구를 발굴해 공유하는 것만으로 충분합니다.
        단, 큐레이션은 실제 사내 적용 사례 기재가 필수입니다.
      </p>
    </div>

    <div class="card panel">
      <div class="form">
        <div class="fgrid">
          <div class="frow" style="grid-column:1/-1">
            <label>도구 이름</label>
            <input type="text" id="name" placeholder="예) 계약서 검토 체크리스트">
          </div>
        </div>

        <div class="fgrid">
          <div class="frow">
            <label>아이콘</label>
            <input type="text" id="icon" value="🧰" maxlength="4">
            <span class="hint">이모지 1개</span>
          </div>
          <div class="frow">
            <label>도구 유형</label>
            <select id="type">${TYPES.map((t) => `<option value="${t.id}">${t.label}</option>`).join('')}</select>
          </div>
          <div class="frow">
            <label>직무 카테고리</label>
            <select id="category">
              ${CATEGORIES.filter((c) => c.id !== 'all').map((c) => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="frow">
          <label>지원 에이전트</label>
          <div class="picks" id="agents">
            ${AGENTS.map((a) => `<button type="button" class="pick on" data-v="${a.id}">${a.label}</button>`).join('')}
          </div>
          <span class="hint">사내 사용 현황 — Claude 약 140명, ChatGPT 약 60명</span>
        </div>

        <div class="frow">
          <label>한 줄 소개</label>
          <input type="text" id="tagline" placeholder="이 도구가 무엇을 해주는지 한 문장으로">
        </div>

        <div class="frow">
          <label>상세 설명</label>
          <textarea id="description" placeholder="어떤 기능을 하고, 어떤 상황에 유용한지 설명해주세요."></textarea>
        </div>

        <div class="frow">
          <label>사용 사례 <span style="color:var(--brand-600)">· 필수</span></label>
          <textarea id="useCase" placeholder="어떤 업무에 썼고, 도입 전후로 무엇이 달라졌는지 구체적으로 적어주세요. 이 항목이 다른 임직원의 설치 결정에 가장 큰 영향을 줍니다."></textarea>
        </div>

        <div class="frow">
          <label>설치 방법</label>
          <input type="text" id="snippet" class="mono" placeholder="claude mcp add ... 또는 Skill 배치 경로">
        </div>

        <div style="display:flex;gap:10px">
          <button class="btn btn-pri btn-lg" id="save">등록하기</button>
          <a class="btn btn-lg" href="#/store">취소</a>
        </div>
      </div>
    </div>
  </div>`;
}

AFTER.submit = () => {
  let origin = 'build';
  document.querySelectorAll('#origin .pick').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#origin .pick').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      origin = b.dataset.v;
    });
  });
  document.querySelectorAll('#agents .pick').forEach((b) => {
    b.addEventListener('click', () => b.classList.toggle('on'));
  });

  $('#save')?.addEventListener('click', async () => {
    const val = (id) => $(`#${id}`).value.trim();
    const agents = [...document.querySelectorAll('#agents .pick.on')].map((b) => b.dataset.v);

    if (!val('name')) return toast('도구 이름을 입력해주세요');
    if (!val('tagline')) return toast('한 줄 소개를 입력해주세요');
    if (!val('useCase')) return toast('사용 사례는 필수 입력입니다');
    if (!agents.length) return toast('지원 에이전트를 하나 이상 선택해주세요');

    const tool = await db.addTool({
      name: val('name'), icon: val('icon') || '🧰', type: val('type'), origin,
      agents, category: val('category'), tagline: val('tagline'),
      description: val('description') || val('tagline'), useCase: val('useCase'),
      snippet: val('snippet'), author: CURRENT_USER,
    });
    toast('등록 완료 — 스토어에 공개됐습니다');
    location.hash = `#/tool/${tool.id}`;
  });
};

// ── 부가 · Supabase 설정 ───────────────────────────────────────────────────

function viewSetup() {
  const m = db.state.mode;
  const label = { supabase: 'Supabase 연결됨', 'supabase-empty': 'Supabase 연결됨 · 데이터 없음', local: '로컬 데모 모드' }[m];
  return `
  <div class="wrap" style="padding-top:34px;max-width:720px">
    <h1 style="font-size:23px;letter-spacing:-.02em">데이터 연동 설정</h1>
    <div class="card panel" style="margin-top:16px">
      <h3>현재 상태</h3>
      <p><b>${esc(label)}</b></p>
      ${db.state.error ? `<p class="muted" style="font-size:12.5px">오류: ${esc(db.state.error)}</p>` : ''}
      <p class="muted" style="font-size:13px">
        <code class="mono">assets/js/config.js</code> 에 Supabase URL 과 anon key 를 입력하고,
        <code class="mono">supabase/schema.sql</code> 을 SQL Editor 에서 실행한 뒤 아래 버튼을 누르세요.
      </p>
      <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
        <button class="btn" id="ping">연결 테스트</button>
        <button class="btn btn-pri" id="seed">시드 데이터 업로드</button>
        <button class="btn" id="reset">로컬 데이터 초기화</button>
      </div>
      <pre class="mono" id="out" style="margin-top:16px;white-space:pre-wrap;color:var(--ink-3)"></pre>
    </div>
  </div>`;
}

AFTER.setup = () => {
  const out = (s) => { $('#out').textContent = s; };
  $('#ping')?.addEventListener('click', async () => {
    try { out(`연결 성공 · tools 테이블 ${await db.pingSupabase()}행`); }
    catch (e) { out(`실패: ${e.message}`); }
  });
  $('#seed')?.addEventListener('click', async () => {
    out('업로드 중…');
    try {
      const r = await db.seedSupabase();
      out(`업로드 완료 · 도구 ${r.tools}개, 후기 ${r.reviews}건\n새로고침하면 Supabase 데이터로 동작합니다.`);
    } catch (e) { out(`실패: ${e.message}`); }
  });
  $('#reset')?.addEventListener('click', () => {
    db.resetLocal();
    out('로컬 데이터를 초기화했습니다. 새로고침하세요.');
  });
};

// ── 공통 ───────────────────────────────────────────────────────────────────

function notFound() {
  return `<div class="wrap"><div class="empty"><div class="big">🧭</div>
    요청하신 페이지를 찾을 수 없습니다.<br>
    <a class="btn" style="margin-top:16px" href="#/store">스토어로 이동</a></div></div>`;
}

// ── 부트스트랩 ─────────────────────────────────────────────────────────────

async function boot() {
  app().innerHTML = `<div class="wrap"><div class="empty"><div class="big">⏳</div>불러오는 중…</div></div>`;
  await db.init();

  const badge = $('#mode-badge');
  if (badge) {
    badge.textContent =
      db.state.mode === 'supabase' ? 'Supabase 연동' : '로컬 데모 데이터';
  }

  window.addEventListener('hashchange', render);
  render();
}

boot();
