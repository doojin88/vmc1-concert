-- Migration: Add 2 additional sample concerts
-- Description: Adds BTS and NewJeans concert events to the existing venue

-- 샘플 콘서트 2개 추가
insert into public.concerts (venue_id, name, date, description, poster_url)
select
  v.id,
  'BTS World Tour 2026',
  '2026-03-15 19:30:00+09'::timestamptz,
  'BTS 월드투어 2026 서울 앵콜 공연입니다. 전 세계 팬들과 함께하는 특별한 무대가 펼쳐집니다.',
  'https://picsum.photos/seed/bts-concert-2026/400/600'
from public.venues v
where v.name = 'KSPO DOME'
on conflict do nothing;

insert into public.concerts (venue_id, name, date, description, poster_url)
select
  v.id,
  'NewJeans Fan Meeting 2026',
  '2026-05-10 18:00:00+09'::timestamptz,
  'NewJeans와 함께하는 팬미팅입니다. 멤버들과의 특별한 시간을 가져보세요.',
  'https://picsum.photos/seed/newjeans-fanmeet-2026/400/600'
from public.venues v
where v.name = 'KSPO DOME'
on conflict do nothing;
