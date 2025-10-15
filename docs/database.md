# Database Design: 콘서트 예약 웹앱

## 개요

본 문서는 콘서트 예약 시스템의 데이터베이스 스키마와 데이터플로우를 정의합니다. 유저플로우에 명시된 데이터만을 포함하며, PostgreSQL을 사용합니다.

---

## 1. 데이터플로우 (Data Flow)

### 1.1 콘서트 목록 조회 플로우

```
[Client Request]
      ↓
[GET /api/concerts]
      ↓
[SELECT concerts, venues]
  - JOIN venues ON concerts.venue_id = venues.id
  - 예약 현황 계산 (COUNT reservation_seats)
      ↓
[Response: 콘서트 목록 + 예약 현황]
```

**조회 데이터:**
- concerts: id, name, date, poster_url
- venues: name
- 예약 현황: 예약된 좌석 수 / 총 좌석 수 (320석)

---

### 1.2 콘서트 상세 조회 플로우

```
[Client Request: concert_id]
      ↓
[GET /api/concerts/:id]
      ↓
[SELECT concert, venue, seat_grades]
  - SELECT concert WHERE id = :id
  - JOIN venue ON concert.venue_id = venue.id
  - SELECT seat_grades WHERE venue_id = venue.id
  - COUNT seats by grade and status
      ↓
[Response: 콘서트 상세 + 공연장 정보 + 좌석 등급별 정보]
```

**조회 데이터:**
- concerts: id, name, date, description, poster_url
- venues: name, address, section_count, rows_per_section, columns_per_section
- seat_grades: name, price, row_start, row_end
- 등급별 예약 수: COUNT(seats) WHERE grade = X AND status = 'RESERVED'

---

### 1.3 좌석 현황 조회 플로우

```
[Client Request: concert_id]
      ↓
[GET /api/concerts/:id/seats]
      ↓
[SELECT seats WHERE concert_id = :id]
  - SELECT id, section, row, column, grade, status
  - JOIN seat_grades to get price
      ↓
[Response: 좌석 목록 (구역, 행, 열, 등급, 가격, 상태)]
```

**조회 데이터:**
- seats: id, section, row, column, grade, status
- seat_grades: price (JOIN으로 가져옴)

---

### 1.4 예약 생성 플로우

```
[Client Request: seat_ids[], customer_info]
      ↓
[POST /api/reservations]
      ↓
[Transaction Begin]
      ↓
[1. 좌석 상태 확인]
  - SELECT status FROM seats WHERE id IN (seat_ids)
  - IF any status != 'AVAILABLE' THEN ROLLBACK
      ↓
[2. 예약 레코드 생성]
  - INSERT INTO reservations
    (concert_id, reservation_number, customer_name, 
     phone_number, password_hash, total_amount, status)
      ↓
[3. 좌석 상태 변경]
  - UPDATE seats SET status = 'RESERVED' WHERE id IN (seat_ids)
      ↓
[4. 예약-좌석 연결 생성]
  - INSERT INTO reservation_seats (reservation_id, seat_id)
    FOR EACH seat_id
      ↓
[Transaction Commit]
      ↓
[Response: 예약 번호, 예약 정보]
```

**생성 데이터:**
- reservations: 1개 레코드
- reservation_seats: N개 레코드 (선택한 좌석 수만큼)
- seats: status 업데이트 (AVAILABLE → RESERVED)

---

### 1.5 예약 조회 플로우

```
[Client Request: phone_number, password]
      ↓
[POST /api/reservations/lookup]
      ↓
[SELECT reservation]
  - SELECT * FROM reservations 
    WHERE phone_number = :phone AND password_hash = hash(:password)
  - JOIN concert, venue
  - JOIN reservation_seats, seats
      ↓
[Response: 예약 정보 + 콘서트 정보 + 좌석 정보]
```

**조회 데이터:**
- reservations: reservation_number, customer_name, phone_number, total_amount, created_at
- concerts: name, date
- venues: name
- seats: section, row, column (through reservation_seats)

