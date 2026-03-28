"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full flex items-center overflow-hidden bg-[#fbfaf8]">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg-premium.png"
          alt="Premium Jewelry Collection"
          fill
          className="object-cover md:object-right opacity-100"
          priority
        />
        {/* Soft linear gradient fade to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white/95 via-white/60 to-transparent w-full md:w-3/5 h-full" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col justify-center h-full pt-32 md:pt-24 pb-10">

        {/* Left Side: Typography and CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-start w-full md:w-1/2"
        >
          <div className="flex flex-col relative w-fit mb-8 md:mb-10">
            <span
              style={{ fontFamily: 'var(--font-cursive)' }}
              className="text-7xl md:text-[8rem] text-[#4A3320] font-normal leading-tight z-10 md:ml-4 -rotate-2 select-none"
            >
              Freshly
            </span>
            <span className="font-montserrat font-bold text-6xl md:text-[5.5rem] tracking-tighter text-[#3D2B1F] leading-none z-0 -mt-2 md:-mt-6">
              Layered.
            </span>
          </div>

          <p className="text-darkbrown text-xs md:text-[15px] mb-8 tracking-wide flex flex-wrap gap-x-1 items-center">
            <span className="font-bold">Be the first</span>
            <span>to own</span>
            <span className="font-bold">our newest arrivals.</span>
          </p>

          <Link
            href="/new-arrivals"
            className="bg-[#3b271c] hover:bg-[#2a1b13] text-white px-8 md:px-10 py-3.5 md:py-4 transition-colors font-medium uppercase tracking-[0.2em] text-[10px] md:text-[11px] shadow-lg shadow-black/10"
          >
            Explore New Arrivals
          </Link>
        </motion.div>

        {/* Right Bottom: Discount Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-8 right-6 md:bottom-12 md:right-16 flex flex-col items-end"
        >
          <span className="text-[#3D2B1F] text-[9px] md:text-xs tracking-[0.3em] font-medium uppercase mb-[-5px] md:mb-[-12px] mr-1 md:mr-2">
            Get Upto
          </span>
          <span className="font-montserrat font-black text-3xl md:text-[9rem] leading-none tracking-tighter text-[#5C3F2B]">
            50<span className="text-4xl md:text-[6rem]">%</span>
          </span>
        </motion.div>

      </div>


    </section>
  );
}
