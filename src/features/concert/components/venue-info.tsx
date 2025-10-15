'use client';

import { Building2, Grid3x3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Venue } from '../lib/dto';

interface VenueInfoProps {
  venue: Venue;
}

export function VenueInfo({ venue }: VenueInfoProps) {
  const totalSeats =
    venue.section_count * venue.rows_per_section * venue.columns_per_section;

  return (
    <Card>
      <CardHeader>
        <CardTitle>공연장 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">{venue.name}</p>
            <p className="text-sm text-muted-foreground">{venue.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Grid3x3 className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="text-sm">
            <p>
              구역: {venue.section_count}개 (A, B, C, D)
            </p>
            <p>
              좌석 구성: {venue.rows_per_section}행 × {venue.columns_per_section}열
            </p>
            <p className="text-muted-foreground">총 {totalSeats}석</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

