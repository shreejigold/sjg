"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "Agreement to Terms",
      content: "By accessing and using Shri Ji Gold, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our services."
    },
    {
      title: "Intellectual Property",
      content: "All content, designs, images, and logos on this website are the intellectual property of Shri Ji Gold. Unauthorized use is strictly prohibited."
    },
    {
      title: "Product Accuracy",
      content: "We strive for perfect accuracy in product descriptions and pricing. However, errors may occur. We reserve the right to correct any errors and cancel orders if necessary."
    },
    {
      title: "Purity Guarantee",
      content: "Every item from Shri Ji Gold comes with a guarantee of purity as specified. We adhere to the highest standards of hallmarking and quality control."
    },
    {
      title: "User Conduct",
      content: "Users are expected to use the website for its intended purpose. Any fraudulent activity or attempt to compromise site security will result in legal action."
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
             <Sparkles size={16} /> Legal Framework
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-black text-darkbrown uppercase tracking-tighter mb-6">
            Terms of Service
          </h1>
          <div className="w-24 h-1.5 bg-gold/20 rounded-full" />
        </motion.div>

        <section className="space-y-12">
          {sections.map((section, idx) => (
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
                   <FileText size={14} />
                </div>
                <div>
                   <h3 className="text-xl font-playfair font-black text-darkbrown mb-3 uppercase tracking-tight italic">
                     {section.title}
                   </h3>
                   <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                     {section.content}
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="mt-20 p-10 rounded-[3rem] bg-softgray/30 border border-gold/10 text-center">
           <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
             Last Updated: April 2026
           </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
