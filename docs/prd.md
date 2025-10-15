# PRD: 콘서트 예약 웹앱

## 1. 제품 개요

### 1.1 제품명
콘서트 예약 시스템 (Concert Reservation System)

### 1.2 제품 목적
사용자가 온라인에서 콘서트 정보를 확인하고, 원하는 좌석을 선택하여 예약할 수 있는 웹 기반 예약 시스템을 제공합니다. 실시간 좌석 현황 확인과 직관적인 UI를 통해 원활한 예약 경험을 제공하는 것이 목표입니다.

### 1.3 핵심 가치
- **실시간 좌석 확인**: 예약 가능한 좌석을 실시간으로 확인
- **직관적인 좌석 선택**: 공연장 레이아웃을 시각화하여 원하는 좌석 쉽게 선택
- **간편한 예약 관리**: 휴대폰번호와 비밀번호로 예약 내역 조회 가능

### 1.4 기술 아키텍처
- **상태 관리**: Flux 아키텍처 패턴 적용
- **비즈니스 로직**: React Context를 통한 중앙화 관리
- **프레임워크**: Next.js + React
- **UI**: shadcn-ui, Tailwind CSS
- **백엔드**: Hono + Supabase

---

## 2. Stakeholders

| 역할 | 책임 | 주요 관심사 |
|------|------|------------|
| **사용자** | 콘서트 예약 및 조회 | 쉬운 좌석 선택, 빠른 예약 프로세스 |

---

## 3. 포함 페이지

### 3.1 메인 페이지 목록

| 페이지명 | 경로 | 설명 |
|---------|------|------|
| 콘서트 목록 | `/concerts` | 예약 가능한 콘서트 목록 표시 |
| 콘서트 상세 | `/concerts/:id` | 콘서트 상세 정보 및 공연장 정보 표시 |
| 좌석 선택 | `/concerts/:id/seats` | 공연장 좌석 레이아웃 및 선택 인터페이스 |
| 예약 정보 입력 | `/concerts/:id/booking` | 예약자 정보 입력 폼 |
| 예약 완료 | `/concerts/:id/confirmation` | 예약 완료 확인 및 예약 번호 표시 |
| 예약 조회 | `/reservations` | 휴대폰번호와 비밀번호로 예약 조회 |

### 3.2 페이지별 상세 스펙

#### 3.2.1 콘서트 목록 (`/concerts`)
**표시 항목:**
- 공연 포스터 이미지 (placeholder: picsum.photos)
- 공연명 (예: "IU Concert 2025")
- 날짜 및 시간 📅 (예: 2025년 10월 20일 19:00)
- 공연 장소 📍 (예: KSPO DOME)
- 예약 현황 👥 (예: 8/320명)

**UI 구성:**
- 카드 형식의 그리드 레이아웃
- 각 카드 클릭 시 콘서트 상세 페이지로 이동

#### 3.2.2 콘서트 상세 (`/concerts/:id`)
**콘서트 정보:**
- 콘서트명
- 일시
- 공연장명
- 상세 설명
- 공연 포스터 URL

**공연장 정보:**
- 주소
- 좌석 구성:
  - 구역: A, B, C, D (총 4개)
  - 구역별 행수: 4개
  - 구역별 열수: 20개
- 좌석 등급별 정보:
  - Special: 250,000원 (1~3열, 총 48석: 4구역 × 4행 × 3열)
  - Premium: 190,000원 (4~7열, 총 64석: 4구역 × 4행 × 4열)
  - Advanced: 170,000원 (8~15열, 총 128석: 4구역 × 4행 × 8열)
  - Regular: 140,000원 (16~20열, 총 80석: 4구역 × 4행 × 5열)

**액션:**
- "좌석 선택하기" 버튼 → 좌석 선택 페이지로 이동

#### 3.2.3 좌석 선택 (`/concerts/:id/seats`)
**좌석 레이아웃:**
- 4개 구역 (A, B, C, D) 시각화
- 각 구역: 4행 × 20열
- 좌석 등급별 색상 구분:
  - Special (1~3열)
  - Premium (4~7열)
  - Advanced (8~15열)
  - Regular (16~20열)

**좌석 상태:**
- 예약 가능 (Available)
- 선택됨 (Selected)
- 예약됨 (Reserved)

