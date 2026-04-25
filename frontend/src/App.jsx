import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail"; 
import Users from "./pages/Users";
import Info from "./pages/Info";
import KelolaProfil from "./pages/KelolaProfil";
import './index.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/projects" element={<ProjectList />} />
        
        <Route path="/projects/:id/*" element={<ProjectDetail />} />
        
        
        <Route path="/users" element={<Users/>} />
        <Route path="/info" element={<Info/>} />
        <Route path="/kelolaprofil" element={<KelolaProfil/>} />
        
        <Route path="*" element={<div className="p-10 text-center">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </Router>
  );
}

export default App;