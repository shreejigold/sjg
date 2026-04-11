"use client";

import { Phone, Mail, Clock, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function ContactPage() {
  const contactDetails = {
    phone: "+91 99999 99999",
    email: "contact@shrijigold.com",
    timings: "10:00 AM - 8:00 PM",
    address: "Jaunpur, Uttar Pradesh, India"
  };

  return (
    <div className="min-h-screen bg-white font-montserrat flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 md:pt-40">
        {/* Hero Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-3 text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6">
               <Sparkles size={16} /> Concierge Services
            </div>
            <h1 className="font-playfair text-4xl md:text-7xl font-black text-darkbrown uppercase tracking-tighter mb-8 max-w-4xl leading-[0.9]">
               Connect with elegance
            </h1>
            <div className="w-24 h-1.5 bg-gold/20 rounded-full mb-10" />
            <p className="text-zinc-500 max-w-2xl text-sm md:text-base leading-relaxed font-medium">
               Whether you're seeking a custom masterpiece or require assistance with an order, our dedicated team is at your service. Experience the gold standard of care.
            </p>
          </motion.div>
        </section>

        {/* Contact Info Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {/* Contact Card 1: Phone */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               viewport={{ once: true }}
               whileHover={{ y: -10 }}
               className="p-10 rounded-[3.5rem] bg-softgray/30 border border-gold/10 flex flex-col items-center text-center group transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:bg-white"
             >
                <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-xl shadow-gold/5">
                   <Phone size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Immediate Assistance</h3>
                <p className="text-2xl font-playfair font-black text-darkbrown mb-6">{contactDetails.phone}</p>
                <a 
                  href={`tel:${contactDetails.phone.replace(/\s/g, '')}`} 
                  className="px-8 py-3 bg-darkbrown text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:bg-gold active:scale-95 shadow-lg shadow-black/10"
                >
                  Call Now
                </a>
             </motion.div>

             {/* Contact Card 2: Email */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               viewport={{ once: true }}
               whileHover={{ y: -10 }}
               className="p-10 rounded-[3.5rem] bg-gold/5 border border-gold/10 flex flex-col items-center text-center group transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:bg-white"
             >
                <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-xl shadow-gold/5">
                   <Mail size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Electronic Registry</h3>
                <p className="text-2xl font-playfair font-black text-darkbrown mb-6">{contactDetails.email}</p>
                <a 
                  href={`mailto:${contactDetails.email}`} 
                  className="px-8 py-3 bg-darkbrown text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:bg-gold active:scale-95 shadow-lg shadow-black/10"
                >
                  Send Inquiry
                </a>
             </motion.div>

             {/* Contact Card 3: Timings */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               viewport={{ once: true }}
               whileHover={{ y: -10 }}
               className="p-10 rounded-[3.5rem] bg-softgray/30 border border-gold/10 flex flex-col items-center text-center group transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:bg-white"
             >
                <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-xl shadow-gold/5">
                   <Clock size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Availability</h3>
                <p className="text-2xl font-playfair font-black text-darkbrown mb-6">{contactDetails.timings}</p>
                <div className="px-8 py-3 bg-pearl/50 border border-gold/10 rounded-full text-[9px] font-black uppercase tracking-widest text-darkbrown italic">
                  Operational 7 Days
                </div>
             </motion.div>
          </div>
        </section>

        {/* Support Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
          <div className="bg-darkbrown rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-pearl opacity-[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left space-y-8">
                   <div className="inline-flex items-center gap-2 border border-gold/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gold bg-gold/5">
                      <Sparkles size={14} /> Any Query?
                   </div>
                   <h2 className="text-4xl md:text-6xl font-playfair font-bold leading-tight">Your legacy is our <span className="text-gold italic">Priority.</span></h2>
                   <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                      Reach out for custom order requests, wedding collections, or after-sales support. We ensure every interaction is as pure as our gold.
                   </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-end">
                   <div className="flex flex-col items-center gap-4">
                      <a 
                        href={`tel:${contactDetails.phone.replace(/\s/g, '')}`} 
                        className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-gold/20 group"
                      >
                         <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                      </a>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Call Support</span>
                   </div>
                   <div className="hidden sm:flex items-center">
                      <div className="w-16 h-[1px] bg-white/10" />
                   </div>
                   <div className="flex flex-col items-center gap-4">
                      <a 
                        href={`mailto:${contactDetails.email}`} 
                        className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-darkbrown hover:scale-110 active:scale-95 transition-all group"
                      >
                         <Mail size={24} className="group-hover:-translate-y-1 transition-transform" />
                      </a>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Query</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32 text-center">
           <div className="flex flex-col items-center space-y-6">
              <div className="p-4 bg-softgray rounded-3xl inline-block mb-4">
                 <MapPin className="text-gold" size={32} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Flagship Boutique</h3>
              <p className="text-xl md:text-2xl font-playfair font-black text-darkbrown">{contactDetails.address}</p>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
