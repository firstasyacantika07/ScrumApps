import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail"; 
import Users from "./pages/Users"; 
import Info from "./pages/Info";
import KelolaProfil from "./pages/KelolaProfil";
import { ROLES } from "./components/shared/sidebarMenu";

function App() {
  // Ambil data user dari storage untuk pengecekkan role
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role; 

  return (
    <Router>
      <Routes>
        {/* Rute Autentikasi */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rute Utama dengan Sidebar (Dashboard, Proyek, dll) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />
        
        {/* RUTE DETAIL PROYEK: 
          Diletakkan sejajar agar tidak terpengaruh oleh layout sidebar di Dashboard/ProjectList.
          Ini akan membuat ProjectDetail tampil Full Screen.
        */}
        <Route path="/projects/:id/*" element={<ProjectDetail />} />

        {/* Rute Lainnya */}
        <Route path="/info" element={<Info/>} />
        <Route path="/kelolaprofil" element={<KelolaProfil/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/billing" element={<Billing/>} />
        
        {/* Proteksi Rute Superadmin */}
        <Route 
          path="/users" 
          element={userRole === 'Superadmin' ? <Users /> : <Navigate to="/dashboard" />} 
        />

        {/* Fallback 404 */}
        <Route path="*" element={<div className="p-10 text-center">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </Router>
  );
}

export default App;