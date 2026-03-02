"use client";

import { useState, useEffect } from "react";
import { Compass, RotateCcw, Fingerprint, Sparkles, Navigation } from "lucide-react";

export default function FiturTambahanPage() {
  const [count, setCount] = useState(0);
  const [heading, setHeading] = useState(0); 
  const [target, setTarget] = useState(33);

  const handleTaliKlik = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); 
    }
    setCount(count + 1);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOrientation = (e: any) => {
      try {
        const north = e.webkitCompassHeading || (360 - (e.alpha || 0));
        setHeading(Math.floor(north));
      } catch (err) {
        // Amankan jika sensor HP error
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

  const qiblaDirection = 295; 

  return (
    <main className="p-5 pb-24 bg-slate-50 min-h-screen">
      <header className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-emerald-600">Alat Ibadah</h1>
        <p className="text-gray-500 text-sm mt-1">Tasbih Digital & Penunjuk Kiblat</p>
      </header>

      {/* --- SEKSI KIBLAT YANG AMAN --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Navigation className="w-5 h-5 text-emerald-500" />
          <h2 className="font-bold text-slate-700">Arah Kiblat</h2>
        </div>

        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div 
            className="absolute inset-0 border-4 border-slate-100 rounded-full transition-transform duration-200"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-red-500 text-xs">U</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-slate-400 text-xs">S</div>
            <div 
              className="absolute w-10 h-10 flex items-center justify-center"
              style={{ transform: `rotate(${qiblaDirection}deg) translateY(-80px)`, left: "calc(50% - 20px)", top: "calc(50% - 20px)" }}
            >
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm">🕋</div>
            </div>
          </div>
          
          <div className="z-10 text-emerald-600 flex flex-col items-center">
            <Compass className="w-10 h-10 opacity-20 mb-1" />
            <div className="font-black text-2xl">{heading}°</div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-4 leading-relaxed uppercase tracking-widest font-bold">
          Hadapkan HP ke arah Ka&apos;bah <br/> (Sudut Kiblat Indonesia ±295°)
        </p>
      </div>

      {/* --- SEKSI TASBIH FLAT DESIGN --- */}
      <div className="bg-emerald-600 p-6 rounded-[32px] shadow-lg text-center">
        <div className="flex justify-between items-center mb-8">
            <button onClick={() => setCount(0)} className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all active:scale-90">
                <RotateCcw className="w-5 h-5" />
            </button>
            <div className="bg-black/20 px-4 py-1.5 rounded-full text-white/90 text-xs font-bold tracking-widest uppercase">
                Target: {target}
            </div>
            <div className="flex gap-2">
                {[33, 99].map((t) => (
                    <button key={t} onClick={() => setTarget(t)} className={`w-10 h-10 text-xs font-bold rounded-xl border-2 transition-all ${target === t ? "bg-white text-emerald-700 border-white" : "text-white border-white/30"}`}>
                        {t}
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-8">
            <span className="text-7xl font-black text-white tabular-nums drop-shadow-sm">
                {count}
            </span>
        </div>

        <button
            onClick={handleTaliKlik}
            className="w-32 h-32 bg-white rounded-full shadow-lg flex flex-col items-center justify-center gap-2 active:scale-90 transition-transform mx-auto border-4 border-emerald-400"
        >
            <Fingerprint className="w-10 h-10 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800 tracking-tighter uppercase">Tekan</span>
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-emerald-100/80 text-xs italic font-medium">
            <Sparkles className="w-4 h-4" /> Dzikir Penyejuk Hati
        </div>
      </div>
    </main>
  );
}
