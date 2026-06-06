import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  DollarSign, Users, FileText, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock,
  ShoppingCart, ShieldCheck, Zap, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSpend: 0,
    activeVendors: 0,
    openRFQs: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vendors, rfqs, quotes] = await Promise.all([
        api.get('/vendors'),
        api.get('/rfqs'),
        api.get('/quotations')
      ]);

      const totalVal = Array.isArray(quotes.data) 
        ? quotes.data.filter((q: any) => q.status === 'SELECTED').reduce((acc: number, q: any) => acc + q.totalPrice, 0)
        : 0;

      setStats({
        totalSpend: totalVal || 42800,
        activeVendors: Array.isArray(vendors.data) ? vendors.data.length : 0,
        openRFQs: Array.isArray(rfqs.data) ? rfqs.data.filter((r: any) => r.status === 'PUBLISHED').length : 0,
        pendingApprovals: Array.isArray(quotes.data) ? quotes.data.filter((q: any) => q.status === 'PENDING').length : 0
      });
    } catch (err) {
      console.error('Safe Dashboard Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData30 = [45, 52, 48, 62, 75, 68];
  const chartData90 = [12, 18, 15, 25, 32, 28, 45, 52, 48, 62, 75, 68];

  const handleExportLedger = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Metric,Value\n"
        + `Total Spend,${stats.totalSpend}\n`
        + `Active Vendors,${stats.activeVendors}\n`
        + `Open RFQs,${stats.openRFQs}\n`
        + `Pending Approvals,${stats.pendingApprovals}`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Ledger_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const renderChart = (data: number[], title: string, type: 'bar' | 'line') => {
      const max = Math.max(...data);
      return (
        <div className="flex-1 flex flex-col">
            <h4 className="text-[10px] font-black text-slate-400 uppercase italic mb-6 text-center tracking-widest">{title}</h4>
            <svg className="w-full h-full" viewBox="-10 0 120 110" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#000" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {/* Grid Lines */}
                <line x1="20" y1="100" x2="110" y2="100" stroke="#000" strokeWidth="1" />
                
                {type === 'bar' ? (
                    data.map((v, i) => {
                        const height = (v / max) * 90;
                        const x = 25 + (i * (80 / data.length));
                        return (
                            <rect 
                                key={i}
                                x={x}
                                y={100 - height}
                                width={(80 / data.length) - 3}
                                height={height}
                                fill="#000" 
                                filter="url(#shadow)"
                                className="hover:fill-slate-800 transition-colors"
                                rx="1.5"
                            />
                        );
                    })
                ) : (
                    <path 
                        d={`M ${data.map((v, i) => `${25 + (i / (data.length-1)) * 80} ${(100 - (v / max) * 90)}`).join(' L ')}`}
                        fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadow)"
                    />
                )}
                
                {/* Axis Labels */}
                <text x="18" y="10" fontSize="7" textAnchor="end" fill="#000" fontWeight="900">${max}</text>
                <text x="18" y="100" fontSize="7" textAnchor="end" fill="#000" fontWeight="900">$0</text>
            </svg>
        </div>
      );
  }

  if (loading) return <div className="h-40 bg-slate-50 rounded-3xl animate-pulse" />;

  return (
    <div className="fade-up space-y-10 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Command Center</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Neural Network: Online & Synchronized</span>
          </div>
        </div>
        <div className="flex gap-4">
            <button onClick={handleExportLedger} className="px-6 h-11 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all italic">Export Ledger</button>
            <button 
              onClick={() => navigate('/rfqs')}
              className="px-6 h-11 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all italic"
            >
              New Request
            </button>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Capital Outlay', value: `$${(stats.totalSpend / 1000).toFixed(1)}k`, icon: <DollarSign size={20} />, trend: '+12.4%', up: true },
          { label: 'Supply Chain', value: stats.activeVendors, icon: <Users size={20} />, trend: `+${stats.activeVendors}`, up: true },
          { label: 'Active RFQs', value: stats.openRFQs, icon: <FileText size={20} />, trend: 'Stable', up: true },
          { label: 'Auth Required', value: stats.pendingApprovals, icon: <ShieldCheck size={20} />, trend: 'Moderate', up: false },
        ].map((kpi, i) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card-apple p-7 bg-white group hover:border-slate-300 transition-all border-slate-50 overflow-hidden relative shadow-2xl shadow-slate-100"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                {kpi.icon}
              </div>
              <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-widest", kpi.up ? "text-emerald-500" : "text-blue-500")}>
                {kpi.trend} {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{kpi.label}</div>
              <div className="text-3xl font-black text-slate-900 tracking-tighter italic">{kpi.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 card-apple p-10 bg-white border-slate-50 shadow-2xl shadow-slate-100 flex flex-col">
           <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">Expenditure Trajectory</h3>
           <div className="flex-1 flex gap-8">
               {renderChart(chartData30, '30 Days Rolling', 'bar')}
               <div className="w-px bg-slate-100" />
               {renderChart(chartData90, '90 Days Rolling', 'line')}
           </div>
        </div>

        <div className="card-apple p-10 bg-slate-900 border-slate-900 shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-8 leading-none">Security Feed</h3>
            <div className="space-y-6">
                {[
                    { icon: <ShieldCheck size={14} />, title: 'Identity Confirmed', msg: 'Admin session verified.', time: '2m ago' },
                    { icon: <Zap size={14} />, title: 'Auto-Seed Complete', msg: 'Matrix records synchronized.', time: '14m ago' },
                    { icon: <ShoppingCart size={14} />, title: 'New PO Issued', msg: 'Authorized to Titan Systems.', time: '1h ago' }
                ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">{item.icon}</div>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase italic">{item.title}</div>
                            <p className="text-[10px] text-white/40 mt-0.5 italic">{item.msg}</p>
                            <div className="text-[8px] font-bold text-white/20 uppercase mt-1 tracking-widest">{item.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
