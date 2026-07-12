import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import VendorManagement from './pages/VendorManagement';
import VendorDetails from './pages/VendorDetails';
import RFQCreate from './pages/RFQCreate';
import RFQListing from './pages/RFQListing';
import QuotationSubmit from './pages/QuotationSubmit';
import QuotationComparison from './pages/QuotationComparison';
import ApprovalWorkflow from './pages/ApprovalWorkflow';
import PurchaseOrder from './pages/PurchaseOrder';
import Invoice from './pages/Invoice';
import ActivityLogs from './pages/ActivityLogs';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/vendors" element={<VendorManagement />} />
                  <Route path="/vendors/:id" element={<VendorDetails />} />
                  <Route path="/rfq" element={<RFQListing />} />
                  <Route path="/rfq/create" element={<RFQCreate />} />
                  <Route path="/quotations/submit" element={<QuotationSubmit />} />
                  <Route path="/quotations/compare" element={<QuotationComparison />} />
                  <Route path="/approvals" element={<ApprovalWorkflow />} />
                  <Route path="/purchase-orders" element={<PurchaseOrder />} />
                  <Route path="/invoices" element={<Invoice />} />
                  <Route path="/activity" element={<ActivityLogs />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