**상호작용:**
- 좌석 클릭으로 선택/선택 해제
- 선택된 좌석 정보 실시간 표시
- 총 금액 계산 표시
- "예약하기" 버튼 → 예약 정보 입력 페이지로 이동

#### 3.2.4 예약 정보 입력 (`/concerts/:id/booking`)
**선택된 좌석 표시:**
- 선택한 좌석 수
- 선택한 좌석 내역. 예: "B구역 1행 1열", "A구역 2행 1열"

**입력 필드:**
- 예약자명 (필수)
- 휴대폰번호 (필수, 숫자만)
  - 안내문구: "예) 0111012345678(하이폰 없이)"
  - 유효성 검증: 숫자만 입력 가능
- 비밀번호 4자리 (필수)
  - 안내문구: "예약 조회 시 사용됩니다."
  - 유효성 검증: 숫자 4자리

**액션:**
- "예약 완료" 버튼 → 예약 완료 페이지로 이동
- "이전" 버튼 → 좌석 선택 페이지로 돌아가기

#### 3.2.5 예약 완료 (`/concerts/:id/confirmation`)
**표시 정보:**
- 예약 완료 메시지
- 예약 번호
- 콘서트 정보 요약
- 예약된 좌석 정보
- 예약자 정보 (이름, 휴대폰번호)
- 총 결제 금액

**액션:**
- "홈으로" 버튼 → 콘서트 목록으로 이동
- "예약 조회" 버튼 → 예약 조회 페이지로 이동

#### 3.2.6 예약 조회 (`/reservations`)
**입력 필드:**
- 휴대폰번호 (필수, 숫자만)
  - 안내문구: "예) 0111012345678(하이폰 없이)"
- 비밀번호 4자리 (필수)
  - 안내문구: "예약 조회 시 사용됩니다."

**조회 결과:**
- 예약 번호
- 콘서트 정보
- 예약된 좌석 정보
- 예약자 정보
- 예약 일시

**액션:**
- "조회하기" 버튼
- 예약 취소 기능 (옵션)

---

## 4. 사용자 여정 (User Journey)

### 4.1 타겟 유저 Segment

#### Primary Persona: 콘서트 팬 (20-40대)
- **특징**: 좋아하는 아티스트의 콘서트를 자주 예약
- **니즈**: 원하는 좌석을 빠르고 정확하게 선택하고 싶음
- **Pain Point**: 좌석 위치를 모르고 예약하여 실망한 경험

#### Secondary Persona: 처음 예약하는 사용자
- **특징**: 콘서트 예약 경험이 적거나 없음
- **니즈**: 직관적이고 쉬운 예약 프로세스
- **Pain Point**: 복잡한 예약 절차, 좌석 등급 이해 어려움

### 4.2 사용자 여정 맵

#### Journey 1: 신규 예약 플로우

```
[시작] → [콘서트 목록] → [콘서트 상세] → [좌석 선택] → [예약 정보 입력] → [예약 완료] → [종료]
```

**단계별 상세:**

1. **콘서트 발견** (`/concerts`)
   - 사용자 액션: 콘서트 목록 페이지 방문
   - 사용자 니즈: 원하는 콘서트 찾기
   - 제공 정보: 공연명, 날짜, 장소, 예약 현황
   - 페이지: 콘서트 목록

2. **상세 정보 확인** (`/concerts/:id`)
   - 사용자 액션: 관심 있는 콘서트 카드 클릭
   - 사용자 니즈: 콘서트 상세 정보 및 좌석 가격 확인
   - 제공 정보: 콘서트 상세, 공연장 정보, 좌석 등급별 가격
   - 페이지: 콘서트 상세

3. **좌석 선택** (`/concerts/:id/seats`)
   - 사용자 액션: "좌석 선택하기" 버튼 클릭
   - 사용자 니즈: 원하는 위치의 좌석 선택
   - 제공 정보: 공연장 좌석 레이아웃, 실시간 예약 현황, 좌석 등급
   - 상호작용: 좌석 클릭으로 선택/해제, 총 금액 실시간 계산
   - 페이지: 좌석 선택

