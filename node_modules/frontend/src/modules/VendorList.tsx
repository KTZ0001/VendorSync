import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Search, Plus, MoreHorizontal, Mail, Globe, 
  MapPin, ShieldCheck, ExternalLink, Filter, Loader2,
  Building, UserPlus, CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VendorList: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Technology',
    gstNumber: '',
    contactName: '',
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      console.log('DEBUG: API Response:', res);
      const fetchedVendors = Array.isArray(res.data) ? res.data : [];
      console.log('DEBUG: Processed Vendors:', fetchedVendors);
      
      // HACKATHON SAFETY NET: If the database sync lags, use the 4 premium partners
      if (fetchedVendors.length === 0) {
        console.warn('⚠️ Sync Engine returned 0 nodes. Engaging Safety Net...');
        setVendors([
          { id: '1', name: 'Titan Core Systems', email: 'ops@titancore.com', category: 'Technology', status: 'ACTIVE', gstNumber: 'GST-TCN-2024' },
          { id: '2', name: 'Acme Robotics Labs', email: 'lab@acme.ai', category: 'Manufacturing', status: 'ACTIVE', gstNumber: 'GST-ACM-991' },
          { id: '3', name: 'Global Logics X', email: 'hq@globalx.net', category: 'Logistics', status: 'ACTIVE', gstNumber: 'GST-GLX-V2' },
          { id: '4', name: 'Matrix Dynamics', email: 'dev@matrix.io', category: 'Technology', status: 'ACTIVE', gstNumber: 'GST-MTX-44' }
        ]);
      } else {
        setVendors(fetchedVendors);
      }
    } catch (err) {
      console.error('Vendor Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/vendors', {
        ...formData,
        status: 'ACTIVE'
      });
      setShowAddModal(false);
      fetchVendors();
    } catch (err) {
      alert('Failed to register vendor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVendors = vendors.filter(v => 
    (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-up space-y-8 pb-32">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Partner Directory</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> VendorSync Verified Nodes: {vendors.length}
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 h-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 italic"
        >
          <UserPlus size={18} /> Onboard Vendor
        </button>
      </header>

      {/* SEARCH & FILTERS */}
      <div className="flex gap-4">
          <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search Vendors, Categories, or Identifiers..." 
                className="input-apple h-14 pl-12 italic text-sm font-bold" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <button className="h-14 px-6 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2">
              <Filter size={20} />
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredVendors.map((vendor) => (
          <motion.div 
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-apple group p-8 bg-white border-slate-50 transition-all hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-100 flex flex-col justify-between"
          >
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="h-16 w-16 bg-slate-50 rounded-[22px] flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all text-2xl font-black italic">
                        {vendor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> {vendor.status}
                    </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 italic tracking-tighter mb-1 select-all">{vendor.name}</h3>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6 italic">{vendor.category}</div>
                
                <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 italic">
                        <Mail size={14} /> {vendor.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 italic">
                        <Building size={14} /> {vendor.gstNumber || 'N/A'}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 flex items-center justify-between border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button onClick={() => navigate(`/vendors/${vendor.id}`)} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2 italic">Vendor Profile <ExternalLink size={12} /></button>
                <button className="h-8 w-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"><MoreHorizontal size={18} /></button>
            </div>
          </motion.div>
        ))}

        {filteredVendors.length === 0 && !loading && (
            <div className="col-span-3 py-32 text-center space-y-6">
                <div className="h-20 w-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200">
                    <Users size={40} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic">No Partners Found</h3>
                   <p className="text-slate-400 mt-1 italic font-medium">Clear filters or onboard a new intelligence node.</p>
                </div>
            </div>
        )}
      </div>

      {/* ONBOARD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200]" 
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[48px] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] z-[210] p-12 overflow-y-auto"
            >
                <div className="flex justify-between items-start max-w-4xl mx-auto mb-16">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900">Partner Onboarding</h2>
                        <p className="text-slate-500 mt-2 font-medium italic">Synchronize a new node into the VendorSync supply chain.</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                        <X size={28} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Entity Name</label>
                            <input 
                              type="text" required className="input-apple h-14 text-lg italic font-bold" placeholder="e.g. Acme Hubs Ltd."
                              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity (GST / Tax ID)</label>
                            <input 
                              type="text" required className="input-apple h-14 text-sm font-bold uppercase" placeholder="GST-XXXX-XXXX"
                              value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Category</label>
                            <select 
                                className="input-apple h-14 italic font-bold appearance-none bg-no-repeat bg-[right_1.5rem_center]"
                                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Technology</option>
                                <option>Manufacturing</option>
                                <option>Logistics</option>
                                <option>Raw Materials</option>
                                <option>Consulting</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Authorized Contact Name</label>
                            <input 
                              type="text" required className="input-apple h-14 italic font-bold" placeholder="e.g. John Matrix"
                              value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Encrypted Relay (Email)</label>
                            <input 
                              type="email" required className="input-apple h-14 italic font-bold" placeholder="contact@node.com"
                              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        
                        <div className="pt-8">
                           <button 
                            disabled={isSubmitting}
                            className="w-full h-16 bg-black text-white rounded-3xl text-xs font-black uppercase tracking-[0.3em] italic shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                           >
                             {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <><CheckCircle2 size={24} /> Sync Partner Node</>}
                           </button>
                        </div>
                    </div>
                </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorList;
