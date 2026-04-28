"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, ShoppingBag, CreditCard,
  MapPin, CheckCircle, Package, Truck,
  User, Phone, Home, Hash, ShieldCheck, Loader2, Plus, Minus, XCircle
} from "lucide-react";
import { CartService, CartItem } from "@/services/cart.service";
import { OrderService } from "@/services/order.service";
import { INDIAN_STATES, PAYMENT_METHODS } from "@/utils/constants";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [primaryMobile, setPrimaryMobile] = useState("");
  const [secondaryMobile, setSecondaryMobile] = useState("");
  const [paymentMethod] = useState("Razorpay");

  useEffect(() => {
    const fetchCart = () => {
      const cart = CartService.getCart();
      if (cart.length === 0 && !isSuccess) {
        router.push("/cart");
        return;
      }
      setCartItems(cart);
      setIsLoading(false);
    };

    fetchCart();
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, [router, isSuccess]);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const updateProductQuantity = (id: string, newQty: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item && newQty > item.stock) {
      showToast(`Only ${item.stock} units of this treasure are currently available.`);
      return;
    }
    CartService.updateQuantity(id, newQty);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 69;
  const grandTotal = subtotal + deliveryCharge;
  const processOrder = async (paymentId: string) => {
    try {
      const result = await OrderService.placeOrder({
        firstName,
        lastName,
        address,
        pinCode,
        state,
        primaryMobile,
        secondaryMobile,
        paymentMethod: 'Razorpay',
        items: cartItems,
        subtotal,
        deliveryCharge,
        total: grandTotal,
        status: 'Pending',
        paymentId: paymentId
      } as any);

      if (result.success) {
        setIsSuccess(true);
        setOrderId(result.orderId!);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Order processing failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (!firstName || !lastName || !address || !pinCode || !state || !primaryMobile) {
      alert("Please enter all required luxury shipping details.");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_test_Sil4mYkV87MBcG",
      amount: grandTotal * 100,
      currency: "INR",
      name: "Shri Ji Gold",
      description: "Heritage Jewelry Purchase",
      handler: function (response: any) {
        processOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: `${firstName} ${lastName}`,
        contact: primaryMobile,
      },
      theme: {
        color: "#d4af37",
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white text-darkbrown font-montserrat flex flex-col pt-32">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-6 w-full py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto py-20 px-8 bg-gold/5 rounded-[4rem] border border-gold/20 shadow-2xl shadow-gold/5"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-gold/10">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-darkbrown mb-6 text-zinc-800">Masterpiece Reserved.</h1>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold font-bold mb-10 leading-loose">
              Your request has been successfully logged in our heritage vault.<br />
              Order ID: <span className="text-darkbrown italic font-normal">{orderId}</span>
            </p>
            <Link href="/collections" className="gold-button inline-flex px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] items-center gap-3 active:scale-95 transition-all">
              Explore New Treasures <ArrowLeft size={16} />
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-darkbrown font-montserrat flex flex-col pt-32 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />

      {/* Dynamic Masterpiece Toast System */}
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
              {toast.type === 'error' ? <XCircle size={22} /> : <CheckCircle size={22} />}
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Legacy System Guard</h5>
              <p className="text-[11px] font-bold tracking-tight">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-6 w-full py-12 md:py-20 lg:py-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 border-b border-gold/10 pb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-darkbrown">Order Checkout</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mt-4 italic">Confirm your shipping details</p>
          </div>
          <Link href="/cart" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-darkbrown/40 hover:text-gold transition-colors font-bold">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32">
          {/* Left: Shipping Form */}
          <section className="space-y-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">First Name *</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={18} />
                    <input
                      required
                      placeholder="e.g. Maharaja"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-5 px-14 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">Last Name *</label>
                  <input
                    required
                    placeholder="e.g. Singh"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-5 px-8 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">Residence Address *</label>
                <div className="relative group">
                  <Home className="absolute left-5 top-5 text-gold/30 group-focus-within:text-gold transition-colors" size={18} />
                  <textarea
                    required
                    placeholder="Complete building, street, and landmark details"
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-5 px-14 outline-none focus:border-gold/50 transition-all font-medium text-sm resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">Pin Code *</label>
                  <div className="relative group">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="6-Digit Code"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-5 px-14 outline-none focus:border-gold/50 transition-all font-medium text-sm tracking-[0.2em]"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">State / Territory *</label>
                  <select
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-5 px-8 outline-none focus:border-gold/50 transition-all font-medium text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select State...</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">Primary Mobile *</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={18} />
                    <input
                      required
                      type="tel"
                      placeholder="Primary Number"
                      value={primaryMobile}
                      onChange={(e) => setPrimaryMobile(e.target.value)}
                      className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-5 px-14 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">Secondary Mobile</label>
                  <input
                    type="tel"
                    placeholder="Alternative (Optional)"
                    value={secondaryMobile}
                    onChange={(e) => setSecondaryMobile(e.target.value)}
                    className="w-full bg-softgray/30 border border-gold/10 rounded-2xl py-5 px-8 outline-none focus:border-gold/50 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 ml-2">Payment Secured By</label>
                <div className="flex items-center gap-4 bg-gold/5 border border-gold/10 p-6 rounded-2xl">
                   <ShieldCheck className="text-gold" size={24} />
                   <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-darkbrown">Razorpay Secured Gateway</h5>
                      <p className="text-[9px] text-zinc-400 font-medium mt-1">Accepting UPI, Cards, Netbanking & Wallets. COD is currently disabled for security.</p>
                   </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full gold-button h-20 rounded-[2rem] font-bold uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 shadow-2xl shadow-gold/20 active:scale-95 transition-all text-sm"
              >
                {isProcessing ? <><Loader2 className="animate-spin" size={24} /> Processing your Request...</> : <>Confirm Order Now <ShieldCheck size={24} /></>}
              </button>
            </form>
          </section>

          {/* Right: Order Summary Preview */}
          <section className="space-y-12">
            <div className="glass-card rounded-[3rem] p-12 border border-gold/10 sticky top-40 bg-white/50 backdrop-blur-sm">
              <h2 className="text-3xl font-playfair font-bold text-darkbrown mb-12 border-b border-gold/10 pb-6 uppercase tracking-widest italic">Inventory Summary</h2>

              <div className="space-y-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-4 mb-12">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-softgray/30 border border-gold/10 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-darkbrown group-hover:text-gold transition-colors">{item.title}</h4>
                        <p className="text-sm font-black text-gold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-softgray/30 rounded-xl p-1 border border-gold/10">
                          <button onClick={() => updateProductQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-gold transition-colors"><Minus size={12} /></button>
                          <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateProductQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-gold transition-colors"><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-12 border-t border-gold/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-darkbrown/50 font-medium tracking-tight uppercase tracking-widest text-[10px]">Item Subtotal</span>
                  <span className="font-bold text-lg">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-darkbrown/50 font-medium tracking-tight uppercase tracking-widest text-[10px]">Delivery Charges</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-gold font-bold uppercase text-[10px] tracking-widest italic">Free</span>
                  ) : (
                    <span className="font-bold text-lg">₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-gold/10">
                  <span className="text-darkbrown font-black uppercase text-xs tracking-[0.3em]">Grand Total</span>
                  <span className="text-4xl font-black text-darkbrown">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Assurance Badges */}
              <div className="mt-16 grid grid-cols-2 gap-8 border-t border-gold/10 pt-10">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 bg-pink/50 rounded-full flex items-center justify-center text-gold">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-darkbrown/40 leading-relaxed">Secured Hallmarked Quality</span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 bg-pink/50 rounded-full flex items-center justify-center text-gold">
                    <Truck size={20} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-darkbrown/40 leading-relaxed">White Glove Nationwide Transit</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
