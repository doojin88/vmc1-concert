'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, MapPin, User, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatConcertDate, formatPrice } from '@/lib/utils';
import type { ReservationResponse } from '../lib/dto';

interface ReservationConfirmationProps {
  reservation: ReservationResponse;
}

const gradeLabels = {
  SPECIAL: 'Special',
  PREMIUM: 'Premium',
  ADVANCED: 'Advanced',
  REGULAR: 'Regular',
};

export function ReservationConfirmation({ reservation }: ReservationConfirmationProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* 예약 완료 메시지 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold">예약이 완료되었습니다!</h2>
            <p className="text-muted-foreground">
              예약 번호를 꼭 기억해주세요.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 예약 번호 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">예약 번호</p>
            <p className="text-3xl font-bold text-primary tracking-wider">
              {reservation.reservation_number}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 콘서트 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>콘서트 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{reservation.concert.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatConcertDate(reservation.concert.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">{reservation.concert.venue_name}</p>
          </div>
        </CardContent>
      </Card>

      {/* 예약된 좌석 */}
      <Card>
        <CardHeader>
          <CardTitle>예약된 좌석 ({reservation.seats.length}석)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reservation.seats.map((seat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="font-medium">
                  {seat.section}구역 {seat.row}행 {seat.column}열
                </span>
                <Badge variant="outline">{gradeLabels[seat.grade]}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 예약자 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>예약자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <p>{reservation.customer_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <p>{reservation.phone_number}</p>
          </div>
        </CardContent>
      </Card>

      {/* 결제 금액 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">총 결제 금액</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(reservation.total_amount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/concerts')}
          className="flex-1"
        >
          홈으로
        </Button>
        <Button
          size="lg"
          onClick={() => router.push('/reservations')}
          className="flex-1"
        >
          예약 조회
        </Button>
      </div>
    </div>
  );
}