---

## 2. 데이터베이스 스키마 (PostgreSQL)

### 2.1 ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌─────────────┐
│   venues    │◄───┐    │  concerts   │
└─────────────┘    │    └─────────────┘
       ▲           │           │
       │           │           │
       │           └───────────┘
       │                       │
       │                       ▼
┌─────────────┐         ┌─────────────┐
│seat_grades  │         │    seats    │
└─────────────┘         └─────────────┘
                               │
                               │
                               ▼
                        ┌─────────────┐
                        │reservation_ │
                        │   seats     │
                        └─────────────┘
                               ▲
                               │
                               │
                        ┌─────────────┐
                        │reservations │
                        └─────────────┘
```

---

### 2.2 테이블 정의

#### 2.2.1 venues (공연장)

```sql
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  section_count INTEGER NOT NULL DEFAULT 4,
  rows_per_section INTEGER NOT NULL DEFAULT 4,
  columns_per_section INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE venues IS '공연장 정보';
COMMENT ON COLUMN venues.name IS '공연장명';
COMMENT ON COLUMN venues.address IS '공연장 주소';
COMMENT ON COLUMN venues.section_count IS '구역 수 (A, B, C, D = 4개)';
COMMENT ON COLUMN venues.rows_per_section IS '구역별 행 수 (1~4)';
COMMENT ON COLUMN venues.columns_per_section IS '구역별 열 수 (1~20)';
```

**인덱스:**
```sql
CREATE INDEX idx_venues_name ON venues(name);
```

---

#### 2.2.2 seat_grades (좌석 등급)

```sql
CREATE TYPE seat_grade_type AS ENUM ('SPECIAL', 'PREMIUM', 'ADVANCED', 'REGULAR');

CREATE TABLE IF NOT EXISTS seat_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name seat_grade_type NOT NULL,
  price INTEGER NOT NULL,
  row_start INTEGER NOT NULL,
  row_end INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT seat_grades_venue_name_unique UNIQUE(venue_id, name)
);

COMMENT ON TABLE seat_grades IS '좌석 등급 정보';
COMMENT ON COLUMN seat_grades.name IS '좌석 등급명 (SPECIAL, PREMIUM, ADVANCED, REGULAR)';
COMMENT ON COLUMN seat_grades.price IS '좌석 가격 (원)';
COMMENT ON COLUMN seat_grades.row_start IS '등급 시작 열 번호';
COMMENT ON COLUMN seat_grades.row_end IS '등급 종료 열 번호';
```

**인덱스:**
```sql
CREATE INDEX idx_seat_grades_venue ON seat_grades(venue_id);
```

---

#### 2.2.3 concerts (콘서트)

```sql
CREATE TABLE IF NOT EXISTS concerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  name VARCHAR(200) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  poster_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE concerts IS '콘서트 정보';
COMMENT ON COLUMN concerts.name IS '콘서트명';
COMMENT ON COLUMN concerts.date IS '콘서트 일시';
COMMENT ON COLUMN concerts.description IS '콘서트 상세 설명';
COMMENT ON COLUMN concerts.poster_url IS '공연 포스터 이미지 URL';
```

**인덱스:**
```sql
CREATE INDEX idx_concerts_date ON concerts(date);
CREATE INDEX idx_concerts_venue ON concerts(venue_id);
```

---

#### 2.2.4 seats (좌석)

```sql
CREATE TYPE seat_status_type AS ENUM ('AVAILABLE', 'RESERVED');
CREATE TYPE section_type AS ENUM ('A', 'B', 'C', 'D');

CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  section section_type NOT NULL,
  row INTEGER NOT NULL CHECK (row >= 1 AND row <= 4),
  "column" INTEGER NOT NULL CHECK ("column" >= 1 AND "column" <= 20),
  grade seat_grade_type NOT NULL,
  status seat_status_type NOT NULL DEFAULT 'AVAILABLE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT seats_concert_position_unique UNIQUE(concert_id, section, row, "column")
);

