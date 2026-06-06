import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  CreditCard, Search, Download, Filter, 
  ExternalLink, CheckCircle2, Clock, AlertTriangle,
  RotateCw, FileText, ArrowRight, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const InvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsSyncing(true);
    try {
      const res = await api.get('/orders/invoices');
      setInvoices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Invoice Fetch Error:', err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const filteredInvoices = filter === 'ALL' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

  const handleDownload = (invoice: any) => {
    // Premium Simulated PDF Generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invNumber}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #000; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px; }
              .details { margin-top: 40px; display: grid; grid-template-cols: 1fr 1fr; gap: 40px; }
              .table { width: 100%; margin-top: 40px; border-collapse: collapse; }
              .table th, .table td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
              .total { margin-top: 40px; text-align: right; font-size: 24px; font-weight: 900; }
              .status { color: ${invoice.status === 'PAID' ? 'emerald' : 'red'}; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>VENDORBRIDGE</h1>
              <div>
                <strong>Invoice:</strong> ${invoice.invNumber}<br/>
                <strong>Date:</strong> ${new Date().toLocaleDateString()}<br/>
                <strong>Status:</strong> ${invoice.status}
              </div>
            </div>
            <div class="details">
              <div>
                <strong>Billed To:</strong><br/>
                VendorSync Global Corp.<br/>
                Tokyo Executive Hub
              </div>
              <div>
                <strong>Vendor Partner:</strong><br/>
                ${invoice.po?.vendor?.name || 'Authorized Partner'}<br/>
                ${invoice.po?.vendor?.email || ''}
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>PO Reference</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Procurement Services - Line Item Archive</td>
                  <td>${invoice.po?.poNumber}</td>
                  <td>$${invoice.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div class="total">Balance Due: $${invoice.amount.toLocaleString()}</div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Amount', 'Status', 'Vendor'];
    const rows = invoices.map(inv => [
      inv.invNumber,
      inv.amount,
      inv.status,
      inv.po?.vendor?.name || 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Invoices_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-up space-y-8 pb-32">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Financial Audit</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic flex items-center gap-2">
            <Clock size={14} /> Settlement Queue: {invoices.filter(i => i.status === 'UNPAID').length} Awaiting
          </p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={fetchInvoices}
                disabled={isSyncing}
                className="flex items-center gap-3 px-6 h-12 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all italic hover:shadow-xl hover:shadow-slate-100"
            >
                <RotateCw size={18} className={isSyncing ? 'animate-spin' : ''} /> Sync Records
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-3 px-8 h-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all italic">
                Export Statement
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6 text-sm font-black italic text-slate-400 uppercase tracking-widest">Filters
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6 h-fit cursor-default">
                <div className="space-y-3">
                    <label className="text-[9px]">Status Protocol</label>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setFilter('ALL')} className={cn("flex items-center justify-between px-4 py-2 rounded-xl border", filter === 'ALL' ? "bg-white text-slate-900 border-slate-200" : "hover:bg-white")}>All Nodes <CheckCircle2 size={14} /></button>
                        <button onClick={() => setFilter('UNPAID')} className={cn("flex items-center justify-between px-4 py-2 rounded-xl border", filter === 'UNPAID' ? "bg-white text-slate-900 border-slate-200" : "hover:bg-white")}>Pending Settlement</button>
                        <button onClick={() => setFilter('PAID')} className={cn("flex items-center justify-between px-4 py-2 rounded-xl border", filter === 'PAID' ? "bg-white text-slate-900 border-slate-200" : "hover:bg-white")}>Reconciled</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <AnimatePresence>
            {filteredInvoices.map((inv, idx) => (
              <motion.div 
                key={inv.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card-apple p-7 bg-white group hover:border-slate-300 transition-all border-slate-50 relative overflow-hidden"
              >
                <div className="flex justify-between items-center relative z-10">
                    <div className="flex gap-6 items-center">
                        <div className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all",
                            inv.status === 'PAID' ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-blue-50 border-blue-100 text-blue-500"
                        )}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">{inv.invNumber}</h3>
                                <span className={cn(
                                    "px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                    inv.status === 'PAID' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                )}>
                                    {inv.status}
                                </span>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest italic">{inv.po?.vendor?.name || 'Syncing Partner...'}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 italic tracking-tighter">${inv.amount.toLocaleString()}</div>
                        <div className="flex gap-4 mt-3">
                            <button 
                              onClick={() => handleDownload(inv)}
                              className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-1.5"
                            >
                                <Download size={14} /> PDF
                            </button>
                            <button className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-1.5">
                                <ArrowRight size={14} /> Audit PO
                            </button>
                        </div>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {invoices.length === 0 && !loading && (
             <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                <AlertTriangle size={32} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No financial records detected in current partition.</h3>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicesList;
