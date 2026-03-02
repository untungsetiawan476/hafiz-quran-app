"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Play, BookOpen, Search, ChevronDown, ListOrdered } from "lucide-react";

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
  }, []);

  const detailSurahTerpilih = daftarSurah.find((s) => s.nomor === surahTerpilih);

  // --- SOLUSI REACT: MENGGUNAKAN DERIVED STATE (State Turunan) ---
  // Menghitung batas maksimal secara langsung tanpa useEffect!
  const totalTersedia = ayatAkhir - ayatMulai;
  const maxSoal = Math.min(totalTersedia > 0 ? totalTersedia : 1, 30);
  
  // Memastikan jumlah soal yang tampil dan dikirim tidak pernah melebihi batas maksimal
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
    <main className="p-5 pb-24 bg-slate-50 min-h-screen overflow-x-hidden relative">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-emerald-600">Sambung Ayat</h1>
        <p className="text-gray-500 text-sm mt-1">
          Uji hafalanmu dengan metode audio interaktif
        </p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6 w-full max-w-full">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="font-semibold text-lg text-slate-800">Pengaturan Ujian</h2>
        </div>

        <div className="relative z-20">
          <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            Pilih Surah
          </label>
          <button
            onClick={() => setIsDropdownBuka(!isDropdownBuka)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium flex justify-between items-center"
          >
            <span className="truncate">
              {detailSurahTerpilih 
                ? `${detailSurahTerpilih.nomor}. ${detailSurahTerpilih.namaLatin} (${detailSurahTerpilih.jumlahAyat} Ayat)`
                : "Memuat..."}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownBuka ? "rotate-180" : ""}`} />
          </button>

          {isDropdownBuka && (
            <div className="absolute top-20 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-3 border-b border-gray-100 bg-slate-50 relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari Surah..."
                  value={kataKunci}
                  onChange={(e) => setKataKunci(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {surahTampil.map((surah) => (
                  <li key={surah.nomor}>
                    <button
                      onClick={() => handlePilihSurah(surah.nomor)}
                      className={`w-full text-left px-5 py-3 text-sm hover:bg-emerald-50 transition-colors ${
                        surah.nomor === surahTerpilih ? "bg-emerald-100 text-emerald-700 font-bold" : "text-slate-700"
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
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
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
              className="w-full border border-gray-200 rounded-xl px-3 py-3 bg-slate-50 text-slate-700 font-medium"
            >
              {arrayNomorAyat.map((num) => (
                <option key={`mulai-${num}`} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
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
              className="w-full border border-gray-200 rounded-xl px-3 py-3 bg-slate-50 text-slate-700 font-medium"
            >
              {arrayNomorAyat.map((num) => (
                <option key={`akhir-${num}`} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative z-10">
          <label className="text-sm font-medium text-slate-700 mb-2 flex justify-between items-center">
            <span>Jumlah Soal</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              {soalValid} Soal
            </span>
          </label>
          <input
            type="range"
            min={1} 
            max={maxSoal}
            value={soalValid}
            onChange={(e) => setJumlahSoalPilihan(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
            disabled={maxSoal <= 1}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            <span>Min: 1</span>
            <span>Max: {maxSoal}</span>
          </div>
        </div>

        <button
          onClick={handleMulaiUjian}
          className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          MULAI UJIAN
        </button>
      </div>

      {isDropdownBuka && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownBuka(false)}></div>
      )}
    </main>
  );
}