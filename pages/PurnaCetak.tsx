import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { 
  Scissors, 
  Sparkles, 
  BookOpen, 
  GitCommit, 
  Gamepad2, 
  Eye, 
  Paintbrush, 
  FoldHorizontal, 
  Book, 
  AlertTriangle,
  Settings,
  ShieldCheck,
  Check,
  Keyboard
} from 'lucide-react';

const PurnaCetak: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cutting' | 'finishing' | 'folding' | 'binding'>('dashboard');
  
  // --- CUTTING SIMULATOR STATE ---
  const [cutSize, setCutSize] = useState(210);
  const [sensorActive, setSensorActive] = useState(true);
  const [isCutting, setIsCutting] = useState(false);
  const [cutFeedback, setCutFeedback] = useState(false);
  const [alertModal, setAlertModal] = useState<{show: boolean, title: string, msg: string}>({show: false, title: '', msg: ''});

  // --- FINISHING STATE ---
  const [finishEffect, setFinishEffect] = useState<'normal' | 'glossy' | 'doff' | 'spotuv'>('normal');

  // --- FOLDING STATE ---
  const [foldType, setFoldType] = useState<'flat' | 'gate' | 'single'>('flat');

  // --- BINDING STATE ---
  const [bindThickness, setBindThickness] = useState('thin');
  const [bindUsage, setBindUsage] = useState('promo');
  const [bindResult, setBindResult] = useState<{title: string, desc: string} | null>(null);

  // --- CHART REF ---
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Initialize Chart when switching to Finishing tab
  useEffect(() => {
    if (activeTab === 'finishing' && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Terpotong Pisau', 'Tersengat Panas', 'Terjepit Mesin', 'Lantai Licin'],
          datasets: [{
            data: [45, 25, 15, 15],
            backgroundColor: ['#ef4444', '#f97316', '#eab308', '#94a3b8'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
          },
          cutout: '70%'
        }
      });
    }
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [activeTab]);

  // --- HANDLERS ---

  const handleCut = () => {
    if (isCutting) return;
    
    if (sensorActive) {
      setAlertModal({
        show: true,
        title: "KESELAMATAN K3",
        msg: "Mesin mendeteksi posisi tangan operator di area bahaya. Sensor K3 aktif. Gunakan tuas pengaman ganda atau pastikan area aman."
      });
      return;
    }

    setIsCutting(true);
    setTimeout(() => {
      setCutFeedback(true);
    }, 500);

    setTimeout(() => {
      setIsCutting(false);
      setTimeout(() => setCutFeedback(false), 2000);
    }, 1000);
  };

  const checkBinding = () => {
    let result = { title: '', desc: '' };
    
    if (bindThickness === 'thin' && bindUsage === 'promo') {
      result.title = "Saddle Stitch";
      result.desc = "Teknik jilid jahit kawat (staples tengah). Paling murah dan cepat untuk brosur atau majalah tipis.";
    } else if (bindThickness === 'thick' && bindUsage === 'premium') {
      result.title = "Perfect Binding";
      result.desc = "Penjilidan dengan lem panas. Punggung buku berbentuk kotak rapi, standar untuk novel dan buku sekolah.";
    } else if (bindUsage === 'report') {
      result.title = "Spiral / Wire-O";
      result.desc = "Menggunakan kawat spiral. Kelebihannya buku bisa dibuka rata 360 derajat. Cocok untuk agenda.";
    } else if (bindThickness === 'thick' && bindUsage === 'promo') {
      result.title = "Perfect Binding (Eco)";
      result.desc = "Walaupun untuk promo, buku tebal tetap butuh lem panas agar tidak mudah lepas.";
    } else {
      result.title = "Hardcover";
      result.desc = "Teknik paling mewah menggunakan papan (board) tebal. Untuk skripsi, buku tahunan, atau kitab suci.";
    }
    setBindResult(result);
  };

  // --- KEYBOARD LISTENER FOR CUTTING ---
  useEffect(() => {
    if (activeTab !== 'cutting') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for control keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setCutSize(prev => Math.min(prev + 1, 400));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setCutSize(prev => Math.max(prev - 1, 100));
      } else if (e.key === ' ') {
        handleCut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleCut]);

  // --- TABS DATA ---
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: Settings },
    { id: 'cutting', label: 'Guillotine Simulator', icon: Scissors },
    { id: 'folding', label: 'Folding Simulator', icon: FoldHorizontal },
    { id: 'binding', label: 'Binding Selector', icon: Book },
    { id: 'finishing', label: 'Surface Finish', icon: Paintbrush }
  ];

  return (
    <div className="relative">
      <style>{`
        .blade-active { animation: cut-action 1s ease-in-out forwards; }
        @keyframes cut-action {
            0% { top: 0; }
            50% { top: 80%; border-bottom-width: 4px; }
            100% { top: 0; }
        }
        .surface-glossy {
            background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.6) 100%), #7c3aed;
            background-size: 200% 200%;
            animation: shine 3s infinite;
        }
        @keyframes shine { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }
        .surface-doff { background-color: #7c3aed; filter: contrast(0.8) brightness(0.9); }
        .surface-spotuv { background-color: #111827; position: relative; }
        .surface-spotuv::after {
            content: "UV";
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            color: rgba(255,255,255,0.05); font-size: 4rem; font-weight: 800;
        }
        .surface-spotuv:hover::after { color: #fff; text-shadow: 0 0 15px #fff; transition: 0.5s; }
        
        .perspective-1000 { perspective: 1000px; }
        .fold-panel { transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .gate-folded-left { transform: rotateY(160deg); transform-origin: left; }
        .gate-folded-right { transform: rotateY(-160deg); transform-origin: right; }
      `}</style>

      {/* Hero Header */}
      <div className="pt-12 pb-8 px-6 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-100">
           <BookOpen size={12} />
           <span>Modul Ajar Fase F</span>
         </div>
         <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4">
           Studio Purna Cetak
         </h1>
         <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
           Simulasi virtual proses finishing, cutting, dan binding untuk menyempurnakan produk grafika.
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* --- CONTENT: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-12">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                 <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Pengantar Teknik Purna Cetak</h2>
                 <p className="text-slate-600 leading-relaxed mb-8">
                   <strong>Purna Cetak (Post-Press)</strong> adalah tahap krusial dalam produksi grafika yang mengubah lembaran cetak mentah menjadi produk akhir yang fungsional dan estetis. Tanpa finishing, sebuah cetakan hanyalah kertas bertinta. Modul ini dirancang untuk mensimulasikan proses-proses vital tersebut.
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-brand-50 border border-brand-100">
                        <div className="w-10 h-10 bg-brand-200 text-brand-700 rounded-lg flex items-center justify-center mb-4"><Scissors size={20} /></div>
                        <h3 className="font-bold text-lg mb-2 text-slate-800">1. Pemotongan</h3>
                        <p className="text-sm text-slate-600">Teknik memisahkan area cetak (sisir) dan membentuk produk menggunakan mesin potong (Guillotine).</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-accent-50 border border-accent-100">
                        <div className="w-10 h-10 bg-accent-200 text-accent-700 rounded-lg flex items-center justify-center mb-4"><Sparkles size={20} /></div>
                        <h3 className="font-bold text-lg mb-2 text-slate-800">2. Peningkatan Permukaan</h3>
                        <p className="text-sm text-slate-600">Memberikan nilai tambah estetika dan proteksi melalui laminasi (Doff/Glossy) atau Spot UV.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                        <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center mb-4"><BookOpen size={20} /></div>
                        <h3 className="font-bold text-lg mb-2 text-slate-800">3. Penjilidan</h3>
                        <p className="text-sm text-slate-600">Menyatukan lembaran-lembaran terpisah menjadi satu kesatuan buku menggunakan kawat atau lem.</p>
                    </div>
                 </div>
              </div>

              {/* Workflow */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                    <h3 className="text-xl font-bold mb-8 text-slate-900 flex items-center gap-2"><GitCommit size={20} /> Alur Produksi Grafika</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 relative px-4">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-300 -z-10 transform -translate-y-1/2"></div>
                        
                        <div className="bg-white border-2 border-slate-300 p-4 rounded-xl w-40 text-center z-10 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tahap 1</div>
                            <div className="font-bold text-slate-800">Pre-Press</div>
                        </div>
                        
                        <div className="bg-white border-2 border-slate-300 p-4 rounded-xl w-40 text-center z-10 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tahap 2</div>
                            <div className="font-bold text-slate-800">Press</div>
                        </div>

                        <div className="bg-brand-600 border-2 border-brand-700 p-4 rounded-xl w-48 text-center shadow-lg shadow-brand-200 z-10 transform md:scale-110 relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Fokus Kita</div>
                            <div className="text-[10px] font-bold text-brand-200 uppercase mb-1">Tahap 3</div>
                            <div className="font-bold text-white text-lg">Post-Press</div>
                        </div>

                        <div className="bg-white border-2 border-slate-300 p-4 rounded-xl w-40 text-center z-10 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tahap 4</div>
                            <div className="font-bold text-slate-800">Distribusi</div>
                        </div>
                    </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2"><Gamepad2 size={20} /> Mulai Simulasi Praktik</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div onClick={() => setActiveTab('cutting')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group flex items-start justify-between">
                        <div>
                           <h4 className="font-bold text-slate-800 group-hover:text-brand-600 transition">Simulasi Pemotongan</h4>
                           <p className="text-sm text-slate-500 mt-1">Operasikan mesin Guillotine dengan standar K3.</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-brand-500 group-hover:text-white transition"><Scissors size={18} /></div>
                    </div>
                    <div onClick={() => setActiveTab('finishing')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group flex items-start justify-between">
                        <div>
                           <h4 className="font-bold text-slate-800 group-hover:text-brand-600 transition">Lab Finishing</h4>
                           <p className="text-sm text-slate-500 mt-1">Eksperimen Laminasi & Spot UV.</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-brand-500 group-hover:text-white transition"><Paintbrush size={18} /></div>
                    </div>
                </div>
              </div>
          </div>
        )}

        {/* --- CONTENT: CUTTING --- */}
        {activeTab === 'cutting' && (
           <div className="animate-fade-in">
              <div className="mb-8 flex items-end justify-between">
                 <div>
                   <h2 className="text-3xl font-bold text-slate-900">Stasiun Potong: Guillotine</h2>
                   <div className="flex items-center gap-2 mt-2 text-slate-600">
                     <Keyboard size={16} />
                     <p>Instruksi: Atur ukuran potong (Panah), pastikan sensor aman, lalu tekan <strong>SPASI</strong> untuk memotong.</p>
                   </div>
                 </div>
                 <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <ShieldCheck size={16} className={sensorActive ? 'text-green-500' : 'text-slate-400'} />
                    Status K3: {sensorActive ? 'Terpantau Aman' : 'Peringatan'}
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Controls */}
                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between h-full min-h-[400px]">
                      <div>
                          <div className="mb-8">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ukuran Potong (mm)</label>
                              <div className="text-5xl font-mono text-brand-400 mt-2 font-bold">{cutSize.toFixed(1)}</div>
                              <input 
                                type="range" 
                                min="100" 
                                max="400" 
                                value={cutSize} 
                                onChange={(e) => setCutSize(parseInt(e.target.value))}
                                className="w-full mt-6 accent-brand-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                              />
                              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                                <span>100mm</span>
                                <span>400mm</span>
                              </div>
                          </div>

                          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 mb-6">
                              <h4 className="text-xs font-bold mb-3 flex items-center gap-2 text-slate-300"><Eye size={14} /> STATUS SENSOR K3</h4>
                              <div className="flex items-center gap-4">
                                  <button 
                                    onClick={() => setSensorActive(!sensorActive)} 
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${sensorActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                                  >
                                    {sensorActive ? "Sensor Aktif" : "Sensor Mati"}
                                  </button>
                                  <div className={`w-8 h-8 rounded-full shadow-lg transition-all ${sensorActive ? 'bg-green-500 shadow-green-500/50' : 'bg-red-800'}`}></div>
                              </div>
                          </div>
                      </div>

                      <button 
                        onClick={handleCut}
                        className="w-full py-6 bg-red-600 hover:bg-red-500 rounded-2xl font-black text-xl uppercase tracking-tighter shadow-lg shadow-red-900/50 transition-transform active:scale-95 flex flex-col items-center justify-center"
                      >
                         <span>TEKAN UNTUK POTONG</span>
                         <span className="text-[10px] opacity-70 mt-1 font-normal normal-case">(atau Spasi)</span>
                      </button>
                  </div>

                  {/* Visual Machine */}
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center">
                      {/* Sensor Line */}
                      {sensorActive && (
                         <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500/20 border-t border-dashed border-red-500 z-10 animate-pulse"></div>
                      )}

                      {/* Machine Body */}
                      <div className="w-64 h-80 bg-slate-200 border-x-8 border-slate-400 relative flex flex-col justify-end items-center rounded-b-lg">
                          {/* Blade */}
                          <div 
                            className={`absolute top-0 w-full h-4 bg-slate-600 border-b-4 border-slate-400 z-20 transition-all ${isCutting ? 'blade-active' : ''}`}
                          ></div>

                          {/* Paper Stack */}
                          <div 
                            className="w-48 bg-white border border-slate-300 shadow-sm transition-all duration-300 relative z-0"
                            style={{ 
                              height: '120px',
                              width: `${(cutSize / 400) * 100}%`,
                              borderTop: cutFeedback ? '2px solid #ef4444' : '1px solid #cbd5e1'
                            }}
                          >
                             <div className="w-full h-full flex flex-col justify-center items-center text-[10px] text-slate-400 font-bold uppercase">
                                <span>Kertas Tumpukan</span>
                                <span>Size: {cutSize}mm</span>
                             </div>
                          </div>
                      </div>

                      {/* Feedback */}
                      <div className={`absolute bottom-8 left-0 right-0 text-center transition-opacity duration-300 ${cutFeedback ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                             HASIL POTONG: RAPI & SIKU 90°
                          </span>
                      </div>
                  </div>
              </div>
           </div>
        )}

        {/* --- CONTENT: FINISHING --- */}
        {activeTab === 'finishing' && (
            <div className="animate-fade-in">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Visualizer Estetika</h2>
                    <p className="text-slate-600 mt-2">Pilih efek laminasi untuk melihat perbedaannya pada permukaan cetak.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <div 
                           className={`w-full aspect-[3/4] rounded-xl mb-8 shadow-inner border border-slate-100 flex items-center justify-center transition-all duration-500 relative overflow-hidden
                           ${finishEffect === 'glossy' ? 'surface-glossy' : ''}
                           ${finishEffect === 'doff' ? 'surface-doff' : ''}
                           ${finishEffect === 'spotuv' ? 'surface-spotuv' : 'bg-brand-500'}
                           `}
                        >
                            <div className={`text-white font-black text-4xl rotate-12 select-none ${finishEffect === 'spotuv' ? 'opacity-10' : 'opacity-30'}`}>POSTER</div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center w-full">
                            {['glossy', 'doff', 'spotuv'].map((effect) => (
                                <button 
                                  key={effect}
                                  onClick={() => setFinishEffect(effect as any)}
                                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors uppercase flex-1
                                  ${finishEffect === effect ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                                  `}
                                >
                                  {effect}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                         <div className="bg-brand-50 p-8 rounded-3xl border border-brand-100">
                             <h3 className="text-brand-900 font-bold text-xl mb-3 capitalize">
                                {finishEffect === 'normal' ? 'Pilih Efek' : `Laminasi ${finishEffect}`}
                             </h3>
                             <p className="text-brand-800 text-sm leading-relaxed">
                                {finishEffect === 'glossy' && "Lapisan plastik bening mengkilap. Melindungi dari air dan kotoran. Warna tampak sangat kontras (vivid)."}
                                {finishEffect === 'doff' && "Lapisan halus tidak memantulkan cahaya (Matte). Memberikan kesan elegan, premium, dan enak disentuh."}
                                {finishEffect === 'spotuv' && "Teknik cairan kimia yang dikeringkan sinar UV hanya pada area tertentu saja. Sering digunakan di atas laminasi Doff untuk highlight logo."}
                                {finishEffect === 'normal' && "Silakan pilih tombol di samping untuk melihat simulasi efek visual pada hasil cetak."}
                             </p>
                         </div>

                         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-sm mb-6 uppercase text-slate-500 tracking-wider">Risiko Kerja di Unit Finishing</h3>
                            <div className="h-48 w-full">
                                <canvas ref={chartRef}></canvas>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- CONTENT: FOLDING --- */}
        {activeTab === 'folding' && (
            <div className="animate-fade-in">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Simulator Lipatan (Folding)</h2>
                    <p className="text-slate-600 mt-2">Visualisasi lipatan kertas A4 menjadi berbagai bentuk brosur.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
                    {/* Visual Paper */}
                    <div className="flex-1 flex justify-center perspective-1000 py-10 w-full max-w-md">
                        <div 
                          className="relative w-full aspect-[4/3] bg-slate-200 border border-slate-300 flex shadow-2xl transition-transform duration-700"
                          style={{
                              transform: foldType === 'single' ? 'rotateY(20deg) rotateX(10deg)' : 'rotateX(0)'
                          }}
                        >
                            {/* Left Panel */}
                            <div 
                              className={`fold-panel w-1/3 h-full bg-slate-200 border-r border-dashed border-slate-400 z-30 flex items-center justify-center ${foldType === 'gate' ? 'gate-folded-left' : ''}`}
                            >
                                <span className="text-xs text-slate-400 font-bold uppercase">Panel A</span>
                            </div>
                            
                            {/* Center Panel */}
                            <div className="w-1/3 h-full bg-slate-200 flex items-center justify-center z-10 relative">
                                <span className="text-xs text-slate-400 font-bold uppercase">Panel B</span>
                            </div>

                            {/* Right Panel */}
                            <div 
                              className={`fold-panel w-1/3 h-full bg-slate-200 border-l border-dashed border-slate-400 z-30 flex items-center justify-center 
                              ${foldType === 'gate' ? 'gate-folded-right' : ''}
                              ${foldType === 'single' ? 'gate-folded-right' : ''}
                              `}
                            >
                                <span className="text-xs text-slate-400 font-bold uppercase">Panel C</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full md:w-72 space-y-4">
                        <button 
                          onClick={() => setFoldType('gate')}
                          className={`w-full p-4 border rounded-xl text-left transition-all group ${foldType === 'gate' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300'}`}
                        >
                            <span className={`block font-bold ${foldType === 'gate' ? 'text-brand-700' : 'text-slate-700'}`}>Gate Fold</span>
                            <span className="text-xs text-slate-400 uppercase">Lipat Gerbang</span>
                        </button>

                        <button 
                          onClick={() => setFoldType('single')}
                          className={`w-full p-4 border rounded-xl text-left transition-all group ${foldType === 'single' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300'}`}
                        >
                            <span className={`block font-bold ${foldType === 'single' ? 'text-brand-700' : 'text-slate-700'}`}>Single Fold</span>
                            <span className="text-xs text-slate-400 uppercase">Lipat Tunggal</span>
                        </button>

                        <button 
                          onClick={() => setFoldType('flat')}
                          className="w-full p-4 bg-slate-100 rounded-xl text-center font-bold text-xs uppercase text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                           Reset Kertas
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- CONTENT: BINDING --- */}
        {activeTab === 'binding' && (
             <div className="animate-fade-in">
                 <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Pemilih Teknik Jilid</h2>
                    <p className="text-slate-600 mt-2">Masukkan kriteria buku untuk mendapatkan rekomendasi penjilidan terbaik.</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Ketebalan Kertas</label>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="radio" name="thick" value="thin" checked={bindThickness === 'thin'} onChange={() => setBindThickness('thin')} className="accent-brand-600 w-5 h-5" />
                                    <span className="text-sm font-medium text-slate-700">Tipis (&lt; 60 Halaman)</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="radio" name="thick" value="thick" checked={bindThickness === 'thick'} onChange={() => setBindThickness('thick')} className="accent-brand-600 w-5 h-5" />
                                    <span className="text-sm font-medium text-slate-700">Tebal (&gt; 60 Halaman)</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Tujuan Penggunaan</label>
                            <select 
                               value={bindUsage}
                               onChange={(e) => setBindUsage(e.target.value)}
                               className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-700"
                            >
                                <option value="promo">Promosi (Ekonomis)</option>
                                <option value="premium">Eksklusif (Buku/Novel)</option>
                                <option value="report">Laporan/Agenda</option>
                            </select>
                        </div>
                    </div>
                    
                    <button 
                      onClick={checkBinding}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-slate-200 mb-8"
                    >
                       TENTUKAN TEKNIK
                    </button>

                    {bindResult && (
                        <div className="border-t border-slate-100 pt-8 animate-fade-in">
                            <div className="flex items-start gap-6 bg-brand-50 p-6 rounded-2xl border border-brand-100">
                                <div className="w-16 h-16 bg-white text-brand-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                   <Check size={32} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{bindResult.title}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">{bindResult.desc}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
             </div>
        )}

      </div>

      {/* Alert Modal */}
      {alertModal.show && (
        <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-blob">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{alertModal.title}</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{alertModal.msg}</p>
                <button 
                  onClick={() => setAlertModal({...alertModal, show: false})} 
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                >
                   MENGERTI
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default PurnaCetak;