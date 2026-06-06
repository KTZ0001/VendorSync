import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Printer, Mail, FileText, ChevronRight, 
  Search, Download, MoreVertical, CreditCard, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/po');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="h-20 w-full bg-slate-50 animate-pulse rounded-xl" />;

  return (
    <div className="fade-up space-y-8 h-full">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Execution Docs</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Filter by PO#" className="input-apple pl-9 h-10" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[calc(100vh-180px)]">
        {/* Sidebar List */}
        <div className={cn(
          "space-y-3 overflow-y-auto pr-2 h-full",
          selectedOrder ? "lg:col-span-4" : "lg:col-span-12"
        )}>
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              onClick={() => setSelectedOrder(order)}
              className={cn(
                "card-apple p-5 cursor-pointer border-transparent transition-all",
                selectedOrder?.id === order.id ? "border-slate-300 ring-4 ring-slate-100 bg-white" : "hover:bg-slate-50"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.poNumber}</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{order.vendor.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">${order.totalAmount.toLocaleString()}</div>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">Active</span>
                </div>
              </div>
            </motion.div>
          ))}
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
              <CreditCard size={40} className="mb-4 opacity-50" />
              <p className="font-semibold">No transactions yet</p>
              <p className="text-xs">Once you select a vendor, POs will appear here.</p>
            </div>
          )}
        </div>

        {/* Document Detail */}
        <AnimatePresence mode="wait">
          {selectedOrder && (
            <motion.div 
              key={selectedOrder.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-8 h-full overflow-y-auto pb-10"
            >
              <div className="card-apple p-0 shadow-2xl printable overflow-hidden border-slate-200 bg-white rounded-3xl">
                <div className="bg-slate-900 px-8 py-6 flex justify-between items-center text-white no-print">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedOrder(null)} className="lg:hidden p-2 -ml-2"><ChevronLeft size={20} /></button>
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/10">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">PO REVISION B</div>
                      <div className="text-lg font-bold">{selectedOrder.poNumber}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handlePrint} className="h-9 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 text-xs font-semibold">
                      <Printer size={16} /> Print
                    </button>
                    <button className="h-9 px-4 rounded-lg bg-white text-black hover:bg-slate-100 transition-colors flex items-center gap-2 text-xs font-semibold">
                      <Download size={16} /> Export
                    </button>
                  </div>
                </div>

                <div className="p-16 space-y-12 text-slate-900 min-h-[1000px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Purchase Order</h2>
                      <div className="mt-4 space-y-1 text-sm text-slate-400 font-medium">
                        <p>ID: <span className="text-slate-900">PO-{1000 + Math.floor(Math.random()*900)}</span></p>
                        <p>Issued: <span className="text-slate-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black tracking-tight uppercase">VendorBridge ERP</div>
                      <p className="text-xs text-slate-400 mt-1 font-medium italic">Verified Blockchain Verified Entity</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Destination Address</div>
                      <div className="text-sm font-bold leading-relaxed">
                        <p>Operations Command Alpha</p>
                        <p className="font-medium text-slate-500">45 Supply Lane, Tech Hub</p>
                        <p className="font-medium text-slate-500">San Francisco, CA 94101</p>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Vendor Intelligence</div>
                      <div className="text-sm font-bold leading-relaxed text-right">
                        <p>{selectedOrder.vendor.name}</p>
                        <p className="font-medium text-slate-500">{selectedOrder.vendor.email}</p>
                        <p className="font-medium text-slate-500">GST: {selectedOrder.vendor.gstNumber}</p>
                      </div>
                    </div>
                  </div>

                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="py-5">Description of Supply / Service</th>
                        <th className="py-5 text-right">Tax (%)</th>
                        <th className="py-5 text-right">Total Net Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-10">
                          <div className="text-lg font-black text-slate-900">Strategic Infrastructure Procurement</div>
                          <p className="text-xs text-slate-400 mt-1 font-medium italic">Reference RFQ-Generated Competitive Selection</p>
                        </td>
                        <td className="py-10 text-right font-bold text-slate-500">18%</td>
                        <td className="py-10 text-right font-black text-slate-900 text-2xl">${selectedOrder.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-12 border-t border-slate-100 flex justify-between items-end">
                    <div className="max-w-xs space-y-4">
                      <div className="text-[10px] text-slate-300 uppercase font-black tracking-widest">Certification</div>
                      <p className="text-[10px] leading-relaxed text-slate-400 font-medium italic">
                        This digital ledger entry confirms the legal authorization for payment based on cross-signed vendor quotations and internal procurement audits.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-300 uppercase font-black mb-1">Total Authorization</div>
                      <div className="text-5xl font-black tracking-tighter text-slate-900 leading-none">${selectedOrder.totalAmount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersList;
