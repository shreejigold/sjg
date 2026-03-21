"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Filter, LayoutGrid, ChevronRight, Sparkles } from "lucide-react";
import { NewProductService } from "@/services/newProduct.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NewArrivalsFullPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setIsLoading(true);
      try {
        const data = await NewProductService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-darkbrown font-montserrat flex flex-col">
      <Header />
      
      <main className="flex-1 w-full pt-32 pb-24">
        {/* New Arrivals Hero Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16 relative overflow-hidden bg-pink/20 rounded-[3rem] p-12 md:p-20 border border-gold/10">
          <div className="absolute -top-20 -right-20 opacity-[0.05] rotate-12">
             <Sparkles size={400} className="text-gold" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">
                <Link href="/" className="hover:text-gold-dark transition-colors">Home</Link>
                <ChevronRight size={10} />
                <span>Collections</span>
                <ChevronRight size={10} />
                <span>New Arrivals</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-playfair font-black text-darkbrown leading-tight mb-8">
                The Heritage <br /> Seasonal
              </h1>
              <p className="text-sm md:text-base text-darkbrown/60 leading-relaxed max-w-xl">
                 Discover our latest seasonal highlights. A curated selection of new additions featuring innovative designs, rare craftsmanship, and 24K pure excellence.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-4 px-10 py-5 rounded-full bg-gold text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-gold/20 hover:scale-105 transition-transform active:scale-95">
                  <Filter size={18} /> Refine My View
               </button>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b border-gold/10 pb-6 opacity-40">
             <h2 className="text-2xl font-playfair italic">All New Additions</h2>
             <p className="text-[10px] font-black uppercase tracking-widest">{products.length} Masterpieces Found</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col"
              >
                <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-gold/10 bg-softgray/30 mb-6 group-hover:border-gold/30 transition-all duration-700 shadow-xl shadow-pink/5">
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <span className="bg-white/80 backdrop-blur-md text-[8px] font-bold text-gold px-3 py-1.5 rounded-full border border-gold/10 uppercase tracking-widest shadow-xl">
                          {product.categoryTitle}
                       </span>
                    </div>

                    {/* New Badge */}
                    <div className="absolute top-6 right-6">
                       <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white shadow-xl">
                          <Sparkles size={20} className="text-gold" />
                       </div>
                    </div>
                  </div>

                  <div className="px-2 flex-1 flex flex-col">
                    <h3 className="text-darkbrown group-hover:text-gold transition-colors font-bold text-lg leading-snug line-clamp-1 mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-xl font-bold text-darkbrown">₹{product.sellingPrice.toLocaleString()}</span>
                      {product.mrp > product.sellingPrice && (
                        <span className="text-xs text-darkbrown/40 line-through italic">₹{product.mrp.toLocaleString()}</span>
                      )}
                    </div>
                    
                    <button className="w-full border border-gold/30 hover:bg-gold hover:text-white py-3.5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[9px] transition-all duration-500 flex items-center justify-center gap-3 group-hover:shadow-lg group-hover:shadow-gold/10">
                       Examine Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-40 bg-softgray/20 rounded-[3rem] border border-dashed border-gold/10">
              <ShoppingBag size={60} className="mx-auto mb-6 text-gold/30" />
              <h2 className="text-2xl font-playfair italic text-darkbrown/40">New Arrivals are currently being curated.</h2>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-darkbrown/30 font-bold">Return for the new season shortly</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
