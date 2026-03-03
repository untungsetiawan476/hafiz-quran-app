import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Pastikan lokasi import BottomNav Kakak sudah benar
// Jika error, coba ubah menjadi: import BottomNav from "@/components/BottomNav";
import BottomNav from "../components/BottomNav"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sambung Ayat - Hafiz Quran",
  description: "Aplikasi hafalan, kuis sambung ayat, dan alat ibadah komprehensif.",
  manifest: "/manifest.json", 
};

export const viewport: Viewport = {
  themeColor: "#059669", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" translate="no" suppressHydrationWarning>
      <head>
        {/* SKRIP AJAIB DARK MODE */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      
      {/* Pembungkus Body tanpa membatasi layout agar BottomNav tidak hilang */}
      <body className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased relative min-h-screen pb-20`}>
        
        {/* Konten Halaman (Kuis, Doa, Fitur, dll) */}
        {children}
        
        {/* Navigasi Bawah */}
        <BottomNav />
        
      </body>
    </html>
  );
}
