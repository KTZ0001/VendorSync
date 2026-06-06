import React from 'react';
import { 
  PieChart, TrendingUp, ArrowUpRight, 
  BarChart3, Target, Share2, Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Analytics: React.FC = () => {
  return (
    <div className="fade-up space-y-10 max-w-[1240px] mx-auto pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Procurement Intelligence</h1>
          <p className="text-slate-500 mt-1">Global spend analysis and vendor distribution.</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
            <button className="px-4 py-2 text-xs font-bold text-slate-900 bg-slate-50 rounded-lg">Overview</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 card-apple px-10 py-8 relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="font-bold text-lg">Spend Trajectory</h3>
                    <p className="text-xs text-slate-400 font-medium">Historical fiscal data since on-boarding.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-600 text-[10px] font-black tracking-widest"><TrendingUp size={14} /> +24% YOY</div>
                </div>
            </div>
            
            <div className="h-[300px] flex items-end justify-between gap-2 border-b border-l border-slate-100">
                {/* Data up to June (current month) */}
                {[30, 45, 35, 65, 50, 40].map((h, i) => (
                    <div key={i} className="flex-1 group relative flex flex-col items-center h-full justify-end">
                        <div className="absolute -top-6 text-[10px] font-black text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{h}%</div>
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
                            className={cn(
                                "w-full rounded-t-sm transition-all duration-500",
                                i === 5 ? "bg-black" : "bg-slate-300 group-hover:bg-black"
                            )}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-6 px-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                <span>Jan</span><span>Mar</span><span>Jun</span>
            </div>
        </div>

        <div className="space-y-8">
            <div className="card-apple p-10 bg-black text-white border-black">
                <div className="flex justify-between items-start mb-6">
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center"><Target size={20} /></div>
                    <ArrowUpRight size={20} className="text-white/40" />
                </div>
                <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Efficiency Goal</h3>
                <div className="text-3xl font-black mt-2 tracking-tighter">92.4%</div>
                <div className="mt-8 space-y-2">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '92.4%' }} className="h-full bg-white" />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-white/40 tracking-widest uppercase">
                        <span>Target 90%</span>
                        <span>Current</span>
                    </div>
                </div>
            </div>

            <div className="card-apple p-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Vendor Concentration</h3>
                <div className="space-y-5">
                    {[
                        { label: 'Technology', val: 65, color: 'bg-black' },
                        { label: 'Logistics', val: 20, color: 'bg-slate-300' },
                        { label: 'Facilities', val: 15, color: 'bg-slate-100' }
                    ].map(item => (
                        <div key={item.label} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-900">{item.label}</span>
                                <span className="text-slate-400">{item.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className={cn("h-full", item.color)} style={{ width: `${item.val}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
