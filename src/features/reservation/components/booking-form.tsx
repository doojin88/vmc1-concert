'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateReservationSchema } from '../backend/schema';
import { useCreateReservation } from '../hooks/use-create-reservation';
import { useBooking } from '@/features/booking/context/use-booking';
import { formatPhoneNumberInput } from '@/lib/utils';
import { z } from 'zod';

// 프론트엔드 폼용 스키마 (concert_id, seat_ids 제외)
const formSchema = CreateReservationSchema.omit({ concert_id: true, seat_ids: true });
type FormData = z.infer<typeof formSchema>;

interface BookingFormProps {
  concertId: string;
}

export function BookingForm({ concertId }: BookingFormProps) {
  const router = useRouter();
  const { state } = useBooking();
  const mutation = useCreateReservation(concertId);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: '',
      phone_number: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    const seatIds = state.selectedSeats.map((seat) => seat.id);
    mutation.mutate({
      concert_id: concertId,
      seat_ids: seatIds,
      ...data,
    } as any);
  };

  const handlePrevious = () => {
    router.push(`/concerts/${concertId}/seats`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>예약자명 *</FormLabel>
              <FormControl>
                <Input placeholder="홍길동" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>휴대폰번호 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="01012345678"
                  {...field}
                  onChange={(e) => {
                    const formatted = formatPhoneNumberInput(e.target.value);
                    field.onChange(formatted);
                  }}
                  maxLength={11}
                />
              </FormControl>
              <FormDescription>예) 01012345678 (하이픈 없이)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 (4자리) *</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="1234"
                  {...field}
                  onChange={(e) => {
                    const formatted = formatPhoneNumberInput(e.target.value);
                    field.onChange(formatted);
                  }}
                  maxLength={4}
                />
              </FormControl>
              <FormDescription>예약 조회 시 사용됩니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {mutation.error instanceof Error
              ? mutation.error.message
              : '예약에 실패했습니다. 다시 시도해주세요.'}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={mutation.isPending}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1"
          >
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            예약 완료
          </Button>
        </div>
      </form>
    </Form>
  );
}

