"use client";

import { useState } from "react";
import { Search, ChevronRight, ArrowLeft, FolderOpen, Sparkles, BookMarked, Quote, BookHeart } from "lucide-react";

// --- STRUKTUR TIPE DATA ---
interface DoaItem {
  judul: string;
  arab: string;
  latin: string;
  arti: string;
}

interface Kategori {
  id: string;
  nama: string;
  tipe: "doa" | "wirid";
  jumlah: number;
  list: DoaItem[];
}

// --- DATABASE LOKAL KATEGORI ---
const databaseKategori: Kategori[] = [
    { 
      id: "w1", 
      nama: "Wirid Harian", 
      tipe: "wirid", 
      jumlah: 6, 
      list: [
        { judul: "1. Istighfar", arab: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", latin: "Astaghfirullahal 'azhiim", arti: "Aku memohon ampun kepada Allah Yang Maha Agung." },
        { judul: "2. Tasbih", arab: "سُبْحَانَ اللَّهِ", latin: "Subhaanallah", arti: "Maha Suci Allah." },
        { judul: "3. Tahmid", arab: "الْحَمْدُ لِلَّهِ", latin: "Alhamdulillah", arti: "Segala puji bagi Allah." },
        { judul: "4. Takbir", arab: "اللَّهُ أَكْبَرُ", latin: "Allahu Akbar", arti: "Allah Maha Besar." },
        { judul: "5. Tahlil", arab: "لَا إِلَهَ إِلَّا اللَّهُ", latin: "Laa ilaaha illallah", arti: "Tiada Tuhan selain Allah." },
        { judul: "6. Hauqalah", arab: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", latin: "Laa hawla wa laa quwwata illaa billaah", arti: "Tiada daya dan upaya melainkan dengan pertolongan Allah." }
      ] 
    },
    { 
      id: "w2", 
      nama: "Shalawat", 
      tipe: "wirid", 
      jumlah: 3, 
      list: [
        { judul: "Shalawat Ibrahimiyah", arab: "اللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيْمَ", latin: "Allahumma shalli 'alaa Muhammad wa 'alaa aali Muhammad...", arti: "Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan keluarganya..." },
        { judul: "Shalawat Thibbil Qulub", arab: "اللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوْبِ وَدَوَائِهَا", latin: "Allahumma shalli 'alaa Sayyidinaa Muhammadin thibbil quluubi wa dawaa-ihaa", arti: "Ya Allah, berikanlah rahmat kepada junjungan kami Nabi Muhammad, sebagai pengobat hati dan penyembuhnya." },
        { judul: "Shalawat Jibril", arab: "صَلَّى اللهُ عَلَى مُحَمَّد", latin: "Shallallahu 'alaa Muhammad", arti: "Semoga Allah melimpahkan rahmat kepada Nabi Muhammad." }
      ] 
    },
    { 
      id: "w3", 
      nama: "Asmaul Husna (Potongan)", 
      tipe: "wirid", 
      jumlah: 3, 
      list: [
        { judul: "Ya Rahman Ya Rahiim", arab: "يَا رَحْمٰنُ يَا رَحِيْمُ", latin: "Yaa Rahmaan, Yaa Rahiim", arti: "Wahai Dzat Yang Maha Pengasih, Wahai Dzat Yang Maha Penyayang." },
        { judul: "Ya Malik Ya Quddus", arab: "يَا مَلِكُ يَا قُدُّوْسُ", latin: "Yaa Malik, Yaa Qudduus", arti: "Wahai Dzat Yang Merajai, Wahai Dzat Yang Maha Suci." },
        { judul: "Ya Fattah Ya Rozzaq", arab: "يَا فَتَّاحُ يَا رَزَّاقُ", latin: "Yaa Fattaah, Yaa Razzaaq", arti: "Wahai Dzat Yang Maha Pembuka, Wahai Dzat Yang Maha Pemberi Rezeki." }
      ] 
    },
    { id: "w4", nama: "Istighotsah & Mujahadah", tipe: "wirid", jumlah: 0, list: [] },
    { id: "w5", nama: "Ratib", tipe: "wirid", jumlah: 0, list: [] },
    { id: "w6", nama: "Hizib", tipe: "wirid", jumlah: 0, list: [] },
    { 
      id: "d1", 
      nama: "Doa Keseharian", 
      tipe: "doa", 
      jumlah: 4, 
      list: [
        { judul: "Doa Sebelum Makan", arab: "اللَّهُمَّ بَارِكْ لَناَ فِيْمَا رَزَقْتَنا وَقِنَا عَذَابَ النَّارِ", latin: "Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaa bannaar", arti: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau limpahkan kepada kami dan peliharalah kami dari siksa neraka." },
        { judul: "Doa Bangun Tidur", arab: "اَلْحَمْدُ ِللهِ الَّذِى اَحْيَانَا بَعْدَمَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ", latin: "Alhamdulillahil ladzii ahyaanaa ba'da maa amaatanaa wailaihin nusyuur", arti: "Segala puji bagi Allah yang menghidupkan kami kembali setelah mematikan kami dan kepada-Nya kami akan dibangkitkan." },
        { judul: "Doa Keluar Rumah", arab: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", latin: "Bismillahi tawakkaltu 'alallahi, laa hawla wa laa quwwata illaa billaah", arti: "Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan pertolongan Allah." },
        { judul: "Doa Masuk Rumah", arab: "بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا", latin: "Bismillahi walajnaa, wa bismillahi kharajnaa, wa 'alaa rabbinaa tawakkalnaa", arti: "Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar, dan hanya kepada Tuhan kami, kami bertawakal." }
      ] 
    },
    { 
      id: "d3", 
      nama: "Doa Tolak Bala", 
      tipe: "doa", 
      jumlah: 3, 
      list: [
        { judul: "Doa Keselamatan (Sapu Jagat)", arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", latin: "Rabbanaa aatinaa fiddunyaa hasanah wa fil aakhirati hasanah, wa qinaa 'adzaaban naar", arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka." },
        { judul: "Doa Berlindung dari Musibah", arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ", latin: "Allahumma innii a'uudzu bika min jahdil balaa-i, wa darakisy syaqaa-i, wa suu-il qadhaa-i, wa syamaatatil a'daa-i", arti: "Ya Allah, aku berlindung kepada-Mu dari beratnya musibah, kesengsaraan yang terus-menerus, buruknya takdir, dan kegembiraan musuh atas musibahku." },
        { judul: "Doa Menolak Penyakit Berbahaya", arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ", latin: "Allahumma innii a'uudzu bika minal barashi wal junuuni wal judzaami wa min sayyi-il asqaam", arti: "Ya Allah, aku berlindung kepada-Mu dari penyakit belang, gila, kusta, dan dari segala penyakit yang buruk." }
      ] 
    },
    { 
      id: "d6", 
      nama: "Doa Ilmu", 
      tipe: "doa", 
      jumlah: 3, 
      list: [
        { judul: "Doa Sebelum Belajar", arab: "رَبِّ زِدْنِيْ عِلْمًا وَارْزُقْنِيْ فَهْمًا", latin: "Robbi zidnii 'ilman warzuqnii fahman", arti: "Ya Tuhanku, tambahkanlah kepadaku ilmu dan berikanlah aku karunia untuk dapat memahaminya." },
        { judul: "Doa Mohon Ilmu Bermanfaat", arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا", latin: "Allahumma innii as-aluka 'ilman naafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan", arti: "Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima." },
        { judul: "Doa Setelah Belajar", arab: "اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَارْزُقْنَا اجْتِنَابَهُ", latin: "Allahumma arinal haqqa haqqan warzuqnat tibaa'ah, wa arinal baathila baathilan warzuqnaj tinaabah", arti: "Ya Allah, tunjukkanlah kepada kami yang benar itu benar dan karuniakanlah kami kekuatan untuk mengikutinya, dan tunjukkanlah kepada kami yang batil itu batil dan karuniakanlah kami kekuatan untuk menjauhinya." }
      ] 
    },
    { 
      id: "d14", 
      nama: "Doa Shalat", 
      tipe: "doa", 
      jumlah: 2, 
      list: [
        { judul: "1. Doa Usai Shalat Fardhu", arab: "أَسْتَغْفِرُ اللهَ الْعَظِـيْمَ لِيْ وَلِوَالِدَيَّ...", latin: "Astaghfirullâh al-`adhîm...", arti: "Aku memohon ampunan kepada Allah yang Mahaagung..." },
        { judul: "2. Doa Usai Shalat Dhuha", arab: "اَللّٰهُمَّ إِنَّ الضَّحَآءَ ضَحَاءُكَ...", latin: "Allâhumma innad dlaḫâ’a dlaḫâ’uka...", arti: "Wahai Tuhanku, sungguh dhuha ini adalah dhuha-Mu..." }
      ] 
    }
];

export default function DoaPage() {
  const [activeTab, setActiveTab] = useState<"doa" | "wirid">("doa");
  const [kataKunci, setKataKunci] = useState("");
  
  // STATE NAVIGASI 3 LAPIS (Sangat Aman untuk HP)
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);
  const [doaAktif, setDoaAktif] = useState<DoaItem | null>(null);

  const kategoriTampil = databaseKategori.filter(
    (kat) => kat.tipe === activeTab && kat.nama.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const doaDidalamKategori = kategoriAktif?.list.filter(
    (doa) => doa.judul.toLowerCase().includes(kataKunci.toLowerCase())
  ) || [];

  // ==========================================
  // LAYAR 3: MODE BACA DOA (LAYAR PENUH)
  // ==========================================
  if (doaAktif) {
    return (
      <main className="pb-24 bg-white min-h-screen">
        <div className="sticky top-0 bg-emerald-600 shadow-md z-10 px-5 py-4 flex items-center gap-4 text-white">
          <div onClick={() => setDoaAktif(null)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition cursor-pointer active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg truncate flex-1">{doaAktif.judul}</h1>
        </div>

        <div className="p-6 pt-8">
          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 mb-6 shadow-sm relative">
            <Quote className="absolute top-4 left-4 w-8 h-8 text-emerald-200 opacity-50" />
            <p className="text-right text-3xl font-bold leading-[1.8] text-slate-800 mt-6" dir="rtl">
              {doaAktif.arab}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Cara Membaca:</h3>
            <p className="text-slate-700 text-base font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {doaAktif.latin}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Artinya:</h3>
            <p className="text-slate-600 text-base leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
              &quot;{doaAktif.arti}&quot;
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // LAYAR 2: DAFTAR JUDUL DOA (TANPA ARAB)
  // ==========================================
  if (kategoriAktif) {
    return (
      <main className="pb-24 bg-slate-50 min-h-screen">
        <div className="sticky top-0 bg-white shadow-sm z-10 px-5 py-4 flex items-center gap-4">
          <div onClick={() => { setKategoriAktif(null); setKataKunci(""); }} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition cursor-pointer active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800">{kategoriAktif.nama}</h1>
            <p className="text-xs text-slate-500">{kategoriAktif.jumlah} Bacaan Tersedia</p>
          </div>
        </div>

        <div className="p-5">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm" placeholder="Cari doa di kategori ini..." value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3">
            {doaDidalamKategori.length > 0 ? (
              doaDidalamKategori.map((doa, index) => (
                <div key={index} onClick={() => setDoaAktif(doa)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-emerald-300 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <BookHeart className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                      {doa.judul}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">Doa tidak ditemukan.</div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // LAYAR 1: BERANDA KATEGORI UTAMA
  // ==========================================
  return (
    <main className="p-5 pb-24 bg-slate-50 min-h-screen">
      <header className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-emerald-600">Ensiklopedia</h1>
        <p className="text-gray-500 text-sm mt-1">Kumpulan doa, wirid, dan amalan harian</p>
      </header>

      <div className="flex bg-gray-200/60 p-1.5 rounded-xl mb-6">
        <div onClick={() => { setActiveTab("doa"); setKataKunci(""); }} className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex justify-center items-center gap-2 cursor-pointer transition-all ${activeTab === "doa" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}>
          <BookMarked className="w-4 h-4" /> DOA PILIHAN
        </div>
        <div onClick={() => { setActiveTab("wirid"); setKataKunci(""); }} className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex justify-center items-center gap-2 cursor-pointer transition-all ${activeTab === "wirid" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}>
          <Sparkles className="w-4 h-4" /> WIRID & AMALAN
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm" placeholder={`Cari kategori ${activeTab}...`} value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {kategoriTampil.map((kat) => (
          <div key={kat.id} onClick={() => { setKategoriAktif(kat); setKataKunci(""); }} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-emerald-300 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{kat.nama}</h2>
                <p className="text-xs text-slate-500 font-medium"><span className="text-emerald-600">{kat.jumlah}</span> Bacaan</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-full group-hover:bg-emerald-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
