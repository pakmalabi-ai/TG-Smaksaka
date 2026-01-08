import React from 'react';
import { Hourglass, Lock, Construction } from 'lucide-react';

interface ComingSoonProps {
  pageNumber: number;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ pageNumber }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-brand-100/50 mx-auto border border-slate-50">
          <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center animate-pulse">
             <Construction size={32} className="text-brand-500" />
          </div>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
           <Lock size={12} />
           <span>Halaman {pageNumber}</span>
        </div>

        <h2 className="text-4xl font-display font-bold text-slate-900 mb-3">
          Segera Hadir
        </h2>
        
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed text-lg mb-8">
          Materi pembelajaran sedang disiapkan dengan cermat oleh <span className="text-slate-800 font-medium">Ibu Risca Damayanti, M.Pd.</span>
        </p>

        <button className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-brand-600 transition-colors">
           Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;