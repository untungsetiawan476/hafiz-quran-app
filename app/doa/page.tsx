"use client";

import { useState } from "react";
import { Search, BookHeart, ChevronDown, ArrowLeft, FolderOpen, Sparkles, BookMarked } from "lucide-react";

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

// --- DATABASE LOKAL KATEGORI (Lengkap sesuai permintaan) ---
const databaseKategori: Kategori[] = [
    // ================= KATEGORI WIRID =================
    { 
      id: "w1", 
      nama: "Wirid Harian", 
      tipe: "wirid", 
      jumlah: 6, 
      list: [
        {
          judul: "1. Istighfar",
          arab: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",
          latin: "Astaghfirullahal 'azhiim",
          arti: "Aku memohon ampun kepada Allah Yang Maha Agung."
        },
        {
          judul: "2. Tasbih",
          arab: "سُبْحَانَ اللَّهِ",
          latin: "Subhaanallah",
          arti: "Maha Suci Allah."
        },
        {
          judul: "3. Tahmid",
          arab: "الْحَمْدُ لِلَّهِ",
          latin: "Alhamdulillah",
          arti: "Segala puji bagi Allah."
        },
        {
          judul: "4. Takbir",
          arab: "اللَّهُ أَكْبَرُ",
          latin: "Allahu Akbar",
          arti: "Allah Maha Besar."
        },
        {
          judul: "5. Tahlil",
          arab: "لَا إِلَهَ إِلَّا اللَّهُ",
          latin: "Laa ilaaha illallah",
          arti: "Tiada Tuhan selain Allah."
        },
        {
          judul: "6. Hauqalah",
          arab: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
          latin: "Laa hawla wa laa quwwata illaa billaah",
          arti: "Tiada daya dan upaya melainkan dengan pertolongan Allah."
        }
      ] 
    },
    { 
      id: "w2", 
      nama: "Shalawat", 
      tipe: "wirid", 
      jumlah: 3, 
      list: [
        {
          judul: "Shalawat Ibrahimiyah",
          arab: "اللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيْمَ",
          latin: "Allahumma shalli 'alaa Muhammad wa 'alaa aali Muhammad, kamaa shallaita 'alaa Ibraahiim",
          arti: "Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau telah melimpahkan rahmat kepada Nabi Ibrahim."
        },
        {
          judul: "Shalawat Thibbil Qulub",
          arab: "اللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوْبِ وَدَوَائِهَا",
          latin: "Allahumma shalli 'alaa Sayyidinaa Muhammadin thibbil quluubi wa dawaa-ihaa",
          arti: "Ya Allah, berikanlah rahmat kepada junjungan kami Nabi Muhammad, sebagai pengobat hati dan penyembuhnya."
        },
        {
          judul: "Shalawat Jibril",
          arab: "صَلَّى اللهُ عَلَى مُحَمَّد",
          latin: "Shallallahu 'alaa Muhammad",
          arti: "Semoga Allah melimpahkan rahmat kepada Nabi Muhammad."
        }
      ] 
    },
    { 
      id: "w3", 
      nama: "Asmaul Husna (Potongan)", 
      tipe: "wirid", 
      jumlah: 3, 
      list: [
        {
          judul: "Ya Rahman Ya Rahiim",
          arab: "يَا رَحْمٰنُ يَا رَحِيْمُ",
          latin: "Yaa Rahmaan, Yaa Rahiim",
          arti: "Wahai Dzat Yang Maha Pengasih, Wahai Dzat Yang Maha Penyayang."
        },
        {
          judul: "Ya Malik Ya Quddus",
          arab: "يَا مَلِكُ يَا قُدُّوْسُ",
          latin: "Yaa Malik, Yaa Qudduus",
          arti: "Wahai Dzat Yang Merajai, Wahai Dzat Yang Maha Suci."
        },
        {
          judul: "Ya Fattah Ya Rozzaq",
          arab: "يَا فَتَّاحُ يَا رَزَّاقُ",
          latin: "Yaa Fattaah, Yaa Razzaaq",
          arti: "Wahai Dzat Yang Maha Pembuka, Wahai Dzat Yang Maha Pemberi Rezeki."
        }
      ] 
    },
    { id: "w4", nama: "Istighotsah & Mujahadah", tipe: "wirid", jumlah: 0, list: [] },
    { id: "w5", nama: "Ratib", tipe: "wirid", jumlah: 0, list: [] },
    { id: "w6", nama: "Hizib", tipe: "wirid", jumlah: 0, list: [] },
  
    // ================= KATEGORI DOA =================
    { 
      id: "d1", 
      nama: "Doa Keseharian", 
      tipe: "doa", 
      jumlah: 4, 
      list: [
        {
          judul: "Doa Sebelum Makan",
          arab: "اللَّهُمَّ بَارِكْ لَناَ فِيْمَا رَزَقْتَنا وَقِنَا عَذَابَ النَّارِ",
          latin: "Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaa bannaar",
          arti: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau limpahkan kepada kami dan peliharalah kami dari siksa neraka."
        },
        {
          judul: "Doa Bangun Tidur",
          arab: "اَلْحَمْدُ ِللهِ الَّذِى اَحْيَانَا بَعْدَمَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ",
          latin: "Alhamdulillahil ladzii ahyaanaa ba'da maa amaatanaa wailaihin nusyuur",
          arti: "Segala puji bagi Allah yang menghidupkan kami kembali setelah mematikan kami dan kepada-Nya kami akan dibangkitkan."
        },
        {
          judul: "Doa Keluar Rumah",
          arab: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
          latin: "Bismillahi tawakkaltu 'alallahi, laa hawla wa laa quwwata illaa billaah",
          arti: "Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan kekuatan kecuali dengan pertolongan Allah."
        },
        {
          judul: "Doa Masuk Rumah",
          arab: "بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
          latin: "Bismillahi walajnaa, wa bismillahi kharajnaa, wa 'alaa rabbinaa tawakkalnaa",
          arti: "Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar, dan hanya kepada Tuhan kami, kami bertawakal."
        }
      ] 
    },
    { 
      id: "d3", 
      nama: "Doa Tolak Bala", 
      tipe: "doa", 
      jumlah: 3, 
      list: [
        {
          judul: "Doa Keselamatan (Sapu Jagat)",
          arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
          latin: "Rabbanaa aatinaa fiddunyaa hasanah wa fil aakhirati hasanah, wa qinaa 'adzaaban naar",
          arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka."
        },
        {
          judul: "Doa Berlindung dari Musibah",
          arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ",
          latin: "Allahumma innii a'uudzu bika min jahdil balaa-i, wa darakisy syaqaa-i, wa suu-il qadhaa-i, wa syamaatatil a'daa-i",
          arti: "Ya Allah, aku berlindung kepada-Mu dari beratnya musibah, kesengsaraan yang terus-menerus, buruknya takdir, dan kegembiraan musuh atas musibahku."
        },
        {
          judul: "Doa Menolak Penyakit Berbahaya",
          arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ",
          latin: "Allahumma innii a'uudzu bika minal barashi wal junuuni wal judzaami wa min sayyi-il asqaam",
          arti: "Ya Allah, aku berlindung kepada-Mu dari penyakit belang, gila, kusta, dan dari segala penyakit yang buruk."
        }
      ] 
    },
    { 
      id: "d4", 
      nama: "Doa Kesehatan", 
      tipe: "doa", 
      jumlah: 3, 
      list: [
        {
          judul: "Doa Mohon Kesembuhan",
          arab: "اللَّهُمَّ رَبَّ النَّاسِ مُذْهِبَ الْبَاسِ اشْفِ أَنْتَ الشَّافِي لَا شَافِيَ إِلَّا أَنْتَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
          latin: "Allahumma rabban naasi mudzhibal baasi isyfi antasy syaafii laa syaafiya illaa anta syifaa-an laa yughaadiru saqaman",
          arti: "Ya Allah Wahai Tuhan segala manusia, hilangkanlah penyakitnya, sembukanlah ia. Engkau Maha Penyembuh, tiada kesembuhan melainkan penyembuhan-Mu."
        },
        {
          judul: "Doa Menjenguk Orang Sakit",
          arab: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
          latin: "Laa ba'sa thahuurun in syaa Allah",
          arti: "Tidak mengapa, semoga sakitmu ini membersihkan dosamu, Insya Allah."
        },
        {
          judul: "Doa Sehat Jasmani & Rohani",
          arab: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
          latin: "Allahumma 'aafinii fii badanii, Allahumma 'aafinii fii sam'ii, Allahumma 'aafinii fii basharii, laa ilaaha illaa anta",
          arti: "Ya Allah, sehatkanlah badanku. Ya Allah, sehatkanlah pendengaranku. Ya Allah, sehatkanlah penglihatanku. Tidak ada Tuhan yang berhak disembah selain Engkau."
        }
      ] 
    },
    { 
      id: "d5", 
      nama: "Doa Perjalanan", 
      tipe: "doa", 
      jumlah: 2, 
      list: [
        {
          judul: "Doa Naik Kendaraan Darat/Laut",
          arab: "سُبْحَانَ الَّذِى سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
          latin: "Subhaanal ladzii sakh-khoro lanaa haadzaa wa maa kunnaa lahu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun",
          arti: "Maha Suci Allah yang telah menundukkan kendaraan ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami."
        },
        {
          judul: "Doa Singgah di Suatu Tempat",
          arab: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
          latin: "A'uudzu bikalimaatillaahit taammaati min syarri maa khalaq",
          arti: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang diciptakan-Nya."
        }
      ] 
    },
    { 
      id: "d6", 
      nama: "Doa Ilmu", 
      tipe: "doa", 
      jumlah: 3, 
      list: [
        {
          judul: "Doa Sebelum Belajar",
          arab: "رَبِّ زِدْنِيْ عِلْمًا وَارْزُقْنِيْ فَهْمًا",
          latin: "Robbi zidnii 'ilman warzuqnii fahman",
          arti: "Ya Tuhanku, tambahkanlah kepadaku ilmu dan berikanlah aku karunia untuk dapat memahaminya."
        },
        {
          judul: "Doa Mohon Ilmu Bermanfaat",
          arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
          latin: "Allahumma innii as-aluka 'ilman naafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan",
          arti: "Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima."
        },
        {
          judul: "Doa Setelah Belajar",
          arab: "اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَارْزُقْنَا اجْتِنَابَهُ",
          latin: "Allahumma arinal haqqa haqqan warzuqnat tibaa'ah, wa arinal baathila baathilan warzuqnaj tinaabah",
          arti: "Ya Allah, tunjukkanlah kepada kami yang benar itu benar dan karuniakanlah kami kekuatan untuk mengikutinya, dan tunjukkanlah kepada kami yang batil itu batil dan karuniakanlah kami kekuatan untuk menjauhinya."
        }
      ] 
    },
    { 
      id: "d11", 
      nama: "Doa Wudhu", 
      tipe: "doa", 
      jumlah: 2, 
      list: [
        {
          judul: "Niat Wudhu",
          arab: "نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْاَصْغَرِ فَرْضًا لِلّٰهِ تَعَالَى",
          latin: "Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhan lillaahi ta'aalaa",
          arti: "Aku niat berwudhu untuk menghilangkan hadas kecil, fardu karena Allah Ta'ala."
        },
        {
          judul: "Doa Setelah Wudhu",
          arab: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
          latin: "Asyhadu allaa ilaaha illallahu wahdahuu laa syariikalahu, wa asyhadu anna Muhammadan 'abduhuu wa rasuuluh. Allahummaj 'alnii minat tawwaabiina waj'alnii minal mutathahhiriin",
          arti: "Aku bersaksi tiada Tuhan melainkan Allah dan tiada sekutu bagi-Nya, dan aku bersaksi bahwa Nabi Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku orang yang bertaubat dan jadikanlah aku orang yang suci."
        }
      ] 
    },
    { 
        id: "d14", 
        nama: "Doa Shalat", 
        tipe: "doa", 
        jumlah: 20, 
        list: [
          {
            judul: "1. Doa Usai Shalat Fardhu",
            arab: "أَسْتَغْفِرُ اللهَ الْعَظِـيْمَ لِيْ وَلِوَالِدَيَّ وَلِأَصْحَابِ الْحُقُوْقِ عَلَيَّ وَلِجَمِيْعِ الْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ ×٣\n\nلَاإِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ ×٣\n\nاَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ وَإِلَيْكَ يَعُوْدُ السَّلَامُ فَحَيِّنَا رَبَّنَا بِالسَّلَامِ وَأَدْخِلْنَا الْـجَنَّةَ دَارَ السَّلَامِ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ يَا ذَاالْـجَلَالِ وَاْلإِكْرَامِ\n\nأَعُوْذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ. بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ، الرَّحْمٰنِ الرَّحِيْمِۙ، مٰلِكِ يَوْمِ الدِّيْنِۗ، اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ، اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَۙ، صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ەۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ. اٰمِيْن\n\nوَإِلٰهُكُمْ إِلٰهٌ وَاحِدٌ لَا إِلٰهَ إِلَّا هُوَ الرَّحْمٰنُ الرَّحِيْمُ\n\nاَللّٰهُ لَآ اِلٰهَ اِلَّا هُوَۚ اَلْحَيُّ الْقَيُّوْمُ ەۚ لَا تَأْخُذُهٗ سِنَةٌ وَّلَا نَوْمٌۗ لَهٗ مَا فِى السَّمٰوٰتِ وَمَا فِى الْاَرْضِۗ مَنْ ذَا الَّذِيْ يَشْفَعُ عِنْدَهٗٓ اِلَّا بِاِذْنِهٖۗ يَعْلَمُ مَا بَيْنَ اَيْدِيْهِمْ وَمَا خَلْفَهُمْۚ وَلَا يُحِيْطُوْنَ بِشَيْءٍ مِّنْ عِلْمِهٖٓ اِلَّا بِمَا شَاۤءَۚ وَسِعَ كُرْسِيُّهُ السَّمٰوٰتِ وَالْاَرْضَۚ وَلَا يَـُٔوْدُهٗ حِفْظُهُمَاۚ وَهُوَ الْعَلِيُّ الْعَظِيْمُ\n\nشَهِدَ اللهُ أَنَّهُ لَا إِلٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ، لَا إِلٰهَ إِلَّا هُوَ الْعَزِيزُ الْحَكِيمُ، إِنَّ الدِّينَ عِنْدَ اللّٰهِ الْإِسْلَامُ، قُلِ اللّٰهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَنْ تَشَاءُ وَتَنْزِعُ الْمُلْكَ مِمَّنْ تَشَاءُ وَتُعِزُّ مَنْ تَشَاءُ وَتُذِلُّ مَنْ تَشَاءُ، بِيَدِكَ الْخَيْرُ، إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. تُوْلِجُ اللَّيْلَ فِي النَّهَارِ وَتُوْلِجُ النَّهَارَ فِي اللَّيْلِ، وَتُخْرِجُ الْحَيَّ مِنَ الْمَيِّتِ وَتُخْرِجُ الْمَيِّتَ مِنَ الْحَيِّ، وَتَرْزُقُ مَنْ تَشَاءُ بِغَيْرِ حِسَابٍ\n\nسُبْحَانَ اللهِ ×٣٣ اَلْحَمْدُ لِلّٰهِ ×٣٣ اَللهُ أَكْبَرُ ×٣٣\n\nاَللهُ أَكْبَرُ كَبِيْرًا وَالْحَمْدُ لِلّٰهِ كَثِيْرًا وَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيْلًا، لَاإِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ، لَاحَوْلَ وَلَاقُوَّةَ إِلَّابِاللهِ الْعَلِـيِّ الْعَظِيْمِ\n\nاَللّٰهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا هَادِيَ لِمَا أَضْلَلْتَ، وَلَا مُبَدِّلَ لِمَا حَكَمْتَ، وَلَا رَآدَّ لِمَا قَضَيْتَ، وَلَا يَنْفَعُ ذَاالْجَدِّ مِنْكَ الْجَدُّ، لَاإِلٰهَ إِلَّا أَنْتَ\n\nاَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ عَبْدِكَ وَرَسُوْلِكَ النَّبِيِّ الْأُمِّـيِّ وَعَلى اٰلِهِ وَصَحْبِهِ وَسَلِّمْ\n\nوَحَسْبُنَا اللهُ وَنِعْمَ الْوَكِيْلُ، لَاحَوْلَ وَلَاقُوَّةَ إِلَّابِاللهِ الْعَلِيِّ الْعَظِيْمِ\n\nأَسْتَغْفِرُ اللهَ الْعَظِـيْمَ\n\nالدُّعَاءُ\n\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ. الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ حَمْدًا يُّوَافِيْ نِعَمَهُ وَ يُكَافِئُ مَزِيْدَهُ يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِيْ لِجَلَالِ وَجْهِكَ وَعَظِيْمِ سُلْطَانِكَ. اللّٰهُمَّ صَلِّ وسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَ آلِ سَيِّدِنَا مُحَمَّدٍ اَللّٰهُمَّ صَلِّ وَسَلِّمْ عَلٰى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنْجِيْنَا بِهَا مِنْ جَمِيْعِ الْأَهْوَالِ وَالْآفَاتِ وَتَقْضِيْ لَنَا بِهَا مِنْ جَمِيعِ الْحَاجَاتِ وَتُطَهِّرُنَا بِهَا مِنْ جَمِيْعِ السَيِّئَاتِ وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيْعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ\n\nاَللّٰهُمَّ إِنَّا نَسْأَلُكَ اللُّطْفَ فِيْمَا جَرَتْ بِهِ الْمَقَادِيْرُ. اَللّٰهُمَّ إِنَّا نَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ مِنْهُ سَيِّدُنَا مُحَـمَّدٌ عَبْدُكَ وَرَسُوْلُكَ. وَنَعُوْذُ بِكَ مِنْ شَرِّ مَا اسْتَعَاذَكَ مِنْهُ سَيِّدُنَا وَنَبِيُّنَا مُحَـمَّدٌ عَبْدُكَ وَرَسُوْلُكَ. اَللّٰهُمَّ إِنَّا نَسْأَلُكَ مُوْجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ وَالْغَنِيْمَةَ مِنْ كُلِّ بِرٍّ وَالْفَوْزَ بِالْجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ وَالْعَفْوَ عِنْدَ الْحِسَابِ. رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ. رَبَّنَا اغْفِرْ لَنَا وَلِوَالِدِيْنَا كَمَا رَبَّوْنَا صِغَارًا، وَلِجَمِيْعِ الْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ. رَبَّنَا اٰتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْاٰخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. وَصَلَّى اللهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَصَحْبِهِ وَسَلَّمَ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ",
            latin: "Astaghfirullâh al-`adhîm lî wa liwâlidayya wa li ash ḫâbil-huquq `alayya walijami`il-mu’minîna wal-mu’minâti wal-muslimîna wal-muslimâti al-aḫyâ’i wal-amwât(i) 3x\n\nLâ ilâha illallâhu waḫdahu lâ syarîka lah(u), lahul-mulku wa lahul-ḫamdu yuḫyî wayumîtu wa huwa ‘ala kulli syai’in qadîr(un) 3x\n\nAllâhumma antas-salâm(u) wa minkas-salam(u) wa ilaika ya`udus-salâm(u) faḫayyinâ rabbanâ bis-salam(i) wa adkhilnâl-jannata dâras-salam(i) tabârakta rabbanâ wa ta`alaita yâ dzal-jalâli wal-ikram(i)\n\nA`ûdzu billahi minasy-syaithânir-rajîm(i). Bismillâhir-raḫmânir-raḫîm(i). Al-ḫamdulillâhi rabbil-`âlamîn(a). Arraḫmânir-raḫîm. Mâliki yaumid-dîn(i). Iyyâka na`budu wa iyyâka nasta`în(u). Ihdinash-shirâtal-mustqîm(a). Shirâtal-ladzîna an`amta `alaihim ghairil-maghdûbi `alaihim wa lâdl-dlâllîn(a). âmîn\n\nWa ilâhukum ilahun wâḫidun lâ ilâha illa huwar-raḫmânur-raḫîm(u)\n\nLâ ilâha illa huwal-ḫayyul-qayyûmu lâ ta’khudzuhu sinatun wa lânaum(un). Lahu mâ fis-samâwâti wa mâ fil-ardl(i) man dzal-ladzî yasyfa`u `indahu illâ bi idznih(i). ya`lamu mâ baina aidîhim wa mâ khalfahum wa lâ yuḫîthûna bi syai’in min `ilmihi illâ bimâ syâ’a. wasi`a kursiyyuhus-samâwâti wal-ardla wa lâ ya’ûduhu ḫifdhuhumâ wa huwal-`aliyyul-`adhim\n\nSyahidallâhu annahu lâ ilâha illâ huwa wal-mala’ikatu wa ûlûl ilmi qâiman bil-qisth(i). lâ ilâha illâ huwal-`azizul hakîm(u). innad-dîna `indallâhil-islam(u). Qulillâhumma mâlikal-mulki tu’tîl-mulka man tasyâ’u wa tanzi`ul-mulka mimman tasyâ’u watu`izzu man tasyâ’u wa tudzillu man tasyâ’u biyadikal-khair(u). innaka `alâ kulli syai’in qadîr(un). Tûlijul-laila fin-nahâri wa tûlijun-nahâra fil-laili, wa tukhrijul-hayya minal-mayyiti wa tukhrijul-mayyita minal-hayyi, wa tarzuqu man tasyâ’u bighairi hisâb(in).\n\nSubhânallâh(i) 33x Al-hamdulillâh(i) 33x Allâhu akbar(u) 33x\n\nAllâhu akbaru kabîran wal-hamdulillâhi katsîran wa subhânallâhi bukratan wa ashîla(n). lâ ilâha illâhu wahdahu lâ syarîka lah(u). lahul-mulku walahul-hamdu yuhyî wa yumîtu wa huwa `ala kulli syai’in qadîr(un). Lâ haula wa lâ quwwata illâ billâhil-`aliyyil-adhîm(i)\n\nAllâhumma lâ mâni`a limâ a`thaita, wa lâ mu`tiya limâ mana`ta, wa lâ hâdiya limâ adl-lalta, wa lâ mubaddila limâ hakamta, wa lâ râdda limâ qadaita, wa lâ yanfa`u dzal-jaddi minkal-jad(u), lâ ilâha illâ anta\n\nAllâhumma shalli `ala sayyidinâ Muhammadin `abdika wa rasûlikan-nabiyyil-ummiyyi wa `ala âlihi wa shahbihi wa sallam\n\nWa hasbunâllâhu wa ni`mal wakîl(u), lâ haula wa lâ quwwata illâ billâhil-`aliyyil `adhîm(i)\n\nAstaghfirullâh al-`adhîm(i)\n\nBismillâhir-rahmânir-rahîm(i). Al-ḫamdulillâhi rabbil-`âlamîn(a), ḫamdan yuwâfî ni`amahu wa yukâfi’u mazîdahu yâ rabbanâ lakal-ḫamdu kamâ yanbaghî lijalâli wajhika wa `adhimi sulthânik(a). Allâhumma shalli wa sallim `ala sayyidinâ Muḫammadin wa âlihi sayyidinâ Muḫammad(in). Allâhumma shalli wa sallim `ala sayyidinâ Muḫammadin shalâtan tunjînâ bihâ min jamî`il-ahwâli wal-âfâti wa taqdî lanâ bihâ min jamî’il-ḫâjâti wa tuthahhirunâ bihâ min jamî`is-sayyi’ati wa tarfa`unâ bihâ `indaka a`lad-darajâti wa tuballighunâ bihâ aqshal-ghâyâti min jamî`il-khairâti fil-ḫayâti wa ba`dal-mamât(i).\n\nAllâḫumma innâ nas’alukal-luthfa fîmâ jarat bihil-maqâdîru. Allâhumma innâ nas’aluka min khairi mâ sa’alaka minhu sayyidinâ Muḫammadun `abduka wa rasûluka. Allâhumma innâ nas’aluka mûjibâti raḫmatikâ wa `azâ’ima maghfiratika was-salâmata min kulli itsmin wal-ghanîmata min kulli birrin wal-fauza bil-jannati wan-najâta minan-nâri wal-`afwa `indal-ḫisâb(i). rabbanâ lâ tuzigh qulûbanâ ba`da idz hadaitanâ wa hab lanâ min ladunka raḫmatan innaka antal-wahhâb(u). rabbanâgh-fir lanâ wa liwâlidînâ kamâ rabbaunâ shighâra(n). wa lijamî`il-mu’minîna wal-mu’minâti wal-muslimîna wal-muslimâtil-ahyâ’i minhum wal-amwâti. Rabbanâ âtinâ fid-dunyâ ḫasanatan wa fil-âkhirati ḫasanatanwa qinâ `adzaban-nâri. Wa shallallâhu `ala sayyidinâ Muḫammadin wa `ala âlihi wa shaḫbihi wa sallama wal-ḫamdulillâhi rabbil-`âlamîn(a).",
            arti: "Aku memohon ampunan kepada Allah yang Mahaagung, untuk diriku sendiri, kedua orang tuaku, sahabat-sahabat yang aku masih memiliki hak atasku, semua kaum mukmin dan muslim, baik yang ‎masih hidup ataupun yang telah wafat.\n\nTiada Tuhan yang haq disembah kecuali Allah semata, tiada sekutu baginya. Hanya milik-Nya segala kerajaan dan hanya milik-Nya segala puji, Dzat yang menghidupkan dan yang mematikan. Dialah Dzat yang kuasa atas segala sesuatu.\n\nYa Allah Engkaulah Dzat yang memberi keselamatan (kesejahteraan), dari-Mu keselamatan (kesejahteraan) datang, dan kepadamu segala keselamatan (kesejahteraan) itu kembali. Maka hidupkanlah kami ya Allah dengan selamat (sejahtera), masukkan kami ke dalam surga rumah keselamatan (kesejahteraan), Engkaulah Dzat yang Mahasuci, wahai Tuhan kami, dan Engkaulah Dzat yang Mahaluhur, wahai Tuhan yang memiliki keagungan dan kemuliaan.\n\nAku berlindung kepada Allah dari setan yang terlontar. Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang maha pengasih lagi maha penyayang. Yang menguasai hari pembalasan. Hanya kepada-Mu kami menyembah. Hanya kepada-Mu pula kami memohon pertolongan. Tunjukkanlah kami ke jalan yang lurus, yaitu jalan orang-orang yang telah Kauanugerahi nikmat kepada mereka, bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat. Amin.\n\nTuhanmu adalah Tuhan Yang Mahatunggal. Tiada tuhan selain Dia yang Maha Pengasih lagi Maha Penyayang.\n\nAllah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar.\n\nAllah menyatakan bahwasanya tidak ada Tuhan melainkan Dia (yang berhak disembah), Yang menegakkan keadilan. Para Malaikat dan orang-orang yang berilmu (juga menyatakan yang demikian itu). Tak ada Tuhan melainkan Dia (yang berhak disembah), Yang Maha Perkasa lagi Maha Bijaksana. Sesungguhnya agama di sisi Allah ialah Islam. Wahai Tuhan pemilik kekuasaan, Engkau berikan kekuasaan kepada siapa pun yang Engkau kehendaki, dan Engkau cabut kekuasaan dari siapa pun yang Engkau kehendaki. Engkau muliakan siapa pun yang Engkau kehendaki dan Engkau hinakan siapa pun yang Engkau kehendaki. Di tangan Engkaulah segala kebajikan. Sungguh, Engkau Mahakuasa atas segala sesuatu. Engkau masukkan malam ke dalam siang dan Engkau masukkan siang ke dalam malam. Dan Engkau keluarkan yang hidup dari yang mati, dan Engkau keluarkan yang mati dari yang hidup. Dan Engkau berikan rezeki kepada siapa yang Engkau kehendaki tanpa perhitungan.\n\nMahasuci Allah (33x) Segala puji bagi Allah (33x) Allah Mahabesar (33x)\n\nAllah Mahabesar dengan segala kebesaran, segala puji bagi Allah dengan pujian yang banyak, Mahasuci Allah, baik waktu pagi maupun sore. Tiada Tuhan yang haq disembah kecuali Allah semata, tiada sekutu baginya. Hanya milikinya segala kerajaan dan hanya milikinya segala puji, Dzat yang menghidupkan dan yang mematikan. Dialah Dzat yang kuasa atas segala sesuatu. Tiada daya upaya dan kekuatan kecuali atas pertolongan Allah yang Mahatinggi dan Mahaagung.\n\nYa Allah tidak ada orang yang dapat mencegah apa yang Engkau berikan, dan tidak ada yang memberikan apa saja yang Engkau cegah, tidak ada yang bisa memberi petunjuk kepada apa saja yang Engkau sesatkan, tidak ada yang bisa mengganti apa yang Engkau putuskan, dan tidak ada yang menolak apa yang telah Engkau tentukan, dan tidak memberi manfaat kekayaan dan kemuliaan kepada pemiliknya, dari-Mulah segala kekayaan dan kemuliaan. Tidak ada tuhan selain Engkau.\n\nYa Allah, limpahkanlah rahmat dan keselamatan kepada junjungan kami Nabi Muhammad ﷺ, sebagai hamba dan utusan-Mu yang ummi, beserta keluarga dan sahabatnya\n\nCukuplah Allah menjadi penolong kami dan Allah adalah sebaik-baik yang diserahi. Tiada daya dan tiada kekuatan melainkan dengan pertolongan Allah yang Mahatinggi dan Mahaagung.\n\nAku memohon ampun kepada Allah yang Mahaagung.\n\nDengan nama Allah yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam, dengan pujian yang sesuai dengan nikmatnya dan memungkinkan ditambah nikmatnya. Wahai Tuhan kami, hanya bagi-Mu segala puji, sebagaimana yang patut bagi keagungan-Mu dan kebesaran kekuasaan-Mu. Ya Allah, limpahkanlah rahmat kepada junjungan kami Baginda Muhammad, yang dengan shalawat itu Engkau selamatkan kami dari semua keadaan yang menakutkan dan dari semua cobaan, Engkau penuhi semua kebutuhan kami, Engkau bersihkan kami dari segala kejelekan, Engkau angkat kami ke derajat paling tinggi, dan Engkau sampaikan kami kepada tujuan yang paling sempurna dari semua kebaikan, ketika hidup dan setelah mati.\n\nYa Allah, kami memohon kepada-Mu kelembutan setiap kali berlaku takdir-Mu. Ya Allah, kami memohon sesuatu terbaik yang pernah dimohonkan kepada-Mu oleh Baginda Muhammad, hamba dan rasul-Mu, dan kami berlindung dari sesuatu terburuk yang pernah dimohon-jauhkan kepada-Mu oleh Baginda Nabi Muhammad, hamba dan rasul-Mu. Ya Allah sesungguhnya kami memohon hal-hal yang mendatangkan rahmat-Mu, jimat ampunanmu, selamat dari setiap dosa, keuntungan dari setiap kebaikan, kebahagiaan surga, keselamatan dari api neraka, serta pengampunan saat hari perhitungan. Ya Tuhan kami, janganlah Engkau jadikan hati kami condong (kepada kesesatan) sesudah Engkau beri petunjuk kepada kami. Karuniakanlah kepada kami rahmat dari sisi Engkau; karena sesungguhnya Engkau-lah Maha Pemberi (karunia). Ya Tuhan kami, ampunilah kami, dan orang tua kami sebagaimana mereka merawat kami saat masih kecil. Juga ampunilah seluruh kaum mukmin dan muslim, baik yang masih hidup maupun sudah wafat. Wahai Tuhan kami, berilah kami kebaikan hidup di dunia dan kebaikan hidup di akhirat, dan jagalah kami dari siksa api neraka. Semoga Allah melimpahkan rahmat dan keselamatan kepada Baginda Nabi Muhammad, keluarga, dan para sahabatnya. Segala puji bagi Allah, Tuhan seluruh keberadaan."
          },
          {
            judul: "2. Doa Usai Shalat Dhuha",
            arab: "اَللّٰهُمَّ إِنَّ الضَّحَآءَ ضَحَاءُكَ، وَالْبَهَاءَ بَهَاءُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ. اَللّٰهُمَّ إِنْ كَانَ رِزْقِيْ فِي السَّمَآءِ فَأَنْزِلْهُ وَإِنْ كَانَ فِي اْلأَرْضِ فَأَخْرِجْهُ وَإِنْ كَانَ مُعْسِرًا (مُعَسَّرًا) فَيَسِّرْهُ وَإِنْ كَانَ حَرَامًا فَطَهِّرْهُ وَإِنْ كَانَ بَعِيْدًا فَقَرِّبْهُ بِحَقِّ ضَحَاءِكَ وَبَهَاءِكَ وَجَمَالِكَ وَقُوَّتِكَ وَقُدْرَتِكَ آتِنِيْ مَآ اَتَيْتَ عِبَادَكَ الصَّالِحِيْنَ",
            latin: "Allâhumma innad dlaḫâ’a dlaḫâ’uka, wal bahâ’a bahâ’uka, wal jamâla jamâluka, wal quwwata quwwatuka, wal qudrata qudratuka, wal ishmata ishmatuka. Allâhuma in kâna rizqî fis samâ’i fa anzilhu, wa inkâna fil ardhi fa akhrijhu, wa inkâna mu’siran (mu‘assaran) fa yassirhu, wa in kâna ḫarâman fa thahhirhu, wa inkâna ba‘îdan fa qarribhu, bi ḫaqqi dlaḫâ’ika wa bahâ’ika wa jamâlika wa quwwatika wa qudratika âtinî mâ ataita ‘ibâdakas shâliḫîn.",
            arti: "Wahai Tuhanku, sungguh dhuha ini adalah dhuha-Mu, keagungan ini adalah keagungan-Mu, keindahan ini adalah keindahan-Mu, kekuatan ini adalah kekuatan-Mu, kuasa ini adalah kuasa-Mu, dan penjagaan ini adalah penjagaan-Mu.Wahai Tuhanku, jika rezekiku berada di atas langit maka turunkanlah. Jika berada di dalam bumi maka keluarkanlah. Jika sukar atau dipersulit (kudapat), mudahkanlah. Jika (tercampur tanpa sengaja dengan yang) haram, sucikanlah. Jika jauh, dekatkanlah. Dengan hak dhuha, keelokan, keindahan, kekuatan, dan kekuasaan-Mu, datangkanlah padaku apa yang Engkau datangkan kepada para hamba-Mu yang saleh."
          },
          {
            judul: "3. Doa Usai Shalat Tahajud",
            arab: "اَللّٰهُمَّ رَبَّنَا لَكَ الْحَمْدُ أَنْتَ قَيُّوْمُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيْهِنَّ. وَلَكَ الْحَمْدُ أَنْتَ مَلِكُ السَّمَوَاتِ والْأَرْضِ وَمَنْ فِيْهِنَّ. وَلَكَ الْحَمْدُ أَنْتَ نُوْرُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيْهِنَّ. وَلَكَ الْحَمْدُ أَنْتَ الْحَقُّ وَوَعْدُكَ الْحَقُّ وَلِقَاءُكَ حَقٌّ وَقَوْلُكَ حَقٌّ وَالْجَنَّةُ حَقٌّ وَالنَّارُ حَقٌّ وَالنَّبِيُّوْنَ حَقٌّ وَمُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ حَقٌّ وَالسَّاعَةُ حَقٌّ. اَللّٰهُمَّ لَكَ أَسْلَمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَإِلَيْكَ أَنَبْتُ وَبِكَ خَاصَمْتُ وَإِلَيْكَ حَاكَمْتُ فَاغْفِرْلِيْ مَاقَدَّمْتُ وَمَا أَخَّرْتُ وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّيْ. أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ لَا إِلٰهَ إِلَّا أَنْتَ. وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
            latin: "Allâhumma rabbanâ lakal ḫamdu. Anta qayyûmus samâwâti wal ardli wa man fî hinna. Wa lakal ḫamdu anta malikus samâwâti wal ardli wa man fî hinna. Wa lakal ḫamdu anta nûrus samâwâti wal ardli wa man fî hinna. Wa lakal ḫamdu antal ḫaq. Wa wa‘dukal ḫaq. Wa liqâ’uka ḫaq. Wa qauluka ḫaq. Wal jannatu ḫaq. Wan nâru ḫaq. Wan nabiyyûna ḫaq. Wa Muḫammadun shallallâhu ‘alaihi wasallama ḫaq. Was sâ‘atu ḫaq. Allâhumma laka aslamtu. Wa bika âmantu. Wa ‘alaika tawakkaltu. Wa ilaika anabtu. Wa bika khâshamtu. Wa ilaika ḫâkamtu. Fagfirlî mâ qaddamtu, wa mâ akhkhartu, wa mâ asrartu, wa mâ a‘lantu, wa mâ anta a‘lamu bihî minnî. Antal muqaddimu wa antal mu’akhkhiru. Lâ ilâha illâ anta. Wa lâ ḫaula, wa lâ quwwata illâ billâh",
            arti: "Ya Allah, Tuhan kami, segala puji bagi-Mu, Engkau penegak langit, bumi, dan makhluk yang ada di dalamnya. Segala puji bagi-Mu, Engkau penguasa langit, bumi, dan makhluk yang ada di dalamnya. Segala puji bagi-Mu, Engkau cahaya langit, bumi, dan makhluk yang ada di dalamnya. Segala puji bagi-Mu, Engkau Maha Benar. Janji-Mu benar. Pertemuan dengan-Mu kelak itu benar. Firman-Mu benar adanya. Surga itu nyata. Neraka pun demikian. Para nabi itu benar. Demikian pula Nabi Muhammad SAW itu benar. Hari Kiamat itu benar. Ya Tuhanku, hanya kepada-Mu aku berserah. Hanya kepada-Mu juga aku beriman. Kepada-Mu aku pasrah. Hanya kepada-Mu aku kembali. Karena-Mu aku rela bertikai. Hanya pada-Mu dasar putusanku. Karenanya ampuni dosaku yang telah lalu dan yang terkemudian, dosa yang kusembunyikan dan yang kunyatakan, dan dosa lain yang lebih Kau ketahui ketimbang aku. Engkau Yang Maha Terdahulu dan Engkau Yang Maha Terkemudian. Tiada Tuhan selain Engkau. Tiada daya upaya dan kekuatan selain pertolongan Allah."
          },
          {
            judul: "4. Doa Usai Shalat Hajat",
            arab: "لَا إِلٰهَ إِلَّا اللهُ الْحَلِيْمُ الْكَرِيْمُ، سُبْحَانَ اللهِ رَبِّ الْعَرْشِ الْعَظِيْمِ، اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ، أَسْأَلُكَ مُوْجِبَاتِ رَحْمَتِكَ، وَعَزَائِمَ مَغْفِرَتِكَ، وَالْغَنِيْمَةَ مِنْ كُلِّ بِرٍّ، وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ، لَا تَدَعْ لِيْ ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا حَاجَةً هِيَ لَكَ رِضًا إِلَّا قَضَيْتَهَا يَا أَرْحَمَ الرَّاحِمِيْنَ",
            latin: "Lâ ilâha illallâhul ḫalîmul karîm. Subḫânallâhi rabbil ‘arsyil ‘adhîm. Alḫamdulillâhi rabbil ‘âlamîn. As’aluka mûjibâti raḫmatik, wa ‘azâ’ima maghfiratik, wal ghanîmata min kulli birrin, was salâmata min kulli itsmin. La tada‘ lî dzanban illâ ghafartah, wa lâ hamman illâ farrajtah, wa lâ hâjatan hiya laka ridhan illâ qadhaitahâ yâ arḫamar râḫimîn.",
            arti: "Tiada Tuhan selain Allah yang maha lembut dan maha mulia. Mahasuci Allah, penjaga Arasy yang agung. Segala puji bagi Allah, Tuhan alam semesta. Aku mohon kepada-Mu bimbingan amal sesuai rahmat-Mu, ketetapan ampunan-Mu, kesempatan meraih sebanyak kebaikan, dan perlindungan dari segala dosa. Jangan Kau biarkan satu dosa yang ada padaku kecuali Engkau mengampuninya. Jangan pula Kau biarkan kebimbangan ada padaku, kecuali Engkau membebaskannya. Jangan pula Kau biarkan suatu kebutuhan yang sesuai ridha-Mu kecuali Engkau memenuhinya. Wahai Tuhan yang maha pengasih."
          },
          {
            judul: "5. Doa Usai Shalat Istikharah",
            arab: "اَللّٰهُمَّ إِنِّيْ أَسْتَخِيْرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيْمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوْبِ، اَللّٰهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ ....... خَيْرٌ لِيْ فِيْ دِيْنِيْ وَمَعَاشِيْ وَعَاقِبَةِ أَمْرِيْ فَاقْدُرْهُ لِيْ وَيَسِّرْهُ لِيْ ثُمَّ بَارِكْ لِيْ فِيْهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِيْ فِيْ دِيْنِيْ وَدُنْيَايَ وَمَعَاشِيْ وَعَاقِبَةِ أَمْرِيْ عَاجِلِهِ وَاٰجِلِهِ فَاصْرِفْهُ عَنِّيْ وَاصْرِفْنِيْ عَنْهُ وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ رَضِّنِيْ بِهِ",
            latin: "Allâhumma innî astakhîruka bi’ilmika, wa astaqdiruka biqudratika, wa as’aluka min fadllikal ‘adhîmi, fainnaka taqdiru wa lâ aqdiru, wa ta’lamu wa lâ a’lamu, wa anta allâmul ghuyûb. Allâhumma in kunta ta’lamu anna hâdzal amra ...... khairun lî fî dînî wa ma’âsyî wa ‘âqibati amrî faqdurhû lî wa yassirhû lî tsumma bârik lî fîhi. Wa in kunta ta’lamu anna hâdzal amra syarrun lî fî dînî wa dunyâya wa ma’âsyî wa ‘âqibati amrî ‘âjilihî wa âjilihî fashrifhu ‘annî washrifnî ‘anhu waqdur liyal khaira ḫaitsu kâna tsuma radldlinî bihî.",
            arti: "Ya Allah, sungguh aku meminta pilihan yang tepat kepada-Mu dengan ilmu pengetahuan-Mu dan aku mohon kuasa-Mu (atas masalahku) dengan kuasa-Mu. Aku mohon sebagian dari karunia-Mu yang agung karena sungguh Engkau Mahakuasa, sedang aku tidak kuasa, Engkau mengetahui, sedang aku tidak mengetahuinya. Engkau maha mengetahui hal yang gaib. Ya Allah, apabila Engkau mengetahui bahwa urusan ini (sebutkan masalah yang dihadapinya) lebih baik dalam agamaku, kehidupanku, dan akibatnya terhadap diriku, takdirkan ia untukku, mudahkan jalannya, dan berilah berkah. Sebaliknya, jika Engkau mengetahui bahwa persoalan ini lebih berbahaya bagiku dalam agama, dunia, kehidupan, dan akibatnya terhadap diriku baik seketika maupun suatu ketika nanti, maka singkirkan persoalan itu, dan jauhkan aku darinya. Takdirkanlah bagiku kebaikan di mana saja berada, dan berilah ridha-Mu untukku."
          },
          {
            judul: "6. Doa Usai Shalat Taubat",
            arab: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُوْنَنَّ مِنَ الْخَاسِرِيْنَ\n\nلَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّيْ كُنْتُ مِنَ الظَّالِمِيْنَ\n\nاَللّٰهُمَّ اغْفِرْ لِيْ خَطِيْئَتِيْ وَجَهْلِيْ، وَإِسْرَافِيْ فِيْ أَمْرِيْ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّيْ، اَللّٰهُمَّ اغْفِرْ لِيْ جِدِّيْ وَهَزْلِيْ؛ وَخَطَئِيْ وَعَمْدِيْ؛ وَكُلُّ ذٰلِكَ عِنْدِيْ، اَللّٰهُمَّ اغْفِرْ لِيْ مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّيْ، أَنْتَ الْمُقَدِّمُ، وَأَنْتَ الْمُؤَخِّرُ، وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ",
            latin: "Rabbanâ zhalamnâ anfusanâ wa illam taghfir lanâ wa tarḫamnâ lanakûnanna minal khâsirîn.\n\nLâ ilâha illâ anta. Subḫânaka innî kuntu minadh dhâlimîn.\n\nAllâhummaghfir lî khathî’atî wa jahlî, wa isrâfî fî amrî, wa mâ anta a‘lamu bihî minnî. Allâhummaghfir lî jiddî wa hazlî, wa khatha’î wa ‘amdî. Wa kullu dzâlika ‘indî. Allâhummaghfir lî mâ qaddamtu wa mâ akhkhartu, wa mâ asrartu, wa mâ a‘lantu, wa mâ anta a‘lamu bihî minnî. Antal muqaddimu wa antal mu’akhkhiru, wa anta ‘alâ kulli syai’in qadîr.",
            arti: "Wahai Tuhan kami, kami telah menganiaya diri sendiri. Jika Engkau tidak mengampuni dan menyayangi kami, niscaya kami termasuk hamba-Mu yang merugi.\n\nTiada tuhan selain Engkau. Maha suci Engkau, sesungguhnya aku termasuk orang-orang yang berbuat aniaya.\n\nTuhanku, ampunilah kekeliruan dan kebodohanku, kelewatanbatasku dalam sebuah hal, dan dosaku yang mana Engkau lebih tahu dariku. Tuhanku, ampunilah dosaku dalam serius dan gurauanku, kekeliruan dan kesengajaanku. Apa pun itu semua berasal dariku. Tuhanku, ampunilah dosaku yang terdahulu dan terkemudian, dosa yang kusembunyikan dan kunyatakan, dan dosa yang mana Kau lebih tahu dariku. Kau maha terdahulu. Kau maha terkemudian. Kau maha kuasa ata segala sesuatu."
          },
          {
            judul: "7. Doa Usai Shalat Tarawih",
            arab: "اَللّٰهُمَّ اجْعَلْنَا بِالْإِيْمَانِ كَامِلِيْنَ، وَلِلْفَرَائِضِ مُؤَدِّيْنَ، وَلِلصَّلَاةِ حَافِظِيْنَ، وَلِلزَّكَاةِ فَاعِلِيْنَ، وَلِمَا عِنْدَكَ طَالِبِيْنَ، وَلِعَفْوِكَ رَاجِيْنَ، وَبِالْهُدَى مُتَمَسِّكِيْنَ، وَعَنِ اللَّغْوِ مُعْرِضِيْنَ، وَفِي الدُّنْيَا زَاهِدِيْنَ، وَفِي الْاٰخِرَةِ رَاغِبِيْنَ، وَبِالْقَضَاءِ رَاضِيْنَ، وَلِلنَّعْمَاءِ شَاكِرِيْنَ، وَعَلَى الْبَلَاءِ صَابِرِيْنَ، وَتَحْتَ لِوَاءِ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَوْمَ الْقِيَامَةِ سَائِرِيْنَ، وَعَلَى الْحَوْضِ وَارِدِيْنَ، وَإِلَى الْجَنَّةِ دَاخِلِيْنَ، وَمِنَ النَّارِ نَاجِيْنَ، وَعَلَى سَرِيْرِ الْكَرَامَةِ قَاعِدِيْنَ، وَبِحُوْرٍعِيْنٍ مُتَزَوِّجِيْنَ، وَمِنْ سُنْدُسٍ وَاِسْتَبْرَقٍ وَدِيْبَاجٍ مُتَلَبِّسِيْنَ، وَمِنْ طَعَامِ الْجَنَّةِ اٰكِلِيْنَ، وَمِنْ لَبَنٍ وَعَسَلٍ مُصَفًّى شَارِبِيْنَ، بِأَكْوَابٍ وَّأَبَارِيْقَ وَكَأْسٍ مِّنْ مَعِيْنٍ مَعَ الَّذِيْنَ أَنْعَمْتَ عَلَيْهِمْ مِنَ النَّبِيِّيْنَ وَالصِّدِّيْقِيْنَ وَالشُّهَدَاءِ وَالصَّالِحِيْنَ وَحَسُنَ أُولٰئِكَ رَفِيْقًا، ذٰلِكَ الْفَضْلُ مِنَ اللهِ وَكَفَى بِاللهِ عَلِيْمًا، اَللّٰهُمَّ اجْعَلْنَا فِي هٰذِهِ لَيْلَةِ الشَّهْرِ الشَّرِيْفَةِ الْمُبَارَكَةِ مِنَ السُّعَدَاءِ الْمَقْبُوْلِيْنَ، وَلَا تَجْعَلْنَا مِنَ اْلأَشْقِيَاءِ الْمَرْدُوْدِيْنَ، وَصَلَّى اللهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَاٰلِه وَصَحْبِهِ أَجْمَعِيْنَ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِيْنَ، وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ",
            latin: "Allâhummaj‘alnâ bil îmâni kâmilîn. Wa lil farâidli muaddîn. Wa lish-shâlâti ḫâfidhîn. Wa liz-zakâti fâ‘ilîn. Wa lima ‘indaka thâlibîn. Wa li ‘afwika râjîn. Wa bil-hudâ mutamassikîn. Wa ‘anil laghwi mu‘ridlîn. Wa fid-dunyâ zâhdîn. Wa fil ‘âkhirati râghibîn. Wa bil-qadlâ’I râdlîn. Wa lin na‘mâ’I syâkirîn. Wa ‘alal balâ’i shâbirîn. Wa taḫta liwâ’i muḫammadin shallallâhu ‘alaihi wasallam yaumal qiyâmati sâ’irîna wa 'alal ḫaudli wâridîn. Wa ilal jannati dâkhilîn. Wa minan nâri nâjîn. Wa 'alâ sarîril karâmati qâ'idîn. Wa bi ḫûrun 'in mutazawwijîn. Wa min sundusin wa istabraqîn wadîbâjin mutalabbisîn. Wa min tha‘âmil jannati âkilîn. Wa min labanin wa ‘asalin mushaffan syâribîn. Bi akwâbin wa abârîqa wa ka‘sin min ma‘în. Ma‘al ladzîna an‘amta ‘alaihim minan nabiyyîna wash shiddîqîna wasy syuhadâ’i wash shâliḫîna wa ḫasuna ulâ’ika rafîqan. Dâlikal fadl-lu minallâhi wa kafâ billâhi ‘alîman. Allâhummaj‘alnâ fî hâdzihi lailatisy syahrisy syarîfatil mubârakah minas su‘adâ’il maqbûlîn. Wa lâ taj‘alnâ minal asyqiyâ’il mardûdîn. Wa shallallâhu ‘alâ sayyidinâ muḫammadin wa âlihi wa shaḫbihi ajma‘în. Biraḫmatika yâ arḫamar râḫimîn wal ḫ​​​​​​amdulillâhi rabbil ‘âlamîn.",
            arti: "Yaa Allah, jadikanlah kami orang-orang yang sempurna imannya, yang memenuhi kewajiban-kewajiban, yang memelihara shalat, yang mengeluarkan zakat, yang mencari apa yang ada di sisi-Mu, yang mengharapkan ampunan-Mu, yang berpegang pada petunjuk, yang berpaling dari kebatilan, yang zuhud di dunia, yang menyenangi akhirat, yang ridha dengan qadla-Mu (ketentuan-Mu), yang mensyukuri nikmat, yang sabar atas segala musibah, yang berada di bawah panji-panji junjungan kami, Nabi Muhammad, pada hari kiamat, yang mengunjungi telaga (Nabi Muhammad), yang masuk ke dalam surga, yang selamat dari api neraka, yang duduk di atas ranjang kemuliaan, yang menikah dengan para bidadari, yang mengenakan berbagai sutra ,yang makan makanan surga, yang minum ssu dan madu murni dengan gelas, cangkir, dan cawan bersama orang-orang yang Engkau beri nikmat dari kalangan para nabi, shiddiqin, syuhada dan orang-orang shalih. Mereka itulah teman yang terbaik. Itulah keutamaan (anugerah) dari Allah, dan cukuplah bahwa Allah Maha Mengetahui. Ya Allah, jadikanlah kami pada malam yang mulia dan diberkahi ini termasuk orang-orang yang bahagia dan diterima amalnya, dan janganlah Engkau jadikan kami tergolong orang-orang yang celaka dan ditolak amalnya. Semoga Allah mencurahkan rahmat-Nya atas junjungan kami Muhammad, serta seluruh keluarga dan shahabat beliau. Berkat rahmat-Mu, wahai Yang Paling Penyayang di antara yang penyayang. Segala puji bagi Allah Tuhan semesta alam."
          },
          {
            judul: "8. Doa Usai Shalat Witir",
            arab: "سُبْحَانَ الْمَلِكِ الْقُدُّوْسِ ×٣\n\nسُبُّوْحٌ قُدُّوْسٌ رَبُّنَا وَرَبُّ الْمَلَائِكَةِ وَالرُّوْحِ\n\nأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ، أَسْتَغْفِرُ اللهَ، نَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ وَنَعُوْذُ بِكَ مِنْ سَخَطِكَ وَالنَّارِ ×٣\n\nاَللّٰهُمَّ إنَّكَ عَفُوٌّ كَرِيْمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنَّـــــا ×٣\n\nيَا كَرِيْمُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِيْنَ\n\nاَللّٰهُمَّ إنَّا نَعُوْذُ بِرِضَاكَ مِنْ سَخَطِكَ وَبِمُعَافَاتِكَ مِنْ عُقُوْبَتِكَ وَنَعُوْذُ بِكَ مِنْكَ لَا نُحْصِيْ ثَنَاءً عَلَيْكَ أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ\n\n﴿الدعاء﴾\n\nاَللّٰهُمَّ إِنَّا نَسْاَلُكَ إِيْمَانًا دَاِئمًا وَنَسْأَلُكَ قَلْبًا خَاشِعًا وَنَسْأَلُكَ عِلْمًا نَافِعًا وَنَسْأَلُكَ يَقِيْنًا صَــــادِقًا وَنَسْأَلُكَ عَمَلًا صَالِحًا وَنَسْأَلُكَ دِيْنًا قَيِّمًا وَنَسْأَلُكَ خَيْرًا كَثِيْرًا وَنَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ وَنَسْأَلُكَ تَمَامَ الْعَافِيَةِ وَنَسْأَلُكَ الشُّكْرَ عَلَى الْعَافِيَةِ وَنَسْأَلُكَ الْغِنَى عَنِ النَّــــاسِ. اَللّٰهُمَّ رَبَّنَا تَقَبَّلْ مِنَّا صَلَاتَنَا وَصِيَامَنَا وَقِيَامَنَا وَتَخَشُّعَنَا وَتَضَرُّعَنَا وَتَعَبُّدَنَا وَتَمِّمْ تَقْصِيْرَنَا يَــــــا اَللهُ يَاأَرْحَمَ الرَّاحِمِيْنَ وَصَلَّى اللهُ عَلَى خَيْرِ خَلْقِهِ سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَأَصْحَابِهِ أَجْمَعِيْنَ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ\n\nنَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانِ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى",
            latin: "Subḫânal malikil quddûs. (3x)\n\nSubbûḫun, quddûsun, rabbunâ wa rabbul malâ’ikati war rûḫ.\n\nAsyhadu an lâ ilâha illallââh. Astaghfirullâh. Nas’aluka ridhâka wal jannah, wa na‘ûdzu bika min sakhathika wan nâr. (3x)\n\nAllâhumma innaka ‘afuwwun karîmun tuḫibbul ‘afwa, fa‘fu ‘annâ. (3x)\n\nYâ karîmu, bi raḫmatika yâ arḫamar râḫimîna.\n\nAllâhumma inâ na‘ûdzu bi ridhâka min sakhathika, wa bi mu‘âfâtika min ‘uqûbatika. Wa na‘ûdzu bika minka, lâ nuḫshî tsanâ’an alayka anta kamâ atsnayta ‘alâ nafsika.\n\nAllâhumma innâ nasaluka îmânan dâiman wa nas-aluka qalban khâsyi‘an wan as-aluka ‘ilman nâfi‘an wan as-aluka yaqînan shâdiqan wan as-aluka ‘amalan shâliḫan wan as-aluka dînan qayyiman wan as-aluka khairan katsîran wan as-aluka-l-‘afwa wal ‘âfiyata wan as-aluka tamâmal ‘âfiyati wan as-aluka-sy-syukra ‘alal ‘âfiyati wan as-aluka-l-ghinâ ‘anin nâs. Allâhumma rabbanâ taqabbal minnâ shalâtanâ wa shiyâmanâ wa qiyâmanâ wa takhasyu‘anâ wa tadlarru‘anâ wa ta‘abbudanâ wa tammim taqshîranâ. Yâ Allâh yâ arḫamar râḫimîn wa shallallâhu ‘alâ khairi khalqihi sayyidinâ Muḫammadin wa ‘alâ âlihî wa ash-ḫâbihî ajma‘în wal ḫamdulillâhi rabbil ‘âlamîn\n\nNawaitu shauma ghadin ‘an adâ’i fardhi syahri ramadlâni hâdzihis sanati lillâhi ta‘âlâ",
            arti: "Mahasuci Tuhan yang kudus (3x)\n\nSuci dan qudus Tuhan kami, Tuhan para malaikat dan Jibril\n\nAku bersaksi bahwa tiada tuhan selain Allah. Aku memohon ampunan Allah. Kami memohon ridha dan surga-Mu. Kami juga berlindung kepada (rahmat)-Mu dari murka dan neraka-Mu. (3x)\n\nTuhanku, sungguh Kau maha pengampun lagi pemurah. Kau menyukai ampunan, oleh karenanya ampunilah kami.\n\nWahai Dzat yang maha pemurah, (aku memohon) atas berkat rahmat-Mu, wahai Dzat yang paling penyayang dari segenap penyayang.\n\nTuhanku, kami berlindung kepada ridha-Mu dari murka-Mu dan kepada afiat-Mu dari siksa-Mu. Kami meminta perlindungan-Mu dari murka-Mu. Kami tidak (sanggup) membilang pujian-Mu sebanyak Kau memuji diri-Mu sendiri\n\nYa Allah, kami mohon pada-Mu, iman yang langgeng, hati yang khusyuk, ilmu yang bermanfaat, keyakinan yang benar,amal yang saleh, agama yang lurus, kebaikan yang banyak.kami mohon kepada-Mu ampunan dan kesehatan, kesehatan yang sempurna, kami mohon kepada-Mu bersyukur atas karunia kesehatan, kami mohon kepada-Mu kecukupan terhadap sesama manusia. Ya Allah, tuhan kami terimalah dari kami: shalat, puasa, ibadah, kekhusyukan, rendah diri dan ibadah kami, dan sempurnakanlah segala kekurangan kami. Ya Allah, Tuhan yang Maha Pengasih dari segala yang pengasih. Dan semoga kesejahteraan dilimpahkan kepada makhluk-Nya yang terbaik, Nabi Muhammad, demikian pula keluarga dan para sahabatnya secara keseluruhan. Serta segala puji milik Allah Tuhan semesta alam.\n\nSaya niat berpuasa esok hari untuk menunaikan fardhu di bulan Ramadhan tahun ini, karena Allah ta‘ala."
          },
          {
            judul: "9. Doa Shalat Tasbih",
            arab: "اَللّٰهُمَّ إنِّي أَسْأَلُكَ تَوْفِيْقَ أَهْلِ الْهُدَى وَأَعْمَالَ أَهْلِ الْيَقِينِ وَمُنَاصَحَةَ أَهْلِ التَّوْبَةِ وَعَزْمَ أَهْلِ الصَّبْرِ وَوَجَلَ أَهْلِ الْخَشْيَةِ وَطَلَبَ أَهْلِ الرَّغْبَةِ وَتَعَبُّدَ أَهْلِ الْوَرَعِ وَعِرْفَانَ أَهْلِ الْعِلْمِ حَتَّى أَخَافَكَ\n\nاَللّٰهُمَّ إنِّي أَسْأَلُكَ مَخَافَةً تَحْجِزُنِيْ عَنْ مَعَاصِيْكَ حَتَّى أَعْمَلَ بِطَاعَتِكَ عَمَلًا أَسْتَحِقُّ بِهِ رِضَاكَ وَحَتَّى أُنَاصِحَكَ بِالتَّوْبَةِ خَوْفًا مِنْكَ حَتَّى أَخْلُصَ لَكَ النَّصِيحَةَ حَيَاءً مِنْكَ وَحَتَّى أَتَوَكَّلَ عَلَيْكَ فِي الْأُمُورِ كُلِّهَا وَحَتَّى أَكُوْنَ أُحْسِنَ الظَنَّ بِكَ، سُبْحَانَ خَالِقِ النُّورِ",
            latin: "Allâhumma innî as’aluka taufîqa ahlil hudâ, wa a‘mâla ahlil yaqîn, wa munâshahata ahlit taubah, wa ‘azma ahlis shabri, wa wajala ahlil khasyyah, wa thalaba ahlir raghbah, wa ta‘abbuda ahlil wara‘i, wa ‘irfâna ahlil ‘ilmi hattâ akhâfak\n\nAllâhumma innî as’aluka makhâfatan tahjizunî ‘an ma‘âshîka hattâ a‘mala bi thâ‘atika ‘amalan astahiqqu bihî ridhâka wa hattâ unâshihaka bit taubah, khaufan minka hattâ akhlusha lakan nashîhata hayâ’an minka wa hattâ atawakkala ‘alaika fil ’umûri kullihâ wa hattâ akûna ’uhsinuz zhanna bika, subhâna khâliqin nûr",
            arti: "Ya Allah, kepada-Mu aku meminta petunjuk mereka yang terima hidayah, amal-amal orang yang yakin, ketulusan mereka yang bertobat, keteguhan hati mereka yang bersabar, kekhawatiran mereka yang takut (kepada-Mu), doa mereka yang berharap, ibadah mereka yang wara’, dan kebijaksanaan mereka yang berilmu agar aku menjadi takut kepada-Mu.\n\nYa Allah, masukkanlah rasa takut di kalbuku yang dapat menghalangi diri ini untuk mendurhakai-Mu. Dengan demikian aku dapat beramal saleh yang mengantarkanku pada ridha-Mu, dan aku bertobat setulusnya karena takut kepada-Mu. Dengan itu pula aku beribadah secara tulus karena malu kepada-Mu. Dengan rasa takut itu aku menyerahkan segala urusanku kepada-Mu. Karena itu juga aku dapat berbaik sangka selalu kepada-Mu. Mahasuci Engkau Pencipta cahaya."
          },
          {
            judul: "10. Doa Qunut",
            arab: "اَللّٰهُمَّ اهْدِنِيْ فِيْمَنْ هَدَيْتَ، وَعَافِنِيْ فِيْمَنْ عَافَيْتَ، وَتَوَلَّنِيْ فِيْمَنْ تَوَلَّيْتَ، وَبَارِكْ لِيْ فِيْمَا أَعْطَيْتَ، وَقِنِيْ شَرَّمَا قَضَيْتَ، فَإِ نَّكَ تَقْضِيْ وَلَا يُقْضَى عَلَيْكَ وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ، وَصَلَّى اللهُ عَلَى سَيِّدِنَا مُحَمَّدٍ ࣙالنَّبِيِّ الْأُمِّيِّ وَعَلَى اٰلِهِ وَصَحْبِهِ وَبَارَكَ وَسَلَّمَ",
            latin: "Allahummahdinî fî man hadait, wa ‘âfinî fî man ‘âfait, wa tawallanî fî man tawallait, wa bâriklî fî mâ a‘thait, wa qinî syarra mâ qadhait, fa innaka taqdhî wa lâ yuqdhâ ‘alaik, wa innahû lâ yazillu man wâlait, wa lâ ya‘izzu man ‘âdait, tabârakta rabbanâ wa ta‘âlait, fa lakal ḫamdu a’lâ mâ qadhait, astaghfiruka wa atûbu ilaik, wa shallallâhu ‘alâ sayyidinâ muḫammadi-nin-nabiyyil ummiyyi wa ‘alâ âlihî wa shaḫbihî wa bâraka wa sallam.",
            arti: "Ya Allah tunjukanlah aku sebagaimana mereka yang telah Engkau beri petunjuk. Berilah kesehatan kepadaku sebagaimana mereka yang telah Engkau berikan kesehatan. Peliharalah aku sebagaimana orang-orang yang telah Engkau lindungi. Berikanlah keberkahan kepadaku pada apa yang telah Engkau berikan. Selamatkanlah aku dari bahaya kejahatan yang telah Engkau tentukan. Engkaulah yang menghukum dan bukan dihukum. Tidak hina orang yang Engkau jadikan pemimpin. Tidak mulia orang yang Engkau musuhi. Maha Suci Engkau wahai Tuhan kami dan Maha Tinggi Engkau. Bagi-Mu segala pujian di atas apa yang Engkau tentukan. Aku memohon ampun kepada-Mu dan bertaubat kepada-Mu. Semoga Allah mencurahkan rahmat, keselamatan, dan berkah atas junjungan kami Nabi Muhammad SAW, keluarga, dan para sahabatnya."
          },
          {
            judul: "11. Doa Iftitah",
            arab: "اَللّٰهُ أَكْبَرُ كَبِيْرًا وَّالْحَمْدُ لِلّٰهِ كَثِيْرًا وَّسُبْحَانَ اللّٰهِ بُكْرَةً وَّأَصِيْلًا، إِنِّيْ وَجَّهْتُ وَجْهِيَ لِلَّذِيْ فَطَرَ السَّمٰوَاتِ وَالْأَرْضَ حَنِيْفًا مُّسْلِمًا وَّمَا أَنَا مِنَ الْمُشْرِكِيْنَ، إِنَّ صَلَاتِيْ وَنُسُكِيْ وَمَحْيَايَ وَمَمَاتِيْ لِلّٰهِ رَبِّ الْعَالَمِيْنَ، لَا شَرِيْكَ لَهُ وَبِذٰلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِيْنَ",
            latin: "Allâhu akbar kabîrâ wal ḫamdu lillâhi katsîrâ wa subḫânallâhi bukrataw wa ashîlâ. Innî wajjahtu wajhiya lilladzî fatharas samâwâti wal ardla ḫanîfam muslimaw wamâ ana minal musyrikîn. Inna shalâtî wa nusukî wa maḫyâya wa mamâtî lillâhirabbil ‘âlamîn. Lâ syarîka lahû wa bidzâlika umirtu wa ana minal muslimîn",
            arti: "Allah Mahabesar, Mahasempurna kebesaran-Nya. Segala puji bagi Allah, pujian yang sebanyak-banyaknya. Mahasuci Allah sepanjang pagi dan petang. Kuhadapkan wajahku kepada Dzat yang telah menciptakan langit dan bumi dengan penuh ketulusan dan kepasrahan dan aku bukanlah termasuk orang-orang yang musyrik. Sesungguhnya shalatku, ibadahku, hidupku, dan matiku semuanya untuk Allah, penguasa alam semesta. Tidak ada sekutu bagi-Nya dan dengan demikianlah aku diperintahkan dan aku termasuk orang-orang Islam."
          },
          {
            judul: "12. Doa saat Ruku'",
            arab: "سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ ×٣",
            latin: "Subḫâna rabbiyal ‘adhîmi wa bi ḫamdih (3x)",
            arti: "Mahasuci Tuhanku Yang Mahaagung serta memujilah aku kepada-Nya. (3x)"
          },
          {
            judul: "13. Doa saat I'tidal",
            arab: "رَبَّنَا لَكَ الْحَمْدُ مِلْءُ السَّمَاوَاتِ وَمِلْءُ الْأَرْضِ وَمِلْءُ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ",
            latin: "Rabbanâ lakal ḫamdu mil’us samâwati wa mil‘ul ardli wa mil‘u mâ syi’ta min syai’in ba’du",
            arti: "Ya Allah Tuhan kami, bagi-Mu segala puji, sepenuh langit dan bumi dan sepenuh apa saja yang Engkau kehendaki sesudah itu."
          },
          {
            judul: "14. Doa saat Sujud",
            arab: "سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ ×٣",
            latin: "Subḫâna rabbiyal a‘lâ wa bi ḫamdih (3x)",
            arti: "Mahasuci Allah, serta memujilah aku kepada-Nya. (3x)"
          },
          {
            judul: "15. Doa Duduk di Antara Dua Sujud",
            arab: "رَبِّ اغْفِرْ لِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ وَارْفَعْنِيْ وَارْزُقْنِيْ وَاهْدِنِيْ وَعَافِنِيْ وَاعْفُ عَنِّيْ",
            latin: "Rabbighfirlî warḫamnî wajburnî warfa‘nî warzuqnî wahdinî wa ‘âfinî wa‘fu ‘annî",
            arti: "Ya Allah, ampunilah dosaku, belas kasihanilah aku, perbaikilah kesalahanku, angkatlah derajatku, berilah aku rezeki, anugerahilah aku petunjuk, karuniailah aku kesehatan, dan maafkanlah aku."
          },
          {
            judul: "16. Doa Tahiyat Awal",
            arab: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلّٰهِ، السَّلامُ عَلَيْكَ أيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَّسُوْلُ اللّٰهِ\n\nاَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ",
            latin: "Attahiyyâtul mubârakâtush shalâwatuth thayyibâtu lillâh. Assalâmu ‘alaika ayyuhan nabiyyu wa raḫmatullâhi wa barakâtuh. Assalâmu ‘alainâ wa‘alâ ‘ibadillâhish shâliḫîn. Asyhadu an lâilâha illallâh wa asyhadu anna muḫammadar rasûlullâh\n\nAllâhumma shalli ‘alâ sayyidinâ muḫammad",
            arti: "Segala kehormatan, keberkahan, rahmat, dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah dan berkah-Nya (tetap tercurahkan) atasmu, wahai Nabi (Muhammad). Semoga keselamatan (tetap terlimpahkan) atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tidak ada Tuhan selain Allah dan aku bersaksi bahwa Muhammad adalah utusan Allah.\n\nYa Allah, limpahkanlah rahmat kepada Nabi Muhammad."
          },
          {
            judul: "17. Doa Tahiyat Akhir",
            arab: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلّٰهِ، السَّلَامُ عَلَيْكَ أيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَّسُولُ اللّٰهِ\n\nاَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَّعَلَى اٰلِ سَيِّدِنَا مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا إِبْرَاهِيْمَ وَعَلَى اٰلِ سَيِّدِنَا إِبْرَاهِيْمَ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَّعَلَى اٰلِ سَيِّدِنَا مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى سَيّدِنَا إِبْرَاهِيْمَ وَعَلَى اٰلِ سَيِّدِنَا إِبْرَاهِيْمَ فِي الْعَالَمِيْنَ إنَّكَ حَمِيْدٌ مَّجِيْدٌ\n\nاَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ النَّارِ، وَمِنْ فِتْنَةِ الْمـحْيَا وَالْمَمَاتِ وَمِنْ فِتْنَةِ الْمَسِيْحِ الدَّجَّالِ\n\nيَا مُقَلِّبَ اْلقُلُوْبِ ثَبِّتْ قَلْبِيْ عَلَى دِيْنِكَ",
            latin: "Attahiyyâtul mubârakâtush shalawatuth thayyibâtu lillâh. Assalâmu ‘alaika ayyuhan nabiyyu waraḫmatullâhi wabarakâtuh. Assalâmu ‘alainâ wa ‘alâ ‘ibadadillâhish shâliḫîn. Asyhadu an lâilâha illallâh wa asyhadu anna muḫammadar rasûlullâh\n\nAllâhumma shalli ‘alâ sayyidinâ muḫammad wa ‘alâ âli sayyidinâ muḫammad kamâ shallaitâ ‘alâ sayyidinâ ibrâhîm wa ‘alâ âli sayyidinâ ibrâhîm wa bârik ‘alâ sayyidinâ muḫammad wa ‘alâ âli sayyidinâ muḫammad kamâ bârakta ‘alâ sayyidinâ ibrâhîm wa ‘alâ âli sayyidinâ ibrâhîm. Fil ‘âlamîna innaka ḫamîdum majîd\n\nAllahummâ innî ‘aûdzubika min ‘adzâbil qabri wa min ‘adzâbin nâr wa min fitnatil maḫya wal mamati wa min fitnatil masîḫid dajjal\n\nYâmuqallibal qulûb tsabbit qalbî ‘alâ dînik",
            arti: "Segala kehormatan, keberkahan, rahmat dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah dan berkah-Nya (tetap tercurahkan) atas mu, wahai Nabi (Muhammad). Semoga keselamatan (tetap terlimpahkan) atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi bahwa tidak ada Tuhan selain Allah dan aku bersaksi bahwa Muhammad adalah utusan Allah.\n\nYa Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad dan kepada keluarga junjungan kami Nabi Muhammad, sebagaimana pernah Engkau beri rahmat kepada junjungan kami Nabi Ibrahim dan kepada keluarga junjungan kami Nabi Ibrahim. Dan limpahilah berkah kepada kepada junjungan kami Nabi Muhammad dan kepada keluarga junjungan kami Nabi Muhammad, sebagaimana Engkau pernah beri berkah kepada junjungan kami Nabi Ibrahim dan kepada keluarga junjungan kami Nabi Ibrahim. Di seluruh alam semesta Engkaulah Yang Terpuji dan Mahamulia.\n\nYa Allah. Aku berlindung dari siksa kubur, dan siksa api neraka dan aku berlindung dari fitnah hidup dan mati dan saya berlindung dari fitnah keburukan Dajjal.\n\nWahai Dzat yang membolak-balikkan hati, tetapkanlah hati saya kepada agama-Mu."
          },
          {
            judul: "18. Doa Sujud Sahwi",
            arab: "سُبْحَانَ مَنْ لَا يَسْهُوْ وَلَا يَنَامُ",
            latin: "Subḫâna man lâ yashû wa lâ yanâmu",
            arti: "Mahasuci Dzat yang tidak pernah lupa dan tidak tidur"
          },
          {
            judul: "19. Doa Sujud Tilawah",
            arab: "سَجَدَ وَجْهِيَ لِلَّذِيْ خَلَقَهُ وَصَوَّرَهُ، وَشَقَّ سَمْعَهُ وَبَصَرَهُ، بِحَوْلِهِ وَقُوَّتِهِ فَتَبَارَكَ اللهُ أَحْسَنُ الْخَالِقِيْنَ",
            latin: "Sajada wajhiya lil ladzî khalaqahu wa shawwarahu wa syaqqa sam‘ahu wa basharahu bi ḫaulihi wa quwwatihi fa tabârakallâhu aḫsanul khâliqîna",
            arti: "Diriku bersujud kepada Dzat yang menciptakan dan membentuknya, membuka pendengaran dan penglihatannya dengan daya dan kekuatan-Nya. Mahasuci Allah, sebaik-baik pencipta."
          },
          {
            judul: "20. Qunut Nazilah untuk Palestina",
            arab: "اَللّٰهُمَّ إِنَّا نَسْتَعِيْنُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيْكَ، وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ، وَنُثْنِيْ عَلَيْكَ الْخَيْرَ كُلَّهُ، نَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ. اَللّٰهُمَّ إيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّيْ وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ نَرْجُوْ رَحْمَتَكَ وَنَخْشَى عَذَابَكَ، إنَّ عَذَابَكَ الْجِدَّ بِالْكُفَّارِ مُلْحِقٌ. اَللّٰهُمَّ ثَبِّتْ إِخْوَانَنَا اْلمُجَاهِدِيْنَ فِيْ فِلِسْطِيْنَ، خُصُوْصًا فِيْ غَزَّةَ، وَاحْقِنْ دِمَائَهُمْ. اَللّٰهُمَّ عَلَيْكَ بِالْيَهُوْدِ الصُّهْيُوْنِيِّيْنَ الْمَلْعُوْنِيْنَ، وأَنْزِلْ غَضَبَكَ عَلَيْهِمْ. اَللّٰهُمَّ انْصُرْ دِيْنَكَ وكِتَابَكَ وَسُنَّةَ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ\n\nاَللّٰهُمَّ انْصُرِ الْمُسْلِمِيْنَ الْمُسْتَضْعَفِيْنَ فِيْ كُلِّ مَكَانٍ. اَللّٰهُمَّ ارْحَمِ الْمُسْتَضْعَفِيْنَ مِنْ عِبَادِكَ. اَللّٰهُمَّ اكْشِفِ الْغُمَّةَ عَنْ أُمَّتِنَا. اَللّٰهُمَّ إنَّا نَسْأَلُكَ أَنْ تَرْفَعَ الْبَلَاءَ عَنْ غَزَّةَ وَأَهْلِهَا، وَأَنْ تَنْصُرَهُمْ عَلَى عَدُوِّهِمْ، وَأَنْ تَرْحَمَ الْمُسْتَضْعَفِيْنَ مِنْ عِبَادِكَ، وَأَنْ تَكْشِفَ الْغُمَّةَ عَنْ أُمَّتِنَا. اَللّٰهُمَّ عَافِنَا وَالْطُفْ بِنَا وَاحْفَظْنَا وَانْصُرْنَا وَفَرِِّجْ عَنَّا وَالْمُسْلِمِيْنَ. اَللّٰهُمَّ اكْفِنَا وَإِيَّاهُمْ جَمِيْعًا شَرَّ مَصَائِبِ الدُّنْيَا وَالدِّيْنِ\n\nاَللّٰهُمَّ أَصْلِحْنَا وَأَصْلِحْ مَنْ فِيْ صَلَاحِهِ صَلاَحُ الْمُسْلِمِيْنَ. اَللّٰهُمَّ لَا تُهْلِكْنَا وَأَهْلِكْ مَنْ فِيْ هَلَاكِهِ صَلَاحُ الْمُسْلِمِيْنَ. اَللّٰهُمَّ اسْقِنَا الْغَيْثَ وَالرَّحْمَةَ مَعَ اللُّطْفِ وَالْعَافِيَةِ وَالْبَرَكَةِ وَلَا تَجْعَلْنَا مِنَ الْمَحْرُوْمِيْنَ. اَللّٰهُمَّ ارْفَعْ وَاصْرِفْ عَنَّا وَعَنِ الْمُسْلِمِيْنَ الْأَذَى وَالْغَلَاءَ وَالْبَلَاءَ وَالْقَحْطَ وَالْحُمَّى وَالْجَدْبَ وَالْجَوْرَ وَالظُّلْمَ وَجَمِيْعَ أَنْوَاعِ الْفِتَنِ وَالْمِحَنِ وَالْأَمْرَاضِ وَالْأَسْقَامِ وَالشَّدَائِدِ وَالزَّيْغِ وَالضَّلَالِ وَالزَّلَازِلِ وَالرِّيْحِ وَالْجَهْلِ وَالْبَلَاءِ مَا ظَهَرَ مِنْهَا وَمَا بَطَنَ، وأَنْجِ الْمُسْتَضْعَفِيْنَ وَالْمَنْكُوْبِيْنَ وَالْمَكْرُوْبِيْنَ وَالْمَظْلُوْمِيْنَ مِنَ الْمُسْلِمِيْنَ وَاكْلَأْهُمْ وَصُنْهُمْ وَتَوَلَّهُمْ وَارْعَهُمْ وَأَلْهِمْهُمْ رُشْدَهُمْ، وَوَفِّقْنَا وَإِيَّاهُمْ لِمَا تُحِبُّ وَتَرْضَى، وَالْطُفْ بِنَا وَبِهِمْ فِيْ مَا يَجْرِيْ بِهِ الْقَضَاءُ، وَاصْرِفْ وَادْفَعْ وَأَبْعِدْ وَأَزِلْ عَنَّا وَعَنْهُمْ شَرَّ الطَّاغِيْنَ وَالْبَاغِيْنَ وَالظَّالِمِيْنَ وَالْمُعْتَدِيْنَ وَالْمُفْسِدِيْنَ وَالْمُؤْذِيْنَ وَالْعَائِنِيْنَ وَالسَّاحِرِيْنَ بِمَا شِئْتَ عَاجِلاً غَيْرَ اٰجِلٍ فِيْ عَافِيَةٍ وَسَلَامَةٍ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِيْنَ",
            latin: "Allâhumma innâ nasta‘înuka wa nastaghfiruka wa nastahdîka wa nu’minu bika wa natawakkalu ‘alayka wa nutsnî ‘alaykal khayra kullahu, nasykuruka wa la nakfuruka wa nakhla‘u wa natruku may yafjuruka. Allâhumma iyyaka na‘budu wa laka nushallî wa nasjudu wa ilayka nas‘â wa naḫfidu, narjû raḫmataka wa nakhsyâ ‘adzâbaka, inna ‘adzâbakal jidda bil kuffâri mulḫiqun. Allâhumma tsabbit ikhwânanal mujâhidîna fi Filistin, khusushan fi Ghazzah, waḫqin dimâ’ahum. Allâhumma ‘alayka bil Yahûd, ash-shuhyûniyyîna, al-mal‘ûnîna, wa anzil ghadhabaka ‘alayhim. Allâhumma-nshur dînaka wa kitâbaka wa sunnata nabiyyika Muḫammadin shallallûhu ‘alayhi wa sallam\n\nAllâhummanshuril muslimînal mustadl‘afîna fî kulli makân(i). Allâhumma-rḫamil mustadh‘afîna min ‘ibâdik(a). Allâhummaksyifil ghummah ‘an ummatina. Allâhumma innâ nas’aluka an tarfa‘al balâ-a ‘an Ghazzah wa ahliha, wa an tanshurahum ‘alâ ‘aduwwihim, wa an tarḫamal mustadl‘afîna min ‘ibâdika, wa an taksyifal ghummah ‘an ummatinâ. Allâhumma ‘âfina walthuf binâ waḫfadhnâ wanshurnâ wa farrij ‘annâ wal muslimîn(a). Allâhummakfinâ wa iyyâhum jamî‘an syarra mashâ-ibid dun-yâ wad dîn(i)\n\nAllâhumma ashliḫnâ wa ashliḫ man fî shalâḫihi shalâḫul muslimîn(a). Allâhumma lâ tuhliknâ wa ahlik man fî halâkihi shalaḫul muslimîn(a). Allâhumma-sqinal ghaytsa war raḫmata ma‘al luthfi wal ‘âfiyati wal barakati wa lâ taj‘alnâ minal maḫrumin. Allâhummarfa’ washrif ‘annâ wa ‘anil muslimînal adzâ wal ghalâ-a wal balâ-a wal qaḫtha wal ḫumma wal jadba wal jawra wadh dhulma wa jamî‘a anwâ‘il fitani wal miḫani wal amrâdhi wal asqâmi wasy-syadâ-idi wazzayghi wadl dlalâli waz zalâzili war rîḫi wal jahli wal balâ-i mâ dhahara minhâ wa mâ bathana. Wa anjil mustadh‘afîna wal mankûbîna wal makrûbîna wal madhlûmîna minal muslimîna wakla’hum washunhum wa tawallahum war‘ahum wa alhimhum rusydahum wa waffiqnâ wa iyyahum limâ tuḫibbu wa tardlâ, wal-thuf binâ wa bihim fî mâ yajrî bihil qadhâ-u, washrif wadfa’ wa ab‘id wa azil ‘annâ wa ‘anhum syarrath thâghîna wal bâghîna wadh dhâlimîna wal mu‘tadîna wal mufsidîna wal mu’dzîna wal ‘â-inîna was sâḫirîna bimâ syi’ta ‘âjilan ghayra âjilin fî ‘âfiyatin wa salâmatin biraḫmatika yâ arḫamarrâḫimîna",
            arti: "Ya Allah, kami memohon pertolongan-Mu, kami memohon ampunan-Mu, kami memohon petunjuk-Mu, kami beriman kepada-Mu, kami bertawakal kepada-Mu, kami memuji-Mu dengan segala kebaikan, kami bersyukur kepada-Mu dan tidak kufur kepada-Mu. Kami berlepas diri dan meninggalkan orang yang mendurhakai-Mu. Ya Allah, kepada-Mu kami menghamba, kepada-Mu kami berdoa dan bersujud, kepada-Mu kami berusaha dan bergegas. Kami mengharap rahmat-Mu, dan kami takut akan siksa-Mu. Sesungguhnya azab-Mu yang berat melekat pada orang-orang kafir. Ya Allah, kuatkanlah saudara-saudara mujahidin kami di Palestina, khususnya di Gaza, dan jagalah darah mereka. Ya Tuhan, hukumlah orang-orang Yahudi Zionis yang terkutuk, dan turunkan murka-Mu kepada mereka. Ya Tuhan, dukunglah agamamu, kitabmu, dan sunnah Nabi-Mu, Muhammad—semoga Allah melimpahkan rahmat pengagungan dan memberi kedamaian kepada beliau.\n\nYa Allah, bantulah umat Islam yang tertindas di mana pun. Ya Allah, kasihanilah orang-orang yang tertindas di antara hamba-hamba-Mu. Ya Tuhan, hilangkan duka dari umat kami. Ya Allah, kami mohon agar Engkau mengangkat bencana dari Gaza dan rakyatnya, memberi mereka kemenangan atas musuh mereka, mengampuni mereka yang tertindas di antara hamba-hamba-Mu, dan semoga duka disingkirkan dari bangsa kami. Ya Allah, berilah kami kesehatan, berbaik hatilah kepada kami, lindungi kami, dukung kami, dan bebaskan kami begitu juga kaum muslimin. Ya Allah, lindungilah kami dan mereka semua dari kejahatan musibah dunia dan agama.\n\nYa Allah perbaikilah kami dan perbaiki orang-orang yang dalam kebaikannya ada kebaikan kaum muslimin. Ya Allah, jangan hancurkan kami dan hancurkan siapa pun yang pada kehancurannya ada kebaikan kaum muslimin. Ya Allah, limpahkanlah kami hujan dan rahmat, kebaikan, kesehatan, dan keberkahan, jangan jadikan kami termasuk orang-orang yang terhalang. Ya Allah, angkatlah dan jauhkan dari kami dan kaum muslimin mara bahaya, bala, kesengsaraan, kekeringan, demam, kemandulan, kezaliman, kejahatan, dan segala macam bencana dan kesengsaraan, penyakit, kesakitan, kemalangan, penyimpangan, kesesatan, gempa bumi, angin yang merusak, kebodohan, dan kesengsaraan, baik yang nyata maupun yang tersembunyi. Tolonglah umat Islam yang tertindas, dijahati, dipersulit, dan dizalimi. Lindungilah mereka, jagalah mereka, dukung mereka, peliharalah mereka, dan ilhamilah mereka petunjuk. Tuntunlah kami dan mereka kepada apa yang Engkau sukai dan ridhai, lembutlah kepada kami dan mereka pada apa yang Engkau putuskan. Jauhkan, hindarkan serta hilangkan kami dari keburukan orang-orang zalim yang suka melanggar dan menindas, juga orang-orang yang menyerang, merusak, menyakiti, beserta para penolong mereka dan tukang sihirnya sesuai apa saja yang Engkau kehendaki, secepatnya tanpa penundaan, dalam keadaan sehat dan selamat dengan rahmat-Mu, wahai Yang Maha Pengasih lagi Maha Penyayang."
          }
        ] 
      },
    { id: "d15", nama: "Doa Haji & Umrah", tipe: "doa", jumlah: 0, list: [] },
    { id: "d16", nama: "Doa Kematian", tipe: "doa", jumlah: 0, list: [] },
  ];

