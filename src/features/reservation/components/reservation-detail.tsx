'use client';

import { Calendar, MapPin, User, Phone, CreditCard, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatConcertDate, formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ReservationResponse } from '../lib/dto';

interface ReservationDetailProps {
  reservations: ReservationResponse[];
}

const gradeLabels = {
  SPECIAL: 'Special',
  PREMIUM: 'Premium',
  ADVANCED: 'Advanced',
  REGULAR: 'Regular',
};

export function ReservationDetail({ reservations }: ReservationDetailProps) {
  if (reservations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">예약 내역</h2>
        <Badge variant="secondary">{reservations.length}건</Badge>
      </div>

      {reservations.map((reservation) => {
        const reservedAt = format(
          new Date(reservation.created_at),
          'yyyy년 MM월 dd일 HH:mm',
          { locale: ko }
        );

        return (
          <Card key={reservation.reservation_number}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>예약 번호</CardTitle>
                <span className="text-lg font-bold text-primary">
                  {reservation.reservation_number}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 콘서트 정보 */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  콘서트 정보
                </h3>
                <div className="ml-6 space-y-1">
                  <p className="font-medium">{reservation.concert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatConcertDate(reservation.concert.date)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{reservation.concert.venue_name}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 예약 좌석 */}
              <div className="space-y-2">
                <h3 className="font-semibold">
                  예약된 좌석 ({reservation.seats.length}석)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {reservation.seats.map((seat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                    >
                      <span>
                        {seat.section}구역 {seat.row}행 {seat.column}열
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {gradeLabels[seat.grade]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 예약자 정보 */}
              <div className="space-y-2">
                <h3 className="font-semibold">예약자 정보</h3>
                <div className="ml-6 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{reservation.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{reservation.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">예약일시: {reservedAt}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 결제 금액 */}
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">총 결제 금액</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(reservation.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

