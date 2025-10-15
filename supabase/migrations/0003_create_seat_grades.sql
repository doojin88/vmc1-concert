-- Migration: create seat_grades table
create type seat_grade_type as enum ('SPECIAL', 'PREMIUM', 'ADVANCED', 'REGULAR');

create table if not exists public.seat_grades (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  name seat_grade_type not null,
  price integer not null,
  row_start integer not null,
  row_end integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seat_grades_venue_name_unique unique(venue_id, name)
);

comment on table public.seat_grades is '좌석 등급 정보';
comment on column public.seat_grades.name is '좌석 등급명 (SPECIAL, PREMIUM, ADVANCED, REGULAR)';
comment on column public.seat_grades.price is '좌석 가격 (원)';
comment on column public.seat_grades.row_start is '등급 시작 열 번호';
comment on column public.seat_grades.row_end is '등급 종료 열 번호';

create index if not exists idx_seat_grades_venue on public.seat_grades(venue_id);

drop trigger if exists update_seat_grades_updated_at on public.seat_grades;
create trigger update_seat_grades_updated_at
  before update on public.seat_grades
  for each row
  execute function public.update_updated_at_column();

alter table if exists public.seat_grades disable row level security;

-- 샘플 데이터 (KSPO DOME 공연장의 좌석 등급)
insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'SPECIAL'::seat_grade_type,
  250000,
  1,
  3
from public.venues v
where v.name = 'KSPO DOME'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'PREMIUM'::seat_grade_type,
  190000,
  4,
  7
from public.venues v
where v.name = 'KSPO DOME'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'ADVANCED'::seat_grade_type,
  170000,
  8,
  15
from public.venues v
where v.name = 'KSPO DOME'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'REGULAR'::seat_grade_type,
  140000,
  16,
  20
from public.venues v
where v.name = 'KSPO DOME'
on conflict (venue_id, name) do nothing;

