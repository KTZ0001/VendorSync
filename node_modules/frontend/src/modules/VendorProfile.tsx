import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Building, Mail, MapPin } from 'lucide-react';

const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/vendors/${id}`);
        setVendor(res.data);
      } catch (err) {
        console.error('Failed to fetch vendor:', err);
      }
    };
    fetchVendor();
  }, [id]);

  if (!vendor) return <div className="p-10">Loading profile...</div>;

  return (
    <div className="space-y-8">
        <button onClick={() => navigate('/vendors')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-black">
            <ArrowLeft size={16} /> Back to Directory
        </button>
        <div className="card-apple p-12 bg-white">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">{vendor.name}</h1>
            <p className="text-blue-500 font-black italic tracking-widest uppercase text-sm mt-2">{vendor.category}</p>
            
            <div className="mt-10 grid grid-cols-2 gap-8 border-t pt-10">
                <div className="flex items-center gap-4 text-slate-600 font-bold">
                    <Mail size={20} /> {vendor.email}
                </div>
                <div className="flex items-center gap-4 text-slate-600 font-bold">
                    <Building size={20} /> {vendor.gstNumber}
                </div>
            </div>
        </div>
    </div>
  );
};

export default VendorProfile;
