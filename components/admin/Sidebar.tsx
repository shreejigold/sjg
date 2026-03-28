"use client";

import { LogOut, Home, LayoutDashboard, Settings, User, Layers, Tag, Sparkles, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/dashboard?tab=orders" },
    { icon: Users, label: "Customers", href: "/admin/dashboard?tab=customers" },
    { icon: Layers, label: "Categories", href: "/admin/categories" },
    { icon: Tag, label: "Products", href: "/admin/products" },
    { icon: Sparkles, label: "New Arrivals", href: "/admin/new-products" },
    { icon: Home, label: "View Site", href: "/" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gold/10 flex flex-col items-center py-10 relative hidden md:flex h-screen sticky top-0 shadow-lg shadow-black/5">
      {/* Sidebar Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-16 h-16 mb-8 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <nav className="w-full flex-1 px-6 space-y-4">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-gold text-white font-semibold shadow-lg shadow-gold/20" 
                  : "text-darkbrown/60 hover:text-gold hover:bg-pink/40"
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="w-[80%] flex items-center justify-center gap-3 py-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all font-semibold uppercase tracking-widest text-[10px]"
      >
        <LogOut size={16} />
        Sign Out
      </button>

      {/* Luxury Decorative Line */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
    </aside>
  );
}
