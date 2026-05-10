import React from 'react';
import { useNavigate } from 'react-router-dom';
// Perbaikan path: Sesuaikan dengan lokasi MainLayout.jsx di sidebar VS Code Anda
import MainLayout from '../components/shared/sidebarMenu/MainLayout';
import { CreditCard, History, Download, ShieldCheck, Zap } from 'lucide-react';

const Billing = () => {
  const navigate = useNavigate();

  // Data dummy transaksi
  const billingHistory = [
    { id: 'INV-2026-001', date: '09 Mei 2026', amount: '150.000', status: 'Berhasil', plan: 'Pro Plan' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Billing & Penagihan</h1>
            <p className="text-slate-600">Kelola metode pembayaran dan lihat riwayat transaksi Anda.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Status Paket */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Zap className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Pro Plan - Bulanan</h3>
                    <p className="text-sm text-slate-500">Berakhir pada 09 Juni 2026</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
                  Aktif
                </span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <CreditCard className="text-slate-400" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">Visa ending in 4242</p>
                  <p className="text-xs text-slate-500">Metode pembayaran utama</p>
                </div>
                <button className="text-sm font-bold text-red-600 hover:text-red-700">Ubah</button>
              </div>
            </div>

            {/* Ringkasan */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Total Pengeluaran</h3>
              <div className="text-4xl font-black mb-6">Rp 150.000</div>
              <button 
                onClick={() => navigate('/pricing')}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all"
              >
                Upgrade Paket
              </button>
            </div>
          </div>

          {/* Riwayat Transaksi */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Riwayat Transaksi</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-8 py-4">ID Invoice</th>
                    <th className="px-8 py-4">Tanggal</th>
                    <th className="px-8 py-4">Paket</th>
                    <th className="px-8 py-4">Jumlah</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-bold text-slate-900">{item.id}</td>
                      <td className="px-8 py-4 text-slate-600">{item.date}</td>
                      <td className="px-8 py-4 text-slate-600">{item.plan}</td>
                      <td className="px-8 py-4 font-bold text-slate-900 font-mono">Rp {item.amount}</td>
                      <td className="px-8 py-4">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <ShieldCheck size={14} />
            <span>Semua transaksi dienkripsi dan diproses secara aman oleh Midtrans</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Billing;