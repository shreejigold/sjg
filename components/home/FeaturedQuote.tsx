"use client";

export default function FeaturedQuote() {
  return (
    <section className="py-32 bg-pink/20 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
       <div className="max-w-4xl mx-auto text-center px-6 italic">
          <p className="font-playfair text-2xl md:text-4xl text-darkbrown/80 leading-relaxed underline decoration-gold/20 underline-offset-8">
             "Jewelry has the power to be the one little thing that makes you feel unique."
          </p>
          <p className="mt-8 uppercase tracking-[0.4em] text-gold text-xs font-bold">
             Shri Ji Gold Philosphy
          </p>
       </div>
       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
