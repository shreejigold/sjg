"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center text-white px-6">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/bg.png"
          alt="Shri Ji Gold Background"
          fill
          className="object-cover opacity-30 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        <div className="shimmer-bg" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 float-animation"
        >
          <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto">
            <Image
              src="/assets/logo.png"
              alt="Shri Ji Gold Logo"
              fill
              className="object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h1 className="font-playfair text-5xl md:text-7xl mb-4 tracking-tighter text-gold-gradient font-bold">
            Shri Ji Gold
          </h1>
          <p className="font-montserrat text-sm md:text-lg tracking-[0.3em] uppercase mb-12 text-zinc-400">
            Timeless Elegance & Purity
          </p>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-playfair italic mb-6">
            Something Exquisite is Coming
          </h2>

          {/* Countdown Grid */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Mins", value: timeLeft.minutes },
              { label: "Secs", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="glass-card w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-lg border-gold/20 mb-2">
                  <span className="text-2xl md:text-4xl font-bold text-gold">{item.value.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email for early access"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 outline-none focus:border-gold/50 transition-colors text-white placeholder:text-zinc-500 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="gold-button px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs whitespace-nowrap"
                >
                  Notify Me
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card py-4 px-8 rounded-full border-gold/30 text-gold font-medium"
              >
                Thank you! We'll notify you soon.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer / Social Links */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-0 right-0 z-10 flex flex-col items-center"
      >
        <div className="flex gap-6 mb-8">
          {[Instagram, Facebook, Twitter, Mail].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="text-white/60 hover:text-gold transition-colors"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
          {/* <div className="flex items-center gap-2"><Phone size={12} /> +91 999 000 0000</div> */}
          <div className="flex items-center gap-2"><MapPin size={12} /> Jaunpur, India</div>
          <div className="w-full text-center mt-4">© 2026 Shri Ji Gold. All Rights Reserved.</div>
        </div>
      </motion.footer>

      {/* Luxury Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
    </div>
  );
}
