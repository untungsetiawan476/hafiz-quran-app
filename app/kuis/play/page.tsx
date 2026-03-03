"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Home, HelpCircle, Mic, MicOff, RefreshCw } from "lucide-react";

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

const bersihkanArab = (text: string) => {
  return text.replace(/[\u064B-\u0652\u0670\u0671\u06D6-\u06ED]/g, "");
};

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
  const [isRekorBaru, setIsRekorBaru] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [hasilSuara, setHasilSuara] = useState("");
  const [pesanVoice, setPesanVoice] = useState("");
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // --- HANDLE JAWAB (DIBUNGKUS USECALLBACK) ---
  const handleJawab = useCallback((nomorAyatTerpilih: number) => {
    if (jawabanTerpilih !== null) return; 
    setJawabanTerpilih(nomorAyatTerpilih);
    if (nomorAyatTerpilih === daftarSoal[indeksSoal]?.jawabanBenar?.nomorAyat) {
      setSkor((prev) => prev + 10);
    }
  }, [jawabanTerpilih, daftarSoal, indeksSoal]);

  // --- VALIDASI SUARA ---
  const validasiSuara = useCallback((input: string) => {
    if (!daftarSoal[indeksSoal]) return;
    const target = bersihkanArab(daftarSoal[indeksSoal].jawabanBenar.teksArab);
    const user = bersihkanArab(input);

    if (user.includes(target) || target.includes(user)) {
      handleJawab(daftarSoal[indeksSoal].jawabanBenar.nomorAyat);
      setPesanVoice("Jawaban tepat!");
    } else {
      setPesanVoice("Belum tepat, coba lagi.");
    }
  }, [daftarSoal, indeksSoal, handleJawab]);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${idSurah}`)
      .then((res) => res.json())
      .then((data) => {
        const ayatList: Ayat[] = data.data.ayat;
        const indeksMulai = ayatMulai - 1; 
        const indeksAkhir = ayatAkhir - 1;
        const poolSoalValid: number[] = [];

        for (let i = indeksMulai; i < indeksAkhir; i++) {
          if (i + 1 < ayatList.length) poolSoalValid.push(i);
        }

        const diacak = poolSoalValid.sort(() => Math.random() - 0.5);
        const kandidatTerpilih = diacak.slice(0, targetSoal);

        const soalDirakit = kandidatTerpilih.map((idx) => {
          const ayatSoal = ayatList[idx];
          const jawabanBenar = ayatList[idx + 1];
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ar-SA';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setHasilSuara(transcript);
        validasiSuara(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setPesanVoice("Gagal mendengar suara.");
        setIsListening(false);
      };
    }
  }, [idSurah, ayatMulai, ayatAkhir, targetSoal, validasiSuara]);

  const handleLanjut = () => {
    setHasilSuara("");
    setPesanVoice("");
    if (indeksSoal < daftarSoal.length - 1) {
      setIndeksSoal((prev) => prev + 1);
      setJawabanTerpilih(null);
    } else {
      const simpananLokal = localStorage.getItem("kuisStatsApp");
      let statsData = { highScore: 0, totalSoal: 0 };
      if (simpananLokal) statsData = JSON.parse(simpananLokal);

      let skorTinggiBaru = statsData.highScore;
      if (skor > statsData.highScore) {
        skorTinggiBaru = skor;
        if (skor > 0) setIsRekorBaru(true);
      }

      localStorage.setItem("kuisStatsApp", JSON.stringify({
        highScore: skorTinggiBaru,
        totalSoal: statsData.totalSoal + daftarSoal.length
      }));
      setKuisSelesai(true);
    }
  };

  const mulaiVoice = () => {
    if (recognitionRef.current) {
      setPesanVoice("");
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Browser Anda tidak mendukung fitur suara.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-600 font-medium uppercase text-sm">Menyiapkan Soal...</p>
      </div>
    );
  }

  if (kuisSelesai) {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-6 text-center">
        {isRekorBaru && (
          <div className="bg-yellow-400 text-yellow-900 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-6 animate-bounce flex items-center gap-2 border-2 border-yellow-200">
            ⭐ Rekor Baru! ⭐
          </div>
        )}
        <div className="bg-white/20 p-8 rounded-full mb-8">
          <Trophy className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">Masya Allah!</h1>
        <p className="text-emerald-100 mb-10 font-medium">Ujian Hafalan Selesai</p>
        <div className="bg-white p-8 rounded-4xl shadow-lg w-full mb-10">
          <p className="text-sm font-bold text-slate-400 uppercase mb-4">Total Skor Anda</p>
          <p className="text-7xl font-black text-emerald-600 mb-2">{skor}</p>
          <div className="bg-slate-100 px-4 py-1.5 rounded-full inline-block">
            <p className="text-xs font-bold text-slate-500">Dari {daftarSoal.length * 10} poin maksimal</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <button onClick={() => window.location.reload()} className="w-full bg-white text-emerald-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md">
            <RotateCcw className="w-5 h-5" /> Coba Lagi
          </button>
          <button onClick={() => router.push('/kuis')} className="w-full bg-emerald-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-emerald-500/30">
            <Home className="w-5 h-5" /> Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  const soalSekarang = daftarSoal[indeksSoal];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 dark:bg-slate-900 transition-colors">
      <div className="bg-emerald-600 p-5 rounded-b-3xl shadow-sm text-white flex justify-between items-center mb-6 transition-colors">
        <div>
          <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-1">Pertanyaan</p>
          <div className="font-black text-xl bg-white/20 px-4 py-1 rounded-lg inline-block">
            {indeksSoal + 1} / {daftarSoal.length}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-1">Skor</p>
          <div className="font-black text-xl flex items-center gap-2 justify-end">
            {skor} <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="px-5 flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 text-center transition-colors">
          <div className="flex justify-center mb-4">
             <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
               <HelpCircle className="w-8 h-8" />
             </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-bold mb-4 uppercase tracking-tighter">Apa kelanjutan ayat di bawah ini?</p>
          <div className="mb-6">
            <p className="text-3xl font-bold leading-[1.8] text-slate-800 dark:text-white" dir="rtl">
              {soalSekarang?.ayatSoal?.teksArab}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-2 border border-slate-100 dark:border-slate-700">
            <audio controls autoPlay className="w-full h-10" src={soalSekarang?.ayatSoal?.audio["05"]} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {soalSekarang?.pilihan.map((pilihan) => {
            const isTerpilih = jawabanTerpilih === pilihan.nomorAyat;
            const isBenar = pilihan.nomorAyat === soalSekarang.jawabanBenar.nomorAyat;
            let warnaTombol = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200";
            if (jawabanTerpilih !== null) {
              if (isBenar) warnaTombol = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400";
              else if (isTerpilih) warnaTombol = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400";
              else warnaTombol = "bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-300 opacity-60";
            }

            return (
              <button
                key={pilihan.nomorAyat}
                onClick={() => handleJawab(pilihan.nomorAyat)}
                disabled={jawabanTerpilih !== null}
                className={`p-5 rounded-2xl border-2 text-right transition-all relative w-full ${warnaTombol}`}
              >
                {jawabanTerpilih !== null && isBenar && <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />}
                {jawabanTerpilih !== null && isTerpilih && !isBenar && <XCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500" />}
                <div className="text-2xl font-bold leading-[1.8]" dir="rtl">{pilihan.teksArab}</div>
              </button>
            );
          })}
        </div>

        {jawabanTerpilih === null && (
          <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 text-center transition-all">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded uppercase">Beta</span>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">JAWAB DENGAN SUARA</p>
            </div>
            
            <button
              onClick={isListening ? () => recognitionRef.current.stop() : mulaiVoice}
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all shadow-lg active:scale-90 ${isListening ? "bg-red-500 animate-pulse" : "bg-emerald-600"}`}
            >
              {isListening ? <MicOff className="text-white" /> : <Mic className="text-white" />}
            </button>

            {hasilSuara && (
              <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-2 font-arabic" dir="rtl">{hasilSuara}</p>
            )}
            
            {pesanVoice && (
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600">
                <RefreshCw className="w-3 h-3" /> {pesanVoice}
              </div>
            )}
          </div>
        )}

        {jawabanTerpilih !== null && (
          <div className="mt-8 mb-6 animate-in slide-in-from-bottom-4">
            <button onClick={handleLanjut} className="w-full bg-slate-800 text-white font-bold py-5 rounded-2xl flex justify-center items-center gap-2 shadow-lg active:scale-95 transition-all">
              {indeksSoal < daftarSoal.length - 1 ? "LANJUTKAN UJIAN" : "LIHAT HASIL AKHIR"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlayKuisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-emerald-600 font-bold">Memuat Ujian...</div>}>
      <PapanKuis />
    </Suspense>
  );
}
