"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCancelReservation } from "../hooks/use-cancel-reservation";
import { useToast } from "@/hooks/use-toast";
import type { ReservationResponse } from "../lib/dto";

interface CancelReservationDialogProps {
  reservation: ReservationResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CancelReservationDialog({
  reservation,
  isOpen,
  onClose,
  onSuccess,
}: CancelReservationDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const cancelReservation = useCancelReservation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      toast({
        title: "입력 오류",
        description: "휴대폰번호와 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      await cancelReservation.mutateAsync({
        reservation_number: reservation.reservation_number,
        phone_number: phoneNumber,
        password,
      });

      onSuccess?.();
      onClose();
      setPhoneNumber("");
      setPassword("");
    } catch (error) {
      toast({
        title: "예약 취소 실패",
        description: error instanceof Error ? error.message : "예약 취소에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>예약 취소</DialogTitle>
          <DialogDescription>
            예약을 취소하려면 예약 시 입력한 휴대폰번호와 비밀번호를 입력해주세요.
            <br />
            <span className="text-sm text-muted-foreground">
              예약번호: {reservation.reservation_number}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">휴대폰번호</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={cancelReservation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              예) 01012345678 (하이픈 없이)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호 (4자리)</Label>
            <Input
              id="password"
              type="password"
              placeholder="1234"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cancelReservation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              예약 시 입력한 비밀번호를 입력해주세요.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={cancelReservation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={cancelReservation.isPending}
            >
              {cancelReservation.isPending ? "취소 중..." : "예약 취소"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
