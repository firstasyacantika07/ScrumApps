import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Briefcase, CheckCircle2,
  Package, RefreshCcw, Clock
} from 'lucide-react';
import {
  PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';

import api from '../api/axios';
import Layout from '../components/shared/Layout';

const StatCard = ({ label, value, icon, borderColor, iconBg, iconColor }) => (
  <div
    className="bg-white p-5 rounded-xl border flex justify-between items-center hover:scale-105 transition"
    style={{ borderColor }}
  >
    <div>
      <div className="text-3xl font-extrabold text-slate-800">
        {value}
      </div>
      <div
        className="text-[11px] font-bold uppercase"
        style={{ color: iconColor }}
      >
        {label}
      </div>
    </div>
    <div
      className="p-2.5 rounded-lg"
      style={{ background: iconBg, color: iconColor }}
    >
      {icon}
    </div>
  </div>
);

const Dashboard = () => {

  const [stats, setStats] = useState({
    total: 0,
    hold: 0,
    onProgress: 0,
    done: 0,
    archive: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await api.get('/projects/stats');

        const data = res.data;

        setStats({
          total: data.total || 0,
          hold: data.hold || 0,
          onProgress: data.onProgress || 0,
          done: data.done || 0,
          archive: data.archive || 0,
        });

      } catch (err) {
        console.error("STATS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

const pieData = [
  { name: 'Hold', value: stats.hold, color: '#f59e0b' },
  { name: 'On Progress', value: stats.onProgress, color: '#3b82f6' },
  { name: 'Done', value: stats.done, color: '#10b981' },
  { name: 'Archive', value: stats.archive, color: '#6366f1' },
];

  return (
    <Layout title="Dashboard">

      <div className="flex flex-col gap-6">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          <StatCard
            label="Total Proyek"
            value={stats.total}
            icon={<Briefcase size={20} />}
            borderColor="#e2e8f0"
            iconBg="#f8fafc"
            iconColor="#64748b"
          />

          <StatCard
            label="Hold"
            value={stats.hold}
            icon={<Clock size={20} />}
            borderColor="#fef3c7"
            iconBg="#fffbeb"
            iconColor="#f59e0b"
          />

          <StatCard
            label="On Progress"
            value={stats.onProgress}
            icon={<RefreshCcw size={20} />}
            borderColor="#dbeafe"
            iconBg="#eff6ff"
            iconColor="#3b82f6"
          />

          <StatCard
            label="Done"
            value={stats.done}
            icon={<CheckCircle2 size={20} />}
            borderColor="#d1fae5"
            iconBg="#ecfdf5"
            iconColor="#10b981"
          />

          <StatCard
            label="Archive"
            value={stats.archive}
            icon={<Package size={20} />}
            borderColor="#e0e7ff"
            iconBg="#eef2ff"
            iconColor="#6366f1"
          />

        </div>

        {/* CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">

            <h3 className="text-sm font-bold mb-6">
              STATISTIK PROYEK
            </h3>

            <div className="h-[300px]">

              {loading ? (
                <div className="flex justify-center items-center h-full text-gray-400">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />

                  </PieChart>
                </ResponsiveContainer>
              )}

            </div>

          </div>

          {/* INFO BOX */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">

            <div className="bg-gradient-to-r from-red-500 to-red-700 p-5 rounded-xl text-white">

              <p className="text-xs opacity-80">
                Butuh bantuan?
              </p>

              <h4 className="font-bold">
                Panduan Sistem
              </h4>

              <button className="mt-3 bg-white text-red-600 px-4 py-2 rounded-lg text-xs font-bold">
                Buka
              </button>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
};

export default Dashboard;