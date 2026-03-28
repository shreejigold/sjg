"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Trash2, Plus, Minus, 
  ArrowRight, ArrowLeft, CreditCard,
  Package, Truck, ShieldCheck, Loader2, CheckCircle2
} from "lucide-react";
import { CartService, CartItem } from "@/services/cart.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCart = () => {
      setCartItems(CartService.getCart());
      setIsLoading(false);
    };

    fetchCart();
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, []);

  const updateQuantity = (id: string, newQty: number) => {
    CartService.updateQuantity(id, newQty);
  };

  const removeItem = (id: string) => {
    CartService.removeFromCart(id);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push("/checkout");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b border-gold/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-darkbrown">Your Vault</h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold font-bold">
               <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
            </div>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-8">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-gold/5 group"
                    >
                      {/* Product Image */}
                      <Link href={`/products/${item.id}`} className="relative w-full sm:w-40 aspect-[4/5] rounded-3xl overflow-hidden bg-softgray/30 border border-gold/10 group-hover:border-gold/30 transition-colors">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <Link href={`/products/${item.id}`}>
                              <h3 className="text-xl font-bold text-darkbrown hover:text-gold transition-colors">{item.title}</h3>
                            </Link>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-darkbrown/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-[10px] text-darkbrown/40 uppercase tracking-widest font-bold mb-6">ID: {item.productId}</p>
                        </div>

                        <div className="flex items-center justify-between">
                           {/* Quantity Selector */}
                           <div className="flex items-center gap-4 bg-softgray/50 rounded-2xl p-1 border border-gold/5">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-darkbrown hover:bg-gold hover:text-white transition-all shadow-sm"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-darkbrown hover:bg-gold hover:text-white transition-all shadow-sm"
                              >
                                <Plus size={14} />
                              </button>
                           </div>

                           <div className="text-right">
                              <p className="text-sm text-darkbrown/40 italic mb-1">Price per unit: ₹{item.price.toLocaleString()}</p>
                              <p className="text-xl font-black text-darkbrown">₹{(item.price * item.quantity).toLocaleString()}</p>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <Link 
                  href="/collections" 
                  className="inline-flex items-center gap-3 text-gold hover:text-gold-dark transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                 <div className="bg-softgray/30 rounded-[3rem] p-10 border border-gold/10 sticky top-40">
                    <h2 className="text-2xl font-playfair font-bold text-darkbrown mb-8">Order Summary</h2>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex justify-between text-sm">
                          <span className="text-darkbrown/60 font-medium tracking-tight">Vault Subtotal</span>
                          <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-darkbrown/60 font-medium tracking-tight">Express Shipping</span>
                          <span className="text-gold font-bold uppercase text-[10px] tracking-widest">Complimentary</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-darkbrown/60 font-medium tracking-tight">Packaging Fee</span>
                          <span className="text-gold font-bold uppercase text-[10px] tracking-widest">Included</span>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gold/10 mb-10">
                       <div className="flex justify-between items-end">
                          <span className="text-darkbrown font-bold uppercase text-xs tracking-[0.2em]">Total</span>
                          <span className="text-3xl font-black text-darkbrown">₹{subtotal.toLocaleString()}</span>
                       </div>
                       <p className="text-[10px] text-darkbrown/30 mt-2 font-medium">Inclusive of all applicable taxes</p>
                    </div>

                    <button 
                       onClick={handleCheckout}
                       className="w-full bg-gold hover:bg-gold-dark text-white py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-gold/20 mb-8 active:scale-95"
                    >
                       Secure Your Order <ArrowRight size={16} />
                    </button>

                    {/* Features list in summary */}
                    <div className="space-y-4">
                       {[
                         { icon: ShieldCheck, text: "Hallmark Certified Gold" },
                         { icon: Truck, text: "Insured Transit Protection" },
                         { icon: Package, text: "Exquisite Signature Wrapping" }
                       ].map((feat, idx) => (
                         <div key={idx} className="flex items-center gap-3 text-darkbrown/40 group">
                           <feat.icon size={14} className="text-gold/60 group-hover:text-gold transition-colors" />
                           <span className="text-[9px] font-bold uppercase tracking-wider">{feat.text}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-40 bg-gold/5 rounded-[4rem] border border-gold/20">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gold/10">
                  <CheckCircle2 size={40} className="text-green-500" />
               </div>
               <h2 className="text-3xl font-playfair font-bold text-darkbrown mb-4 text-zinc-800">Transaction Authorized!</h2>
               <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-10">Your masterpieces are being prepared for transit.</p>
               <Link href="/collections" className="gold-button inline-flex px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] items-center gap-3">
                  Return to Gallery <ArrowLeft size={16} />
               </Link>
            </div>
          ) : (
            <div className="text-center py-40 bg-softgray/20 rounded-[4rem] border border-dashed border-gold/10">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gold/5">
                  <ShoppingBag size={40} className="text-gold/30" />
               </div>
               <h2 className="text-3xl font-playfair italic text-darkbrown/60 mb-8">Your vault is currently empty.</h2>
               <Link href="/collections" className="gold-button inline-flex px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] items-center gap-3">
                  Explore Collections <ArrowRight size={16} />
               </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
