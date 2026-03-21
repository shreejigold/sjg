"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { NewProductService } from "@/services/newProduct.service";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const data = await NewProductService.getProducts();
      setProducts(data);
      setIsLoading(false);
    };
    fetchNewArrivals();
  }, []);

  if (isLoading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold font-bold tracking-[0.3em] uppercase text-[10px]">
            <Sparkles size={16} /> Seasonal Highlights
          </div>
          <h2 className="text-4xl md:text-6xl font-playfair font-black text-darkbrown leading-tight">
            New Arrivals
          </h2>
          <div className="h-1.5 w-24 bg-gold/30 rounded-full" />
        </div>
        
        {products.length > 5 && (
          <Link 
            href="/new-arrivals" 
            className="flex items-center gap-3 group text-darkbrown/60 hover:text-gold transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">View All Collection</span>
            <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
               <ArrowRight size={18} />
            </div>
          </Link>
        )}
      </div>

      {/* Product Slider / Scrolling Area */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-8 px-6 pb-12 custom-scrollbar snap-x snap-mandatory lg:px-[calc((100vw-1280px)/2)] scroll-smooth">
          {products.slice(0, 10).map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] md:min-w-[340px] snap-start"
            >
              <Link href={`/products/${prod.id}`} className="block group">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-gold/10 bg-softgray/30 mb-6 group-hover:border-gold/30 transition-all duration-700 shadow-xl shadow-pink/5">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                    <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-darkbrown/40 hover:text-red-500 shadow-lg shadow-black/5">
                      <Heart size={18} />
                    </button>
                    <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-darkbrown/40 hover:text-gold shadow-lg shadow-black/5">
                      <ShoppingBag size={18} />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute bottom-6 left-6">
                     <span className="bg-white/80 backdrop-blur-md text-[8px] font-bold text-darkbrown px-3 py-1.5 rounded-full border border-gold/10 uppercase tracking-widest shadow-lg">
                        {prod.categoryTitle}
                     </span>
                  </div>
                </div>

                <div className="px-4">
                  <h3 className="text-darkbrown group-hover:text-gold transition-colors font-bold text-lg leading-snug line-clamp-1 mb-2">
                    {prod.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-darkbrown">₹{prod.sellingPrice.toLocaleString()}</span>
                    {prod.mrp > prod.sellingPrice && (
                      <span className="text-xs text-darkbrown/30 line-through italic">₹{prod.mrp.toLocaleString()}</span>
                    )}
                  </div>
                  
                  {/* New Arrival Indicator */}
                  <div className="flex items-center gap-2 mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-gold animate-pulse">
                     <div className="w-1 h-1 rounded-full bg-gold" /> Just Launched
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* End Card - View More Link */}
          {products.length > 10 && (
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="min-w-[280px] md:min-w-[340px] flex items-center justify-center snap-start"
             >
                <Link href="/new-arrivals" className="group text-center">
                   <div className="w-24 h-24 rounded-full border-2 border-dashed border-gold/20 flex items-center justify-center mx-auto mb-6 group-hover:border-gold group-hover:bg-gold/5 transition-all">
                      <ChevronRight size={32} className="text-gold group-hover:translate-x-1 transition-transform" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-darkbrown/40 group-hover:text-gold transition-colors">
                      Discover More
                   </span>
                </Link>
             </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
