"use client";

import { useState, useEffect } from "react";
import { Compass, RotateCcw, Hand, Moon, Sun } from "lucide-react";

export default function FiturTambahanPage() {
  const [count, setCount] = useState(0);
  const [heading, setHeading] = useState(0); 

  // --- STATE UNTUK DARK MODE ---
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // PERBAIKAN 1: Gunakan setTimeout agar tidak memicu "cascading renders"
    setTimeout(() => {
      if (document.documentElement.classList.contains('dark')) {
        setIsDark(true);
      }
    }, 0);

    // --- LOGIKA KOMPAS ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOrientation = (e: any) => {
      try {
        const north = e.webkitCompassHeading || (360 - (e.alpha || 0));
        setHeading(Math.floor(north));
      } catch { 
        // PERBAIKAN 2: Kata 'err' dihapus (menjadi catch kosong) karena memang tidak kita pakai
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // --- FUNGSI KLIK SAKELAR DARK MODE ---
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleTaliKlik = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); 
    }
    setCount(count + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-emerald-600 dark:bg-emerald-800 p-6 pt-10 rounded-b-[40px] mb-6 text-center shadow-md transition-colors duration-300">
        <h1 className="text-2xl font-bold text-white mb-2">Alat Ibadah</h1>
        <p className="text-emerald-100 text-sm">Pengaturan, Tasbih & Kiblat</p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        
        {/* --- PENGATURAN TEMA (DARK MODE TOGGLE) --- */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-100 text-amber-500'}`}>
               {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="font-bold text-slate-700 dark:text-slate-100 text-base">Tema Tampilan</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Mode Gelap (Dark Mode)</p>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${isDark ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* --- KIBLAT DATAR --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-slate-700 dark:text-slate-100 text-lg">Kompas Kiblat</h2>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl inline-block mb-4 transition-colors">
            <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400">{heading}°</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">Arah Utara</div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-xl transition-colors">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Putar HP Anda hingga angka mencapai <br/>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">295°</span> <br/>
              untuk menghadap Kiblat (Indonesia).
            </p>
          </div>
        </div>

        {/* --- TASBIH DATAR --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm transition-colors duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
             <h2 className="font-bold text-slate-700 dark:text-slate-100 text-lg">Tasbih Digital</h2>
             <div onClick={() => setCount(0)} className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                <RotateCcw className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Reset</span>
             </div>
          </div>

          <div className="text-8xl font-black text-slate-800 dark:text-white mb-8 tabular-nums tracking-tighter">
              {count}
          </div>

          <div
            onClick={handleTaliKlik}
            className="w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white py-12 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer active:scale-[0.98] transition-all shadow-md"
          >
            <Hand className="w-12 h-12 opacity-90" />
            <span className="text-xl font-bold uppercase tracking-widest">Sentuh / Tap</span>
          </div>
        </div>

      </div>
    </div>
  );
}
