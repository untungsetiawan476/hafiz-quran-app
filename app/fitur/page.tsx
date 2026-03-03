"use client";

import { useState, useEffect } from "react";
import { Compass, RotateCcw, Hand, Moon, Sun, Navigation } from "lucide-react";

export default function FiturTambahanPage() {
  const [count, setCount] = useState(0);
  const [heading, setHeading] = useState(0); 
  const [isDark, setIsDark] = useState(false);
  
  const [izinSensor, setIzinSensor] = useState(false);
  const [sensorDukungan, setSensorDukungan] = useState(true);

  useEffect(() => {
    // Mengecek tema saat halaman dimuat
    const checkTheme = () => {
      if (document.documentElement.classList.contains('dark')) {
        setIsDark(true);
      }
    };
    
    checkTheme();
  }, []);

  const jalankanSensor = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOrientation = (e: any) => {
      let compassHeading = 0;
      
      if (e.webkitCompassHeading) {
        // Khusus iOS
        compassHeading = e.webkitCompassHeading;
      } else if (e.absolute && e.alpha !== null) {
        // Android dengan absolute orientasi
        compassHeading = 360 - e.alpha;
      } else if (e.alpha !== null) {
        // Fallback Android standar
        compassHeading = 360 - e.alpha;
      }

      setHeading(Math.floor(compassHeading));
    };

    // Deteksi metode event yang didukung browser
    if ('ondeviceorientationabsolute' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).addEventListener("deviceorientationabsolute", handleOrientation, true);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
  };

  const aktifkanKompas = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deviceEvent = (window as any).DeviceOrientationEvent;
    
    if (typeof window !== "undefined" && typeof deviceEvent !== "undefined") {
      // Logika khusus untuk meminta izin di perangkat iOS
      if (typeof deviceEvent.requestPermission === 'function') {
        deviceEvent.requestPermission()
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
        // Untuk Android/Browser non-iOS yang tidak butuh requestPermission eksplisit
        setIzinSensor(true);
        jalankanSensor();
      }
    } else {
      setSensorDukungan(false);
    }
  };

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

  const arahKiblat = 295;
  const putaranJarum = arahKiblat - heading;

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
      
      {/* Header */}
      <div className="bg-emerald-600 dark:bg-emerald-800 p-6 pt-10 rounded-b-[40px] mb-6 text-center shadow-md transition-colors duration-300 relative overflow-hidden">
        <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Alat Ibadah</h1>
        <p className="text-emerald-100 text-sm relative z-10">Pengaturan, Tasbih & Kiblat</p>
        
        {/* Ornamen */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-10 -mb-10 blur-lg"></div>
      </div>

      <div className="px-5 flex flex-col gap-5">
        
        {/* Kontrol Tema */}
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
          <button 
            onClick={toggleTheme} 
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${isDark ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Radar Kiblat Visual */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm flex flex-col items-center transition-colors duration-300">
          <div className="flex justify-center items-center gap-2 mb-6 w-full border-b border-slate-100 dark:border-slate-700 pb-4">
            <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-slate-700 dark:text-slate-100 text-lg">Radar Kiblat</h2>
          </div>

          {!sensorDukungan ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
               <p className="text-red-500 dark:text-red-400 text-sm font-medium">Sensor tidak didukung di browser ini.</p>
            </div>
          ) : !izinSensor ? (
            <div className="flex flex-col items-center gap-4">
               <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-full animate-pulse">
                  <Compass className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 px-4">Ketuk tombol di bawah untuk mengizinkan akses sensor arah pada perangkat Anda.</p>
               <button 
                onClick={aktifkanKompas} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-all"
               >
                  Aktifkan Kompas
               </button>
            </div>
          ) : (
            <div className="flex flex-col items-center relative">
              {/* Lingkaran Kompas */}
              <div 
                className="w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-700 relative mb-6 transition-transform duration-100 ease-linear shadow-inner bg-slate-50 dark:bg-slate-900" 
                style={{ transform: `rotate(${-heading}deg)` }}
              >
                <span className="absolute top-2 left-1/2 -translate-x-1/2 font-black text-red-500 text-sm">U</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-slate-400 text-xs">S</span>
                
                {/* Indikator Titik Kiblat */}
                <div className="absolute w-full h-full flex justify-center" style={{ transform: `rotate(${arahKiblat}deg)` }}>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>

              {/* Jarum Navigasi (Menunjuk Kiblat) */}
              <div 
                className="absolute top-0 w-48 h-48 flex items-center justify-center pointer-events-none" 
                style={{ transform: `rotate(${putaranJarum}deg)` }}
              >
                <Navigation className="w-10 h-10 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400 drop-shadow-lg" />
              </div>

              {/* Angka Derajat */}
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl min-w-30 shadow-sm border border-slate-200 dark:border-slate-600">
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">{heading}°</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Arah HP</div>
              </div>
            </div>
          )}
        </div>

        {/* Tasbih Digital */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm transition-colors duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
             <h2 className="font-bold text-slate-700 dark:text-slate-100 text-lg">Tasbih Digital</h2>
             <button 
              onClick={() => setCount(0)} 
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors active:scale-95"
             >
                <RotateCcw className="w-4 h-4" /> 
                <span className="text-xs font-bold uppercase tracking-tighter">Reset</span>
             </button>
          </div>
          <div className="text-8xl font-black text-slate-800 dark:text-white mb-8 tabular-nums tracking-tighter drop-shadow-sm">{count}</div>
          <button 
            onClick={handleTaliKlik} 
            className="w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white py-12 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-all shadow-md select-none"
          >
            <Hand className="w-12 h-12" /> 
            <span className="text-xl font-bold uppercase tracking-widest">Sentuh / Tap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