4. **예약 정보 입력** (`/concerts/:id/booking`)
   - 사용자 액션: "예약하기" 버튼 클릭
   - 사용자 니즈: 예약자 정보 입력하여 예약 확정
   - 제공 정보: 선택된 좌석 요약, 총 금액
   - 입력 항목: 예약자명, 휴대폰번호, 비밀번호 4자리
   - 페이지: 예약 정보 입력

5. **예약 확인** (`/concerts/:id/confirmation`)
   - 사용자 액션: "예약 완료" 버튼 클릭
   - 사용자 니즈: 예약 완료 확인 및 예약 번호 저장
   - 제공 정보: 예약 번호, 콘서트 정보, 좌석 정보, 총 금액
   - 페이지: 예약 완료

#### Journey 2: 예약 조회 플로우

```
[시작] → [예약 조회] → [예약 상세 확인] → [종료]
```

**단계별 상세:**

1. **예약 조회 진입** (`/reservations`)
   - 사용자 액션: 예약 조회 페이지 방문
   - 사용자 니즈: 이전에 예약한 내역 확인
   - 입력 항목: 휴대폰번호, 비밀번호 4자리
   - 페이지: 예약 조회

2. **예약 정보 확인** (`/reservations`)
   - 사용자 액션: "조회하기" 버튼 클릭
   - 사용자 니즈: 예약 세부사항 확인
   - 제공 정보: 예약 번호, 콘서트 정보, 좌석 정보, 예약 일시
   - 페이지: 예약 조회 (결과 표시)

---

## 5. Information Architecture (IA)

### 5.1 사이트 구조 (Tree Visualization)

```
📱 콘서트 예약 시스템
│
├── 🏠 Home (/)
│   └── 콘서트 목록으로 리다이렉트
│
├── 🎵 콘서트 목록 (/concerts)
│   ├── 콘서트 카드 1
│   ├── 콘서트 카드 2
│   └── 콘서트 카드 N
│
├── 🎤 콘서트 상세 (/concerts/:id)
│   ├── 콘서트 정보 섹션
│   │   ├── 공연명
│   │   ├── 일시
│   │   ├── 상세 설명
│   │   └── 공연 포스터
│   ├── 공연장 정보 섹션
│   │   ├── 공연장명
│   │   ├── 주소
│   │   └── 좌석 구성
│   └── 좌석 등급 정보 섹션
│       ├── Special (250,000원, 48석)
│       ├── Premium (190,000원, 64석)
│       ├── Advanced (170,000원, 128석)
│       └── Regular (140,000원, 80석)
│
├── 💺 좌석 선택 (/concerts/:id/seats)
│   ├── 공연장 레이아웃 시각화
│   │   ├── A 구역 (4행 × 20열)
│   │   ├── B 구역 (4행 × 20열)
│   │   ├── C 구역 (4행 × 20열)
│   │   └── D 구역 (4행 × 20열)
│   ├── 좌석 등급 범례
│   │   ├── Special (1~3열)
│   │   ├── Premium (4~7열)
│   │   ├── Advanced (8~15열)
│   │   └── Regular (16~20열)
│   └── 선택 정보 패널
│       ├── 선택된 좌석 목록
│       ├── 총 금액
│       └── 예약하기 버튼
│
├── 📝 예약 정보 입력 (/concerts/:id/booking)
│   ├── 선택 좌석 요약
│   │   ├── 좌석 1 (구역-행-열)
│   │   ├── 좌석 2 (구역-행-열)
│   │   └── 총 금액
│   └── 예약자 정보 폼
│       ├── 예약자명
│       ├── 휴대폰번호 (숫자만)
│       └── 비밀번호 (4자리)
│
├── ✅ 예약 완료 (/concerts/:id/confirmation)
│   ├── 예약 완료 메시지
│   ├── 예약 번호
│   ├── 콘서트 정보
│   ├── 예약된 좌석 정보
│   ├── 예약자 정보
│   └── 총 결제 금액
│
└── 🔍 예약 조회 (/reservations)
    ├── 조회 폼
    │   ├── 휴대폰번호 입력
    │   └── 비밀번호 입력 (4자리)
    └── 조회 결과
        ├── 예약 번호
        ├── 콘서트 정보
        ├── 예약된 좌석 정보
        ├── 예약자 정보
        └── 예약 일시
```

### 5.2 네비게이션 플로우

