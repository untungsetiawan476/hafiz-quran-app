"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, BookHeart, Clock } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Mengaji", href: "/", icon: BookOpen },
    { name: "Kuis", href: "/kuis", icon: Headphones },
    { name: "Doa", href: "/doa", icon: BookHeart },
    { name: "Jadwal", href: "/jadwal", icon: Clock },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-between px-6 py-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center">
              <Icon
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}