"use client";

import { useState, useEffect } from "react";
import { CategoryService } from "@/services/category.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import TrendingCategories from "@/components/home/TrendingCategories"; // ADDED
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedQuote from "@/components/home/FeaturedQuote";
import InstagramReels from "@/components/home/InstagramView";


export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getCategories();
        // Filter out hidden categories
        setCategories(data.filter((cat: any) => !cat.hide));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const trendingCategories = categories.filter((cat: any) => cat.trending);
  const normalCategories = categories.filter((cat: any) => !cat.trending);

  return (
    <div className="min-h-screen bg-white text-darkbrown font-montserrat selection:bg-gold selection:text-white">
      <Header />

      <main>
        <Hero />
        <TrendingCategories categories={trendingCategories} />
        <Categories categories={normalCategories} />
        <NewArrivals />
        <InstagramReels />
        <FeaturedQuote />
      </main>

      <Footer />
    </div>
  );
}
