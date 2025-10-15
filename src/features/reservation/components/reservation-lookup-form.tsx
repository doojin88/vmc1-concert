'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import { LookupReservationSchema } from '../backend/schema';
import { useLookupReservation } from '../hooks/use-lookup-reservation';
import { formatPhoneNumberInput } from '@/lib/utils';
import type { LookupReservationInput, ReservationListResponse } from '../lib/dto';

interface ReservationLookupFormProps {
  onSuccess: (data: ReservationListResponse) => void;
}

export function ReservationLookupForm({ onSuccess }: ReservationLookupFormProps) {
  const mutation = useLookupReservation();

  const form = useForm<LookupReservationInput>({
    resolver: zodResolver(LookupReservationSchema),
    defaultValues: {
      phone_number: '',
      password: '',
    },
  });

  const onSubmit = (data: LookupReservationInput) => {
    mutation.mutate(data, {
      onSuccess: (result) => {
        onSuccess(result);
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormDescription>예약 시 입력한 비밀번호를 입력해주세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            예약 정보를 찾을 수 없습니다. 휴대폰번호와 비밀번호를 확인해주세요.
          </div>
        )}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full"
          size="lg"
        >
          {mutation.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          조회하기
        </Button>
      </form>
    </Form>
  );
}

