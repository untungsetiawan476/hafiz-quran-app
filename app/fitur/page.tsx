"use client";

import { useState, useEffect } from "react";
import { Compass, RotateCcw, Fingerprint, Sparkles, Navigation } from "lucide-react";

export default function FiturTambahanPage() {
  const [count, setCount] = useState(0);
  const [heading, setHeading] = useState(0); // Derajat kompas
  const [target, setTarget] = useState(33); // Target dzikir default

  // --- LOGIKA TASBIH DIGITAL ---
  const handleTaliKlik = () => {
    // Efek Getar (Hanya jalan di HP asli)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); 
    }
    setCount(count + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  // --- LOGIKA KOMPAS KIBLAT ---
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const event = e as any;
        const north = event.webkitCompassHeading || (360 - (e.alpha || 0));
        setHeading(Math.floor(north));
      };

    if (typeof window !== "undefined") {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      // Fallback untuk iPhone
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Sudut Kiblat dari Indonesia sekitar 295 derajat
  const qiblaDirection = 295; 

  return (
    <main className="p-5 pb-24 bg-slate-50 min-h-screen">
      <header className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-emerald-600">Alat Ibadah</h1>
        <p className="text-gray-500 text-sm mt-1">Tasbih Digital & Penunjuk Kiblat</p>
      </header>

      {/* --- SEKSI KIBLAT (KOMPAS) --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Navigation className="w-5 h-5 text-emerald-500" />
          <h2 className="font-bold text-slate-700">Arah Kiblat</h2>
        </div>

        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          {/* Lingkaran Kompas */}
          <div 
            className="absolute inset-0 border-4 border-slate-100 rounded-full transition-transform duration-200"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-red-500 text-xs">U</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-slate-400 text-xs">S</div>
            {/* Indikator Ka'bah */}
            <div 
              className="absolute w-10 h-10 flex items-center justify-center"
              style={{ 
                transform: `rotate(${qiblaDirection}deg) translateY(-80px)`,
                left: "calc(50% - 20px)",
                top: "calc(50% - 20px)"
              }}
            >
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg shadow-lg">🕋</div>
            </div>
          </div>
          
          {/* Jarum Penunjuk Tetap */}
          <div className="z-10 text-emerald-600">
            <Compass className="w-16 h-16 opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-2xl">
              {heading}°
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-4 leading-relaxed uppercase tracking-widest font-bold">
          Hadapkan HP ke arah Ka&apos;bah <br/> (Sudut Kiblat Indonesia ±295°)
        </p>
      </div>

      {/* --- SEKSI TASBIH DIGITAL --- */}
      <div className="bg-emerald-600 p-8 rounded-[40px] shadow-xl text-center relative overflow-hidden">
        {/* Dekorasi Cahaya */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-10 -mt-10"></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={resetCount}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all active:scale-90"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
                <div className="bg-black/20 px-4 py-1.5 rounded-full text-white/80 text-xs font-bold tracking-widest uppercase">
                    Target: {target}
                </div>
                <div className="flex gap-2">
                    {[33, 99, 100].map((t) => (
                        <button 
                          key={t}
                          onClick={() => setTarget(t)}
                          className={`w-8 h-8 text-[10px] font-bold rounded-lg border transition-all ${target === t ? "bg-white text-emerald-700 border-white" : "text-white border-white/30"}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <span className="text-8xl font-black text-white tabular-nums drop-shadow-lg">
                    {count}
                </span>
            </div>

            <button
                onClick={handleTaliKlik}
                className="w-32 h-32 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all mx-auto border-8 border-emerald-500 hover:border-emerald-400 group"
            >
                <Fingerprint className="w-10 h-10 text-emerald-600 group-active:text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-800 tracking-tighter uppercase">Tekan</span>
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 text-emerald-100/60 text-xs italic">
                <Sparkles className="w-3 h-3" />
                Dzikir Penyejuk Hati
            </div>
        </div>
      </div>
    </main>
  );
}