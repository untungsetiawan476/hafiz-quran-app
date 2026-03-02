"use client";

import { useState, useEffect } from "react";
import { Compass, RotateCcw, Hand } from "lucide-react";

export default function FiturTambahanPage() {
  const [count, setCount] = useState(0);
  const [heading, setHeading] = useState(0); 

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
      } catch (err) { }
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

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Minimalis */}
      <div className="bg-emerald-600 p-6 pt-10 rounded-b-3xl mb-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Alat Ibadah</h1>
        <p className="text-emerald-100 text-sm">Tasbih Digital & Arah Kiblat</p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        
        {/* --- KIBLAT DATAR (TIDAK ADA ABSOLUTE POSITION) --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="w-6 h-6 text-emerald-600" />
            <h2 className="font-bold text-slate-700 text-lg">Kompas Kiblat</h2>
          </div>
          
          <div className="bg-slate-100 p-4 rounded-xl inline-block mb-4">
            <div className="text-4xl font-black text-emerald-700">{heading}°</div>
            <div className="text-xs font-bold text-slate-500 mt-1 uppercase">Arah Utara</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-emerald-800">
              Putar HP Anda hingga angka mencapai <br/>
              <span className="text-2xl font-black text-emerald-600">295°</span> <br/>
              untuk menghadap Kiblat (Indonesia).
            </p>
          </div>
        </div>

        {/* --- TASBIH DATAR (KOTAK SOLID, TIDAK ADA SHADOW MELAYANG) --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
             <h2 className="font-bold text-slate-700 text-lg">Tasbih Digital</h2>
             <div onClick={() => setCount(0)} className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg cursor-pointer">
                <RotateCcw className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Reset</span>
             </div>
          </div>

          <div className="text-8xl font-black text-slate-800 mb-8 tabular-nums tracking-tighter">
              {count}
          </div>

          <div
            onClick={handleTaliKlik}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-12 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer active:bg-emerald-800"
          >
            <Hand className="w-12 h-12 opacity-80" />
            <span className="text-xl font-bold uppercase tracking-widest">Sentuh / Tap</span>
          </div>
        </div>

      </div>
    </div>
  );
}
