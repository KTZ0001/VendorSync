import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  CheckCircle2, XCircle, Clock, ShieldCheck, 
  ArrowRight, FileText, User, Bell, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Approvals: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await api.get('/quotations'); // We'll use raw quotations as approval items for now
      setItems(Array.isArray(res.data) ? res.data.filter((q: any) => q.status === 'PENDING') : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'select' | 'reject') => {
    setProcessingId(id);
    try {
      if (action === 'select') {
        await api.post(`/quotations/${id}/select`);
        await api.post(`/orders/po/${id}`);
      }
      fetchApprovals();
    } catch (err) {
      alert('Decision failed to broadcast.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="h-40 bg-slate-50 rounded-3xl animate-pulse" />;

  return (
    <div className="fade-up space-y-10 max-w-[1000px] mx-auto pb-24">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Approval Queue</h1>
          <p className="text-sm text-slate-500 font-bold italic mt-2 uppercase tracking-widest">Awaiting procurement authorization.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
            <Bell size={14} /> {items.length} Pending Actions
        </div>
      </header>

      <div className="space-y-6">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-apple group p-8 bg-white border-slate-100 shadow-xl hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex gap-6">
                <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-300 text-2xl">
                    {item.vendor?.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quotation Review</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] italic">Priority Alpha</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">{item.vendor?.name}</h3>
                  <div className="mt-3 flex items-center gap-4 text-xs font-bold text-slate-400 italic">
                    <div className="flex items-center gap-1.5"><FileText size={14} /> Bid: ${item.totalPrice.toLocaleString()}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} /> Delivery: {item.deliveryDays} Days</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <button 
                  disabled={processingId === item.id}
                  onClick={() => handleAction(item.id, 'reject')}
                  className="h-14 w-14 rounded-2xl border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center"
                 >
                    <XCircle size={24} />
                 </button>
                 <button 
                  disabled={processingId === item.id}
                  onClick={() => handleAction(item.id, 'select')}
                  className="px-8 h-14 bg-black text-white rounded-2xl flex items-center gap-3 text-sm font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    {processingId === item.id ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> Authorize Order</>}
                 </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><User size={14} /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requester: {item.rfq?.title}</span>
                </div>
                <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">View Technical Specs <ArrowRight size={12} className="inline ml-1" /></button>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-32 space-y-6">
            <div className="h-20 w-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center text-emerald-500 shadow-inner">
                <CheckCircle2 size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Inbox Cleared</h3>
              <p className="text-slate-400 mt-1 font-medium italic">All procurement requests have been handled.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
