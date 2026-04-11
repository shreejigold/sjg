"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { ChevronDown, ChevronUp } from "lucide-react";

const BUDGETS = [1999, 2999, 3999, 4999, 5999, 9999];

export default function BudgetCollections() {
  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(8);

  // Update display limit based on screen size (2 rows)
  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth < 768) {
        setDisplayLimit(4); // 2 columns * 2 rows
      } else if (window.innerWidth < 1024) {
        setDisplayLimit(8); // 4 columns * 2 rows
      } else {
        setDisplayLimit(10); // 5 columns * 2 rows
      }
    };
    
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    if (activeBudget === null) {
      setProducts([]);
      setIsExpanded(false);
      return;
    }

    const fetchBudgetProducts = async () => {
      setLoading(true);
      setIsExpanded(false);
      try {
        const [productList, categoryList] = await Promise.all([
          ProductService.getProducts(),
          CategoryService.getCategories()
        ]);

        const catMap = (categoryList as any[]).reduce((acc: any, cat: any) => {
          acc[cat.id] = cat;
          return acc;
        }, {});

        const enrichedProducts = (productList as any[]).map((prod: any) => {
          const category = catMap[prod.categoryId];
          const effectiveDiscount = (category && category.discount > 0) ? category.discount : (prod.discount || 0);
          const effectiveSellingPrice = Math.round(prod.mrp * (1 - effectiveDiscount / 100));
          
          return {
            ...prod,
            discount: effectiveDiscount,
            sellingPrice: effectiveSellingPrice
          };
        });

        // Filter products under budget
        const filtered = enrichedProducts.filter(p => p.sellingPrice <= activeBudget);
        
        // Fetch all matching products up to 40 for the grid
        setProducts(filtered.slice(0, 40));
      } catch (error) {
        console.error("Failed to fetch budget products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetProducts();
  }, [activeBudget]);

  const visibleProducts = isExpanded ? products : products.slice(0, displayLimit);

  return (
    <section className="bg-white py-12">
      {/* Title Bar styling mimicking the image provided */}
      <div className="w-full bg-[#EAE1D0]/60 py-4 mb-10 border-y border-[#c0997c]/20">
         <h2 className="text-center font-bold tracking-[0.25em] text-[#3D2B1F] text-xs md:text-sm uppercase">
            Budget Collections
         </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        {/* Grid layout of budget tiles instead of horizontal scroll */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 mb-8">
           {BUDGETS.map((budget) => (
             <button
               key={budget}
               onClick={() => setActiveBudget(activeBudget === budget ? null : budget)}
               className={`w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 ${activeBudget === budget ? 'ring-2 ring-[#c0997c] scale-105 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] bg-orange-50/30' : 'hover:scale-105 hover:bg-orange-50/10'}`}
             >
                <div className="w-[85%] h-[85%] rounded-full border-[1.5px] border-[#c0997c]/80 flex flex-col items-center justify-center relative">
                   <div className="absolute inset-1 rounded-full border-[2px] border-dotted border-[#c0997c]/60" />
                   <div className="absolute inset-2.5 rounded-full border border-dashed border-[#c0997c]/30" />
                   
                   <span className="text-[8px] md:text-[10px] text-[#5B3E29] font-playfair tracking-widest leading-none mb-1 z-10 pt-1">UNDER</span>
                   <span className="text-base md:text-[22px] font-black text-[#5B3E29] tracking-tight z-10">{budget}</span>
                </div>
             </button>
           ))}
        </div>

        {/* Expanding Product Grid */}
        <AnimatePresence>
           {activeBudget !== null && (
              <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="overflow-hidden mt-4"
              >
                  {loading ? (
                    <div className="flex justify-center items-center py-20 text-gold font-playfair animate-pulse">
                      Curating perfect pieces under RS. {activeBudget}...
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-20 text-darkbrown/50 text-xs tracking-widest uppercase">
                      No collections found directly under RS. {activeBudget} currently.
                    </div>
                  ) : (
                    <div className="pt-4 pb-12">
                       <h3 className="text-center font-playfair font-black text-2xl text-[#3D2B1F] mb-8">
                          Curated Under {activeBudget}
                       </h3>
                       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                           {visibleProducts.map((prod, idx) => (
                              <motion.div
                                key={`${prod.id}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx % displayLimit * 0.05 }}
                              >
                                <Link href={`/products/${prod.id}`} className="block flex-1 flex flex-col group h-full">
                                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-gold/10 bg-softgray/10 mb-3 transition-all duration-300">
                                    <img 
                                      src={prod.images[0]} 
                                      alt={prod.title} 
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                  </div>

                                  <div className="px-1 flex flex-col flex-1 pb-2">
                                    <h3 className="text-[#3D2B1F] uppercase tracking-[0.1em] font-bold text-[10px] md:text-xs line-clamp-1 mb-1 transition-colors group-hover:text-gold text-center">
                                      {prod.title}
                                    </h3>
                                    
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                      <span className="text-xs font-black text-[#4A3320] tracking-wider">RS. {prod.sellingPrice.toLocaleString()}.00</span>
                                      {prod.mrp > prod.sellingPrice && (
                                         <>
                                           <span className="text-[10px] text-[#4A3320]/50 line-through">RS. {prod.mrp.toLocaleString()}.00</span>
                                         </>
                                      )}
                                    </div>
                                    
                                    <div className="mt-auto">
                                       <button className="w-full bg-white border border-[#4A3320]/20 text-[#4A3320] py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-colors group-hover:bg-[#4A3320] group-hover:text-white shadow-sm">
                                         Check Details
                                       </button>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                           ))}
                       </div>

                       {products.length > displayLimit && (
                         <div className="flex justify-center mt-12">
                            <button
                              onClick={() => setIsExpanded(!isExpanded)}
                              className="group flex items-center gap-3 px-8 py-3 bg-[#3D2B1F] text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                               {isExpanded ? (
                                 <>Show Less <ChevronUp size={16} /></>
                               ) : (
                                 <>See All Collection <ChevronDown size={16} /></>
                               )}
                            </button>
                         </div>
                       )}
                    </div>
                  )}
              </motion.div>
           )}
        </AnimatePresence>
      </div>
    </section>
  );
}
