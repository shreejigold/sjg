"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { NewProductService } from "@/services/newProduct.service";
import { CategoryService } from "@/services/category.service";
import { CartService } from "@/services/cart.service";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const [productList, categoryList] = await Promise.all([
          NewProductService.getProducts(),
          CategoryService.getCategories()
        ]);

        const catMap = (categoryList as any[]).reduce((acc: any, cat: any) => {
          acc[cat.id] = cat;
          return acc;
        }, {});

        const enrichedProducts = (productList as any[]).map((prod: any) => {
          const category = catMap[prod.categoryId];
          const effectiveDiscount = (category && category.discount > 0) ? category.discount : prod.discount;
          const effectiveSellingPrice = Math.round(prod.mrp * (1 - effectiveDiscount / 100));
          
          return {
            ...prod,
            discount: effectiveDiscount,
            sellingPrice: effectiveSellingPrice
          };
        });

        setProducts(enrichedProducts);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    CartService.addToCart({
      id: product.id,
      productId: product.productId,
      title: product.title,
      price: product.sellingPrice,
      image: product.images[0],
      quantity: 1,
      stock: product.totalQuantity,
      collection: 'newProducts'
    });
  };

  if (isLoading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-12 flex items-center justify-between">
        <div>
           <h2 className="text-4xl md:text-[2.75rem] font-playfair font-black text-[#3D2B1F] leading-tight tracking-tighter uppercase mb-3">
             NEW ARRIVALS
           </h2>
           <div className="h-1 w-20 md:w-28 bg-[#E8D4A2] rounded-full" />
        </div>
        
        {products.length > 5 && (
          <Link 
            href="/new-arrivals" 
            className="hidden md:flex items-center gap-2 group text-darkbrown/60 hover:text-[#3D2B1F] transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">View All</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Product Grid Layout */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.slice(0, 5).map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col group"
            >
              <Link href={`/products/${prod.id}`} className="block flex-1 flex flex-col">
                <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-sm border border-gold/10 bg-softgray/10 mb-4 transition-all duration-300">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3">
                     <span className="bg-[#EAE1D0]/95 backdrop-blur-md text-[#3D2B1F] font-bold text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        {prod.categoryTitle || 'Exclusive'}
                     </span>
                  </div>
                </div>

                <div className="px-1 flex flex-col flex-1 pb-2">
                  <h3 className="text-[#3D2B1F] uppercase tracking-[0.1em] font-bold text-[10px] md:text-sx line-clamp-1 mb-1.5 transition-colors group-hover:text-gold">
                    {prod.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs md:text-sm font-black text-[#4A3320] tracking-wider">RS. {prod.sellingPrice.toLocaleString()}.00</span>
                    {prod.mrp > prod.sellingPrice && (
                       <>
                         <span className="text-[#4A3320]/30">|</span>
                         <span className="text-[10px] text-[#4A3320]/50 line-through">RS. {prod.mrp.toLocaleString()}.00</span>
                       </>
                    )}
                  </div>
                  
                  {/* Explicit Action Button */}
                  <div className="mt-auto">
                     <button className="w-full bg-[#4A3320] text-white py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-[#3D2B1F] shadow-sm">
                       Check Details
                     </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile View All */}
        {products.length > 5 && (
           <div className="mt-10 flex justify-center md:hidden">
              <Link 
                href="/new-arrivals" 
                className="bg-transparent border border-[#3D2B1F]/20 text-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all"
              >
                View All New Arrivals
              </Link>
           </div>
        )}
      </div>
    </section>
  );
}
