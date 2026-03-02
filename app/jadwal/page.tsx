"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, CalendarDays, AlertCircle, RefreshCw, Moon, Sun, Sunrise } from "lucide-react";

// Tipe Data Jadwal
interface JadwalShalat {
  Imsak: string;
  Fajr: string; // Subuh
  Sunrise: string; // Terbit/Dhuha
  Dhuhr: string; // Dzuhur
  Asr: string; // Ashar
  Maghrib: string; // Maghrib
  Isha: string; // Isya
}

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState<JadwalShalat | null>(null);
  const [lokasiKota, setLokasiKota] = useState<string>("Mencari lokasi...");
  const [waktuSekarang, setWaktuSekarang] = useState<Date>(new Date());
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pesanError, setPesanError] = useState<string>("");

  // Fungsi untuk mengambil data jadwal berdasarkan GPS (Latitude & Longitude)
  const fetchJadwalShalat = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      // 1. Ambil Nama Kota (Reverse Geocoding)
      const resLokasi = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
      const dataLokasi = await resLokasi.json();
      setLokasiKota(dataLokasi.city || dataLokasi.locality || "Lokasi Anda");

      // 2. Ambil Jadwal Shalat (API Aladhan - Method 20 adalah standar Kemenag RI)
      const resJadwal = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=20`);
      const dataJadwal = await resJadwal.json();
      setJadwal(dataJadwal.data.timings);
      
      setPesanError("");
    } catch (error) {
      setPesanError("Gagal mengambil data jadwal. Pastikan internet Anda aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk meminta izin GPS ke browser/HP
  const dapatkanLokasi = () => {
    setIsLoading(true);
    setPesanError("");

    if (!navigator.geolocation) {
      setPesanError("Browser Anda tidak mendukung fitur GPS.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchJadwalShalat(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        // Jika pengguna menolak GPS, kita pakai default Jakarta
        setPesanError("Akses GPS ditolak. Menampilkan jadwal default (Jakarta).");
        setLokasiKota("Jakarta Pusat (Default)");
        fetchJadwalShalat(-6.2088, 106.8456);
      }
    );
  };

  // Jalankan saat pertama kali halaman dibuka
  useEffect(() => {
    // Kita buat variabel lokal agar tidak ada error dependency
    const loadData = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchJadwalShalat(position.coords.latitude, position.coords.longitude);
          },
          () => {
            setLokasiKota("Jakarta Pusat (Default)");
            fetchJadwalShalat(-6.2088, 106.8456);
          }
        );
      }
    };
    
    loadData();

    const timer = setInterval(() => {
      setWaktuSekarang(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Jam Digital (HH:MM:SS)
  const jamDigital = waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tanggalSekarang = waktuSekarang.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Daftar waktu shalat yang akan ditampilkan di layar
  const daftarWaktu = jadwal ? [
    { nama: "Imsak", waktu: jadwal.Imsak, ikon: <Moon className="w-5 h-5" /> },
    { nama: "Subuh", waktu: jadwal.Fajr, ikon: <Sunrise className="w-5 h-5" /> },
    { nama: "Terbit", waktu: jadwal.Sunrise, ikon: <Sun className="w-5 h-5" /> },
    { nama: "Dzuhur", waktu: jadwal.Dhuhr, ikon: <Sun className="w-5 h-5 text-orange-500" /> },
    { nama: "Ashar", waktu: jadwal.Asr, ikon: <Sun className="w-5 h-5 text-amber-500" /> },
    { nama: "Maghrib", waktu: jadwal.Maghrib, ikon: <Sunrise className="w-5 h-5 text-orange-600 rotate-180" /> },
    { nama: "Isya", waktu: jadwal.Isha, ikon: <Moon className="w-5 h-5 text-indigo-500" /> },
  ] : [];

  return (
    <main className="pb-24 bg-slate-50 min-h-screen">
      {/* --- BAGIAN ATAS (HERO SECTION & JAM) --- */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 pt-10 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden text-center">
        
        {/* Dekorasi transparan */}
        <div className="absolute top-[-20px] left-[-20px] opacity-10">
          <Clock className="w-40 h-40" />
        </div>

        <h1 className="text-white/80 text-sm font-medium mb-1 tracking-widest uppercase flex items-center justify-center gap-2">
          <CalendarDays className="w-4 h-4" /> {tanggalSekarang}
        </h1>
        
        {/* Jam Digital Realtime */}
        <div className="text-5xl font-black text-white my-4 tracking-wider drop-shadow-md tabular-nums">
          {jamDigital}
        </div>

        {/* Info Lokasi GPS */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/30 shadow-sm mt-2">
          <MapPin className="w-4 h-4 animate-bounce" />
          <span className="truncate max-w-[200px]">{lokasiKota}</span>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-10">
        
        {/* Tombol Segarkan / Alert Error */}
        {pesanError && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 p-3 rounded-xl mb-4 text-xs flex items-start gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{pesanError}</p>
          </div>
        )}

        <button 
          onClick={dapatkanLokasi}
          className="w-full mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 active:scale-[0.98] transition-all"
        >
          {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
          {isLoading ? "Mencari Koordinat GPS..." : "Perbarui Lokasi GPS Saya"}
        </button>

        {/* --- DAFTAR JADWAL SHALAT --- */}
        <div className="flex flex-col gap-3">
          {isLoading && !jadwal ? (
            // Animasi Loading Kotak (Skeleton)
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 animate-pulse flex justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            // Tampilan Jadwal Asli
            daftarWaktu.map((item, index) => {
              // Logika sederhana untuk menentukan apakah ini waktu shalat berikutnya
              // (Untuk versi lomba, ini membuat UI terlihat dinamis)
              const jamJadwal = parseInt(item.waktu.split(":")[0]);
              const menitJadwal = parseInt(item.waktu.split(":")[1]);
              const jamSekarang = waktuSekarang.getHours();
              const menitSekarang = waktuSekarang.getMinutes();
              
              const totalMenitJadwal = (jamJadwal * 60) + menitJadwal;
              const totalMenitSekarang = (jamSekarang * 60) + menitSekarang;
              
              // Cek jika waktu ini sudah lewat atau belum (secara sederhana)
              const isLewat = totalMenitSekarang > totalMenitJadwal;

              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border ${
                    isLewat 
                      ? "bg-gray-50 border-gray-100 opacity-60" // Jika sudah lewat, diburamkan sedikit
                      : "bg-white border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${isLewat ? "bg-gray-200 text-gray-500" : "bg-emerald-50 text-emerald-600"}`}>
                      {item.ikon}
                    </div>
                    <h2 className={`font-bold text-lg ${isLewat ? "text-gray-500" : "text-slate-700"}`}>
                      {item.nama}
                    </h2>
                  </div>
                  <div className={`text-2xl font-black tabular-nums ${isLewat ? "text-gray-400" : "text-emerald-600"}`}>
                    {item.waktu}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
}