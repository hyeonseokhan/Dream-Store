// ---------------------------------------------------------------------------
// Dream Store · 데이터 계층
// Supabase 설정이 있으면 실제 DB, 없으면 브라우저 저장소를 사용합니다.
// 화면 코드는 어느 쪽인지 알 필요가 없습니다.
// ---------------------------------------------------------------------------

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { TOOLS, REVIEWS } from './seed.js';

const LS = {
  tools: 'dreamstore.tools.v1',
  reviews: 'dreamstore.reviews.v1',
  installed: 'dreamstore.installed.v1',
};

export const state = {
  mode: 'local', // 'local' | 'supabase'
  ready: false,
  tools: [],
  reviews: [],
  installed: new Set(),
  error: null,
};

let sb = null;

// ── 초기화 ─────────────────────────────────────────────────────────────────

export async function init() {
  const installed = readJSON(LS.installed, []);
  state.installed = new Set(installed);

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const [toolsRes, reviewsRes] = await Promise.all([
        sb.from('tools').select('*'),
        sb.from('reviews').select('*'),
      ]);
      if (toolsRes.error) throw toolsRes.error;
      if (reviewsRes.error) throw reviewsRes.error;
      if ((toolsRes.data || []).length > 0) {
        state.mode = 'supabase';
        state.tools = toolsRes.data.map(fromRowTool);
        state.reviews = (reviewsRes.data || []).map(fromRowReview);
        state.ready = true;
        return state;
      }
      // 테이블은 있으나 비어 있음 → 로컬 시드로 동작하되 setup 안내
      state.mode = 'supabase-empty';
    } catch (e) {
      state.error = e.message || String(e);
      state.mode = 'local';
    }
  }

  state.tools = readJSON(LS.tools, null) || TOOLS.map(withDerived);
  state.reviews = readJSON(LS.reviews, null) || REVIEWS.map(withReviewDerived);
  persistLocal();
  state.ready = true;
  return state;
}

// ── 파생 값 ────────────────────────────────────────────────────────────────

function withDerived(tool) {
  return { ...tool, gov: govScore(tool) };
}

function withReviewDerived(r) {
  return { ...r, id: r.id || `${r.toolId}-${r.author.name}-${r.createdAt}`, savedMin: savedMinutes(r) };
}

export function savedMinutes(r) {
  return Math.max(0, (Number(r.beforeMin) - Number(r.afterMin)) * Number(r.freqMonth));
}

