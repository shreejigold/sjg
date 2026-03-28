"use client";

import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-20 bg-softgray px-6 md:px-12 border-t border-gold/10">
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
             <h3 className="font-playfair text-2xl font-bold text-gold mb-6 uppercase tracking-widest">Shri Ji Gold</h3>
             <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-8">
                Exquisite craftsmanship from the heart of India. Dedicated to delivering purity and timeless elegance since decades.
             </p>
             <div className="flex gap-6">
                <a href="https://www.instagram.com/shrijigold_02" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#5B3E29] transition-colors" aria-label="Instagram">
                   <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/people/Shri-Ji-Gold/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#5B3E29] transition-colors" aria-label="Facebook">
                   <Facebook size={20} />
                </a>
                <a href="mailto:contact@shrijigold.com" className="text-zinc-500 hover:text-[#5B3E29] transition-colors" aria-label="Email">
                   <Mail size={20} />
                </a>
             </div>
          </div>

          <div>
             <h4 className="text-[10px] uppercase tracking-widest font-bold text-gold mb-8">Information</h4>
             <ul className="space-y-4 text-xs text-zinc-400">
                <li><a href="/collections" className="hover:text-white transition-colors">Our Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-[10px] uppercase tracking-widest font-bold text-gold mb-8">Visit Us</h4>
             <ul className="space-y-4 text-xs text-zinc-400">
                <li className="flex items-center gap-3"><MapPin size={14} className="text-gold" /> Jaunpur, Uttar Pradesh</li>
                <li className="flex items-center gap-3"><Mail size={14} className="text-gold" /> contact@shrijigold.com</li>
                <li className="flex items-center gap-3">Available: 10AM - 8PM</li>
             </ul>
          </div>
       </div>
       
       <div className="mt-20 pt-8 border-t border-gold/10 text-center text-[10px] uppercase tracking-[0.3em] text-darkbrown/40">
          © 2026 Shri Ji Gold. All Rights Reserved. Crafted for Purity.
       </div>
    </footer>
  );
}
