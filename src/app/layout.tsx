import type { Metadata } from "next";
import "./globals.css";
import { PharmaProvider } from "@/context/PharmaContext";

export const metadata: Metadata = {
  title: "PharmaTrace GMP // Cleanroom HVAC & 21 CFR Part 11 eBR (Titan #34)",
  description: "Sistem Eksekusi Manufaktur Farmasi & Monitoring Lingkungan Bersih Berbasis Material Design Elevation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased font-sans">
        <PharmaProvider>{children}</PharmaProvider>
      </body>
    </html>
  );
}