export default function DoaPage() {
  const [activeTab, setActiveTab] = useState<"doa" | "wirid">("doa");
  const [kataKunci, setKataKunci] = useState("");
  
  // State untuk navigasi antar layar (Layar Kategori vs Layar Isi Doa)
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);
  const [doaTerbuka, setDoaTerbuka] = useState<number | null>(null);

  // --- LOGIKA PENYARINGAN (FILTER) ---
  const kategoriTampil = databaseKategori.filter(
    (kat) => kat.tipe === activeTab && kat.nama.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const doaDidalamKategori = kategoriAktif?.list.filter(
    (doa) => doa.judul.toLowerCase().includes(kataKunci.toLowerCase())
  ) || [];


  // --- TAMPILAN 2: LAYAR ISI DOA (Jika Kategori Dipilih) ---
  // --- TAMPILAN 2: LAYAR ISI DOA (Jika Kategori Dipilih) ---
  if (kategoriAktif) {
    return (
      <main className="pb-24 bg-slate-50 min-h-screen">
        {/* Header Lengket ala Aplikasi */}
        <div className="sticky top-0 bg-white shadow-sm z-10 px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => {
              setKategoriAktif(null);
              setKataKunci(""); // Reset pencarian saat kembali
              setDoaTerbuka(null);
            }}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-slate-800">{kategoriAktif.nama}</h1>
            <p className="text-xs text-slate-500">{kategoriAktif.jumlah} Bacaan</p>
          </div>
        </div>

        <div className="p-5">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium text-slate-700 shadow-sm"
              placeholder="Cari doa di kategori ini..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            {doaDidalamKategori.length > 0 ? (
              doaDidalamKategori.map((doa, index) => {
                const isBuka = doaTerbuka === index;

                return (
                  <div key={index} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${isBuka ? "border-emerald-300 ring-2 ring-emerald-50" : "border-gray-100"}`}>
                    
                    <button onClick={() => setDoaTerbuka(isBuka ? null : index)} className="w-full p-4 flex items-start justify-between text-left focus:outline-none">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 transition-colors ${isBuka ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                          <BookHeart className="w-5 h-5" />
                        </div>
                        <h2 className={`font-bold mt-1 leading-snug transition-colors pr-2 ${isBuka ? "text-emerald-700" : "text-slate-700"}`}>
                          {doa.judul}
                        </h2>
                      </div>
                      <ChevronDown className={`w-5 h-5 mt-1 text-gray-400 shrink-0 transition-transform duration-300 ${isBuka ? "rotate-180 text-emerald-500" : ""}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isBuka ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="px-5 pb-5">
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-right text-2xl font-bold leading-loose text-slate-800 mb-4 mt-2" dir="rtl">{doa.arab}</p>
                          <p className="text-emerald-600 text-sm mb-2 font-medium">{doa.latin}</p>
                          <p className="text-slate-600 text-sm leading-relaxed italic">&quot;{doa.arti}&quot;</p>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">Belum ada data bacaan / tidak ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // --- TAMPILAN 1: MENU KATEGORI (Beranda Doa) ---
  return (
    <main className="p-5 pb-24 bg-slate-50 min-h-screen">
      <header className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-emerald-600">Ensiklopedia</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kumpulan doa, wirid, dan amalan harian
        </p>
      </header>

      {/* --- SISTEM TAB (DOA vs WIRID) --- */}
      <div className="flex bg-gray-200/60 p-1.5 rounded-xl mb-6">
        <button
          onClick={() => { setActiveTab("doa"); setKataKunci(""); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all duration-300 ${
            activeTab === "doa" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BookMarked className="w-4 h-4" /> DOA PILIHAN
        </button>
        <button
          onClick={() => { setActiveTab("wirid"); setKataKunci(""); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all duration-300 ${
            activeTab === "wirid" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles className="w-4 h-4" /> WIRID & AMALAN
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium text-slate-700 shadow-sm"
          placeholder={`Cari kategori ${activeTab}...`}
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
        />
      </div>

      {/* --- DAFTAR FOLDER KATEGORI --- */}
      <div className="grid grid-cols-1 gap-3">
        {kategoriTampil.map((kat) => (
          <button
            key={kat.id}
            onClick={() => {
              setKategoriAktif(kat);
              setKataKunci(""); // Kosongkan pencarian untuk layar selanjutnya
            }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-500 rounded-xl flex items-center justify-center transition-colors">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base group-hover:text-emerald-700 transition-colors">
                  {kat.nama}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  <span className="text-emerald-600">{kat.jumlah}</span> Bacaan
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-full group-hover:bg-emerald-100 transition-colors">
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 -rotate-90" />
            </div>
          </button>
        ))}
        
        {kategoriTampil.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Kategori tidak ditemukan.
          </div>
        )}
      </div>
    </main>
  );
}
