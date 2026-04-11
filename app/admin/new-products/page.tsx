"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Image as ImageIcon, Tag, EyeOff, Eye, 
  Loader2, Trash2, CheckCircle2, User, 
  DollarSign, Percent, Briefcase, Users, X, Hash, Search, RefreshCw, LayoutGrid,
  Sparkles
} from "lucide-react";
import { ImageUtils } from "@/utils/image";
import { NewProductService } from "@/services/newProduct.service";
import { CategoryService } from "@/services/category.service";
import Sidebar from "@/components/admin/Sidebar";

export default function NewProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Product Form State
  const [title, setTitle] = useState("");
  const [mrp, setMrp] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [hide, setHide] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      fetchCategoriesOnly();
    }
  }, [router]);

  useEffect(() => {
    const calculatedPrice = mrp - (mrp * (discount / 100));
    setSellingPrice(Math.round(calculatedPrice));
  }, [mrp, discount]);

  const fetchCategoriesOnly = async () => {
    const cats = await CategoryService.getCategories();
    setCategories(cats);
  };

  const handleFetchByCategory = async () => {
    if (!filterCategory) {
      alert("Please select a category first.");
      return;
    }
    setIsRefreshing(true);
    setHasSearched(true);
    try {
      let prods;
      if (filterCategory === "all") {
        prods = await NewProductService.getProducts();
      } else {
        prods = await NewProductService.getProductsByCategory(filterCategory);
      }

      // Enrich products with category discount logic
      const catMap = categories.reduce((acc: any, cat: any) => {
        acc[cat.id] = cat;
        return acc;
      }, {});

      const enrichedProds = (prods as any[]).map((prod: any) => {
        const category = catMap[prod.categoryId];
        const effectiveDiscount = (category && category.discount > 0) ? category.discount : prod.discount;
        const effectiveSellingPrice = Math.round(prod.mrp * (1 - effectiveDiscount / 100));
        
        return {
          ...prod,
          discount: effectiveDiscount,
          sellingPrice: effectiveSellingPrice
        };
      });

      setProducts(enrichedProds);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (images.length >= 3) {
        alert("Maximum of 3 images allowed.");
        return;
      }
      try {
        const base64 = await ImageUtils.compressAndConvertToBase64(e.target.files[0], 120);
        setImages((prev) => [...prev, base64]);
      } catch (err) {
        console.error("Image processing failed", err);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || images.length === 0 || !selectedCategory) {
      alert("Please provide title, images, and category.");
      return;
    }

    const categoryObj = categories.find(c => c.id === selectedCategory);
    if (!categoryObj) return;

    setIsLoading(true);
    const productPayload = {
      title,
      mrp: Number(mrp),
      discount: Number(discount),
      sellingPrice,
      categoryId: selectedCategory,
      categoryTitle: categoryObj.title,
      gender,
      hide,
      images,
      totalQuantity: Number(totalQuantity),
    };

    let result;
    if (isEditing && editId) {
       result = await NewProductService.updateProduct(editId, productPayload);
    } else {
       result = await NewProductService.createProduct(productPayload);
    }

    if (result.success) {
      setSuccessMsg(isEditing ? "Updated seasonal piece successfully!" : "Seasonal masterpiece logged.");
      resetForm();
      if (hasSearched) handleFetchByCategory();
      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setMrp(0);
    setDiscount(0);
    setImages([]);
    setHide(false);
    setTotalQuantity(1);
    setIsEditing(false);
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Securely dispose of this masterpiece record?")) return;
    const result = await NewProductService.deleteProduct(id);
    if (result.success) {
      handleFetchByCategory();
    }
  };

  const startEdit = (prod: any) => {
    setTitle(prod.title);
    setMrp(prod.mrp);
    setDiscount(prod.discount);
    setImages(prod.images);
    setHide(prod.hide);
    setGender(prod.gender);
    setSelectedCategory(prod.categoryId);
    setTotalQuantity(prod.totalQuantity || 0);
    setIsEditing(true);
    setEditId(prod.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-softgray/50 text-darkbrown font-montserrat flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-white/50">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 md:px-10 py-6 border-b border-gold/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-darkbrown">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold">New Arrival Curator</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">Manage seasonal highlights & innovative designs</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 text-gold">
            <User size={18} />
          </div>
        </header>

        <div className="p-6 md:p-10 w-full max-w-[1500px] mx-auto space-y-20">
          {/* TOP: Form Section (Stack Layout) */}
          <section className="space-y-8">
            <div className="glass-card rounded-[3rem] border border-gold/10 p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-pink/5 bg-white">
              <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
                <Sparkles size={340} className="text-gold" />
              </div>

              <div className="flex items-center justify-between mb-12 relative z-10">
                <h2 className="text-3xl font-playfair font-bold text-gold flex items-center gap-4">
                  {isEditing ? <RefreshCw className="animate-spin text-gold" size={28} /> : <Plus className="text-gold" size={28} />}
                  {isEditing ? "Refine Seasonal Piece" : "Add New Arrival"}
                </h2>
                {isEditing && (
                  <button onClick={resetForm} className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-6 py-2.5 rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                    Discard Changes
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2">Display Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Maharani Heritage Necklace" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-softgray border border-gold/10 rounded-2xl py-5 px-8 outline-none focus:border-gold/50 transition-all font-medium text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2 text-center block">MRP (₹)</label>
                      <input type="number" value={mrp || ""} onChange={(e) => setMrp(Number(e.target.value))} className="w-full bg-white border border-gold/10 rounded-2xl py-5 px-4 text-center font-bold text-xl text-darkbrown" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2 text-center block">Off (%)</label>
                      <input type="number" value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full bg-white border border-gold/10 rounded-2xl py-5 px-4 text-center font-bold text-xl text-red-500" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold ml-2 text-center block">Selling Price</label>
                      <div className="w-full h-[76px] bg-gold/10 border border-gold/30 rounded-2xl flex items-center justify-center font-bold text-gold text-xl shadow-lg shadow-gold/5">
                        ₹{sellingPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2">Collection Category</label>
                        <select 
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-softgray border border-gold/10 rounded-2xl py-5 px-6 appearance-none focus:border-gold/50 text-sm font-semibold"
                        >
                          <option value="">Select Category...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                          ))}
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2 text-center block">Target Aura</label>
                        <div className="flex bg-softgray border border-gold/10 rounded-2xl p-1.5 gap-2 h-[66px]">
                          {['Male', 'Female', 'Unisex'].map((g) => (
                            <button
                               key={g}
                               type="button"
                               onClick={() => setGender(g)}
                               className={`flex-1 rounded-xl text-[9px] font-black uppercase transition-all duration-300 ${gender === g ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-zinc-400 hover:text-darkbrown'}`}
                            >
                               {g}
                            </button>
                          ))}
                        </div>
                     </div>
                  </div>
                </div>

                <div className="space-y-10">
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2 flex justify-between">
                         Media Assets <span className="text-zinc-400">{images.length}/3 Limit</span>
                      </label>
                      <div className="grid grid-cols-3 gap-6">
                         {images.map((img, idx) => (
                           <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border border-gold/20 group">
                              <img src={img} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                 <X size={14} />
                              </button>
                           </div>
                         ))}
                         {images.length < 3 && (
                           <button 
                             type="button" 
                             onClick={() => document.getElementById('newProdInp')?.click()}
                             className="aspect-square rounded-[2rem] border-2 border-dashed border-gold/10 bg-softgray flex flex-col items-center justify-center gap-3 hover:border-gold/30 hover:bg-white transition-all"
                           >
                              <ImageIcon className="text-gold" size={24} />
                              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Add Image</span>
                              <input id="newProdInp" type="file" className="hidden" onChange={handleImageUpload} />
                           </button>
                         )}
                      </div>
                   </div>

                  <div className="space-y-3 pt-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2">Available Quantity (In Stock)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50" 
                      value={totalQuantity || ""}
                      onChange={(e) => setTotalQuantity(Number(e.target.value))}
                      className="w-full bg-softgray border border-gold/10 rounded-2xl py-5 px-8 outline-none focus:border-gold/50 transition-all font-bold text-xl"
                    />
                  </div>

                   <div className="flex items-center gap-6 pt-6 text-darkbrown">
                      <button 
                        type="button" 
                        onClick={() => setHide(!hide)} 
                        className={`flex-1 flex items-center justify-between px-8 rounded-2xl border transition-all h-[76px]
                          ${hide ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-600'}`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{hide ? 'Off-Store' : 'In-Store'}</span>
                        {hide ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="flex-[2] gold-button h-[76px] flex items-center justify-center gap-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl active:scale-95 disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={28} /> : (
                           isEditing ? <>Refine Arrival <RefreshCw size={20} /></> : <>Save New Arrival <CheckCircle2 size={24} /></>
                        )}
                      </button>
                   </div>
                   {successMsg && <div className="p-4 bg-green-500/10 rounded-2xl text-center text-green-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">{successMsg}</div>}
                </div>
              </form>
            </div>
          </section>

          {/* BOTTOM: Search & Catalog Section (Stack Layout) */}
          <section className="space-y-12 pb-20">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gold/10 pb-10">
                <div className="text-center md:text-left">
                   <h2 className="text-3xl font-playfair font-bold text-darkbrown uppercase tracking-tighter italic">Seasonal Repository</h2>
                   <p className="text-[10px] text-zinc-400 font-black tracking-[0.3em] mt-2">AUDIT LATEST COLLECTIONS BY CATEGORY</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                   <div className="relative w-full sm:w-72">
                      <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full bg-white border border-gold/10 rounded-2xl py-5 pl-8 pr-16 appearance-none text-xs font-black uppercase tracking-widest outline-none focus:border-gold/30 shadow-xl shadow-pink/5"
                      >
                         <option value="">Select Category First...</option>
                         <option value="all">Unrestricted (All Assets)</option>
                         {categories.map((cat) => (
                           <option key={cat.id} value={cat.id}>{cat.title}</option>
                         ))}
                      </select>
                      <LayoutGrid className="absolute right-6 top-1/2 -translate-y-1/2 text-gold/30" size={18} />
                   </div>
                   <button 
                      onClick={handleFetchByCategory}
                      disabled={isRefreshing}
                      className="gold-button px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl min-w-[180px] h-[66px] flex items-center justify-center gap-3 transition-all active:scale-95"
                   >
                      {isRefreshing ? <Loader2 className="animate-spin" size={20} /> : <><Search size={20} /> Access Records</>}
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((prod) => (
                  <div key={prod.id} className="glass-card p-6 rounded-[2.5rem] border border-gold/10 flex flex-col gap-6 hover:border-gold/30 transition-all duration-500 group relative bg-white shadow-2xl shadow-pink/5">
                     <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-gold/5">
                        <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        {prod.hide && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"><EyeOff size={32} className="text-darkbrown/30" /></div>}
                        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold/10 text-[9px] font-black uppercase tracking-widest text-gold shadow-lg">
                           {prod.productId}
                        </div>
                     </div>

                     <div className="space-y-4 px-2">
                        <div className="flex justify-between items-start gap-4">
                           <h3 className="text-xl font-bold text-darkbrown group-hover:text-gold transition-colors leading-tight">{prod.title}</h3>
                        </div>
                        
                        <div className="flex items-end justify-between">
                           <div className="space-y-1">
                              {prod.discount > 0 && <p className="text-[10px] text-zinc-400 line-through italic">₹{prod.mrp.toLocaleString()}</p>}
                              <p className="text-2xl font-black text-darkbrown">₹{prod.sellingPrice.toLocaleString()}</p>
                           </div>
                           {prod.discount > 0 && (
                             <div className="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-red-500/10">
                                {prod.discount}% SAVINGS
                             </div>
                           )}
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2 px-2">
                           <span>Balance Quantity</span>
                           <span className={`text-sm font-bold ${prod.totalQuantity <= 5 ? 'text-red-500 animate-pulse' : 'text-gold'}`}>
                              {prod.totalQuantity || 0} Units
                           </span>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 pt-4 border-t border-gold/5">
                        <button 
                          onClick={() => startEdit(prod)}
                          className="flex-1 bg-softgray hover:bg-gold hover:text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2"
                        >
                           <RefreshCw size={14} /> Refine Piece
                        </button>
                        <button 
                          onClick={() => handleDelete(prod.id)}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl border border-red-500/10 text-zinc-300 hover:text-red-500 hover:bg-red-500/10 transition-all duration-500"
                        >
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </div>
                ))}

                {!hasSearched && (
                   <div className="col-span-full py-40 flex flex-col items-center justify-center border-2 border-dashed border-gold/10 rounded-[4rem] bg-softgray/20">
                      <div className="w-24 h-24 rounded-full bg-gold/5 flex items-center justify-center text-gold/30 mb-8">
                         <Search size={48} />
                      </div>
                      <h3 className="text-2xl font-playfair font-black text-darkbrown/30 italic">New Arrival Audit Locked.</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-4">Initiate collection filter to access seasonal repository</p>
                   </div>
                )}

                {hasSearched && products.length === 0 && (
                  <div className="col-span-full py-40 flex flex-col items-center opacity-30 italic">
                     <Briefcase size={80} className="text-gold/20 mb-6" />
                     <p className="text-sm tracking-widest uppercase font-black">No seasonal records matching this query.</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}
