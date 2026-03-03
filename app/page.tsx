"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// Tambahkan ikon Coffee untuk tombol Saweria
import { Search, BookOpen, Bookmark, ChevronRight, Coffee } from "lucide-react";

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

interface BookmarkData {
  idSurah: string;
  namaSurah: string;
  ayat: number;
}

export default function HomePage() {
  const [daftarSurah, setDaftarSurah] = useState<Surah[]>([]);
  const [kataKunci, setKataKunci] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk menyimpan data Bookmark
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);

  useEffect(() => {
    // 1. Ambil daftar Surah dari API
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((data) => {
        setDaftarSurah(data.data);
        setIsLoading(false);
      });

    // 2. Ambil data Bookmark dari memori HP (Lokal)
    setTimeout(() => {
      const savedBookmark = localStorage.getItem("bookmarkNgaji");
      if (savedBookmark) {
        setBookmark(JSON.parse(savedBookmark));
      }
    }, 0);
  }, []);

  const surahTampil = daftarSurah.filter((surah) =>
    surah.namaLatin.toLowerCase().includes(kataKunci.toLowerCase()) ||
    surah.arti.toLowerCase().includes(kataKunci.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <div className="bg-emerald-600 dark:bg-emerald-800 p-6 pt-10 rounded-b-[40px] shadow-sm text-center transition-colors duration-300 relative overflow-hidden">
        <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Al-Quran</h1>
        <p className="text-emerald-100 text-sm mb-5 relative z-10">Baca dan dengarkan lantunan ayat suci</p>
        
        {/* --- TOMBOL SAWERIA (GLASSMORPHISM) --- */}
        <a 
          href="https://saweria.co/Untungsetiawan" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-md transition-all active:scale-95 border border-white/20 relative z-10 shadow-sm"
        >
          <Coffee className="w-4 h-4" />
          Dukung Pengembangan Aplikasi ini Melalui via Saweria
        </a>
        
        {/* Ornamen Latar Header */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-10 -mb-10 blur-lg"></div>
      </div>

      <div className="px-5 mt-6">
        
        {/* --- KARTU "LANJUTKAN MEMBACA" --- */}
        {bookmark && (
          <Link href={`/mengaji/${bookmark.idSurah}`}>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white mb-6 shadow-lg shadow-emerald-200 dark:shadow-none relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer border border-emerald-400 dark:border-emerald-600">
              <BookOpen className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10 transform -rotate-12 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bookmark className="w-4 h-4 fill-white opacity-90" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-90">Terakhir Dibaca</span>
                  </div>
                  <h2 className="text-2xl font-black mb-1 drop-shadow-sm">Surah {bookmark.namaSurah}</h2>
                  <p className="text-sm text-emerald-100 font-medium">Melanjutkan pada Ayat {bookmark.ayat}</p>
                </div>
                
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* --- KOTAK PENCARIAN --- */}
        <div className="flex bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 items-center mb-6 shadow-sm transition-colors duration-300">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mx-2" />
          <input 
            type="text" 
            className="w-full outline-none bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500" 
            placeholder="Cari nama surah atau arti..." 
            value={kataKunci} 
            onChange={(e) => setKataKunci(e.target.value)} 
          />
        </div>

        {/* --- DAFTAR SURAH (LOADING STATE) --- */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          /* --- DAFTAR SURAH --- */
          <div className="flex flex-col gap-3">
            {surahTampil.map((surah) => (
              <Link 
                href={`/mengaji/${surah.nomor}`} 
                key={surah.nomor}
              >
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-emerald-300 dark:hover:border-emerald-600 shadow-sm group">
                  <div className="flex items-center gap-4">
                    {/* Nomor Surah */}
                    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 rounded-xl transform rotate-45 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors"></div>
                      <span className="relative z-10 font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {surah.nomor}
                      </span>
                    </div>
                    
                    {/* Info Surah */}
                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">{surah.namaLatin}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider font-medium">
                        {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                      </p>
                    </div>
                  </div>

                  {/* Teks Arab Surah */}
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-arabic text-right">
                    {surah.nama}
                  </div>
                </div>
              </Link>
            ))}

            {surahTampil.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 dark:text-slate-500 text-sm">Surah tidak ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
