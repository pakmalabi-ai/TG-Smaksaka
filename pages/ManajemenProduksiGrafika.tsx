import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { 
  Briefcase, 
  Settings, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Clock, 
  Users,
  MoveRight,
  Printer,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  statusText: string;
  urgent?: boolean;
}

const ManajemenProduksiGrafika: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'qc-lab' | 'finance'>('dashboard');

  // --- SIMULATOR STATE ---
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
    pre: [{ id: 'job-1', title: 'Agenda Sekolah', statusText: 'Menunggu Desain', urgent: true }],
    print: [],
    finish: [],
    done: []
  });
  const [efficiencyScore, setEfficiencyScore] = useState(100);

  // --- QC LAB STATE ---
  const [foundQCErrors, setFoundQCErrors] = useState<number[]>([]);

  // --- FINANCE STATE ---
  const [finance, setFinance] = useState({
    bahan: 800000,
    ops: 300000,
    jual: 1500000
  });

  // --- CHART REFS ---
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // --- EFFECTS ---
  useEffect(() => {
    // Update Chart when in Finance tab or when data changes
    if (activeTab === 'finance' && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const modal = finance.bahan + finance.ops;
      const profit = finance.jual - modal;

      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Bahan', 'Operasional', 'Penjualan', 'Laba'],
          datasets: [{
            label: 'Nominal (Rp)',
            data: [finance.bahan, finance.ops, finance.jual, Math.max(0, profit)],
            backgroundColor: ['#f97316', '#0ea5e9', '#0f172a', '#22c55e'],
            borderRadius: 8,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { 
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
              ticks: { callback: (val) => typeof val === 'number' ? (val / 1000) + 'k' : val }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [activeTab, finance]);

  // --- SIMULATOR LOGIC ---
  const handleDragStart = (e: React.DragEvent, taskId: string, sourceCol: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceCol', sourceCol);
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceCol = e.dataTransfer.getData('sourceCol');

    if (sourceCol === targetCol) return;

    // Move task
    const task = tasks[sourceCol].find(t => t.id === taskId);
    if (!task) return;

    const newSourceList = tasks[sourceCol].filter(t => t.id !== taskId);
    
    // Update status text based on column
    let newStatus = '';
    if (targetCol === 'pre') newStatus = 'Menunggu Desain';
    else if (targetCol === 'print') newStatus = 'Sedang Dicetak...';
    else if (targetCol === 'finish') newStatus = 'Tahap Finishing/Jilid';
    else if (targetCol === 'done') newStatus = 'Selesai - Siap QC';

    const newTask = { ...task, statusText: newStatus };
    const newTargetList = [...tasks[targetCol], newTask];

    setTasks(prev => ({
      ...prev,
      [sourceCol]: newSourceList,
      [targetCol]: newTargetList
    }));

    // Recalculate Efficiency
    // Bottleneck logic: if print > 2 or finish > 1
    let score = 100;
    if (tasks['print'].length > 2) score -= 20; // This logic uses OLD state, but simple enough for demo
    // Use slightly delayed check or just rough logic for UI feedback
    const printCount = targetCol === 'print' ? newTargetList.length : (sourceCol === 'print' ? newSourceList.length : tasks.print.length);
    const finishCount = targetCol === 'finish' ? newTargetList.length : (sourceCol === 'finish' ? newSourceList.length : tasks.finish.length);
    
    if (printCount > 2) score -= 20;
    if (finishCount > 1) score -= 15;
    setEfficiencyScore(score);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // --- QC LOGIC ---
  const handleQCClick = (id: number) => {
    if (!foundQCErrors.includes(id)) {
      setFoundQCErrors([...foundQCErrors, id]);
      if (foundQCErrors.length + 1 === 3) {
        // All found
        setTimeout(() => alert("Luar Biasa! Semua kesalahan QC telah ditemukan. Produk siap dikirim ke klien."), 500);
      }
    }
  };

  // --- FORMATTER ---
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  // --- TABS CONFIG ---
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'simulator', label: 'Simulator Produksi', icon: Settings },
    { id: 'qc-lab', label: 'QC Lab', icon: Search },
    { id: 'finance', label: 'Keuangan', icon: TrendingUp },
  ];

  return (
    <div className="relative">
      <style>{`
        .urgent-pulse { animation: pulse-orange 2s infinite; }
        @keyframes pulse-orange {
            0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
            100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
      `}</style>

      {/* Hero Header */}
      <div className="pt-12 pb-8 px-6 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-100">
           <Zap size={12} />
           <span>Modul Ajar Fase F</span>
         </div>
         <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4">
           Grafika Manager Pro
         </h1>
         <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
           Kelola alur kerja produksi, kendalikan kualitas cetak, dan analisa keuntungan proyek grafika.
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        
        {/* Tabs */}
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

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-orange-500 font-bold text-xs uppercase mb-1 tracking-wider">Status Proyek</div>
                    <div className="text-3xl font-display font-bold text-slate-900">Capstone XII</div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> Aktif: Minggu ke-4
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-brand-500 font-bold text-xs uppercase mb-1 tracking-wider">Target Penjualan</div>
                    <div className="text-3xl font-display font-bold text-slate-900">Rp 2.500.000</div>
                    <div className="mt-4 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-500 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-accent-500 font-bold text-xs uppercase mb-1 tracking-wider">Kepuasan Pelanggan</div>
                    <div className="text-3xl font-display font-bold text-slate-900">92%</div>
                    <div className="mt-4 text-xs text-slate-400 font-medium">Berdasarkan ketepatan waktu & QC</div>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="flex-1 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
                      Jadilah Manajer Produksi <span className="text-brand-400">Terbaik</span>.
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-xl">
                      Kelola alur kerja, pastikan kualitas cetak sempurna, dan raih profit maksimal dalam simulasi interaktif ini.
                    </p>
                    <button 
                      onClick={() => setActiveTab('simulator')}
                      className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-brand-900/50 flex items-center gap-2"
                    >
                      <Settings size={20} /> Mulai Simulasi Sekarang
                    </button>
                </div>
                <div className="w-full md:w-1/3 bg-slate-800 p-6 rounded-2xl border border-slate-700 relative z-10">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={16} className="text-brand-400"/> Misi Hari Ini:</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3">
                           <div className="bg-green-500/20 text-green-400 p-1 rounded-full"><CheckCircle2 size={14} /></div>
                           <span className="text-slate-200 line-through decoration-slate-500 decoration-2">Buat SPK Kalender Meja</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <div className="bg-slate-700 text-slate-500 p-1 rounded-full"><div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500"></div></div>
                           <span className="text-slate-300">Selesaikan Cetak Digital</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <div className="bg-slate-700 text-slate-500 p-1 rounded-full"><div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500"></div></div>
                           <span className="text-slate-300">Periksa QC untuk 50 buku</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Core Material */}
            <div className="pt-8 border-t border-slate-200">
                <h3 className="text-xl font-display font-bold mb-8 text-slate-800 flex items-center gap-2">
                   <BookOpen className="text-brand-600" size={24} /> 
                   Materi Inti: Manajemen Produksi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Material 1 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Settings size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">Alur Kerja Produksi</h4>
                        </div>
                        <ul className="space-y-4 relative">
                            <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-slate-100"></div>
                            {[
                              { step: 1, title: 'Pre-Press', desc: 'Persiapan file, cek mode warna (CMYK), layout/imposisi, dan pembuatan pelat.' },
                              { step: 2, title: 'Press (Cetak)', desc: 'Eksekusi cetak. Fokus pada registrasi presisi dan konsistensi warna sesuai proofing.' },
                              { step: 3, title: 'Post-Press', desc: 'Pembentukan akhir: potong, lipat, jilid. Menentukan kerapian fisik produk akhir.' }
                            ].map((item) => (
                                <li key={item.step} className="flex gap-4 relative z-10">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shadow-sm">
                                      {item.step}
                                    </span>
                                    <div>
                                        <span className="font-bold text-slate-700 text-sm block mb-1">{item.title}</span>
                                        <span className="text-slate-500 text-xs leading-relaxed block">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Material 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">Manajemen Mutu & Biaya</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h5 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Quality Control (QC)</h5>
                                <p className="text-xs text-slate-500 leading-relaxed mb-2">QC harus dilakukan di setiap tahap:</p>
                                <div className="flex flex-wrap gap-2">
                                   <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-500">Resolusi Gambar</span>
                                   <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-500">Warna & Hicky</span>
                                   <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-500">Presisi Potong</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h5 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2"><TrendingUp size={14} className="text-brand-500"/> Costing Dasar</h5>
                                <div className="text-xs text-brand-700 font-mono bg-brand-50 p-2 rounded mb-2 border border-brand-100">
                                    HPP = Bahan + Ops + Depresiasi
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Pastikan <strong>Harga Jual &gt; HPP</strong> untuk profit, tapi tetap kompetitif.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* --- SIMULATOR TAB --- */}
        {activeTab === 'simulator' && (
           <div className="animate-fade-in space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
                      <div>
                          <h2 className="text-2xl font-display font-bold text-slate-900">Production Flow Simulator</h2>
                          <p className="text-slate-500 mt-1">Geser pesanan ke departemen selanjutnya untuk menyelesaikan produksi.</p>
                      </div>
                      <div className="text-left md:text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Efisiensi Workflow</span>
                          <div className={`text-2xl font-bold ${efficiencyScore < 80 ? 'text-red-500' : 'text-green-500'}`}>
                            {efficiencyScore}%
                          </div>
                      </div>
                  </div>

                  {/* Kanban Board */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {['pre', 'print', 'finish', 'done'].map((colKey, idx) => {
                          const colTitle = idx === 0 ? '1. Pra-Produksi' : idx === 1 ? '2. Cetak' : idx === 2 ? '3. Finishing' : '4. Selesai (QC)';
                          const items = tasks[colKey];
                          
                          return (
                             <div key={colKey} className="space-y-3">
                                 <div className="text-center font-bold text-slate-400 text-xs uppercase tracking-wider">{colTitle}</div>
                                 <div 
                                    className={`min-h-[300px] p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors ${items.length > 2 && colKey !== 'done' && colKey !== 'pre' ? 'bg-red-50 border-red-200' : ''}`}
                                    onDrop={(e) => handleDrop(e, colKey)}
                                    onDragOver={allowDrop}
                                 >
                                    {items.map((task) => (
                                        <div 
                                          key={task.id}
                                          draggable
                                          onDragStart={(e) => handleDragStart(e, task.id, colKey)}
                                          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-brand-200 transition-all mb-3 group"
                                        >
                                           <div className="flex justify-between items-start mb-2">
                                              {task.urgent && (
                                                <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">URGENT</span>
                                              )}
                                              <span className="text-slate-400 text-[10px] font-mono">#{task.id}</span>
                                           </div>
                                           <h4 className="font-bold text-sm text-slate-800 group-hover:text-brand-600 transition-colors">{task.title}</h4>
                                           <p className="text-[10px] text-slate-500 mt-1 font-medium">{task.statusText}</p>
                                        </div>
                                    ))}
                                    {items.length === 0 && (
                                        <div className="h-full flex items-center justify-center text-slate-300 text-xs italic">
                                           Kosong
                                        </div>
                                    )}
                                 </div>
                             </div>
                          )
                      })}
                  </div>

                  {/* Info Box */}
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                      <InfoIcon className="text-blue-500 shrink-0 mt-0.5" size={20} />
                      <div className="text-sm text-blue-800 leading-relaxed">
                          <strong>Tips Manajerial:</strong> Jangan biarkan pekerjaan menumpuk (<em>bottleneck</em>) di bagian cetak atau finishing. Jika tumpukan terlalu tinggi, efisiensi workflow Anda akan turun.
                      </div>
                  </div>
              </div>
           </div>
        )}

        {/* --- QC LAB TAB --- */}
        {activeTab === 'qc-lab' && (
            <div className="animate-fade-in space-y-8">
               <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-4xl mx-auto">
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Quality Control Challenge</h2>
                  <p className="text-slate-500 mb-8">Temukan 3 kesalahan cetak sebelum produk dikirim! Klik pada area yang mencurigakan.</p>
                  
                  <div className="relative inline-block border-8 border-slate-800 rounded-xl shadow-2xl overflow-hidden group select-none cursor-crosshair">
                      {/* Print Proof Simulation */}
                      <div className="w-[300px] h-[400px] bg-white p-6 flex flex-col items-center justify-between relative">
                          
                          {/* 1. Header with Logo Error */}
                          <div className="w-full h-40 bg-orange-50 rounded-lg border-2 border-orange-100 flex items-center justify-center relative">
                              <div className="text-orange-300 font-bold text-4xl blur-[2px]">LOGO</div>
                              {/* Error Hitbox 1 */}
                              <div 
                                onClick={() => handleQCClick(1)}
                                className={`absolute top-2 right-2 w-10 h-10 rounded-full border-2 transition-all 
                                ${foundQCErrors.includes(1) ? 'border-green-500 bg-green-500/20' : 'border-transparent hover:bg-red-500/10'}`}
                              >
                                 {foundQCErrors.includes(1) && <CheckCircle2 className="text-green-600 w-full h-full p-1"/>}
                              </div>
                          </div>

                          {/* 2. Text Content with Typo */}
                          <div className="w-full space-y-3">
                              <div className="h-4 bg-slate-100 w-3/4 rounded"></div>
                              <div className="h-6 bg-slate-50 w-full rounded flex items-center px-2 relative">
                                  <span className="text-xs text-slate-400 font-mono">Laporan Pruduksi Tahunan</span>
                                  {/* Error Hitbox 2 */}
                                  <div 
                                    onClick={() => handleQCClick(2)}
                                    className={`absolute inset-0 rounded transition-all 
                                    ${foundQCErrors.includes(2) ? 'border-2 border-green-500 bg-green-500/10' : 'hover:bg-red-500/10'}`}
                                  ></div>
                              </div>
                              <div className="h-4 bg-slate-100 w-full rounded"></div>
                          </div>

                          {/* 3. Footer with Cut Error */}
                          <div className="w-full border-t-2 border-dashed border-slate-200 pt-4 flex justify-center relative">
                              <div className="w-full h-2 bg-slate-100"></div>
                               {/* Error Hitbox 3 */}
                              <div 
                                onClick={() => handleQCClick(3)}
                                className={`absolute -bottom-4 left-0 right-0 h-12 transition-all flex items-center justify-center
                                ${foundQCErrors.includes(3) ? 'bg-green-500/20' : 'hover:bg-red-500/10'}`}
                              >
                                  {foundQCErrors.includes(3) ? (
                                     <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded font-bold">Miring 3mm</span>
                                  ) : (
                                     <div className="w-full h-0.5 bg-red-400 rotate-2 opacity-0 group-hover:opacity-50"></div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 1, label: 'Resolusi Logo', hint: 'Blur/Pixelated' },
                        { id: 2, label: 'Kesalahan Typo', hint: 'Pruduksi vs Produksi' },
                        { id: 3, label: 'Presisi Potong', hint: 'Miring / Tidak Siku' }
                      ].map((err) => (
                          <div 
                            key={err.id}
                            className={`p-4 rounded-xl border transition-all ${foundQCErrors.includes(err.id) ? 'bg-green-50 border-green-200 text-green-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                          >
                             <div className="flex items-center justify-center gap-2 mb-1">
                                {foundQCErrors.includes(err.id) ? <CheckCircle2 size={16} /> : <Search size={16} />}
                                <span className="font-bold text-sm">{err.label}</span>
                             </div>
                             <span className="text-xs">{foundQCErrors.includes(err.id) ? 'DITEMUKAN!' : 'Belum Ditemukan'}</span>
                          </div>
                      ))}
                  </div>
               </div>
            </div>
        )}

        {/* --- FINANCE TAB --- */}
        {activeTab === 'finance' && (
             <div className="animate-fade-in space-y-8">
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Analisa Keuangan Proyek</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-6 tracking-wider">Parameter Biaya</label>
                                
                                <div className="space-y-6">
                                    {/* Slider 1 */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600">Biaya Bahan (Kertas, Tinta)</span>
                                            <span className="font-bold text-slate-900">{formatIDR(finance.bahan)}</span>
                                        </div>
                                        <input 
                                          type="range" min="500000" max="2000000" step="50000" 
                                          value={finance.bahan}
                                          onChange={(e) => setFinance({...finance, bahan: parseInt(e.target.value)})}
                                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                    </div>

                                    {/* Slider 2 */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600">Biaya Operasional</span>
                                            <span className="font-bold text-slate-900">{formatIDR(finance.ops)}</span>
                                        </div>
                                        <input 
                                          type="range" min="100000" max="1000000" step="50000" 
                                          value={finance.ops}
                                          onChange={(e) => setFinance({...finance, ops: parseInt(e.target.value)})}
                                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-200/50">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600 font-bold">Target Harga Jual</span>
                                            <span className="font-bold text-brand-600">{formatIDR(finance.jual)}</span>
                                        </div>
                                        <input 
                                          type="range" min="1000000" max="5000000" step="100000" 
                                          value={finance.jual}
                                          onChange={(e) => setFinance({...finance, jual: parseInt(e.target.value)})}
                                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 text-white p-5 rounded-2xl">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Modal</span>
                                    <div className="text-xl font-bold mt-1">{formatIDR(finance.bahan + finance.ops)}</div>
                                </div>
                                <div className={`p-5 rounded-2xl border ${finance.jual - (finance.bahan + finance.ops) > 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Proyeksi Laba</span>
                                    <div className="text-xl font-bold mt-1">{formatIDR(finance.jual - (finance.bahan + finance.ops))}</div>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm h-80 flex items-center justify-center">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};

// Helper Icon for Info Box
const InfoIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

export default ManajemenProduksiGrafika;