import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Bell, Shield, 
  Database, Globe, ShieldCheck, Clock, Key,
  Lock, AlertCircle, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'engine' | 'logs' | 'security'>('engine');

  const handleExportAuditLogs = async () => {
      try {
          const res = await api.get('/activity/logs');
          const logs = res.data;
          const logContent = logs.map((log: any) => 
              `[${log.createdAt}] ${log.action} - User: ${log.userId} - Details: ${log.details}`
          ).join('\n');
          const blob = new Blob([logContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `Audit_Logs_${new Date().toISOString().slice(0, 10)}.txt`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (err) {
          alert('Failed to prepare archives.');
          console.error(err);
      }
  };

  const tabs = [
    { id: 'engine', label: 'Engine', icon: <SettingsIcon size={18} /> },
    { id: 'logs', label: 'Logs', icon: <Terminal size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="fade-up space-y-8 max-w-[1000px] mx-auto pb-20">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic leading-none">System Settings</h1>
        <p className="text-slate-500 mt-2 font-medium italic">Configure the core procurement engine and workspace identity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
            <nav className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-black italic transition-all rounded-xl",
                      activeTab === tab.id 
                        ? "text-slate-900 bg-white border border-slate-200 shadow-sm" 
                        : "text-slate-400 hover:text-slate-900 border border-transparent"
                    )}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
            </nav>
        </div>

        <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'engine' && (
                <motion.div 
                  key="engine"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                    <div className="card-apple p-12 bg-white border-slate-100 shadow-2xl shadow-slate-100">
                        <h3 className="font-black text-xl italic uppercase tracking-tighter mb-8">Workspace Branding</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Organization Alias</label>
                                <input type="text" className="input-apple h-12 italic font-bold" defaultValue="VendorSync Global Corp." />
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Base Currency</label>
                                    <input type="text" className="input-apple h-12 italic" defaultValue="USD ($)" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Timezone</label>
                                    <input type="text" className="input-apple h-12 italic" defaultValue="UTC (Synchronized)" />
                                </div>
                            </div>
                            <div className="pt-4">
                              <button className="btn-apple-primary h-12 px-10 text-[10px] font-black uppercase tracking-[0.25em] italic shadow-xl shadow-slate-100">Update Profile</button>
                            </div>
                        </div>
                    </div>

                    <div className="card-apple p-12 bg-slate-50 border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">Database Node Status</h3>
                            <p className="text-xs text-slate-400 font-medium italic mt-1">Operational | Local SQLite Latency: 2ms</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 shadow-inner">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div 
                  key="logs"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="card-apple p-10 bg-black text-white border-black font-mono text-[10px]">
                    <div className="flex items-center gap-2 mb-4 text-emerald-500 font-black">
                      <Terminal size={14} /> LIVE SYSTEM TRAFFIC
                    </div>
                    <div className="space-y-2 text-white/60">
                      <div>[11:24:02] <span className="text-blue-400">AUTH_SUCCESS</span> User session initiated via 127.0.0.1</div>
                      <div>[11:24:05] <span className="text-emerald-400">DB_WRITE</span> Injected 3x Vendor nodes into partition alpha</div>
                      <div>[11:25:01] <span className="text-blue-400">PO_GEN</span> Generated manifest PO-882-C for Titan Systems</div>
                      <div>[11:26:12] <span className="text-yellow-400">SYNC_IDLE</span> Heartbeat confirmed via local gateway</div>
                      <div className="animate-pulse">_</div>
                    </div>
                  </div>
                  <div className="card-apple p-8 border-slate-100">
                    <h3 className="font-black text-lg italic uppercase tracking-tighter mb-4">Export Audit Log</h3>
                    <p className="text-xs text-slate-400 mb-6 italic">Generate a comprehensive CSV of all procurement actions for the current fiscal quarter.</p>
                    <button onClick={handleExportAuditLogs} className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-slate-100">Prepare Archives</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="card-apple p-8 border-slate-100 bg-white">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-6 border border-slate-100"><Key size={20} /></div>
                      <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-1">Access Control</h4>
                      <h3 className="font-black text-lg italic uppercase tracking-tighter mb-2">Two-Factor Authentication</h3>
                      <p className="text-xs text-slate-400 mb-6 italic">Secure your account with an additional layer of protection via mobile device.</p>
                      <button className="px-5 py-2 bg-slate-50 text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 italic">Configure 2FA</button>
                    </div>
                    <div className="card-apple p-8 border-slate-100 bg-white">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-6 border border-slate-100"><Lock size={20} /></div>
                      <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-1">Cryptography</h4>
                      <h3 className="font-black text-lg italic uppercase tracking-tighter mb-2">RSA Key Encryption</h3>
                      <p className="text-xs text-slate-400 mb-6 italic">Reset the master encryption keys used for secure vendor communications.</p>
                      <button className="px-5 py-2 bg-slate-50 text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 italic">Rotate Keys</button>
                    </div>
                  </div>
                  
                  <div className="card-apple p-8 border-red-50 bg-red-50/20">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center border border-red-200 shrink-0"><AlertCircle size={20} /></div>
                      <div>
                        <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">Emergency Purge</h3>
                        <p className="text-xs text-slate-400 font-medium italic mt-1 max-w-md leading-relaxed">Permanently delete the current workspace, all associated vendors, and procurement history. This action is irreversible.</p>
                        <button className="mt-6 text-[10px] font-black text-red-600 uppercase tracking-[0.2em] italic border-b border-red-200 pb-0.5 hover:text-red-800 transition-colors">Wipe Master Repository</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
