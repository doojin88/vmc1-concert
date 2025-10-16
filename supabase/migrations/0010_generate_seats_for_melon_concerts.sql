-- Migration: Generate seats for Melon Top 10 concerts
-- Description: Creates available seats for the newly added Melon Top 10 concerts to make them bookable

-- 플레이브 2025 콘서트 "대쉬" 좌석 생성
do $$
declare
  v_concert_id uuid;
begin
  select c.id into v_concert_id
  from public.concerts c
  where c.name = '플레이브 2025 콘서트 "대쉬"'
  limit 1;

  if v_concert_id is not null then
    perform public.generate_seats_for_concert(v_concert_id);
    raise notice 'Generated seats for 플레이브 2025 콘서트 "대쉬"';
  end if;
end $$;

-- 플레이브 2025 월드투어 "리즈" 좌석 생성
do $$
declare
  v_concert_id uuid;
begin
  select c.id into v_concert_id
  from public.concerts c
  where c.name = '플레이브 2025 월드투어 "리즈"'
  limit 1;

  if v_concert_id is not null then
    perform public.generate_seats_for_concert(v_concert_id);
    raise notice 'Generated seats for 플레이브 2025 월드투어 "리즈"';
  end if;
end $$;

-- 플레이브 크리스마스 특별 콘서트 "크로마 드리프트" 좌석 생성
do $$
declare
  v_concert_id uuid;
begin
  select c.id into v_concert_id
  from public.concerts c
  where c.name = '플레이브 크리스마스 특별 콘서트 "크로마 드리프트"'
  limit 1;

  if v_concert_id is not null then
    perform public.generate_seats_for_concert(v_concert_id);
    raise notice 'Generated seats for 플레이브 크리스마스 특별 콘서트 "크로마 드리프트"';
  end if;
end $$;

-- 추가 공연장들에 대한 좌석 등급 데이터 생성
-- 올림픽공원 KSPO DOME 좌석 등급
insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'SPECIAL'::seat_grade_type,
  250000,
  1,
  3
from public.venues v
where v.name = '올림픽공원 KSPO DOME'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'PREMIUM'::seat_grade_type,
  190000,
  4,
  7
from public.venues v
where v.name = '올림픽공원 KSPO DOME'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'ADVANCED'::seat_grade_type,
  170000,
  8,
  15
from public.venues v
where v.name = '올림픽공원 KSPO DOME'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'REGULAR'::seat_grade_type,
  150000,
  16,
  20
from public.venues v
where v.name = '올림픽공원 KSPO DOME'
on conflict (venue_id, name) do nothing;

-- 잠실 실내체육관 좌석 등급
insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'SPECIAL'::seat_grade_type,
  200000,
  1,
  3
from public.venues v
where v.name = '잠실 실내체육관'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'PREMIUM'::seat_grade_type,
  150000,
  4,
  7
from public.venues v
where v.name = '잠실 실내체육관'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'ADVANCED'::seat_grade_type,
  130000,
  8,
  15
from public.venues v
where v.name = '잠실 실내체육관'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'REGULAR'::seat_grade_type,
  110000,
  16,
  20
from public.venues v
where v.name = '잠실 실내체육관'
on conflict (venue_id, name) do nothing;

-- 고척 스카이돔 좌석 등급
insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'SPECIAL'::seat_grade_type,
  300000,
  1,
  3
from public.venues v
where v.name = '고척 스카이돔'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'PREMIUM'::seat_grade_type,
  220000,
  4,
  7
from public.venues v
where v.name = '고척 스카이돔'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'ADVANCED'::seat_grade_type,
  180000,
  8,
  15
from public.venues v
where v.name = '고척 스카이돔'
on conflict (venue_id, name) do nothing;

insert into public.seat_grades (venue_id, name, price, row_start, row_end)
select 
  v.id,
  'REGULAR'::seat_grade_type,
  160000,
  16,
  20
from public.venues v
where v.name = '고척 스카이돔'
on conflict (venue_id, name) do nothing;
