import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'PROCUREMENT_OFFICER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      const loginRes = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      login(loginRes.data.access_token, loginRes.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-2xl border border-slate-200 shadow-xl p-12"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
            V
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Request Access</h1>
          <p className="text-slate-500 text-sm mt-3">Join the platform to manage global vendor partnerships.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Legal Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" className="input-apple pl-11 h-12" placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Organization Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" className="input-apple pl-11 h-12" placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" className="input-apple pl-11 h-12" placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Professional Role</label>
            <select 
              className="input-apple h-12 px-4 font-medium" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
              <option value="MANAGER">Executive Manager</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-apple-primary h-12 text-base shadow-xl shadow-slate-100 mt-4 gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Join Platform <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-slate-900 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
