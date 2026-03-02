"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Settings2, Check } from "lucide-react";

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { "05": string }; // Audio per ayat
}

interface DetailSurah {
  namaLatin: string;
  tempatTurun: string;
  arti: string;
  audioFull: { "05": string }; // Audio full 1 surah
  ayat: Ayat[];
}

export default function DetailSurahPage() {
  const params = useParams();
  const idSurah = params.id as string;

  const [surah, setSurah] = useState<DetailSurah | null>(null);
  
  const [tampilLatin, setTampilLatin] = useState(true);
  const [tampilArti, setTampilArti] = useState(true);
  const [menuBuka, setMenuBuka] = useState(false);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${idSurah}`)
      .then((res) => res.json())
      .then((data) => setSurah(data.data));
  }, [idSurah]);

  if (!surah) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-600 font-medium">Memuat Surah...</p>
      </div>
    );
  }

  // Jika Latin dan Arti dimatikan, berarti pengguna ingin Mode Mushaf
  const isModeMushaf = !tampilLatin && !tampilArti;

  return (
    <main className="pb-24 bg-slate-50 min-h-screen relative">
      {/* --- HEADER --- */}
      <div className="sticky top-0 bg-white shadow-sm z-30 px-5 py-4 flex items-center justify-between border-b border-emerald-50">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-emerald-50 rounded-full text-emerald-600 hover:bg-emerald-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-slate-800">{surah.namaLatin}</h1>
            <p className="text-xs text-slate-500">
              {surah.tempatTurun} • {surah.arti}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setMenuBuka(!menuBuka)}
          className={`p-2 rounded-full transition-colors ${menuBuka ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600"}`}
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* --- MENU PENGATURAN TAMPILAN --- */}
      {menuBuka && (
        <div className="sticky top-[72px] bg-white z-20 border-b border-gray-100 shadow-lg p-5 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <p className="text-sm font-bold text-slate-700">Pengaturan Tampilan</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setTampilLatin(!tampilLatin)}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-slate-50 hover:border-emerald-300 transition-all"
            >
              <span className="text-sm font-medium text-slate-700">Tampilkan Teks Latin</span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${tampilLatin ? "bg-emerald-500 text-white" : "bg-gray-200 text-transparent"}`}>
                <Check className="w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => setTampilArti(!tampilArti)}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-slate-50 hover:border-emerald-300 transition-all"
            >
              <span className="text-sm font-medium text-slate-700">Tampilkan Terjemahan</span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${tampilArti ? "bg-emerald-500 text-white" : "bg-gray-200 text-transparent"}`}>
                <Check className="w-4 h-4" />
              </div>
            </button>
          </div>
          <p className="text-xs text-center text-emerald-600 mt-2 bg-emerald-50 p-2 rounded-lg">
            💡 Matikan keduanya untuk masuk ke <strong>Mode Mushaf</strong> (Ayat menyambung & Audio Full).
          </p>
        </div>
      )}

      {menuBuka && (
        <div className="fixed inset-0 bg-slate-900/20 z-10 backdrop-blur-sm transition-all" onClick={() => setMenuBuka(false)}></div>
      )}

      {/* --- PEMUTAR AUDIO GLOBAL (HANYA MUNCUL DI MODE MUSHAF) --- */}
      {isModeMushaf && (
        <div className="bg-white px-5 py-3 shadow-sm border-b border-gray-200 sticky top-[72px] z-10 animate-in fade-in">
          <audio
            controls
            controlsList="nodownload"
            className="w-full h-10 outline-none"
            src={surah.audioFull["05"]}
          >
            Browser Anda tidak mendukung elemen audio.
          </audio>
        </div>
      )}

      {/* --- KONTEN AL-QUR'AN --- */}
      <div className="p-5 relative z-0">
        
        {isModeMushaf ? (
          // ================== MODE MUSHAF (ARAB MENYAMBUNG) ==================
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
            <p className="text-right text-[32px] font-bold leading-[4rem] text-slate-800" dir="rtl">
              {surah.ayat.map((ayat) => (
                <span key={ayat.nomorAyat}>
                  {ayat.teksArab}
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-200 bg-emerald-50 text-emerald-600 text-sm mx-2 font-bold select-none align-middle mb-2">
                    {ayat.nomorAyat}
                  </span>
                </span>
              ))}
            </p>
          </div>
        ) : (
          // ================== MODE TERJEMAHAN (LIST KE BAWAH) ==================
          <div className="flex flex-col gap-5 animate-in fade-in duration-500">
            {surah.ayat.map((ayat) => (
              <div
                key={ayat.nomorAyat}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <p className="text-right text-3xl font-bold leading-loose text-slate-800 mb-6" dir="rtl">
                  {ayat.teksArab}
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-200 bg-emerald-50 text-emerald-600 text-sm mr-3 font-bold select-none align-middle mb-1">
                    {ayat.nomorAyat}
                  </span>
                </p>
                
                {tampilLatin && (
                  <p className="text-emerald-700 text-sm mb-2 font-medium">
                    {ayat.teksLatin}
                  </p>
                )}
                
                {tampilArti && (
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {ayat.teksIndonesia}
                  </p>
                )}

                {/* --- PEMUTAR AUDIO PER AYAT (HANYA MUNCUL DI MODE BIASA) --- */}
                <div className="pt-4 border-t border-gray-100">
                  <audio
                    controls
                    controlsList="nodownload"
                    className="w-full h-10 outline-none"
                    src={ayat.audio["05"]}
                  >
                    Browser Anda tidak mendukung elemen audio.
                  </audio>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}