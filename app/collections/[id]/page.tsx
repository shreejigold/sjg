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
        const [prodList, categoryList] = await Promise.all([
          ProductService.getProductsByCategory(id),
          CategoryService.getCategories()
        ]);
        
        const currentCat = categoryList.find((c: any) => c.id === id);
        setCategory(currentCat);

        // Apply discount logic: category discount (if > 0) overrides product discount
        const enrichedProducts = (prodList as any[]).map((prod: any) => {
          const effectiveDiscount = (currentCat && (currentCat.discount ?? 0) > 0) ? currentCat.discount! : prod.discount;
          const effectiveSellingPrice = Math.round(prod.mrp * (1 - effectiveDiscount / 100));
          
          return {
            ...prod,
            discount: effectiveDiscount,
            sellingPrice: effectiveSellingPrice
          };
        });

        setProducts(enrichedProducts);
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col"
              >
                <Link href={`/products/${product.id}`} className="flex flex-col h-full group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md shadow-black/10 bg-softgray/10 mb-5 group-hover:shadow-xl transition-all duration-500">
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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

                  <div className="px-1 flex-1 flex flex-col items-center text-center mt-2">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-darkbrown tracking-wider">RS. {product.sellingPrice.toLocaleString()}.00</span>
                      {product.mrp > product.sellingPrice && (
                        <>
                          <span className="text-darkbrown/30 font-light">|</span>
                          <span className="text-[10px] text-darkbrown/50 line-through tracking-wider">RS. {product.mrp.toLocaleString()}.00</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="text-darkbrown/60 uppercase tracking-widest font-medium text-[9px] line-clamp-1">
                      {product.title}
                    </h3>
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
