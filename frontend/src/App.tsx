import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './modules/Dashboard';
import RFQList from './modules/RFQList';
import VendorList from './modules/VendorList';
import VendorProfile from './modules/VendorProfile';
import OrdersList from './modules/OrdersList';
import QuotationsList from './modules/QuotationsList';
import InvoicesList from './modules/InvoicesList';
import Analytics from './modules/Analytics';
import Settings from './modules/Settings';
import Approvals from './modules/Approvals';
import Login from './modules/Login';
import Register from './modules/Register';
import { useAuth } from './context/AuthContext';

const ProtectedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<ProtectedWrapper><Dashboard /></ProtectedWrapper>} />
        <Route path="/rfqs" element={<ProtectedWrapper><RFQList /></ProtectedWrapper>} />
        <Route path="/vendors" element={<ProtectedWrapper><VendorList /></ProtectedWrapper>} />
        <Route path="/vendors/:id" element={<ProtectedWrapper><VendorProfile /></ProtectedWrapper>} />
        <Route path="/quotations" element={<ProtectedWrapper><QuotationsList /></ProtectedWrapper>} />
        <Route path="/approvals" element={<ProtectedWrapper><Approvals /></ProtectedWrapper>} />
        <Route path="/orders" element={<ProtectedWrapper><OrdersList /></ProtectedWrapper>} />
        <Route path="/invoices" element={<ProtectedWrapper><InvoicesList /></ProtectedWrapper>} />
        <Route path="/analytics" element={<ProtectedWrapper><Analytics /></ProtectedWrapper>} />
        <Route path="/settings" element={<ProtectedWrapper><Settings /></ProtectedWrapper>} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
