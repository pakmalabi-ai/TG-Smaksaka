import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { 
  Layers, 
  Shield, 
  Info, 
  Rotate3D, 
  Palette, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Printer, 
  ChevronRight, 
  RefreshCcw, 
  FileText,
  Download,
  Send,
  User,
  Users,
  ClipboardList,
  PenTool,
  CheckSquare
} from 'lucide-react';

const DesainSiapCetak: React.FC = () => {
  // --- 3D Simulator State ---
  const [foldProgress, setFoldProgress] = useState(0);
  const [rotationY, setRotationY] = useState(45);
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [bleedError, setBleedError] = useState(false);
  const [faceTexts, setFaceTexts] = useState({
    front: 'DEPAN',
    back: 'BELAKANG',
    left: 'KIRI',
    right: 'KANAN',
    top: 'ATAS',
    bottom: 'BAWAH'
  });

  // --- Checklist State ---
  const checklistItems = [
    "Mode CMYK (Bukan RGB)",
    "Resolusi Gambar 300 DPI",
    "Area Bleed minimal 3mm",
    "Teks Sudah di-Outline",
    "Format PDF/X-1a"
  ];
  const [checklist, setChecklist] = useState<boolean[]>(new Array(checklistItems.length).fill(false));

  // --- LKPD State ---
  const [activeLkpdTab, setActiveLkpdTab] = useState(1);
  const [lkpdData, setLkpdData] = useState({
    nama1: '',
    nama2: '',
    kelas: '',
    // LKPD 1
    lkpd1_observasi: '',
    lkpd1_dimensi: '',
    // LKPD 2
    lkpd2_software: '',
    lkpd2_layer: false,
    lkpd2_presisi: false,
    // LKPD 3
    lkpd3_cmyk: false,
    lkpd3_elemen: false,
    lkpd3_orientasi: false,
    lkpd3_konsep: '',
    // LKPD 4
    lkpd4_bleed: false,
    lkpd4_safe: false,
    lkpd4_outline: false,
    lkpd4_evaluasi: ''
  });

  // --- Chart Logic (Gamut Comparison) ---
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Vibrancy', 'Color Depth', 'Neon Range'],
          datasets: [
            {
              label: 'RGB (Monitor)',
              data: [100, 95, 100],
              backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 2,
              borderRadius: 6
            },
            {
              label: 'CMYK (Cetak)',
              data: [75, 80, 15], // CMYK has low neon range
              backgroundColor: 'rgba(6, 182, 212, 0.6)', // Cyan
              borderColor: 'rgb(6, 182, 212)',
              borderWidth: 2,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }
          },
          scales: {
            y: { beginAtZero: true, max: 110, display: false },
            x: { grid: { display: false } }
          }
        }
      });
    }
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  const updateGamut = (mode: 'rgb' | 'cmyk') => {
    if (chartInstance.current) {
      const ds = chartInstance.current.data.datasets;
      if (mode === 'rgb') {
        ds[0].backgroundColor = 'rgba(239, 68, 68, 0.9)'; // Highlight RGB
        ds[1].backgroundColor = 'rgba(203, 213, 225, 0.3)'; // Dim CMYK
      } else {
        ds[1].backgroundColor = 'rgba(6, 182, 212, 0.9)'; // Highlight CMYK
        ds[0].backgroundColor = 'rgba(203, 213, 225, 0.3)'; // Dim RGB
      }
      chartInstance.current.update();
    }
  };

  // --- Handlers ---
  const handleEditPanel = (key: keyof typeof faceTexts) => {
    const newText = prompt(`Masukkan teks untuk bagian ${(key as string).toUpperCase()}:`, faceTexts[key]);
    if (newText !== null) {
      setFaceTexts(prev => ({ ...prev, [key]: newText.toUpperCase() }));
    }
  };

  const handleCheck = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
  };

  const resetSimulator = () => {
    setFoldProgress(0);
    setRotationY(45);
    setBoxColor('#ffffff');
    setBleedError(false);
  };

  const handleLkpdChange = (key: string, value: any) => {
    setLkpdData(prev => ({ ...prev, [key]: value }));
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan LKPD - ${lkpdData.nama1}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; color: #4c1d95; text-transform: uppercase; }
          .header p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
          .info { margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info div strong { color: #475569; display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
          .lkpd-section { margin-bottom: 40px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; page-break-inside: avoid; }
          .lkpd-header { background: #f1f5f9; padding: 15px 20px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #334155; display: flex; justify-content: space-between; align-items: center; }
          .lkpd-tag { font-size: 10px; background: #fff; padding: 2px 8px; border-radius: 10px; border: 1px solid #cbd5e1; text-transform: uppercase; }
          .lkpd-content { padding: 25px; }
          .checkbox-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 14px; }
          .checkbox-box { width: 18px; height: 18px; border: 2px solid #64748b; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #7c3aed; }
          .checkbox-box.checked { border-color: #7c3aed; background: #f5f3ff; }
          .label { font-weight: 600; display: block; margin-bottom: 8px; margin-top: 20px; font-size: 14px; color: #334155; }
          .label:first-child { margin-top: 0; }
          .value { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 40px; white-space: pre-wrap; font-size: 14px; }
          .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; pt: 20px; }
          @media print {
             body { padding: 0; }
             .lkpd-section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Lembar Kerja Peserta Didik (LKPD)</h1>
          <p>Mata Pelajaran: Teknik Grafika | Topik: Desain Kemasan Siap Cetak (Packaging) | Fase F</p>
        </div>

        <div class="info">
          <div><strong>Nama Siswa 1</strong>${lkpdData.nama1 || '-'}</div>
          <div><strong>Nama Siswa 2</strong>${lkpdData.nama2 || '-'}</div>
          <div style="grid-column: span 2"><strong>Kelas</strong>${lkpdData.kelas || '-'}</div>
        </div>

        <!-- LKPD 1 -->
        <div class="lkpd-section">
          <div class="lkpd-header">
             <span>Kegiatan 1: Eksplorasi & Sketsa Manual</span>
             <span class="lkpd-tag">Pertemuan 1</span>
          </div>
          <div class="lkpd-content">
            <div class="label">Hasil Observasi (Pola Lipatan, Jenis Kertas, Cut/Fold Lines):</div>
            <div class="value">${lkpdData.lkpd1_observasi || '-'}</div>
            <div class="label">Ukuran Dieline Manual (P x L x T):</div>
            <div class="value">${lkpdData.lkpd1_dimensi || '-'}</div>
          </div>
        </div>

        <!-- LKPD 2 -->
        <div class="lkpd-section">
          <div class="lkpd-header">
             <span>Kegiatan 2: Digitalisasi Dieline</span>
             <span class="lkpd-tag">Pertemuan 2</span>
          </div>
          <div class="lkpd-content">
            <div class="label">Software Desain yang Digunakan:</div>
            <div class="value">${lkpdData.lkpd2_software || '-'}</div>
            <div class="label">Checklist Digitalisasi:</div>
            <div class="checkbox-item">
              <span class="checkbox-box ${lkpdData.lkpd2_layer ? 'checked' : ''}">${lkpdData.lkpd2_layer ? '✓' : ''}</span> 
              Layer khusus untuk Cut Line (Solid) & Fold Line (Putus-putus) dipisah
            </div>
            <div class="checkbox-item">
              <span class="checkbox-box ${lkpdData.lkpd2_presisi ? 'checked' : ''}">${lkpdData.lkpd2_presisi ? '✓' : ''}</span> 
              Ukuran di software sudah presisi sesuai sketsa
            </div>
          </div>
        </div>

        <!-- LKPD 3 -->
        <div class="lkpd-section">
          <div class="lkpd-header">
             <span>Kegiatan 3: Layouting & Desain</span>
             <span class="lkpd-tag">Pertemuan 3</span>
          </div>
          <div class="lkpd-content">
             <div class="label">Konsep / Filosofi Desain:</div>
             <div class="value">${lkpdData.lkpd3_konsep || '-'}</div>
             <div class="label">Kelengkapan Elemen:</div>
             <div class="checkbox-item"><span class="checkbox-box ${lkpdData.lkpd3_cmyk ? 'checked' : ''}">${lkpdData.lkpd3_cmyk ? '✓' : ''}</span> Mode Warna CMYK</div>
             <div class="checkbox-item"><span class="checkbox-box ${lkpdData.lkpd3_elemen ? 'checked' : ''}">${lkpdData.lkpd3_elemen ? '✓' : ''}</span> Ada Logo, Barcode, Halal, & Exp Date</div>
             <div class="checkbox-item"><span class="checkbox-box ${lkpdData.lkpd3_orientasi ? 'checked' : ''}">${lkpdData.lkpd3_orientasi ? '✓' : ''}</span> Posisi Orientasi Tidak Terbalik</div>
          </div>
        </div>

        <!-- LKPD 4 -->
        <div class="lkpd-section">
          <div class="lkpd-header">
             <span>Kegiatan 4: Finalizing & Dummy</span>
             <span class="lkpd-tag">Pertemuan 4</span>
          </div>
          <div class="lkpd-content">
             <div class="label">Catatan Evaluasi Dummy 3D:</div>
             <div class="value">${lkpdData.lkpd4_evaluasi || '-'}</div>
             <div class="label">Pre-Flight Check:</div>
             <div class="checkbox-item"><span class="checkbox-box ${lkpdData.lkpd4_bleed ? 'checked' : ''}">${lkpdData.lkpd4_bleed ? '✓' : ''}</span> Bleed minimal 3mm ditambahkan</div>
             <div class="checkbox-item"><span class="checkbox-box ${lkpdData.lkpd4_safe ? 'checked' : ''}">${lkpdData.lkpd4_safe ? '✓' : ''}</span> Teks di dalam Safety Zone</div>
             <div class="checkbox-item"><span class="checkbox-box ${lkpdData.lkpd4_outline ? 'checked' : ''}">${lkpdData.lkpd4_outline ? '✓' : ''}</span> Semua Font sudah di-Outline/Curve</div>
          </div>
        </div>

        <div class="footer">
          Dicetak dari Portal Pembelajaran Teknik Grafika SMKN 1 Kaligondang pada ${new Date().toLocaleDateString('id-ID')}
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const openGoogleForm = () => {
    window.open('https://forms.gle/28bjKWABoBSkrzZM8', '_blank');
  };

  const progressPct = Math.round((checklist.filter(Boolean).length / checklist.length) * 100);

  // --- Styles for 3D Cube ---
  const progress = foldProgress / 100;
  const angle = 90 * progress;
  const offset = 75 * progress;
  const faceOpacity = 0.85 + (progress * 0.15);
  
  const faceStyle = (transform: string) => ({
    transform,
    backgroundColor: boxColor,
    opacity: faceOpacity,
    borderColor: bleedError ? '#ef4444' : '#94a3b8',
    borderWidth: bleedError ? '1px' : '1px',
    boxShadow: bleedError ? 'inset 0 0 0 4px white' : 'none' 
  });

  return (
    <div className="relative">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-visible { backface-visibility: visible; }
      `}</style>

      {/* Hero Header */}
      <div className="pt-12 pb-8 px-6 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-100">
           <Layers size={12} />
           <span>Modul Ajar Fase F</span>
         </div>
         <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4">
           Desain Siap Cetak
         </h1>
         <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
           Ubah desain 2D menjadi kemasan 3D yang sempurna. Pahami teori dasar sebelum memulai simulasi.
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-24 pb-20">

        {/* SECTION 1: Fundamentals */}
        <section id="fundamentals">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900">1. Konsep Dasar Kemasan</h2>
            <p className="mt-3 text-slate-600">Sebelum mendesain, pahami fungsi vital dan jenis kemasan agar desain tepat sasaran.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Shield size={24} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Proteksi (Protection)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Fungsi paling mendasar. Kemasan harus melindungi produk dari benturan fisik, kelembaban, cahaya, dan kontaminasi selama distribusi.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Package size={24} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Promosi (Promotion)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">"The Silent Salesman". Desain visual harus mampu menarik perhatian konsumen di rak toko dalam waktu kurang dari 3 detik.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Info size={24} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Informasi (Information)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Wajib memuat data krusial: Komposisi, Legalitas (BPOM/Halal), Instruksi penggunaan, dan Barcode untuk inventaris.</p>
             </div>
          </div>

          {/* Packaging Layers Visual */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-16">
              <h3 className="font-display font-bold text-lg mb-8 text-center text-slate-700">Tingkatan Kemasan (Packaging Layers)</h3>
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                  {/* Layer 1 */}
                  <div className="flex-1 w-full text-center p-5 bg-white rounded-2xl shadow-sm opacity-60 scale-95 border border-slate-200">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Layer 1</span>
                      <span className="font-bold text-slate-800 block mb-1">Kemasan Primer</span>
                      <p className="text-xs text-slate-500">Wadah yang bersentuhan langsung dengan produk (Botol, Tube, Plastik sachet).</p>
                  </div>
                  
                  <div className="text-slate-300 hidden md:block"><ChevronRight /></div>
                  
                  {/* Layer 2 (Highlighted) */}
                  <div className="flex-1 w-full text-center p-6 bg-white rounded-2xl shadow-lg shadow-brand-100 border-2 border-brand-600 transform md:scale-105 z-10 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">FOKUS MODUL INI</div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-600 mb-2">Layer 2</span>
                      <span className="font-display font-bold text-slate-900 text-lg block mb-1">Kemasan Sekunder</span>
                      <p className="text-xs text-slate-600">Pelindung kemasan primer. Biasanya berupa <strong>Folding Box</strong> (kotak lipat) yang kita desain sekarang.</p>
                  </div>

                  <div className="text-slate-300 hidden md:block"><ChevronRight /></div>

                  {/* Layer 3 */}
                  <div className="flex-1 w-full text-center p-5 bg-white rounded-2xl shadow-sm opacity-60 scale-95 border border-slate-200">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Layer 3</span>
                      <span className="font-bold text-slate-800 block mb-1">Kemasan Tersier</span>
                      <p className="text-xs text-slate-500">Kemasan untuk pengiriman massal. Contoh: Kardus besar (Corrugated Box), Palet kayu.</p>
                  </div>
              </div>
          </div>

          {/* Color Fundamentals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-slate-200 pt-16">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-slate-900">
                    <span className="w-1.5 h-6 bg-brand-500 rounded-full"></span>
                    Perbandingan Gamut Warna
                </h3>
                <div className="h-[300px] w-full">
                    <canvas ref={chartRef}></canvas>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                    <button onClick={() => updateGamut('rgb')} className="px-4 py-2 text-xs font-bold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition">LIHAT RGB</button>
                    <button onClick={() => updateGamut('cmyk')} className="px-4 py-2 text-xs font-bold rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition">LIHAT CMYK</button>
                </div>
             </div>

             <div className="space-y-6">
                 <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">2. Fundamental Warna</h2>
                    <p className="text-slate-600 leading-relaxed">Perbedaan antara cahaya (monitor) dan tinta (cetak) sangat krusial dalam desain packaging agar hasil cetak sesuai harapan.</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-5 bg-white rounded-xl border border-red-100 hover:shadow-md transition group">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-red-500">RGB (Red, Green, Blue)</h4>
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">Layar HP/Monitor</span>
                        </div>
                        <p className="text-xs text-slate-500 italic mb-2">"Additive Color Model"</p>
                        <p className="text-sm text-slate-700 leading-relaxed">Warna berbasis cahaya. Jika semua warna digabung menjadi Putih. Memiliki gamut (jangkauan warna) yang luas, termasuk warna neon terang.</p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-cyan-100 shadow-md ring-1 ring-cyan-50 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-cyan-600">CMYK (Cyan, Magenta, Yellow, Black)</h4>
                                <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-1 rounded font-bold">Wajib Cetak</span>
                            </div>
                            <p className="text-xs text-slate-500 italic mb-2">"Subtractive Color Model"</p>
                            <p className="text-sm text-slate-700 leading-relaxed">Warna berbasis pigmen tinta. Jika semua digabung menjadi Gelap/Hitam. Gamut lebih sempit; warna neon RGB akan menjadi redup saat dicetak.</p>
                        </div>
                    </div>
                 </div>

                 <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r text-sm text-amber-900 flex gap-3">
                    <AlertTriangle className="shrink-0 text-amber-500" size={20} />
                    <p><strong>Peringatan:</strong> Jangan pernah mendesain packaging dalam mode RGB. Convert file Anda ke CMYK sejak awal di Illustrator/CorelDraw.</p>
                 </div>
             </div>
          </div>
        </section>

        {/* SECTION 2: Simulator 3D */}
        <section id="simulator" className="pt-16 border-t border-slate-200">
           <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">3. 3D Packaging Simulator</h2>
                  <p className="mt-2 text-slate-600">Simulasikan proses pelipatan pola menjadi kotak dan uji akurasi desain Anda.</p>
              </div>
              <button onClick={resetSimulator} className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition flex items-center gap-2">
                 <RefreshCcw size={16} /> Reset
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: 3D Scene */}
              <div className="space-y-6">
                 <div className="h-[400px] w-full bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden perspective-1000 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                    
                    {/* The Cube */}
                    <div 
                      className="relative w-[150px] h-[150px] transform-style-3d transition-transform duration-500 ease-out"
                      style={{ transform: `rotateX(-20deg) rotateY(${rotationY}deg)` }}
                    >
                       {/* Front */}
                       <div className="absolute w-[150px] h-[150px] flex items-center justify-center font-bold text-xs text-slate-600 backface-visible border border-slate-400 transition-all duration-700"
                            style={faceStyle(`translateZ(${75 + (offset - 75)}px)`)}>
                            {faceTexts.front}
                       </div>
                       {/* Back */}
                       <div className="absolute w-[150px] h-[150px] flex items-center justify-center font-bold text-xs text-slate-600 backface-visible border border-slate-400 transition-all duration-700"
                            style={faceStyle(`rotateY(180deg) translateZ(${75 + (offset - 75)}px) rotateY(${(1-progress)*180}deg)`)}>
                            {faceTexts.back}
                       </div>
                       {/* Right */}
                       <div className="absolute w-[150px] h-[150px] flex items-center justify-center font-bold text-xs text-slate-600 backface-visible border border-slate-400 transition-all duration-700"
                            style={faceStyle(`rotateY(${angle}deg) translateZ(75px)`)}>
                            {faceTexts.right}
                       </div>
                       {/* Left */}
                       <div className="absolute w-[150px] h-[150px] flex items-center justify-center font-bold text-xs text-slate-600 backface-visible border border-slate-400 transition-all duration-700"
                            style={faceStyle(`rotateY(-${angle}deg) translateZ(75px)`)}>
                            {faceTexts.left}
                       </div>
                       {/* Top */}
                       <div className="absolute w-[150px] h-[150px] flex items-center justify-center font-bold text-xs text-slate-600 backface-visible border border-slate-400 transition-all duration-700"
                            style={faceStyle(`rotateX(${angle}deg) translateZ(75px)`)}>
                            {faceTexts.top}
                       </div>
                       {/* Bottom */}
                       <div className="absolute w-[150px] h-[150px] flex items-center justify-center font-bold text-xs text-slate-600 backface-visible border border-slate-400 transition-all duration-700"
                            style={faceStyle(`rotateX(-${angle}deg) translateZ(75px)`)}>
                            {faceTexts.bottom}
                       </div>
                    </div>
                 </div>

                 {/* Controls */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                           <span className="flex items-center gap-2"><Rotate3D size={16}/> Proses Pelipatan (Folding)</span>
                           <span className="text-brand-600">{foldProgress}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={foldProgress} 
                          onChange={(e) => setFoldProgress(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Rotasi Kamera</label>
                          <input 
                            type="range" min="0" max="360" value={rotationY}
                            onChange={(e) => setRotationY(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-400"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Warna Kemasan</label>
                          <div className="flex gap-2">
                             {[
                               { c: '#ffffff', n: 'Putih' }, 
                               { c: '#fef08a', n: 'Kuning' }, 
                               { c: '#99f6e4', n: 'Cyan' }, 
                               { c: '#e2e8f0', n: 'Abu' }
                             ].map((opt) => (
                                <button 
                                  key={opt.c}
                                  onClick={() => setBoxColor(opt.c)}
                                  className={`w-6 h-6 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 ${boxColor === opt.c ? 'ring-2 ring-brand-500 ring-offset-2' : ''}`}
                                  style={{ backgroundColor: opt.c }}
                                  title={opt.n}
                                />
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right: Dieline Editor */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                 <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Editor Pola (2D Dieline)</h3>
                 <p className="text-sm text-slate-500 mb-6">Klik pada panel untuk mengubah teks desain di simulasi 3D.</p>

                 <div className="flex-grow flex items-center justify-center mb-6">
                    <div className="grid grid-cols-3 gap-1 w-full max-w-[300px]">
                       {/* Top Row */}
                       <div className="col-start-2 h-20 bg-slate-100 border-b-2 border-dashed border-slate-300 rounded-t-lg flex items-center justify-center cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition text-[10px] font-bold text-slate-500"
                            onClick={() => handleEditPanel('top')}>
                            {faceTexts.top}
                       </div>
                       {/* Middle Row */}
                       <div className="col-start-1 h-20 bg-slate-100 border-r-2 border-dashed border-slate-300 rounded-l-lg flex items-center justify-center cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition text-[10px] font-bold text-slate-500"
                            onClick={() => handleEditPanel('left')}>
                            {faceTexts.left}
                       </div>
                       <div className="col-start-2 h-20 bg-slate-100 border-y-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition text-[10px] font-bold text-slate-500"
                            onClick={() => handleEditPanel('front')}>
                            {faceTexts.front}
                       </div>
                       <div className="col-start-3 h-20 bg-slate-100 border-l-2 border-dashed border-slate-300 rounded-r-lg flex items-center justify-center cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition text-[10px] font-bold text-slate-500"
                            onClick={() => handleEditPanel('right')}>
                            {faceTexts.right}
                       </div>
                       {/* Bottom Rows */}
                       <div className="col-start-2 h-20 bg-slate-100 border-y-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition text-[10px] font-bold text-slate-500"
                            onClick={() => handleEditPanel('bottom')}>
                            {faceTexts.bottom}
                       </div>
                       <div className="col-start-2 h-20 bg-slate-100 border-t-2 border-dashed border-slate-300 rounded-b-lg flex items-center justify-center cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition text-[10px] font-bold text-slate-500"
                            onClick={() => handleEditPanel('back')}>
                            {faceTexts.back}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r">
                        <h4 className="text-sm font-bold text-brand-800">Tips Rakit:</h4>
                        <p className="text-xs text-brand-700 mt-1">Gunakan slider 'Folding' untuk melihat bagaimana panel atas dan bawah menutup. Pastikan orientasi teks tidak terbalik!</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                           <Palette size={16} className="text-slate-500" />
                           <span className="text-sm font-medium text-slate-700">Simulasi Tanpa Bleed</span>
                        </div>
                        <button 
                          onClick={() => setBleedError(!bleedError)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${bleedError ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        >
                           {bleedError ? 'Matikan Error' : 'Aktifkan Error'}
                        </button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 3: Anatomy */}
        <section id="anatomy" className="pt-16 border-t border-slate-200">
           <div className="mb-12 text-center">
                <h2 className="text-3xl font-display font-bold text-slate-900">4. Anatomi Dieline</h2>
                <p className="text-slate-600 mt-2">Pahami setiap garis agar mesin potong bekerja dengan benar.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-2xl border-b-4 border-red-500 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
                   <div className="text-3xl mb-3">✂️</div>
                   <h4 className="font-bold text-slate-800">Cut Line</h4>
                   <p className="text-xs text-slate-500 mt-2 leading-relaxed">Garis solid (—). Batas akhir potongan kemasan oleh pisau pon.</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border-b-4 border-blue-500 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
                   <div className="text-3xl mb-3">📏</div>
                   <h4 className="font-bold text-slate-800">Fold Line</h4>
                   <p className="text-xs text-slate-500 mt-2 leading-relaxed">Garis putus (----). Area lipatan atau creasing (garis tumpul).</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border-b-4 border-green-500 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
                   <div className="text-3xl mb-3">🎨</div>
                   <h4 className="font-bold text-slate-800">Area Bleed</h4>
                   <p className="text-xs text-slate-500 mt-2 leading-relaxed">Luberan warna 3mm di luar garis potong untuk menghindari sisa putih.</p>
               </div>
               <div className="bg-slate-800 p-6 rounded-2xl border-b-4 border-yellow-400 shadow-lg text-white">
                   <div className="text-3xl mb-3">💡</div>
                   <h4 className="font-bold">Pro Tip</h4>
                   <p className="text-xs text-slate-400 mt-2 leading-relaxed">Jauhkan teks penting minimal 5mm dari garis potong (Safety Zone).</p>
               </div>
           </div>
        </section>

        {/* SECTION 4: Timeline & Checklist */}
        <section id="timeline" className="pt-16 border-t border-slate-200">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* Timeline */}
               <div className="lg:col-span-2">
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">5. Alur Kegiatan Proyek</h2>
                  <div className="space-y-8 pl-4 border-l-2 border-slate-100">
                      {[
                        { step: 1, title: "Observasi & Sketsa Manual", desc: "Siswa membongkar kemasan nyata dan menggambar pola jaring-jaring di kertas karton." },
                        { step: 2, title: "Digitalisasi Dieline", desc: "Memindahkan ukuran presisi ke software vektor dengan layer terpisah." },
                        { step: 3, title: "Desain Visual & Pre-press", desc: "Menerapkan elemen desain (brand, logo, nutrisi) dengan standar CMYK." },
                        { step: 4, title: "Produksi Dummy 3D", desc: "Mencetak desain, memotong sesuai pola, dan merakitnya menjadi produk jadi." }
                      ].map((item) => (
                        <div key={item.step} className="relative group">
                           <div className="absolute -left-[41px] top-0 w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 font-bold flex items-center justify-center group-hover:border-brand-500 group-hover:text-brand-600 transition-colors">
                              {item.step}
                           </div>
                           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                              <h4 className="font-bold text-slate-800">{item.title}</h4>
                              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                  </div>
               </div>

               {/* Checklist */}
               <div className="lg:col-span-1">
                   <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[80px] rounded-full pointer-events-none"></div>
                       <h3 className="text-xl font-bold mb-6 relative z-10">Pre-Flight Checklist</h3>
                       
                       <div className="space-y-4 relative z-10">
                           {checklistItems.map((item, index) => (
                               <label key={index} className="flex items-center gap-3 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checklist[index] ? 'bg-brand-500 border-brand-500' : 'border-slate-500'}`}>
                                      {checklist[index] && <CheckCircle2 size={12} />}
                                  </div>
                                  <input 
                                    type="checkbox" 
                                    checked={checklist[index]} 
                                    onChange={() => handleCheck(index)} 
                                    className="hidden" 
                                  />
                                  <span className={`text-sm transition-colors ${checklist[index] ? 'text-white' : 'text-slate-400 group-hover:text-brand-200'}`}>
                                      {item}
                                  </span>
                               </label>
                           ))}
                       </div>

                       <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                           <div className="flex justify-between text-xs font-bold uppercase mb-2 text-slate-400">
                               <span>Status File</span>
                               <span className={progressPct === 100 ? 'text-brand-400' : ''}>{progressPct}%</span>
                           </div>
                           <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-brand-500 transition-all duration-500 ease-out" 
                                 style={{ width: `${progressPct}%` }}
                               ></div>
                           </div>
                           
                           <button 
                             disabled={progressPct < 100}
                             className={`mt-6 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                               progressPct === 100 
                               ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                               : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                             }`}
                           >
                               <Printer size={16} />
                               {progressPct === 100 ? "CETAK SEKARANG" : "Lengkapi Data"}
                           </button>
                       </div>
                   </div>
               </div>
           </div>
        </section>

        {/* SECTION 5: LKPD DIGITAL */}
        <section id="lkpd-digital" className="pt-16 border-t border-slate-200">
          <div className="flex flex-col items-center text-center mb-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider mb-3">
               <FileText size={12} />
               <span>Lembar Kerja Peserta Didik</span>
             </div>
             <h2 className="text-3xl font-display font-bold text-slate-900">LKPD Digital</h2>
             <p className="text-slate-600 mt-2 max-w-lg">Isi laporan praktikum sesuai pertemuan, lalu simpan sebagai PDF atau kirim langsung ke Guru.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
             
             {/* Header Form */}
             <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><User size={14}/> Nama Siswa 1</label>
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap"
                      value={lkpdData.nama1}
                      onChange={(e) => handleLkpdChange('nama1', e.target.value)}
                      className="w-full border-slate-200 border rounded-lg px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><User size={14}/> Nama Siswa 2</label>
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap"
                      value={lkpdData.nama2}
                      onChange={(e) => handleLkpdChange('nama2', e.target.value)}
                      className="w-full border-slate-200 border rounded-lg px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Users size={14}/> Kelas</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: XI Grafika A"
                      value={lkpdData.kelas}
                      onChange={(e) => handleLkpdChange('kelas', e.target.value)}
                      className="w-full border-slate-200 border rounded-lg px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                 </div>
             </div>

             {/* Tab Navigation */}
             <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-hide">
                {[1, 2, 3, 4].map((num) => (
                   <button 
                     key={num}
                     onClick={() => setActiveLkpdTab(num)}
                     className={`flex-1 min-w-[120px] py-4 text-sm font-bold border-b-2 transition-all ${
                       activeLkpdTab === num 
                       ? 'border-brand-600 text-brand-700 bg-brand-50/50' 
                       : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                     }`}
                   >
                     LKPD {num}
                   </button>
                ))}
             </div>

             {/* Tab Content */}
             <div className="p-8">
                 {activeLkpdTab === 1 && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
                          <h4 className="font-bold text-blue-800 text-sm mb-1">Tugas: Eksplorasi & Sketsa Manual</h4>
                          <p className="text-xs text-blue-600">Amati kemasan produk asli, bongkar, dan pelajari pola lipatannya. Buat sketsa dieline manual di kertas karton.</p>
                       </div>
                       
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Hasil Observasi Kemasan</label>
                          <p className="text-xs text-slate-400 mb-2">Jelaskan jenis kertas, jenis lipatan (tuck end/glue end), dan temuan garis potong/lipat.</p>
                          <textarea 
                             rows={4}
                             value={lkpdData.lkpd1_observasi}
                             onChange={(e) => handleLkpdChange('lkpd1_observasi', e.target.value)}
                             className="w-full border-slate-200 border rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                             placeholder="Contoh: Menggunakan kertas Ivory 230gsm. Jenis lipatan Straight Tuck End. Ada flap pengunci di bagian atas..."
                          ></textarea>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Ukuran Dieline Manual (P x L x T)</label>
                          <input 
                             type="text"
                             value={lkpdData.lkpd1_dimensi}
                             onChange={(e) => handleLkpdChange('lkpd1_dimensi', e.target.value)}
                             className="w-full border-slate-200 border rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                             placeholder="Contoh: 10cm x 5cm x 15cm"
                          />
                       </div>
                    </div>
                 )}

                 {activeLkpdTab === 2 && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl mb-6">
                          <h4 className="font-bold text-purple-800 text-sm mb-1">Tugas: Digitalisasi Dieline</h4>
                          <p className="text-xs text-purple-600">Pindahkan ukuran dari sketsa manual ke dalam software desain dengan presisi.</p>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><PenTool size={16}/> Software Desain</label>
                          <input 
                             type="text"
                             value={lkpdData.lkpd2_software}
                             onChange={(e) => handleLkpdChange('lkpd2_software', e.target.value)}
                             className="w-full border-slate-200 border rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                             placeholder="Contoh: Adobe Illustrator CC 2024 / CorelDraw 2022"
                          />
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><CheckSquare size={16}/> Checklist Digitalisasi</label>
                          <div className="space-y-3">
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd2_layer}
                                  onChange={(e) => handleLkpdChange('lkpd2_layer', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Saya sudah memisahkan Layer Cut Line (Solid) dan Fold Line (Putus-putus)</span>
                             </label>
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd2_presisi}
                                  onChange={(e) => handleLkpdChange('lkpd2_presisi', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Ukuran digital sudah presisi sesuai tugas (Contoh: 10x5x15 cm)</span>
                             </label>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeLkpdTab === 3 && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="p-4 bg-pink-50 border border-pink-100 rounded-xl mb-6">
                          <h4 className="font-bold text-pink-800 text-sm mb-1">Tugas: Layouting & Desain</h4>
                          <p className="text-xs text-pink-600">Terapkan elemen visual pada pola kemasan dengan mode warna CMYK.</p>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Konsep / Filosofi Desain</label>
                          <textarea 
                             rows={3}
                             value={lkpdData.lkpd3_konsep}
                             onChange={(e) => handleLkpdChange('lkpd3_konsep', e.target.value)}
                             className="w-full border-slate-200 border rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                             placeholder="Jelaskan pemilihan warna dan gaya desain yang digunakan..."
                          ></textarea>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><ClipboardList size={16}/> Kelengkapan Elemen</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd3_cmyk}
                                  onChange={(e) => handleLkpdChange('lkpd3_cmyk', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Mode Warna CMYK</span>
                             </label>
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd3_elemen}
                                  onChange={(e) => handleLkpdChange('lkpd3_elemen', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Ada Logo, Barcode, Halal, Exp</span>
                             </label>
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd3_orientasi}
                                  onChange={(e) => handleLkpdChange('lkpd3_orientasi', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Posisi Desain Tidak Terbalik</span>
                             </label>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeLkpdTab === 4 && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl mb-6">
                          <h4 className="font-bold text-teal-800 text-sm mb-1">Tugas: Finalizing & Dummy</h4>
                          <p className="text-xs text-teal-600">Siapkan file siap cetak dan buat contoh produk jadi (dummy).</p>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Evaluasi Dummy 3D</label>
                          <textarea 
                             rows={3}
                             value={lkpdData.lkpd4_evaluasi}
                             onChange={(e) => handleLkpdChange('lkpd4_evaluasi', e.target.value)}
                             className="w-full border-slate-200 border rounded-xl px-4 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                             placeholder="Apakah ukuran sudah pas saat dirakit? Apakah ada bagian yang lemnya kurang kuat?"
                          ></textarea>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Shield size={16}/> Pre-Flight Check</label>
                          <div className="space-y-3">
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd4_bleed}
                                  onChange={(e) => handleLkpdChange('lkpd4_bleed', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Bleed minimal 3mm sudah ditambahkan</span>
                             </label>
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd4_safe}
                                  onChange={(e) => handleLkpdChange('lkpd4_safe', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Teks berada di Safety Zone (Aman dari pisau potong)</span>
                             </label>
                             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                <input 
                                  type="checkbox" 
                                  checked={lkpdData.lkpd4_outline}
                                  onChange={(e) => handleLkpdChange('lkpd4_outline', e.target.checked)}
                                  className="w-5 h-5 accent-brand-600 rounded"
                                />
                                <span className="text-sm text-slate-600">Semua Font sudah di-Outline/Curve</span>
                             </label>
                          </div>
                       </div>
                    </div>
                 )}
             </div>

             {/* Footer Actions */}
             <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row gap-4 justify-end">
                 <button 
                   onClick={generatePDF}
                   className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-white hover:text-brand-600 hover:border-brand-300 transition-all flex items-center justify-center gap-2"
                 >
                    <Download size={18} /> Simpan ke PDF
                 </button>
                 <button 
                   onClick={openGoogleForm}
                   className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-500 shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2"
                 >
                    <Send size={18} /> Kirim LKPD ke Guru
                 </button>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DesainSiapCetak;