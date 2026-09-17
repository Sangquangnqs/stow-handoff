import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STOW Smart Booking Handoff",
  description: "Chat simulator and booking handoff card for STOW audit fixes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
