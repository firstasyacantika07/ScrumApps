import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail"; 
import Users from "./pages/Users"; // Pastikan import ini sesuai dengan nama komponen Anda
import Info from "./pages/Info";
import KelolaProfil from "./pages/KelolaProfil";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Billing from "./pages/Billing";

function App() {
  // --- TAMBAHKAN BARIS INI ---
  // Kita ambil data user dari storage untuk mengecek role
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role; 
  // ---------------------------

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id/*" element={<ProjectDetail />} />
        <Route path="/info" element={<Info/>} />
        <Route path="/kelolaprofil" element={<KelolaProfil/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/billing" element={<Billing/>} />
        
        {/* PERBAIKAN DI SINI: Menggunakan userRole yang sudah didefinisikan di atas */}
        <Route 
          path="/users" 
          element={userRole === 'Superadmin' ? <Users /> : <Navigate to="/dashboard" />} 
        />

        <Route path="*" element={<div className="p-10 text-center">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </Router>
  );
}

export default App;