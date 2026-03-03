"use client";

import { useState, useEffect } from "react";
import { Compass, RotateCcw, Hand, Moon, Sun, Navigation } from "lucide-react";

export default function FiturTambahanPage() {
  const [count, setCount] = useState(0);
  const [heading, setHeading] = useState(0); 
  const [isDark, setIsDark] = useState(false);
  
  // --- STATE UNTUK SENSOR KOMPAS ---
  const [izinSensor, setIzinSensor] = useState(false);
  const [sensorDukungan, setSensorDukungan] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (document.documentElement.classList.contains('dark')) {
        setIsDark(true);
      }
    }, 0);
  }, []);

  // --- FUNGSI MENGAKTIFKAN KOMPAS (WAJIB UNTUK HP MODERN) ---
  const aktifkanKompas = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== "undefined" && typeof (window as any).DeviceOrientationEvent !== "undefined") {
      // Khusus pengguna iOS / iPhone
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              setIzinSensor(true);
              jalankanSensor();
            } else {
              alert("Izin sensor kompas ditolak oleh browser.");
            }
          })
          .catch(console.error);
      } else {
        // Pengguna Android
        setIzinSensor(true);
        jalankanSensor();
      }
    } else {
      setSensorDukungan(false);
    }
  };

  const jalankanSensor = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOrientation = (e: any) => {
      let compassHeading = 0;
      
      // Deteksi untuk iOS (Lebih akurat)
      if (e.webkitCompassHeading) {
        compassHeading = e.webkitCompassHeading;
      } 
      // Deteksi untuk Android (Gunakan posisi Absolut, bukan Relatif)
      else if (e.absolute && e.alpha !== null) {
        compassHeading = 360 - e.alpha;
      } 
      // Fallback
      else if (e.alpha !== null) {
        compassHeading = 360 - e.alpha;
      }

      setHeading(Math.floor(compassHeading));
    };

    // Gunakan 'deviceorientationabsolute' untuk Android Chrome jika tersedia
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
  };

  // --- FUNGSI SAKELAR TEMA ---
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

  // Arah Kiblat Indonesia kira-kira 295 derajat
  const arahKiblat = 295;
  // Hitung putaran jarum kiblat berdasarkan arah HP saat ini
  const putaranJarum = arahKiblat - heading;

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      
      <div className="bg-emerald-600 dark:bg-emerald-800 p-6 pt-10 rounded-b-[40px] mb-6 text-center shadow-md transition-colors duration-300 relative overflow-hidden">
        <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Alat Ibadah</h1>
        <p className="text-emerald-100 text-sm relative z-10">Pengaturan, Tasbih & Kiblat</p>
        
        {/* Ornamen Header */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-10 -mb-10 blur-lg"></div>
      </div>

      <div className="px-5 flex flex-col gap-5">
        
        {/* --- PENGATURAN TEMA --- */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-100 text-amber-500'}`}>
               {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="font-bold text-slate-700 dark:text-slate-100 text-base">Tema Tampilan</h2>
              <p className="text-xs text-slate-400 font-medium">Mode Gelap (Global)</p>
            </div>
          </div>
          <button onClick={toggleTheme} className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${isDark ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* --- KOMPAS KIBLAT VISUAL --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm transition-colors duration-300 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-6 w-full border-b border-slate-100 dark:border-slate-700 pb-4">
            <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-slate-700 dark:text-slate-100 text-lg">Radar Kiblat</h2>
          </div>

          {!sensorDukungan ? (
            <p className="text-red-500 text-sm p-4 bg-red-50 rounded-xl">Browser ini tidak mendukung sensor arah.</p>
          ) : !izinSensor ? (
            <div className="flex flex-col items-center p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <Compass className="w-12 h-12 text-emerald-300 dark:text-emerald-700 mb-3 animate-pulse" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-4">
                Kompas butuh izin akses sensor HP Anda.
              </p>
              <button 
                onClick={aktifkanKompas}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-full transition-all active:scale-95 shadow-md text-sm"
              >
                Aktifkan Kompas
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center relative">
              {/* LINGKARAN KOMPAS VISUAL */}
              <div className="w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-700 shadow-inner flex items-center justify-center relative mb-6 bg-slate-50 dark:bg-slate-900 transition-transform duration-100 ease-linear"
                   style={{ transform: `rotate(${-heading}deg)` }}> {/* Latar berputar kebalikan arah HP */}
                
                {/* Huruf Mata Angin */}
                <span className="absolute top-2 font-black text-red-500 text-sm">U</span>
                <span className="absolute bottom-2 font-bold text-slate-400 text-xs">S</span>
                <span className="absolute right-2 font-bold text-slate-400 text-xs">T</span>
                <span className="absolute left-2 font-bold text-slate-400 text-xs">B</span>

                {/* Indikator Titik Kiblat (Statis pada 295 Derajat dari Utara) */}
                <div 
                  className="absolute w-full h-full flex justify-center"
                  style={{ transform: `rotate(${arahKiblat}deg)` }}
                >
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                </div>
              </div>

              {/* JARUM KIBLAT (Arah Kabah) - Mengambang di atas kompas */}
              <div 
                className="absolute top-0 w-48 h-48 flex items-center justify-center pointer-events-none transition-transform duration-100 ease-linear"
                style={{ transform: `rotate(${putaranJarum}deg)` }}
              >
                <div className="flex flex-col items-center transform -translate-y-6">
                  <Navigation className="w-10 h-10 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400 shadow-lg drop-shadow-md" />
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">KIBLAT</span>
                </div>
              </div>

              {/* Angka Derajat */}
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl min-w-[120px]">
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">{heading}°</div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Arah HP Anda</div>
              </div>
            </div>
          )}
        </div>

        {/* --- TASBIH DATAR --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm transition-colors duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
             <h2 className="font-bold text-slate-700 dark:text-slate-100 text-lg">Tasbih Digital</h2>
             <div onClick={() => setCount(0)} className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg cursor-pointer transition-colors active:scale-95">
                <RotateCcw className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Reset</span>
             </div>
          </div>

          <div className="text-8xl font-black text-slate-800 dark:text-white mb-8 tabular-nums tracking-tighter">
              {count}
          </div>

          <div
            onClick={handleTaliKlik}
            className="w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white py-12 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer active:scale-[0.98] transition-all shadow-md select-none"
          >
            <Hand className="w-12 h-12 opacity-90" />
            <span className="text-xl font-bold uppercase tracking-widest">Sentuh / Tap</span>
          </div>
        </div>

      </div>
    </div>
  );
}
