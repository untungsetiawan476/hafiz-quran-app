"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, CalendarDays, AlertCircle, RefreshCw, BellRing } from "lucide-react";

interface JadwalShalat {
  Subuh: string;
  Terbit: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
}

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState<JadwalShalat | null>(null);
  const [lokasiTeks, setLokasiTeks] = useState<string>("Mencari lokasi...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State untuk Countdown
  const [waktuSekarang, setWaktuSekarang] = useState<Date>(new Date());
  const [shalatSelanjutnya, setShalatSelanjutnya] = useState<string>("-");
  const [hitungMundur, setHitungMundur] = useState<string>("--:--:--");

  // 1. FUNGSI MENGAMBIL LOKASI & DATA API
  const ambilJadwal = () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("GPS tidak didukung di perangkat ini.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Menggunakan API Aladhan dengan method=20 (Standar Kemenag Indonesia)
          const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=20`);
          const data = await res.json();
          
          setJadwal({
            Subuh: data.data.timings.Fajr,
            Terbit: data.data.timings.Sunrise,
            Dzuhur: data.data.timings.Dhuhr,
            Ashar: data.data.timings.Asr,
            Maghrib: data.data.timings.Maghrib,
            Isya: data.data.timings.Isha,
          });
          
          // Mengambil nama kota dari koordinat (Reverse Geocoding gratis)
          const resGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
          const dataGeo = await resGeo.json();
          setLokasiTeks(dataGeo.city || dataGeo.locality || "Lokasi Anda");
          
        } catch (err) {
          setErrorMsg("Gagal mengambil data jadwal.");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        // Jika user menolak izin lokasi, beri default Jakarta
        setErrorMsg("Izin lokasi ditolak. Menampilkan jadwal default (Jakarta).");
        fetch(`https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=20`)
          .then(res => res.json())
          .then(data => {
            setJadwal({
              Subuh: data.data.timings.Fajr,
              Terbit: data.data.timings.Sunrise,
              Dzuhur: data.data.timings.Dhuhr,
              Ashar: data.data.timings.Asr,
              Maghrib: data.data.timings.Maghrib,
              Isya: data.data.timings.Isha,
            });
            setLokasiTeks("Jakarta (Default)");
            setIsLoading(false);
          });
      },
      { timeout: 10000 } // Batas waktu pencarian GPS 10 detik
    );
  };

  // 2. JALANKAN SAAT PERTAMA KALI DIBUKA
  useEffect(() => {
    ambilJadwal();
  }, []);

  // 3. LOGIKA HITUNG MUNDUR (BERJALAN SETIAP DETIK)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setWaktuSekarang(now);

      if (jadwal) {
        const daftarWaktu = [
          { nama: "Subuh", waktu: jadwal.Subuh },
          { nama: "Dzuhur", waktu: jadwal.Dzuhur },
          { nama: "Ashar", waktu: jadwal.Ashar },
          { nama: "Maghrib", waktu: jadwal.Maghrib },
          { nama: "Isya", waktu: jadwal.Isya }
        ];

        let jadwalNext = null;
        let targetWaktu = new Date();

        // Cari waktu shalat terdekat di hari ini
        for (const jdwl of daftarWaktu) {
          const [jam, menit] = jdwl.waktu.split(':').map(Number);
          const waktuShalat = new Date();
          waktuShalat.setHours(jam, menit, 0, 0);

          if (now < waktuShalat) {
            jadwalNext = jdwl.nama;
            targetWaktu = waktuShalat;
            break;
          }
        }

        // Jika semua shalat hari ini sudah lewat, targetnya adalah Subuh besok
        if (!jadwalNext) {
          jadwalNext = "Subuh";
          const [jam, menit] = jadwal.Subuh.split(':').map(Number);
          targetWaktu.setDate(targetWaktu.getDate() + 1);
          targetWaktu.setHours(jam, menit, 0, 0);
        }

        setShalatSelanjutnya(jadwalNext);

        // Hitung selisih waktu
        const selisihMs = targetWaktu.getTime() - now.getTime();
        const jamMundur = Math.floor((selisihMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menitMundur = Math.floor((selisihMs % (1000 * 60 * 60)) / (1000 * 60));
        const detikMundur = Math.floor((selisihMs % (1000 * 60)) / 1000);

        setHitungMundur(
          `${jamMundur.toString().padStart(2, '0')}:${menitMundur.toString().padStart(2, '0')}:${detikMundur.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer); // Pembersihan memori agar HP tidak lemot
  }, [jadwal]);

  // --- TAMPILAN LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-600 font-medium animate-pulse">Menyelaraskan waktu GPS...</p>
      </div>
    );
  }

  const tanggalHariIni = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(waktuSekarang);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* HEADER MELENGKUNG (Sesuai Tema) */}
      <div className="bg-emerald-600 p-6 pt-10 rounded-b-[40px] shadow-sm text-center relative overflow-hidden">
        {/* Ornamen Transparan */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-10 -mb-10 blur-lg"></div>
        
        <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Jadwal Shalat</h1>
        
        <div className="flex items-center justify-center gap-2 text-emerald-100 text-sm mb-6 relative z-10">
          <CalendarDays className="w-4 h-4" />
          <span>{tanggalHariIni}</span>
        </div>

        {/* KOTAK COUNTDOWN SUPER ELEGAN */}
        <div className="bg-white rounded-3xl p-6 shadow-lg relative z-10 mx-2 transform translate-y-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Menuju Waktu {shalatSelanjutnya}</p>
          <div className="text-5xl font-black text-emerald-600 tabular-nums tracking-tighter mb-2 drop-shadow-sm">
            {hitungMundur}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 py-2 rounded-xl mt-4 border border-slate-100">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="truncate max-w-[200px]">{lokasiTeks}</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-14 flex flex-col gap-3">
        {/* PESAN ERROR / PERINGATAN (JIKA GPS DITOLAK) */}
        {errorMsg && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-orange-800 font-medium leading-relaxed">{errorMsg}</p>
              <button onClick={ambilJadwal} className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Coba Sinkron Ulang
              </button>
            </div>
          </div>
        )}

        {/* LIST JADWAL SHALAT (FLAT DESIGN) */}
        {jadwal && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {[
              { nama: "Subuh", waktu: jadwal.Subuh },
              { nama: "Terbit", waktu: jadwal.Terbit },
              { nama: "Dzuhur", waktu: jadwal.Dzuhur },
              { nama: "Ashar", waktu: jadwal.Ashar },
              { nama: "Maghrib", waktu: jadwal.Maghrib },
              { nama: "Isya", waktu: jadwal.Isya },
            ].map((item, index) => {
              const isTerdekat = item.nama === shalatSelanjutnya;

              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 border-b border-slate-100 transition-colors ${isTerdekat ? "bg-emerald-50" : "bg-white"}`}
                >
                  <div className="flex items-center gap-4">
                    {isTerdekat ? (
                      <div className="p-2 bg-emerald-500 text-white rounded-lg animate-pulse">
                        <BellRing className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                    )}
                    <span className={`font-bold ${isTerdekat ? "text-emerald-700" : "text-slate-700"}`}>
                      {item.nama}
                    </span>
                  </div>
                  <span className={`font-black text-xl tabular-nums ${isTerdekat ? "text-emerald-600" : "text-slate-800"}`}>
                    {item.waktu}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
