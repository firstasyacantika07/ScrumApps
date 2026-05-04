import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Lock, 
  CreditCard, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import api from '../api/axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { planName, price, isAnnual, period } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!planName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-2xl border border-slate-200">
          <AlertCircle size={64} className="mx-auto text-slate-400 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Sesi Checkout Berakhir</h2>
          <p className="text-slate-600 mb-8">
            Data paket tidak ditemukan. Silakan pilih paket lagi dari halaman pricing.
          </p>
          <button 
            onClick={() => navigate('/pricing')}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-red-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Kembali ke Pricing
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Minta Snap Token ke Backend
      const response = await api.post('/subscription/checkout', {
        plan: planName,
        isAnnual: isAnnual,
        amount: parseInt(price.replace(/\./g, '')) // 150.000 -> 150000
      });

      const snapToken = response.data.token;

      // 2. Load Midtrans Snap Script jika belum ada
      if (!window.snap) {
        await loadMidtransScript();
      }

      // 3. Munculkan Snap Popup
      window.snap.pay(snapToken, {
        onSuccess: function(result) {
          console.log('Payment Success:', result);
          alert("🎉 Pembayaran Berhasil! Paket " + planName + " Anda akan segera aktif.");
          navigate('/dashboard');
        },
        onPending: function(result) {
          console.log('Payment Pending:', result);
          alert("⏳ Pembayaran sedang diproses. Silakan tunggu konfirmasi.");
          navigate('/dashboard');
        },
        onError: function(result) {
          console.log('Payment Error:', result);
          setError('Pembayaran gagal. Silakan coba lagi atau gunakan metode pembayaran lain.');
        },
        onClose: function() {
          console.log('Popup Closed');
          setError('Anda menutup popup sebelum menyelesaikan pembayaran.');
        }
      });

    } catch (err) {
      console.error('Checkout Error:', err);
      setError(err.response?.data?.message || "Gagal memproses pembayaran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const loadMidtransScript = () => {
    return new Promise((resolve, reject) => {
      if (window.snap) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Ganti ke production URL
      script.onload = () => {
        window.snap.configure({
          clientKey: process.env.REACT_APP_MIDTRANS_CLIENT_KEY // Simpan di .env
        });
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-8 pb-6">
        <button 
          onClick={() => navigate('/pricing')} 
          className="inline-flex items-center gap-3 text-slate-700 hover:text-red-600 font-semibold transition-all duration-300 hover:translate-x-[-2px] group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Pricing</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-24">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
            <ShieldCheck size={20} />
            Konfirmasi Pesanan
          </div>
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-red-600 bg-clip-text text-transparent mb-6">
            Finalisasi {planName}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Satu langkah lagi untuk unlock semua fitur premium ScrumApps {planName}.
          </p>
        </div>

        {/* Checkout Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 lg:p-12 shadow-2xl border border-slate-200/50">
          {/* Plan Summary */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-5 py-2 rounded-2xl text-sm font-bold shadow-md mb-6">
                {planName} PACKAGE
              </span>
              
              <div className="space-y-3 mb-8">
                <h2 className="text-3xl font-black text-slate-900">
                  {isAnnual ? 'Langganan Tahunan' : 'Langganan Bulanan'}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Akses penuh ke semua fitur {planName} selama{' '}
                  <span className="font-bold text-slate-900">
                    {isAnnual ? '12 bulan' : '1 bulan'}
                  </span>
                  .
                </p>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Zap size={24} className="text-red-500 flex-shrink-0" />
                  <span className="font-medium text-slate-700 text-sm">Aktivasi Instan</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl">
                  <CheckCircle size={24} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-emerald-800 text-sm">No Watermark</span>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="text-right lg:text-left">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-8 rounded-3xl border border-slate-200 shadow-inner">
                <div className="text-2xl text-slate-500 font-semibold mb-4">Total Tagihan</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-slate-500">Rp</span>
                  <span className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    {price}
                  </span>
                </div>
                <div className="text-lg text-slate-600 font-medium">
                  {period || (isAnnual ? '/tahun' : '/bulan')}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 mb-12"></div>

          {/* Payment Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap size={24} className="text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Aktivasi Instan</h4>
                  <p className="text-slate-600 text-sm">Paket aktif dalam hitungan detik setelah pembayaran berhasil.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Lock size={24} className="text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">100% Aman</h4>
                  <p className="text-slate-600 text-sm">Dilindungi Midtrans Payment Gateway bersertifikat PCI-DSS.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CreditCard size={24} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Metode Pembayaran</h4>
                  <p className="text-slate-600 text-sm">Kartu Kredit, Transfer Bank, E-Wallet, Alfamart & Indomaret</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle size={24} />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button 
            disabled={loading}
            onClick={handlePayment}
            className={`
              w-full py-8 px-12 rounded-3xl font-black text-xl uppercase tracking-wide transition-all duration-500 shadow-2xl flex items-center justify-center gap-4
              bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white hover:from-red-600 hover:via-red-700 hover:to-orange-600
              ${loading 
                ? 'opacity-75 cursor-not-allowed shadow-lg scale-95' 
                : 'hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                Menyiapkan Pembayaran Aman...
              </>
            ) : (
              <>
                <CreditCard size={28} />
                Bayar Sekarang Rp {price}
              </>
            )}
          </button>

          {/* Secure Footer */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-center gap-3 text-sm text-slate-500 font-medium">
            <ShieldCheck size={20} className="text-emerald-500" />
            <span>Checkout Aman dengan SSL 256-bit Encryption</span>
            <ShieldCheck size={20} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;