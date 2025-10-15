-- Migration: create seats table and auto-generation function
create type seat_status_type as enum ('AVAILABLE', 'RESERVED');
create type section_type as enum ('A', 'B', 'C', 'D');

create table if not exists public.seats (
  id uuid primary key default gen_random_uuid(),
  concert_id uuid not null references public.concerts(id) on delete cascade,
  section section_type not null,
  row integer not null check (row >= 1 and row <= 4),
  "column" integer not null check ("column" >= 1 and "column" <= 20),
  grade seat_grade_type not null,
  status seat_status_type not null default 'AVAILABLE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seats_concert_position_unique unique(concert_id, section, row, "column")
);

comment on table public.seats is '좌석 정보';
comment on column public.seats.section is '구역 (A, B, C, D)';
comment on column public.seats.row is '행 번호 (1~4)';
comment on column public.seats."column" is '열 번호 (1~20)';
comment on column public.seats.grade is '좌석 등급';
comment on column public.seats.status is '좌석 상태 (AVAILABLE: 예약 가능, RESERVED: 예약됨)';

create index if not exists idx_seats_concert on public.seats(concert_id);
create index if not exists idx_seats_status on public.seats(concert_id, status);
create index if not exists idx_seats_grade on public.seats(concert_id, grade);

drop trigger if exists update_seats_updated_at on public.seats;
create trigger update_seats_updated_at
  before update on public.seats
  for each row
  execute function public.update_updated_at_column();

alter table if exists public.seats disable row level security;

-- 좌석 자동 생성 함수
create or replace function public.generate_seats_for_concert(p_concert_id uuid)
returns void as $$
declare
  v_section section_type;
  v_row integer;
  v_column integer;
  v_grade seat_grade_type;
begin
  foreach v_section in array array['A', 'B', 'C', 'D']::section_type[] loop
    for v_row in 1..4 loop
      for v_column in 1..20 loop
        if v_column between 1 and 3 then
          v_grade := 'SPECIAL';
        elsif v_column between 4 and 7 then
          v_grade := 'PREMIUM';
        elsif v_column between 8 and 15 then
          v_grade := 'ADVANCED';
        else
          v_grade := 'REGULAR';
        end if;
        
        insert into public.seats (concert_id, section, row, "column", grade, status)
        values (p_concert_id, v_section, v_row, v_column, v_grade, 'AVAILABLE')
        on conflict (concert_id, section, row, "column") do nothing;
      end loop;
    end loop;
  end loop;
end;
$$ language plpgsql;

-- 샘플 콘서트에 대한 좌석 생성
do $$
declare
  v_concert_id uuid;
begin
  select c.id into v_concert_id
  from public.concerts c
  where c.name = 'IU Concert 2025'
  limit 1;
  
  if v_concert_id is not null then
    perform public.generate_seats_for_concert(v_concert_id);
  end if;
end $$;

