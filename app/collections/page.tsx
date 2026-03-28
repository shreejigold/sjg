"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { CategoryService } from "@/services/category.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Collections Overview Page
 * Displays all available jewellery collections in a premium, immersive grid.
 */
export default function CollectionsOverviewPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await CategoryService.getCategories();
        // Only show publicly visible collections
        setCategories(data.filter(cat => !cat.hide));
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
            <div className="w-20 h-20 border-2 border-gold/10 rounded-full" />
            <div className="w-20 h-20 border-t-2 border-gold rounded-full animate-spin absolute top-0" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-darkbrown font-montserrat flex flex-col">
      <Header />
      
      <main className="flex-1 w-full pt-40 pb-32">
        {/* Intro Header Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24 text-center">
             <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
             >
                <div className="flex items-center justify-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-gold font-bold">
                    <span className="h-[1px] w-12 bg-gold/30 hidden sm:block" />
                    Treasures of Heritage
                    <span className="h-[1px] w-12 bg-gold/30 hidden sm:block" />
                </div>
                <h1 className="text-5xl md:text-8xl font-playfair font-bold text-darkbrown leading-[1.1] tracking-tight">
                    Our <span className="text-gold italic font-normal">Exquisite</span> <br className="hidden md:block"/> Collections
                </h1>
                <p className="text-sm md:text-lg text-darkbrown/60 max-w-3xl mx-auto leading-relaxed font-medium">
                    Embark on a journey through our legacy of precision and artistry. From the royal bridal archives to contemporary gold masterpieces, explore the pinnacle of craftsmanship.
                </p>
             </motion.div>
        </section>

        {/* Immersive Category Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                className="group"
              >
                <Link href={`/collections/${cat.id}`} className="block relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl shadow-pink/10 border border-gold/10">
                    {/* High-Resolution Reveal Image */}
                    <img 
                        src={cat.image} 
                        alt={cat.title} 
                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                    />
                    
                    {/* Cinematic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-darkbrown/90 via-darkbrown/30 to-transparent transition-opacity duration-700 group-hover:opacity-100 opacity-80" />

                    {/* Floating Badges */}
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                        {cat.trending && (
                            <motion.span 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex items-center gap-2 bg-gold/90 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl"
                            >
                                <Sparkles size={12} className="text-white" /> Trending
                            </motion.span>
                        )}
                        {cat.discount > 0 && (
                            <span className="bg-white/95 backdrop-blur-xl text-darkbrown text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl border border-gold/20">
                                {cat.discount}% PRIVILEGE
                            </span>
                        )}
                    </div>

                    {/* Content Reveal */}
                    <div className="absolute inset-x-0 bottom-0 p-10 space-y-5">
                        <div className="h-[2px] w-12 bg-gold/50 group-hover:w-full transition-all duration-1000 ease-out" />
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white group-hover:text-gold transition-colors duration-500 leading-tight translate-y-2 group-hover:translate-y-0 transition-transform">
                            {cat.title}
                        </h2>
                        
                        <div className="flex items-center justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 group-hover:text-gold-light transition-colors duration-500">
                                View Collection
                            </span>
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-gold group-hover:border-gold transition-all duration-500 transform group-hover:rotate-[-45deg]">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-48 bg-softgray/10 rounded-[4rem] border border-dashed border-gold/20 backdrop-blur-sm">
              <div className="w-32 h-32 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-gold/10">
                  <Sparkles size={48} className="text-gold/20" />
              </div>
              <h2 className="text-3xl font-playfair italic text-darkbrown/30">The vaults are currently under curation.</h2>
              <p className="mt-6 text-[11px] uppercase tracking-[0.4em] text-darkbrown/30 font-bold max-w-sm mx-auto leading-loose">
                  Our artisans are cataloging the next generation of masterworks. 
                  Please visit again soon.
              </p>
            </div>
          )}
        </section>

        {/* Call to action for custom pieces or similar */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto mt-40">
            <div className="glass-card gradient-border p-16 md:p-24 rounded-[4rem] text-center relative overflow-hidden bg-white/40">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                    <Sparkles size={200} className="text-gold" />
                </div>
                <h3 className="text-2xl md:text-3xl font-playfair font-bold text-darkbrown mb-8 italic">
                    "Crafting legacies that endure for generations."
                </h3>
                <div className="h-[1px] w-20 bg-gold/40 mx-auto" />
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
