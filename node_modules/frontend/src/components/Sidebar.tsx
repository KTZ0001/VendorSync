import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Package, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="glass-panel" style={{ width: '280px', margin: '16px', height: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
          <Package size={24} color="white" />
        </div>
        <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>VendorBridge</span>
      </div>

      <div style={{ marginBottom: '32px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>{user?.fullName}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.role.replace('_', ' ')}</div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink to="/rfqs" icon={<FileText size={20} />} label="Request for Quotes" />
        <SidebarLink to="/vendors" icon={<Users size={20} />} label="Vendor Directory" />
        <SidebarLink to="/orders" icon={<ShoppingCart size={20} />} label="Orders & Invoices" />
        <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
        <button 
          onClick={handleLogout}
          className="btn-logout" 
          style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px', padding: '12px' }}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      textDecoration: 'none',
      color: isActive ? 'white' : 'var(--text-muted)',
      background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
      transition: 'all 0.3s ease',
      border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
    })}
  >
    {icon}
    <span style={{ fontWeight: 500 }}>{label}</span>
  </NavLink>
);

export default Sidebar;
