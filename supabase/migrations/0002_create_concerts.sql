-- Migration: create venues and concerts tables
-- Ensures pgcrypto available for gen_random_uuid
create extension if not exists "pgcrypto";

-- venues 테이블
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  address varchar(255) not null,
  section_count integer not null default 4,
  rows_per_section integer not null default 4,
  columns_per_section integer not null default 20,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.venues is '공연장 정보';
comment on column public.venues.name is '공연장명';
comment on column public.venues.address is '공연장 주소';
comment on column public.venues.section_count is '구역 수 (A, B, C, D = 4개)';
comment on column public.venues.rows_per_section is '구역별 행 수 (1~4)';
comment on column public.venues.columns_per_section is '구역별 열 수 (1~20)';

-- concerts 테이블
create table if not exists public.concerts (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete restrict,
  name varchar(200) not null,
  date timestamptz not null,
  description text,
  poster_url varchar(500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.concerts is '콘서트 정보';
comment on column public.concerts.name is '콘서트명';
comment on column public.concerts.date is '콘서트 일시';
comment on column public.concerts.description is '콘서트 상세 설명';
comment on column public.concerts.poster_url is '공연 포스터 이미지 URL';

-- 인덱스
create index if not exists idx_concerts_date on public.concerts(date);
create index if not exists idx_concerts_venue on public.concerts(venue_id);
create index if not exists idx_venues_name on public.venues(name);

-- updated_at 자동 갱신 함수 (이미 존재하지 않을 경우에만 생성)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 트리거
drop trigger if exists update_venues_updated_at on public.venues;
create trigger update_venues_updated_at
  before update on public.venues
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_concerts_updated_at on public.concerts;
create trigger update_concerts_updated_at
  before update on public.concerts
  for each row
  execute function public.update_updated_at_column();

-- RLS 비활성화
alter table if exists public.venues disable row level security;
alter table if exists public.concerts disable row level security;

-- 샘플 데이터
insert into public.venues (name, address, section_count, rows_per_section, columns_per_section)
values 
  ('KSPO DOME', '서울특별시 송파구 올림픽로 424', 4, 4, 20)
on conflict do nothing
returning id;

-- 샘플 콘서트 데이터 (venue_id는 위에서 생성된 것 사용)
insert into public.concerts (venue_id, name, date, description, poster_url)
select 
  v.id,
  'IU Concert 2025',
  '2025-12-20 19:00:00+09'::timestamptz,
  'IU 콘서트 2025 서울 공연입니다. 최고의 무대를 선사합니다.',
  'https://picsum.photos/seed/iu-concert-2025/400/600'
from public.venues v
where v.name = 'KSPO DOME'
on conflict do nothing;