```
┌─────────────────┐
│  콘서트 목록     │
│  /concerts      │
└────────┬────────┘
         │ 클릭
         ▼
┌─────────────────┐
│  콘서트 상세     │
│  /concerts/:id  │
└────────┬────────┘
         │ 좌석 선택하기
         ▼
┌─────────────────┐
│  좌석 선택       │◄──┐ 이전 버튼
│/concerts/:id/   │   │
│    seats        │   │
└────────┬────────┘   │
         │ 예약하기    │
         ▼            │
┌─────────────────┐   │
│ 예약 정보 입력   │───┘
│/concerts/:id/   │
│    booking      │
└────────┬────────┘
         │ 예약 완료
         ▼
┌─────────────────┐
│  예약 완료       │
│/concerts/:id/   │
│  confirmation   │
└────────┬────────┘
         │
         ├─── 홈으로 ────► 콘서트 목록
         │
         └─ 예약 조회 ──► 예약 조회 페이지


독립 플로우:
┌─────────────────┐
│  예약 조회       │
│  /reservations  │
└─────────────────┘
```

### 5.3 데이터 구조

#### 주요 엔티티

**Concert (콘서트)**
```typescript
{
  id: string
  name: string
  date: Date
  venue_id: string
  description: string
  poster_url: string
  created_at: Date
  updated_at: Date
}
```

**Venue (공연장)**
```typescript
{
  id: string
  name: string
  address: string
  section_count: number    // 구역 수 (4)
  rows_per_section: number // 구역별 행수 (4)
  columns_per_section: number // 구역별 열수 (20)
  created_at: Date
  updated_at: Date
}
```

**SeatGrade (좌석 등급)**
```typescript
{
  id: string
  venue_id: string
  name: 'SPECIAL' | 'PREMIUM' | 'ADVANCED' | 'REGULAR'
  price: number
  row_start: number
  row_end: number
  created_at: Date
  updated_at: Date
}
```

**Seat (좌석)**
```typescript
{
  id: string
  concert_id: string
  section: 'A' | 'B' | 'C' | 'D'
  row: number        // 1-20
  column: number     // 1-4
  grade: 'SPECIAL' | 'PREMIUM' | 'ADVANCED' | 'REGULAR'
  status: 'AVAILABLE' | 'RESERVED' | 'SELECTED'
  created_at: Date
  updated_at: Date
}
```

**Reservation (예약)**
```typescript
{
  id: string
  concert_id: string
  reservation_number: string
  customer_name: string
  phone_number: string
  password_hash: string  // 4자리 비밀번호 해시
  total_amount: number
  status: 'CONFIRMED' | 'CANCELLED'
  created_at: Date
  updated_at: Date
}
```

**ReservationSeat (예약-좌석 연결)**
```typescript
{
  id: string
  reservation_id: string
  seat_id: string
  created_at: Date
}
```

---

## 6. 기술 스펙 및 아키텍처

### 6.1 아키텍처 패턴

#### Flux Architecture
- **Action**: 사용자 인터랙션을 액션으로 정의
- **Dispatcher**: Context를 통한 액션 디스패치
- **Store**: 예약 상태, 좌석 선택 상태 등을 Store로 관리
- **View**: React Component로 UI 렌더링

#### State Management Strategy
- **전역 상태**: React Context로 관리
  - 선택된 좌석 정보
  - 현재 예약 플로우 상태
- **서버 상태**: React Query로 관리
  - 콘서트 목록
  - 콘서트 상세 정보
  - 좌석 예약 현황
- **로컬 상태**: useState로 관리
  - 폼 입력 값
  - UI 상태 (모달 열림/닫힘 등)

### 6.2 Context 구조

```typescript
// BookingContext
{
  selectedConcert: Concert | null
  selectedSeats: Seat[]
  totalAmount: number
  actions: {
    selectSeat: (seat: Seat) => void
    deselectSeat: (seatId: string) => void
    clearSelection: () => void
    submitReservation: (info: ReservationInfo) => Promise<void>
  }
}
```

### 6.3 디렉터리 구조

