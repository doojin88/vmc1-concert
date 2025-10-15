-- 예약 취소를 위한 RPC 함수 생성
CREATE OR REPLACE FUNCTION cancel_reservation_transaction(p_reservation_number TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    reservation_record RECORD;
    seat_record RECORD;
BEGIN
    -- 예약 정보 조회
    SELECT id, status, concert_id
    INTO reservation_record
    FROM reservations
    WHERE reservation_number = p_reservation_number
    AND status = 'CONFIRMED';

    -- 예약이 존재하지 않거나 이미 취소된 경우
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', '예약을 찾을 수 없거나 이미 취소되었습니다'
        );
    END IF;

    -- 트랜잭션 시작
    BEGIN
        -- 1. 예약 상태를 CANCELLED로 변경
        UPDATE reservations
        SET status = 'CANCELLED',
            updated_at = NOW()
        WHERE id = reservation_record.id;

        -- 2. 예약된 좌석들을 다시 사용 가능하게 변경
        UPDATE seats
        SET is_available = true,
            updated_at = NOW()
        WHERE id IN (
            SELECT seat_id
            FROM reservation_seats
            WHERE reservation_id = reservation_record.id
        );

        -- 3. 예약-좌석 관계 삭제 (선택사항 - 데이터 보존을 위해 주석 처리)
        -- DELETE FROM reservation_seats WHERE reservation_id = reservation_record.id;

        RETURN json_build_object(
            'success', true,
            'message', '예약이 성공적으로 취소되었습니다'
        );

    EXCEPTION
        WHEN OTHERS THEN
            -- 오류 발생 시 롤백
            RETURN json_build_object(
                'success', false,
                'message', '예약 취소 중 오류가 발생했습니다: ' || SQLERRM
            );
    END;
END;
$$;

-- 함수에 대한 주석 추가
COMMENT ON FUNCTION cancel_reservation_transaction(TEXT) IS '예약을 취소하고 관련 좌석을 다시 사용 가능하게 만드는 트랜잭션 함수';