COMMENT ON TABLE seats IS '좌석 정보';
COMMENT ON COLUMN seats.section IS '구역 (A, B, C, D)';
COMMENT ON COLUMN seats.row IS '행 번호 (1~4)';
COMMENT ON COLUMN seats."column" IS '열 번호 (1~20)';
COMMENT ON COLUMN seats.grade IS '좌석 등급';
COMMENT ON COLUMN seats.status IS '좌석 상태 (AVAILABLE: 예약 가능, RESERVED: 예약됨)';
```

**인덱스:**
```sql
CREATE INDEX idx_seats_concert ON seats(concert_id);
CREATE INDEX idx_seats_status ON seats(concert_id, status);
CREATE INDEX idx_seats_grade ON seats(concert_id, grade);
```

---

#### 2.2.5 reservations (예약)

```sql
CREATE TYPE reservation_status_type AS ENUM ('CONFIRMED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE RESTRICT,
  reservation_number VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(11) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  total_amount INTEGER NOT NULL,
  status reservation_status_type NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE reservations IS '예약 정보';
COMMENT ON COLUMN reservations.reservation_number IS '예약 번호 (고유)';
COMMENT ON COLUMN reservations.customer_name IS '예약자명';
COMMENT ON COLUMN reservations.phone_number IS '휴대폰번호 (숫자만, 하이픈 없이)';
COMMENT ON COLUMN reservations.password_hash IS '비밀번호 해시 (4자리 숫자)';
COMMENT ON COLUMN reservations.total_amount IS '총 결제 금액 (원)';
COMMENT ON COLUMN reservations.status IS '예약 상태 (CONFIRMED: 확정, CANCELLED: 취소)';
```

**인덱스:**
```sql
CREATE INDEX idx_reservations_phone ON reservations(phone_number);
CREATE INDEX idx_reservations_concert ON reservations(concert_id);
CREATE INDEX idx_reservations_number ON reservations(reservation_number);
CREATE INDEX idx_reservations_lookup ON reservations(phone_number, password_hash);
```

---

#### 2.2.6 reservation_seats (예약-좌석 연결)

```sql
CREATE TABLE IF NOT EXISTS reservation_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reservation_seats_unique UNIQUE(reservation_id, seat_id)
);

COMMENT ON TABLE reservation_seats IS '예약-좌석 연결 테이블';
COMMENT ON COLUMN reservation_seats.reservation_id IS '예약 ID';
COMMENT ON COLUMN reservation_seats.seat_id IS '좌석 ID';
```

**인덱스:**
```sql
CREATE INDEX idx_reservation_seats_reservation ON reservation_seats(reservation_id);
CREATE INDEX idx_reservation_seats_seat ON reservation_seats(seat_id);
```

---

### 2.3 트리거 (Triggers)

#### 2.3.1 updated_at 자동 갱신

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- venues
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- seat_grades
CREATE TRIGGER update_seat_grades_updated_at
  BEFORE UPDATE ON seat_grades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- concerts
CREATE TRIGGER update_concerts_updated_at
  BEFORE UPDATE ON concerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- seats
CREATE TRIGGER update_seats_updated_at
  BEFORE UPDATE ON seats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- reservations
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. 데이터 관계 및 제약사항

### 3.1 관계 (Relationships)

| Parent Table | Child Table | Relationship | Constraint |
|-------------|-------------|--------------|------------|
| venues | concerts | 1:N | ON DELETE RESTRICT |
| venues | seat_grades | 1:N | ON DELETE CASCADE |
| concerts | seats | 1:N | ON DELETE CASCADE |
| concerts | reservations | 1:N | ON DELETE RESTRICT |
| reservations | reservation_seats | 1:N | ON DELETE CASCADE |
| seats | reservation_seats | 1:N | ON DELETE RESTRICT |

### 3.2 제약사항 (Constraints)

**좌석 (seats):**
- 유니크 제약: (concert_id, section, row, column)
  - 동일 콘서트에서 같은 위치의 좌석은 중복 불가
- CHECK 제약: row는 1~4, column은 1~20 범위 내

**예약 (reservations):**
- 유니크 제약: reservation_number
  - 예약 번호는 전역 고유값

**예약-좌석 연결 (reservation_seats):**
- 유니크 제약: (reservation_id, seat_id)
  - 동일 예약에서 같은 좌석 중복 연결 방지

---

## 4. 주요 쿼리 패턴

### 4.1 콘서트 목록 조회 (예약 현황 포함)

```sql
SELECT 
  c.id,
  c.name,
  c.date,
  c.poster_url,
  v.name AS venue_name,
  COUNT(DISTINCT CASE WHEN s.status = 'RESERVED' THEN s.id END) AS reserved_count,
  (v.section_count * v.rows_per_section * v.columns_per_section) AS total_seats
