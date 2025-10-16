-- Migration: Add concerts based on Melon Top 10 songs
-- Description: Adds concert events featuring popular artists from Melon charts

-- 플레이브 콘서트 (멜론 차트 1-5위 곡들)
insert into public.concerts (venue_id, name, date, description, poster_url)
select
  v.id,
  '플레이브 2025 콘서트 "대쉬"',
  '2025-08-15 19:30:00+09'::timestamptz,
  '멜론 차트 1위 "대쉬"를 포함한 플레이브의 히트곡들이 담긴 특별한 콘서트입니다. 리즈, 크로마 드리프트, 12:32 에이 투 티, 아일랜드 등 최신 히트곡들을 만나보세요.',
  'https://picsum.photos/seed/playve-concert-2025/400/600'
from public.venues v
where v.name = 'KSPO DOME'
on conflict do nothing;

-- 추가 공연장 생성 (올림픽공원 KSPO DOME 외)
insert into public.venues (name, address, section_count, rows_per_section, columns_per_section)
values 
  ('올림픽공원 KSPO DOME', '서울특별시 송파구 올림픽로 424', 4, 4, 20),
  ('잠실 실내체육관', '서울특별시 송파구 올림픽로 240', 4, 4, 20),
  ('고척 스카이돔', '서울특별시 구로구 경인로 430', 4, 4, 20)
on conflict do nothing;

-- 플레이브 추가 콘서트 (다른 공연장)
insert into public.concerts (venue_id, name, date, description, poster_url)
select
  v.id,
  '플레이브 2025 월드투어 "리즈"',
  '2025-10-05 20:00:00+09'::timestamptz,
  '플레이브의 월드투어 서울 공연입니다. "리즈"를 비롯한 최신 히트곡들과 함께하는 특별한 무대를 만나보세요.',
  'https://picsum.photos/seed/playve-worldtour-2025/400/600'
from public.venues v
where v.name = '올림픽공원 KSPO DOME'
on conflict do nothing;
