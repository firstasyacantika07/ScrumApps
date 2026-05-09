import React, { useState } from 'react';
import Layout from '../components/shared/Layout';
import { ChevronDown, ChevronRight } from 'lucide-react';
import '../index.css';

const Info = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const infoItems = [
    {
      title: "Kegunaan Utama Sistem ScrumApps",
      content: "ScrumApps dirancang untuk mempermudah pengelolaan proyek secara kolaboratif menggunakan kerangka kerja Scrum. Pengguna dapat membuat, memantau, dan mengelola tugas dalam proyek sesuai dengan role dan hak akses yang dimiliki."
    },
    {
      title: "Pengguna Sistem",
      content: "Dalam sistem terdapat beberapa pengguna:\n\n- Business Analyst (memberikan requirement dari client)\n- Tim Developer (Backend, Frontend, UI/UX Designer, Software Tester)"
    },
    {
      title: "Hak Akses Pengguna",
      content: "Setiap pengguna memiliki hak akses berbeda:\n\n- Business Analyst: mengelola Vision Board & Backlog\n- Tim Developer: mengerjakan task sesuai sprint"
    },
    {
      title: "Manajemen Vision Board dan Backlog",
      content: "- Vision Board digunakan untuk mendeskripsikan sistem secara terperinci\n- Backlog digunakan untuk mencatat tugas dan prioritas pengembangan"
    },
    {
      title: "Struktur Proyek dan Sprint",
      content: "Proyek terdiri dari beberapa sprint. Setiap sprint berisi task/backlog yang harus diselesaikan dalam periode tertentu untuk membantu pengelolaan waktu dan progres."
    },
    {
      title: "Notifikasi dan Aktivasi Pengguna",
      content: "Sistem memberikan notifikasi untuk perubahan status proyek seperti Done atau Late. Riwayat aktivitas juga dapat dilihat oleh anggota proyek."
    },
    {
      title: "Kontak yang Dapat Dihubungi",
      content: "Jika mengalami kendala, silakan hubungi ",
      link: {
        label: "support@scrumapps.id",
        url: "mailto:support@scrumapps.id"
      }
    },
    {
      title: "Panduan Penggunaan Sistem",
      content: "Pengguna baru dapat mengakses dokumentasi lengkap atau mengikuti tutorial penggunaan sistem yang tersedia.",
      link: {
        label: "Download Panduan",
        url: "/guide/scrumapps-guide.pdf"
      }
    }
  ];

  return (
    <Layout title="Informasi Sistem">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Informasi Sistem ScrumApps
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            Halaman ini berisi informasi umum terkait sistem, kebijakan, dan panduan penggunaan aplikasi.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y">

          {infoItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="transition">

                {/* HEADER */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full flex items-center justify-between px-6 py-4 transition 
                  ${isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">

                    {/* ICON */}
                    <div className={`p-2 rounded-lg transition 
                      ${isOpen ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>

                    {/* TITLE */}
                    <span className={`text-sm font-semibold transition 
                      ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.title}
                    </span>

                  </div>
                </button>

                {/* CONTENT */}
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out
                  ${isOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  {item.link && (
                    <a
                      href={item.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
                    >
                      {item.link.label}
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Info;