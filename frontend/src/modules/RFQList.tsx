import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, Search, ArrowRight, Package, Clock, CheckCircle2, 
  ChevronRight, MoreVertical, LayoutGrid, List as ListIcon, X, Check, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const RFQList: React.FC = () => {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const [newRfq, setNewRfq] = useState({
    title: '',
    description: '',
    deadline: '',
    items: '[{"item": "Asset", "qty": 1}]'
  });

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    try {
      const res = await api.get('/rfqs');
      setRfqs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('RFQ Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRfq = async () => {
    if (!newRfq.title || !newRfq.description) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsPublishing(true);
    try {
      // Ensure deadline is a valid ISO string, default to 7 days from now
      const payload = {
        ...newRfq,
        deadline: newRfq.deadline ? new Date(newRfq.deadline).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      await api.post('/rfqs', payload);
      setShowWizard(false);
      setStep(1);
      setNewRfq({ title: '', description: '', deadline: '', items: '[{"item": "Asset", "qty": 1}]' });
      fetchRfqs();
      alert('RFQ Published Successfully!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Check your connection.';
      alert(`Failed to publish: ${errorMsg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSelectQuote = async (quoteId: string) => {
    try {
      await api.post(`/quotations/${quoteId}/select`);
      alert('Quotation Selected! PO generation enabled.');
      setSelectedRfq(null);
      fetchRfqs();
      navigate('/orders'); // Redirect to PO list
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Check your connection.';
      alert(`Selection failed: ${errorMsg}`);
    }
  };

  const handleCompare = async (rfqId: string) => {
    try {
      const res = await api.get(`/quotations/compare/${rfqId}`);
      setComparisons(Array.isArray(res.data) ? res.data : []);
      setSelectedRfq(rfqs.find(r => r.id === rfqId));
    } catch (err) {
      console.error(err);
    }
  };

  const formatSafeDate = (dateStr: any) => {
    try {
      if (!dateStr) return 'TBD';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'TBD';
      return d.toLocaleDateString();
    } catch {
      return 'TBD';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-300">
      <Loader2 className="animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">Polling Market...</span>
    </div>
  );

  return (
    <div className="max-w-[1240px] mx-auto space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Request Radar</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">Active supply chain requirements and bidding cycles.</p>
        </div>
        <div className="flex gap-2 no-print">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 mr-2">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-1.5 rounded-lg transition-all", view === 'grid' ? "bg-slate-100 text-slate-900" : "text-slate-400")}
            ><LayoutGrid size={16} /></button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded-lg transition-all", view === 'list' ? "bg-slate-100 text-slate-900" : "text-slate-400")}
            ><ListIcon size={16} /></button>
          </div>
          <button onClick={() => setShowWizard(true)} className="btn-apple-primary gap-2 h-11 px-8 text-sm font-bold shadow-2xl shadow-slate-200">
            <Plus size={18} /> New Request
          </button>
        </div>
      </div>

      {rfqs.length === 0 ? (
        <div className="card-apple border-dashed border-2 bg-slate-50/50 py-32 text-center text-slate-400">
           <AlertCircle className="mx-auto mb-4 opacity-20" size={40} />
           <p className="font-bold uppercase text-[10px] tracking-widest">No Active Requirements Found</p>
           <button onClick={() => setShowWizard(true)} className="mt-4 text-blue-600 font-bold hover:underline">Launch your first RFQ</button>
        </div>
      ) : (
        <div className={cn(
          "grid gap-8",
          view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {rfqs.map((rfq) => (
            <motion.div 
              key={rfq?.id}
              layout
              className="card-apple group relative flex flex-col justify-between hover:border-slate-300"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{rfq?.number || 'REF-NEW'}</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    rfq?.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {rfq?.status || 'UNKNOWN'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{rfq?.title}</h3>
                <p className="text-sm text-slate-500 mt-4 line-clamp-2 min-h-[40px] font-medium leading-relaxed italic">{rfq?.description}</p>
                
                <div className="mt-10 flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Package size={14} className="text-slate-300" /> Compliance Verified</div>
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-300" /> {formatSafeDate(rfq?.deadline)}</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">
                      {i}
                    </div>
                  ))}
                  <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-400">
                    +{rfq?._count?.quotations || 0}
                  </div>
                </div>
                <button 
                  onClick={() => handleCompare(rfq.id)}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn uppercase tracking-widest"
                >
                  Analyze <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Comparisons & Wizard remain but with safe formatSafeDate calls ... */}
      <AnimatePresence>
        {selectedRfq && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedRfq(null)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} 
              className="fixed inset-x-4 bottom-4 z-[120] h-[90vh] rounded-[32px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{selectedRfq.title}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-Vendor Bid Matrix • {comparisons.length} Submissions</p>
                    </div>
                    <button onClick={() => setSelectedRfq(null)} className="h-12 w-12 border border-slate-200 rounded-2xl flex items-center justify-center bg-white hover:bg-slate-50"><X /></button>
                </div>
                <div className="flex-1 overflow-x-auto p-10 bg-[#FBFCFE]">
                    <div className="flex gap-8 pb-10">
                        {comparisons.map((q) => (
                            <div key={q.id} className={cn(
                                "w-[400px] card-apple p-10 flex flex-col justify-between shrink-0 shadow-xl",
                                q.isLowestPrice && "ring-2 ring-emerald-500 border-emerald-500/50"
                            )}>
                                <div>
                                    <div className="flex justify-between mb-10">
                                        <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-300 uppercase">{q.vendor.name[0]}</div>
                                        {q.isLowestPrice && <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-[6px] tracking-[0.2em] shadow-lg shadow-emerald-100">Best Value</span>}
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900">{q.vendor.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">Global Tier 1 Manufacturer</p>
                                    
                                    <div className="mt-12 space-y-10">
                                        <div>
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 font-bold leading-none">Total Project Quote</div>
                                            <div className="text-5xl font-black tracking-tighter text-slate-900 leading-none">${q.totalPrice.toLocaleString()}</div>
                                        </div>
                                        <div className="flex gap-10">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-300 uppercase mb-2">Lead Time</div>
                                                <div className="text-sm font-bold">{q.deliveryDays} Days</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-300 uppercase mb-2">Reliability</div>
                                                <div className="text-sm font-bold text-emerald-600">A+ 98%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleSelectQuote(q.id)} className="w-full btn-apple-primary h-14 mt-12 text-sm font-black shadow-2xl shadow-slate-200 !uppercase tracking-widest">Select Partner</button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWizard(false)} className="fixed inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="relative card-apple w-full max-w-[640px] h-[720px] p-0 flex flex-col overflow-hidden bg-white rounded-[40px]"
            >
                <div className="h-2 w-full bg-slate-50"><motion.div animate={{ width: `${(step/3)*100}%` }} className="h-full bg-black" /></div>
                <div className="p-16 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-16">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Module {step} of 3</span>
                        <button onClick={() => setShowWizard(false)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center"><X /></button>
                    </div>
                    {step === 1 && (
                        <div className="space-y-12">
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Intent & Identity</h2>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Project Heading</label>
                                    <input type="text" className="input-apple h-14 text-xl font-bold px-6" placeholder="e.g. Q4 Data Center Expansion" value={newRfq.title} onChange={e => setNewRfq({...newRfq, title: e.target.value})} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Scope Details</label>
                                    <textarea className="input-apple min-h-[160px] py-6 px-6 text-lg italic" placeholder="Outline specific technical requirements..." value={newRfq.description} onChange={e => setNewRfq({...newRfq, description: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-12">
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Market Limits</h2>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Final Bidding Deadline</label>
                                <input type="date" className="input-apple h-14 px-6 text-xl font-bold" value={newRfq.deadline} onChange={e => setNewRfq({...newRfq, deadline: e.target.value})} />
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="text-center py-10 space-y-8">
                            <div className="h-24 w-24 bg-emerald-500 rounded-[36px] mx-auto flex items-center justify-center text-white shadow-2xl shadow-emerald-200"><Check size={48} /></div>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900">Broadcast Now?</h2>
                            <p className="text-slate-400 font-medium italic max-w-sm mx-auto">Clicking finalize will broadcast this RFQ to your verified supplier network across all nodes.</p>
                        </div>
                    )}
                </div>
                <div className="p-12 border-t border-slate-50 flex gap-4 bg-slate-50/50">
                    {step > 1 && <button onClick={() => setStep(step-1)} className="btn-apple-secondary h-14 flex-1 font-bold">Back</button>}
                    <button onClick={() => step < 3 ? setStep(step+1) : handleCreateRfq()} className="btn-apple-primary h-14 flex-[2] font-black uppercase tracking-widest">{isPublishing ? <Loader2 className="animate-spin" /> : step === 3 ? "Launch RFQ" : "Next Phase"}</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RFQList;
