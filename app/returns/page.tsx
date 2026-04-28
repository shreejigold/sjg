"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { RefreshCcw, Sparkles } from "lucide-react";

export default function ReturnsPage() {
  const points = [
    {
      title: "Refunds",
      content: "We have a strict no refund policy. We do not offer refunds on any purchases."
    },
    {
      title: "Exchanges",
      content: "Exchanges are only allowed within 7 days of delivery, and strictly in the case of a defected product or wrong product delivery. Valid proof of the defect or incorrect item is required."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-montserrat flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="flex items-center gap-3 text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6">
             <Sparkles size={16} /> Satisfaction Guarantee
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-black text-darkbrown uppercase tracking-tighter mb-6">
            Returns & Exchanges
          </h1>
          <div className="w-24 h-1.5 bg-gold/20 rounded-full" />
        </motion.div>

        <section className="space-y-12">
          {points.map((point, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex items-start gap-6">
                <div className="mt-1 w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                   <RefreshCcw size={14} />
                </div>
                <div>
                   <h3 className="text-xl font-playfair font-black text-darkbrown mb-3 uppercase tracking-tight italic">
                     {point.title}
                   </h3>
                   <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                     {point.content}
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="mt-20 p-10 rounded-[3rem] bg-darkbrown text-white text-center shadow-2xl shadow-black/10">
           <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Need help with a return?</p>
           <a 
             href="/contact" 
             className="text-gold text-lg font-playfair font-black italic hover:text-white transition-colors border-b border-gold/30 pb-1"
           >
             Contact our concierge desk →
           </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
