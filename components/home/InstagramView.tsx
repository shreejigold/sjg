"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Play } from "lucide-react";

const reels = [
  { id: 1, image: "/assets/instagram/reels_1.png", likes: "1.2k" },
  { id: 2, image: "/assets/instagram/reels_2.png", likes: "850" },
  { id: 3, image: "/assets/instagram/reels_3.png", likes: "2.1k" },
  { id: 4, image: "/assets/instagram/reels_4.png", likes: "1.5k" },
];

export default function InstagramView() {
  return (
    <section className="py-24 bg-pearl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink/30 rounded-full blur-3xl -ml-48 -mb-48 opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-playfair text-4xl md:text-5xl text-darkbrown mb-4 leading-tight">
                Stay <span className="text-gold-gradient italic">Inspired</span>
              </h2>
              <p className="text-darkbrown/60 tracking-widest uppercase text-[10px] md:text-xs font-semibold">
                Follow our journey and discover the latest in pure gold craftsmanship.
              </p>
            </motion.div>
          </div>
          
          <motion.a
            href="https://instagram.com" 
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-8 py-3.5 bg-white border border-gold/20 rounded-full text-darkbrown font-bold text-[10px] uppercase tracking-widest hover:border-gold/50 transition-all duration-500 shadow-sm"
          >
            <Instagram className="w-4 h-4 text-gold" />
            @shreejigold
          </motion.a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
              whileHover={{ y: -12 }}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl bg-white/50"
            >
              <Image
                src={reel.image}
                alt={`Instagram Reel ${reel.id}`}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-darkbrown/90 via-darkbrown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileHover={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-2 text-white/90"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30">
                    <Play className="w-3 h-3 fill-gold text-gold" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase">WATCH REEL</span>
                </motion.div>
                <div className="mt-3 text-white font-medium text-xs tracking-wide">
                  {reel.likes} people loved this
                </div>
              </div>
              
              {/* Decorative inner frame */}
              <div className="absolute inset-4 border border-white/0 group-hover:border-white/20 rounded-xl transition-all duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
        
        {/* Mobile View All */}
        <div className="mt-12 text-center lg:hidden">
            <button className="gold-button w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                Explore Gallery
            </button>
        </div>
      </div>

      {/* Subtle bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
