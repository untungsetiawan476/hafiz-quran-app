"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, Home, HelpCircle, Mic, MicOff, RefreshCw, ListFilter } from "lucide-react";

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

  const [isModeSuara, setIsModeSuara] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasilSuara, setHasilSuara] = useState("");
  const [pesanVoice, setPesanVoice] = useState("");
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const handleJawab = useCallback((nomorAyatTerpilih: number) => {
    setJawabanTerpilih((current) => {
      if (current !== null) return current; 
      
      if (nomorAyatTerpilih === daftarSoal[indeksSoal]?.jawabanBenar?.nomorAyat) {
        setSkor((prev) => prev + 10);
      }
      return nomorAyatTerpilih;
    });
  }, [daftarSoal, indeksSoal]);

  const validasiSuara = useCallback((input: string) => {
    if (!daftarSoal[indeksSoal]) return;
    const target = bersihkanArab(daftarSoal[indeksSoal].jawabanBenar.teksArab);
    const user = bersihkanArab(input);

    if (user.includes(target) || target.includes(user)) {
      handleJawab(daftarSoal[indeksSoal].jawabanBenar.nomorAyat);
      setPesanVoice("MANTAP! Jawaban Benar ✅");
    } else {
      setPesanVoice("Kurang tepat, coba lagi ya...");
    }
  }, [daftarSoal, indeksSoal, handleJawab]);

  useEffect(() => {
    let isMounted = true;

    fetch(`https://equran.id/api/v2/surat/${idSurah}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const ayatList: Ayat[] = data.data.ayat;
        const poolSoalValid = [];
        
        for (let i = ayatMulai - 1; i < ayatAkhir - 1; i++) {
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

    return () => { isMounted = false; };
  }, [idSurah, ayatMulai, ayatAkhir, targetSoal]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ar-SA';
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setHasilSuara(transcript);
        validasiSuara(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setPesanVoice("Gagal mendengar. Pastikan Mic aktif.");
        setIsListening(false);
      };
    }
  }, [validasiSuara]);

  const handleLanjut = () => {
    setHasilSuara(""); 
    setPesanVoice("");
    if (indeksSoal < daftarSoal.length - 1) {
      setIndeksSoal((prev) => prev + 1);
      setJawabanTerpilih(null);
    } else {
      const simpananLokal = localStorage.getItem("kuisStatsApp");
      const statsData = simpananLokal ? JSON.parse(simpananLokal) : { highScore: 0, totalSoal: 0 };
      const skorTinggiBaru = skor > statsData.highScore ? skor : statsData.highScore;
      if (skor > statsData.highScore && skor > 0) setIsRekorBaru(true);
      localStorage.setItem("kuisStatsApp", JSON.stringify({ highScore: skorTinggiBaru, totalSoal: statsData.totalSoal + daftarSoal.length }));
      setKuisSelesai(true);
    }
  };

  const mulaiVoice = () => {
    if (recognitionRef.current) {
      setPesanVoice(""); setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Browser tidak mendukung fitur suara.");
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-emerald-600 font-medium uppercase text-sm tracking-widest">Menyiapkan Soal...</p>
    </div>
  );

  if (kuisSelesai) return (
    <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-6 text-center text-white">
      <Trophy className="w-24 h-24 mb-8" />
      <h1 className="text-4xl font-bold mb-10">Skor: {skor}</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button onClick={() => window.location.reload()} className="bg-white text-emerald-700 font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> Coba Lagi
        </button>
        <button onClick={() => router.push('/kuis')} className="bg-emerald-800 text-white font-bold py-4 rounded-2xl border border-emerald-500/30 flex items-center justify-center gap-2">
            <Home className="w-5 h-5" /> Menu Utama
        </button>
      </div>
    </div>
  );

  const soalSekarang = daftarSoal[indeksSoal];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col pb-24 transition-colors">
      <div className="bg-emerald-600 p-5 text-white flex justify-between items-center rounded-b-3xl shadow-lg">
        <div>
          <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">Pertanyaan</p>
          <span className="font-black text-xl">{indeksSoal + 1} / {daftarSoal.length}</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">Skor</p>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="font-black text-xl">{skor}</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 flex-1">
        <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <button 
                onClick={() => setIsModeSuara(false)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${!isModeSuara ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
            >
                <ListFilter className="w-4 h-4" /> PILIHAN GANDA
            </button>
            <button 
                onClick={() => setIsModeSuara(true)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${isModeSuara ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
            >
                <Mic className="w-4 h-4" /> MODE SUARA (BETA)
            </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl text-center mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-xl inline-block mb-4 text-emerald-600 dark:text-emerald-400">
             <HelpCircle className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest leading-none">Lanjutkan Ayat Ini:</p>
          <p className="text-3xl font-bold mb-6 font-arabic leading-relaxed text-slate-800 dark:text-white" dir="rtl">{soalSekarang?.ayatSoal.teksArab}</p>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-2 border border-slate-100 dark:border-slate-700">
            <audio controls autoPlay src={soalSekarang?.ayatSoal.audio["05"]} className="w-full h-10" />
          </div>
        </div>

        {!isModeSuara ? (
          <div className="flex flex-col gap-3">
            {soalSekarang?.pilihan.map((p) => {
                const isBenar = p.nomorAyat === soalSekarang.jawabanBenar.nomorAyat;
                const isTerpilih = jawabanTerpilih === p.nomorAyat;
                return (
                    <button 
                        key={p.nomorAyat} 
                        onClick={() => handleJawab(p.nomorAyat)} 
                        disabled={jawabanTerpilih !== null} 
                        className={`p-5 rounded-2xl border-2 text-right transition-all font-arabic text-xl shadow-sm relative ${
                            jawabanTerpilih === null 
                            ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700" 
                            : isBenar 
                                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400" 
                                : isTerpilih 
                                    ? "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400" 
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-300 opacity-50"
                        }`}
                    >
                        {jawabanTerpilih !== null && isBenar && <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />}
                        {jawabanTerpilih !== null && isTerpilih && !isBenar && <XCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500" />}
                        {p.teksArab}
                    </button>
                )
            })}
          </div>
        ) : (
          <div className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center ${isListening ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
             <button 
                onClick={isListening ? () => recognitionRef.current.stop() : mulaiVoice} 
                disabled={jawabanTerpilih !== null}
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl transition-all active:scale-90 ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-emerald-600 text-white disabled:bg-slate-300'}`}
             >
                {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
             </button>
             
             {jawabanTerpilih === null ? (
                <div className="text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                        {isListening ? "Sedang Mendengarkan..." : "Tekan mic lalu bacalah lanjutannya"}
                    </p>
                    {hasilSuara && <p className="mt-4 text-2xl font-arabic text-emerald-600 dark:text-emerald-400" dir="rtl">{hasilSuara}</p>}
                    {pesanVoice && <p className="mt-2 text-xs font-bold text-emerald-500 animate-bounce">{pesanVoice}</p>}
                </div>
             ) : (
                <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-12 h-12 mb-2" />
                    <p className="uppercase tracking-widest text-xs">Ayat Terdeteksi!</p>
                </div>
             )}
          </div>
        )}

        {jawabanTerpilih !== null && (
          <button onClick={handleLanjut} className="mt-8 w-full bg-slate-800 dark:bg-emerald-600 text-white py-5 rounded-2xl font-black tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
            {indeksSoal < daftarSoal.length - 1 ? "SOAL BERIKUTNYA" : "LIHAT SKOR AKHIR"}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function PlayKuisPage() {
  return (
    <Suspense fallback={<div>Memuat...</div>}>
      <PapanKuis />
    </Suspense>
  );
}