FROM concerts c
INNER JOIN venues v ON c.venue_id = v.id
LEFT JOIN seats s ON c.id = s.concert_id
GROUP BY c.id, c.name, c.date, c.poster_url, v.name, v.section_count, v.rows_per_section, v.columns_per_section
ORDER BY c.date ASC;
```

---

### 4.2 콘서트 상세 조회 (좌석 등급별 정보 포함)

```sql
-- 콘서트 정보
SELECT 
  c.id,
  c.name,
  c.date,
  c.description,
  c.poster_url,
  v.name AS venue_name,
  v.address AS venue_address,
  v.section_count,
  v.rows_per_section,
  v.columns_per_section
FROM concerts c
INNER JOIN venues v ON c.venue_id = v.id
WHERE c.id = :concert_id;

-- 좌석 등급별 정보
SELECT 
  sg.name AS grade,
  sg.price,
  sg.row_start,
  sg.row_end,
  COUNT(CASE WHEN s.status = 'RESERVED' THEN 1 END) AS reserved_count,
  (v.section_count * v.rows_per_section * (sg.row_end - sg.row_start + 1)) AS total_seats
FROM seat_grades sg
INNER JOIN venues v ON sg.venue_id = v.id
LEFT JOIN seats s ON s.concert_id = :concert_id AND s.grade = sg.name
WHERE v.id = (SELECT venue_id FROM concerts WHERE id = :concert_id)
GROUP BY sg.name, sg.price, sg.row_start, sg.row_end, v.section_count, v.rows_per_section
ORDER BY sg.price DESC;
```

---

### 4.3 좌석 현황 조회

```sql
SELECT 
  s.id,
  s.section,
  s.row,
  s.column,
  s.grade,
  s.status,
  sg.price
FROM seats s
INNER JOIN concerts c ON s.concert_id = c.id
INNER JOIN seat_grades sg ON s.grade = sg.name AND sg.venue_id = c.venue_id
WHERE s.concert_id = :concert_id
ORDER BY s.section, s.row, s.column;
```

---

### 4.4 예약 생성 (트랜잭션)

```sql
BEGIN;

-- 1. 좌석 상태 확인
SELECT id, status 
FROM seats 
WHERE id = ANY(:seat_ids) 
FOR UPDATE;
-- IF any status != 'AVAILABLE' THEN ROLLBACK

-- 2. 예약 레코드 생성
INSERT INTO reservations (
  concert_id, 
  reservation_number, 
  customer_name, 
  phone_number, 
  password_hash, 
  total_amount, 
  status
) VALUES (
  :concert_id,
  :reservation_number,
  :customer_name,
  :phone_number,
  :password_hash,
  :total_amount,
  'CONFIRMED'
) RETURNING id;

-- 3. 좌석 상태 변경
UPDATE seats 
SET status = 'RESERVED', updated_at = CURRENT_TIMESTAMP
WHERE id = ANY(:seat_ids);

-- 4. 예약-좌석 연결 생성
INSERT INTO reservation_seats (reservation_id, seat_id)
SELECT :reservation_id, unnest(:seat_ids);

