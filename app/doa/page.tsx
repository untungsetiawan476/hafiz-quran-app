"use client";

import { useState } from "react";
import { Search, ArrowLeft, Book, Sparkles, ChevronRight, Folder } from "lucide-react";

// --- STRUKTUR TIPE DATA ---
interface DoaItem { judul: string; arab: string; latin: string; arti: string; }
interface Kategori { id: string; nama: string; tipe: "doa" | "wirid"; jumlah: number; list: DoaItem[]; }

// --- DATABASE LOKAL (LENGKAP) ---
const databaseKategori: Kategori[] = [
    { id: "w1", nama: "Wirid Harian", tipe: "wirid", jumlah: 6, list: [
        { judul: "1. Istighfar", arab: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", latin: "Astaghfirullahal 'azhiim", arti: "Aku memohon ampun kepada Allah Yang Maha Agung." },
        { judul: "2. Tasbih", arab: "سُبْحَانَ اللَّهِ", latin: "Subhaanallah", arti: "Maha Suci Allah." },
        { judul: "3. Tahmid", arab: "الْحَمْدُ لِلَّهِ", latin: "Alhamdulillah", arti: "Segala puji bagi Allah." },
        { judul: "4. Takbir", arab: "اللَّهُ أَكْبَرُ", latin: "Allahu Akbar", arti: "Allah Maha Besar." },
        { judul: "5. Tahlil", arab: "لَا إِلَهَ إِلَّا اللَّهُ", latin: "Laa ilaaha illallah", arti: "Tiada Tuhan selain Allah." },
        { judul: "6. Hauqalah", arab: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", latin: "Laa hawla wa laa quwwata illaa billaah", arti: "Tiada daya dan upaya melainkan dengan pertolongan Allah." }
      ] },
    { id: "w2", nama: "Shalawat", tipe: "wirid", jumlah: 3, list: [
        { judul: "Shalawat Ibrahimiyah", arab: "اللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيْمَ", latin: "Allahumma shalli 'alaa Muhammad wa 'alaa aali Muhammad...", arti: "Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan keluarganya..." },
        { judul: "Shalawat Thibbil Qulub", arab: "اللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوْبِ وَدَوَائِهَا", latin: "Allahumma shalli 'alaa Sayyidinaa Muhammadin thibbil quluubi wa dawaa-ihaa", arti: "Ya Allah, berikanlah rahmat kepada junjungan kami Nabi Muhammad, sebagai pengobat hati dan penyembuhnya." },
        { judul: "Shalawat Jibril", arab: "صَلَّى اللهُ عَلَى مُحَمَّد", latin: "Shallallahu 'alaa Muhammad", arti: "Semoga Allah melimpahkan rahmat kepada Nabi Muhammad." }
      ] },
    { id: "w3", nama: "Asmaul Husna (Potongan)", tipe: "wirid", jumlah: 3, list: [
        { judul: "Ya Rahman Ya Rahiim", arab: "يَا رَحْمٰنُ يَا رَحِيْمُ", latin: "Yaa Rahmaan, Yaa Rahiim", arti: "Wahai Dzat Yang Maha Pengasih, Wahai Dzat Yang Maha Penyayang." },
        { judul: "Ya Malik Ya Quddus", arab: "يَا مَلِكُ يَا قُدُّوْسُ", latin: "Yaa Malik, Yaa Qudduus", arti: "Wahai Dzat Yang Merajai, Wahai Dzat Yang Maha Suci." },
        { judul: "Ya Fattah Ya Rozzaq", arab: "يَا فَتَّاحُ يَا رَزَّاقُ", latin: "Yaa Fattaah, Yaa Razzaaq", arti: "Wahai Dzat Yang Maha Pembuka, Wahai Dzat Yang Maha Pemberi Rezeki." }
      ] },
    { id: "d1", nama: "Doa Keseharian", tipe: "doa", jumlah: 4, list: [
        { judul: "Doa Sebelum Makan", arab: "اللَّهُمَّ بَارِكْ لَناَ فِيْمَا رَزَقْتَنا وَقِنَا عَذَابَ النَّارِ", latin: "Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaa bannaar", arti: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau limpahkan kepada kami dan peliharalah kami dari siksa neraka." },
        { judul: "Doa Bangun Tidur", arab: "اَلْحَمْدُ ِللهِ الَّذِى اَحْيَانَا بَعْدَمَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ", latin: "Alhamdulillahil ladzii ahyaanaa ba'da maa amaatanaa wailaihin nusyuur", arti: "Segala puji bagi Allah yang menghidupkan kami kembali setelah mematikan kami dan kepada-Nya kami akan dibangkitkan." },
        { judul: "Doa Keluar Rumah", arab: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", latin: "Bismillahi tawakkaltu 'alallahi, laa hawla wa laa quwwata illaa billaah", arti: "Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan pertolongan Allah." },
        { judul: "Doa Masuk Rumah", arab: "بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا", latin: "Bismillahi walajnaa, wa bismillahi kharajnaa, wa 'alaa rabbinaa tawakkalnaa", arti: "Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar, dan hanya kepada Tuhan kami, kami bertawakal." }
      ] },
    { id: "d3", nama: "Doa Tolak Bala", tipe: "doa", jumlah: 3, list: [
        { judul: "Doa Keselamatan (Sapu Jagat)", arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", latin: "Rabbanaa aatinaa fiddunyaa hasanah wa fil aakhirati hasanah, wa qinaa 'adzaaban naar", arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka." },
        { judul: "Doa Berlindung dari Musibah", arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ", latin: "Allahumma innii a'uudzu bika min jahdil balaa-i, wa darakisy syaqaa-i, wa suu-il qadhaa-i, wa syamaatatil a'daa-i", arti: "Ya Allah, aku berlindung kepada-Mu dari beratnya musibah, kesengsaraan yang terus-menerus, buruknya takdir, dan kegembiraan musuh atas musibahku." },
        { judul: "Doa Menolak Penyakit Berbahaya", arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ", latin: "Allahumma innii a'uudzu bika minal barashi wal junuuni wal judzaami wa min sayyi-il asqaam", arti: "Ya Allah, aku berlindung kepada-Mu dari penyakit belang, gila, kusta, dan dari segala penyakit yang buruk." }
      ] },
    { id: "d6", nama: "Doa Ilmu", tipe: "doa", jumlah: 3, list: [
        { judul: "Doa Sebelum Belajar", arab: "رَبِّ زِدْنِيْ عِلْمًا وَارْزُقْنِيْ فَهْمًا", latin: "Robbi zidnii 'ilman warzuqnii fahman", arti: "Ya Tuhanku, tambahkanlah kepadaku ilmu dan berikanlah aku karunia untuk dapat memahaminya." },
        { judul: "Doa Mohon Ilmu Bermanfaat", arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا", latin: "Allahumma innii as-aluka 'ilman naafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan", arti: "Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima." },
        { judul: "Doa Setelah Belajar", arab: "اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَارْزُقْنَا اجْتِنَابَهُ", latin: "Allahumma arinal haqqa haqqan warzuqnat tibaa'ah, wa arinal baathila baathilan warzuqnaj tinaabah", arti: "Ya Allah, tunjukkanlah kepada kami yang benar itu benar dan karuniakanlah kami kekuatan untuk mengikutinya, dan tunjukkanlah kepada kami yang batil itu batil dan karuniakanlah kami kekuatan untuk menjauhinya." }
      ] },
    { id: "d14", nama: "Doa Shalat", tipe: "doa", jumlah: 2, list: [
        { judul: "1. Doa Usai Shalat Fardhu", arab: "أَسْتَغْفِرُ اللهَ الْعَظِـيْمَ لِيْ وَلِوَالِدَيَّ...", latin: "Astaghfirullâh al-`adhîm...", arti: "Aku memohon ampunan kepada Allah yang Mahaagung..." },
        { judul: "2. Doa Usai Shalat Dhuha", arab: "اَللّٰهُمَّ إِنَّ الضَّحَآءَ ضَحَاءُكَ...", latin: "Allâhumma innad dlaḫâ’a dlaḫâ’uka...", arti: "Wahai Tuhanku, sungguh dhuha ini adalah dhuha-Mu..." }
      ] }
];

export default function DoaPage() {
  const [activeTab, setActiveTab] = useState<"doa" | "wirid">("doa");
  const [kataKunci, setKataKunci] = useState("");
  
  // State Navigasi Lurus (Tanpa Animasi/Transisi)
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);
  const [doaAktif, setDoaAktif] = useState<DoaItem | null>(null);

  const kategoriTampil = databaseKategori.filter(
    (kat) => kat.tipe === activeTab && kat.nama.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const doaDidalamKategori = kategoriAktif?.list.filter(
    (doa) => doa.judul.toLowerCase().includes(kataKunci.toLowerCase())
  ) || [];

  // ==========================================
  // LAYAR 3: BACA DOA FULLSCREEN (MINIMALIS)
  // ==========================================
  if (doaAktif) {
    return (
      <div className="min-h-screen bg-white pb-24">
        {/* Header Sederhana Tanpa Sticky/Shadow */}
        <div className="bg-emerald-600 text-white p-4 flex items-center gap-4">
          <div onClick={() => setDoaAktif(null)} className="p-2 bg-emerald-700 rounded-lg cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg truncate">{doaAktif.judul}</h1>
        </div>

        {/* Konten Datar */}
        <div className="p-5">
          <p className="text-right text-3xl font-bold leading-loose text-slate-800 mt-4 mb-8" dir="rtl">
            {doaAktif.arab}
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
            <p className="text-emerald-700 font-medium leading-relaxed">{doaAktif.latin}</p>
          </div>
          <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50/50">
            <p className="text-slate-600 italic leading-relaxed">&quot;{doaAktif.arti}&quot;</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LAYAR 2: DAFTAR JUDUL DOA
  // ==========================================
  if (kategoriAktif) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="bg-emerald-600 text-white p-4 flex items-center gap-4">
          <div onClick={() => { setKategoriAktif(null); setKataKunci(""); }} className="p-2 bg-emerald-700 rounded-lg cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg">{kategoriAktif.nama}</h1>
        </div>

        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex bg-white rounded-lg border border-slate-300 p-2 items-center">
            <Search className="w-5 h-5 text-slate-400 mx-2" />
            <input type="text" className="w-full outline-none bg-transparent" placeholder="Cari doa..." value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} />
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          {doaDidalamKategori.map((doa, index) => (
            <div key={index} onClick={() => setDoaAktif(doa)} className="p-4 border-b border-slate-100 flex justify-between items-center cursor-pointer bg-white">
              <span className="font-bold text-slate-700">{doa.judul}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
          {doaDidalamKategori.length === 0 && <p className="text-center text-slate-400 mt-10">Tidak ada doa.</p>}
        </div>
      </div>
    );
  }

  // ==========================================
  // LAYAR 1: MENU UTAMA KATEGORI
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-emerald-600 p-6 pt-10 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-2">Ensiklopedia</h1>
        <p className="text-emerald-100 text-sm">Kumpulan doa dan amalan harian</p>
      </div>

      <div className="p-4 -mt-6">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-6">
          <div onClick={() => { setActiveTab("doa"); setKataKunci(""); }} className={`flex-1 py-3 text-sm font-bold text-center rounded-lg cursor-pointer ${activeTab === "doa" ? "bg-emerald-100 text-emerald-700" : "text-slate-500"}`}>
            Doa Pilihan
          </div>
          <div onClick={() => { setActiveTab("wirid"); setKataKunci(""); }} className={`flex-1 py-3 text-sm font-bold text-center rounded-lg cursor-pointer ${activeTab === "wirid" ? "bg-emerald-100 text-emerald-700" : "text-slate-500"}`}>
            Wirid & Amalan
          </div>
        </div>

        <div className="flex bg-white rounded-xl border border-slate-200 p-3 items-center mb-6">
          <Search className="w-5 h-5 text-slate-400 mx-2" />
          <input type="text" className="w-full outline-none bg-transparent text-sm" placeholder={`Cari kategori ${activeTab}...`} value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} />
        </div>

        <div className="flex flex-col gap-3">
          {kategoriTampil.map((kat) => (
            <div key={kat.id} onClick={() => { setKategoriAktif(kat); setKataKunci(""); }} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-lg text-emerald-600"><Folder className="w-6 h-6" /></div>
                <div>
                  <h2 className="font-bold text-slate-800">{kat.nama}</h2>
                  <p className="text-xs text-slate-500">{kat.jumlah} Bacaan</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
