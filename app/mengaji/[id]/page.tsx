"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Settings2, Check, Bookmark } from "lucide-react";

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { "05": string }; 
}

interface DetailSurah {
  namaLatin: string;
  tempatTurun: string;
  arti: string;
  audioFull: { "05": string }; 
  ayat: Ayat[];
}

export default function DetailSurahPage() {
  const params = useParams();
  const idSurah = params.id as string;

  const [surah, setSurah] = useState<DetailSurah | null>(null);
  
  const [tampilLatin, setTampilLatin] = useState(true);
  const [tampilArti, setTampilArti] = useState(true);
  const [menuBuka, setMenuBuka] = useState(false);

  // --- STATE UNTUK BOOKMARK ---
  const [terakhirDibaca, setTerakhirDibaca] = useState<number | null>(null);
  const ayatRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${idSurah}`)
      .then((res) => res.json())
      .then((data) => {
        setSurah(data.data);
        
        // Cek apakah ada bookmark di surah ini
        setTimeout(() => {
          const savedBookmark = localStorage.getItem("bookmarkNgaji");
          if (savedBookmark) {
            const parsed = JSON.parse(savedBookmark);
            if (parsed.idSurah === idSurah) {
              setTerakhirDibaca(parsed.ayat);
              
              // Scroll otomatis ke ayat yang ditandai
              const elemenAyat = ayatRefs.current[parsed.ayat];
              if (elemenAyat) {
                elemenAyat.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }
          }
        }, 500); // Jeda sebentar agar render selesai
      });
  }, [idSurah]);

  // --- FUNGSI KLIK BOOKMARK ---
  const handleBookmark = (nomorAyat: number) => {
    if (terakhirDibaca === nomorAyat) {
      // Hapus bookmark jika diklik lagi
      setTerakhirDibaca(null);
      localStorage.removeItem("bookmarkNgaji");
    } else {
      // Simpan bookmark baru
      setTerakhirDibaca(nomorAyat);
      localStorage.setItem("bookmarkNgaji", JSON.stringify({
        idSurah: idSurah,
        namaSurah: surah?.namaLatin,
        ayat: nomorAyat
      }));
    }
  };

  if (!surah) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium">Memuat Surah...</p>
      </div>
    );
  }

  const isModeMushaf = !tampilLatin && !tampilArti;

  return (
    <main className="pb-24 bg-slate-50 dark:bg-slate-900 min-h-screen relative transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 shadow-sm z-30 px-5 py-4 flex items-center justify-between border-b border-emerald-50 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-emerald-50 dark:bg-slate-700 rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-slate-800 dark:text-white">{surah.namaLatin}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {surah.tempatTurun} • {surah.arti}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setMenuBuka(!menuBuka)}
          className={`p-2 rounded-full transition-colors ${menuBuka ? "bg-emerald-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-600"}`}
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* --- MENU PENGATURAN TAMPILAN --- */}
      {menuBuka && (
        <div className="sticky top-[72px] bg-white dark:bg-slate-800 z-20 border-b border-slate-100 dark:border-slate-700 shadow-lg p-5 flex flex-col gap-4 animate-in slide-in-from-top-2 transition-colors">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Pengaturan Tampilan</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setTampilLatin(!tampilLatin)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-emerald-300 transition-all"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tampilkan Teks Latin</span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${tampilLatin ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-transparent"}`}>
                <Check className="w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => setTampilArti(!tampilArti)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-emerald-300 transition-all"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tampilkan Terjemahan</span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${tampilArti ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-transparent"}`}>
                <Check className="w-4 h-4" />
              </div>
            </button>
          </div>
          <p className="text-xs text-center text-emerald-700 dark:text-emerald-300 mt-2 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
            💡 Matikan keduanya untuk masuk ke <strong>Mode Mushaf</strong> (Ayat menyambung).
          </p>
        </div>
      )}

      {menuBuka && (
        <div className="fixed inset-0 bg-slate-900/20 z-10 backdrop-blur-sm transition-all" onClick={() => setMenuBuka(false)}></div>
      )}

      {/* --- KONTEN AL-QUR'AN --- */}
      <div className="p-5 relative z-0">
        
        {isModeMushaf ? (
          // ================== MODE MUSHAF ==================
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in duration-500 transition-colors">
            <p className="text-right text-[32px] font-bold leading-[4rem] text-slate-800 dark:text-slate-100" dir="rtl">
              {surah.ayat.map((ayat) => (
                <span key={ayat.nomorAyat}>
                  {ayat.teksArab}
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm mx-2 font-bold select-none align-middle mb-2">
                    {ayat.nomorAyat}
                  </span>
                </span>
              ))}
            </p>
          </div>
        ) : (
          // ================== MODE TERJEMAHAN ==================
          <div className="flex flex-col gap-5 animate-in fade-in duration-500">
            {surah.ayat.map((ayat) => {
              const isBookmarked = terakhirDibaca === ayat.nomorAyat;

              return (
                <div
                  key={ayat.nomorAyat}
                  ref={(el) => { ayatRefs.current[ayat.nomorAyat] = el; }}
                  className={`bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border transition-all duration-300 relative overflow-hidden ${
                    isBookmarked 
                      ? "border-emerald-400 dark:border-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/30" 
                      : "border-slate-100 dark:border-slate-700"
                  }`}
                >
                  {/* Pita Penanda jika di-bookmark */}
                  {isBookmarked && (
                    <div className="absolute top-0 right-8 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-sm">
                      Terakhir Dibaca
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6 pt-2">
                    {/* Tombol Bookmark */}
                    <button 
                      onClick={() => handleBookmark(ayat.nomorAyat)}
                      className={`p-2.5 rounded-xl transition-colors ${
                        isBookmarked 
                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" 
                          : "bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-emerald-50 hover:text-emerald-500"
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>

                    <p className="text-right text-3xl font-bold leading-loose text-slate-800 dark:text-slate-100 flex-1 ml-4" dir="rtl">
                      {ayat.teksArab}
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm mr-3 font-bold select-none align-middle mb-1">
                        {ayat.nomorAyat}
                      </span>
                    </p>
                  </div>
                  
                  {tampilLatin && (
                    <p className="text-emerald-700 dark:text-emerald-400 text-sm mb-2 font-medium">
                      {ayat.teksLatin}
                    </p>
                  )}
                  
                  {tampilArti && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      {ayat.teksIndonesia}
                    </p>
                  )}

                  {/* Audio */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <audio
                      controls
                      controlsList="nodownload"
                      className="w-full h-10 outline-none opacity-80 hover:opacity-100 transition-opacity"
                      src={ayat.audio["05"]}
                    >
                      Browser Anda tidak mendukung elemen audio.
                    </audio>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
