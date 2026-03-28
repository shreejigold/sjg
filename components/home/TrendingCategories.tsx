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
          <h3 className="font-playfair text-3xl md:text-5xl font-black text-darkbrown text-center leading-tight uppercase tracking-tighter">Trending Collections</h3>
          <div className="h-1.5 w-24 bg-gold/20 rounded-full" />
       </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 xl:gap-8 px-4 md:px-0">
          {categories.map((cat, idx) => (
             <Link key={cat.id} href={`/collections/${cat.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md shadow-black/10 bg-softgray/10 mb-4 group-hover:shadow-xl transition-all duration-500">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-1 flex flex-col items-center text-center mt-2">
                     <h4 className="text-darkbrown/80 uppercase tracking-widest font-bold text-[10px] md:text-xs group-hover:text-gold transition-colors">
                        {cat.title}
                     </h4>
                     <p className="text-[9px] text-darkbrown/40 mt-1 uppercase tracking-widest">Explore Collection</p>
                  </div>
                </motion.div>
             </Link>
          ))}
       </div>
    </section>
  );
}
