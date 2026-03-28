"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Menu,
  X,
  Gem,
  Gift,
  Phone,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  CircleDot,
  Disc,
  Heart,
  Info,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CategoryService } from "@/services/category.service";
import { CartService } from "@/services/cart.service";

const navLinks = [
  { name: "All Collections", href: "/collections", icon: LayoutGrid },
  { name: "Necklace", href: "/products?catId=TuBYL1pHFtMO7ADcNh9l&type=Necklace", icon: Sparkles },
  { name: "Ring", href: "/products?catId=8rIGQVVx0iontx0dTtwb&type=Ring", icon: CircleDot },
  { name: "Earrings", href: "/products?catId=2MDq8TDjlRjWwese3nAU&type=Earrings", icon: Disc },
  { name: "Bridal Special", href: "/products?catId=JR73gePCr49jMfh9FI1i&type=Bridal+Jewellery", icon: Heart },
  { name: "About us", href: "/about", icon: Info },
  { name: "Contact us", href: "/contact", icon: Phone },
];

const actionIcons = [
  // { name: "Diamond", icon: Gem, href: "/products?type=Diamond&catId=3j5DpRKto3RYSmn3uFdG" },
  { name: "Gift", icon: Gift, href: "/products?catId=2nPvppQlM38rwfU04GXW&type=Gifting" },
  { name: "Contact", icon: Phone, href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(CartService.getCartCount());
    };

    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    return () => window.removeEventListener("cart-updated", updateCartCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const categories = await CategoryService.getCategories();
      const queryLower = searchQuery.toLowerCase().trim();

      let bestMatch: any = null;
      let bestScore = 0;

      categories.forEach((cat: any) => {
        const titleLower = (cat.title || "").toLowerCase();

        // 1. Exact match (highest priority)
        if (titleLower === queryLower) {
          bestMatch = cat;
          bestScore = 101; // Beat any fuzzy match
          return;
        }

        // 2. Includes
        if (titleLower.includes(queryLower) || queryLower.includes(titleLower)) {
          const overlapScore = Math.min(titleLower.length, queryLower.length) / Math.max(titleLower.length, queryLower.length) * 100;
          if (overlapScore > bestScore) {
            bestScore = overlapScore;
            bestMatch = cat;
          }
        }

        // 3. Character match (fuzzy 50-60%)
        const queryChars = queryLower.split("");
        const matchedChars = queryChars.filter(char => titleLower.includes(char)).length;
        const fuzzyScore = (matchedChars / queryLower.length) * 100;

        if (fuzzyScore >= 50 && fuzzyScore > bestScore) {
          bestScore = fuzzyScore;
          bestMatch = cat;
        }
      });

      if (bestMatch) {
        router.push(`/products?catId=${bestMatch.id}&type=${encodeURIComponent(bestMatch.title)}`);
        setSearchQuery("");
        setMobileMenuOpen(false);
      } else {
        alert("No matching category found. Please try searching for something else.");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Main Header Row */}
      <div className={`w-full bg-white transition-all duration-300 ${isScrolled ? "py-1 shadow-md" : "pt-4 pb-1"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4 md:gap-8 text-black">

          {/* Left: Logo & Mobile Hamburger */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/assets/logo.png"
                alt="Shri Ji Gold"
                width={70}
                height={50}
                className="w-auto h-10 md:h-12 object-contain"
                priority
              />
            </Link>
            <button
              id="mobile-menu-toggle"
              className="lg:hidden p-2 hover:bg-pearl rounded-full transition-colors text-darkbrown"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Middle: Minimalist Search Box */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-xl relative group">
            <input
              type="text"
              placeholder={isSearching ? "Searching..." : "Search for jewelry, diamonds and more..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
              className="w-full bg-softgray/10 border border-gray-100 rounded-full py-2 px-5 pl-12 focus:outline-none focus:ring-1 focus:ring-gold-300 transition-all text-[13px] font-medium text-darkbrown disabled:opacity-50"
            />
            <button type="submit" disabled={isSearching} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold-400 transition-colors">
              <Search size={16} />
            </button>
          </form>

          {/* Right: Action Icons - More refined */}
          <div className="flex items-center gap-6 md:gap-8">
            {actionIcons.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center group transition-all gap-1"
              >
                <item.icon size={20} className="text-gold group-hover:text-gold-600 transition-colors stroke-[1.5px]" />
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 group-hover:text-darkbrown transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}

            <Link
              href="/cart"
              className="flex flex-col items-center group transition-all gap-1 relative"
            >
              <div className="relative">
                <ShoppingBag size={20} className="text-gold group-hover:text-gold-600 transition-colors stroke-[1.5px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 group-hover:text-darkbrown transition-colors">
                Cart
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Row - Precision Spacing */}
      <nav className={`hidden lg:block w-full bg-white transition-all duration-300 ${isScrolled ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center justify-center gap-10 py-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-[13px] font-semibold text-darkbrown/80 hover:text-gold transition-all flex items-center gap-2 group py-1 relative"
                >
                  <link.icon size={15} className="text-gray-400 group-hover:text-gold transition-all duration-300 stroke-[1.2px]" />
                  <span className="tracking-tight transition-all duration-300 whitespace-nowrap">
                    {link.name}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gold/80 transition-all duration-500 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden w-full bg-white px-4 pb-3">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder={isSearching ? "Searching..." : "Search jewelry..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            className="w-full bg-softgray/30 border border-softgray rounded-full py-2 px-4 pl-10 focus:outline-none text-sm text-black disabled:opacity-50"
          />
          <button type="submit" disabled={isSearching} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-softgray">
                <Image
                  src="/assets/logo.png"
                  alt="Shri Ji Gold"
                  width={60}
                  height={40}
                  className="w-auto h-8 object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-pearl rounded-full transition-colors text-darkbrown"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-grow overflow-y-auto py-6">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-6 py-3.5 text-darkbrown/90 font-medium hover:bg-pearl hover:text-gold-400 transition-all border-l-4 border-transparent hover:border-gold-400"
                      >
                        <div className="flex items-center gap-3">
                          <link.icon size={18} className="text-gray-400" />
                          <span>{link.name}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-6 border-t border-softgray bg-pearl/30">
                <div className="flex gap-4">
                  {actionIcons.map((item) => (
                    <Link key={item.name} href={item.href} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-gold-400 transition-colors">
                        <item.icon size={20} className="text-gold" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