// 거버넌스 심사 점수(0~100). 시연용으로 도구 특성에서 결정적으로 산출합니다.
function govScore(tool) {
  let h = 0;
  for (const ch of tool.id) h = (h * 31 + ch.charCodeAt(0)) % 997;
  const base = 68 + (tool.rating - 4.2) * 26;
  const originBonus = tool.origin === 'build' ? 6 : 0;
  return clamp(Math.round(base + originBonus + (h % 9)), 60, 100);
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ── 종합 점수 (사용실적 40 / 동료평가 30 / 거버넌스 30) ────────────────────

export function scoreOf(tool, all = state.tools) {
  const maxInstalls = Math.max(...all.map((t) => t.installs), 1);
  const maxMau = Math.max(...all.map((t) => t.mau), 1);
  const maxSaved = Math.max(...all.map((t) => t.savedHours), 1);

  const usage =
    (tool.reuse * 0.55 + (tool.mau / maxMau) * 0.30 + (tool.installs / maxInstalls) * 0.15) * 40;
  const peer = ((tool.rating / 5) * 0.6 + (tool.savedHours / maxSaved) * 0.4) * 30;
  const gov = (tool.gov / 100) * 30;

  return {
    usage: round1(usage),
    peer: round1(peer),
    gov: round1(gov),
    total: round1(usage + peer + gov),
  };
}

const round1 = (n) => Math.round(n * 10) / 10;

export function ranking(origin = null) {
  const pool = origin ? state.tools.filter((t) => t.origin === origin) : state.tools;
  return pool
    .map((t) => ({ tool: t, score: scoreOf(t) }))
    .sort((a, b) => b.score.total - a.score.total);
}

// ── 조회 ───────────────────────────────────────────────────────────────────

export const getTools = () => state.tools;
export const getTool = (id) => state.tools.find((t) => t.id === id);
export const getReviews = (toolId) =>
  state.reviews.filter((r) => r.toolId === toolId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export function totals() {
  const savedHours = state.tools.reduce((s, t) => s + t.savedHours, 0);
  const contributors = new Set(state.tools.map((t) => t.author.name)).size;
  const installs = state.tools.reduce((s, t) => s + t.installs, 0);
  return {
    savedHours,
    savedDays: Math.round(savedHours / 8),
    tools: state.tools.length,
    contributors,
    installs,
    reviews: state.reviews.length,
  };
}

export const isInstalled = (id) => state.installed.has(id);

// ── 변경 ───────────────────────────────────────────────────────────────────

export async function installTool(id) {
  const tool = getTool(id);
  if (!tool || state.installed.has(id)) return tool;
  state.installed.add(id);
  tool.installs += 1;
  tool.mau += 1;
  writeJSON(LS.installed, [...state.installed]);
  persistLocal();
  if (sb && state.mode === 'supabase') {
    await sb.from('tools').update({ installs: tool.installs, mau: tool.mau }).eq('id', id);
  }
  return tool;
}

export async function addReview(review) {
  const tool = getTool(review.toolId);
  if (!tool) throw new Error('도구를 찾을 수 없습니다.');

  const rec = withReviewDerived({
    ...review,
    createdAt: review.createdAt || todayISO(),
  });

  // 도구 지표 갱신 — 기존 평점을 표본 수로 가중해 새 후기를 반영
  const n = tool.reviews;
  tool.rating = round2((tool.rating * n + rec.rating) / (n + 1));
  tool.reviews = n + 1;
  tool.savedHours += Math.round(rec.savedMin / 60);

  state.reviews.unshift(rec);
  persistLocal();

  if (sb && state.mode === 'supabase') {
    await sb.from('reviews').insert(toRowReview(rec));
    await sb
      .from('tools')
      .update({ rating: tool.rating, reviews: tool.reviews, saved_hours: tool.savedHours })
      .eq('id', tool.id);
  }
  return rec;
}

const round2 = (n) => Math.round(n * 100) / 100;

export async function addTool(input) {
  const id = slugify(input.name) || `tool-${state.tools.length + 1}`;
  const tool = withDerived({
    id,
    name: input.name,
    icon: input.icon || '🧰',
    type: input.type,
    origin: input.origin,
    agents: input.agents,
    category: input.category,
    tagline: input.tagline,
    description: input.description,
    useCase: input.useCase,
    install: { label: input.type === 'mcp' ? 'MCP 설정' : '설치 방법', snippet: input.snippet || '' },
    author: input.author,
    createdAt: todayISO(),
    installs: 0, reuse: 0, mau: 0, rating: 0, reviews: 0, savedHours: 0,
    isNew: true,
  });
  state.tools.unshift(tool);
  persistLocal();
  if (sb && state.mode === 'supabase') await sb.from('tools').insert(toRowTool(tool));
  return tool;
}

// ── Supabase 시드 업로드 (#/setup) ─────────────────────────────────────────

export async function seedSupabase() {
  if (!sb) throw new Error('Supabase 설정이 없습니다. assets/js/config.js 를 확인하세요.');
  const tools = TOOLS.map(withDerived).map(toRowTool);
  const reviews = REVIEWS.map(withReviewDerived).map(toRowReview);
  const a = await sb.from('tools').upsert(tools, { onConflict: 'id' });
  if (a.error) throw a.error;
  const b = await sb.from('reviews').upsert(reviews, { onConflict: 'id' });
  if (b.error) throw b.error;
  return { tools: tools.length, reviews: reviews.length };
}

export async function pingSupabase() {
  if (!sb) throw new Error('Supabase 설정이 없습니다.');
  const { error, count } = await sb.from('tools').select('id', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

// ── 행 변환 ────────────────────────────────────────────────────────────────

const toRowTool = (t) => ({
  id: t.id, name: t.name, icon: t.icon, type: t.type, origin: t.origin,
  agents: t.agents, category: t.category, tagline: t.tagline, description: t.description,
  use_case: t.useCase, install_label: t.install.label, install_snippet: t.install.snippet,
  author_name: t.author.name, author_dept: t.author.dept, created_at: t.createdAt,
  installs: t.installs, reuse: t.reuse, mau: t.mau, rating: t.rating,
  reviews: t.reviews, saved_hours: t.savedHours, gov: t.gov,
});

const fromRowTool = (r) => ({
  id: r.id, name: r.name, icon: r.icon, type: r.type, origin: r.origin,
  agents: r.agents || [], category: r.category, tagline: r.tagline, description: r.description,
  useCase: r.use_case, install: { label: r.install_label, snippet: r.install_snippet },
  author: { name: r.author_name, dept: r.author_dept }, createdAt: r.created_at,
  installs: r.installs, reuse: Number(r.reuse), mau: r.mau, rating: Number(r.rating),
  reviews: r.reviews, savedHours: r.saved_hours, gov: r.gov,
});

const toRowReview = (r) => ({
  id: r.id, tool_id: r.toolId, author_name: r.author.name, author_dept: r.author.dept,
  rating: r.rating, task_type: r.taskType, before_min: r.beforeMin, after_min: r.afterMin,
  freq_month: r.freqMonth, comment: r.comment, created_at: r.createdAt,
});

const fromRowReview = (r) => ({
  id: r.id, toolId: r.tool_id, author: { name: r.author_name, dept: r.author_dept },
  rating: r.rating, taskType: r.task_type, beforeMin: r.before_min, afterMin: r.after_min,
  freqMonth: r.freq_month, comment: r.comment, createdAt: r.created_at,
  savedMin: Math.max(0, (r.before_min - r.after_min) * r.freq_month),
});

// ── 유틸 ───────────────────────────────────────────────────────────────────

function persistLocal() {
  writeJSON(LS.tools, state.tools);
  writeJSON(LS.reviews, state.reviews);
}

export function resetLocal() {
  localStorage.removeItem(LS.tools);
  localStorage.removeItem(LS.reviews);
  localStorage.removeItem(LS.installed);
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 실패는 무시 — 화면 동작에는 영향 없음 */
  }
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function slugify(s) {
  return String(s).trim().toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40) || '';
}
