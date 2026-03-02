"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Volume2, CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Home } from "lucide-react";

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { "05": string };
}

interface Soal {
  ayatSoal: Ayat;
  jawabanBenar: Ayat;
  pilihan: Ayat[];
}

function PapanKuis() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const idSurah = searchParams.get("surah") || "1";
  const ayatMulai = parseInt(searchParams.get("mulai") || "1");
  const ayatAkhir = parseInt(searchParams.get("akhir") || "7");
  const targetSoal = parseInt(searchParams.get("soal") || "5");

  const [isLoading, setIsLoading] = useState(true);
  const [daftarSoal, setDaftarSoal] = useState<Soal[]>([]);
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [skor, setSkor] = useState(0);
  const [jawabanTerpilih, setJawabanTerpilih] = useState<number | null>(null);
  const [kuisSelesai, setKuisSelesai] = useState(false);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${idSurah}`)
      .then((res) => res.json())
      .then((data) => {
        const ayatList: Ayat[] = data.data.ayat;
        
        // --- LOGIKA RENTANG AYAT ---
        // Karena array JavaScript dimulai dari 0 (ayat 1 = indeks 0)
        const indeksMulai = ayatMulai - 1; 
        const indeksAkhir = ayatAkhir - 1;

        const poolSoalValid: number[] = [];

        // Kumpulkan kandidat soal yang masuk dalam rentang pilihan pengguna
        for (let i = indeksMulai; i < indeksAkhir; i++) {
          // Pastikan ayat selanjutnya ada di database untuk dijadikan kunci jawaban
          if (i + 1 < ayatList.length) {
            poolSoalValid.push(i);
          }
        }

        // Acak poolSoal agar urutannya tidak tertebak, lalu ambil sejumlah targetSoal
        const diacak = poolSoalValid.sort(() => Math.random() - 0.5);
        const kandidatTerpilih = diacak.slice(0, targetSoal);

        // Rakit soal dan jawaban pengecoh
        const soalDirakit = kandidatTerpilih.map((idx) => {
          const ayatSoal = ayatList[idx];
          const jawabanBenar = ayatList[idx + 1];

          // Ambil 3 jawaban salah (pengecoh) dari seluruh ayat di surah tersebut
          const jawabanSalah = ayatList
            .filter((a) => a.nomorAyat !== jawabanBenar.nomorAyat)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          const pilihan = [jawabanBenar, ...jawabanSalah].sort(() => Math.random() - 0.5);
          return { ayatSoal, jawabanBenar, pilihan };
        });

        setDaftarSoal(soalDirakit);
        setIsLoading(false);
      });
  }, [idSurah, ayatMulai, ayatAkhir, targetSoal]);

  const handleJawab = (nomorAyatTerpilih: number) => {
    if (jawabanTerpilih !== null) return; 
    setJawabanTerpilih(nomorAyatTerpilih);
    
    if (nomorAyatTerpilih === daftarSoal[indeksSoal].jawabanBenar.nomorAyat) {
      setSkor((prev) => prev + 10);
    }
  };

  const handleLanjut = () => {
    if (indeksSoal < daftarSoal.length - 1) {
      setIndeksSoal((prev) => prev + 1);
      setJawabanTerpilih(null);
    } else {
      setKuisSelesai(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-600 font-medium">Menyiapkan potongan ayat...</p>
      </div>
    );
  }

  if (kuisSelesai) {
    return (
      <div className="p-6 pb-24 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="bg-emerald-100 p-6 rounded-full mb-6 text-emerald-600">
          <Trophy className="w-20 h-20" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Masya Allah!</h1>
        <p className="text-slate-500 mb-8">Kuis Sambung Ayat Selesai</p>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full mb-8">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Total Skor Anda</p>
          <p className="text-6xl font-black text-emerald-600">{skor}</p>
          <p className="text-sm text-slate-400 mt-2">Dari maksimal {daftarSoal.length * 10} poin</p>
        </div>

        <div className="flex gap-4 w-full">
          <button 
            onClick={() => window.location.reload()} 
            className="flex-1 bg-white border-2 border-emerald-600 text-emerald-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Ulangi
          </button>
          <button 
            onClick={() => router.push('/kuis')} 
            className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> Menu
          </button>
        </div>
      </div>
    );
  }

  const soalSekarang = daftarSoal[indeksSoal];

  return (
    <div className="p-5 pb-24 min-h-screen bg-slate-50 flex flex-col">
      <div className="flex justify-between items-center mb-6 pt-2">
        <div className="bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-full text-sm">
          Soal {indeksSoal + 1} / {daftarSoal.length}
        </div>
        <div className="bg-white shadow-sm border border-gray-100 font-bold text-slate-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" /> {skor}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 text-center">
        <p className="text-sm text-slate-500 mb-4 font-medium flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4" /> Dengarkan potongan ayat ini:
        </p>
        <audio 
          controls 
          autoPlay
          className="w-full h-12"
          src={soalSekarang.ayatSoal.audio["05"]}
        >
        </audio>
        <p className="text-xs text-slate-400 mt-3">*Pilih kelanjutan dari ayat di atas</p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {/* PERBAIKAN: Variabel 'index' yang tidak terpakai sudah dihapus di sini */}
        {soalSekarang.pilihan.map((pilihan) => {
          const isTerpilih = jawabanTerpilih === pilihan.nomorAyat;
          const isBenar = pilihan.nomorAyat === soalSekarang.jawabanBenar.nomorAyat;
          
          let warnaTombol = "bg-white border-gray-200 text-slate-700 hover:border-emerald-400";
          if (jawabanTerpilih !== null) {
            if (isBenar) warnaTombol = "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200";
            else if (isTerpilih && !isBenar) warnaTombol = "bg-red-50 border-red-500 text-red-700";
            else warnaTombol = "bg-white border-gray-200 text-gray-400 opacity-60";
          }

          return (
            <button
              key={pilihan.nomorAyat}
              onClick={() => handleJawab(pilihan.nomorAyat)}
              disabled={jawabanTerpilih !== null}
              className={`p-5 rounded-2xl border-2 text-right transition-all duration-300 relative ${warnaTombol}`}
            >
              {jawabanTerpilih !== null && isBenar && (
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
              )}
              {jawabanTerpilih !== null && isTerpilih && !isBenar && (
                <XCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500" />
              )}
              <span className="text-2xl font-bold leading-loose" dir="rtl">
                {pilihan.teksArab}
              </span>
            </button>
          );
        })}
      </div>

      {jawabanTerpilih !== null && (
        <button
          onClick={handleLanjut}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 animate-bounce"
        >
          {indeksSoal < daftarSoal.length - 1 ? "LANJUT SOAL" : "LIHAT HASIL"}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default function PlayKuisPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Memuat...</div>}>
      <PapanKuis />
    </Suspense>
  );
}