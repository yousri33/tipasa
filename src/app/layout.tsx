import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Helena Brand - Modest Fashion & Burkinis",
  description: "Discover elegant modest fashion, beautiful burkinis and hijabs at Helena Brand. Quality, style, and modesty combined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className="antialiased flex flex-col min-h-screen"
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