COMMIT;
```

---

### 4.5 예약 조회

```sql
SELECT 
  r.id,
  r.reservation_number,
  r.customer_name,
  r.phone_number,
  r.total_amount,
  r.status,
  r.created_at,
  c.name AS concert_name,
  c.date AS concert_date,
  v.name AS venue_name,
  json_agg(
    json_build_object(
      'section', s.section,
      'row', s.row,
      'column', s.column,
      'grade', s.grade
    ) ORDER BY s.section, s.row, s.column
  ) AS seats
FROM reservations r
INNER JOIN concerts c ON r.concert_id = c.id
INNER JOIN venues v ON c.venue_id = v.id
INNER JOIN reservation_seats rs ON r.id = rs.reservation_id
INNER JOIN seats s ON rs.seat_id = s.id
WHERE r.phone_number = :phone_number 
  AND r.password_hash = :password_hash
GROUP BY r.id, r.reservation_number, r.customer_name, r.phone_number, 
         r.total_amount, r.status, r.created_at, c.name, c.date, v.name
ORDER BY r.created_at DESC;
```

---

## 5. 데이터 초기화 예제

### 5.1 공연장 및 좌석 등급 데이터

```sql
-- 공연장 생성
INSERT INTO venues (name, address, section_count, rows_per_section, columns_per_section)
VALUES ('KSPO DOME', '서울특별시 송파구 올림픽로 424', 4, 4, 20)
RETURNING id;

-- 좌석 등급 생성 (venue_id는 위에서 생성된 ID 사용)
INSERT INTO seat_grades (venue_id, name, price, row_start, row_end)
VALUES 
  (:venue_id, 'SPECIAL', 250000, 1, 3),
  (:venue_id, 'PREMIUM', 190000, 4, 7),
  (:venue_id, 'ADVANCED', 170000, 8, 15),
  (:venue_id, 'REGULAR', 140000, 16, 20);
```

---

### 5.2 콘서트 생성 및 좌석 자동 생성

```sql
-- 콘서트 생성
INSERT INTO concerts (venue_id, name, date, description, poster_url)
VALUES (
  :venue_id,
  'IU Concert 2025',
  '2025-10-20 19:00:00+09',
  'IU 콘서트 2025 서울 공연',
  'https://picsum.photos/400/600'
)
RETURNING id;

-- 좌석 자동 생성 함수 (예시)
CREATE OR REPLACE FUNCTION generate_seats_for_concert(p_concert_id UUID)
RETURNS VOID AS $$
DECLARE
  v_section section_type;
  v_row INTEGER;
  v_column INTEGER;
  v_grade seat_grade_type;
