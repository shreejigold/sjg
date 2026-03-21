"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CategoriesProps {
  categories: any[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
       <div className="flex flex-col items-center mb-16">
          <h3 className="font-playfair text-3xl md:text-5xl font-bold text-darkbrown mb-4">Our Categories</h3>
          <div className="w-24 h-[1px] bg-gold/50" />
       </div>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {categories.map((cat, idx) => (
             <Link key={cat.id} href={`/collections/${cat.id}`}>
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: idx * 0.1 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center group cursor-pointer"
               >
                  <div className="relative w-32 h-32 md:w-48 md:h-48 mb-6">
                     {/* Circular Frame Decor */}
                     <div className="absolute inset-0 border border-gold/20 rounded-full scale-110 group-hover:scale-125 group-hover:border-gold/50 transition-all duration-700" />
                     <div className="absolute inset-0 border border-gold/10 rounded-full scale-105 group-hover:rotate-45 transition-all duration-1000" />

                     <div className="w-full h-full rounded-full overflow-hidden border-2 border-gold/30 p-1 bg-white shadow-lg shadow-pink/20">
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                           <img
                             src={cat.image}
                             alt={cat.title}
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gold/5 group-hover:bg-transparent transition-colors" />
                        </div>
                     </div>
                  </div>
                  <h4 className="text-darkbrown/70 group-hover:text-gold transition-colors font-bold uppercase tracking-[0.2em] text-xs md:text-sm text-center">
                     {cat.title}
                  </h4>
                  {cat.discount > 0 && (
                    <span className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-widest">
                       Up to {cat.discount}% Off
                    </span>
                  )}
               </motion.div>
             </Link>
          ))}

          {categories.length === 0 && (
             <div className="col-span-full text-center py-20 bg-pink/10 rounded-3xl border border-dashed border-pink-dark/30 italic text-darkbrown/40">
                New collections are being curated. Please check back soon.
             </div>
          )}
       </div>
    </section>
  );
}
