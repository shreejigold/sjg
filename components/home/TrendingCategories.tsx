"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TrendingCategoriesProps {
  categories: any[];
}

export default function TrendingCategories({ categories }: TrendingCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
       <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="flex items-center gap-3 text-gold text-[10px] font-black uppercase tracking-[0.4em]">
             <Sparkles size={16} /> Seasonal Spotlight
          </div>
          <h3 className="font-playfair text-4xl md:text-6xl font-black text-darkbrown text-center leading-tight">Trending Collections</h3>
          <div className="h-1.5 w-24 bg-gold/20 rounded-full" />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat, idx) => (
             <Link key={cat.id} href={`/collections/${cat.id}`}>
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1, duration: 0.8 }}
                 viewport={{ once: true }}
                 className="group relative h-[450px] rounded-[3rem] overflow-hidden border border-gold/10 shadow-2xl shadow-pink/10 group cursor-pointer"
               >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-darkbrown via-darkbrown/20 to-transparent group-hover:via-darkbrown/40 transition-all duration-700" />

                  {/* Content */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-end items-center text-center">
                     <div className="w-full h-[1px] bg-gold/30 mb-6 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                     <h4 className="text-white font-playfair text-3xl md:text-4xl font-black mb-4 group-hover:text-gold transition-colors italic">
                        {cat.title}
                     </h4>
                     <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                        Exclusivity {idx + 1}
                     </p>
                     
                     <div className="flex items-center gap-4">
                        <span className="bg-gold text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-gold/20 group-hover:translate-y-[-5px] transition-transform">
                           Shop Collection
                        </span>
                        {cat.discount > 0 && (
                          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/10">
                             -{cat.discount}%
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Circular Decor */}
                  <div className="absolute top-10 right-10 w-24 h-24 border border-white/10 rounded-full scale-110 group-hover:scale-150 transition-all duration-1000 group-hover:border-gold/30" />
               </motion.div>
             </Link>
          ))}
       </div>
    </section>
  );
}
