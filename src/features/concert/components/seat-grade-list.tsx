'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeatGradeCard } from './seat-grade-card';
import type { SeatGrade } from '../lib/dto';

interface SeatGradeListProps {
  grades: SeatGrade[];
}

export function SeatGradeList({ grades }: SeatGradeListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>좌석 등급 및 가격</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {grades.map((grade) => (
            <SeatGradeCard key={grade.name} grade={grade} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

