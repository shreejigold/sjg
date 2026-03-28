"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, User, ArrowUpRight, 
  Users, Eye, Landmark, Layers, Settings,
  ShoppingBag, Calendar, Search, Filter,
  Phone, MapPin, ChevronRight, Clock,
  CheckCircle, Truck, Package, XCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/admin/Sidebar";
import { OrderService } from "@/services/order.service";

type DashboardTab = 'overview' | 'orders' | 'customers';

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      const tab = searchParams.get('tab') as DashboardTab;
      if (tab) setActiveTab(tab);
      fetchDashboardData();
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [filterDate, activeTab]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [todayOrders, allCustomers] = await Promise.all([
        OrderService.getOrders(new Date()),
        OrderService.getCustomers()
      ]);
      setOrders(todayOrders);
      setCustomers(allCustomers);
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    const data = await OrderService.getOrders(new Date(filterDate));
    setOrders(data);
  };

  const fetchAllCustomers = async () => {
    const data = await OrderService.getCustomers();
    setCustomers(data);
  };

  if (!isAuthenticated) return null;

  const stats = [
    { label: "Today's Orders", value: orders.filter(o => {
        const d = new Date(o.createdAt?.seconds * 1000);
        return d.toDateString() === new Date().toDateString();
    }).length.toString(), change: "Live", icon: ShoppingBag },
    { label: "Total Customers", value: customers.length.toString(), change: "Archives", icon: Users },
    { label: "Revenue Est.", value: `₹${orders.reduce((acc, o) => acc + (o.subtotal || 0), 0).toLocaleString()}`, change: "Daily", icon: Landmark },
  ];

  const filteredCustomers = customers.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.primaryMobile.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-softgray/50 text-darkbrown font-montserrat flex overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-white/50">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 md:px-10 py-6 border-b border-gold/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-darkbrown">
              Heritage Dashboard
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">Management of Timeless Assets</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex bg-softgray p-1 rounded-2xl border border-gold/10">
                  {(['overview', 'orders', 'customers'] as DashboardTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${activeTab === tab ? 'bg-gold text-white shadow-lg' : 'text-zinc-400 hover:text-darkbrown'}`}
                    >
                        {tab}
                    </button>
                  ))}
              </div>
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 text-gold">
                <User size={18} />
              </div>
          </div>
        </header>

        <div className="p-6 md:p-10 w-full max-w-[1400px] mx-auto space-y-10">
          
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-8 rounded-[2.5rem] border border-gold/10 relative overflow-hidden group hover:border-gold/30 transition-all bg-white shadow-xl shadow-pink/5">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <stat.icon size={120} />
                      </div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mb-6">{stat.label}</p>
                      <div className="flex items-end justify-between">
                        <h2 className="text-4xl font-bold text-darkbrown group-hover:text-gold transition-colors">{stat.value}</h2>
                        <span className="text-[10px] text-gold font-black uppercase tracking-widest border border-gold/20 px-3 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="glass-card rounded-[3rem] border border-gold/10 p-12 flex flex-col justify-center min-h-[350px] bg-white shadow-2xl shadow-pink/5 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 opacity-5">
                         <Layers size={250} className="text-gold" />
                    </div>
                    <h3 className="text-3xl font-playfair font-black text-gold mb-6 uppercase tracking-tighter italic">Operational Quickstart</h3>
                    <p className="text-darkbrown/60 text-sm leading-relaxed mb-10 max-w-sm">
                      Access the core repositories of your digital vault. Manage collections, assets, and newly arrival masterpieces with precision.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link href="/admin/categories" className="gold-button px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        Categories <Layers size={16} />
                      </Link>
                      <Link href="/admin/products" className="bg-softgray hover:bg-gold/10 text-darkbrown/60 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-gold/10">
                        Inventory <ShoppingBag size={16} />
                      </Link>
                    </div>
                  </div>

                  <div className="glass-card rounded-[3rem] border border-gold/10 p-12 bg-white shadow-2xl shadow-pink/5 flex flex-col">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-8 flex items-center gap-2">
                        <Clock size={14} /> Recent Legacy Record
                     </h3>
                     <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                            <Settings size={32} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-darkbrown uppercase tracking-widest">System Architecture: Active</h4>
                            <p className="text-zinc-400 text-[10px] mt-2 italic font-medium uppercase tracking-widest">Global Purity Standards Maintained</p>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold/10 pb-8">
                   <h2 className="text-3xl font-playfair font-black text-darkbrown uppercase tracking-tighter">Live Order Logs</h2>
                   <div className="flex items-center gap-4">
                      <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={16} />
                         <input 
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-white border border-gold/10 rounded-2xl py-4 pl-12 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:border-gold/30 shadow-sm"
                         />
                      </div>
                      <button onClick={fetchOrders} className="gold-button p-4 rounded-2xl"><Filter size={18} /></button>
                   </div>
                </div>

                <div className="glass-card rounded-[2.5rem] border border-gold/10 overflow-hidden bg-white shadow-2xl shadow-pink/5">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[1000px]">
                         <thead>
                            <tr className="bg-softgray/30 border-b border-gold/10">
                               <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Order Reference</th>
                               <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Customer Details</th>
                               <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Assets</th>
                               <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 border-x border-gold/5 text-center">Value</th>
                               <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-right">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gold/5">
                            {orders.map((order) => (
                               <tr key={order.id} className="hover:bg-softgray/20 transition-all group">
                                  <td className="px-8 py-6">
                                     <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-darkbrown">#{order.id?.slice(-8).toUpperCase()}</span>
                                        <span className="text-[9px] text-zinc-400 mt-1 uppercase font-bold tracking-widest flex items-center gap-1">
                                            <Clock size={10} /> {new Date(order.createdAt?.seconds * 1000).toLocaleString()}
                                        </span>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="flex flex-col">
                                        <span className="text-sm font-bold text-darkbrown">{order.firstName} {order.lastName}</span>
                                        <span className="text-[10px] text-zinc-400 mt-1 flex items-center gap-2"><Phone size={10} className="text-gold/40" /> {order.primaryMobile}</span>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="flex items-center gap-2">
                                        {order.items?.map((item: any, idx: number) => (
                                           <div key={idx} className="w-10 h-10 rounded-lg overflow-hidden border border-gold/10 relative group-hover:scale-110 transition-transform">
                                              <img src={item.image} className="w-full h-full object-cover" />
                                           </div>
                                        ))}
                                        {order.items?.length > 3 && <span className="text-[9px] font-black text-gold ml-2">+{order.items.length - 3} MORE</span>}
                                     </div>
                                  </td>
                                  <td className="px-8 py-6 text-center border-x border-gold/5">
                                     <span className="text-base font-black text-darkbrown tracking-tight italic">₹{order.subtotal?.toLocaleString()}</span>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border
                                        ${order.status === 'Pending' ? 'bg-gold/10 text-gold border-gold/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                                        {order.status}
                                     </span>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                   {orders.length === 0 && (
                      <div className="py-32 text-center space-y-4">
                         <div className="w-16 h-16 bg-softgray rounded-full flex items-center justify-center mx-auto text-zinc-300">
                             <Search size={32} />
                         </div>
                         <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">No records found for this date.</h4>
                      </div>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold/10 pb-8">
                   <h2 className="text-3xl font-playfair font-black text-darkbrown uppercase tracking-tighter">Customer Archive</h2>
                   <div className="relative w-full md:w-80">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold" size={16} />
                      <input 
                        placeholder="SEARCH ARCHIVES (NAME/PHONE)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gold/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-gold/30 shadow-sm"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                   {filteredCustomers.map((cust) => (
                      <div key={cust.id} className="glass-card p-8 rounded-[3rem] border border-gold/10 bg-white shadow-2xl shadow-pink/5 hover:border-gold/40 transition-all group relative overflow-hidden">
                         <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink/5 rounded-full blur-2xl group-hover:bg-gold/5 transition-colors" />
                         
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold font-bold text-xl group-hover:bg-gold group-hover:text-white transition-all shadow-lg shadow-gold/5">
                               {cust.firstName[0]}{cust.lastName[0]}
                            </div>
                            <div>
                               <h4 className="font-bold text-darkbrown leading-tight">{cust.firstName} {cust.lastName}</h4>
                               <p className="text-[9px] text-zinc-400 font-black tracking-widest mt-1 uppercase">Gold Tier Patron</p>
                            </div>
                         </div>

                         <div className="space-y-5">
                            <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
                               <Phone size={14} className="text-gold/40" /> {cust.primaryMobile}
                            </div>
                            <div className="flex items-start gap-3 text-[10px] text-zinc-500 font-medium leading-relaxed">
                               <MapPin size={14} className="text-gold/40 mt-0.5" /> {cust.lastAddress}, {cust.state}
                            </div>
                         </div>

                         <div className="mt-8 pt-6 border-t border-gold/5 flex justify-between items-center">
                            <div className="flex flex-col">
                               <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-black">Last Legacy Order</span>
                               <span className="text-[10px] font-bold text-darkbrown mt-1">
                                  {new Date(cust.lastOrderDate?.seconds * 1000).toLocaleDateString()}
                               </span>
                            </div>
                            <div className="p-2 border border-gold/10 rounded-xl text-gold/30 group-hover:text-gold transition-colors">
                               <ChevronRight size={16} />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                {filteredCustomers.length === 0 && (
                   <div className="py-40 text-center bg-softgray/20 rounded-[4rem] border border-dashed border-gold/10">
                      <Users size={60} className="mx-auto text-zinc-200 mb-6" />
                      <h3 className="text-xl font-playfair font-black text-darkbrown/20 italic uppercase tracking-widest">No matching records found in the archive.</h3>
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
