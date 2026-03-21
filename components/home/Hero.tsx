"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/bg.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-40 scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-playfair text-5xl md:text-8xl mb-6 italic tracking-tight text-darkbrown">
            Purity in every <span className="text-gold-gradient non-italic">Detail</span>
          </h2>
          <p className="max-w-2xl mx-auto text-darkbrown/60 text-sm md:text-lg leading-relaxed mb-10 tracking-widest uppercase">
            Discover the art of fine jewelry with Shri Ji Gold. Traditional craftsmanship meets modern elegance.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <button className="gold-button px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] min-w-[200px]">
                Explore Collections
             </button>
             <button className="px-10 py-4 rounded-full border border-white/20 hover:border-gold/50 transition-all font-bold uppercase tracking-widest text-[10px] min-w-[200px]">
                Our Heritage
             </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
         <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
