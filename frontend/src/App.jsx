import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail"; 
import Users from "./pages/Users"; 
import Info from "./pages/Info";
import KelolaProfil from "./pages/KelolaProfil";
import Pricing from "./pages/Pricing";
import Checkout from './pages/Checkout';
import { ROLES } from "./components/shared/sidebarMenu";
import MainLayout from "./layouts/MainLayout"; 

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role; 

  return (
    <Router>
      <Routes>
        {/* Rute Autentikasi */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rute dengan Sidebar (MainLayout) */}
        <Route element={<MainLayout userData={user} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id/*" element={<ProjectDetail />} />
          <Route path="/info" element={<Info/>} />
          <Route path="/kelolaprofil" element={<KelolaProfil/>} />
          
          {/* Rute Billing/Pricing agar bisa diakses dari klik dashboard */}
          <Route path="/settings/billing" element={<Pricing />} /> 
          
          <Route 
            path="/users" 
            element={userRole === 'Superadmin' ? <Users /> : <Navigate to="/dashboard" />} 
          />
        </Route>

        {/* Rute Luar */}
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/checkout" element={<Checkout/>} />
        
        <Route path="*" element={<div className="p-10 text-center">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </Router>
  );
}

export default App;