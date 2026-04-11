"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ShoppingBag, CreditCard, 
  MapPin, CheckCircle, Package, Truck, 
  Star, Heart, ChevronRight, XCircle, CheckCircle as CheckIcon
} from "lucide-react";
import { ProductService } from "@/services/product.service";
import { NewProductService } from "@/services/newProduct.service";
import { CategoryService } from "@/services/category.service";
import { CartService } from "@/services/cart.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let prodData = await ProductService.getProductById(id) as any;
        let collectionType: 'products' | 'newProducts' = 'products';

        if (!prodData) {
          prodData = await NewProductService.getProductById(id) as any;
          collectionType = 'newProducts';
        }

        if (prodData) {
          // Fetch associated category to check for category-level discount
          const catData = await CategoryService.getCategoryById(prodData.categoryId);
          
          // Discount Logic: Category discount overrides product discount if > 0
          const finalDiscount = (catData && (catData.discount ?? 0) > 0) ? catData.discount! : prodData.discount;
          const finalSellingPrice = Math.round(prodData.mrp * (1 - finalDiscount / 100));

          const enrichedProduct = {
            ...prodData,
            discount: finalDiscount,
            sellingPrice: finalSellingPrice,
            collectionType // Tag it
          };

          setProduct(enrichedProduct);
          if (enrichedProduct.images && enrichedProduct.images.length > 0) {
            setMainImage(enrichedProduct.images[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Safety check for out of stock
    if (product.totalQuantity <= 0) {
      showToast("This masterpiece is currently out of stock and cannot be added to your vault.", "error");
      return;
    }

    // Check if adding one more exceeds stock
    const cart = CartService.getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing && existing.quantity >= product.totalQuantity) {
        showToast(`Our artisans currently have only ${product.totalQuantity} units of this piece in the vault.`, "error");
        return;
    }

    CartService.addToCart({
      id: product.id,
      productId: product.productId,
      title: product.title,
      price: product.sellingPrice,
      image: product.images[0],
      quantity: 1,
      stock: product.totalQuantity,
      collection: product.collectionType
    });

    setIsAdded(true);
    showToast("Masterpiece added to your vault.", "success");
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

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
    <div className="min-h-screen bg-white text-darkbrown font-montserrat flex flex-col pt-32 relative">
      <Header />

      {/* Legacy Toast System */}
      <div className="fixed top-32 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
          {toast && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className={`p-6 rounded-[2rem] shadow-2xl backdrop-blur-xl border flex items-center gap-5 max-w-md pointer-events-auto
                ${toast.type === 'error' ? 'bg-white/95 border-red-500/20 text-darkbrown' : 'bg-gold/90 text-white border-gold/30'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                   ${toast.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-white/20 text-white'}`}>
                {toast.type === 'error' ? <XCircle size={22} /> : <CheckIcon size={22} />}
              </div>
              <div>
                 <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Vault Inventory Guard</h5>
                 <p className="text-[11px] font-bold tracking-tight">{toast.message}</p>
              </div>
            </motion.div>
          )}
      </div>
      
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
               className="relative aspect-square rounded-3xl overflow-hidden border border-gold/10 bg-white group shadow-xl shadow-pink/5"
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
                <span className="border border-gold/20 text-gold px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                   Wearable: {product.gender}
                </span>
                <span className="text-darkbrown/40 text-[10px] tracking-widest uppercase font-bold ml-2">
                   ID: {product.productId}
                </span>
             </div>

             <h1 className="font-playfair text-3xl md:text-5xl font-black mb-6 tracking-tight text-darkbrown leading-tight">
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
                   <h2 className="text-4xl font-black text-darkbrown">₹{product.sellingPrice.toLocaleString()}</h2>
                   {product.mrp > product.sellingPrice && (
                      <p className="text-xl text-darkbrown/30 line-through italic">₹{product.mrp.toLocaleString()}</p>
                   )}
                </div>
                 <p className="text-darkbrown/50 text-[10px] font-bold uppercase tracking-widest font-body italic underline decoration-gold/30">Inclusive of all taxes. Free express shipping nationwide.</p>
                 
                 {/* Stock Status Indicator */}
                 <div className="mt-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.totalQuantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${product.totalQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {product.totalQuantity > 0 ? `Exquisite Masterpiece Available` : "Currently Out of Stock"}
                    </span>
                 </div>
              </div>

             <div className="space-y-6 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button 
                     onClick={handleBuyNow}
                     disabled={product.totalQuantity <= 0}
                     className={`gold-button w-full py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-gold/20
                       ${product.totalQuantity <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95'}`}
                   >
                      <CreditCard size={18} /> Buy Now
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      disabled={product.totalQuantity <= 0}
                      className={`w-full py-5 rounded-2xl border flex items-center justify-center gap-3 font-bold uppercase tracking-[0.3em] text-[10px] transition-all group
                        ${product.totalQuantity <= 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 
                          isAdded ? "bg-gold text-white border-gold shadow-lg shadow-gold/20" : "border-gold/20 hover:border-gold hover:bg-gold/5"}`}
                    >
                       <ShoppingBag size={18} className={isAdded ? "text-white" : "group-hover:text-gold"} /> 
                       {product.totalQuantity <= 0 ? "Out of Stock" : isAdded ? "Added to Cart" : "Add to Cart"}
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
           
           <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 opacity-40">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-softgray/50 rounded-2xl border border-gold/5 flex items-center justify-center overflow-hidden">
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
