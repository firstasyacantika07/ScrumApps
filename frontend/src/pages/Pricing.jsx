import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Check, X, Zap, Building2, Rocket } from 'lucide-react';
import './css/Pricing.css';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate(); // Inisialisasi hook navigasi

  const plans = [
    {
      name: "FREE",
      icon: <Zap size={24} className="text-gray-400" />,
      price: "0",
      description: "Cocok untuk pelajar atau proyek personal kecil.",
      features: [
        "1 Jumlah Proyek",
        "Maks 5 Orang / Proyek",
        "Backlog PDF (Watermark)",
      ],
      notIncluded: ["Integrasi Trello", "Integrasi Github", "Custom Logo PDF"],
      buttonText: "Mulai Gratis",
      recommended: false
    },
    {
      name: "PRO",
      icon: <Rocket size={24} className="text-red-500" />,
      // Logika harga: Bulanan 150rb, Tahunan 1.5jt (Hemat 20% dibanding 1.8jt)
      price: isAnnual ? "1.500.000" : "150.000",
      period: isAnnual ? "/ tahun" : "/ bulan",
      trial: "TRIAL AKSES 14 HARI",
      description: "Solusi terbaik untuk tim profesional dan startup.",
      features: [
        "15 Jumlah Proyek",
        "Maks 25 Orang / Proyek",
        "Backlog PDF (Tanpa Watermark)",
        "Integrasi Trello",
      ],
      notIncluded: ["Integrasi Github", "Custom Logo PDF"],
      buttonText: "Coba Gratis 14 Hari",
      recommended: true
    },
    {
      name: "ENTERPRISE",
      icon: <Building2 size={24} className="text-gray-700" />,
      price: "Custom",
      description: "Skala besar dengan kontrol penuh dan kustomisasi.",
      features: [
        "Proyek Tanpa Batas",
        "Tim Tanpa Batas",
        "PDF dengan Logo Perusahaan",
        "Integrasi Trello & Github",
        "Prioritas Dukungan",
      ],
      notIncluded: [],
      buttonText: "Hubungi Penjualan",
      recommended: false
    }
  ];

  // Fungsi untuk menangani pemilihan paket
  const handleSelectPlan = (plan) => {
    if (plan.name === "ENTERPRISE") {
      // Untuk enterprise biasanya diarahkan ke kontak/email
      window.location.href = "mailto:sales@scrumapps.com?subject=Inquiry Enterprise Plan";
    } else {
      // Kirim data paket ke halaman checkout melalui state
      navigate('/checkout', { 
        state: { 
          plan: {
            name: plan.name,
            price: plan.price,
            period: plan.period || "/ bulan"
          } 
        } 
      });
    }
  };

  return (
    <div className="pricing-wrapper font-['Poppins']">
      <div className="pricing-header">
        <span className="pricing-badge">Pricing Plans</span>
        <h1>Pilih Paket SaaS ScrumApps</h1>
        <p>Optimalkan alur kerja Agile tim Anda dengan paket yang tepat.</p>

        {/* Toggle Bulanan/Tahunan */}
        <div className="pricing-toggle-container">
          <span className={!isAnnual ? "active-period" : "text-gray-400"}>Bulanan</span>
          <div className={`toggle-switch ${isAnnual ? "active" : ""}`} onClick={() => setIsAnnual(!isAnnual)}>
            <div className="toggle-knob"></div>
          </div>
          <span className={isAnnual ? "active-period" : "text-gray-400"}>
            Tahunan <span className="save-tag">Hemat 20%</span>
          </span>
        </div>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}>
            {plan.recommended && <div className="popular-badge">Paling Populer</div>}
            
            <div className="card-top">
              <div className="plan-icon-box">{plan.icon}</div>
              <h3>{plan.name}</h3>
              <p className="plan-desc">{plan.description}</p>
              
              <div className="price-display">
                {plan.price !== "Custom" && <span className="currency">Rp</span>}
                <span className="amount">{plan.price}</span>
                {plan.period && <span className="period">{plan.period}</span>}
              </div>
              
              {plan.trial && <div className="trial-badge">{plan.trial}</div>}
            </div>

            <div className="card-features">
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <Check size={18} className="text-green-500" /> <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="feature-item disabled">
                    <X size={18} className="text-gray-300" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tambahkan Event Handler pada Button */}
            <button 
              onClick={() => handleSelectPlan(plan)}
              className={`btn-pricing ${plan.recommended ? 'btn-red' : 'btn-outline'}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;