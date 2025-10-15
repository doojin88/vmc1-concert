'use client';

import { useState } from 'react';
import { ReservationLookupForm } from '@/features/reservation/components/reservation-lookup-form';
import { ReservationDetail } from '@/features/reservation/components/reservation-detail';
import type { ReservationListResponse } from '@/features/reservation/lib/dto';

export default function ReservationsPage() {
  const [lookupResult, setLookupResult] = useState<ReservationListResponse | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">예약 조회</h1>

      <div className="space-y-8">
        {/* 조회 폼 */}
        <div className="bg-card border rounded-lg p-6">
          <ReservationLookupForm onSuccess={setLookupResult} />
        </div>

        {/* 조회 결과 */}
        {lookupResult && (
          <ReservationDetail reservations={lookupResult.reservations} />
        )}
      </div>
    </div>
  );
}

