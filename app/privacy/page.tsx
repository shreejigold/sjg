"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function PrivacyPage() {
  const policies = [
    {
      title: "Data Collection",
      content: "We collect personal information such as name, email, and address only when voluntarily submitted by you during checkout or registration. This is used solely to fulfill your order."
    },
    {
      title: "Secure Transactions",
      content: "All payments are processed through secure gateways. We do not store your credit card or sensitive financial information on our servers."
    },
    {
      title: "Use of Cookies",
      content: "Our website uses cookies to enhance your experience, such as remembering your cart items. You can choose to disable cookies in your browser settings."
    },
    {
      title: "Third-Party Sharing",
      content: "We do not sell or trade your personal information. Data is only shared with trusted partners (like courier services) necessary for delivery."
    },
    {
      title: "Data Protection",
      content: "We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure."
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
             <Sparkles size={16} /> Trust & Security
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-black text-darkbrown uppercase tracking-tighter mb-6">
            Privacy Policy
          </h1>
          <div className="w-24 h-1.5 bg-gold/20 rounded-full" />
        </motion.div>

        <section className="space-y-12">
          {policies.map((policy, idx) => (
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
                   <ShieldCheck size={14} />
                </div>
                <div>
                   <h3 className="text-xl font-playfair font-black text-darkbrown mb-3 uppercase tracking-tight italic">
                     {policy.title}
                   </h3>
                   <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                     {policy.content}
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="mt-20 p-10 rounded-[3rem] bg-gold/5 border border-gold/10 text-center">
           <p className="text-darkbrown/60 text-xs font-bold uppercase tracking-widest leading-relaxed">
             We value your trust above all else. Your data is handled with the same care we give to our craftsmanship.
           </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
