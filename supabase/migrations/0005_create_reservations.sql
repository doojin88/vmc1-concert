-- Migration: create reservations and reservation_seats tables
create type reservation_status_type as enum ('CONFIRMED', 'CANCELLED');

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  concert_id uuid not null references public.concerts(id) on delete restrict,
  reservation_number varchar(20) not null unique,
  customer_name varchar(50) not null,
  phone_number varchar(11) not null,
  password_hash varchar(255) not null,
  total_amount integer not null,
  status reservation_status_type not null default 'CONFIRMED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.reservations is '예약 정보';
comment on column public.reservations.reservation_number is '예약 번호 (고유)';
comment on column public.reservations.customer_name is '예약자명';
comment on column public.reservations.phone_number is '휴대폰번호 (숫자만, 하이픈 없이)';
comment on column public.reservations.password_hash is '비밀번호 해시 (4자리 숫자)';
comment on column public.reservations.total_amount is '총 결제 금액 (원)';
comment on column public.reservations.status is '예약 상태 (CONFIRMED: 확정, CANCELLED: 취소)';

create table if not exists public.reservation_seats (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  seat_id uuid not null references public.seats(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint reservation_seats_unique unique(reservation_id, seat_id)
);

comment on table public.reservation_seats is '예약-좌석 연결 테이블';
comment on column public.reservation_seats.reservation_id is '예약 ID';
comment on column public.reservation_seats.seat_id is '좌석 ID';

-- 인덱스
create index if not exists idx_reservations_phone on public.reservations(phone_number);
create index if not exists idx_reservations_concert on public.reservations(concert_id);
create index if not exists idx_reservations_number on public.reservations(reservation_number);
create index if not exists idx_reservations_lookup on public.reservations(phone_number, password_hash);
create index if not exists idx_reservation_seats_reservation on public.reservation_seats(reservation_id);
create index if not exists idx_reservation_seats_seat on public.reservation_seats(seat_id);

-- 트리거
drop trigger if exists update_reservations_updated_at on public.reservations;
create trigger update_reservations_updated_at
  before update on public.reservations
  for each row
  execute function public.update_updated_at_column();

-- RLS 비활성화
alter table if exists public.reservations disable row level security;
alter table if exists public.reservation_seats disable row level security;

-- 예약 번호 생성 함수
create or replace function public.generate_reservation_number()
returns varchar as $$
declare
  new_number varchar;
  number_exists boolean;
begin
  loop
    new_number := 'R' || lpad(floor(random() * 100000000)::text, 8, '0');
    
    select exists(select 1 from public.reservations where reservation_number = new_number)
    into number_exists;
    
    exit when not number_exists;
  end loop;
  
  return new_number;
end;
$$ language plpgsql;

-- 예약 생성 트랜잭션 함수
create or replace function public.create_reservation_transaction(
  p_concert_id uuid,
  p_seat_ids uuid[],
  p_customer_name varchar,
  p_phone_number varchar,
  p_password_hash varchar
)
returns json as $$
declare
  v_reservation_id uuid;
  v_reservation_number varchar;
  v_seat_id uuid;
  v_seat_status seat_status_type;
  v_total_amount integer;
  v_result json;
begin
  -- 1. 좌석 상태 확인 (FOR UPDATE로 잠금)
  foreach v_seat_id in array p_seat_ids loop
    select status into v_seat_status
    from public.seats
    where id = v_seat_id and concert_id = p_concert_id
    for update;
    
    if not found then
      raise exception 'SEAT_NOT_FOUND: Seat % not found', v_seat_id;
    end if;
    
    if v_seat_status != 'AVAILABLE' then
      raise exception 'SEAT_UNAVAILABLE: Seat % is not available', v_seat_id;
    end if;
  end loop;

  -- 2. 총 금액 계산
  select sum(sg.price) into v_total_amount
  from public.seats s
  inner join public.concerts c on s.concert_id = c.id
  inner join public.seat_grades sg on s.grade = sg.name and c.venue_id = sg.venue_id
  where s.id = any(p_seat_ids);

  -- 3. 예약 번호 생성
  v_reservation_number := public.generate_reservation_number();

  -- 4. 예약 레코드 생성
  insert into public.reservations (
    concert_id, reservation_number, customer_name,
    phone_number, password_hash, total_amount, status
  ) values (
    p_concert_id, v_reservation_number, p_customer_name,
    p_phone_number, p_password_hash, v_total_amount, 'CONFIRMED'
  ) returning id into v_reservation_id;

  -- 5. 좌석 상태 변경
  update public.seats
  set status = 'RESERVED', updated_at = now()
  where id = any(p_seat_ids);

  -- 6. 예약-좌석 연결 생성
  foreach v_seat_id in array p_seat_ids loop
    insert into public.reservation_seats (reservation_id, seat_id)
    values (v_reservation_id, v_seat_id);
  end loop;

  -- 7. 결과 반환
  select json_build_object(
    'reservation_number', r.reservation_number,
    'customer_name', r.customer_name,
    'phone_number', r.phone_number,
    'total_amount', r.total_amount,
    'created_at', r.created_at::text,
    'concert', json_build_object(
      'name', c.name,
      'date', c.date::text,
      'venue_name', v.name
    ),
    'seats', (
      select json_agg(json_build_object(
        'section', s.section,
        'row', s.row,
        'column', s.column,
        'grade', s.grade
      ))
      from public.seats s
      inner join public.reservation_seats rs on s.id = rs.seat_id
      where rs.reservation_id = r.id
    )
  ) into v_result
  from public.reservations r
  inner join public.concerts c on r.concert_id = c.id
  inner join public.venues v on c.venue_id = v.id
  where r.id = v_reservation_id;

  return v_result;
end;
$$ language plpgsql;

