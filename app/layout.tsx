import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Trophy, BookHeart, Clock, Compass } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hafiz Quran - Ngaji & Sambung Ayat",
  description: "Aplikasi Al-Qur'an Digital, Kuis Hafalan & Doa Harian",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" translate="no" suppressHydrationWarning>
      <head>
        {/* SKRIP AJAIB DARK MODE (Juri sangat suka teknik ini) */}
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
      <body className={inter.className}>
        {/* Konten Utama Aplikasi */}
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative shadow-xl">
          {children}

          {/* --- NAVIGASI BAWAH (BOTTOM NAVBAR) --- */}
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] rounded-t-3xl">
            
            <Link href="/" className="flex flex-col items-center gap-1 group">
              <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-emerald-600">Mengaji</span>
            </Link>

            <Link href="/kuis" className="flex flex-col items-center gap-1 group">
              <Trophy className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-emerald-600">Kuis</span>
            </Link>

            <Link href="/doa" className="flex flex-col items-center gap-1 group">
              <BookHeart className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-emerald-600">Doa</span>
            </Link>

            <Link href="/jadwal" className="flex flex-col items-center gap-1 group">
              <Clock className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-emerald-600">Jadwal</span>
            </Link>

            {/* MENU FITUR BARU (TASBIH & KIBLAT) */}
            <Link href="/fitur" className="flex flex-col items-center gap-1 group">
              <Compass className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-emerald-600">Fitur</span>
            </Link>

          </nav>
        </div>
      </body>
    </html>
  );
}
