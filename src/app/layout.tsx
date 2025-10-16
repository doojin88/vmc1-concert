import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { loadCurrentUser } from "@/features/auth/server/load-current-user";
import { CurrentUserProvider } from "@/features/auth/context/current-user-context";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "콘서트 예약 플랫폼",
  description: "인기 아티스트들의 콘서트를 쉽고 빠르게 예약할 수 있는 플랫폼입니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await loadCurrentUser();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <Providers>
          <CurrentUserProvider initialState={currentUser}>
            <Header />
            {children}
          </CurrentUserProvider>
        </Providers>
      </body>
    </html>
  );
}
