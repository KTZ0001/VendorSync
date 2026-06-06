import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, ShoppingCart, 
  Settings, LogOut, ChevronLeft, ChevronRight, 
  Bell, Search, User, PieChart, CreditCard, ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={18} />, label: 'Vendors', path: '/vendors' },
    { icon: <FileText size={18} />, label: 'RFQs', path: '/rfqs' },
    { icon: <ClipboardList size={18} />, label: 'Quotations', path: '/quotations' },
    { icon: <ShieldCheck size={18} />, label: 'Approvals', path: '/approvals' },
    { icon: <ShoppingCart size={18} />, label: 'Purchase Orders', path: '/orders' },
    { icon: <CreditCard size={18} />, label: 'Invoices', path: '/invoices' },
    { icon: <PieChart size={18} />, label: 'Analytics', path: '/analytics' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFE] overflow-x-hidden font-sans antialiased text-slate-900">
      {/* Sidebar - Extreme Premium Layering */}
      <motion.aside 
        initial={false}
        animate={{ width: collapsed ? '80px' : '280px' }}
        className="fixed left-0 top-0 z-[100] h-screen border-r border-slate-100 bg-white transition-all duration-500 ease-[0.16,1,0.3,1] shadow-[1px_0_0_0_rgba(0,0,0,0.02)]"
      >
        <div className="flex h-20 items-center px-7 border-b border-white/50">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-black text-white shrink-0 shadow-lg shadow-slate-300">
              <span className="font-extrabold text-xl italic">V</span>
            </div>
            {!collapsed && <span className="text-xl font-black tracking-tighter italic uppercase text-slate-900">VendorSync</span>}
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1.5 px-4">
          <div className="px-3 mb-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">System Core</div>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "group flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                isActive 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-100 italic" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50 italic"
              )}
            >
              <span className="flex-shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all italic border border-transparent hover:border-red-100"
          >
            <LogOut size={18} />
            {!collapsed && <span>Purge Session</span>}
          </button>
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-24 z-[110] flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-md transition-all hover:text-slate-950 hover:border-slate-300"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Content Shift */}
      <div 
        className="flex flex-1 flex-col transition-all duration-500 ease-[0.16,1,0.3,1] relative"
        style={{ paddingLeft: collapsed ? '80px' : '280px' }}
      >
        <header className="sticky top-0 z-[50] h-20 border-b border-slate-50 bg-white/60 backdrop-blur-2xl">
          <div className="flex h-full items-center justify-between px-10">
            <div className="relative w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Global Audit Search..." 
                className="w-full h-11 bg-slate-50/50 border border-transparent rounded-2xl pl-12 pr-4 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-100 focus:shadow-inner transition-all outline-none italic"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50/50 rounded-xl border border-slate-100/50 group">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-slate-900 transition-colors">Neural Sync: Live</span>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-xl transition-all cursor-pointer relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-4 ring-white" />
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="text-right">
                  <div className="text-xs font-black tracking-tight text-slate-900 group-hover:text-black uppercase italic">{user?.fullName || 'Root Admin'}</div>
                  <div className="text-[9px] text-slate-300 uppercase font-black tracking-[0.2em] italic">{user?.role || 'Executive'}</div>
                </div>
                <div className="h-11 w-11 rounded-[14px] bg-slate-100 border-2 border-white shadow-xl flex items-center justify-center text-slate-400 group-hover:border-slate-200 transition-all overflow-hidden italic font-bold">
                    {user?.fullName?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-12 max-w-[1700px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
