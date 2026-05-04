import React, { useState } from 'react';
import Layout from '../components/shared/Layout';
import { ChevronDown, ChevronRight, Info as InfoIcon } from 'lucide-react';

const Info = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const infoItems = [
    { 
      title: "Kegunaan Utama Sistem ScrumApps", 
      content: "ScrumApps dirancang untuk mempermudah pengelolaan proyek secara kolaboratif menggunakan kerangka kerja Scrum..." 
    },
    { 
      title: "Panduan Penggunaan", 
      content: "Anda dapat mengunduh panduan lengkap penggunaan sistem melalui tautan di bawah ini.",
      link: "Download PDF Guide"
    }
  ];

  return (
    <Layout title="Informasi Sistem">
      <div className="max-w-4xl space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${openIndex === index ? 'bg-scrum-red text-white' : 'bg-rose-50 text-scrum-red'}`}>
                  <InfoIcon size={20} />
                </div>
                <span className="font-bold text-slate-700">{item.title}</span>
              </div>
              {openIndex === index ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
            </button>
            
            {openIndex === index && (
              <div className="px-16 pb-6 text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                {item.content}
                {item.link && (
                  <a href="#" className="block mt-4 text-scrum-red font-bold hover:underline italic">
                    {item.link}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Info;