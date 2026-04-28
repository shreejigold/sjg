"use client";

import { Phone, Mail, Clock, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function ContactPage() {
  const contactDetails = {
    phone: "+91 88086 88002",
    whatsapp: "+918808688002",
    email: "shreejigold02@gmail.com",
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
                <div className="flex gap-4">
                  <a 
                    href={`tel:${contactDetails.phone.replace(/\s/g, '')}`} 
                    className="px-6 py-3 bg-darkbrown text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:bg-gold active:scale-95 shadow-lg shadow-black/10"
                  >
                    Call Now
                  </a>
                  <a 
                    href={`https://wa.me/${contactDetails.whatsapp}`} 
                    target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#25D366] text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:bg-[#128C7E] active:scale-95 shadow-lg shadow-black/10"
                  >
                    WhatsApp
                  </a>
                </div>
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
                   <div className="flex flex-col items-center gap-4">
                      <a 
                        href={`https://wa.me/${contactDetails.whatsapp}`} 
                        target="_blank" rel="noopener noreferrer"
                        className="w-20 h-20 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-[#25D366]/20 group"
                      >
                         <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      </a>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">WhatsApp</span>
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