BEGIN
  -- 4개 구역 (A, B, C, D)
  FOREACH v_section IN ARRAY ARRAY['A', 'B', 'C', 'D']::section_type[] LOOP
    -- 4개 행
    FOR v_row IN 1..4 LOOP
      -- 20개 열
      FOR v_column IN 1..20 LOOP
        -- 열 번호에 따라 등급 결정
        IF v_column BETWEEN 1 AND 3 THEN
          v_grade := 'SPECIAL';
        ELSIF v_column BETWEEN 4 AND 7 THEN
          v_grade := 'PREMIUM';
        ELSIF v_column BETWEEN 8 AND 15 THEN
          v_grade := 'ADVANCED';
        ELSE
          v_grade := 'REGULAR';
        END IF;
        
        -- 좌석 생성
        INSERT INTO seats (concert_id, section, row, "column", grade, status)
        VALUES (p_concert_id, v_section, v_row, v_column, v_grade, 'AVAILABLE');
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 사용 예시
SELECT generate_seats_for_concert(:concert_id);
```

---

## 6. 성능 최적화 고려사항

### 6.1 인덱스 전략

1. **조회 빈도가 높은 컬럼:**
   - `concerts.date` - 날짜별 콘서트 조회
   - `seats.concert_id, seats.status` - 좌석 현황 조회
   - `reservations.phone_number` - 예약 조회

2. **복합 인덱스:**
   - `reservations(phone_number, password_hash)` - 예약 조회 시 사용

3. **유니크 인덱스:**
   - `reservations.reservation_number` - 예약 번호 고유성 보장

### 6.2 쿼리 최적화

1. **JOIN 최소화:**
   - 필요한 경우에만 JOIN 사용
   - 서브쿼리보다 JOIN 선호

2. **집계 쿼리 캐싱:**
   - 콘서트 목록의 예약 현황은 캐싱 고려
   - Redis 등 외부 캐시 활용

3. **페이지네이션:**
   - LIMIT/OFFSET 사용
   - 커서 기반 페이지네이션 고려

### 6.3 동시성 제어

1. **낙관적 잠금:**
   - `SELECT ... FOR UPDATE` 사용하여 좌석 예약 시 충돌 방지

2. **트랜잭션 격리 수준:**
   - READ COMMITTED 또는 REPEATABLE READ 사용

---

## 7. 데이터 정합성 보장

### 7.1 예약 프로세스 정합성

```sql
-- 예약 생성 시 정합성 체크
CREATE OR REPLACE FUNCTION check_reservation_integrity()
RETURNS TRIGGER AS $$
BEGIN
  -- 좌석이 모두 AVAILABLE 상태인지 확인
  IF EXISTS (
    SELECT 1 FROM reservation_seats rs
    INNER JOIN seats s ON rs.seat_id = s.id
    WHERE rs.reservation_id = NEW.id AND s.status != 'AVAILABLE'
  ) THEN
    RAISE EXCEPTION 'Cannot reserve seats that are not available';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_reservation_before_insert
  AFTER INSERT ON reservation_seats
  FOR EACH ROW
  EXECUTE FUNCTION check_reservation_integrity();
```

### 7.2 좌석 상태 동기화

```sql
-- 예약 취소 시 좌석 상태 자동 복원
CREATE OR REPLACE FUNCTION restore_seats_on_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'CANCELLED' AND OLD.status = 'CONFIRMED' THEN
    UPDATE seats
    SET status = 'AVAILABLE'
    WHERE id IN (
      SELECT seat_id FROM reservation_seats WHERE reservation_id = NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restore_seats_on_reservation_cancel
  AFTER UPDATE ON reservations
  FOR EACH ROW
  WHEN (NEW.status = 'CANCELLED')
  EXECUTE FUNCTION restore_seats_on_cancellation();
```

---

## 8. 백업 및 복구 전략

### 8.1 백업 전략

1. **전체 백업:**
   - 일일 전체 백업 수행
   - pg_dump 사용

2. **증분 백업:**
   - WAL (Write-Ahead Logging) 아카이빙
   - Point-in-time Recovery 지원

### 8.2 복구 절차

```bash
# 전체 복구
pg_restore -d concert_db backup.dump

# 특정 시점 복구
pg_restore --time '2025-10-15 12:00:00' -d concert_db backup.dump
```

---

## 부록

### A. 테이블 크기 추정

**콘서트당 데이터 크기:**
- concerts: 1 row
- seats: 320 rows (4 sections × 4 rows × 20 columns)
- reservations: 최대 320 rows (매진 시)
- reservation_seats: 평균 2 rows per reservation

**예상 저장 용량 (콘서트 1개 기준):**
- concerts: ~500 bytes
- seats: ~100 KB (320 rows × ~300 bytes)
- reservations: ~32 KB (100 reservations × ~320 bytes)
- reservation_seats: ~6 KB (200 rows × ~30 bytes)
- **총: ~138.5 KB per concert**

### B. RLS (Row Level Security) 비활성화

가이드라인에 따라 RLS는 비활성화합니다:

```sql
ALTER TABLE venues DISABLE ROW LEVEL SECURITY;
ALTER TABLE seat_grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE concerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE seats DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_seats DISABLE ROW LEVEL SECURITY;
```

---

**문서 버전**: 1.0  
**작성일**: 2025-10-15  
**최종 수정일**: 2025-10-15

