"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles, BookHeart, ChevronRight, Coffee } from "lucide-react";

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  arti: string;
}

export default function MengajiPage() {
  const [daftarSurah, setDaftarSurah] = useState<Surah[]>([]);
  const [kataKunci, setKataKunci] = useState("");

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((data) => setDaftarSurah(data.data));
  }, []);

  const surahTampil = daftarSurah.filter((surah) =>
    surah.namaLatin.toLowerCase().includes(kataKunci.toLowerCase())
  );

  return (
    <main className="p-5 pb-24 bg-slate-50 min-h-screen">
      {/* --- HEADER --- */}
      <header className="mb-6 pt-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Hafiz Quran App</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Assalamu&apos;alaikum</h1>
        <p className="text-gray-500 text-sm mt-1">
          Siap sambung ayat dan murojaah hari ini?
        </p>
      </header>

      <div className="relative mb-8 shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium text-slate-700 placeholder-gray-400"
          placeholder="Cari Surah (misal: Al Mulk)..."
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        {surahTampil.length > 0 ? (
          surahTampil.map((surah) => (
            <Link key={surah.nomor} href={`/mengaji/${surah.nomor}`}>
              <div className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="relative w-11 h-11 bg-slate-50 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 font-bold rounded-xl flex items-center justify-center border border-gray-50 transition-colors shrink-0">
                    <span className="text-sm">{surah.nomor}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base group-hover:text-emerald-600 transition-colors">
                      {surah.namaLatin}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                      {surah.arti} • <span className="text-emerald-600">{surah.jumlahAyat} AYAT</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-emerald-600 text-right drop-shadow-sm font-arabic">
                    {surah.nama}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm italic">
            Surah &quot;{kataKunci}&quot; tidak ditemukan...
          </div>
        )}
      </div>

      <div className="mt-12 mb-6 bg-linear-to-r from-emerald-50 to-teal-50 p-6 rounded-4xl border border-emerald-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg mb-4 transform -rotate-6 hover:rotate-0 transition-all duration-500">
          <Coffee className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-2">Dukung Pengembangan</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-70">
          Aplikasi ini bebas iklan. Bantu saya (Untung Setiawan) untuk terus mengembangkan fitur bermanfaat lainnya melalui Saweria. 😇
        </p>
        <a 
          href="https://saweria.co/Untungsetiawan" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 transition-all active:scale-[0.97]"
        >
          <BookHeart className="w-5 h-5" />
          Traktir Kopi di Saweria
        </a>
      </div>
    </main>
  );
}