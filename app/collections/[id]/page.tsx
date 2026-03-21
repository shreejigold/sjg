"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Filter, LayoutGrid, ChevronRight } from "lucide-react";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          ProductService.getProductsByCategory(id),
          CategoryService.getCategories()
        ]);
        setProducts(prodData);
        setCategory(catData.find((c: any) => c.id === id));
      } catch (error) {
        console.error("Failed to fetch collection data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
        {/* Collection Hero / Header */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gold/10">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">
                <Link href="/" className="hover:text-gold-dark transition-colors">Home</Link>
                <ChevronRight size={10} />
                <span>Collections</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-darkbrown">
                {category?.title || "Exquisite Selection"}
              </h1>
              <p className="text-sm text-darkbrown/60 mt-4 max-w-2xl leading-relaxed">
                Explore our curated selection of {category?.title.toLowerCase() || "products"}, each piece handcrafted to perfection with the finest gold and heritage techniques.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-3 px-6 py-3 rounded-full border border-gold/20 text-darkbrown/60 hover:text-gold hover:border-gold transition-all text-[10px] font-bold uppercase tracking-widest">
                  <Filter size={16} /> Filter
               </button>
               <div className="h-10 w-[1px] bg-gold/10 hidden md:block" />
               <div className="flex items-center gap-2 p-1 bg-softgray rounded-full">
                  <button className="p-2 bg-white shadow-sm rounded-full text-gold">
                    <LayoutGrid size={18} />
                  </button>
                  <button className="p-2 text-darkbrown/40 hover:text-darkbrown transition-colors">
                    <ShoppingBag size={18} />
                  </button>
               </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
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
                    
                    {/* Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <span className="bg-white/80 backdrop-blur-md text-[8px] font-bold text-darkbrown px-3 py-1 rounded-full border border-gold/10 uppercase tracking-widest">
                          {product.gender}
                       </span>
                       {product.discount > 0 && (
                          <span className="bg-red-500 text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20">
                             {product.discount}% OFF
                          </span>
                       )}
                    </div>
                  </div>

                  <div className="px-2 flex-1 flex flex-col">
                    <h3 className="text-darkbrown group-hover:text-gold transition-colors font-bold text-lg leading-snug line-clamp-1 mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-xl font-bold text-darkbrown">₹{product.sellingPrice.toLocaleString()}</span>
                      {product.mrp > product.sellingPrice && (
                        <span className="text-xs text-darkbrown/40 line-through italic">₹{product.mrp.toLocaleString()}</span>
                      )}
                    </div>
                    
                    {/* Check Details Button - Now always visible or prominent below */}
                    <button className="w-full border border-gold/30 hover:bg-gold hover:text-white py-3.5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[9px] transition-all duration-500 flex items-center justify-center gap-3 group-hover:shadow-lg group-hover:shadow-gold/10">
                       Check Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-40 bg-softgray/20 rounded-[3rem] border border-dashed border-gold/10">
              <ShoppingBag size={60} className="mx-auto mb-6 text-gold/30" />
              <h2 className="text-2xl font-playfair italic text-darkbrown/40">This collection is currently being restored.</h2>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-darkbrown/30 font-bold">Please check back later</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
