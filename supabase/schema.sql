-- ===========================================================================
-- Dream Store · Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 그대로 붙여넣고 실행하세요.
-- 실행 후 사이트에서 #/setup → "시드 데이터 업로드" 를 누르면 데이터가 채워집니다.
-- ===========================================================================

create table if not exists public.tools (
  id              text primary key,
  name            text not null,
  icon            text,
  type            text,            -- skill | mcp | subagent | prompt
  origin          text,            -- build | curate
  agents          jsonb default '[]'::jsonb,
  category        text,            -- sales | hr | finance | planning | dev | marketing | common
  tagline         text,
  description     text,
  use_case        text,
  install_label   text,
  install_snippet text,
  author_name     text,
  author_dept     text,
  created_at      date default current_date,
  installs        integer default 0,
  reuse           numeric default 0,
  mau             integer default 0,
  rating          numeric default 0,
  reviews         integer default 0,
  saved_hours     integer default 0,
  gov             integer default 0
);

create table if not exists public.reviews (
  id          text primary key,
  tool_id     text references public.tools (id) on delete cascade,
  author_name text,
  author_dept text,
  rating      integer check (rating between 1 and 5),
  task_type   text,
  before_min  integer,
  after_min   integer,
  freq_month  integer,
  comment     text,
  created_at  date default current_date
);

create index if not exists reviews_tool_id_idx on public.reviews (tool_id);
create index if not exists tools_category_idx  on public.tools (category);

-- ---------------------------------------------------------------------------
-- 접근 정책
-- 시연용 목업이므로 익명 키로 읽기·쓰기를 허용합니다.
-- 실제 사내 도입 시에는 그룹웨어 SSO 연동 후 사번 기반 정책으로 교체해야 합니다.
-- ---------------------------------------------------------------------------

alter table public.tools   enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "demo_all_tools"   on public.tools;
drop policy if exists "demo_all_reviews" on public.reviews;

create policy "demo_all_tools"   on public.tools   for all using (true) with check (true);
create policy "demo_all_reviews" on public.reviews for all using (true) with check (true);
