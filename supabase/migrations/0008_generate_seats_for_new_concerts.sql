-- Migration: Generate seats for BTS and NewJeans concerts
-- Description: Creates available seats for the newly added concerts

-- BTS World Tour 2026 좌석 생성
do $$
declare
  v_concert_id uuid;
begin
  select c.id into v_concert_id
  from public.concerts c
  where c.name = 'BTS World Tour 2026'
  limit 1;

  if v_concert_id is not null then
    perform public.generate_seats_for_concert(v_concert_id);
    raise notice 'Generated seats for BTS World Tour 2026';
  end if;
end $$;

-- NewJeans Fan Meeting 2026 좌석 생성
do $$
declare
  v_concert_id uuid;
begin
  select c.id into v_concert_id
  from public.concerts c
  where c.name = 'NewJeans Fan Meeting 2026'
  limit 1;

  if v_concert_id is not null then
    perform public.generate_seats_for_concert(v_concert_id);
    raise notice 'Generated seats for NewJeans Fan Meeting 2026';
  end if;
end $$;