```
src/
├── features/
│   ├── concert/
│   │   ├── components/
│   │   │   ├── concert-card.tsx
│   │   │   ├── concert-list.tsx
│   │   │   └── concert-detail.tsx
│   │   ├── hooks/
│   │   │   ├── useConcerts.ts
│   │   │   └── useConcertDetail.ts
│   │   ├── backend/
│   │   │   ├── route.ts
│   │   │   ├── service.ts
│   │   │   ├── schema.ts
│   │   │   └── error.ts
│   │   └── lib/
│   │       └── dto.ts
│   │
│   ├── seat/
│   │   ├── components/
│   │   │   ├── seat-map.tsx
│   │   │   ├── seat-legend.tsx
│   │   │   └── seat-selection-panel.tsx
│   │   ├── hooks/
│   │   │   └── useSeats.ts
│   │   ├── backend/
│   │   │   ├── route.ts
│   │   │   ├── service.ts
│   │   │   ├── schema.ts
│   │   │   └── error.ts
│   │   └── lib/
│   │       └── dto.ts
│   │
│   └── reservation/
│       ├── components/
│       │   ├── reservation-form.tsx
│       │   ├── reservation-confirmation.tsx
│       │   └── reservation-lookup.tsx
│       ├── context/
│       │   └── booking-context.tsx
│       ├── hooks/
│       │   ├── useBooking.ts
│       │   └── useReservationLookup.ts
│       ├── backend/
│       │   ├── route.ts
│       │   ├── service.ts
│       │   ├── schema.ts
│       │   └── error.ts
│       └── lib/
│           └── dto.ts
│
└── app/
    ├── concerts/
    │   ├── page.tsx
    │   └── [id]/
    │       ├── page.tsx
    │       ├── seats/
    │       │   └── page.tsx
    │       ├── booking/
    │       │   └── page.tsx
    │       └── confirmation/
    │           └── page.tsx
    └── reservations/
        └── page.tsx
```

---

## 7. 주요 기능 요구사항

### 7.1 좌석 선택 로직

**좌석 등급 매핑:**
- 1~3열: Special (250,000원)
- 4~7열: Premium (190,000원)
- 8~15열: Advanced (170,000원)
- 16~20열: Regular (140,000원)

**좌석 배치:**
- 총 4개 구역 (A, B, C, D)
- 각 구역: 4행 × 20열 = 80석
- 전체 좌석: 80석 × 4구역 = 320석

**등급별 좌석 수:**
- Special: 4구역 × 4행 × 3열 = 48석
- Premium: 4구역 × 4행 × 4열 = 64석
- Advanced: 4구역 × 4행 × 8열 = 128석
- Regular: 4구역 × 4행 × 5열 = 80석

### 7.2 예약 유효성 검증

**예약자명:**
- 필수 입력
- 최소 2자, 최대 20자

**휴대폰번호:**
- 필수 입력
- 숫자만 허용 (하이픈 없이)
- 10~11자리
- 형식: 01012345678

**비밀번호:**
- 필수 입력
- 숫자 4자리
- 예약 조회 시 사용

### 7.3 동시성 제어

- 좌석 선택 시 임시 잠금 (5분)
- 예약 완료 시 좌석 상태 RESERVED로 변경
- 중복 예약 방지 로직

---

## 8. 비기능 요구사항

### 8.1 성능
- 페이지 로딩 시간: 3초 이내
- 좌석 선택 반응 속도: 100ms 이내
- 동시 접속자 처리: 최소 100명

### 8.2 접근성
- WCAG 2.1 AA 레벨 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환

### 8.3 반응형 디자인
- 모바일 (320px~768px)
- 태블릿 (768px~1024px)
- 데스크톱 (1024px 이상)

### 8.4 브라우저 지원
- Chrome (최신 2버전)
- Safari (최신 2버전)
- Firefox (최신 2버전)
- Edge (최신 2버전)

---

## 부록

### A. 용어 정의
- **구역(Section)**: A, B, C, D로 나뉘는 공연장의 큰 구획
- **행(Row)**: 좌석의 가로줄 (1~4)
- **열(Column)**: 좌석의 세로줄 (1~20)
- **좌석 등급(Seat Grade)**: Special, Premium, Advanced, Regular

### B. 참고 문서
- Flux Architecture: https://facebookarchive.github.io/flux/
- React Context: https://react.dev/reference/react/createContext
- Next.js Routing: https://nextjs.org/docs/app/building-your-application/routing

---

**문서 버전**: 1.0  
**작성일**: 2025-10-15  
**최종 수정일**: 2025-10-15

