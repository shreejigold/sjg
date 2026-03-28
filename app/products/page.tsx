"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import Link from "next/link";
import { EyeOff } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const catId = searchParams.get("catId");
  const type = searchParams.get("type");
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products and categories in parallel
        const [productList, categoryList] = await Promise.all([
          catId ? ProductService.getProductsByCategory(catId) : ProductService.getProducts(),
          CategoryService.getCategories()
        ]);

        // Create a map of category IDs to category data
        const catMap = (categoryList as any[]).reduce((acc: any, cat: any) => {
          acc[cat.id] = cat;
          return acc;
        }, {});

        // Apply discount logic: category discount (if > 0) overrides product discount
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
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [catId]);

  return (
    <div className="min-h-screen bg-white text-darkbrown font-montserrat flex flex-col pt-32">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gold-gradient">
            {type ? type : "All Collections"}
          </h1>
          <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest font-bold">
            Showing results for your selection
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gold animate-pulse">
            Curating your selection...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((prod) => (
              <Link href={`/products/${prod.id}`} key={prod.id}>
                <div className="glass-card group rounded-3xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-xl hover:shadow-pink/10 transition-all duration-500 h-full flex flex-col bg-white">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={prod.images[0]} 
                      alt={prod.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    {prod.hide && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <EyeOff size={32} className="text-white/40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-gold italic">
                      {prod.productId}
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-darkbrown group-hover:text-gold transition-colors line-clamp-1">{prod.title}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{prod.categoryTitle}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] text-zinc-600 line-through italic">MRP ₹{prod.mrp.toLocaleString()}</p>
                        <p className="text-2xl font-black text-darkbrown group-hover:text-gold transition-colors">₹{prod.sellingPrice.toLocaleString()}</p>
                      </div>
                      {prod.discount > 0 && (
                        <div className="bg-red-500/10 border border-red-500/10 text-red-500 px-3 py-1 rounded-lg text-[9px] font-bold">
                          {prod.discount}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="py-40 text-center text-zinc-600 italic">
            No products found in this category yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
         <div className="text-gold animate-pulse font-playfair text-2xl italic tracking-widest">Shri Ji Gold</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

