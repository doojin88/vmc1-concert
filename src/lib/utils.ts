import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConcertDate(date: string | Date): string {
  return format(new Date(date), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}
