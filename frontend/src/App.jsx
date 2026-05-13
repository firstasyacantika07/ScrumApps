import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
import MainLayout from "./layouts/MainLayout"; 

// Komponen pembungkus untuk memproteksi rute yang butuh login
const ProtectedRoute = ({ children, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  // Gunakan state agar React me-render ulang saat user login/logout
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    // Fungsi untuk memantau perubahan localStorage secara real-time
    const handleStorageChange = () => {
      const loggedUser = localStorage.getItem('user');
      if (loggedUser) {
        setUser(JSON.parse(loggedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Interval bantuan untuk mendeteksi perubahan di tab yang sama tanpa reload
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Menyeragamkan format role agar pengecekan rute admin lebih stabil
  // Menambahkan pengecekan null-safe agar tidak error saat user belum login
  const userRole = user?.role?.toString().toLowerCase().replace(/\s+/g, '') || ''; 

  return (
    // Client ID ini membungkus seluruh aplikasi agar fitur Google Login bisa digunakan
    // Ganti YOUR_GOOGLE_CLIENT_ID dengan ID asli dari Google Cloud Console Anda
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rute Terproteksi (Hanya bisa diakses jika sudah login) */}
          <Route element={
            <ProtectedRoute user={user}>
              {/* Mengirimkan data user ke MainLayout agar Sidebar bisa menerima userRole */}
              <MainLayout userData={user} />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id/*" element={<ProjectDetail />} />
            <Route path="/info" element={<Info/>} />
            <Route path="/kelolaprofil" element={<KelolaProfil/>} />
            
            {/* Rute Billing yang bisa diakses dari klik kartu dashboard */}
            <Route path="/settings/billing" element={<Pricing />} /> 
            
            {/* Proteksi level role untuk halaman Users */}
            {/* Hanya superadmin yang bisa mengakses, selain itu dilempar ke dashboard */}
            <Route 
              path="/users" 
              element={userRole === 'superadmin' ? <Users /> : <Navigate to="/dashboard" replace />} 
            />
          </Route>

          {/* Rute Luar Lainnya */}
          <Route path="/pricing" element={<Pricing/>} />
          <Route path="/checkout" element={<Checkout/>} />
          
          {/* Fallback jika route tidak ditemukan */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;