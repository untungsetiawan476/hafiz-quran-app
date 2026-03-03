"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, BookOpen, Gamepad2, Heart, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Daftar menu navigasi
  const navItems = [
    { name: "Jadwal", path: "/jadwal", icon: CalendarClock },
    { name: "Mengaji", path: "/mengaji", icon: BookOpen },
    { name: "Kuis", path: "/kuis", icon: Gamepad2 },
    { name: "Doa", path: "/doa", icon: Heart },
    { name: "Fitur", path: "/fitur", icon: Settings },
  ];

  // Agar tidak muncul saat di halaman Play Kuis (biar user fokus kuis)
  if (pathname?.includes("/kuis/play")) {
    return null;
  }

  return (
    // Memastikan posisinya menempel di bawah dan mendukung Dark Mode
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      
      <div className="w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors duration-300 pointer-events-auto pb-safe">
        
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
          {navItems.map((item) => {
            // Cek apakah tab ini sedang aktif
            const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex flex-col items-center justify-center w-16 h-14 relative group active:scale-95 transition-transform"
              >
                <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                  
                  {/* Ikon Menu */}
                  <div className={`p-1.5 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'fill-emerald-600/20 dark:fill-emerald-400/20' : ''}`} />
                  </div>
                  
                  {/* Teks Menu */}
                  <span className={`text-[10px] font-bold mt-1 transition-colors ${
                    isActive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {item.name}
                  </span>
                  
                </div>

                {/* Titik indikator kecil di bawah menu yang aktif */}
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
