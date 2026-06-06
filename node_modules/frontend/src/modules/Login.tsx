import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-white rounded-2xl border border-slate-200 shadow-xl p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
            V
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to VendorSync</h1>
          <p className="text-slate-500 text-sm mt-2 text-center">Enterprise procurement management for top teams.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                className="input-apple pl-10 h-11" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <button type="button" onClick={() => alert('Please contact the System Admin to reset your password.')} className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                className="input-apple pl-10 h-11" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-apple-primary h-11 text-base shadow-lg shadow-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Continue"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Internal team access only. <Link to="/register" className="text-slate-900 font-bold hover:underline">Request access</Link>
          </p>
        </div>
      </motion.div>

      <div className="mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest flex gap-6">
        <Link to="#" className="hover:text-slate-600">Privacy</Link>
        <Link to="#" className="hover:text-slate-600">Terms</Link>
        <Link to="#" className="hover:text-slate-600">Support</Link>
      </div>
    </div>
  );
};

export default Login;
