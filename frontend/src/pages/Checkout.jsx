import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, Landmark, ShieldCheck, ChevronLeft, Ticket } from 'lucide-react';
import './css/Pricing.css'; // Menggunakan basis styling pricing

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Mengambil data paket dari halaman pricing (default PRO jika akses langsung)
  const plan = location.state?.plan || { name: "PRO", price: "150.000", period: "/ bulan" };
  
  const [method, setMethod] = useState('qris');

  const handlePayment = () => {
    alert("Simulasi: Mengalihkan ke Gerbang Pembayaran...");
    setTimeout(() => {
        alert("Pembayaran Berhasil! Selamat datang di paket " + plan.name);
        navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="pricing-wrapper font-['Poppins']">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-8 hover:text-red-500 transition-colors">
          <ChevronLeft size={20} /> Kembali ke Pricing
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* SISI KIRI: METODE PEMBAYARAN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Metode Pembayaran</h2>
              
              <div className="grid gap-4">
                <PaymentOption 
                  id="qris" title="QRIS (Gopay, OVO, Dana)" 
                  icon={<Wallet size={20}/>} active={method === 'qris'} 
                  onClick={() => setMethod('qris')} 
                />
                <PaymentOption 
                  id="va" title="Virtual Account (BCA, Mandiri, BNI)" 
                  icon={<Landmark size={20}/>} active={method === 'va'} 
                  onClick={() => setMethod('va')} 
                />
                <PaymentOption 
                  id="card" title="Kartu Kredit / Debit" 
                  icon={<CreditCard size={20}/>} active={method === 'card'} 
                  onClick={() => setMethod('card')} 
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-700 mb-4">
                <Ticket size={20} className="text-red-500" />
                <h3 className="font-bold">Punya Kode Promo?</h3>
              </div>
              <div className="flex gap-3">
                <input type="text" placeholder="Masukkan kode" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-red-500" />
                <button className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold text-sm">Gunakan</button>
              </div>
            </div>
          </div>

          {/* SISI KANAN: RINGKASAN PESANAN */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[30px] border-2 border-red-500 shadow-xl sticky top-8">
              <h3 className="text-lg font-bold mb-6">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 pb-6 border-bottom border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Paket {plan.name}</span>
                  <span className="font-bold text-sm">Rp {plan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">PPN (11%)</span>
                  <span className="font-bold text-sm text-green-500">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 mb-8">
                <span className="font-bold">Total Bayar</span>
                <span className="text-2xl font-extrabold text-red-500">Rp {plan.price}</span>
              </div>

              <button onClick={handlePayment} className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                Bayar Sekarang <ShieldCheck size={18} />
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
                Dengan menekan tombol di atas, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi ScrumApps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentOption = ({ title, icon, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${active ? 'border-red-500 bg-red-50' : 'border-gray-50 hover:border-gray-200'}`}
  >
    <div className={`${active ? 'text-red-500' : 'text-gray-400'}`}>{icon}</div>
    <span className={`text-sm font-bold ${active ? 'text-red-600' : 'text-gray-600'}`}>{title}</span>
    {active && <div className="ml-auto w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_#ee1e2d]"></div>}
  </div>
);

export default Checkout;