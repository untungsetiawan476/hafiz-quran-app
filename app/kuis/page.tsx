"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Play, BookOpen, Search, ChevronDown, ListOrdered, Award, Target } from "lucide-react";

interface Surah {
  nomor: number;
  namaLatin: string;
  jumlahAyat: number;
}

export default function PersiapanKuisPage() {
  const router = useRouter();
  const [daftarSurah, setDaftarSurah] = useState<Surah[]>([]);
  const [surahTerpilih, setSurahTerpilih] = useState<number>(1);
  
  const [ayatMulai, setAyatMulai] = useState<number>(1);
  const [ayatAkhir, setAyatAkhir] = useState<number>(7);
  const [jumlahSoalPilihan, setJumlahSoalPilihan] = useState<number>(6); 

  const [isDropdownBuka, setIsDropdownBuka] = useState(false);
  const [kataKunci, setKataKunci] = useState("");

  const [stats, setStats] = useState({ highScore: 0, totalSoal: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((data) => {
        setDaftarSurah(data.data);
        const surahPertama = data.data.find((s: Surah) => s.nomor === 1);
        if (surahPertama) {
          setAyatMulai(1);
          setAyatAkhir(surahPertama.jumlahAyat);
        }
      });

    setTimeout(() => {
      const simpananLokal = localStorage.getItem("kuisStatsApp");
      if (simpananLokal) {
        setStats(JSON.parse(simpananLokal));
      }
      setIsMounted(true);
    }, 0);
  }, []);

  const detailSurahTerpilih = daftarSurah.find((s) => s.nomor === surahTerpilih);
  const totalTersedia = ayatAkhir - ayatMulai;
  const maxSoal = Math.min(totalTersedia > 0 ? totalTersedia : 1, 30);
  const soalValid = Math.min(jumlahSoalPilihan, maxSoal); 

  const surahTampil = daftarSurah.filter((surah) =>
    surah.namaLatin.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const handlePilihSurah = (idSurah: number) => {
    setSurahTerpilih(idSurah);
    setIsDropdownBuka(false);
    setKataKunci("");
    
    const surah = daftarSurah.find((s) => s.nomor === idSurah);
    if (surah) {
      setAyatMulai(1);
      setAyatAkhir(surah.jumlahAyat);
    }
  };

  const handleMulaiUjian = () => {
    router.push(`/kuis/play?surah=${surahTerpilih}&mulai=${ayatMulai}&akhir=${ayatAkhir}&soal=${soalValid}`);
  };

  const arrayNomorAyat = Array.from(
    { length: detailSurahTerpilih?.jumlahAyat || 1 }, 
    (_, i) => i + 1
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 relative transition-colors duration-300">
      <div className="bg-emerald-600 dark:bg-emerald-800 p-6 pt-10 rounded-b-[40px] text-center pb-14 relative overflow-hidden transition-colors">
        <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Sambung Ayat</h1>
        <p className="text-emerald-100 text-sm relative z-10">Uji hafalanmu dengan metode interaktif</p>
      </div>

      <div className="px-5 -mt-10 relative z-20">
        {isMounted && (
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm flex items-center gap-3 transition-colors">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Rekor Terbaik</p>
                <p className="text-xl font-black text-slate-700 dark:text-slate-100 leading-none mt-1">{stats.highScore}</p>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm flex items-center gap-3 transition-colors">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Dijawab</p>
                <p className="text-xl font-black text-slate-700 dark:text-slate-100 leading-none mt-1">{stats.totalSoal}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-6 w-full max-w-full shadow-sm relative transition-colors">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Pengaturan Ujian</h2>
          </div>

          <div className="relative z-50">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Pilih Surah
            </label>
            <button
              onClick={() => setIsDropdownBuka(!isDropdownBuka)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium flex justify-between items-center"
            >
              <span className="truncate">
                {detailSurahTerpilih 
                  ? `${detailSurahTerpilih.nomor}. ${detailSurahTerpilih.namaLatin} (${detailSurahTerpilih.jumlahAyat} Ayat)`
                  : "Memuat..."}
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownBuka ? "rotate-180" : ""}`} />
            </button>

            {isDropdownBuka && (
              <div className="absolute top-20 left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 transition-colors">
                <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari Surah..."
                    value={kataKunci}
                    onChange={(e) => setKataKunci(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>
                <ul className="max-h-60 overflow-y-auto relative z-50">
                  {surahTampil.map((surah) => (
                    <li key={surah.nomor}>
                      <button
                        onClick={() => handlePilihSurah(surah.nomor)}
                        className={`w-full text-left px-5 py-3 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors ${
                          surah.nomor === surahTerpilih ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold" : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {surah.nomor}. {surah.namaLatin}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-4 relative z-10">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-emerald-500" />
                Dari Ayat
              </label>
              <select
                value={ayatMulai}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAyatMulai(val);
                  if (val >= ayatAkhir) {
                    setAyatAkhir(Math.min(val + 1, detailSurahTerpilih?.jumlahAyat || val + 1));
                  }
                }}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium outline-none transition-colors"
              >
                {arrayNomorAyat.map((num) => (
                  <option key={`mulai-${num}`} value={num} className="dark:bg-slate-800">{num}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block transition-colors">
                Sampai Ayat
              </label>
              <select
                value={ayatAkhir}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAyatAkhir(val);
                  if (val <= ayatMulai) {
                    setAyatMulai(Math.max(val - 1, 1));
                  }
                }}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium outline-none transition-colors"
              >
                {arrayNomorAyat.map((num) => (
                  <option key={`akhir-${num}`} value={num} className="dark:bg-slate-800">{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative z-10">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between items-center">
              <span>Jumlah Soal</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                {soalValid} Soal
              </span>
            </label>
            <input
              type="range"
              min={1} 
              max={maxSoal}
              value={soalValid}
              onChange={(e) => setJumlahSoalPilihan(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50 transition-colors"
              disabled={maxSoal <= 1}
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
              <span>Min: 1</span>
              <span>Max: {maxSoal}</span>
            </div>
          </div>

          <button
            onClick={handleMulaiUjian}
            className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-md shadow-emerald-200 dark:shadow-none"
          >
            <Play className="w-5 h-5 fill-current" />
            MULAI UJIAN
          </button>
        </div>
      </div>

      {isDropdownBuka && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownBuka(false)}></div>
      )}
    </div>
  );
}
