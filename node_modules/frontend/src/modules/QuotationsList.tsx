import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ClipboardList, Search, Filter, ArrowUpRight, 
  ChevronRight, MoreHorizontal, CheckCircle2, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const QuotationsList: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await api.get('/quotations');
        setQuotations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  if (loading) return <div className="h-20 w-full bg-slate-50 animate-pulse rounded-xl" />;

  return (
    <div className="fade-up space-y-8 max-w-[1200px] mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Quotations Radar</h1>
          <p className="text-slate-500 mt-1">Cross-vendor bidding and pricing intelligence.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-apple-secondary gap-2 h-10"><Filter size={16} /> All Status</button>
        </div>
      </header>

      <div className="card-apple p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search by Vendor or RFQ..." className="input-apple pl-9 h-9 text-xs" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/20 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="py-4 px-8">Quotation Ref</th>
                <th className="py-4">Vendor</th>
                <th className="py-4">Source RFQ</th>
                <th className="py-4">Unit Bid</th>
                <th className="py-4">Status</th>
                <th className="py-4 px-8 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {quotations.map((q) => (
                <tr key={q.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="py-5 px-8 font-mono text-xs font-bold text-slate-400">QTN-{q.id.slice(0, 5).toUpperCase()}</td>
                  <td className="py-5 font-bold text-slate-900">{q.vendor.name}</td>
                  <td className="py-5 text-slate-500 font-medium">{q.rfq.title}</td>
                  <td className="py-5">
                    <div className="font-black text-slate-900 text-base">${q.totalPrice.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{q.deliveryDays} Day Fulfillment</div>
                  </td>
                  <td className="py-5">
                    <span className={cn(
                      "px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase tracking-widest",
                      q.status === 'SELECTED' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button 
                      onClick={() => setSelectedQuote(q)}
                      className="h-8 w-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:bg-white group-hover:border-slate-200 transition-all">
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {quotations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 italic">No quotations submitted for review yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedQuote && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setSelectedQuote(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-white p-10 rounded-3xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Quotation Preview</h2>
              <div className="space-y-4">
                  <p><strong>Vendor:</strong> {selectedQuote.vendor.name}</p>
                  <p><strong>RFQ:</strong> {selectedQuote.rfq.title}</p>
                  <p><strong>Total Price:</strong> ${selectedQuote.totalPrice.toLocaleString()}</p>
                  <p><strong>Delivery Days:</strong> {selectedQuote.deliveryDays}</p>
                  <p><strong>Notes:</strong> {selectedQuote.notes || 'N/A'}</p>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="mt-8 w-full bg-black text-white h-12 rounded-xl text-xs font-black uppercase tracking-widest">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuotationsList;
