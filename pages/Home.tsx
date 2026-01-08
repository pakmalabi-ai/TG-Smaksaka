import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Printer, CheckCircle2, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Modern Gradient Blobs - Positioned for the new layout */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Decorative elements behind image */}
              <div className="absolute top-4 right-4 w-full h-full bg-gradient-to-br from-brand-200 to-accent-200 rounded-[2rem] transform rotate-3"></div>
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-brand-100 rounded-[2rem] transform -rotate-2"></div>
              
              {/* Main Image Container */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-200/50 border-4 border-white aspect-[3/4]">
                <img 
                  src="https://lh3.googleusercontent.com/pw/AP1GczNJ1ICgm27bF_sjUya4Hh93rRW7_5T132NZogVou_iWtKmNHF2kHmo8T-fdW_7Dvjrb_A77Qt_XI7BnbRvL2XZM7PoyFBpQINrziyRefuuc9mjstwC47NTmX3TL9vCyRe4CB0jkCdPQLWp5S7U4VEOK=w462-h633-s-no-gm?authuser=0"
                  alt="Risca Damayanti, M.Pd."
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Name Card */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent p-6 pt-12 text-white">
                  <h3 className="text-xl font-display font-bold leading-tight">Risca Damayanti, M.Pd.</h3>
                  <p className="text-sm text-brand-200 font-medium">Guru Produktif Teknik Grafika</p>
                </div>
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg shadow-slate-200 animate-bounce delay-1000 duration-[3000ms]">
                <div className="flex items-center gap-2">
                  <div className="bg-brand-100 p-2 rounded-full text-brand-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">SMAKSAKA</p>
                    <p className="text-sm font-bold text-slate-800">Be Future Leader</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-100 text-brand-600 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm ring-1 ring-brand-50">
              <Sparkles size={12} className="text-accent-500" />
              <span>Selamat Datang</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Menuju Profesionalisme <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600">Industri Grafika</span> <br/>
              Masa Depan
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-light lg:pr-12">
              Portal Pembelajaran Konsentrasi Keahlian Teknik Grafika <span className="font-semibold text-slate-800">SMK Negeri 1 Kaligondang</span>.
              Fokus pada penguasaan teknis tingkat lanjut dan standar operasional prosedur industri.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
               <Link to="/desain-siap-cetak" className="group px-8 py-4 rounded-full bg-slate-900 text-white font-medium shadow-lg shadow-slate-200 flex items-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
                  <span>Mulai Belajar</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white/60 backdrop-blur-md border-t border-slate-100 p-8 md:p-16">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
               <div className="order-2 md:order-1">
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">Tentang Portal Ini</h3>
                  <div className="w-12 h-1 bg-accent-500 rounded-full mb-6"></div>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Website ini dirancang khusus untuk siswa-siswi <span className="text-brand-600 font-semibold">Fase F (Kelas XI dan XII)</span> sebagai sarana pendalaman materi produktif, mulai dari persiapan cetak (pre-press), proses produksi, hingga penyelesaian grafika (post-press).
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Mari manfaatkan media ini untuk menajamkan kompetensi dan membangun etos kerja yang disiplin.
                  </p>
               </div>
               <div className="order-1 md:order-2 bg-gradient-to-br from-brand-50 to-accent-50 p-8 rounded-2xl border border-brand-100/50 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="font-display font-bold text-xl text-slate-800 mb-2 relative z-10">Motto Kami</h4>
                  <p className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 italic relative z-10">
                    "Siap Kerja, Santun, Mandiri, Kreatif!"
                  </p>
               </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Printer size={24} />,
                  title: "Pre-Press & Produksi",
                  desc: "Alur kerja persiapan cetak hingga eksekusi mesin standar industri."
                },
                {
                  icon: <CheckCircle2 size={24} />,
                  title: "Standar SOP",
                  desc: "Prosedur operasional standar K3 di bengkel grafika."
                },
                {
                  icon: <Sparkles size={24} />,
                  title: "Kompetensi Lanjut",
                  desc: "Pengembangan soft skill dan hard skill siswa mandiri."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;