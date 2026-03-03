import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Pastikan lokasi import BottomNav Kakak sesuai ya.
// Jika error garis merah di tulisan BottomNav, sesuaikan alamat folder komponennya.
import BottomNav from "../components/BottomNav"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sambung Ayat - Hafiz Quran",
  description: "Aplikasi hafalan, kuis sambung ayat, dan alat ibadah komprehensif.",
  manifest: "/manifest.json", // Kunci utama agar aplikasi bisa di-install jadi PWA
};

export const viewport: Viewport = {
  themeColor: "#059669", // Warna Emerald-600 untuk header status bar HP
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning sangat penting agar Next.js tidak marah
    // saat mendeteksi perbedaan tema antara server dan HP pengguna
    <html lang="id" translate="no" suppressHydrationWarning>
      <head>
        {/* SKRIP AJAIB DARK MODE (Mencegah layar berkedip putih saat direfresh) */}
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
      
      <body 
        className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased`}
      >
        {/* Pembungkus utama aplikasi */}
        <div className="max-w-md mx-auto min-h-screen relative bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shadow-2xl overflow-x-hidden">
          
          {/* Konten Halaman (Kuis, Doa, Jadwal, dll) akan masuk ke sini */}
          {children}
          
          {/* Navigasi Bawah */}
          <BottomNav />
          
        </div>
      </body>
    </html>
  );
}
