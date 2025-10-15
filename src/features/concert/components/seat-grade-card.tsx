'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatPrice } from '@/lib/utils';
import type { SeatGrade } from '../lib/dto';

interface SeatGradeCardProps {
  grade: SeatGrade;
}

const gradeColors = {
  SPECIAL: 'bg-yellow-500',
  PREMIUM: 'bg-blue-500',
  ADVANCED: 'bg-green-500',
  REGULAR: 'bg-gray-500',
};

const gradeLabels = {
  SPECIAL: 'Special',
  PREMIUM: 'Premium',
  ADVANCED: 'Advanced',
  REGULAR: 'Regular',
};

export function SeatGradeCard({ grade }: SeatGradeCardProps) {
  const availableSeats = grade.total_seats - grade.reserved_count;
  const reservationRate = grade.total_seats > 0 
    ? (grade.reserved_count / grade.total_seats) * 100 
    : 0;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={gradeColors[grade.name]}>
            {gradeLabels[grade.name]}
          </Badge>
          <span className="text-lg font-bold">{formatPrice(grade.price)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>좌석 범위: {grade.row_start}~{grade.row_end}열</p>
          <p>
            잔여석: {availableSeats}/{grade.total_seats}석
          </p>
        </div>
        <Progress value={reservationRate} className="h-2" />
      </CardContent>
    </Card>
  );
}

