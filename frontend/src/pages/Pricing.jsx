import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  Check, 
  Zap, 
  Building2, 
  Rocket, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';
import api from '../api/axios';
import '../index.css';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setCurrentPlan(res.data.user?.package_type || null);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const plans = [
    {
      name: "FREE",
      icon: Zap,
      price: "0",
      description: "Esensial untuk manajemen proyek personal dan pelajar.",
      features: ["1 Jumlah Proyek", "Maks 5 Orang / Proyek", "Backlog PDF (Watermark)"],
      notIncluded: ["Integrasi Trello", "Integrasi Github", "Custom Logo PDF"],
      buttonText: "Mulai Gratis",
      accent: "bg-slate-100 text-slate-600",
      recommended: false
    },
    {
      name: "PRO",
      icon: Rocket,
      price: isAnnual ? "1.500.000" : "150.000",
      period: isAnnual ? "/ tahun" : "/ bulan",
      description: "Fitur lengkap untuk tim profesional yang sedang berkembang.",
      features: ["5 Jumlah Proyek", "Maks 25 Orang / Proyek", "Backlog PDF (No Watermark)", "Integrasi Trello"],
      notIncluded: ["Integrasi Github", "Custom Logo PDF"],
      buttonText: "Pilih Paket PRO",
      recommended: true,
      accent: "bg-red-100 text-red-600 border-red-500"
    },
    {
      name: "ENTERPRISE",
      icon: Building2,
      price: "Custom",
      description: "Kontrol penuh dan kustomisasi untuk skala organisasi besar.",
      features: ["Proyek Tanpa Batas", "Tim Tanpa Batas", "PDF dengan Logo", "Integrasi Trello & Github", "Dedicated Support"],
      notIncluded: [],
      buttonText: "Hubungi Penjualan",
      accent: "bg-slate-800 text-slate-100",
      recommended: false
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan.name === currentPlan) return;
    
    if (plan.name === "ENTERPRISE") {
      window.location.href = "mailto:sales@scrumapps.com?subject=Enterprise Inquiry";
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        planName: plan.name, 
        price: plan.price, 
        isAnnual, 
        period: plan.period 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
      {/* Navbar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-8 pb-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-semibold transition-all duration-200 hover:translate-x-[-4px] group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Dashboard
        </button>
      </div>

      {/* Header Section */}
      <div className="text-center py-20 px-6">
        <div className="inline-block bg-red-100 text-red-700 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
          TRANSPARENT PRICING
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
          Pilih Rencana Kesuksesan Tim
        </h1>
        
        {/* Toggle Switch */}
        <div className="max-w-md mx-auto">
          <div className="bg-slate-100 p-1 rounded-full flex gap-1 shadow-lg">
            <button
              onClick={() => setIsAnnual(false)}
              className={`flex-1 py-3 px-6 rounded-full font-bold text-sm transition-all duration-300 ${
                !isAnnual
                  ? 'bg-white shadow-md text-slate-900'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex-1 py-3 px-6 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                isAnnual
                  ? 'bg-white shadow-md text-red-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Tahunan
              {isAnnual && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  -20%
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isCurrent = plan.name === currentPlan;
            
            return (
              <div
                key={plan.name}
                className={`
                  group relative bg-white rounded-3xl p-8 lg:p-10 shadow-xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:border-red-200 cursor-pointer overflow-hidden
                  ${plan.recommended ? 'border-red-500 ring-4 ring-red-50/50 shadow-red-100/50 lg:col-span-1' : 'border-slate-200 hover:border-red-200'}
                  ${isCurrent ? 'ring-4 ring-green-200 border-green-400 shadow-green-100/50' : ''}
                `}
                onClick={() => handleSelectPlan(plan)}
              >
                {/* Popular Badge */}
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg">
                    ⭐ REKOMENDASI
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <ShieldCheck size={14} />
                    AKTIF
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 ${plan.accent} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={28} />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-4">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm lg:text-base mb-8 leading-relaxed">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-10">
                  <div className="flex items-baseline gap-2 mb-2">
                    {plan.price !== "Custom" && (
                      <span className="text-slate-500 font-semibold text-lg">Rp</span>
                    )}
                    <span className="text-4xl lg:text-5xl font-black text-slate-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-slate-500 font-medium text-sm">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  {plan.price === "Custom" && (
                    <span className="text-xs text-slate-500 font-medium">Hubungi sales untuk harga</span>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 mb-8"></div>

                {/* Features */}
                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <Check size={14} className="text-white" />
                      </div>
                      <span className="text-slate-700 font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button 
                  disabled={isCurrent}
                  className={`
                    w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2
                    ${isCurrent 
                      ? 'bg-slate-100 text-slate-500 border-2 border-slate-200 cursor-not-allowed' 
                      : plan.recommended 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-500/25' 
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-500/25'
                    }
                  `}
                >
                  {isCurrent ? (
                    <>
                      <ShieldCheck size={18} />
                      Paket Aktif
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-16 bg-white/50 backdrop-blur-sm border-t border-slate-200">
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          Semua paket dilengkapi dengan <strong>support 24/7</strong> dan{' '}
          <strong>update fitur gratis seumur hidup</strong>. Tidak ada biaya tersembunyi.
        </p>
      </div>
    </div>
  );
};

export default Pricing;