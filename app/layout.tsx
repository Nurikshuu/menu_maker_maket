/**
 * Root layout — sets up fonts, global metadata, and mounts the persistent
 * app shell: Header, CartDrawer, CitySelectModal, ToastContainer, Footer.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { ThemeApplier } from "@/components/layout/ThemeApplier";
import { Footer } from "@/components/layout/Footer";

// Load interactive-only components lazily — they are not needed for initial render
const CartDrawer = dynamic(() => import("@/components/layout/CartDrawer").then(m => ({ default: m.CartDrawer })), { ssr: false });
const AccountDrawer = dynamic(() => import("@/components/layout/AccountDrawer").then(m => ({ default: m.AccountDrawer })), { ssr: false });
const CitySelectModal = dynamic(() => import("@/components/layout/CitySelectModal").then(m => ({ default: m.CitySelectModal })), { ssr: false });
const ToastContainer = dynamic(() => import("@/components/ui/toast").then(m => ({ default: m.ToastContainer })), { ssr: false });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Menumaker — доставка еды",
  description: "Заказывайте еду из лучших ресторанов города с быстрой доставкой",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("h-full antialiased", inter.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CartDrawer />
        <AccountDrawer />
        <ThemeApplier />
        <CitySelectModal />
        <ToastContainer />
      </body>
    </html>
  );
}
