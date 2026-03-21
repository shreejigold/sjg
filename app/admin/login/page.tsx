"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { AdminService } from "@/services/admin.service";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await AdminService.login(username, password);

      if (response.success) {
        // Success: Redirect to dashboard
        // For now, we'll store success in local storage (basic auth)
        // In a real app, use a proper session/cookie
        localStorage.setItem("adminAuth", "true");
        router.push("/admin/dashboard");
      } else {
        setError(response.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden px-6">
      {/* Background with Gold Accents */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/bg.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/90 via-white/40 to-white/90" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full" />
      </div>

      {/* Decorative Border Layer */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent shadow-[0_0_15px_rgba(212,175,55,0.4)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-[2rem] border border-gold/20 p-8 md:p-12 overflow-hidden relative shadow-2xl">
          {/* Subtle Shimmer Effect on Card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-20 h-20 mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-gold-gradient tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mt-2">
              Secure Authentication Required
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-4 pl-14 pr-6 text-darkbrown outline-none focus:border-gold/50 transition-all duration-300 placeholder:text-darkbrown/40 focus:bg-white/80"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-4 pl-14 pr-6 text-darkbrown outline-none focus:border-gold/50 transition-all duration-300 placeholder:text-darkbrown/40 focus:bg-white/80"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 text-sm pl-2 font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="gold-button w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 group"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Decor */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              © 2026 Shri Ji Gold • Secured Access
            </p>
          </div>
        </div>
      </motion.div>

      {/* Luxury Decorative Line at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
    </div>
  );
}
