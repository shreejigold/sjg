"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Image as ImageIcon, Layers, Trash2,
  CheckCircle2, User, EyeOff, Eye, Loader2, RefreshCw, Sparkles, Pencil
} from "lucide-react";
import { ImageUtils } from "@/utils/image";
import { CategoryService, CategoryData } from "@/services/category.service";
import Sidebar from "@/components/admin/Sidebar";

export default function CategoriesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Category Form State
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [hide, setHide] = useState<boolean>(false);
  const [trending, setTrending] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false); // NEW
  const [editId, setEditId] = useState<string | null>(null); // NEW

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      fetchCategories();
    }
  }, [router]);

  const fetchCategories = async () => {
    const data = await CategoryService.getCategories();
    setCategories(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await ImageUtils.compressAndConvertToBase64(e.target.files[0], 120);
        setImage(base64);
      } catch (err) {
        console.error("Image processing failed", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) {
      alert("Please provide title and image.");
      return;
    }

    setIsLoading(true);
    const categoryPayload = {
      title,
      image: image || "",
      discount: Number(discount),
      hide,
      trending
    };

    let result;
    if (isEditing && editId) {
      result = await CategoryService.updateCategory(editId, categoryPayload);
    } else {
      result = await CategoryService.createCategory(categoryPayload);
    }

    if (result.success) {
      setSuccessMsg(isEditing ? "Collection refined!" : "Category created successfully!");
      resetForm();
      fetchCategories();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setImage(null);
    setDiscount(0);
    setHide(false);
    setTrending(false);
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (cat: any) => {
    setTitle(cat.title);
    setImage(cat.image);
    setDiscount(cat.discount);
    setHide(cat.hide);
    setTrending(cat.trending);
    setIsEditing(true);
    setEditId(cat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategoryStatus = async (id: string, field: 'hide' | 'trending', currentVal: boolean) => {
    const result = await CategoryService.updateCategory(id, { [field]: !currentVal });
    if (result.success) {
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Securely delete this collection mapping? This may affect products categorised here.")) return;
    const result = await CategoryService.deleteCategory(id);
    if (result.success) {
      fetchCategories();
    } else {
      alert("Error: " + result.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-softgray/50 text-darkbrown font-montserrat flex overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-white/50">
        {/* Fixed Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 md:px-10 py-6 border-b border-gold/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-gold-gradient text-darkbrown">Collection Designer</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">Structure your storefront categories</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 text-gold">
              <User size={18} />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 w-full max-w-[1400px] mx-auto space-y-16">
          {/* Top: Create Category Form */}
          <section className="space-y-8">
            <div className="glass-card rounded-[3rem] border border-gold/10 p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-pink/5 bg-white">
              <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
                <Layers size={340} className="text-gold" />
              </div>

              <h2 className="text-3xl font-playfair font-bold text-gold mb-12 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  {isEditing ? <RefreshCw className="animate-spin text-gold" size={28} /> : <Plus className="text-gold" size={28} />}
                  {isEditing ? "Refine Collection" : " New Collection"}
                </div>
                {isEditing && (
                  <button onClick={resetForm} className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-6 py-2.5 rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                    Discard Changes
                  </button>
                )}
              </h2>

              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column: Title & Discount */}
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2">Collection Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Bridal Sets"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-softgray border border-gold/10 rounded-2xl py-5 px-8 outline-none focus:border-gold/50 transition-all font-medium text-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2">Promotion (%)</label>
                        <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full bg-white border border-gold/10 rounded-2xl py-5 px-6 outline-none focus:border-gold/50 text-darkbrown font-bold text-xl" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2 text-center block">Attributes</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button type="button" onClick={() => setHide(!hide)} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all h-[66px] ${hide ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/5' : 'bg-green-500/10 border-green-500/20 text-green-600 shadow-lg shadow-green-500/5'}`}>
                            <span className="text-[9px] font-black uppercase tracking-widest">{hide ? 'Hidden' : 'Visible'}</span>
                            {hide ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button type="button" onClick={() => setTrending(!trending)} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all h-[66px] ${trending ? 'bg-gold/10 border-gold/30 text-gold shadow-lg shadow-gold/5' : 'bg-softgray border-gold/10 text-darkbrown/40'}`}>
                            <span className="text-[9px] font-black uppercase tracking-widest">{trending ? 'Trending' : 'Standard'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image & Submit */}
                  <div className="space-y-8 flex flex-col justify-between">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-2 flex justify-between">
                        Product Image <span className="text-gold italic font-medium">Recommended: 1:1 Aspect</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => document.getElementById('catFile')?.click()}
                        className={`w-full aspect-[21/9] rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 group overflow-hidden relative
                           ${image ? 'border-gold/30' : 'border-gold/10 bg-softgray hover:bg-white/60 hover:border-gold/30'}`}
                      >
                        {image ? (
                          <>
                            <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ImageIcon className="text-white" size={32} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                              <Plus size={32} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Upload Visual Asset</span>
                          </>
                        )}
                        <input id="catFile" type="file" className="hidden" onChange={handleImageUpload} />
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gold-button h-[76px] flex items-center justify-center gap-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={28} /> : (
                        isEditing ? <>Authorize Updates <CheckCircle2 size={24} /></> : <>Add Collection <CheckCircle2 size={24} /></>
                      )}
                    </button>
                  </div>
                </div>

                {successMsg && (
                  <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center text-green-600 font-bold tracking-widest animate-pulse max-w-md mx-auto">
                    {successMsg}
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Bottom: List Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-6 mb-12">
              <div className="h-[2px] w-20 bg-gold/30" />
              <h2 className="text-3xl font-playfair font-bold text-darkbrown">Active Collections</h2>
              <div className="flex-1 h-[2px] bg-gold/10" />
            </div>

            <div className="overflow-x-auto glass-card rounded-[2.5rem] border border-gold/10 bg-white shadow-2xl shadow-pink/5">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gold/10 bg-softgray/30">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Preview</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Collection Name</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 text-center">Discount</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Status & Flags</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-softgray/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gold/10 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                          <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                          {cat.trending && (
                            <div className="absolute top-1 right-1 bg-gold text-white p-1 rounded-full shadow-md scale-75 animate-bounce">
                              <Sparkles size={10} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <h3 className="text-lg font-bold text-darkbrown group-hover:text-gold transition-colors">{cat.title}</h3>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5 font-medium">Unique ID: {cat.id?.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-gold/10 text-gold px-4 py-2 rounded-full text-[11px] font-black tracking-widest border border-gold/20 shadow-sm">
                          {cat.discount}% OFF
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-3">
                           <button
                            onClick={() => toggleCategoryStatus(cat.id, 'trending', cat.trending)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm ${cat.trending ? 'bg-gold text-white border-none' : 'bg-white text-darkbrown/40 border border-gold/10 hover:border-gold/30'}`}
                          >
                            {cat.trending ? 'Trending' : 'Standard'}
                          </button>
                          <button
                            onClick={() => toggleCategoryStatus(cat.id, 'hide', cat.hide)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm flex items-center gap-2 ${cat.hide ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-600 border border-green-500/20'}`}
                          >
                            {cat.hide ? <><EyeOff size={14} /> Hidden</> : <><Eye size={14} /> Visible</>}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-3.5 bg-softgray hover:bg-gold hover:text-white rounded-2xl transition-all duration-500 text-darkbrown/40 hover:shadow-xl shadow-gold/20 active:scale-95 group/btn border border-gold/5"
                            title="Refine Asset"
                          >
                            <Pencil size={20} className="group-hover/btn:rotate-12 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-3.5 bg-softgray hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-500 text-darkbrown/40 hover:shadow-xl shadow-red-500/20 active:scale-95 group/btn border border-gold/5"
                            title="Secure Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
