"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고/홈 링크 */}
          <Link href="/concerts" className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold">콘서트 예약</span>
          </Link>

          {/* 우측 네비게이션 */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/reservations" className="flex items-center space-x-1 sm:space-x-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">예약 조회</span>
                <span className="sm:hidden">조회</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
