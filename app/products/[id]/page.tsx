"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ShoppingBag, CreditCard, 
  MapPin, CheckCircle, Package, Truck, 
  Star, Heart, ChevronRight
} from "lucide-react";
import { ProductService } from "@/services/product.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await ProductService.getProductById(id) as any;
        setProduct(data);
        if (data && data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product detail:", error);
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

  if (!product) {
    return (
       <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <h2 className="text-3xl font-playfair italic mb-8 text-darkbrown/40">This piece of art is currently not available.</h2>
          <Link href="/" className="gold-button px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">
             Return to Gallery
          </Link>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-darkbrown font-montserrat flex flex-col pt-32">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full py-12 md:py-20 lg:py-24">
        {/* Breadcrumb / Navigation */}
        <nav className="flex items-center justify-between mb-16 border-b border-gold/10 pb-8">
          <Link 
            href={`/collections/${product.categoryId}`} 
            className="text-darkbrown/50 hover:text-gold transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Return to Collection</span>
          </Link>
          <div className="flex items-center gap-6">
             <Heart size={20} className="text-darkbrown/40 hover:text-red-500 transition-colors cursor-pointer" />
             <ShoppingBag size={20} className="text-darkbrown/40 hover:text-gold transition-colors cursor-pointer" />
          </div>
        </nav>

        {/* Product Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Left: Image Gallery Section */}
          <section className="space-y-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="relative aspect-square rounded-[3rem] overflow-hidden border border-gold/10 bg-white group shadow-2xl shadow-pink/5"
             >
                <img 
                  src={mainImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                {product.discount > 0 && (
                  <div className="absolute top-10 left-10 bg-red-600 px-6 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-500/20">
                     {product.discount}% Exclusive Offer
                  </div>
                )}
             </motion.div>

             <div className="flex justify-center gap-6 py-4">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMainImage(img);
                      setActiveImgIndex(idx);
                    }}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500
                      ${activeImgIndex === idx ? 'border-gold shadow-lg shadow-gold/20' : 'border-gold/5 border-transparent opacity-40 hover:opacity-100'}`}
                  >
                     <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
             </div>
          </section>

          {/* Right: Detailed Information Section */}
          <section className="flex flex-col py-10">
             <div className="mb-4 flex items-center gap-3">
                <span className="bg-pink text-gold px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-gold/10">
                   {product.categoryTitle || "Exquisite Selection"}
                </span>
                <span className="text-darkbrown/40 text-[10px] tracking-widest uppercase font-bold ml-2">
                   ID: {product.productId}
                </span>
             </div>

             <h1 className="font-playfair text-4xl md:text-6xl font-black mb-8 tracking-tight text-darkbrown leading-tight">
                {product.title}
             </h1>

             <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center gap-1 text-gold">
                   {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? "#d4af37" : "transparent"} />)}
                </div>
                <span className="text-darkbrown/40 text-xs tracking-widest uppercase font-medium">(4.8 from 120 reviews)</span>
             </div>

             <div className="mb-12 p-8 bg-softgray/30 rounded-3xl border border-gold/10">
                <div className="flex items-center gap-6 mb-2">
                   <h2 className="text-5xl font-black text-darkbrown">₹{product.sellingPrice.toLocaleString()}</h2>
                   {product.mrp > product.sellingPrice && (
                      <p className="text-xl text-darkbrown/30 line-through italic">₹{product.mrp.toLocaleString()}</p>
                   )}
                </div>
                <p className="text-darkbrown/50 text-[10px] font-bold uppercase tracking-widest font-body italic underline decoration-gold/30">Inclusive of all taxes. Free express shipping nationwide.</p>
             </div>

             <div className="space-y-6 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button className="gold-button w-full py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-gold/20">
                      <CreditCard size={18} /> Buy Now
                   </button>
                   <button className="w-full py-5 rounded-2xl border border-gold/20 hover:border-gold hover:bg-gold/5 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.3em] text-[10px] transition-all group">
                      <ShoppingBag size={18} className="group-hover:text-gold" /> Add to Vault
                   </button>
                </div>
             </div>

             {/* Features / Badges */}
             <div className="grid grid-cols-2 gap-8 border-t border-gold/10 pt-12">
                {[
                  { icon: Package, title: "Exquisite Packaging", desc: "Hand-crafted velvet cases" },
                  { icon: Truck, title: "Express Delivery", desc: "Safe transit (2-4 days)" },
                  { icon: CheckCircle, title: "Hallmark Pure", desc: "Certified 24K Quality" },
                  { icon: MapPin, title: "Made in India", desc: "Artisanal craftsmanship" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-3 group">
                     <div className="w-10 h-10 rounded-xl bg-pink/50 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                        <item.icon size={20} />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-darkbrown mb-1">{item.title}</h4>
                        <p className="text-[10px] text-darkbrown/50 font-medium">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Similar Item Section Preview */}
        <section className="py-32 mt-20 border-t border-gold/10 text-center">
           <h3 className="font-playfair text-4xl font-black italic mb-4 text-darkbrown">Inspired by this piece</h3>
           <p className="text-darkbrown/40 text-[10px] tracking-[0.4em] uppercase mb-16 font-bold">Handpicked for you from the same heritage collection</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-softgray rounded-[3rem] border border-gold/5 flex items-center justify-center overflow-hidden">
                   <div className="w-20 h-20 border border-gold/10 rounded-full animate-pulse" />
                </div>
              ))}
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
