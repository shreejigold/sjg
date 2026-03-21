"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, User, ArrowUpRight, 
  Users, Eye, Landmark, Layers, Settings 
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const stats = [
    { label: "Total Views", value: "3.4K", change: "+12%", icon: Eye },
    { label: "Active Users", value: "152", change: "+5%", icon: Users },
    { label: "Revenue Est.", value: "$12.5K", change: "+8%", icon: Landmark },
  ];

  return (
    <div className="min-h-screen bg-softgray/50 text-darkbrown font-montserrat flex">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gold-gradient">
              Welcome, Administrator
            </h1>
            <p className="text-sm text-darkbrown/60 mt-2">
              Timeless Elegance & Purity Control Panel.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 text-gold">
            <User size={18} />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-gold/10 relative overflow-hidden group hover:border-gold/30 transition-all bg-white shadow-lg shadow-pink/5">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={80} />
              </div>
              <p className="text-xs text-darkbrown/60 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl font-bold text-darkbrown group-hover:text-gold transition-colors">{stat.value}</h2>
                <span className="text-xs text-green-500 font-medium pb-1 flex items-center gap-1">
                  {stat.change} <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass-card rounded-[2.5rem] border border-gold/10 p-10 flex flex-col justify-center min-h-[300px] bg-white shadow-xl shadow-pink/5">
            <h3 className="text-2xl font-playfair text-gold mb-4">Quick Insights</h3>
            <p className="text-darkbrown/60 text-sm leading-relaxed mb-8">
              Everything is set up. Next, you can start adding categories to manage your gold collections right from the dedicated page.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/admin/categories"
                className="gold-button px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3"
              >
                Go to Categories <Layers size={16} />
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] border border-gold/10 p-10 flex items-center justify-center bg-white shadow-xl shadow-pink/5">
             <div className="text-center">
                <Settings className="mx-auto text-zinc-800 mb-6" size={60} />
                <h4 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">System Settings</h4>
                <p className="text-zinc-600 text-xs mt-2 italic">Global configurations are active.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
